export const onRequest: PagesFunction<{ STORE_KV: KVNamespace }> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const origin = request.headers.get("Origin") || "";

  // حماية CORS: السماح فقط بنفس النطاق أو النطاقات المصرح لها
  const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
  };
  if (origin && (origin === url.origin || origin.endsWith(".pages.dev"))) {
    corsHeaders["Access-Control-Allow-Origin"] = origin;
  }

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // 1. طلب جلب الإعدادات (GET)
  if (request.method === "GET") {
    const rawData = await env.STORE_KV.get("STORE_CONFIG");
    if (!rawData) {
      return new Response(JSON.stringify({}), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const storeData = JSON.parse(rawData);

    // التحقق هل الطالب هو الأدمن؟
    const adminToken = request.headers.get("x-admin-token");
    let isAuthed = false;
    if (adminToken) {
      const session = await env.STORE_KV.get(`session:${adminToken}`);
      if (session) isAuthed = true;
    }

    // إذا لم يكن أدمن مسجل، احذف البيانات الحساسة فوراً!
    if (!isAuthed) {
      delete storeData.adminEmail;
      delete storeData.adminPassword;
      delete storeData.adminPasswordHash;
      delete storeData.metaAccessToken; // حماية توكن الفيسبوك السري
    }

    return new Response(JSON.stringify(storeData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  // 2. طلب تعديل الإعدادات (POST) - يتطلب صلاحيات أدمن مؤكدة
  if (request.method === "POST") {
    const adminToken = request.headers.get("x-admin-token");
    if (!adminToken) {
      return new Response(JSON.stringify({ error: "غير مصرح لك بتعديل البيانات" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const session = await env.STORE_KV.get(`session:${adminToken}`);
    if (!session) {
      return new Response(JSON.stringify({ error: "انتهت صلاحية الجلسة" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const incomingData = await request.json() as Record<string, any>;
    const rawExisting = await env.STORE_KV.get("STORE_CONFIG");
    const existingData = rawExisting ? JSON.parse(rawExisting) : {};

    // معالجة كلمة المرور الجديدة إن وجدت (PBKDF2)
    if (incomingData.adminPassword && incomingData.adminPassword.trim() !== "") {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const enc = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(incomingData.adminPassword),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
      );
      const hash = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt,
          iterations: 100000,
          hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );
      const rawHash = await crypto.subtle.exportKey("raw", hash);
      const hashArray = Array.from(new Uint8Array(rawHash));
      const saltArray = Array.from(salt);
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      const saltHex = saltArray.map(b => b.toString(16).padStart(2, "0")).join("");

      incomingData.adminPasswordHash = `${saltHex}:${hashHex}`;
      delete incomingData.adminPassword; // مسح النص الصريح
    } else {
      // الحفاظ على الهاش الحالي لو لم تتغير كلمة السر
      if (existingData.adminPasswordHash) {
        incomingData.adminPasswordHash = existingData.adminPasswordHash;
      }
    }

    // دمج وحفظ البيانات
    const merged = { ...existingData, ...incomingData };
    await env.STORE_KV.put("STORE_CONFIG", JSON.stringify(merged));

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  return new Response("Method not allowed", { status: 405, headers: corsHeaders });
};
