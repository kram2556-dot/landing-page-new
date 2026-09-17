export async function onRequestPost(context: any) {
  try {
    const orderData = await context.request.json();
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // جلب قائمة الطلبات السابقة من السحابة KV
    const existingRaw = await context.env.STORE_KV.get("STORE_ORDERS");
    const existingOrders = existingRaw ? JSON.parse(existingRaw) : [];
    
    // إضافة الطلب الجديد في بداية القائمة
    const updatedOrders = [{ id: orderId, ...orderData }, ...existingOrders];
    
    // حفظ القائمة في السحابة KV (بحد أقصى آخر 200 طلب)
    await context.env.STORE_KV.put("STORE_ORDERS", JSON.stringify(updatedOrders.slice(0, 200)));

    return new Response(JSON.stringify({ success: true, id: orderId }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestGet(context: any) {
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
  try {
    await context.env.STORE_KV.put("STORE_ORDERS", JSON.stringify([]));
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

