function generateToken(): string {
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost(context: any) {
  try {
    const { email, password } = await context.request.json();
    
    const storeRaw = await context.env.STORE_KV.get("STORE_CONFIG");
    const storeData = storeRaw ? JSON.parse(storeRaw) : {};

    const correctEmail = (storeData.adminEmail || "admin@example.com").toLowerCase().trim();
    const correctPassword = storeData.adminPassword || "admin";

    if (email.toLowerCase().trim() === correctEmail && password === correctPassword) {
      const sessionToken = generateToken();
      
      await context.env.STORE_KV.put(`session:${sessionToken}`, "active", { expirationTtl: 86400 });

      return new Response(JSON.stringify({ success: true, token: sessionToken }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "بيانات الدخول غير صحيحة" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

