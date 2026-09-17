async function hashPassword(text: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function onRequestGet(context: any) {
  try {
    const raw = await context.env.STORE_KV.get("STORE_CONFIG");
    let data = raw ? JSON.parse(raw) : {};

    // حذف أي أثر للباسورد قبل إرسال البيانات للمتصفح
    delete data.adminPassword;
    delete data.adminPasswordHash;

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({}), { status: 500 });
  }
}

export async function onRequestPost(context: any) {
  try {
    const token = context.request.headers.get("x-admin-token");
    if (!token) {
      return new Response(JSON.stringify({ error: "غير مصرح" }), { status: 401 });
    }

    const session = await context.env.STORE_KV.get(`session:${token}`);
    if (!session) {
      return new Response(JSON.stringify({ error: "انتهت الجلسة، سجل دخولك ثانية" }), { status: 401 });
    }

    const newData = await context.request.json();
    const existingRaw = await context.env.STORE_KV.get("STORE_CONFIG");
    const existing = existingRaw ? JSON.parse(existingRaw) : {};

    // تشفير كلمة السر في KV إذا أدخل كلمة جديدة
    if (newData.adminPassword && newData.adminPassword.trim() !== "") {
      newData.adminPasswordHash = await hashPassword(newData.adminPassword);
    } else {
      newData.adminPasswordHash = existing.adminPasswordHash;
    }
    delete newData.adminPassword;

    await context.env.STORE_KV.put("STORE_CONFIG", JSON.stringify(newData));

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
