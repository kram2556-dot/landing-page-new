import React, { useState, useEffect } from "react";

export type ThemeType = "medical" | "sneakers" | "fashion" | "perfume" | "home" | "kids";

export interface ProvinceItem {
  id: string;
  name: string;
  enabled: boolean;
  shippingCost: number;
}

export interface CountryConfig {
  code: string;
  name: string;
  currency: string;
  phoneCode: string;
  provinces: ProvinceItem[];
}

export interface GalleryItem {
  id: string;
  image: string;
  caption: string;
}

export interface BundleItem {
  qty: number;
  title: string;
  price: number;
  badge?: string;
  savings?: string;
}

export interface ReviewItem {
  name: string;
  comment: string;
  rating: number;
}

export interface StoreConfig {
  storeName: string;
  logoUrl: string;
  selectedTheme: ThemeType;
  showTopBar: boolean;
  topBarText: string;
  showTimer: boolean;
  timerMinutes: number;
  showStockBar: boolean;
  stockLeft: number;
  showRecentSales: boolean;
  showStickyButton: boolean;
  showSupportWhatsapp: boolean;
  supportWhatsappNumber: string;
  activeCountry: string;
  countries: Record<string, CountryConfig>;
  productTitle: string;
  productImage: string;
  gallery: GalleryItem[];
  currentPrice: number;
  oldPrice: number;
  features: string[];
  enableSizes: boolean;
  sizes: string;
  enableColors: boolean;
  colors: string;
  showBundles: boolean;
  bundles: BundleItem[];
  showGuarantee: boolean;
  guaranteeText: string;
  guaranteeSubtext?: string;
  showReviews: boolean;
  reviews: ReviewItem[];
  whatsappNumber: string;
  metaPixelId: string;
  tiktokPixelId: string;
}

// ألوان وقوالب الثيمات الشاملة حسب نوع المنتج
const THEME_STYLES: Record<ThemeType, { bg: string; cardBg: string; text: string; accent: string; border: string }> = {
  medical: {
    bg: "#f8fafc",
    cardBg: "#ffffff",
    text: "#0f172a",
    accent: "#0284c7",
    border: "#e2e8f0"
  },
  sneakers: {
    bg: "#0a0a0a",
    cardBg: "#171717",
    text: "#f5f5f5",
    accent: "#f97316",
    border: "#262626"
  },
  fashion: {
    bg: "#1c1917",
    cardBg: "#292524",
    text: "#fafaf9",
    accent: "#d97706",
    border: "#44403c"
  },
  perfume: {
    bg: "#09090b",
    cardBg: "#18181b",
    text: "#fafafa",
    accent: "#ec4899",
    border: "#27272a"
  },
  home: {
    bg: "#0b0f19",
    cardBg: "#111827",
    text: "#f9fafb",
    accent: "#3b82f6",
    border: "#1f2937"
  },
  kids: {
    bg: "#064e3b",
    cardBg: "#065f46",
    text: "#ffffff",
    accent: "#10b981",
    border: "#047857"
  }
};

const DEFAULT_COUNTRIES: Record<string, CountryConfig> = {
  EG: {
    code: "EG",
    name: "مصر",
    currency: "ج.م",
    phoneCode: "+20",
    provinces: [
      { id: "cairo", name: "القاهرة", enabled: true, shippingCost: 0 },
      { id: "giza", name: "الجيزة", enabled: true, shippingCost: 0 },
      { id: "alex", name: "الإسكندرية", enabled: true, shippingCost: 0 }
    ]
  }
};

const DEFAULT_CONFIG: StoreConfig = {
  storeName: "متجر النخبة",
  logoUrl: "",
  selectedTheme: "sneakers",
  showTopBar: true,
  topBarText: "عرض خاص لفترة محدودة — شحن سريع ومعاينة قبل الدفع",
  showTimer: true,
  timerMinutes: 15,
  showStockBar: true,
  stockLeft: 7,
  showRecentSales: true,
  showStickyButton: true,
  showSupportWhatsapp: true,
  supportWhatsappNumber: "+201000000000",
  activeCountry: "EG",
  countries: DEFAULT_COUNTRIES,
  productTitle: "حذاء مريح وخفيف للجري والمشي الطويل",
  productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
  gallery: [],
  currentPrice: 350,
  oldPrice: 550,
  features: ["خامة مرنة تسمح بالتهوية ومقاومة للتعرق", "نعل مانع للانزلاق مريح للوقوف الطويل", "معاينة مجانية للمقاس قبل الدفع"],
  enableSizes: true,
  sizes: "41, 42, 43, 44, 45",
  enableColors: true,
  colors: "أسود, كحلي, رمادي",
  showBundles: true,
  bundles: [
    { qty: 1, title: "قطعة واحدة", price: 350 },
    { qty: 2, title: "قطعتان (عرض مميز)", price: 620, badge: "الأكثر طلباً", savings: "وفر 80" }
  ],
  showGuarantee: true,
  guaranteeText: "معاينة وقياس المنتج مجاناً قبل الاستلام والدفع للمندوب",
  guaranteeSubtext: "إن لم يناسبك المقاس يمكنك الإرجاع فوراً دون دفع أي مصاريف",
  showReviews: true,
  reviews: [{ name: "أحمد م.", comment: "ممتاز جداً وخامته فاخرة ومريح في الوقوف.", rating: 5 }],
  whatsappNumber: "+201000000000",
  metaPixelId: "",
  tiktokPixelId: ""
};

export default function Home() {
  const [config, setConfig] = useState<StoreConfig>(DEFAULT_CONFIG);
  const [selectedQty, setSelectedQty] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");

  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 59 });
  const [recentSale, setRecentSale] = useState<{ name: string; city: string } | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("store_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged: StoreConfig = { ...DEFAULT_CONFIG, ...parsed, countries: { ...DEFAULT_COUNTRIES, ...(parsed.countries || {}) } };
        setConfig(merged);

        if (merged.enableSizes && merged.sizes) {
          setSelectedSize(merged.sizes.split(",")[0]?.trim() || "");
        }
        if (merged.enableColors && merged.colors) {
          setSelectedColor(merged.colors.split(",")[0]?.trim() || "");
        }
        const activeC = merged.countries[merged.activeCountry] || DEFAULT_COUNTRIES.EG;
        const firstActiveProv = activeC.provinces?.find((p) => p.enabled);
        if (firstActiveProv) setSelectedProvince(firstActiveProv.name);
      } catch (e) {
        console.error(e);
      }
    } else {
      setSelectedSize("42");
      setSelectedColor("أسود");
      setSelectedProvince("القاهرة");
    }
  }, []);

  // مؤقت التنازل
  useEffect(() => {
    if (!config.showTimer) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { minutes: prev.minutes - 1, seconds: 59 };
        return { minutes: 14, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [config.showTimer]);

  // إشعار الشراء اللحظي
  useEffect(() => {
    if (!config.showRecentSales) return;
    const activeC = config.countries[config.activeCountry] || DEFAULT_COUNTRIES.EG;
    const provs = activeC.provinces?.filter((p) => p.enabled).map((p) => p.name) || ["المدينة"];
    const names = ["محمد", "أحمد", "محمود", "خالد", "عبدالله", "يوسف", "عمر"];

    const interval = setInterval(() => {
      const rName = names[Math.floor(Math.random() * names.length)];
      const rCity = provs[Math.floor(Math.random() * provs.length)];
      setRecentSale({ name: rName, city: rCity });
      setTimeout(() => setRecentSale(null), 5000);
    }, 20000);

    return () => clearInterval(interval);
  }, [config.showRecentSales, config.activeCountry, config.countries]);

  const theme = THEME_STYLES[config.selectedTheme] || THEME_STYLES.sneakers;
  const activeCountry = config.countries[config.activeCountry] || DEFAULT_COUNTRIES.EG;
  const enabledProvinces = activeCountry.provinces?.filter((p) => p.enabled) || [];

  const activeProvObj = enabledProvinces.find((p) => p.name === selectedProvince);
  const shippingCost = activeProvObj ? activeProvObj.shippingCost : 0;

  const currentBundle = config.bundles.find((b) => b.qty === selectedQty) || {
    qty: 1,
    title: "قطعة واحدة",
    price: config.currentPrice
  };

  const productSubtotal = config.showBundles ? currentBundle.price : config.currentPrice * selectedQty;
  const finalTotal = productSubtotal + shippingCost;

  const scrollToCheckout = () => {
    document.getElementById("checkout-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !selectedProvince || !phone || !address) {
      alert("يرجى ملء جميع الحقول الإلزامية");
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      fullName,
      countryName: activeCountry.name,
      governorate: selectedProvince,
      shippingCost,
      phone,
      altPhone,
      address,
      notes,
      selectedSize: config.enableSizes ? selectedSize : null,
      selectedColor: config.enableColors ? selectedColor : null,
      qty: selectedQty,
      subtotal: productSubtotal,
      total: finalTotal,
      currency: activeCountry.currency,
      date: new Date().toISOString()
    };

    const existingOrders = JSON.parse(localStorage.getItem("store_orders") || "[]");
    localStorage.setItem("store_orders", JSON.stringify([orderData, ...existingOrders]));

    setIsSubmitting(false);
    setOrderSuccess(true);

    if (config.whatsappNumber) {
      let spec = "";
      if (config.enableSizes && selectedSize) spec += `%0A- المقاس: ${selectedSize}`;
      if (config.enableColors && selectedColor) spec += `%0A- اللون: ${selectedColor}`;

      const msg = `طلب جديد:%0A- الاسم: ${fullName}%0A- الدولة: ${activeCountry.name}%0A- المحافظة: ${selectedProvince}%0A- العنوان: ${address}${spec}%0A- الكمية: ${selectedQty}%0A- الإجمالي مع الشحن: ${finalTotal} ${activeCountry.currency}%0A- الهاتف: ${phone}${altPhone ? ` (%D8%A8%D8%AF%D9%8A%D9%84: ${altPhone})` : ""}${notes ? `%0A- ملاحظات: ${notes}` : ""}`;
      const cleanPhone = config.whatsappNumber.replace(/[^0-9]/g, "");
      window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
    }
  };

  if (orderSuccess) {
    return (
      <div style={{ backgroundColor: theme.bg, color: theme.text }} className="min-h-screen flex items-center justify-center p-4 font-sans" dir="rtl">
        <div style={{ backgroundColor: theme.cardBg, borderColor: theme.border }} className="border p-8 rounded-2xl max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
            ✓
          </div>
          <h2 className="text-2xl font-bold">تم تأكيد طلبك بنجاح!</h2>
          <p className="text-sm opacity-80 leading-relaxed">
            شكراً لك يا {fullName}. سنتواصل معك لتأكيد موعد المعاينة والتسليم.
          </p>
          <div style={{ borderColor: theme.border }} className="p-3 rounded-xl border text-xs">
            الإجمالي عند الاستلام: <b className="text-sm" style={{ color: theme.accent }}>{finalTotal} {activeCountry.currency}</b>
          </div>
          <button
            onClick={() => setOrderSuccess(false)}
            style={{ backgroundColor: theme.accent }}
            className="w-full text-black font-bold py-3 rounded-xl transition"
          >
            العودة للمتجر
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text }} className="min-h-screen font-sans pb-24 transition-colors duration-300" dir="rtl">
      {/* شريط الإعلان */}
      {config.showTopBar && (
        <div style={{ backgroundColor: theme.accent }} className="text-black py-2 px-4 text-xs sm:text-sm font-bold text-center sticky top-0 z-50 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 sm:gap-6">
            <span>{config.topBarText}</span>
            {config.showTimer && (
              <span className="bg-black/80 text-white px-2 py-0.5 rounded font-mono text-xs">
                {String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
              </span>
            )}
          </div>
        </div>
      )}

      {/* الهيدر */}
      <header style={{ borderColor: theme.border }} className="border-b bg-black/20 backdrop-blur-md sticky top-8 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            {config.logoUrl ? (
              <img src={config.logoUrl} alt={config.storeName} className="h-9 object-contain" />
            ) : (
              <span style={{ color: theme.accent }} className="text-xl font-black">{config.storeName}</span>
            )}
          </div>
          <button
            onClick={scrollToCheckout}
            style={{ backgroundColor: theme.accent }}
            className="text-black font-bold px-4 py-1.5 rounded-lg text-xs sm:text-sm"
          >
            اطلب الآن
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-7">
        {/* تفاصيل المنتج والأسعار */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold">{config.productTitle}</h1>
          <div className="flex items-center justify-center gap-3">
            <span style={{ color: theme.accent }} className="text-3xl font-black">
              {config.currentPrice} {activeCountry.currency}
            </span>
            {config.oldPrice > config.currentPrice && (
              <span className="opacity-50 line-through text-lg">
                {config.oldPrice} {activeCountry.currency}
              </span>
            )}
          </div>

          {config.showStockBar && (
            <div className="max-w-xs mx-auto pt-2 space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-red-500">سارع بالطلب! الكمية المتبقية محدودة</span>
                <span style={{ color: theme.accent }}>{config.stockLeft} قطع متبقية</span>
              </div>
              <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, Math.max(15, config.stockLeft * 10))}%`, backgroundColor: theme.accent }}
                  className="h-full rounded-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* الصورة الرئيسية */}
        <div style={{ borderColor: theme.border, backgroundColor: theme.cardBg }} className="rounded-2xl overflow-hidden border shadow-xl">
          <img src={config.productImage} alt={config.productTitle} className="w-full h-80 sm:h-[420px] object-cover" />
        </div>

        {/* المقاسات والألوان */}
        {(config.enableSizes || config.enableColors) && (
          <div style={{ borderColor: theme.border, backgroundColor: theme.cardBg }} className="border rounded-2xl p-5 space-y-4">
            {config.enableSizes && config.sizes && (
              <div className="space-y-2">
                <label className="block text-xs font-bold opacity-80">
                  المقاس المختار: <span style={{ color: theme.accent }}>{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {config.sizes.split(",").map((s) => {
                    const size = s.trim();
                    if (!size) return null;
                    const active = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        style={{
                          borderColor: active ? theme.accent : theme.border,
                          backgroundColor: active ? `${theme.accent}20` : "transparent"
                        }}
                        className="border-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold"
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {config.enableColors && config.colors && (
              <div className="space-y-2">
                <label className="block text-xs font-bold opacity-80">
                  اللون المختار: <span style={{ color: theme.accent }}>{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {config.colors.split(",").map((c) => {
                    const col = c.trim();
                    if (!col) return null;
                    const active = selectedColor === col;
                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        style={{
                          borderColor: active ? theme.accent : theme.border,
                          backgroundColor: active ? `${theme.accent}20` : "transparent"
                        }}
                        className="border-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold"
                      >
                        {col}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* نقاط المميزات */}
        <div style={{ borderColor: theme.border, backgroundColor: theme.cardBg }} className="border rounded-2xl p-5 space-y-2.5">
          <h3 style={{ color: theme.accent }} className="font-bold text-sm">مميزات المنتج:</h3>
          <ul className="space-y-2 text-xs sm:text-sm opacity-90">
            {config.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2">
                <span style={{ color: theme.accent }} className="font-bold">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* معرض الصور التوضيحي والشرح */}
        {config.gallery && config.gallery.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-center">تفاصيل المنتج عن قرب:</h3>
            <div className="grid grid-cols-1 gap-4">
              {config.gallery.map((g) => (
                <div key={g.id} style={{ borderColor: theme.border, backgroundColor: theme.cardBg }} className="border rounded-2xl overflow-hidden shadow-lg">
                  <img src={g.image} alt="Detail" className="w-full h-64 sm:h-80 object-cover" />
                  {g.caption && (
                    <div style={{ borderColor: theme.border }} className="p-4 border-t text-xs sm:text-sm text-center font-medium opacity-90">
                      {g.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* باقات التوفير */}
        {config.showBundles && (
          <div className="space-y-3">
            <h3 className="font-bold text-base text-center">عروض وباقات التوفير:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {config.bundles.map((b) => {
                const isSelected = selectedQty === b.qty;
                return (
                  <div
                    key={b.qty}
                    onClick={() => setSelectedQty(b.qty)}
                    style={{
                      borderColor: isSelected ? theme.accent : theme.border,
                      backgroundColor: isSelected ? `${theme.accent}15` : theme.cardBg
                    }}
                    className="cursor-pointer border-2 rounded-xl p-4 text-center relative transition"
                  >
                    {b.badge && (
                      <span style={{ backgroundColor: theme.accent }} className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                        {b.badge}
                      </span>
                    )}
                    <p className="font-bold text-sm">{b.title}</p>
                    <p style={{ color: theme.accent }} className="text-xl font-black my-1">
                      {b.price} {activeCountry.currency}
                    </p>
                    {b.savings && <p className="text-[11px] text-emerald-400 font-semibold">{b.savings} {activeCountry.currency}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* نموذج الطلب المباشر */}
        <section id="checkout-form" style={{ borderColor: theme.border, backgroundColor: theme.cardBg }} className="border rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <div style={{ borderColor: theme.border }} className="border-b pb-3 text-center">
            <h2 className="text-xl font-extrabold">أدخل بياناتك لمعاينة واستلام الطلب</h2>
            <p className="text-xs opacity-70 mt-1">الدفع عند الاستلام مع إمكانية المعاينة قبل الدفع</p>
          </div>

          <form onSubmit={handleSubmitOrder} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold opacity-80 mb-1">الاسم بالكامل *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="اكتب اسمك الثلاثي"
                style={{ borderColor: theme.border, backgroundColor: theme.bg, color: theme.text }}
                className="w-full border rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold opacity-80 mb-1">
                المحافظة / المدينة ({activeCountry.name}) *
              </label>
              <select
                required
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                style={{ borderColor: theme.border, backgroundColor: theme.bg, color: theme.text }}
                className="w-full border rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none"
              >
                {enabledProvinces.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} {p.shippingCost === 0 ? "(شحن مجاني)" : `(شحن: ${p.shippingCost} ${activeCountry.currency})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold opacity-80 mb-1">رقم الهاتف الأساسي *</label>
                <div className="flex items-center gap-1.5" dir="ltr">
                  <span style={{ borderColor: theme.border, backgroundColor: theme.bg }} className="border text-xs px-2.5 py-2.5 rounded-xl font-mono">
                    {activeCountry.phoneCode}
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="رقم الهاتف"
                    style={{ borderColor: theme.border, backgroundColor: theme.bg, color: theme.text }}
                    className="w-full border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-left focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold opacity-80 mb-1">رقم هاتف بديل (اختياري)</label>
                <div className="flex items-center gap-1.5" dir="ltr">
                  <span style={{ borderColor: theme.border, backgroundColor: theme.bg }} className="border text-xs px-2.5 py-2.5 rounded-xl font-mono">
                    {activeCountry.phoneCode}
                  </span>
                  <input
                    type="tel"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    placeholder="رقم آخر إن وجد"
                    style={{ borderColor: theme.border, backgroundColor: theme.bg, color: theme.text }}
                    className="w-full border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-left focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold opacity-80 mb-1">العنوان بالتفصيل *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="اسم الشارع، رقم العمارة، علامة مميزة"
                style={{ borderColor: theme.border, backgroundColor: theme.bg, color: theme.text }}
                className="w-full border rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold opacity-80 mb-1">ملاحظات للمندوب (اختياري)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي تعليمات خاصة بالتوصيل"
                style={{ borderColor: theme.border, backgroundColor: theme.bg, color: theme.text }}
                className="w-full border rounded-xl px-4 py-2 text-xs focus:outline-none resize-none"
              />
            </div>

            <div style={{ borderColor: theme.border, backgroundColor: theme.bg }} className="p-3.5 rounded-xl border space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between opacity-70">
                <span>سعر المنتج:</span>
                <span>{productSubtotal} {activeCountry.currency}</span>
              </div>
              <div className="flex justify-between opacity-70">
                <span>مصاريف الشحن:</span>
                <span className={shippingCost === 0 ? "text-emerald-400 font-bold" : ""}>
                  {shippingCost === 0 ? "مجاناً" : `${shippingCost} ${activeCountry.currency}`}
                </span>
              </div>
              <div style={{ borderColor: theme.border }} className="border-t pt-1.5 flex justify-between items-center font-bold">
                <span>الإجمالي المستحق للدفع:</span>
                <span style={{ color: theme.accent }} className="text-xl font-black">
                  {finalTotal} {activeCountry.currency}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: theme.accent }}
              className="w-full text-black font-extrabold text-sm sm:text-base py-3.5 rounded-xl shadow-lg transition"
            >
              {isSubmitting ? "جاري تأكيد طلبك..." : "تأكيد الطلب — الدفع عند الاستلام بعد المعاينة"}
            </button>
          </form>
        </section>

        {/* الضمان */}
        {config.showGuarantee && (
          <div style={{ borderColor: theme.border, backgroundColor: theme.cardBg }} className="border rounded-xl p-4 flex items-center gap-3">
            <div style={{ color: theme.accent }} className="text-2xl flex-shrink-0">🛡️</div>
            <div>
              <p className="font-bold text-xs sm:text-sm">{config.guaranteeText}</p>
              {config.guaranteeSubtext && <p className="text-[11px] opacity-70 mt-0.5">{config.guaranteeSubtext}</p>}
            </div>
          </div>
        )}

        {/* التقييمات */}
        {config.showReviews && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm opacity-90">تجارب وآراء المشترين:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {config.reviews.map((r, i) => (
                <div key={i} style={{ borderColor: theme.border, backgroundColor: theme.cardBg }} className="border p-3.5 rounded-xl space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold">{r.name}</span>
                    <span style={{ color: theme.accent }}>{"★".repeat(r.rating)}</span>
                  </div>
                  <p className="text-xs opacity-70 leading-relaxed">"{r.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* إشعار الشراء اللحظي المنبثق */}
      {recentSale && (
        <div style={{ backgroundColor: theme.cardBg, borderColor: theme.accent }} className="fixed bottom-16 left-4 z-50 border p-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs animate-bounce">
          <div style={{ backgroundColor: `${theme.accent}30`, color: theme.accent }} className="w-8 h-8 rounded-full flex items-center justify-center font-bold">
            🛍️
          </div>
          <div>
            <p className="font-bold">قام {recentSale.name} من ({recentSale.city}) بطلب المنتج</p>
            <p className="text-[10px] opacity-60">منذ قليل</p>
          </div>
        </div>
      )}

      {/* أيقونة واتساب الدعم العائمة */}
      {config.showSupportWhatsapp && config.supportWhatsappNumber && (
        <a
          href={`https://wa.me/${config.supportWhatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("مرحباً، لدي استفسار بخصوص المنتج")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 right-4 z-50 w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl transition transform hover:scale-110"
          title="تواصل مع الدعم عبر واتساب"
        >
          <span className="text-2xl font-bold">💬</span>
        </a>
      )}

      {/* زر الشراء العائم للموبايل */}
      {config.showStickyButton && (
        <div style={{ backgroundColor: `${theme.bg}ee`, borderColor: theme.border }} className="fixed bottom-0 left-0 right-0 p-3 backdrop-blur-md border-t sm:hidden z-40">
          <button
            onClick={scrollToCheckout}
            style={{ backgroundColor: theme.accent }}
            className="w-full text-black font-extrabold py-3 rounded-xl shadow-lg text-sm"
          >
            اطلب الآن — الدفع عند الاستلام ({config.currentPrice} {activeCountry.currency})
          </button>
        </div>
      )}

      <footer style={{ borderColor: theme.border }} className="border-t py-6 text-center text-xs opacity-50">
        <p>جميع الحقوق محفوظة © {new Date().getFullYear()} {config.storeName}</p>
      </footer>
    </div>
  );
}
