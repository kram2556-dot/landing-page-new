interface Env {
  STORE_KV: KVNamespace;
}

// دالة مساعدة لتشفير كلمة المرور والتحقق منها باستخدام PBKDF2
async function verifyPassword(password: string, hashWithSalt: string): Promise<boolean> {
  const parts = hashWithSalt.split(":");
  if (parts.length !== 2) return false;
  const [saltHex, originalHashHex] = parts;

  // تحويل Salt من Hex إلى Uint8Array
  const salt = new Uint8Array(
    saltHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );

  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  const derivedKey = await crypto.subtle.deriveKey(
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

  const rawHash = await crypto.subtle.exportKey("raw", derivedKey);
  const hashHex = Array.from(new Uint8Array(rawHash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex === originalHashHex;
}

// دالة مساعدة لتشفير كلمة مرور جديدة وتخزينها بصيغة PBKDF2
async function hashNewPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  const derivedKey = await crypto.subtle.deriveKey(
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

  const rawHash = await crypto.subtle.exportKey("raw", derivedKey);
  const hashHex = Array.from(new Uint8Array(rawHash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${saltHex}:${hashHex}`;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const origin = request.headers.get("Origin") || "";

  // إعداد ترويسات CORS بنطاق محدد
  const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
  };
  if (origin && (origin === url.origin || origin.endsWith(".pages.dev"))) {
    corsHeaders["Access-Control-Allow-Origin"] = origin;
  }

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  // 1. فحص الحماية ضد التخمين (Rate Limiting per IP)
  const clientIP = request.headers.get("CF-Connecting-IP") || "unknown";
  const rateLimitKey = `rate_limit:auth:${clientIP}`;
  const rawAttempts = await env.STORE_KV.get(rateLimitKey);
  const attempts = rawAttempts ? parseInt(rawAttempts, 10) : 0;

  if (attempts >= 5) {
    return new Response(
      JSON.stringify({ error: "تم تجاوز الحد الأقصى للمحاولات الفاشلة. يرجى الانتظار لمدة 5 دقائق." }),
      {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }

  try {
    const { email, password } = (await request.json()) as { email?: string; password?: string };

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "يرجى كتابة البريد الإلكتروني وكلمة المرور" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // 2. جلب بيانات المتجر المخزنة
    const rawStore = await env.STORE_KV.get("STORE_CONFIG");
    const storeConfig = rawStore ? JSON.parse(rawStore) : {};

    const configuredEmail = storeConfig.adminEmail || "admin@example.com";
    let isPasswordCorrect = false;

    // 3. التحقق من تطابق البريد الإلكتروني
    if (email.trim().toLowerCase() === configuredEmail.trim().toLowerCase()) {
      if (storeConfig.adminPasswordHash) {
        // التحقق باستخدام هاش PBKDF2
        isPasswordCorrect = await verifyPassword(password, storeConfig.adminPasswordHash);
      } else {
        // دعم الترقية التلقائية من كلمة المرور الافتراضية
        const currentPlain = storeConfig.adminPassword || "admin";
        if (password === currentPlain) {
          isPasswordCorrect = true;
          // ترقية فورية وتشفير الكلمة إلى PBKDF2
          const newHash = await hashNewPassword(password);
          storeConfig.adminPasswordHash = newHash;
          delete storeConfig.adminPassword;
          await env.STORE_KV.put("STORE_CONFIG", JSON.stringify(storeConfig));
        }
      }
    }

    // 4. في حالة فشل التحقق (تسجيل محاولة فاشلة)
    if (!isPasswordCorrect) {
      await env.STORE_KV.put(rateLimitKey, String(attempts + 1), { expirationTtl: 300 });
      return new Response(
        JSON.stringify({ error: "بيانات الدخول غير صحيحة" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // 5. في حالة نجاح تسجيل الدخول (تصفير عداد المحاولات الفاشلة)
    if (attempts > 0) {
      await env.STORE_KV.delete(rateLimitKey);
    }

    // إنشاء توكن جلسة مشفر وفريد (Session Token)
    const token = crypto.randomUUID();
    const sessionData = {
      email: configuredEmail,
      createdAt: Date.now()
    };

    // حفظ الجلسة في KV لمدة 7 أيام (604,800 ثانية)
    await env.STORE_KV.put(`session:${token}`, JSON.stringify(sessionData), {
      expirationTtl: 604800
    });

    return new Response(
      JSON.stringify({ success: true, token }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "حدث خطأ غير متوقع أثناء معالجة الطلب" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
};
