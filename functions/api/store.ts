export async function onRequestGet(context: any) {
  try {
    const raw = await context.env.STORE_KV.get("STORE_CONFIG");
    let data = raw ? JSON.parse(raw) : {};

    delete data.adminPassword;

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

    if (!newData.adminPassword) {
      newData.adminPassword = existing.adminPassword || "admin";
    }

    await context.env.STORE_KV.put("STORE_CONFIG", JSON.stringify(newData));

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
