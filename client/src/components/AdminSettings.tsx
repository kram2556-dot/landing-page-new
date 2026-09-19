import { useState } from "react";
import { Check, Palette, Layers, Sparkles } from "lucide-react";
import { STORE_THEMES } from "../const";
import { useTheme } from "../contexts/ThemeContext";

interface AdminSettingsProps {
  arabic: boolean;
  primary: string;
  secondary: string;
  onPrimaryChange: (value: string) => void;
  onSecondaryChange: (value: string) => void;
}

export default function AdminSettings({
  arabic,
  primary,
  secondary,
  onPrimaryChange,
  onSecondaryChange,
}: AdminSettingsProps) {
  const { activeStoreTheme, setStoreThemeById } = useTheme();

  const [announcement, setAnnouncement] = useState(true);
  const [saved, setSaved] = useState(false);

  // إعدادات المقاسات والألوان الاختيارية
  const [enableColors, setEnableColors] = useState<boolean>(() => {
    return localStorage.getItem("store_enable_colors") !== "false";
  });
  const [colorsInput, setColorsInput] = useState<string>(() => {
    return localStorage.getItem("store_colors_input") || "اسود, احمر, كحلي";
  });

  const [enableSizes, setEnableSizes] = useState<boolean>(() => {
    return localStorage.getItem("store_enable_sizes") !== "false";
  });
  const [sizesInput, setSizesInput] = useState<string>(() => {
    return localStorage.getItem("store_sizes_input") || "40, 41, 42, 43, 44";
  });

  // تخصيص نص زر الطلب
  const [ctaButtonText, setCtaButtonText] = useState<string>(() => {
    return localStorage.getItem("store_cta_text") || "اطلب الآن والدفع عند الاستلام";
  });

  // الحقول القديمة
  const [whatsapp, setWhatsapp] = useState<string>(() => {
    return localStorage.getItem("store_whatsapp") || "";
  });
  const [metaPixel, setMetaPixel] = useState<string>(() => {
    return localStorage.getItem("store_meta_pixel") || "";
  });
  const [tiktokPixel, setTiktokPixel] = useState<string>(() => {
    return localStorage.getItem("store_tiktok_pixel") || "";
  });

  const handleThemeSelect = (themeId: string) => {
    setStoreThemeById(themeId);
    const selected = STORE_THEMES.find((t) => t.id === themeId);
    if (selected) {
      onPrimaryChange(selected.primary);
      onSecondaryChange(selected.cardBackground);
    }
  };

  const save = async () => {
    // حفظ الإعدادات محلياً
    localStorage.setItem("store_enable_colors", String(enableColors));
    localStorage.setItem("store_colors_input", colorsInput);
    localStorage.setItem("store_enable_sizes", String(enableSizes));
    localStorage.setItem("store_sizes_input", sizesInput);
    localStorage.setItem("store_cta_text", ctaButtonText);
    localStorage.setItem("store_whatsapp", whatsapp);
    localStorage.setItem("store_meta_pixel", metaPixel);
    localStorage.setItem("store_tiktok_pixel", tiktokPixel);

    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primaryColor: primary,
          secondaryColor: secondary,
          announcementEnabled: announcement,
          themeId: activeStoreTheme.id,
          enableColors,
          colorsInput,
          enableSizes,
          sizesInput,
          ctaButtonText,
          whatsapp,
          metaPixel,
          tiktokPixel,
        }),
      });
    } catch (e) {
      console.warn("Using local settings fallback", e);
    }

    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="page-view">
      <div className="page-title">
        <div>
          <span className="admin-eyebrow">LUMA / SETTINGS</span>
          <h1>{arabic ? "الإعدادات وثيمات المتجر" : "Store Settings & Themes"}</h1>
          <p>
            {arabic
              ? "تحكم في هوية المتجر وثيمات الـ COD وخيارات الألوان والمقاسات."
              : "Control storefront theme, color palettes, and size toggles."}
          </p>
        </div>
        <button className="admin-primary" onClick={save}>
          {saved ? (
            <>
              <Check size={15} />
              {arabic ? "تم الحفظ بنجاح" : "Saved successfully"}
            </>
          ) : arabic ? (
            "حفظ التغييرات"
          ) : (
            "Save changes"
          )}
        </button>
      </div>

      {/* 1. قسم اختيار الـ 10 ثيمات التخصصية */}
      <section className="admin-panel form-panel settings-single mb-6">
        <div className="panel-heading">
          <div>
            <h2 className="flex items-center gap-2">
              <Sparkles size={18} />
              {arabic ? "اختر ثيم المتجر الجاهز (10 ثيمات)" : "Pre-built Themes (10 Themes)"}
            </h2>
            <span>
              {arabic
                ? "اختر طابع التصميم الأنسب لمنتجك وسيطبق فوراً على كامل الصفحة"
                : "Select the most matching visual theme for your product"}
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px", marginTop: "12px" }}>
          {STORE_THEMES.map((theme) => {
            const isSelected = activeStoreTheme.id === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                style={{
                  border: isSelected ? "2px solid #F97316" : "1px solid var(--color-border, #333)",
                  borderRadius: "8px",
                  padding: "10px",
                  cursor: "pointer",
                  background: isSelected ? "rgba(249, 115, 22, 0.08)" : "var(--color-card, #1A1A1A)",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <b style={{ fontSize: "14px", color: isSelected ? "#F97316" : "inherit" }}>{theme.name}</b>
                  <span style={{ display: "inline-block", width: "14px", height: "14px", borderRadius: "50%", background: theme.primary }} />
                </div>
                <div style={{ fontSize: "12px", opacity: 0.75 }}>{theme.category}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. قسم خيارات الألوان والمقاسات المتقدمة */}
      <section className="admin-panel form-panel settings-single mb-6">
        <div className="panel-heading">
          <div>
            <h2 className="flex items-center gap-2">
              <Layers size={18} />
              {arabic ? "خيارات المقاسات والألوان" : "Product Options & Variants"}
            </h2>
            <span>
              {arabic
                ? "يمكنك تفعيل أو إيقاف ظهور الألوان والمقاسات حسب طبيعة المنتج"
                : "Toggle variants on/off based on your product niche"}
            </span>
          </div>
        </div>

        {/* مفتاح الألوان */}
        <div className="setting-switch" style={{ borderBottom: "1px solid #2A2A2A", paddingBottom: "14px", marginBottom: "14px" }}>
          <div>
            <b>{arabic ? "تفعيل خيارات الألوان" : "Enable Colors"}</b>
            <span>{arabic ? "أوقف التفعيل إذا كان المنتج بدون ألوان (مثل ألعاب الأطفال أو الأجهزة المنزلية)" : "Disable for single-color items"}</span>
          </div>
          <button
            type="button"
            className={enableColors ? "toggle on" : "toggle"}
            onClick={() => setEnableColors(!enableColors)}
          >
            <i />
          </button>
        </div>

        {enableColors && (
          <label className="mb-4">
            {arabic ? "قائمة الألوان (اكتب اسم اللون بالعربي مفصولاً بفواصل)" : "Colors List (Arabic or HEX, separated by commas)"}
            <input
              type="text"
              value={colorsInput}
              onChange={(e) => setColorsInput(e.target.value)}
              placeholder="مثال: اسود, احمر, كحلي, بيج"
            />
            <span style={{ fontSize: "11px", opacity: 0.7, marginTop: "4px", display: "block" }}>
              {arabic ? "سيقوم المتجر تلقائياً بتحويل الأسماء (اسود، احمر، كحلي...) إلى دوائر ألوان مرئية." : "Color names are auto-converted to visible badges."}
            </span>
          </label>
        )}

        {/* مفتاح المقاسات */}
        <div className="setting-switch" style={{ borderBottom: "1px solid #2A2A2A", paddingBottom: "14px", marginBottom: "14px", marginTop: "16px" }}>
          <div>
            <b>{arabic ? "تفعيل خيارات المقاسات" : "Enable Sizes"}</b>
            <span>{arabic ? "أوقف التفعيل إذا كان المنتج مقاساً واحداً فقط" : "Disable for one-size products"}</span>
          </div>
          <button
            type="button"
            className={enableSizes ? "toggle on" : "toggle"}
            onClick={() => setEnableSizes(!enableSizes)}
          >
            <i />
          </button>
        </div>

        {enableSizes && (
          <label>
            {arabic ? "قائمة المقاسات (مفصولة بفواصل)" : "Sizes List (separated by commas)"}
            <input
              type="text"
              value={sizesInput}
              onChange={(e) => setSizesInput(e.target.value)}
              placeholder="مثال: S, M, L, XL أو 41, 42, 43, 44"
            />
          </label>
        )}
      </section>

      {/* 3. المظهر العام وشريط الإعلان ونصوص الطلب */}
      <section className="admin-panel form-panel settings-single">
        <div className="panel-heading">
          <div>
            <h2 className="flex items-center gap-2">
              <Palette size={18} />
              {arabic ? "التخصيص الدقيق والأزرار" : "Custom Fine-Tuning"}
            </h2>
            <span>{arabic ? "تحكم يدوي إضافي في درجات الألوان ونصوص الشراء" : "Manual override for colors & CTA"}</span>
          </div>
        </div>

        <div className="color-fields">
          <label>
            {arabic ? "اللون الأساسي المخصص" : "Primary color"}
            <span className="color-preview" style={{ background: primary }} />
            <input
              type="color"
              value={primary}
              onChange={(e) => onPrimaryChange(e.target.value)}
            />
          </label>
          <label>
            {arabic ? "اللون الثانوي / الكروت" : "Secondary color"}
            <span className="color-preview" style={{ background: secondary }} />
            <input
              type="color"
              value={secondary}
              onChange={(e) => onSecondaryChange(e.target.value)}
            />
          </label>
        </div>

        <label className="mt-4">
          {arabic ? "نص زر الطلب الرئيسي (Call to Action)" : "CTA Button Text"}
          <input
            type="text"
            value={ctaButtonText}
            onChange={(e) => setCtaButtonText(e.target.value)}
            placeholder="اطلب الآن والدفع عند الاستلام"
          />
        </label>

        <div className="setting-switch mt-4">
          <div>
            <b>{arabic ? "إظهار شريط الإعلان والمؤقت" : "Show announcement bar"}</b>
            <span>{arabic ? "إظهار شريط الاستعجال التنازلي أعلى المتجر" : "Show countdown timer banner"}</span>
          </div>
          <button
            type="button"
            className={announcement ? "toggle on" : "toggle"}
            onClick={() => setAnnouncement(!announcement)}
          >
            <i />
          </button>
        </div>

        <label className="mt-4">
          {arabic ? "رقم واتساب التاجر (لاستقبال الطلبات)" : "Merchant WhatsApp number"}
          <input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="مثال: 20101XXXXXXXX"
          />
        </label>

        <label>
          {arabic ? "Meta Pixel ID (فيسبوك)" : "Meta Pixel ID"}
          <input
            value={metaPixel}
            onChange={(e) => setMetaPixel(e.target.value)}
            placeholder="Optional (مثال: 1234567890)"
          />
        </label>

        <label>
          {arabic ? "TikTok Pixel ID (تيك توك)" : "TikTok Pixel ID"}
          <input
            value={tiktokPixel}
            onChange={(e) => setTiktokPixel(e.target.value)}
            placeholder="Optional"
          />
        </label>

        <p className="settings-note">
          {arabic
            ? "مفاتيح CAPI السحابية تحفظ كـ Secrets في Cloudflare وتعمل بدون تعريضها للمتصفح."
            : "CAPI keys should be stored as Cloudflare Secrets."}
        </p>
      </section>
    </div>
  );
}
