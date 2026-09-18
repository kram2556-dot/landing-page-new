interface Env {
  STORE_KV: KVNamespace;
}

async function verifyPassword(password: string, hashWithSalt: string): Promise<boolean> {
  const parts = hashWithSalt.split(":");
  if (parts.length !== 2) return false;
  const [saltHex, originalHashHex] = parts;

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

  // فحص الحماية ضد التخمين (5 محاولات فاشلة = إيقاف 5 دقائق)
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

    const rawStore = await env.STORE_KV.get("STORE_CONFIG");
    const storeConfig = rawStore ? JSON.parse(rawStore) : {};

    const configuredEmail = storeConfig.adminEmail || "admin@example.com";
    let isPasswordCorrect = false;

    if (email.trim().toLowerCase() === configuredEmail.trim().toLowerCase()) {
      if (storeConfig.adminPasswordHash) {
        isPasswordCorrect = await verifyPassword(password, storeConfig.adminPasswordHash);
      } else {
        const currentPlain = storeConfig.adminPassword || "admin";
        if (password === currentPlain) {
          isPasswordCorrect = true;
          const newHash = await hashNewPassword(password);
          storeConfig.adminPasswordHash = newHash;
          delete storeConfig.adminPassword;
          await env.STORE_KV.put("STORE_CONFIG", JSON.stringify(storeConfig));
        }
      }
    }

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

    if (attempts > 0) {
      await env.STORE_KV.delete(rateLimitKey);
    }

    const token = crypto.randomUUID();
    const sessionData = {
      email: configuredEmail,
      createdAt: Date.now()
    };

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
      JSON.stringify({ error: "حدث خطأ غير متوقع" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
};
