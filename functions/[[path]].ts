import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { drizzle } from 'drizzle-orm/d1';
import { sql } from 'drizzle-orm';

type Bindings = {
  DB: D1Database;
  STORE_NAME: string;
  DEFAULT_LOCALE: string;
  WHATSAPP_NUMBER?: string;
  META_PIXEL_ID?: string;
  META_ACCESS_TOKEN?: string;
  TIKTOK_PIXEL_ID?: string;
  TIKTOK_ACCESS_TOKEN?: string;
};
const app = new Hono<{ Bindings: Bindings }>().basePath('/api');
app.use('*', cors());
const json = (value: unknown) => JSON.stringify(value);
const asRecord = (value: unknown) => value as Record<string, unknown>;
const parse = (value: unknown, fallback: unknown = null) => { try { return value ? JSON.parse(String(value)) : fallback; } catch { return fallback; } };
const sha256 = async (value: string) => {
  const bytes = new TextEncoder().encode(value.trim().toLowerCase());
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
};
const sendPurchaseEvents = async (env: Bindings, payload: { eventId: string; phone: string; value: number; currency: string }) => {
  const phoneHash = await sha256(payload.phone);
  const requests: Promise<Response>[] = [];
  if (env.META_PIXEL_ID && env.META_ACCESS_TOKEN) requests.push(fetch(`https://graph.facebook.com/v20.0/${env.META_PIXEL_ID}/events?access_token=${env.META_ACCESS_TOKEN}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: json({ data: [{ event_name: 'Purchase', event_time: Math.floor(Date.now() / 1000), event_id: payload.eventId, action_source: 'website', user_data: { ph: [phoneHash] }, custom_data: { value: payload.value, currency: payload.currency } }] }) }));
  if (env.TIKTOK_PIXEL_ID && env.TIKTOK_ACCESS_TOKEN) requests.push(fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Access-Token': env.TIKTOK_ACCESS_TOKEN }, body: json({ pixel_code: env.TIKTOK_PIXEL_ID, event: 'CompletePayment', event_id: payload.eventId, properties: { value: payload.value, currency: payload.currency }, user: { phone: phoneHash } }) }));
  await Promise.allSettled(requests);
};

app.get('/health', (c) => c.json({ ok: true, service: c.env.STORE_NAME ?? 'LUMA', timestamp: new Date().toISOString() }));

app.get('/store', async (c) => {
  const db = drizzle(c.env.DB);
  const [product, media, bundles, settings, testimonials, faqs] = await Promise.all([
    db.run(sql`SELECT * FROM products WHERE slug = 'luma-01' LIMIT 1`),
    db.run(sql`SELECT * FROM media WHERE product_id = 1 ORDER BY sort_order ASC`),
    db.run(sql`SELECT * FROM bundles WHERE product_id = 1 AND active = 1 ORDER BY sort_order ASC`),
    db.run(sql`SELECT key, value FROM settings`),
    db.run(sql`SELECT * FROM testimonials WHERE active = 1 ORDER BY sort_order ASC`),
    db.run(sql`SELECT * FROM faqs WHERE active = 1 ORDER BY sort_order ASC`),
  ]);
  const settingMap = Object.fromEntries((settings.results ?? []).map((row) => { const item = asRecord(row); return [String(item.key), parse(item.value, item.value)]; }));
  return c.json({ product: product.results?.[0] ?? null, media: media.results ?? [], bundles: bundles.results ?? [], settings: settingMap, testimonials: testimonials.results ?? [], faqs: faqs.results ?? [] });
});

app.post('/orders', async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  const required = ['fullName', 'phone', 'country', 'city', 'address'];
  if (required.some((field) => !body[field])) return c.json({ error: 'Missing required fields', fields: required.filter((field) => !body[field]) }, 400);
  if (!/^\+?[0-9 ()-]{7,20}$/.test(String(body.phone))) return c.json({ error: 'Invalid phone number' }, 400);
  const db = drizzle(c.env.DB);
  const duplicate = await db.run(sql`SELECT COUNT(*) AS count FROM orders WHERE phone = ${String(body.phone)} AND created_at >= datetime('now', '-10 minutes')`);
  const duplicateRow = duplicate.results?.[0] as { count?: number } | undefined;
  const suspicious = Number(duplicateRow?.count ?? 0) > 0 ? 1 : 0;
  const subtotalCents = Number(body.subtotalCents ?? 0);
  const shippingCents = Number(body.shippingCents ?? 0);
  const totalCents = Number(body.totalCents ?? subtotalCents + shippingCents);
  const orderNumber = `LUMA-${Date.now().toString(36).toUpperCase()}`;
  await db.run(sql`INSERT INTO orders (order_number, product_id, bundle_id, quantity, full_name, phone, phone_extra, country, city, address, landmark, address_type, floor, apartment, delivery_note, discount_code, subtotal_cents, shipping_cents, total_cents, currency, suspicious) VALUES (${orderNumber}, 1, ${Number(body.bundleId ?? 1)}, ${Number(body.quantity ?? 1)}, ${String(body.fullName)}, ${String(body.phone)}, ${String(body.phoneExtra ?? '')}, ${String(body.country)}, ${String(body.city)}, ${String(body.address)}, ${String(body.landmark ?? '')}, ${String(body.addressType ?? '')}, ${String(body.floor ?? '')}, ${String(body.apartment ?? '')}, ${String(body.deliveryNote ?? '')}, ${String(body.discountCode ?? '')}, ${subtotalCents}, ${shippingCents}, ${totalCents}, ${String(body.currency ?? 'USD')}, ${suspicious})`);
  await sendPurchaseEvents(c.env, { eventId: orderNumber, phone: String(body.phone), value: totalCents / 100, currency: String(body.currency ?? 'USD') });
  return c.json({ orderNumber, suspicious, whatsapp: c.env.WHATSAPP_NUMBER ? `https://wa.me/${c.env.WHATSAPP_NUMBER}` : null }, 201);
});

app.post('/discounts/validate', async (c) => {
  const { code, subtotalCents } = await c.req.json<{ code?: string; subtotalCents?: number }>();
  if (!code) return c.json({ valid: false, message: 'Code is required' }, 400);
  const db = drizzle(c.env.DB);
  const result = await db.run(sql`SELECT * FROM discount_codes WHERE code = ${code.toUpperCase()} AND active = 1 AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP) AND (usage_limit IS NULL OR usage_count < usage_limit) LIMIT 1`);
  const discount = result.results?.[0] as Record<string, unknown> | undefined;
  if (!discount) return c.json({ valid: false, message: 'Discount code is not valid' });
  const subtotal = Number(subtotalCents ?? 0); const value = Number(discount.value ?? 0);
  const amount = discount.kind === 'percent' ? Math.round(subtotal * value / 100) : Math.min(subtotal, value);
  return c.json({ valid: true, amountCents: amount, code: discount.code, kind: discount.kind, value });
});

app.get('/admin/orders', async (c) => { const db = drizzle(c.env.DB); const result = await db.run(sql`SELECT * FROM orders ORDER BY created_at DESC LIMIT 500`); return c.json({ orders: result.results ?? [] }); });
app.patch('/admin/orders/:id', async (c) => { const id = Number(c.req.param('id')); const { status } = await c.req.json<{ status: string }>(); const allowed = ['new', 'confirmed', 'shipping', 'delivered', 'cancelled']; if (!allowed.includes(status)) return c.json({ error: 'Invalid status' }, 400); const db = drizzle(c.env.DB); await db.run(sql`UPDATE orders SET status = ${status}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`); return c.json({ ok: true }); });
app.get('/admin/export.csv', async (c) => { const db = drizzle(c.env.DB); const result = await db.run(sql`SELECT order_number, full_name, phone, country, city, address, quantity, total_cents, status, suspicious, created_at FROM orders ORDER BY created_at DESC`); const rows = result.results ?? []; const csv = ['order_number,full_name,phone,country,city,address,quantity,total_cents,status,suspicious,created_at', ...rows.map((row) => Object.values(row as Record<string, unknown>).map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(','))].join('\n'); return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="luma-orders.csv"' } }); });

app.put('/admin/settings', async (c) => { const data = await c.req.json<Record<string, unknown>>(); const db = drizzle(c.env.DB); for (const [key, value] of Object.entries(data)) await db.run(sql`INSERT INTO settings (key, value, updated_at) VALUES (${key}, ${json(value)}, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`); return c.json({ ok: true }); });
app.put('/admin/product', async (c) => { const data = await c.req.json<Record<string, unknown>>(); const db = drizzle(c.env.DB); await db.run(sql`UPDATE products SET name_ar = ${String(data.nameAr ?? '')}, name_en = ${String(data.nameEn ?? '')}, description_ar = ${String(data.descriptionAr ?? '')}, description_en = ${String(data.descriptionEn ?? '')}, price_cents = ${Number(data.priceCents ?? 0)}, available = ${data.available ? 1 : 0}, options_enabled = ${data.optionsEnabled ? 1 : 0}, updated_at = CURRENT_TIMESTAMP WHERE id = 1`); return c.json({ ok: true }); });
app.post('/admin/media', async (c) => { const data = await c.req.json<{ url: string; altAr?: string; altEn?: string }>(); if (!data.url) return c.json({ error: 'URL required' }, 400); const db = drizzle(c.env.DB); const count = await db.run(sql`SELECT COUNT(*) AS count FROM media WHERE product_id = 1`); const n = Number((count.results?.[0] as { count?: number })?.count ?? 0); if (n >= 8) return c.json({ error: 'Maximum 8 media items' }, 400); await db.run(sql`INSERT INTO media (product_id, url, alt_ar, alt_en, sort_order) VALUES (1, ${data.url}, ${data.altAr ?? ''}, ${data.altEn ?? ''}, ${n})`); return c.json({ ok: true }, 201); });
app.delete('/admin/media/:id', async (c) => { const db = drizzle(c.env.DB); await db.run(sql`DELETE FROM media WHERE id = ${Number(c.req.param('id'))}`); return c.json({ ok: true }); });
app.patch('/admin/media/reorder', async (c) => { const { ids } = await c.req.json<{ ids: number[] }>(); const db = drizzle(c.env.DB); for (let index = 0; index < ids.length; index += 1) await db.run(sql`UPDATE media SET sort_order = ${index} WHERE id = ${ids[index]}`); return c.json({ ok: true }); });
app.get('/admin/shipping', async (c) => { const db = drizzle(c.env.DB); const result = await db.run(sql`SELECT * FROM shipping_zones ORDER BY country_code, region_name`); return c.json({ zones: result.results ?? [] }); });
app.post('/admin/shipping', async (c) => { const data = await c.req.json<{ countryCode: string; countryName: string; regionName: string; priceCents: number; active?: boolean }>(); const db = drizzle(c.env.DB); await db.run(sql`INSERT INTO shipping_zones (country_code, country_name, region_name, price_cents, active) VALUES (${data.countryCode}, ${data.countryName}, ${data.regionName}, ${data.priceCents}, ${data.active === false ? 0 : 1}) ON CONFLICT(country_code, region_name) DO UPDATE SET price_cents = excluded.price_cents, active = excluded.active`); return c.json({ ok: true }); });
app.get('/admin/discounts', async (c) => { const db = drizzle(c.env.DB); const result = await db.run(sql`SELECT * FROM discount_codes ORDER BY id DESC`); return c.json({ discounts: result.results ?? [] }); });
app.post('/admin/discounts', async (c) => { const data = await c.req.json<{ code: string; kind: 'percent' | 'fixed'; value: number; expiresAt?: string; usageLimit?: number }>(); const db = drizzle(c.env.DB); await db.run(sql`INSERT INTO discount_codes (code, kind, value, expires_at, usage_limit) VALUES (${data.code.toUpperCase()}, ${data.kind}, ${data.value}, ${data.expiresAt ?? null}, ${data.usageLimit ?? null})`); return c.json({ ok: true }, 201); });

app.get('/tracking/config', (c) => c.json({ metaPixelId: c.env.META_PIXEL_ID ?? null, tiktokPixelId: c.env.TIKTOK_PIXEL_ID ?? null }));
export default app;
