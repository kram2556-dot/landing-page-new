// الرمز السري لحماية واجهة الطلبات السحابية
const ADMIN_SECRET = "MY_SECURE_ADMIN_TOKEN_2026";

export async function onRequestPost(context: any) {
  try {
    const orderData = await context.request.json();
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // حفظ الطلبات متاح للجميع (الزبائن في المتجر)
    const existingRaw = await context.env.STORE_KV.get("STORE_ORDERS");
    const existingOrders = existingRaw ? JSON.parse(existingRaw) : [];
    
    const updatedOrders = [{ id: orderId, ...orderData }, ...existingOrders];
    await context.env.STORE_KV.put("STORE_ORDERS", JSON.stringify(updatedOrders.slice(0, 200)));

    return new Response(JSON.stringify({ success: true, id: orderId }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestGet(context: any) {
  // فحص الحماية: هل الطلب قادم ومعه الرمز السري؟
  const authHeader = context.request.headers.get("x-admin-token");
  if (authHeader !== ADMIN_SECRET) {
    return new Response(JSON.stringify({ error: "غير مصرح لك بالوصول" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const ordersRaw = await context.env.STORE_KV.get("STORE_ORDERS");
    const orders = ordersRaw ? JSON.parse(ordersRaw) : [];
    return new Response(JSON.stringify(orders), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify([]), {
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestDelete(context: any) {
  // فحص الحماية: منع مسح الطلبات إلا بالرمز السري
  const authHeader = context.request.headers.get("x-admin-token");
  if (authHeader !== ADMIN_SECRET) {
    return new Response(JSON.stringify({ error: "غير مصرح لك بالمسح" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    await context.env.STORE_KV.put("STORE_ORDERS", JSON.stringify([]));
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
