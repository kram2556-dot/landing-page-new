async function hashPBKDF2(password: string): Promise<string> {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);

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
      iterations: 210000,
      hash: "SHA-256"
    },
    keyMaterial,
    256
  );

  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, "0")).join("");
  const keyHex = Array.from(new Uint8Array(derivedKey)).map(b => b.toString(16).padStart(2, "0")).join("");

  return `${saltHex}:${keyHex}`;
}

export async function onRequestGet(context: any) {
  try {
    const raw = await context.env.STORE_KV.get("STORE_CONFIG");
    let data = raw ? JSON.parse(raw) : {};

    const token = context.request.headers.get("x-admin-token");
    let isAdmin = false;
    if (token) {
      const session = await context.env.STORE_KV.get(`session:${token}`);
      if (session === "active") isAdmin = true;
    }

    delete data.adminPassword;
    delete data.adminPasswordHash;

    if (!isAdmin) {
      delete data.metaAccessToken;
    }

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

    if (newData.adminPassword && newData.adminPassword.trim() !== "") {
      newData.adminPasswordHash = await hashPBKDF2(newData.adminPassword);
      delete newData.adminPassword;

      try {
        const sessionList = await context.env.STORE_KV.list({ prefix: "session:" });
        for (const sKey of (sessionList.keys || [])) {
          if (sKey.name !== `session:${token}`) {
            await context.env.STORE_KV.delete(sKey.name);
          }
        }
      } catch (e) {
        console.error("Session cleanup error:", e);
      }
    } else {
      newData.adminPasswordHash = existing.adminPasswordHash;
      delete newData.adminPassword;
    }

    if (newData.metaAccessToken === undefined || newData.metaAccessToken === "") {
      if (existing.metaAccessToken) {
        newData.metaAccessToken = existing.metaAccessToken;
      }
    }

    await context.env.STORE_KV.put("STORE_CONFIG", JSON.stringify(newData));

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    console.error("Store Error:", err);
    return new Response(JSON.stringify({ error: "حدث خطأ في معالجة البيانات" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
