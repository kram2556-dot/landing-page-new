-- LUMA / Cloudflare D1 schema
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  price_cents INTEGER NOT NULL DEFAULT 3200,
  currency TEXT NOT NULL DEFAULT 'USD',
  available INTEGER NOT NULL DEFAULT 1,
  options_enabled INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_ar TEXT NOT NULL DEFAULT '',
  alt_en TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bundles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT NOT NULL UNIQUE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  bundle_id INTEGER REFERENCES bundles(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  phone_extra TEXT,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  landmark TEXT,
  address_type TEXT,
  floor TEXT,
  apartment TEXT,
  delivery_note TEXT,
  discount_code TEXT,
  subtotal_cents INTEGER NOT NULL,
  shipping_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'new',
  suspicious INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quote_ar TEXT NOT NULL,
  quote_en TEXT NOT NULL,
  author TEXT NOT NULL,
  detail_ar TEXT NOT NULL DEFAULT '',
  detail_en TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL DEFAULT 5,
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_ar TEXT NOT NULL,
  question_en TEXT NOT NULL,
  answer_ar TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS shipping_zones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  region_name TEXT NOT NULL,
  price_cents INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  UNIQUE(country_code, region_name)
);

CREATE TABLE IF NOT EXISTS discount_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL CHECK(kind IN ('percent', 'fixed')),
  value INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  expires_at TEXT,
  usage_limit INTEGER,
  usage_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS orders_phone_created_idx ON orders(phone, created_at);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS media_product_sort_idx ON media(product_id, sort_order);

INSERT OR IGNORE INTO products (slug, name_ar, name_en, description_ar, description_en, price_cents)
VALUES ('luma-01', 'LUMA / 01', 'LUMA / 01', 'قطعة مكتبية هادئة تجمع بين الضوء الدافئ والتصميم النظيف.', 'A quiet desk object combining warm light with clean design.', 3200);
