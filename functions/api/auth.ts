// دالة تشفير SHA-256
async function hashPassword(text: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
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
    
    // فحص محاولات التخمين (حظر مؤقت بعد 5 محاولات فاشلة)
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
    const inputHashed = await hashPassword(password);
    
    const storedPass = storeData.adminPassword || "admin";
    const storedHashed = storeData.adminPasswordHash;

    const isPassValid = storedHashed 
      ? (inputHashed === storedHashed)
      : (password === storedPass || inputHashed === storedPass);

    if (email.toLowerCase().trim() === correctEmail && isPassValid) {
      // تصفير عداد المحاولات الفاشلة عند الدخول السليم
      await context.env.STORE_KV.delete(rateKey);
      
      const sessionToken = generateToken();
      await context.env.STORE_KV.put(`session:${sessionToken}`, "active", { expirationTtl: 86400 });

      return new Response(JSON.stringify({ success: true, token: sessionToken }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // تسجيل محاولة فاشلة مع مهلة 15 دقيقة (900 ثانية)
    await context.env.STORE_KV.put(rateKey, (attempts + 1).toString(), { expirationTtl: 900 });

    return new Response(JSON.stringify({ error: "بيانات الدخول غير صحيحة" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
