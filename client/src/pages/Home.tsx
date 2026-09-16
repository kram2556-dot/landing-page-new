import React, { useState, useEffect } from "react";

export interface ProvinceItem {
  id: string;
  name: string;
  enabled: boolean;
  shippingCost: number;
}

export interface CountryConfig {
  code: "EG" | "SA" | "AE" | "LY";
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
  primaryColor: string;
  showTopBar: boolean;
  topBarText: string;
  showTimer: boolean;
  timerMinutes: number;
  showStockBar: boolean;
  stockLeft: number;
  showRecentSales: boolean;
  showStickyButton: boolean;
  activeCountry: "EG" | "SA" | "AE" | "LY";
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
    name: "المملكة العربية السعودية",
    currency: "ر.س",
    phoneCode: "+966",
    provinces: [
      { id: "riyadh", name: "الرياض", enabled: true, shippingCost: 0 },
      { id: "jeddah", name: "جدة", enabled: true, shippingCost: 0 }
    ]
  },
  AE: {
    code: "AE",
    name: "الإمارات العربية المتحدة",
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
  logoUrl: "",
  primaryColor: "#f59e0b",
  showTopBar: true,
  topBarText: "عرض خاص لفترة محدودة — شحن سريع ومعاينة قبل الدفع",
  showTimer: true,
  timerMinutes: 15,
  showStockBar: true,
  stockLeft: 7,
  showRecentSales: true,
  showStickyButton: true,
  activeCountry: "EG",
  countries: DEFAULT_COUNTRIES,
  productTitle: "حذاء مريح وخفيف للجري والمشي الطويل",
  productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
  gallery: [
    { id: "1", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80", caption: "نعل ممتص للصدمات ومبطن بميموري فوم مريح للظهر والقدم" }
  ],
  currentPrice: 350,
  oldPrice: 550,
  features: [
    "خامة مرنة تسمح بتهوية كاملة ومقاومة للتعرق",
    "نعل مانع للانزلاق خفيف جداً ومناسب للوقوف ساعات طويلة",
    "معاينة مجانية للمقاس والخامة قبل دفع أي مليم للمندوب"
  ],
  enableSizes: true,
  sizes: "41, 42, 43, 44, 45",
  enableColors: true,
  colors: "أسود, كحلي, رمادي",
  showBundles: true,
  bundles: [
    { qty: 1, title: "قطعة واحدة", price: 350 },
    { qty: 2, title: "قطعتان (عرض مميز)", price: 620, badge: "الأكثر طلباً", savings: "وفر 80" },
    { qty: 3, title: "ثلاث قطع (توفير عائلي)", price: 870, savings: "وفر 180" }
  ],
  showGuarantee: true,
  guaranteeText: "معاينة وقياس المنتج مجاناً قبل الاستلام والدفع للمندوب",
  guaranteeSubtext: "إذا لم يناسبك المقاس أو الخامة يمكنك الإرجاع فوراً مع المندوب دون دفع أي مصاريف",
  showReviews: true,
  reviews: [
    { name: "أحمد م.", comment: "الحذاء مريح جداً بعد وقفة 8 ساعات في العمل، خامة فاخرة.", rating: 5 },
    { name: "كريم س.", comment: "المقاس مضبوط جداً والتوصيل وصلني تاني يوم في الجيزة.", rating: 5 }
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

  // المؤقت
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 59 });

  // إشعار الشراء اللحظي
  const [recentSale, setRecentSale] = useState<{ name: string; city: string; time: string } | null>(null);

  // حقول نموذج الطلب
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
        const merged: StoreConfig = {
          ...DEFAULT_CONFIG,
          ...parsed,
          countries: {
            ...DEFAULT_COUNTRIES,
            ...(parsed.countries || {})
          }
        };
        setConfig(merged);

        // ضبط المقاس الافتراضي
        if (merged.enableSizes && merged.sizes) {
          setSelectedSize(merged.sizes.split(",")[0]?.trim() || "");
        }
        // ضبط اللون الافتراضي
        if (merged.enableColors && merged.colors) {
          setSelectedColor(merged.colors.split(",")[0]?.trim() || "");
        }
        // ضبط أول محافظة مفعلة كافتراضية
        const currentCountry = merged.countries[merged.activeCountry] || DEFAULT_COUNTRIES.EG;
        const firstActive = currentCountry.provinces.find((p) => p.enabled);
        if (firstActive) {
          setSelectedProvince(firstActive.name);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setSelectedSize("42");
      setSelectedColor("أسود");
      setSelectedProvince("القاهرة");
    }
  }, []);

  // عداد الوقت
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

  // محاكاة إشعار الشراء اللحظي كل 20 ثانية
  useEffect(() => {
    if (!config.showRecentSales) return;
    const activeCountryObj = config.countries[config.activeCountry] || DEFAULT_COUNTRIES.EG;
    const enabledProvinces = activeCountryObj.provinces.filter((p) => p.enabled);
    const cities = enabledProvinces.length > 0 ? enabledProvinces.map((p) => p.name) : ["العاصمة"];
    const names = ["أحمد", "محمد", "محمود", "عمر", "سارة", "خالد", "عبدالله", "يوسف"];

    const interval = setInterval(() => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      setRecentSale({ name: randomName, city: randomCity, time: "منذ دقيقة واحدة" });

      setTimeout(() => {
        setRecentSale(null);
      }, 5000);
    }, 20000);

    return () => clearInterval(interval);
  }, [config.showRecentSales, config.activeCountry, config.countries]);

  const activeCountry = config.countries[config.activeCountry] || DEFAULT_COUNTRIES.EG;
  const enabledProvinces = activeCountry.provinces.filter((p) => p.enabled);

  // حساب تكلفة الشحن والإجمالي
  const activeProvinceObj = enabledProvinces.find((p) => p.name === selectedProvince);
  const shippingCost = activeProvinceObj ? activeProvinceObj.shippingCost : 0;

  const currentBundle = config.bundles.find((b) => b.qty === selectedQty) || {
    qty: 1,
    title: "قطعة واحدة",
    price: config.currentPrice
  };

  const productSubtotal = config.showBundles ? currentBundle.price : config.currentPrice * selectedQty;
  const finalTotal = productSubtotal + shippingCost;
  const primaryColor = config.primaryColor || "#f59e0b";

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
      countryCode: activeCountry.code,
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
      let specText = "";
      if (config.enableSizes && selectedSize) specText += `%0A- المقاس: ${selectedSize}`;
      if (config.enableColors && selectedColor) specText += `%0A- اللون: ${selectedColor}`;

      const msg = `طلب جديد (%D8%AF%D9%81%D8%B9 %D8%B9%D9%86%D8%AF %D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%84%D8%A7%D9%85):%0A- الاسم: ${fullName}%0A- الدولة: ${activeCountry.name}%0A- المحافظة/المدينة: ${selectedProvince}%0A- العنوان: ${address}${specText}%0A- الكمية: ${selectedQty}%0A- قيمة المنتج: ${productSubtotal} ${activeCountry.currency}%0A- مصاريف الشحن: ${shippingCost === 0 ? "مجاناً" : `${shippingCost} ${activeCountry.currency}`}%0A- الإجمالي المستحق: ${finalTotal} ${activeCountry.currency}%0A- رقم الهاتف: ${phone}${altPhone ? ` (%D8%A8%D8%AF%D9%8A%D9%84: ${altPhone})` : ""}${notes ? `%0A- ملاحظات: ${notes}` : ""}`;
      const cleanPhone = config.whatsappNumber.replace(/[^0-9]/g, "");
      window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="bg-neutral-900 border border-emerald-500/30 p-8 rounded-2xl max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
            ✓
          </div>
          <h2 className="text-2xl font-bold">تم تأكيد طلبك بنجاح!</h2>
          <p className="text-neutral-300 text-sm leading-relaxed">
            شكراً لك يا {fullName}. سنتواصل معك هاتفياً لتأكيد موعد المعاينة والتسليم حتى باب المنزل.
          </p>
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs text-neutral-400">
            الإجمالي المطلوب عند الاستلام: <b className="text-white text-sm">{finalTotal} {activeCountry.currency}</b>
          </div>
          <button
            onClick={() => setOrderSuccess(false)}
            style={{ backgroundColor: primaryColor }}
            className="w-full text-black font-bold py-3 rounded-xl transition"
          >
            العودة للمتجر
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-20" dir="rtl">
      {/* الشريط العلوي */}
      {config.showTopBar && (
        <div
          style={{ backgroundColor: primaryColor }}
          className="text-black py-2 px-4 text-xs sm:text-sm font-bold text-center sticky top-0 z-50 shadow-md"
        >
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-6">
            <span>{config.topBarText}</span>
            {config.showTimer && (
              <span className="bg-black/80 text-white px-2 py-0.5 rounded font-mono text-xs">
                ينتهي خلال {String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
              </span>
            )}
          </div>
        </div>
      )}

      {/* الهيدر */}
      <header className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md sticky top-8 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt={config.storeName} className="h-9 object-contain" />
            ) : (
              <span style={{ color: primaryColor }} className="text-xl font-black">
                {config.storeName}
              </span>
            )}
          </div>
          <button
            onClick={scrollToCheckout}
            style={{ backgroundColor: primaryColor }}
            className="text-black font-bold px-4 py-1.5 rounded-lg text-xs sm:text-sm"
          >
            اطلب الآن
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-7">
        {/* العنوان والأسعار */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">{config.productTitle}</h1>
          <div className="flex items-center justify-center gap-3">
            <span style={{ color: primaryColor }} className="text-3xl font-black">
              {config.currentPrice} {activeCountry.currency}
            </span>
            {config.oldPrice > config.currentPrice && (
              <span className="text-neutral-500 line-through text-lg">
                {config.oldPrice} {activeCountry.currency}
              </span>
            )}
          </div>

          {/* شريط المخزون المتبقي */}
          {config.showStockBar && (
            <div className="max-w-xs mx-auto pt-2 space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-red-400">سارع بالطلب! الكمية المتبقية محدودة جداً</span>
                <span className="text-amber-400">{config.stockLeft} قطع متبقية</span>
              </div>
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, Math.max(15, config.stockLeft * 10))}%`, backgroundColor: primaryColor }}
                  className="h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* الصورة الرئيسية */}
        <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-xl">
          <img src={config.productImage} alt={config.productTitle} className="w-full h-80 sm:h-[420px] object-cover" />
        </div>

        {/* اختيار المقاس واللون */}
        {(config.enableSizes || config.enableColors) && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
            {config.enableSizes && config.sizes && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-300">
                  اختر المقاس: <span style={{ color: primaryColor }}>{selectedSize}</span>
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
                          borderColor: active ? primaryColor : "rgb(38 38 38)",
                          backgroundColor: active ? `${primaryColor}20` : "transparent"
                        }}
                        className="border-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition"
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
                <label className="block text-xs font-bold text-neutral-300">
                  اختر اللون: <span style={{ color: primaryColor }}>{selectedColor}</span>
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
                          borderColor: active ? primaryColor : "rgb(38 38 38)",
                          backgroundColor: active ? `${primaryColor}20` : "transparent"
                        }}
                        className="border-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition"
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
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-2.5">
          <h3 style={{ color: primaryColor }} className="font-bold text-sm">مميزات المنتج:</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-neutral-300">
            {config.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2">
                <span style={{ color: primaryColor }} className="font-bold">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* معرض الصور التوضيحي والشرح */}
        {config.gallery && config.gallery.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-center text-neutral-200">تفاصيل المنتج عن قرب:</h3>
            <div className="grid grid-cols-1 gap-4">
              {config.gallery.map((g) => (
                <div key={g.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg">
                  <img src={g.image} alt="Detail" className="w-full h-64 sm:h-80 object-cover" />
                  {g.caption && (
                    <div className="p-4 bg-neutral-950 border-t border-neutral-800/80 text-xs sm:text-sm text-neutral-300 text-center font-medium">
                      {g.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* باقات الكميات */}
        {config.showBundles && (
          <div className="space-y-3">
            <h3 className="font-bold text-base text-center text-neutral-200">عروض وباقات التوفير:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {config.bundles.map((b) => {
                const isSelected = selectedQty === b.qty;
                return (
                  <div
                    key={b.qty}
                    onClick={() => setSelectedQty(b.qty)}
                    style={{
                      borderColor: isSelected ? primaryColor : "rgb(38 38 38)",
                      backgroundColor: isSelected ? `${primaryColor}10` : "rgb(23 23 23)"
                    }}
                    className="cursor-pointer border-2 rounded-xl p-4 text-center relative transition"
                  >
                    {b.badge && (
                      <span
                        style={{ backgroundColor: primaryColor }}
                        className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-black text-[10px] font-black px-2 py-0.5 rounded-full"
                      >
                        {b.badge}
                      </span>
                    )}
                    <p className="font-bold text-sm">{b.title}</p>
                    <p style={{ color: primaryColor }} className="text-xl font-black my-1">
                      {b.price} {activeCountry.currency}
                    </p>
                    {b.savings && (
                      <p className="text-[11px] text-emerald-400 font-semibold">
                        {b.savings} {activeCountry.currency}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* نموذج الطلب المباشر */}
        <section id="checkout-form" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <div className="border-b border-neutral-800 pb-3 text-center">
            <h2 className="text-xl font-extrabold">أدخل بياناتك لمعاينة واستلام الطلب</h2>
            <p className="text-xs text-neutral-400 mt-1">الدفع عند الاستلام مع إمكانية المعاينة قبل الدفع</p>
          </div>

          <form onSubmit={handleSubmitOrder} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">الاسم بالكامل *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="اكتب اسمك الثلاثي"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none"
              />
            </div>

            {/* اختيار المحافظة مع إظهار سعر الشحن */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                المحافظة / المدينة ({activeCountry.name}) *
              </label>
              <select
                required
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none"
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
                <label className="block text-xs font-semibold text-neutral-300 mb-1">رقم الهاتف الأساسي *</label>
                <div className="flex items-center gap-1.5" dir="ltr">
                  <span className="bg-neutral-800 text-neutral-300 text-xs px-2.5 py-2.5 rounded-xl font-mono">
                    {activeCountry.phoneCode}
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="رقم الهاتف"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-left focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">رقم هاتف بديل (اختياري)</label>
                <div className="flex items-center gap-1.5" dir="ltr">
                  <span className="bg-neutral-800 text-neutral-300 text-xs px-2.5 py-2.5 rounded-xl font-mono">
                    {activeCountry.phoneCode}
                  </span>
                  <input
                    type="tel"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    placeholder="رقم آخر إن وجد"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-left focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">العنوان بالتفصيل *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="اسم الشارع، رقم العمارة، علامة مميزة قريبة"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">ملاحظات إضافية للمندوب (اختياري)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي تعليمات خاصة بالتوصيل"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-xs focus:outline-none resize-none"
              />
            </div>

            {/* تفصيل الحساب */}
            <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between text-neutral-400">
                <span>سعر المنتج:</span>
                <span>{productSubtotal} {activeCountry.currency}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>مصاريف التوصيل:</span>
                <span className={shippingCost === 0 ? "text-emerald-400 font-bold" : ""}>
                  {shippingCost === 0 ? "مجاناً" : `${shippingCost} ${activeCountry.currency}`}
                </span>
              </div>
              <div className="border-t border-neutral-800 pt-1.5 flex justify-between items-center font-bold">
                <span>الإجمالي المستحق للدفع:</span>
                <span style={{ color: primaryColor }} className="text-xl font-black">
                  {finalTotal} {activeCountry.currency}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: primaryColor }}
              className="w-full text-black font-extrabold text-sm sm:text-base py-3.5 rounded-xl shadow-lg transition"
            >
              {isSubmitting ? "جاري الإرسال..." : "تأكيد الطلب — الدفع عند الاستلام بعد المعاينة"}
            </button>
          </form>
        </section>

        {/* شارة الضمان / المعاينة */}
        {config.showGuarantee && (
          <div className="border border-neutral-800 bg-neutral-900 rounded-xl p-4 flex items-center gap-3">
            <div style={{ color: primaryColor }} className="text-2xl flex-shrink-0">
              🛡️
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-neutral-200">{config.guaranteeText}</p>
              {config.guaranteeSubtext && (
                <p className="text-[11px] text-neutral-400 mt-0.5">{config.guaranteeSubtext}</p>
              )}
            </div>
          </div>
        )}

        {/* آراء العملاء */}
        {config.showReviews && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-neutral-300">تجارب وآراء المشترين:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {config.reviews.map((r, i) => (
                <div key={i} className="bg-neutral-900 border border-neutral-800 p-3.5 rounded-xl space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-neutral-200">{r.name}</span>
                    <span style={{ color: primaryColor }}>{"★".repeat(r.rating)}</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">"{r.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* إشعار الشراء اللحظي المنبثق */}
      {recentSale && (
        <div className="fixed bottom-16 left-4 z-50 bg-neutral-900 border border-amber-500/40 p-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs animate-bounce">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            🛍️
          </div>
          <div>
            <p className="font-bold text-neutral-200">قام {recentSale.name} من ({recentSale.city}) بطلب المنتج</p>
            <p className="text-[10px] text-neutral-400">{recentSale.time}</p>
          </div>
        </div>
      )}

      {/* زر الشراء العائم للموبايل */}
      {config.showStickyButton && (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-neutral-950/90 backdrop-blur-md border-t border-neutral-800 sm:hidden z-40">
          <button
            onClick={scrollToCheckout}
            style={{ backgroundColor: primaryColor }}
            className="w-full text-black font-extrabold py-3 rounded-xl shadow-lg text-sm"
          >
            اطلب الآن — الدفع عند الاستلام ({config.currentPrice} {activeCountry.currency})
          </button>
        </div>
      )}

      <footer className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
        <p>جميع الحقوق محفوظة © {new Date().getFullYear()} {config.storeName}</p>
      </footer>
    </div>
  );
}
