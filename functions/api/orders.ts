interface Env {
  STORE_KV: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const origin = request.headers.get("Origin") || "";

  // إعداد ترويسات CORS وحصرها بالنطاق المصرح به
  const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
  };
  if (origin && (origin === url.origin || origin.endsWith(".pages.dev"))) {
    corsHeaders["Access-Control-Allow-Origin"] = origin;
  }

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // ----------------------------------------------------
  // 1. استقبال طلب شراء جديد (POST /api/orders) - متاح للعامة
  // ----------------------------------------------------
  if (request.method === "POST") {
    try {
      const orderData = (await request.json()) as Record<string, any>;

      // حماية ضد البوتات والـ Spam: مصيدة Honeypot
      // إذا ملأ البوت هذا الحقل المخفي، نرسل رد نجاح وهمي دون حفظ أي شيء في قاعدة البيانات
      if (orderData.website_hp_field && String(orderData.website_hp_field).trim() !== "") {
        return new Response(
          JSON.stringify({ success: true, message: "Order placed successfully" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // التحقق من الحقول الإجبارية
      if (!orderData.fullName || !orderData.phone || String(orderData.phone).trim().length < 8) {
        return new Response(
          JSON.stringify({ error: "يرجى كتابة الاسم ورقم الهاتف بشكل صحيح" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // تجهيز كائن الطلب مع المعرف والتاريخ
      const newOrder = {
        id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        fullName: String(orderData.fullName).trim(),
        phone: String(orderData.phone).trim(),
        altPhone: orderData.altPhone ? String(orderData.altPhone).trim() : "",
        governorate: orderData.governorate || "",
        address: orderData.address || "",
        qty: Number(orderData.qty) || 1,
        selectedSize: orderData.selectedSize || "",
        selectedColor: orderData.selectedColor || "",
        total: Number(orderData.total) || 0,
        currency: orderData.currency || "",
        notes: orderData.notes || "",
        status: "new",
        createdAt: Date.now()
      };

      // جلب مصفوفة الطلبات الحالية من KV وإضافة الطلب الجديد في البداية
      const rawOrders = await env.STORE_KV.get("STORE_ORDERS");
      const ordersList = rawOrders ? JSON.parse(rawOrders) : [];
      ordersList.unshift(newOrder);

      // حفظ في KV
      await env.STORE_KV.put("STORE_ORDERS", JSON.stringify(ordersList));

      // إرسال تنبيه CAPI إلى Meta في الخلفية إذا وُجد التوكن
      try {
        const rawStore = await env.STORE_KV.get("STORE_CONFIG");
        if (rawStore) {
          const storeConfig = JSON.parse(rawStore);
          if (storeConfig.metaPixelId && storeConfig.metaAccessToken) {
            context.waitUntil(
              fetch(`https://graph.facebook.com/v19.0/${storeConfig.metaPixelId}/events?access_token=${storeConfig.metaAccessToken}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  data: [
                    {
                      event_name: "Purchase",
                      event_time: Math.floor(Date.now() / 1000),
                      action_source: "website",
                      user_data: {
                        ph: [newOrder.phone]
                      },
                      custom_data: {
                        currency: newOrder.currency || "EGP",
                        value: newOrder.total
                      }
                    }
                  ]
                })
              }).catch(() => {})
            );
          }
        }
      } catch (_) {}

      return new Response(
        JSON.stringify({ success: true, orderId: newOrder.id }),
        { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "فشل تسجيل الطلب" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }

  // ----------------------------------------------------
  // التحقق من صلاحيات الأدمن للعمليات الإدارية التالية
  // ----------------------------------------------------
  const adminToken = request.headers.get("x-admin-token");
  if (!adminToken) {
    return new Response(
      JSON.stringify({ error: "غير مصرح لك بالوصول" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const session = await env.STORE_KV.get(`session:${adminToken}`);
  if (!session) {
    return new Response(
      JSON.stringify({ error: "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // 2. جلب قائمة الطلبات للأدمن (GET)
  if (request.method === "GET") {
    const rawOrders = await env.STORE_KV.get("STORE_ORDERS");
    const ordersList = rawOrders ? JSON.parse(rawOrders) : [];
    return new Response(JSON.stringify(ordersList), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  // 3. تحديث حالة الطلب (PATCH)
  if (request.method === "PATCH") {
    const { id, status } = (await request.json()) as { id: string; status: string };
    const rawOrders = await env.STORE_KV.get("STORE_ORDERS");
    let ordersList = rawOrders ? JSON.parse(rawOrders) : [];

    ordersList = ordersList.map((ord: any) =>
      ord.id === id ? { ...ord, status } : ord
    );

    await env.STORE_KV.put("STORE_ORDERS", JSON.stringify(ordersList));
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  // 4. مسح سجل الطلبات (DELETE)
  if (request.method === "DELETE") {
    await env.STORE_KV.delete("STORE_ORDERS");
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  return new Response("Method not allowed", { status: 405, headers: corsHeaders });
};
