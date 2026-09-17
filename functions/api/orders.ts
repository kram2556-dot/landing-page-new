// functions/api/orders.ts

// دالة لتوليد ومراجعة توكن الجلسة البسيط
function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("x-admin-token");
  // يتحقق من التوكن الذي يرسله الأدمن بعد تسجيل الدخول
  return authHeader === "SESSION_ACTIVE_AUTH_TOKEN";
}

// 1. تسجيل طلب جديد من المشتري (متاح للعامة بدون أي Race Condition)
export async function onRequestPost(context: any) {
  try {
    const orderData = await context.request.json();
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const orderId = `order_${timestamp}_${randomSuffix}`;
    const kvKey = `order:${timestamp}:${randomSuffix}`;

    const completeRecord = {
      id: orderId,
      status: "new", // حالة افتراضية للطلب
      createdAt: new Date().toISOString(),
      ...orderData
    };

    // حفظ كل طلب بمفتاح فريد تماماً لمنع مسح أو تضارب أي طلبات متزامنة
    await context.env.STORE_KV.put(kvKey, JSON.stringify(completeRecord));

    return new Response(JSON.stringify({ success: true, id: orderId }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// 2. جلب كافة الطلبات (محمي للأدمن فقط مع ترتيب زمني تنازلي)
export async function onRequestGet(context: any) {
  if (!isAuthorized(context.request)) {
    return new Response(JSON.stringify({ error: "غير مصرح لك بالوصول" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // جلب قائمة كافة المفاتيح التي تبدأ بـ order:
    const list = await context.env.STORE_KV.list({ prefix: "order:" });
    const keys = list.keys || [];

    // جلب بيانات كل طلب بالتوازي
    const orders = await Promise.all(
      keys.map(async (k: any) => {
        const raw = await context.env.STORE_KV.get(k.name);
        return raw ? JSON.parse(raw) : null;
      })
    );

    // تصفية القيم وترتيبها من الأحدث إلى الأقدم
    const validOrders = orders
      .filter(Boolean)
      .sort((a: any, b: any) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());

    return new Response(JSON.stringify(validOrders), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify([]), {
      headers: { "Content-Type": "application/json" }
    });
  }
}

// 3. تحديث حالة الطلب (جديد / تم الشحن / ملغي)
export async function onRequestPatch(context: any) {
  if (!isAuthorized(context.request)) {
    return new Response(JSON.stringify({ error: "غير مصرح" }), { status: 401 });
  }

  try {
    const { id, status } = await context.request.json();
    const list = await context.env.STORE_KV.list({ prefix: "order:" });
    
    // البحث عن مفتاح الطلب وتحديث حالته
    for (const key of list.keys) {
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
    return new Response(JSON.stringify({ error: "الطلب غير موجود" }), { status: 404 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// 4. مسح كافة الطلبات (محمي للأدمن فقط)
export async function onRequestDelete(context: any) {
  if (!isAuthorized(context.request)) {
    return new Response(JSON.stringify({ error: "غير مصرح" }), { status: 401 });
  }

  try {
    const list = await context.env.STORE_KV.list({ prefix: "order:" });
    await Promise.all(list.keys.map((k: any) => context.env.STORE_KV.delete(k.name)));

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
