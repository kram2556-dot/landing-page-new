# LUMA / متجر منتج واحد

متجر منتج واحد جاهز للنشر على **Cloudflare Pages + Pages Functions + D1**. يحتوي على صفحة هبوط Editorial Premium ثنائية اللغة، لوحة تحكم، Checkout متقدم، إدارة الوسائط، الشحن، الخصومات، الطلبات، وواجهات تتبع.

## ما يتضمنه المشروع

- صفحة هبوط عربية/إنجليزية مع تبديل RTL/LTR، المؤقت، الإعلان، المنتج، الثقة، القصة، المعرض، المزايا، العداد الاجتماعي، الباقات، التقييمات، FAQ، الضمان، Checkout، وشاشة الشكر.
- Checkout يجمع الاسم والهاتف الأساسي والإضافي، الدولة، المدينة/المحافظة، العنوان، العلامة المميزة، نوع العنوان، الطابق، الشقة، ملاحظات التوصيل، خيارات الخصم، والكمية.
- كشف الهاتف المتكرر خلال 10 دقائق وتسجيل الطلب كمشبوه.
- لوحة تحكم `/admin` بالعربية/الإنجليزية لإدارة المنتج، السعر، التوفر، المعرض، ضغط الصور إلى WebP بأبعاد 1200px وجودة 80% مع محاولة إبقاء الحجم أقل من 200KB، الطلبات، CSV، الشحن، الألوان، الإعلان، وأرقام Pixels.
- Hono Edge API في `functions/[[path]].ts` مع D1 عبر Drizzle، وتشمل `/api/store`, `/api/orders`, `/api/discounts/validate`, `/api/admin/orders`, `/api/admin/export.csv`, `/api/admin/product`, `/api/admin/media`, `/api/admin/shipping`, `/api/admin/discounts`, `/api/admin/settings`, و`/api/tracking/config`.
- تشفير SHA-256 للهاتف وإرسال Purchase إلى Meta CAPI وTikTok Events API عند توفير الأسرار.
- `schema.sql` و`drizzle/0000_initial.sql` لجداول المنتج، الصور، الباقات، الطلبات، العملاء، الأسئلة، الشحن، الخصومات، والإعدادات.

## التشغيل المحلي

```bash
pnpm install
pnpm dev
```

## إعداد Cloudflare

1. أنشئ قاعدة D1 وضع معرّفها في `wrangler.toml` بدل `REPLACE_WITH_CLOUDFLARE_D1_DATABASE_ID`.
2. طبّق المخطط:

```bash
npx wrangler d1 execute luma-store-db --remote --file=./schema.sql
```

3. أضف الأسرار عبر Cloudflare Dashboard أو CLI:

```bash
npx wrangler pages secret put WHATSAPP_NUMBER
npx wrangler pages secret put META_ACCESS_TOKEN
npx wrangler pages secret put TIKTOK_ACCESS_TOKEN
```

المعرّفات العامة يمكن وضعها في `wrangler.toml` أو متغيرات Pages: `META_PIXEL_ID`, `TIKTOK_PIXEL_ID`. لا تضع Access Tokens داخل الواجهة.

4. ابنِ وانشر:

```bash
pnpm build
npx wrangler pages deploy dist/public --project-name luma-one-product-store
```

## الوسائط

المعرض يضغط الملفات محليًا في المتصفح ويولّد WebP ومعاينة قبل الإضافة. للإطلاق التجاري، استبدل روابط الصور التجريبية بروابط R2 أو CDN، واربط الرفع بمسار الوسائط في D1/R2.

## حماية لوحة التحكم

قبل الإطلاق، فعّل Cloudflare Access أمام `/admin` و`/api/admin/*`، أو أضف مزود هوية مؤسسي. لا تعتمد على إخفاء رابط `/admin` كوسيلة حماية.
