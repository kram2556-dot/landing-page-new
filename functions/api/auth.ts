// خوارزمية تشفير PBKDF2 المعتمدة مع Salt و 100,000 دورة تجزئة
async function verifyPBKDF2(password: string, combinedHash: string): Promise<boolean> {
  try {
    const parts = combinedHash.split(":");
    if (parts.length !== 2) return false;
    const [saltHex, keyHex] = parts;

    const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    const derivedKey = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      256
    );

    const derivedHex = Array.from(new Uint8Array(derivedKey))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    return derivedHex === keyHex;
  } catch {
    return false;
  }
}

function generateToken(): string {
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost(context: any) {
  try {
    const clientIP = context.request.headers.get("cf-connecting-ip") || "unknown";
    const rateKey = `rate:auth:${clientIP}`;
    
    // منع التخمين Brute-Force: حظر مؤقت بعد 5 محاولات فاشلة لمدة 15 دقيقة
    const attemptsRaw = await context.env.STORE_KV.get(rateKey);
    const attempts = attemptsRaw ? parseInt(attemptsRaw) : 0;
    if (attempts >= 5) {
      return new Response(JSON.stringify({ error: "تم حظر المحاولات مؤقتاً لكثرة الأخطاء. انتظر 15 دقيقة." }), {
        status: 429,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { email, password } = await context.request.json();
    
    const storeRaw = await context.env.STORE_KV.get("STORE_CONFIG");
    const storeData = storeRaw ? JSON.parse(storeRaw) : {};

    const correctEmail = (storeData.adminEmail || "admin@example.com").toLowerCase().trim();
    const storedHash = storeData.adminPasswordHash;
    const storedPlain = storeData.adminPassword || "admin";

    let isValid = false;

    if (storedHash) {
      // التحقق عبر PBKDF2 المتقدمة
      isValid = await verifyPBKDF2(password, storedHash);
      // دعم خلفي بسيط في حال كانت التجزئة السابقة SHA-256 عادية
      if (!isValid && storedHash.length === 64) {
        const msg = new TextEncoder().encode(password);
        const hashBuf = await crypto.subtle.digest("SHA-256", msg);
        const hex = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
        isValid = (hex === storedHash);
      }
    } else {
      isValid = (password === storedPlain);
    }

    if (email.toLowerCase().trim() === correctEmail && isValid) {
      await context.env.STORE_KV.delete(rateKey);
      
      const sessionToken = generateToken();
      await context.env.STORE_KV.put(`session:${sessionToken}`, "active", { expirationTtl: 86400 });

      return new Response(JSON.stringify({ success: true, token: sessionToken }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    await context.env.STORE_KV.put(rateKey, (attempts + 1).toString(), { expirationTtl: 900 });

    return new Response(JSON.stringify({ error: "بيانات الدخول غير صحيحة" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
