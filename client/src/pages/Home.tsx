import React, { useState, useEffect } from "react";

export type ThemeType = "royal" | "obsidian" | "silk" | "clinical";

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

// باليتات نظام الـ Luxury Editorial System المستوحاة من LUMA
const EDITORIAL_THEMES: Record<ThemeType, {
  bgGradient: string;
  glowColor: string;
  cardBg: string;
  cardBorder: string;
  accentGold: string;
  accentText: string;
  textMain: string;
  textMuted: string;
  divider: string;
}> = {
  // 1. Royal Amber: بنفسجي ليلي غامق مع ذهب شمبانيا مطفي (للعطور والتجميل)
  royal: {
    bgGradient: "radial-gradient(circle at 50% 15%, #241335 0%, #0c0714 65%, #07040c 100%)",
    glowColor: "rgba(223, 186, 115, 0.15)",
    cardBg: "rgba(24, 16, 36, 0.75)",
    cardBorder: "rgba(223, 186, 115, 0.2)",
    accentGold: "#dfba73",
    accentText: "#0c0714",
    textMain: "#faf7f2",
    textMuted: "#a599b5",
    divider: "rgba(255, 255, 255, 0.08)"
  },
  // 2. Obsidian Ember: أسود كربوني مع برتقالي نحاسي دافئ (للأحذية والتقنية)
  obsidian: {
    bgGradient: "radial-gradient(circle at 50% 15%, #1a2332 0%, #0c0e12 65%, #060709 100%)",
    glowColor: "rgba(229, 138, 60, 0.15)",
    cardBg: "rgba(21, 27, 36, 0.75)",
    cardBorder: "rgba(229, 138, 60, 0.25)",
    accentGold: "#e58a3c",
    accentText: "#0c0e12",
    textMain: "#f8fafc",
    textMuted: "#8b9bb4",
    divider: "rgba(255, 255, 255, 0.08)"
  },
  // 3. Cashmere Silk: إسبريسو ورمادي دافئ مع برونزي توسكاني (للأزياء الفاخرة)
  silk: {
    bgGradient: "radial-gradient(circle at 50% 15%, #2a221c 0%, #110f0e 65%, #080706 100%)",
    glowColor: "rgba(212, 163, 115, 0.15)",
    cardBg: "rgba(28, 24, 20, 0.75)",
    cardBorder: "rgba(212, 163, 115, 0.22)",
    accentGold: "#d4a373",
    accentText: "#110f0e",
    textMain: "#faf8f5",
    textMuted: "#a89c91",
    divider: "rgba(255, 255, 255, 0.08)"
  },
  // 4. Pure Clinical: أبيض عاجي سريري مع أزرق ملكي ياقوتي (للطب والعناية)
  clinical: {
    bgGradient: "radial-gradient(circle at 50% 15%, #f1f5f9 0%, #f8fafc 65%, #ffffff 100%)",
    glowColor: "rgba(30, 58, 138, 0.06)",
    cardBg: "#ffffff",
    cardBorder: "#cbd5e1",
    accentGold: "#1e3a8a",
    accentText: "#ffffff",
    textMain: "#0f172a",
    textMuted: "#64748b",
    divider: "rgba(15, 23, 42, 0.08)"
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
  storeName: "L U M A",
  logoUrl: "",
  selectedTheme: "royal",
  showTopBar: true,
  topBarText: "شحن مجاني لأول 100 طلب • ضمان استرجاع حقيقي ومعاينة مجانية",
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
  productTitle: "الشيء الصغير الذي يغير مزاج يومك.",
  productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
  gallery: [],
  currentPrice: 320,
  oldPrice: 500,
  features: [
    "تصميم استثنائي يجمع بين الهدوء والرفاهية المطلقة",
    "خامات مختارة بعناية فائقة تدوم طويلاً وتمنحك الثقة",
    "معاينة وقياس مجاني بالكامل قبل دفع أي مليم للمندوب"
  ],
  enableSizes: true,
  sizes: "41, 42, 43, 44, 45",
  enableColors: true,
  colors: "أسود ملكي, رمادي دخاني, كحلي ليل",
  showBundles: true,
  bundles: [
    { qty: 1, title: "قطعة واحدة", price: 320 },
    { qty: 2, title: "قطعتان (باقة التميز)", price: 580, badge: "الأكثر طلباً", savings: "وفر 60" }
  ],
  showGuarantee: true,
  guaranteeText: "معاينة مجانية كاملة عند باب منزلك قبل السداد",
  guaranteeSubtext: "يحق لك فحص الجودة وتجربة المنتج مع المندوب دون أي التزام",
  showReviews: true,
  reviews: [
    { name: "سارة م.", comment: "القطعة في الحقيقة أفخم بمراحل من الصور، إحساس فاخر جداً.", rating: 5 }
  ],
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

  const [timeLeft, setTimeLeft] = useState({ minutes: 11, seconds: 40 });
  const [recentSale, setRecentSale] = useState<{ name: string; city: string } | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    // تحميل خط فاخر ملكي ديناميكياً
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Tajawal:wght@300;400;500;700;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const saved = localStorage.getItem("store_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // التوافق مع المفاتيح القديمة أو الجديدة
        let themeKey = parsed.selectedTheme;
        if (themeKey === "sneakers") themeKey = "obsidian";
        if (themeKey === "perfume") themeKey = "royal";
        if (themeKey === "medical") themeKey = "clinical";
        if (themeKey === "fashion" || themeKey === "home" || themeKey === "kids") themeKey = "silk";

        const merged: StoreConfig = {
          ...DEFAULT_CONFIG,
          ...parsed,
          selectedTheme: themeKey || "royal",
          countries: { ...DEFAULT_COUNTRIES, ...(parsed.countries || {}) }
        };
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
      setSelectedColor("أسود ملكي");
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
        return { minutes: 11, seconds: 40 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [config.showTimer]);

  // إشعار الشراء اللحظي
  useEffect(() => {
    if (!config.showRecentSales) return;
    const activeC = config.countries[config.activeCountry] || DEFAULT_COUNTRIES.EG;
    const provs = activeC.provinces?.filter((p) => p.enabled).map((p) => p.name) || ["المدينة"];
    const names = ["عبدالرحمن", "عمر", "كريم", "ياسين", "خالد", "مريم", "نور"];

    const interval = setInterval(() => {
      const rName = names[Math.floor(Math.random() * names.length)];
      const rCity = provs[Math.floor(Math.random() * provs.length)];
      setRecentSale({ name: rName, city: rCity });
      setTimeout(() => setRecentSale(null), 5000);
    }, 24000);

    return () => clearInterval(interval);
  }, [config.showRecentSales, config.activeCountry, config.countries]);

  const currentThemeKey = (EDITORIAL_THEMES[config.selectedTheme] ? config.selectedTheme : "royal") as ThemeType;
  const theme = EDITORIAL_THEMES[currentThemeKey];

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

      const msg = `طلب جديد فخم:%0A- الاسم: ${fullName}%0A- الدولة: ${activeCountry.name}%0A- المحافظة: ${selectedProvince}%0A- العنوان: ${address}${spec}%0A- الكمية: ${selectedQty}%0A- الإجمالي: ${finalTotal} ${activeCountry.currency}%0A- الهاتف: ${phone}${altPhone ? ` (بديل: ${altPhone})` : ""}${notes ? `%0A- ملاحظات: ${notes}` : ""}`;
      const cleanPhone = config.whatsappNumber.replace(/[^0-9]/g, "");
      window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
    }
  };

  // شاشة الشكر الملكية (Order Received) المستوحاة من الصورة الثانية
  if (orderSuccess) {
    return (
      <div style={{ background: theme.bgGradient, color: theme.textMain, fontFamily: "'Tajawal', sans-serif" }} className="min-h-screen flex items-center justify-center p-4" dir="rtl">
        <div style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }} className="border backdrop-blur-xl p-8 rounded-3xl max-w-sm w-full text-center space-y-5 shadow-2xl">
          <div style={{ backgroundColor: theme.accentGold, color: theme.accentText }} className="w-14 h-14 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-lg">
            ✓
          </div>
          <p style={{ color: theme.accentGold }} className="text-[11px] font-mono tracking-widest uppercase">ORDER RECEIVED</p>
          <h2 style={{ fontFamily: "'Amiri', serif" }} className="text-3xl font-bold">طلبك في طريقه إلينا.</h2>
          <p style={{ color: theme.textMuted }} className="text-xs leading-relaxed">
            شكراً لثقتك يا {fullName}. سيتواصل معك فريق {config.storeName} قريباً لتأكيد بيانات الطلب وموعد الوصول. لا تحتاج إلى دفع مسبق.
          </p>
          <div style={{ borderColor: theme.divider }} className="border-t pt-4 text-xs">
            المستحق عند المعاينة: <b style={{ color: theme.accentGold }} className="text-base">{finalTotal} {activeCountry.currency}</b>
          </div>
          <button
            onClick={() => setOrderSuccess(false)}
            style={{ borderColor: theme.cardBorder, color: theme.textMain }}
            className="w-full border py-3 rounded-2xl text-xs hover:bg-white/5 transition flex items-center justify-center gap-2"
          >
            <span>↑ العودة إلى البداية</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: theme.bgGradient, color: theme.textMain, fontFamily: "'Tajawal', sans-serif" }} className="min-h-screen pb-28 selection:bg-amber-500/30 transition-all duration-500" dir="rtl">
      
      {/* 1. شريط الإعلان العلوي الرفيع والأنيق جداً */}
      {config.showTopBar && (
        <div style={{ backgroundColor: theme.accentGold, color: theme.accentText }} className="py-2 px-4 text-xs font-bold text-center sticky top-0 z-50 shadow-sm flex items-center justify-center gap-3">
          <button onClick={scrollToCheckout} className="flex items-center gap-1 font-black underline underline-offset-4 hover:opacity-80 transition text-[11px]">
            <span>اطلب الآن ←</span>
          </button>
          <span className="opacity-90">• {config.topBarText} •</span>
          {config.showTimer && (
            <span className="font-mono text-[11px] font-black tracking-wider bg-black/20 px-2 py-0.5 rounded">
              {String(timeLeft.minutes).padStart(2, "0")} : {String(timeLeft.seconds).padStart(2, "0")}
            </span>
          )}
        </div>
      )}

      {/* 2. الهيدر المينيمال المفرغ (Minimal Nav) */}
      <header style={{ borderColor: theme.divider }} className="border-b backdrop-blur-md sticky top-8 z-40 bg-black/10">
        <div className="max-w-3xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span style={{ borderColor: theme.accentGold, color: theme.accentGold }} className="w-8 h-8 rounded-full border flex items-center justify-center font-serif text-sm font-bold shadow-sm">
              {config.storeName.charAt(0)}
            </span>
            <span className="font-bold tracking-widest text-sm uppercase">{config.storeName}</span>
          </div>
          <button
            onClick={scrollToCheckout}
            style={{ backgroundColor: theme.accentGold, color: theme.accentText }}
            className="font-bold px-4 py-1.5 rounded-full text-xs shadow-md hover:opacity-90 transition"
          >
            امتلكه الآن ←
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pt-8 space-y-9">
        
        {/* 3. العنوان الافتتاحي الملكي والعبارة الشاعرية (Editorial Hero) */}
        <div className="text-center space-y-4 pt-2">
          <div className="inline-flex items-center gap-2">
            <span style={{ backgroundColor: theme.accentGold }} className="w-6 h-[1.5px]" />
            <span style={{ color: theme.accentGold }} className="text-xs tracking-widest font-medium">طقس يومي، بصياغة أجمل</span>
            <span style={{ backgroundColor: theme.accentGold }} className="w-6 h-[1.5px]" />
          </div>

          <h1 style={{ fontFamily: "'Amiri', serif" }} className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
            {config.productTitle}
          </h1>

          <p style={{ color: theme.textMuted }} className="text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            قطعة تجمع بين الأصالة والهدوء، والتصميم النظيف، وإحساس الرفاهية الذي تستحقه مساحتك الخاصة.
          </p>

          {/* الزر المزدوج الراقي تماماً مثل الصورة الأولى */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={scrollToCheckout}
              style={{ backgroundColor: theme.accentGold, color: theme.accentText }}
              className="px-6 py-2.5 rounded-full text-xs font-extrabold shadow-lg hover:opacity-95 transition flex items-center gap-2"
            >
              <span>امتلكه الآن ←</span>
            </button>
            <button
              onClick={scrollToCheckout}
              style={{ borderColor: theme.cardBorder, color: theme.textMuted }}
              className="border px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-white/5 transition flex items-center gap-2"
            >
              <span>اكتشف القصة ←</span>
            </button>
          </div>
        </div>

        {/* 4. كارت عرض الصورة بإضاءة سينمائية */}
        <div className="relative group">
          <div style={{ background: theme.glowColor }} className="absolute inset-0 blur-3xl rounded-full opacity-60 pointer-events-none" />
          <div style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }} className="relative border rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
            <img src={config.productImage} alt={config.productTitle} className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition duration-700" />
            
            {/* عرض السعر الراقي المينيمال داخل البطاقة */}
            <div style={{ borderColor: theme.divider, background: "rgba(0,0,0,0.5)" }} className="p-4 border-t backdrop-blur-md flex items-center justify-between">
              <div>
                <span style={{ color: theme.textMuted }} className="text-[11px] block">سعر الإطلاق الحصري</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span style={{ color: theme.accentGold }} className="text-2xl sm:text-3xl font-black font-sans">
                    {config.currentPrice} {activeCountry.currency}
                  </span>
                  {config.oldPrice > config.currentPrice && (
                    <span style={{ color: theme.textMuted }} className="line-through text-sm opacity-60 font-sans">
                      {config.oldPrice} {activeCountry.currency}
                    </span>
                  )}
                </div>
              </div>
              <span style={{ color: theme.accentGold, borderColor: theme.cardBorder }} className="border px-3 py-1 rounded-full text-[10px] font-mono">
                يشمل الشحن والتغليف الفاخر
              </span>
            </div>
          </div>
        </div>

        {/* 5. شريط ندرة القطع المتبقية */}
        {config.showStockBar && (
          <div style={{ borderColor: theme.cardBorder, backgroundColor: theme.cardBg }} className="border rounded-2xl p-4 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-red-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>إصدار محدود — متبقي {config.stockLeft} قطع فقط للدفعة الحالية</span>
            </div>
            <div className="w-full sm:w-44 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div style={{ width: `${Math.min(100, Math.max(15, config.stockLeft * 12))}%`, backgroundColor: theme.accentGold }} className="h-full rounded-full" />
            </div>
          </div>
        )}

        {/* 6. المقاسات والألوان إن وجدت */}
        {(config.enableSizes || config.enableColors) && (
          <div style={{ borderColor: theme.cardBorder, backgroundColor: theme.cardBg }} className="border rounded-3xl p-6 backdrop-blur-md space-y-4">
            {config.enableSizes && config.sizes && (
              <div className="space-y-2">
                <label style={{ color: theme.textMuted }} className="block text-xs font-semibold">
                  المقاس المختار: <b style={{ color: theme.accentGold }}>{selectedSize}</b>
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
                          borderColor: active ? theme.accentGold : theme.cardBorder,
                          backgroundColor: active ? theme.accentGold : "transparent",
                          color: active ? theme.accentText : theme.textMain
                        }}
                        className="border px-4 py-1.5 rounded-xl text-xs font-bold transition"
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
                <label style={{ color: theme.textMuted }} className="block text-xs font-semibold">
                  اللون المختار: <b style={{ color: theme.accentGold }}>{selectedColor}</b>
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
                          borderColor: active ? theme.accentGold : theme.cardBorder,
                          backgroundColor: active ? theme.accentGold : "transparent",
                          color: active ? theme.accentText : theme.textMain
                        }}
                        className="border px-4 py-1.5 rounded-xl text-xs font-bold transition"
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

        {/* 7. مميزات المنتج */}
        <div style={{ borderColor: theme.cardBorder, backgroundColor: theme.cardBg }} className="border rounded-3xl p-6 backdrop-blur-md space-y-3">
          <h3 style={{ color: theme.accentGold }} className="font-bold text-sm tracking-wider uppercase">تفاصيل الصنعة والجودة:</h3>
          <ul className="space-y-2.5 text-xs sm:text-sm">
            {config.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span style={{ color: theme.accentGold }} className="font-serif font-bold">✦</span>
                <span style={{ color: theme.textMain }} className="opacity-90">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 8. باقات التوفير */}
        {config.showBundles && (
          <div className="space-y-3">
            <h3 style={{ fontFamily: "'Amiri', serif" }} className="text-xl font-bold text-center">باقات الإصدار الخاص</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {config.bundles.map((b) => {
                const isSelected = selectedQty === b.qty;
                return (
                  <div
                    key={b.qty}
                    onClick={() => setSelectedQty(b.qty)}
                    style={{
                      borderColor: isSelected ? theme.accentGold : theme.cardBorder,
                      backgroundColor: isSelected ? "rgba(223, 186, 115, 0.08)" : theme.cardBg
                    }}
                    className="cursor-pointer border-2 rounded-2xl p-4 text-center relative transition backdrop-blur-md"
                  >
                    {b.badge && (
                      <span style={{ backgroundColor: theme.accentGold, color: theme.accentText }} className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-black px-3 py-0.5 rounded-full shadow-md">
                        {b.badge}
                      </span>
                    )}
                    <p className="font-bold text-sm">{b.title}</p>
                    <p style={{ color: theme.accentGold }} className="text-2xl font-black font-sans my-1">
                      {b.price} {activeCountry.currency}
                    </p>
                    {b.savings && <p style={{ color: theme.textMuted }} className="text-[11px] font-mono">{b.savings} {activeCountry.currency}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 9. نموذج تأكيد الطلب السلس والمحكم */}
        <section id="checkout-form" style={{ borderColor: theme.cardBorder, backgroundColor: theme.cardBg }} className="border rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="text-center space-y-1.5 border-b pb-4" style={{ borderColor: theme.divider }}>
            <h2 style={{ fontFamily: "'Amiri', serif" }} className="text-3xl font-bold">اترك بياناتك، ونحن نكمل الباقي.</h2>
            <p style={{ color: theme.textMuted }} className="text-xs leading-relaxed">
              سنراجع طلبك ونتواصل معك هاتفياً للتأكيد قبل الشحن. لا تحتاج إلى دفع مسبق.
            </p>
          </div>

          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div>
              <label style={{ color: theme.textMuted }} className="block text-xs mb-1 font-medium">الاسم الكريم *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="اكتب اسمك الثلاثي"
                style={{ borderColor: theme.cardBorder, backgroundColor: "rgba(0,0,0,0.3)", color: theme.textMain }}
                className="w-full border rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-amber-400/80"
              />
            </div>

            <div>
              <label style={{ color: theme.textMuted }} className="block text-xs mb-1 font-medium">
                المحافظة أو المدينة ({activeCountry.name}) *
              </label>
              <select
                required
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                style={{ borderColor: theme.cardBorder, backgroundColor: "rgba(0,0,0,0.4)", color: theme.textMain }}
                className="w-full border rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none"
              >
                {enabledProvinces.map((p) => (
                  <option key={p.id} value={p.name} className="bg-neutral-900 text-white">
                    {p.name} {p.shippingCost === 0 ? "(شحن مجاني ومعاينة)" : `(شحن: ${p.shippingCost} ${activeCountry.currency})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label style={{ color: theme.textMuted }} className="block text-xs mb-1 font-medium">رقم الهاتف للتواصل *</label>
                <div className="flex items-center gap-1.5" dir="ltr">
                  <span style={{ borderColor: theme.cardBorder, backgroundColor: "rgba(0,0,0,0.3)", color: theme.textMuted }} className="border text-xs px-3 py-3 rounded-xl font-mono">
                    {activeCountry.phoneCode}
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="رقم الهاتف"
                    style={{ borderColor: theme.cardBorder, backgroundColor: "rgba(0,0,0,0.3)", color: theme.textMain }}
                    className="w-full border rounded-xl px-4 py-3 text-xs sm:text-sm text-left focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label style={{ color: theme.textMuted }} className="block text-xs mb-1 font-medium">رقم بديل (اختياري)</label>
                <div className="flex items-center gap-1.5" dir="ltr">
                  <span style={{ borderColor: theme.cardBorder, backgroundColor: "rgba(0,0,0,0.3)", color: theme.textMuted }} className="border text-xs px-3 py-3 rounded-xl font-mono">
                    {activeCountry.phoneCode}
                  </span>
                  <input
                    type="tel"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    placeholder="رقم آخر إن وجد"
                    style={{ borderColor: theme.cardBorder, backgroundColor: "rgba(0,0,0,0.3)", color: theme.textMain }}
                    className="w-full border rounded-xl px-4 py-3 text-xs sm:text-sm text-left focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={{ color: theme.textMuted }} className="block text-xs mb-1 font-medium">العنوان بالتفصيل *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="الحي، اسم الشارع، رقم العقار أو علامة مميزة"
                style={{ borderColor: theme.cardBorder, backgroundColor: "rgba(0,0,0,0.3)", color: theme.textMain }}
                className="w-full border rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none"
              />
            </div>

            <div>
              <label style={{ color: theme.textMuted }} className="block text-xs mb-1 font-medium">ملاحظات خاصة بالتسليم (اختياري)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي توجيهات تود إبلاغ المندوب بها"
                style={{ borderColor: theme.cardBorder, backgroundColor: "rgba(0,0,0,0.3)", color: theme.textMain }}
                className="w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none resize-none"
              />
            </div>

            {/* ملخص الدفع عند الاستلام */}
            <div style={{ borderColor: theme.divider, backgroundColor: "rgba(0,0,0,0.2)" }} className="p-4 rounded-2xl border space-y-2 text-xs">
              <div className="flex justify-between" style={{ color: theme.textMuted }}>
                <span>قيمة القطع:</span>
                <span className="font-mono">{productSubtotal} {activeCountry.currency}</span>
              </div>
              <div className="flex justify-between" style={{ color: theme.textMuted }}>
                <span>رسوم التوصيل والمعاينة:</span>
                <span className={shippingCost === 0 ? "font-bold text-emerald-400" : "font-mono"}>
                  {shippingCost === 0 ? "مجاناً بالكامل" : `${shippingCost} ${activeCountry.currency}`}
                </span>
              </div>
              <div style={{ borderColor: theme.divider }} className="border-t pt-2 flex justify-between items-center font-bold">
                <span>المبلغ المستحق بعد المعاينة:</span>
                <span style={{ color: theme.accentGold }} className="text-2xl font-black font-sans">
                  {finalTotal} {activeCountry.currency}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: theme.accentGold, color: theme.accentText }}
              className="w-full font-black text-sm sm:text-base py-4 rounded-2xl shadow-xl hover:opacity-95 transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? "جاري تسجيل طلبك بأمان..." : "تأكيد الطلب — الدفع بعد المعاينة عند الاستلام ←"}
            </button>
          </form>
        </section>

        {/* 10. بطاقة الضمان الفاخر */}
        {config.showGuarantee && (
          <div style={{ borderColor: theme.cardBorder, backgroundColor: theme.cardBg }} className="border rounded-2xl p-5 flex items-center gap-4 backdrop-blur-md">
            <span style={{ color: theme.accentGold }} className="text-3xl">⚜️</span>
            <div>
              <p className="font-bold text-xs sm:text-sm">{config.guaranteeText}</p>
              {config.guaranteeSubtext && <p style={{ color: theme.textMuted }} className="text-[11px] mt-0.5">{config.guaranteeSubtext}</p>}
            </div>
          </div>
        )}
      </main>

      {/* إشعار الشراء اللحظي المنبثق بنعومة */}
      {recentSale && (
        <div style={{ backgroundColor: theme.cardBg, borderColor: theme.accentGold }} className="fixed bottom-20 left-4 z-50 border p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs backdrop-blur-xl animate-fade-in">
          <div style={{ backgroundColor: "rgba(223, 186, 115, 0.2)", color: theme.accentGold }} className="w-8 h-8 rounded-full flex items-center justify-center font-bold">
            ✦
          </div>
          <div>
            <p className="font-bold">أكد {recentSale.name} من {recentSale.city} طلبه</p>
            <p style={{ color: theme.textMuted }} className="text-[10px]">منذ بضع دقائق</p>
          </div>
        </div>
      )}

      {/* زر واتساب الدعم العائم الراقي */}
      {config.showSupportWhatsapp && config.supportWhatsappNumber && (
        <a
          href={`https://wa.me/${config.supportWhatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("مرحباً، أود الاستفسار عن تفاصيل المنتج")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-24 right-4 z-50 w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl border-2 border-white/80 transition transform hover:scale-110"
          title="خدمة العملاء عبر واتساب"
        >
          <span className="text-2xl">💬</span>
        </a>
      )}

      {/* زر الشراء العائم للموبايل في الأسفل */}
      {config.showStickyButton && (
        <div style={{ backgroundColor: "rgba(10, 5, 16, 0.88)", borderColor: theme.divider }} className="fixed bottom-0 left-0 right-0 p-3.5 backdrop-blur-xl border-t sm:hidden z-40">
          <button
            onClick={scrollToCheckout}
            style={{ backgroundColor: theme.accentGold, color: theme.accentText }}
            className="w-full font-black py-3.5 rounded-2xl shadow-xl text-xs sm:text-sm tracking-wide"
          >
            اطلب الآن — الدفع عند الاستلام ({config.currentPrice} {activeCountry.currency})
          </button>
        </div>
      )}

      <footer style={{ borderColor: theme.divider }} className="border-t py-8 text-center text-xs opacity-40 mt-16">
        <p>جميع الحقوق محفوظة © {new Date().getFullYear()} {config.storeName}</p>
      </footer>
    </div>
  );
}
