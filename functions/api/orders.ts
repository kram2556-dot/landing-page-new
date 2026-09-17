async function sha256(text: string): Promise<string> {
  if (!text) return "";
  const msgUint8 = new TextEncoder().encode(text.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

async function sendMetaCAPI(orderData: any, config: any, clientIP: string, userAgent: string) {
  try {
    const pixelId = config.metaPixelId;
    const accessToken = config.metaAccessToken;

    if (!pixelId || !accessToken) return;

    const phoneClean = (orderData.phone || "").replace(/[^0-9]/g, "");
    const hashedPhone = phoneClean ? await sha256(phoneClean) : undefined;
    const hashedName = orderData.fullName ? await sha256(orderData.fullName) : undefined;

    const payload = {
      data: [
        {
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          event_id: orderData.id,
          action_source: "website",
          user_data: {
            client_ip_address: clientIP !== "unknown" ? clientIP : undefined,
            client_user_agent: userAgent !== "unknown" ? userAgent : undefined,
            ph: hashedPhone ? [hashedPhone] : undefined,
            fn: hashedName ? [hashedName] : undefined
          },
          custom_data: {
            currency: orderData.currency || "EGP",
            value: Number(orderData.total) || 0,
            order_id: orderData.id
          }
        }
      ]
    };

    const res = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Meta CAPI Rejected:", errBody);
    }
  } catch (e) {
    console.error("Meta CAPI Execution Error:", e);
  }
}

async function verifyAuth(context: any): Promise<boolean> {
  const token = context.request.headers.get("x-admin-token");
  if (!token) return false;
  const session = await context.env.STORE_KV.get(`session:${token}`);
  return session === "active";
}

export async function onRequestPost(context: any) {
  try {
    const clientIP = context.request.headers.get("cf-connecting-ip") || "unknown";
    const userAgent = context.request.headers.get("user-agent") || "unknown";
    const floodKey = `flood:order:${clientIP}`;
    
    const recent = await context.env.STORE_KV.get(floodKey);
    const count = recent ? parseInt(recent) : 0;
    if (count >= 2) {
      return new Response(JSON.stringify({ error: "مهلاً، تم استلام طلبك بالفعل. يرجى الانتظار قليلاً." }), {
        status: 429,
        headers: { "Content-Type": "application/json" }
      });
    }

    const orderData = await context.request.json();
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const orderId = `order_${timestamp}_${randomSuffix}`;
    const kvKey = `order:${timestamp}:${randomSuffix}`;

    const completeRecord = {
      id: orderId,
      status: "new",
      createdAt: new Date().toISOString(),
      ...orderData
    };

    await context.env.STORE_KV.put(kvKey, JSON.stringify(completeRecord));
    await context.env.STORE_KV.put(floodKey, (count + 1).toString(), { expirationTtl: 60 });

    const storeRaw = await context.env.STORE_KV.get("STORE_CONFIG");
    if (storeRaw) {
      const config = JSON.parse(storeRaw);
      context.waitUntil(sendMetaCAPI(completeRecord, config, clientIP, userAgent));
    }

    return new Response(JSON.stringify({ success: true, id: orderId }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    console.error("Orders POST Error:", err);
    return new Response(JSON.stringify({ error: "فشل إرسال الطلب" }), { status: 500 });
  }
}

export async function onRequestGet(context: any) {
  if (!(await verifyAuth(context))) {
    return new Response(JSON.stringify({ error: "غير مصرح لك بالوصول" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    let allKeys: any[] = [];
    let cursor: string | undefined = undefined;

    do {
      const listRes: any = await context.env.STORE_KV.list({
        prefix: "order:",
        cursor: cursor
      });
      if (listRes.keys && listRes.keys.length > 0) {
        allKeys.push(...listRes.keys);
      }
      cursor = listRes.list_complete ? undefined : listRes.cursor;
    } while (cursor);

    const orders = await Promise.all(
      allKeys.map(async (k: any) => {
        const raw = await context.env.STORE_KV.get(k.name);
        return raw ? JSON.parse(raw) : null;
      })
    );

    const sorted = orders
      .filter(Boolean)
      .sort((a: any, b: any) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());

    return new Response(JSON.stringify(sorted), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    console.error("Orders GET Error:", err);
    return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } });
  }
}

export async function onRequestPatch(context: any) {
  if (!(await verifyAuth(context))) {
    return new Response(JSON.stringify({ error: "غير مصرح" }), { status: 401 });
  }

  try {
    const { id, status } = await context.request.json();
    let cursor: string | undefined = undefined;

    do {
      const listRes: any = await context.env.STORE_KV.list({
        prefix: "order:",
        cursor: cursor
      });
      for (const key of (listRes.keys || [])) {
        const raw = await context.env.STORE_KV.get(key.name);
        if (raw) {
          const item = JSON.parse(raw);
          if (item.id === id) {
            item.status = status;
            await context.env.STORE_KV.put(key.name, JSON.stringify(item));
            return new Response(JSON.stringify({ success: true }));
          }
        }
      }
      cursor = listRes.list_complete ? undefined : listRes.cursor;
    } while (cursor);

    return new Response(JSON.stringify({ error: "الطلب غير موجود" }), { status: 404 });
  } catch (err: any) {
    console.error("Orders PATCH Error:", err);
    return new Response(JSON.stringify({ error: "فشل تعديل الحالة" }), { status: 500 });
  }
}

export async function onRequestDelete(context: any) {
  if (!(await verifyAuth(context))) {
    return new Response(JSON.stringify({ error: "غير مصرح" }), { status: 401 });
  }

  try {
    let cursor: string | undefined = undefined;
    do {
      const listRes: any = await context.env.STORE_KV.list({
        prefix: "order:",
        cursor: cursor
      });
      if (listRes.keys && listRes.keys.length > 0) {
        await Promise.all(listRes.keys.map((k: any) => context.env.STORE_KV.delete(k.name)));
      }
      cursor = listRes.list_complete ? undefined : listRes.cursor;
    } while (cursor);

    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    console.error("Orders DELETE Error:", err);
    return new Response(JSON.stringify({ error: "فشل مسح السجل" }), { status: 500 });
  }
}
