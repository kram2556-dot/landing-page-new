import React, { useState, useEffect } from "react";

export type ThemeType = "sneakers" | "perfume" | "fashion" | "medical" | "home" | "kids";

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
  adminEmail: string;
  adminPassword?: string;
  logoUrl: string;
  selectedTheme: ThemeType;
  showTopBar: boolean;
  topBarText: string;
  showTimer: boolean;
  timerMinutes: number;
  showStockBar: boolean;
  stockLeft: number;
  showBadge: boolean;
  badgeText: string;
  guaranteeBadgeText: string;
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
  googlePixelId: string;
}

const THEME_STYLES: Record<ThemeType, {
  bg: string;
  cardBg: string;
  border: string;
  accent: string;
  accentText: string;
  textMain: string;
  textMuted: string;
  inputBg: string;
  inputBorder: string;
  isLight: boolean;
}> = {
  sneakers: {
    bg: "#0c0e12",
    cardBg: "#151b24",
    border: "#283547",
    accent: "#f59e0b",
    accentText: "#000000",
    textMain: "#f8fafc",
    textMuted: "#94a3b8",
    inputBg: "#0f1319",
    inputBorder: "#283547",
    isLight: false
  },
  perfume: {
    bg: "#0c0714",
    cardBg: "#181024",
    border: "rgba(223, 186, 115, 0.25)",
    accent: "#dfba73",
    accentText: "#0c0714",
    textMain: "#faf7f2",
    textMuted: "#a599b5",
    inputBg: "#120b1e",
    inputBorder: "#34224c",
    isLight: false
  },
  fashion: {
    bg: "#110f0e",
    cardBg: "#1c1814",
    border: "#3d352c",
    accent: "#d4a373",
    accentText: "#110f0e",
    textMain: "#faf8f5",
    textMuted: "#a89c91",
    inputBg: "#151210",
    inputBorder: "#3a3026",
    isLight: false
  },
  medical: {
    bg: "#f8fafc",
    cardBg: "#ffffff",
    border: "#cbd5e1",
    accent: "#0284c7",
    accentText: "#ffffff",
    textMain: "#0f172a",
    textMuted: "#475569",
    inputBg: "#ffffff",
    inputBorder: "#cbd5e1",
    isLight: true
  },
  home: {
    bg: "#0a0f1d",
    cardBg: "#111827",
    border: "#1f2937",
    accent: "#3b82f6",
    accentText: "#ffffff",
    textMain: "#f9fafb",
    textMuted: "#9ca3af",
    inputBg: "#0c1322",
    inputBorder: "#24324d",
    isLight: false
  },
  kids: {
    bg: "#f4f7f5",
    cardBg: "#ffffff",
    border: "#dcfce7",
    accent: "#10b981",
    accentText: "#ffffff",
    textMain: "#064e3b",
    textMuted: "#374151",
    inputBg: "#ffffff",
    inputBorder: "#a7f3d0",
    isLight: true
  }
};

const COLOR_MAP: Record<string, string> = {
  "أسود": "#111111",
  "اسود": "#111111",
  "black": "#111111",
  "أبيض": "#f8fafc",
  "ابيض": "#f8fafc",
  "white": "#f8fafc",
  "رمادي": "#6b7280",
  "رمادى": "#6b7280",
  "رصاصي": "#9ca3af",
  "gray": "#6b7280",
  "grey": "#6b7280",
  "كحلي": "#1e293b",
  "كحلى": "#1e293b",
  "navy": "#1e293b",
  "أزرق": "#2563eb",
  "ازرق": "#2563eb",
  "blue": "#2563eb",
  "أحمر": "#dc2626",
  "احمر": "#dc2626",
  "red": "#dc2626",
  "أصفر": "#eab308",
  "اصفر": "#eab308",
  "yellow": "#eab308",
  "أخضر": "#16a34a",
  "اخضر": "#16a34a",
  "green": "#16a34a",
  "زيتي": "#4d5b38",
  "بيج": "#d4b996",
  "beige": "#d4b996",
  "بني": "#78350f",
  "بنى": "#78350f",
  "brown": "#78350f",
  "برتقالي": "#ea580c",
  "برتقالى": "#ea580c",
  "orange": "#ea580c"
};

const resolveColorSwatch = (colorName: string): { bg: string; border: string } => {
  const clean = colorName.trim().toLowerCase();
  for (const [key, val] of Object.entries(COLOR_MAP)) {
    if (clean.includes(key)) {
      return { bg: val, border: val === "#f8fafc" ? "#94a3b8" : "transparent" };
    }
  }
  return { bg: "#64748b", border: "transparent" };
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
  },
  SA: {
    code: "SA",
    name: "السعودية",
    currency: "ر.س",
    phoneCode: "+966",
    provinces: [
      { id: "riyadh", name: "الرياض", enabled: true, shippingCost: 0 },
      { id: "jeddah", name: "جدة", enabled: true, shippingCost: 0 }
    ]
  },
  AE: {
    code: "AE",
    name: "الإمارات",
    currency: "د.إ",
    phoneCode: "+971",
    provinces: [
      { id: "dubai", name: "دبي", enabled: true, shippingCost: 0 },
      { id: "abudhabi", name: "أبوظبي", enabled: true, shippingCost: 0 }
    ]
  },
  LY: {
    code: "LY",
    name: "ليبيا",
    currency: "د.ل",
    phoneCode: "+218",
    provinces: [
      { id: "tripoli", name: "طرابلس", enabled: true, shippingCost: 0 },
      { id: "benghazi", name: "بنغازي", enabled: true, shippingCost: 0 }
    ]
  }
};

const DEFAULT_CONFIG: StoreConfig = {
  storeName: "متجر النخبة",
  adminEmail: "admin@example.com",
  adminPassword: "admin",
  logoUrl: "",
  selectedTheme: "sneakers",
  showTopBar: true,
  topBarText: "عرض خاص لفترة محدودة — شحن سريع وتوصيل للمنزل",
  showTimer: true,
  timerMinutes: 15,
  showStockBar: true,
  stockLeft: 7,
  showBadge: true,
  badgeText: "معاينة مجانية للمنتج قبل الدفع",
  guaranteeBadgeText: "يشمل التوصيل والتغليف",
  showRecentSales: true,
  showStickyButton: true,
  showSupportWhatsapp: true,
  supportWhatsappNumber: "+201000000000",
  activeCountry: "EG",
  countries: DEFAULT_COUNTRIES,
  productTitle: "حذاء مريح وخفيف للجري والمشي الطويل",
  productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
  gallery: [],
  currentPrice: 320,
  oldPrice: 500,
  features: [
    "خامات ممتازة ومرنة تمنح القدم تهوية وراحة تامة",
    "نعل ممتص للصدمات ومقاوم للانزلاق في كل الأوقات",
    "معاينة وقياس مجاني بالكامل قبل دفع أي مليم للمندوب"
  ],
  enableSizes: true,
  sizes: "41, 42, 43, 44, 45",
  enableColors: true,
  colors: "أسود, كحلي, رمادي, أصفر",
  showBundles: true,
  bundles: [
    { qty: 1, title: "قطعة واحدة", price: 320 },
    { qty: 2, title: "قطعتان (باقة التوفير)", price: 580, badge: "الأكثر طلباً", savings: "وفر 60" }
  ],
  showGuarantee: true,
  guaranteeText: "معاينة مجانية كاملة عند باب منزلك قبل السداد",
  guaranteeSubtext: "يحق لك فحص الجودة وتجربة المقاس مع المندوب دون أي التزام",
  showReviews: true,
  reviews: [
    { name: "محمود س.", comment: "ممتاز جداً وخامته مريحة ومطابق للوصف بالظبط.", rating: 5 }
  ],
  whatsappNumber: "+201000000000",
  metaPixelId: "",
  tiktokPixelId: "",
  googlePixelId: ""
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

  // جلب البيانات من Cloudflare KV مباشرة
  useEffect(() => {
    fetch('/api/store')
      .then(res => res.json())
      .then(cloudData => {
        if (cloudData && Object.keys(cloudData).length > 0) {
          applyStoreConfig(cloudData);
        } else {
          loadFromLocal();
        }
      })
      .catch(() => loadFromLocal());

    function loadFromLocal() {
      const saved = localStorage.getItem("store_config");
      if (saved) {
        try {
          applyStoreConfig(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      } else {
        setSelectedSize("41");
        setSelectedColor("أسود");
        setSelectedProvince("القاهرة");
      }
    }

    function applyStoreConfig(data: any) {
      let themeKey = data.selectedTheme;
      if (themeKey === "royal") themeKey = "perfume";
      if (themeKey === "obsidian") themeKey = "sneakers";
      if (themeKey === "silk") themeKey = "fashion";
      if (themeKey === "clinical") themeKey = "medical";

      const merged: StoreConfig = {
        ...DEFAULT_CONFIG,
        ...data,
        selectedTheme: themeKey || "sneakers",
        countries: { ...DEFAULT_COUNTRIES, ...(data.countries || {}) }
      };
      setConfig(merged);

      if (merged.enableSizes && merged.sizes) {
        const sList = merged.sizes.split(/[,،]+/).map((s: string) => s.trim()).filter(Boolean);
        if (sList.length > 0) setSelectedSize(sList[0]);
      }
      if (merged.enableColors && merged.colors) {
        const cList = merged.colors.split(/[,،]+/).map((c: string) => c.trim()).filter(Boolean);
        if (cList.length > 0) setSelectedColor(cList[0]);
      }

      const activeC = merged.countries[merged.activeCountry] || DEFAULT_COUNTRIES.EG;
      const firstActiveProv = activeC.provinces?.find((p) => p.enabled);
      if (firstActiveProv) setSelectedProvince(firstActiveProv.name);
    }
  }, []);

  // تشغيل بكسل جوجل
  useEffect(() => {
    if (config.googlePixelId) {
      const gScript = document.createElement("script");
      gScript.async = true;
      gScript.src = `https://www.googletagmanager.com/gtag/js?id=${config.googlePixelId}`;
      document.head.appendChild(gScript);

      const inlineScript = document.createElement("script");
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${config.googlePixelId}');
      `;
      document.head.appendChild(inlineScript);
    }
  }, [config.googlePixelId]);

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

  useEffect(() => {
    if (!config.showRecentSales) return;
    const activeC = config.countries[config.activeCountry] || DEFAULT_COUNTRIES.EG;
    const provs = activeC.provinces?.filter((p) => p.enabled).map((p) => p.name) || ["المدينة"];
    const names = ["كريم", "أحمد", "عمر", "محمود", "يوسف", "خالد", "عبدالله"];

    const interval = setInterval(() => {
      const rName = names[Math.floor(Math.random() * names.length)];
      const rCity = provs[Math.floor(Math.random() * provs.length)];
      setRecentSale({ name: rName, city: rCity });
      setTimeout(() => setRecentSale(null), 5000);
    }, 24000);

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

  const sizeList = config.sizes ? config.sizes.split(/[,،]+/).map((s) => s.trim()).filter(Boolean) : [];
  const colorList = config.colors ? config.colors.split(/[,،]+/).map((c) => c.trim()).filter(Boolean) : [];

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

    if (typeof (window as any).gtag === "function" && config.googlePixelId) {
      (window as any).gtag("event", "purchase", {
        value: finalTotal,
        currency: activeCountry.currency
      });
    }

    setIsSubmitting(false);
    setOrderSuccess(true);

    if (config.whatsappNumber) {
      let spec = "";
      if (config.enableSizes && selectedSize) spec += `%0A- المقاس: ${selectedSize}`;
      if (config.enableColors && selectedColor) spec += `%0A- اللون: ${selectedColor}`;

      const msg = `طلب جديد:%0A- الاسم: ${fullName}%0A- الدولة: ${activeCountry.name}%0A- المحافظة: ${selectedProvince}%0A- العنوان: ${address}${spec}%0A- الكمية: ${selectedQty}%0A- الإجمالي: ${finalTotal} ${activeCountry.currency}%0A- الهاتف: ${phone}${altPhone ? ` (بديل: ${altPhone})` : ""}${notes ? `%0A- ملاحظات: ${notes}` : ""}`;
      const cleanPhone = config.whatsappNumber.replace(/[^0-9]/g, "");
      window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
    }
  };

  if (orderSuccess) {
    return (
      <div style={{ backgroundColor: theme.bg, color: theme.textMain, fontFamily: "'Cairo', sans-serif" }} className="min-h-screen flex items-center justify-center p-4" dir="rtl">
        <div style={{ backgroundColor: theme.cardBg, borderColor: theme.border }} className="border p-8 rounded-3xl max-w-sm w-full text-center space-y-5 shadow-2xl">
          <div style={{ backgroundColor: theme.accent, color: theme.accentText }} className="w-14 h-14 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-lg">
            ✓
          </div>
          <p style={{ color: theme.accent }} className="text-[11px] font-mono tracking-widest uppercase">ORDER CONFIRMED</p>
          <h2 className="text-2xl font-black">تم تسجيل طلبك بنجاح!</h2>
          <p style={{ color: theme.textMuted }} className="text-xs leading-relaxed">
            شكراً لطلبك يا {fullName}. سنتواصل معك لتأكيد موعد المعاينة والتسليم عند باب المنزل دون دفع مسبق.
          </p>
          <div style={{ borderColor: theme.border }} className="border-t pt-4 text-xs">
            المستحق عند الاستلام: <b style={{ color: theme.accent }} className="text-base">{finalTotal} {activeCountry.currency}</b>
          </div>
          <button
            onClick={() => setOrderSuccess(false)}
            style={{ backgroundColor: theme.accent, color: theme.accentText }}
            className="w-full font-bold py-3 rounded-2xl text-xs shadow-md transition"
          >
            العودة للمتجر
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.textMain, fontFamily: "'Cairo', sans-serif" }} className="min-h-screen pb-28 transition-colors duration-300" dir="rtl">
      
      {/* شريط الإعلان العلوي */}
      {config.showTopBar && (
        <div style={{ backgroundColor: theme.accent, color: theme.accentText }} className="py-2.5 px-4 text-xs font-bold text-center sticky top-0 z-50 shadow-md flex items-center justify-center gap-3">
          <button onClick={scrollToCheckout} className="flex items-center gap-1 font-black underline underline-offset-4 hover:opacity-80 transition text-[11px]">
            <span>اطلب الآن ←</span>
          </button>
          <span className="opacity-95">• {config.topBarText} •</span>
          {config.showTimer && (
            <span className="font-mono text-[11px] font-black tracking-wider bg-black/20 text-white px-2 py-0.5 rounded">
              {String(timeLeft.minutes).padStart(2, "0")} : {String(timeLeft.seconds).padStart(2, "0")}
            </span>
          )}
        </div>
      )}

      {/* الهيدر */}
      <header style={{ borderColor: theme.border, backgroundColor: theme.isLight ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.3)" }} className="border-b backdrop-blur-md sticky top-8 z-40">
        <div className="max-w-3xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt={config.storeName} className="h-9 object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <span style={{ borderColor: theme.accent, color: theme.accent }} className="w-8 h-8 rounded-full border flex items-center justify-center text-sm font-black shadow-sm">
                  {config.storeName.charAt(0)}
                </span>
                <span className="font-black tracking-wide text-sm">{config.storeName}</span>
              </div>
            )}
          </div>
          <button
            onClick={scrollToCheckout}
            style={{ backgroundColor: theme.accent, color: theme.accentText }}
            className="font-black px-4 py-1.5 rounded-full text-xs shadow-md hover:opacity-90 transition"
          >
            اطلب الآن ←
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-4 space-y-6">
        
        {/* عنوان وسعر المنتج */}
        <div className="text-center space-y-1.5 pt-0">
          <h1 style={{ color: theme.textMain }} className="text-xl sm:text-2xl font-black leading-snug px-2 m-0">
            {config.productTitle}
          </h1>

          <div className="flex items-center justify-center gap-3 py-1" dir="rtl">
            <span style={{ color: theme.accent }} className="text-3xl sm:text-4xl font-black">
              {config.currentPrice} {activeCountry.currency}
            </span>
            {config.oldPrice > config.currentPrice && (
              <span style={{ color: theme.textMuted }} className="line-through text-base sm:text-lg opacity-60">
                {config.oldPrice} {activeCountry.currency}
              </span>
            )}
          </div>

          <div className="pt-0.5">
            <button
              onClick={scrollToCheckout}
              style={{ backgroundColor: theme.accent, color: theme.accentText }}
              className="px-8 py-2.5 rounded-full text-xs sm:text-sm font-black shadow-lg hover:opacity-95 transition"
            >
              اطلب الآن — الدفع عند الاستلام بعد المعاينة ←
            </button>
          </div>
        </div>

        {/* كارت عرض الصورة الأساسية مع التحكم في المعاينة والبادج */}
        <div style={{ backgroundColor: theme.cardBg, borderColor: theme.border }} className="border rounded-3xl overflow-hidden shadow-2xl">
          <img src={config.productImage} alt={config.productTitle} className="w-full h-80 sm:h-96 object-cover" />
          
          {config.showBadge && (
            <div style={{ borderColor: theme.border, backgroundColor: theme.isLight ? "#f1f5f9" : "rgba(0,0,0,0.55)" }} className="p-4 border-t flex items-center justify-between text-xs">
              <span style={{ color: theme.textMain }} className="font-bold">{config.badgeText || "معاينة مجانية للمنتج قبل الدفع"}</span>
              {config.guaranteeBadgeText && (
                <span style={{ color: theme.accent, borderColor: theme.border }} className="border px-3 py-1 rounded-full text-[11px] font-bold">
                  {config.guaranteeBadgeText}
                </span>
              )}
            </div>
          )}
        </div>

        {/* شريط ندرة القطع المتبقية */}
        {config.showStockBar && (
          <div style={{ borderColor: theme.border, backgroundColor: theme.cardBg }} className="border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm">
            <div className="flex items-center gap-2 text-red-500 font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>إصدار محدود — متبقي {config.stockLeft} قطع فقط للدفعة الحالية</span>
            </div>
            <div className="w-full sm:w-44 h-2 bg-black/10 rounded-full overflow-hidden">
              <div style={{ width: `${Math.min(100, Math.max(15, config.stockLeft * 12))}%`, backgroundColor: theme.accent }} className="h-full rounded-full" />
            </div>
          </div>
        )}

        {/* دوائر الألوان البصرية والمقاسات */}
        {(config.enableSizes || config.enableColors) && (
          <div style={{ borderColor: theme.border, backgroundColor: theme.cardBg }} className="border rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
            
            {config.enableSizes && sizeList.length > 0 && (
              <div className="space-y-2.5">
                <label style={{ color: theme.textMuted }} className="block text-xs font-bold">
                  المقاس المختار: <b style={{ color: theme.accent }}>{selectedSize}</b>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {sizeList.map((size) => {
                    const active = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        style={{
                          borderColor: active ? theme.accent : theme.border,
                          backgroundColor: active ? theme.accent : (theme.isLight ? "#f8fafc" : "transparent"),
                          color: active ? theme.accentText : theme.textMain
                        }}
                        className="border min-w-[50px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-sm"
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {config.enableColors && colorList.length > 0 && (
              <div className="space-y-2.5">
                <label style={{ color: theme.textMuted }} className="block text-xs font-bold">
                  اللون المختار: <b style={{ color: theme.accent }}>{selectedColor}</b>
                </label>
                <div className="flex flex-wrap gap-3">
                  {colorList.map((colorName) => {
                    const active = selectedColor === colorName;
                    const swatch = resolveColorSwatch(colorName);

                    return (
                      <button
                        key={colorName}
                        type="button"
                        onClick={() => setSelectedColor(colorName)}
                        style={{
                          borderColor: active ? theme.accent : theme.border,
                          backgroundColor: active ? (theme.isLight ? "#f1f5f9" : "rgba(255,255,255,0.08)") : "transparent"
                        }}
                        className={`flex items-center gap-2.5 border-2 px-3.5 py-2 rounded-2xl transition shadow-sm ${
                          active ? "scale-105" : "opacity-80"
                        }`}
                      >
                        <span
                          style={{
                            backgroundColor: swatch.bg,
                            borderColor: swatch.border !== "transparent" ? swatch.border : "rgba(0,0,0,0.15)"
                          }}
                          className="w-5 h-5 rounded-full border shadow-inner flex-shrink-0"
                        />
                        <span style={{ color: active ? theme.accent : theme.textMain }} className="text-xs font-bold">
                          {colorName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* مميزات المنتج */}
        <div style={{ borderColor: theme.border, backgroundColor: theme.cardBg }} className="border rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
          <h3 style={{ color: theme.accent }} className="font-extrabold text-sm">مميزات وتفاصيل الجودة:</h3>
          <ul className="space-y-2.5 text-xs sm:text-sm">
            {config.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span style={{ color: theme.accent }} className="font-black">✓</span>
                <span style={{ color: theme.textMain }} className="opacity-95">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* معرض الصور التوضيحي مع الشرح */}
        {config.gallery && config.gallery.length > 0 && (
          <div className="space-y-4">
            <h3 style={{ color: theme.textMain }} className="font-black text-base text-center">تفاصيل المنتج عن قرب:</h3>
            <div className="grid grid-cols-1 gap-4">
              {config.gallery.map((g) => (
                <div key={g.id} style={{ borderColor: theme.border, backgroundColor: theme.cardBg }} className="border rounded-3xl overflow-hidden shadow-lg">
                  <img src={g.image} alt="تفاصيل المنتج" className="w-full h-64 sm:h-80 object-cover" />
                  {g.caption && (
                    <div style={{ borderColor: theme.border, color: theme.textMain }} className="p-4 border-t text-xs sm:text-sm text-center font-bold">
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
            <h3 style={{ color: theme.textMain }} className="text-base font-extrabold text-center">عروض وباقات التوفير</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {config.bundles.map((b) => {
                const isSelected = selectedQty === b.qty;
                return (
                  <div
                    key={b.qty}
                    onClick={() => setSelectedQty(b.qty)}
                    style={{
                      borderColor: isSelected ? theme.accent : theme.border,
                      backgroundColor: isSelected ? (theme.isLight ? "#f0f9ff" : "rgba(255,255,255,0.06)") : theme.cardBg
                    }}
                    className="cursor-pointer border-2 rounded-2xl p-4 text-center relative transition shadow-sm"
                  >
                    {b.badge && (
                      <span style={{ backgroundColor: theme.accent, color: theme.accentText }} className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-black px-3 py-0.5 rounded-full shadow-md">
                        {b.badge}
                      </span>
                    )}
                    <p className="font-extrabold text-sm">{b.title}</p>
                    <p style={{ color: theme.accent }} className="text-2xl font-black font-sans my-1">
                      {b.price} {activeCountry.currency}
                    </p>
                    {b.savings && <p style={{ color: theme.textMuted }} className="text-[11px] font-bold">{b.savings} {activeCountry.currency}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* نموذج تأكيد الطلب */}
        <section id="checkout-form" style={{ borderColor: theme.border, backgroundColor: theme.cardBg }} className="border rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
          <div className="text-center space-y-1 border-b pb-4" style={{ borderColor: theme.border }}>
            <h2 style={{ color: theme.textMain }} className="text-xl font-black">أدخل بياناتك لاستلام ومعاينة الطلب</h2>
            <p style={{ color: theme.textMuted }} className="text-xs">الدفع نقداً عند الاستلام بعد فحص المنتج وتجربته</p>
          </div>

          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div>
              <label style={{ color: theme.textMuted }} className="block text-xs mb-1 font-bold">الاسم بالكامل *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="اكتب اسمك الثلاثي"
                style={{
                  borderColor: theme.inputBorder,
                  backgroundColor: theme.inputBg,
                  color: theme.textMain
                }}
                className="w-full border rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none"
              />
            </div>

            <div>
              <label style={{ color: theme.textMuted }} className="block text-xs mb-1 font-bold">
                المحافظة أو المدينة ({activeCountry.name}) *
              </label>
              <select
                required
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                style={{
                  borderColor: theme.inputBorder,
                  backgroundColor: theme.inputBg,
                  color: theme.textMain
                }}
                className="w-full border rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none"
              >
                {enabledProvinces.map((p) => (
                  <option key={p.id} value={p.name} className={theme.isLight ? "bg-white text-slate-900" : "bg-neutral-900 text-white"}>
                    {p.name} {p.shippingCost === 0 ? "(شحن مجاني ومعاينة)" : `(شحن: ${p.shippingCost} ${activeCountry.currency})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label style={{ color: theme.textMuted }} className="block text-xs mb-1 font-bold">رقم الهاتف للتواصل *</label>
                <div className="flex items-center gap-1.5" dir="ltr">
                  <span style={{ borderColor: theme.inputBorder, backgroundColor: theme.inputBg, color: theme.textMuted }} className="border text-xs px-3 py-3 rounded-xl font-mono">
                    {activeCountry.phoneCode}
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="رقم الهاتف"
                    style={{ borderColor: theme.inputBorder, backgroundColor: theme.inputBg, color: theme.textMain }}
                    className="w-full border rounded-xl px-4 py-3 text-xs sm:text-sm text-left focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label style={{ color: theme.textMuted }} className="block text-xs mb-1 font-bold">رقم بديل (اختياري)</label>
                <div className="flex items-center gap-1.5" dir="ltr">
                  <span style={{ borderColor: theme.inputBorder, backgroundColor: theme.inputBg, color: theme.textMuted }} className="border text-xs px-3 py-3 rounded-xl font-mono">
                    {activeCountry.phoneCode}
                  </span>
                  <input
                    type="tel"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    placeholder="رقم آخر إن وجد"
                    style={{ borderColor: theme.inputBorder, backgroundColor: theme.inputBg, color: theme.textMain }}
                    className="w-full border rounded-xl px-4 py-3 text-xs sm:text-sm text-left focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={{ color: theme.textMuted }} className="block text-xs mb-1 font-bold">العنوان بالتفصيل *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="الحي، اسم الشارع، رقم العقار أو علامة مميزة"
                style={{ borderColor: theme.inputBorder, backgroundColor: theme.inputBg, color: theme.textMain }}
                className="w-full border rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none"
              />
            </div>

            <div>
              <label style={{ color: theme.textMuted }} className="block text-xs mb-1 font-bold">ملاحظات خاصة بالتوصيل (اختياري)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي ملاحظة تود إبلاغ المندوب بها"
                style={{ borderColor: theme.inputBorder, backgroundColor: theme.inputBg, color: theme.textMain }}
                className="w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none resize-none"
              />
            </div>

            <div style={{ borderColor: theme.border, backgroundColor: theme.isLight ? "#f8fafc" : "rgba(0,0,0,0.25)" }} className="p-4 rounded-2xl border space-y-2 text-xs">
              <div className="flex justify-between" style={{ color: theme.textMuted }}>
                <span>قيمة الطلب:</span>
                <span className="font-mono">{productSubtotal} {activeCountry.currency}</span>
              </div>
              <div className="flex justify-between" style={{ color: theme.textMuted }}>
                <span>مصاريف الشحن:</span>
                <span className={shippingCost === 0 ? "font-bold text-emerald-500" : "font-mono"}>
                  {shippingCost === 0 ? "مجاناً بالكامل" : `${shippingCost} ${activeCountry.currency}`}
                </span>
              </div>
              <div style={{ borderColor: theme.border }} className="border-t pt-2 flex justify-between items-center font-bold">
                <span style={{ color: theme.textMain }}>الإجمالي عند الاستلام:</span>
                <span style={{ color: theme.accent }} className="text-2xl font-black font-sans">
                  {finalTotal} {activeCountry.currency}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: theme.accent, color: theme.accentText }}
              className="w-full font-black text-sm sm:text-base py-4 rounded-2xl shadow-xl hover:opacity-95 transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? "جاري تسجيل طلبك..." : "تأكيد الطلب — الدفع بعد المعاينة عند الاستلام ←"}
            </button>
          </form>
        </section>

        {/* بطاقة الضمان */}
        {config.showGuarantee && (
          <div style={{ borderColor: theme.border, backgroundColor: theme.cardBg }} className="border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <span style={{ color: theme.accent }} className="text-3xl">🛡️</span>
            <div>
              <p style={{ color: theme.textMain }} className="font-extrabold text-xs sm:text-sm">{config.guaranteeText}</p>
              {config.guaranteeSubtext && <p style={{ color: theme.textMuted }} className="text-[11px] mt-0.5">{config.guaranteeSubtext}</p>}
            </div>
          </div>
        )}

        {/* قسم تقييمات المشترين */}
        {config.showReviews && config.reviews && config.reviews.length > 0 && (
          <div className="space-y-3">
            <h3 style={{ color: theme.textMain }} className="font-black text-sm">تجارب وآراء المشترين:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {config.reviews.map((r, i) => (
                <div key={i} style={{ borderColor: theme.border, backgroundColor: theme.cardBg }} className="border p-4 rounded-2xl space-y-1.5 shadow-sm">
                  <div className="flex justify-between items-center text-xs">
                    <span style={{ color: theme.textMain }} className="font-black">{r.name}</span>
                    <span style={{ color: theme.accent }}>{"★".repeat(r.rating)}</span>
                  </div>
                  <p style={{ color: theme.textMuted }} className="text-xs leading-relaxed">"{r.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* إشعار الشراء اللحظي المنبثق */}
      {recentSale && (
        <div style={{ backgroundColor: theme.cardBg, borderColor: theme.accent }} className="fixed bottom-20 left-4 z-50 border p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs backdrop-blur-xl">
          <div style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }} className="w-8 h-8 rounded-full flex items-center justify-center font-black">
            ✦
          </div>
          <div>
            <p style={{ color: theme.textMain }} className="font-bold">أكد {recentSale.name} من {recentSale.city} طلبه</p>
            <p style={{ color: theme.textMuted }} className="text-[10px]">منذ بضع دقائق</p>
          </div>
        </div>
      )}

      {/* زر واتساب العائم */}
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

      {/* زر الشراء العائم بأسفل شاشة الموبايل */}
      {config.showStickyButton && (
        <div style={{ backgroundColor: theme.isLight ? "rgba(255,255,255,0.95)" : "rgba(10, 14, 20, 0.95)", borderColor: theme.border }} className="fixed bottom-0 left-0 right-0 p-3.5 backdrop-blur-xl border-t sm:hidden z-40">
          <button
            onClick={scrollToCheckout}
            style={{ backgroundColor: theme.accent, color: theme.accentText }}
            className="w-full font-black py-3.5 rounded-2xl shadow-xl text-xs sm:text-sm tracking-wide"
          >
            اطلب الآن — الدفع عند الاستلام ({config.currentPrice} {activeCountry.currency})
          </button>
        </div>
      )}

      <footer style={{ borderColor: theme.border }} className="border-t py-8 text-center text-xs opacity-50 mt-16">
        <p>جميع الحقوق محفوظة © {new Date().getFullYear()} {config.storeName}</p>
      </footer>
    </div>
  );
}
