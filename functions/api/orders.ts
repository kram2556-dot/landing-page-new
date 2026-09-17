async function verifyAuth(context: any): Promise<boolean> {
  const token = context.request.headers.get("x-admin-token");
  if (!token) return false;
  const session = await context.env.STORE_KV.get(`session:${token}`);
  return session === "active";
}

export async function onRequestPost(context: any) {
  try {
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

    return new Response(JSON.stringify({ success: true, id: orderId }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestGet(context: any) {
  if (!(await verifyAuth(context))) {
    return new Response(JSON.stringify({ error: "غير مصرح لك بالوصول" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const list = await context.env.STORE_KV.list({ prefix: "order:" });
    const orders = await Promise.all(
      (list.keys || []).map(async (k: any) => {
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

export async function onRequestPatch(context: any) {
  if (!(await verifyAuth(context))) {
    return new Response(JSON.stringify({ error: "غير مصرح" }), { status: 401 });
  }

  try {
    const { id, status } = await context.request.json();
    const list = await context.env.STORE_KV.list({ prefix: "order:" });
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

export async function onRequestDelete(context: any) {
  if (!(await verifyAuth(context))) {
    return new Response(JSON.stringify({ error: "غير مصرح" }), { status: 401 });
  }

  try {
    const list = await context.env.STORE_KV.list({ prefix: "order:" });
    await Promise.all(list.keys.map((k: any) => context.env.STORE_KV.delete(k.name)));
    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
