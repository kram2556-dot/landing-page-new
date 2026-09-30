interface Env {
  STORE_KV: KVNamespace;
}

const escapeHtml = (value: string) => value
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

export const onRequest: PagesFunction<Env> = async (context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html") || new URL(context.request.url).pathname !== "/") return response;

  const raw = await context.env.STORE_KV.get("STORE_CONFIG");
  if (!raw) return response;

  try {
    const config = JSON.parse(raw) as Record<string, any>;
    const title = String(config.seoTitle || `${config.storeName || "متجر"} | ${config.productTitle || "منتج"}`).slice(0, 60);
    const description = String(config.metaDescription || `${config.productTitle || "منتج مميز"} من ${config.storeName || "متجرنا"}. اطلب الآن مع التوصيل والدفع عند الاستلام.`).slice(0, 160);
    const ogTitle = String(config.ogTitle || title);
    const ogDescription = String(config.ogDescription || description);
    const image = String(config.ogImage || config.productImage || "");
    const url = new URL(context.request.url).toString();
    const robots = config.allowIndexing === false ? "noindex, nofollow" : "index, follow";
    const tags = [
      `<title>${escapeHtml(title)}</title>`,
      `<meta name="description" content="${escapeHtml(description)}">`,
      `<meta name="robots" content="${robots}">`,
      `<meta property="og:title" content="${escapeHtml(ogTitle)}">`,
      `<meta property="og:description" content="${escapeHtml(ogDescription)}">`,
      `<meta property="og:type" content="product">`,
      `<meta property="og:url" content="${escapeHtml(url)}">`,
      image ? `<meta property="og:image" content="${escapeHtml(image)}">` : "",
      `<meta name="twitter:card" content="summary_large_image">`
    ].filter(Boolean).join("\n    ");
    const html = await response.text();
    const updated = html
      .replace(/<title>[\s\S]*?<\/title>/i, "")
      .replace(/<meta\s+name=["']description["'][^>]*>/i, "")
      .replace("</head>", `    ${tags}\n  </head>`);
    const headers = new Headers(response.headers);
    headers.delete("content-length");
    return new Response(updated, { status: response.status, statusText: response.statusText, headers });
  } catch {
    return response;
  }
};
