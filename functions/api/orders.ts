async function verifyAuth(context: any): Promise<boolean> {
  const token = context.request.headers.get("x-admin-token");
  if (!token) return false;
  const session = await context.env.STORE_KV.get(`session:${token}`);
  return session === "active";
}

// 1. تسجيل طلب جديد مع حماية Anti-Spam و Anti-Race Condition
export async function onRequestPost(context: any) {
  try {
    const clientIP = context.request.headers.get("cf-connecting-ip") || "unknown";
    const floodKey = `flood:order:${clientIP}`;
    
    // حد أقصى طلبين كل دقيقة لكل IP
    const recent = await context.env.STORE_KV.get(floodKey);
    const count = recent ? parseInt(recent) : 0;
    if (count >= 2) {
      return new Response(JSON.stringify({ error: "مهلاً، تم استلام طلبك بالفعل. يرجى الانتظار قليلاً." }), {
        status: 429,
        headers: { "Content-Type": "application/json" }
      });
    }

    const orderData = await context.request.json();
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const orderId = `order_${timestamp}_${randomSuffix}`;
    const kvKey = `order:${timestamp}:${randomSuffix}`;

    const completeRecord = {
      id: orderId,
      status: "new",
      createdAt: new Date().toISOString(),
      ...orderData
    };

    await context.env.STORE_KV.put(kvKey, JSON.stringify(completeRecord));
    await context.env.STORE_KV.put(floodKey, (count + 1).toString(), { expirationTtl: 60 });

    return new Response(JSON.stringify({ success: true, id: orderId }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// 2. جلب كافة الطلبات مع دعم Pagination التلقائي مهما تجاوزت 1,000 طلب
export async function onRequestGet(context: any) {
  if (!(await verifyAuth(context))) {
    return new Response(JSON.stringify({ error: "غير مصرح لك بالوصول" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    let allKeys: any[] = [];
    let cursor: string | undefined = undefined;

    // حلقة تكرارية لسحب كل المفاتيح بدون التوقف عند حد الـ 1000
    do {
      const listRes: any = await context.env.STORE_KV.list({
        prefix: "order:",
        cursor: cursor
      });
      if (listRes.keys && listRes.keys.length > 0) {
        allKeys.push(...listRes.keys);
      }
      cursor = listRes.list_complete ? undefined : listRes.cursor;
    } while (cursor);

    // قراءة محتوى الطلبات
    const orders = await Promise.all(
      allKeys.map(async (k: any) => {
        const raw = await context.env.STORE_KV.get(k.name);
        return raw ? JSON.parse(raw) : null;
      })
    );

    const sorted = orders
      .filter(Boolean)
      .sort((a: any, b: any) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());

    return new Response(JSON.stringify(sorted), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } });
  }
}

// 3. تحديث حالة الطلب
export async function onRequestPatch(context: any) {
  if (!(await verifyAuth(context))) {
    return new Response(JSON.stringify({ error: "غير مصرح" }), { status: 401 });
  }

  try {
    const { id, status } = await context.request.json();
    let cursor: string | undefined = undefined;

    do {
      const listRes: any = await context.env.STORE_KV.list({
        prefix: "order:",
        cursor: cursor
      });
      for (const key of (listRes.keys || [])) {
        const raw = await context.env.STORE_KV.get(key.name);
        if (raw) {
          const item = JSON.parse(raw);
          if (item.id === id) {
            item.status = status;
            await context.env.STORE_KV.put(key.name, JSON.stringify(item));
            return new Response(JSON.stringify({ success: true }));
          }
        }
      }
      cursor = listRes.list_complete ? undefined : listRes.cursor;
    } while (cursor);

    return new Response(JSON.stringify({ error: "الطلب غير موجود" }), { status: 404 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// 4. مسح الطلبات بالكامل مع دعم مسح أكثر من 1,000 طلب
export async function onRequestDelete(context: any) {
  if (!(await verifyAuth(context))) {
    return new Response(JSON.stringify({ error: "غير مصرح" }), { status: 401 });
  }

  try {
    let cursor: string | undefined = undefined;
    do {
      const listRes: any = await context.env.STORE_KV.list({
        prefix: "order:",
        cursor: cursor
      });
      if (listRes.keys && listRes.keys.length > 0) {
        await Promise.all(listRes.keys.map((k: any) => context.env.STORE_KV.delete(k.name)));
      }
      cursor = listRes.list_complete ? undefined : listRes.cursor;
    } while (cursor);

    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
