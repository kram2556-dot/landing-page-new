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

  // محفزات التحويل السريع
  showStockBar: boolean;
  stockLeft: number;
  showRecentSales: boolean;
  showStickyButton: boolean;

  // واتساب الدعم العائم
  showSupportWhatsapp: boolean;
  supportWhatsappNumber: string;

  // الدول والشحن
  activeCountry: string;
  countries: Record<string, CountryConfig>;

  // المنتج والتسعير
  productTitle: string;
  productImage: string;
  gallery: GalleryItem[];
  currentPrice: number;
  oldPrice: number;
  features: string[];

  // المقاسات والألوان
  enableSizes: boolean;
  sizes: string;
  enableColors: boolean;
  colors: string;

  // باقات
  showBundles: boolean;
  bundles: BundleItem[];

  // الضمان والتقييمات
  showGuarantee: boolean;
  guaranteeText: string;
  guaranteeSubtext?: string;
  showReviews: boolean;
  reviews: ReviewItem[];

  // تتبع وطلبات
  whatsappNumber: string;
  metaPixelId: string;
  tiktokPixelId: string;
}

export const THEMES_LIST = [
  { id: "medical", name: "طبي وعلاجي (Medical Cyan)", color: "#0284c7", bg: "فاتح / أزرق وأبيض" },
  { id: "sneakers", name: "أحذية ورياضة (Street Sneakers)", color: "#f97316", bg: "داكن / أسود كربوني" },
  { id: "fashion", name: "ملابس وأزياء (Fashion Elegance)", color: "#b45309", bg: "بيج دافئ ورمادي" },
  { id: "perfume", name: "عطور وتجميل (Royal Perfume)", color: "#ec4899", bg: "أسود ملكي ووردي ذهبي" },
  { id: "home", name: "أدوات منزلية وكهربائية (Home & Tech)", color: "#2563eb", bg: "أزرق تكنولوجي داكن" },
  { id: "kids", name: "ألعاب أطفال وهدايا (Kids Joy)", color: "#10b981", bg: "ألوان مبهجة وحيوية" }
];

const DEFAULT_COUNTRIES: Record<string, CountryConfig> = {
  EG: {
    code: "EG",
    name: "مصر",
    currency: "ج.م",
    phoneCode: "+20",
    provinces: [
      { id: "cairo", name: "القاهرة", enabled: true, shippingCost: 0 },
      { id: "giza", name: "الجيزة", enabled: true, shippingCost: 0 },
      { id: "alex", name: "الإسكندرية", enabled: true, shippingCost: 0 },
      { id: "sharqia", name: "الشرقية", enabled: true, shippingCost: 0 },
      { id: "dakahlia", name: "الدقهلية", enabled: true, shippingCost: 0 },
      { id: "gharbia", name: "الغربية", enabled: true, shippingCost: 0 },
      { id: "monufia", name: "المنوفية", enabled: true, shippingCost: 0 },
      { id: "qalyubia", name: "القليوبية", enabled: true, shippingCost: 0 },
      { id: "beheira", name: "البحيرة", enabled: true, shippingCost: 0 },
      { id: "ismailia", name: "الإسماعيلية", enabled: true, shippingCost: 0 },
      { id: "suez", name: "السويس", enabled: true, shippingCost: 0 },
      { id: "portsaid", name: "بورسعيد", enabled: true, shippingCost: 0 },
      { id: "fayoum", name: "الفيوم", enabled: true, shippingCost: 0 },
      { id: "benisuef", name: "بني سويف", enabled: true, shippingCost: 0 },
      { id: "minya", name: "المنيا", enabled: true, shippingCost: 0 },
      { id: "assiut", name: "أسيوط", enabled: true, shippingCost: 0 },
      { id: "sohag", name: "سوهاج", enabled: true, shippingCost: 0 },
      { id: "qena", name: "قنا", enabled: true, shippingCost: 0 },
      { id: "luxor", name: "الأقصر", enabled: true, shippingCost: 0 },
      { id: "aswan", name: "أسوان", enabled: true, shippingCost: 0 }
    ]
  },
  SA: {
    code: "SA",
    name: "السعودية",
    currency: "ر.س",
    phoneCode: "+966",
    provinces: [
      { id: "riyadh", name: "الرياض", enabled: true, shippingCost: 0 },
      { id: "jeddah", name: "جدة", enabled: true, shippingCost: 0 },
      { id: "makkah", name: "مكة المكرمة", enabled: true, shippingCost: 0 },
      { id: "madinah", name: "المدينة المنورة", enabled: true, shippingCost: 0 },
      { id: "dammam", name: "الدمام", enabled: true, shippingCost: 0 },
      { id: "khobar", name: "الخبر", enabled: true, shippingCost: 0 },
      { id: "taif", name: "الطائف", enabled: true, shippingCost: 0 },
      { id: "tabuk", name: "تبوك", enabled: true, shippingCost: 0 },
      { id: "buraidah", name: "بريدة", enabled: true, shippingCost: 0 },
      { id: "abha", name: "أبها", enabled: true, shippingCost: 0 }
    ]
  },
  AE: {
    code: "AE",
    name: "الإمارات",
    currency: "د.إ",
    phoneCode: "+971",
    provinces: [
      { id: "dubai", name: "دبي", enabled: true, shippingCost: 0 },
      { id: "abudhabi", name: "أبوظبي", enabled: true, shippingCost: 0 },
      { id: "sharjah", name: "الشارقة", enabled: true, shippingCost: 0 },
      { id: "ajman", name: "عجمان", enabled: true, shippingCost: 0 },
      { id: "rasalkhaimah", name: "رأس الخيمة", enabled: true, shippingCost: 0 },
      { id: "fujairah", name: "الفجيرة", enabled: true, shippingCost: 0 },
      { id: "ummalquwain", name: "أم القيوين", enabled: true, shippingCost: 0 }
    ]
  },
  LY: {
    code: "LY",
    name: "ليبيا",
    currency: "د.ل",
    phoneCode: "+218",
    provinces: [
      { id: "tripoli", name: "طرابلس", enabled: true, shippingCost: 0 },
      { id: "benghazi", name: "بنغازي", enabled: true, shippingCost: 0 },
      { id: "misrata", name: "مصراتة", enabled: true, shippingCost: 0 },
      { id: "zawiya", name: "الزاوية", enabled: true, shippingCost: 0 },
      { id: "bayda", name: "البيضاء", enabled: true, shippingCost: 0 },
      { id: "khoms", name: "الخمس", enabled: true, shippingCost: 0 },
      { id: "tobruk", name: "طبرق", enabled: true, shippingCost: 0 },
      { id: "sabha", name: "سبها", enabled: true, shippingCost: 0 }
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

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const [adminEmail, setAdminEmail] = useState("admin@store.com");
  const [adminPassword, setAdminPassword] = useState("admin123");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [authSuccessMsg, setAuthSuccessMsg] = useState("");

  const [activeTab, setActiveTab] = useState<"settings" | "themes" | "shipping" | "gallery" | "reviews" | "orders" | "security">("settings");
  const [config, setConfig] = useState<StoreConfig>(DEFAULT_CONFIG);
  const [orders, setOrders] = useState<any[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // حقول إضافة دولة جديدة
  const [showAddCountryModal, setShowAddCountryModal] = useState(false);
  const [newCountryName, setNewCountryName] = useState("");
  const [newCountryCode, setNewCountryCode] = useState("");
  const [newCountryCurrency, setNewCountryCurrency] = useState("");
  const [newCountryPhoneCode, setNewCountryPhoneCode] = useState("");
  const [newCountryProvincesRaw, setNewCountryProvincesRaw] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("store_admin_email");
    const savedPassword = localStorage.getItem("store_admin_password");
    if (savedEmail) setAdminEmail(savedEmail);
    if (savedPassword) setAdminPassword(savedPassword);

    if (sessionStorage.getItem("store_admin_session") === "true") {
      setIsAuthenticated(true);
    }

    const savedConfig = localStorage.getItem("store_config");
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig({
          ...DEFAULT_CONFIG,
          ...parsed,
          countries: {
            ...DEFAULT_COUNTRIES,
            ...(parsed.countries || {})
          }
        });
      } catch (e) {
        console.error(e);
      }
    }

    const savedOrders = localStorage.getItem("store_orders");
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // ضاغط الصور السحري من الاستوديو
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 700;
        const scale = MAX_WIDTH / Math.max(img.width, MAX_WIDTH);
        canvas.width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
        canvas.height = img.width > MAX_WIDTH ? img.height * scale : img.height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // ضغط مباشر وصيغة خفيفة جداً
        const compressed = canvas.toDataURL("image/jpeg", 0.65);
        callback(compressed);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim().toLowerCase() === adminEmail.toLowerCase() && passwordInput === adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("store_admin_session", "true");
      setLoginError("");
    } else {
      setLoginError("بيانات الدخول غير صحيحة");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("store_admin_session");
    setIsAuthenticated(false);
  };

  const handleSaveConfig = () => {
    try {
      localStorage.setItem("store_config", JSON.stringify(config));
      setSaveSuccess(true);
      alert("✓ تم حفظ جميع التعديلات بنجاح!");
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (error) {
      alert("حجم الصور المرفوعة كبير جداً. يرجى مسح بعض الصور أو رفع صورة أصغر لتتمكن من الحفظ.");
      console.error(error);
    }
  };

  const handleUpdateSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newPassword) return;
    localStorage.setItem("store_admin_email", newEmail.trim());
    localStorage.setItem("store_admin_password", newPassword);
    setAdminEmail(newEmail.trim());
    setAdminPassword(newPassword);
    setAuthSuccessMsg("تم التحديث بنجاح!");
    setTimeout(() => setAuthSuccessMsg(""), 3000);
  };

  // إضافة دولة جديدة للقائمة
  const handleAddNewCountry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCountryCode || !newCountryName || !newCountryCurrency) return;

    const code = newCountryCode.trim().toUpperCase();
    const provs: ProvinceItem[] = newCountryProvincesRaw
      ? newCountryProvincesRaw.split(",").map((p, idx) => ({
          id: `p_${idx}`,
          name: p.trim(),
          enabled: true,
          shippingCost: 0
        }))
      : [{ id: "main", name: "العاصمة", enabled: true, shippingCost: 0 }];

    const newCountry: CountryConfig = {
      code,
      name: newCountryName.trim(),
      currency: newCountryCurrency.trim(),
      phoneCode: newCountryPhoneCode.trim() || "+",
      provinces: provs
    };

    const updatedCountries = { ...config.countries, [code]: newCountry };
    setConfig({
      ...config,
      countries: updatedCountries,
      activeCountry: code
    });

    setShowAddCountryModal(false);
    setNewCountryName("");
    setNewCountryCode("");
    setNewCountryCurrency("");
    setNewCountryPhoneCode("");
    setNewCountryProvincesRaw("");
    alert(`تمت إضافة دولة ${newCountry.name} وتعيينها كدولة نشطة!`);
  };

  const currentCountry = config.countries[config.activeCountry] || DEFAULT_COUNTRIES.EG;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl max-w-sm w-full space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-amber-400">لوحة تحكم المتجر</h1>
            <p className="text-xs text-neutral-400">سجل الدخول لإدارة المنتجات والثيمات والطلبات</p>
          </div>
          {loginError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg text-center">
              {loginError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@store.com"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:border-amber-500 text-left"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">كلمة المرور</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:border-amber-500 text-left"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition text-sm"
            >
              تسجيل الدخول
            </button>
          </form>
          <div className="text-center text-[11px] text-neutral-500 border-t border-neutral-800 pt-3">
            الافتراضي: admin@store.com / admin123
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-16" dir="rtl">
      <header className="border-b border-neutral-800 bg-neutral-900 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-amber-400 text-lg">إدارة المتجر</span>
            <span className="bg-neutral-800 text-neutral-300 text-xs px-2.5 py-0.5 rounded border border-neutral-700">
              الدولة: {currentCountry.name} ({currentCountry.currency})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveConfig}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-lg text-sm transition"
            >
              {saveSuccess ? "✓ تم الحفظ!" : "حفظ التعديلات"}
            </button>
            <button
              onClick={handleLogout}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs px-3 py-1.5 rounded-lg transition"
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 mt-6">
        {/* التبويبات */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-2">
          {[
            { id: "settings", label: "المنتج والمظهر" },
            { id: "themes", label: "ثيمات الألوان الجاهزة" },
            { id: "shipping", label: `الدول والشحن (${currentCountry.name})` },
            { id: "gallery", label: "معرض الصور والشرح" },
            { id: "reviews", label: "آراء العملاء" },
            { id: "orders", label: `الطلبات (${orders.length})` },
            { id: "security", label: "الأمان والبيكسل" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition ${
                activeTab === tab.id ? "bg-amber-500 text-black" : "text-neutral-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. تبويب المنتج والمظهر ومحفزات التحويل */}
        {activeTab === "settings" && (
          <div className="mt-6 space-y-6">
            {/* الهوية والشعار */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
              <h3 className="font-bold text-amber-400 text-base border-b border-neutral-800 pb-2">
                الهوية وشعار المتجر
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">اسم المتجر</label>
                  <input
                    type="text"
                    value={config.storeName}
                    onChange={(e) => setConfig({ ...config, storeName: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">شعار المتجر (اللوجو)</label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer bg-neutral-800 hover:bg-neutral-700 text-xs px-3 py-2 rounded-lg text-neutral-200 border border-neutral-700 flex-1 text-center">
                      <span>📁 رفع لوجو من الاستوديو</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, (url) => setConfig({ ...config, logoUrl: url }))}
                      />
                    </label>
                    {config.logoUrl && (
                      <button
                        onClick={() => setConfig({ ...config, logoUrl: "" })}
                        className="text-red-400 text-xs hover:underline"
                      >
                        حذف
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* واتساب الدعم ومحفزات التحويل */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
              <h3 className="font-bold text-amber-400 text-base border-b border-neutral-800 pb-2">
                محفزات التحويل وأيقونة واتساب الدعم
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* واتساب الدعم العائم */}
                <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-lg space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-200">
                    <input
                      type="checkbox"
                      checked={config.showSupportWhatsapp}
                      onChange={(e) => setConfig({ ...config, showSupportWhatsapp: e.target.checked })}
                      className="w-4 h-4 accent-amber-500"
                    />
                    <span>أيقونة واتساب الدعم العائمة</span>
                  </label>
                  {config.showSupportWhatsapp && (
                    <input
                      type="text"
                      value={config.supportWhatsappNumber}
                      onChange={(e) => setConfig({ ...config, supportWhatsappNumber: e.target.value })}
                      placeholder="رقم الدعم بالرمز الدولي"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-left font-mono"
                    />
                  )}
                </div>

                {/* شريط المخزون */}
                <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-lg space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-200">
                    <input
                      type="checkbox"
                      checked={config.showStockBar}
                      onChange={(e) => setConfig({ ...config, showStockBar: e.target.checked })}
                      className="w-4 h-4 accent-amber-500"
                    />
                    <span>شريط المخزون المتبقي</span>
                  </label>
                  {config.showStockBar && (
                    <div className="flex items-center gap-2 text-xs">
                      <span>القطع:</span>
                      <input
                        type="number"
                        value={config.stockLeft}
                        onChange={(e) => setConfig({ ...config, stockLeft: Number(e.target.value) })}
                        className="w-14 bg-neutral-900 border border-neutral-800 rounded p-1 text-center"
                      />
                    </div>
                  )}
                </div>

                {/* إشعار الشراء اللحظي */}
                <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-lg space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-200">
                    <input
                      type="checkbox"
                      checked={config.showRecentSales}
                      onChange={(e) => setConfig({ ...config, showRecentSales: e.target.checked })}
                      className="w-4 h-4 accent-amber-500"
                    />
                    <span>إشعارات الشراء اللحظية</span>
                  </label>
                  <p className="text-[10px] text-neutral-400">نافذة تنبثق كل 20 ثانية لزيادة الثقة</p>
                </div>

                {/* زر الشراء العائم للموبايل */}
                <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-lg space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-200">
                    <input
                      type="checkbox"
                      checked={config.showStickyButton}
                      onChange={(e) => setConfig({ ...config, showStickyButton: e.target.checked })}
                      className="w-4 h-4 accent-amber-500"
                    />
                    <span>زر الشراء العائم للموبايل</span>
                  </label>
                  <p className="text-[10px] text-neutral-400">يثبت أسفل الشاشة للتنقل للطلب بلمسة</p>
                </div>
              </div>
            </div>

            {/* تفاصيل المنتج والتسعير */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
              <h3 className="font-bold text-amber-400 text-base border-b border-neutral-800 pb-2">بيانات المنتج والتسعير</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">اسم المنتج</label>
                  <input
                    type="text"
                    value={config.productTitle}
                    onChange={(e) => setConfig({ ...config, productTitle: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">صورة المنتج الرئيسية</label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer bg-neutral-800 hover:bg-neutral-700 text-xs px-4 py-2.5 rounded-lg text-neutral-200 border border-neutral-700">
                      <span>📸 رفع صورة من الاستوديو (ضغط تلقائي)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, (url) => setConfig({ ...config, productImage: url }))}
                      />
                    </label>
                    {config.productImage && (
                      <img src={config.productImage} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-neutral-700" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      السعر الحالي ({currentCountry.currency})
                    </label>
                    <input
                      type="number"
                      value={config.currentPrice}
                      onChange={(e) => setConfig({ ...config, currentPrice: Number(e.target.value) })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      السعر قبل الخصم ({currentCountry.currency})
                    </label>
                    <input
                      type="number"
                      value={config.oldPrice}
                      onChange={(e) => setConfig({ ...config, oldPrice: Number(e.target.value) })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">نقاط المميزات السريعة</label>
                  {config.features.map((f, i) => (
                    <input
                      key={i}
                      type="text"
                      value={f}
                      onChange={(e) => {
                        const updated = [...config.features];
                        updated[i] = e.target.value;
                        setConfig({ ...config, features: updated });
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-sm mb-2"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* المقاسات والألوان */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
              <h3 className="font-bold text-amber-400 text-base border-b border-neutral-800 pb-2">المقاسات والألوان (اختيارية)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-200">
                    <input
                      type="checkbox"
                      checked={config.enableSizes}
                      onChange={(e) => setConfig({ ...config, enableSizes: e.target.checked })}
                      className="w-4 h-4 accent-amber-500"
                    />
                    <span>تفعيل اختيار المقاسات</span>
                  </label>
                  {config.enableSizes && (
                    <input
                      type="text"
                      value={config.sizes}
                      onChange={(e) => setConfig({ ...config, sizes: e.target.value })}
                      placeholder="41, 42, 43 أو M, L, XL"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-200">
                    <input
                      type="checkbox"
                      checked={config.enableColors}
                      onChange={(e) => setConfig({ ...config, enableColors: e.target.checked })}
                      className="w-4 h-4 accent-amber-500"
                    />
                    <span>تفعيل اختيار الألوان</span>
                  </label>
                  {config.enableColors && (
                    <input
                      type="text"
                      value={config.colors}
                      onChange={(e) => setConfig({ ...config, colors: e.target.value })}
                      placeholder="أسود, كحلي, رمادي"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. تبويب ثيمات الألوان الجاهزة */}
        {activeTab === "themes" && (
          <div className="mt-6 space-y-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
              <div>
                <h3 className="font-bold text-amber-400 text-base">اختر ثيم القالب المناسب لمنتجك</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  تغيير الثيم يغير ألوان الخلفية، الأزرار، والخطوط تلقائياً لتناسب سيكولوجية بيع المنتج
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                {THEMES_LIST.map((th) => {
                  const isSelected = config.selectedTheme === th.id;
                  return (
                    <div
                      key={th.id}
                      onClick={() => setConfig({ ...config, selectedTheme: th.id as ThemeType })}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition relative ${
                        isSelected
                          ? "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10"
                          : "border-neutral-800 bg-neutral-950 hover:border-neutral-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-neutral-200">{th.name}</span>
                        <span className="w-5 h-5 rounded-full" style={{ backgroundColor: th.color }} />
                      </div>
                      <p className="text-xs text-neutral-400">{th.bg}</p>
                      {isSelected && (
                        <span className="absolute top-2 left-2 text-amber-400 font-bold text-xs">✓ مفعل</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. تبويب الدول والمحافظات وإضافة دولة جديدة */}
        {activeTab === "shipping" && (
          <div className="mt-6 space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                <div>
                  <h3 className="font-bold text-amber-400 text-base">الدولة المستهدفة ومناطق الشحن</h3>
                  <p className="text-xs text-neutral-400 mt-1">اختر الدولة الحالية للحملة أو أضف دولة جديدة</p>
                </div>
                <button
                  onClick={() => setShowAddCountryModal(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs px-3 py-2 rounded-lg transition"
                >
                  + إضافة دولة جديدة
                </button>
              </div>

              {/* أزرار اختيار الدولة */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.keys(config.countries).map((cCode) => {
                  const country = config.countries[cCode];
                  const isSelected = config.activeCountry === cCode;
                  return (
                    <button
                      key={cCode}
                      onClick={() => setConfig({ ...config, activeCountry: cCode })}
                      className={`p-3 rounded-xl border-2 text-center transition ${
                        isSelected
                          ? "border-amber-500 bg-amber-500/10 font-bold text-white"
                          : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700"
                      }`}
                    >
                      <div className="text-sm">{country.name}</div>
                      <div className="text-xs text-amber-400 mt-1 font-mono">{country.currency}</div>
                    </button>
                  );
                })}
              </div>

              {/* إدارة محافظات الدولة النشطة */}
              <div className="pt-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2">
                  <span className="font-bold text-sm text-neutral-200">
                    محافظات ومناطق {currentCountry.name} ({currentCountry.provinces.filter((p) => p.enabled).length} مفعّلة)
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const updated = { ...config.countries };
                        updated[config.activeCountry].provinces = updated[config.activeCountry].provinces.map((p) => ({
                          ...p,
                          enabled: true
                        }));
                        setConfig({ ...config, countries: updated });
                      }}
                      className="text-xs bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 rounded text-neutral-300"
                    >
                      تفعيل الكل
                    </button>
                    <button
                      onClick={() => {
                        const updated = { ...config.countries };
                        updated[config.activeCountry].provinces = updated[config.activeCountry].provinces.map((p) => ({
                          ...p,
                          enabled: false
                        }));
                        setConfig({ ...config, countries: updated });
                      }}
                      className="text-xs bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 rounded text-neutral-300"
                    >
                      تعطيل الكل
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
                  {currentCountry.provinces.map((prov, index) => (
                    <div
                      key={prov.id}
                      className={`p-3 rounded-lg border flex items-center justify-between gap-2 transition ${
                        prov.enabled ? "bg-neutral-950 border-neutral-800" : "bg-neutral-950/40 border-neutral-900 opacity-50"
                      }`}
                    >
                      <label className="flex items-center gap-2 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={prov.enabled}
                          onChange={(e) => {
                            const updated = { ...config.countries };
                            updated[config.activeCountry].provinces[index].enabled = e.target.checked;
                            setConfig({ ...config, countries: updated });
                          }}
                          className="w-4 h-4 accent-amber-500"
                        />
                        <span className="text-xs font-semibold">{prov.name}</span>
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={prov.shippingCost}
                          onChange={(e) => {
                            const updated = { ...config.countries };
                            updated[config.activeCountry].provinces[index].shippingCost = Number(e.target.value);
                            setConfig({ ...config, countries: updated });
                          }}
                          className="w-14 bg-neutral-900 border border-neutral-800 rounded px-1 py-0.5 text-xs text-center font-mono"
                          title="تكلفة الشحن (0 للشحن المجاني)"
                        />
                        <span className="text-[10px] text-neutral-400">{currentCountry.currency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* نافذة إضافة دولة جديدة */}
            {showAddCountryModal && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl max-w-md w-full space-y-4">
                  <h3 className="font-bold text-base text-amber-400">إضافة دولة جديدة للنظام</h3>
                  <form onSubmit={handleAddNewCountry} className="space-y-3">
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">اسم الدولة (مثلاً: الكويت / الأردن)</label>
                      <input
                        type="text"
                        required
                        value={newCountryName}
                        onChange={(e) => setNewCountryName(e.target.value)}
                        placeholder="الكويت"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-neutral-300 mb-1">رمز الدولة (مثال: KW)</label>
                        <input
                          type="text"
                          required
                          value={newCountryCode}
                          onChange={(e) => setNewCountryCode(e.target.value)}
                          placeholder="KW"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs uppercase text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-300 mb-1">رمز العملة (مثال: د.ك)</label>
                        <input
                          type="text"
                          required
                          value={newCountryCurrency}
                          onChange={(e) => setNewCountryCurrency(e.target.value)}
                          placeholder="د.ك"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-center"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">كود الاتصال الدولي (مثال: +965)</label>
                      <input
                        type="text"
                        required
                        value={newCountryPhoneCode}
                        onChange={(e) => setNewCountryPhoneCode(e.target.value)}
                        placeholder="+965"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-left font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">
                        المحافظات / المدن (اكتبها مفصولة بفاصلة)
                      </label>
                      <textarea
                        rows={3}
                        value={newCountryProvincesRaw}
                        onChange={(e) => setNewCountryProvincesRaw(e.target.value)}
                        placeholder="حولي, الفروانية, الأحمدي, العاصمة, الجهراء"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 rounded-lg text-xs"
                      >
                        إضافة وتفعيل فوراً
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddCountryModal(false)}
                        className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-4 py-2 rounded-lg text-xs"
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. تبويب المعرض والشرح */}
        {activeTab === "gallery" && (
          <div className="mt-6 space-y-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                <div>
                  <h3 className="font-bold text-amber-400 text-base">معرض الصور مع الشرح التوضيحي</h3>
                  <p className="text-xs text-neutral-400">أضف صوراً تفصيلية للمنتج واكتب تحت كل صورة شرحها</p>
                </div>
                <label className="cursor-pointer bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs px-3 py-2 rounded-lg">
                  <span>+ رفع صورة من الاستوديو</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(e, (url) => {
                        const newItem: GalleryItem = {
                          id: Date.now().toString(),
                          image: url,
                          caption: "اكتب وصفاً أو شرحاً لهذه الصورة هنا"
                        };
                        setConfig({ ...config, gallery: [...config.gallery, newItem] });
                      })
                    }
                  />
                </label>
              </div>

              {config.gallery.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-xs">لا توجد صور مضافة للمعرض</div>
              ) : (
                <div className="space-y-3">
                  {config.gallery.map((g, idx) => (
                    <div key={g.id} className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 flex gap-3 items-center">
                      <img src={g.image} alt="Detail" className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                      <input
                        type="text"
                        value={g.caption}
                        onChange={(e) => {
                          const updated = [...config.gallery];
                          updated[idx].caption = e.target.value;
                          setConfig({ ...config, gallery: updated });
                        }}
                        className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs"
                      />
                      <button
                        onClick={() => {
                          setConfig({ ...config, gallery: config.gallery.filter((_, i) => i !== idx) });
                        }}
                        className="text-red-400 text-xs hover:underline"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. تبويب التقييمات */}
        {activeTab === "reviews" && (
          <div className="mt-6 space-y-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                <h3 className="font-bold text-amber-400 text-base">تقييمات وآراء العملاء</h3>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={config.showReviews}
                    onChange={(e) => setConfig({ ...config, showReviews: e.target.checked })}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span>تفعيل التقييمات</span>
                </label>
              </div>

              {config.showReviews && (
                <div className="space-y-3">
                  {config.reviews.map((r, idx) => (
                    <div key={idx} className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={r.name}
                          onChange={(e) => {
                            const updated = [...config.reviews];
                            updated[idx].name = e.target.value;
                            setConfig({ ...config, reviews: updated });
                          }}
                          className="w-1/3 bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs font-bold"
                          placeholder="اسم المشتري"
                        />
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={r.rating}
                          onChange={(e) => {
                            const updated = [...config.reviews];
                            updated[idx].rating = Number(e.target.value);
                            setConfig({ ...config, reviews: updated });
                          }}
                          className="w-16 bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-center"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={r.comment}
                        onChange={(e) => {
                          const updated = [...config.reviews];
                          updated[idx].comment = e.target.value;
                          setConfig({ ...config, reviews: updated });
                        }}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setConfig({
                        ...config,
                        reviews: [...config.reviews, { name: "عميل جديد", comment: "منتج ممتاز وتوصيل سريع", rating: 5 }]
                      })
                    }
                    className="text-xs text-amber-400 hover:underline"
                  >
                    + إضافة تقييم جديد
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. تبويب الطلبات */}
        {activeTab === "orders" && (
          <div className="mt-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                <h3 className="font-bold text-amber-400 text-base">سجل الطلبات الواردة</h3>
                {orders.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm("هل تريد مسح سجل الطلبات بالكامل؟")) {
                        localStorage.removeItem("store_orders");
                        setOrders([]);
                      }
                    }}
                    className="text-xs text-red-400 hover:underline"
                  >
                    مسح السجل
                  </button>
                )}
              </div>
              {orders.length === 0 ? (
                <div className="text-center py-10 text-neutral-500 text-xs">لا توجد طلبات واردة حتى الآن</div>
              ) : (
                <div className="divide-y divide-neutral-800">
                  {orders.map((o, i) => (
                    <div key={i} className="py-3 space-y-1.5 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-white">{o.fullName}</span>
                        <span className="text-amber-400">
                          {o.total} {o.currency} (شحن: {o.shippingCost} {o.currency})
                        </span>
                      </div>
                      <div className="text-neutral-400 flex flex-wrap gap-3">
                        <span>هاتف: <b className="text-neutral-200">{o.phone}</b></span>
                        {o.altPhone && <span>بديل: <b className="text-neutral-200">{o.altPhone}</b></span>}
                        <span>الدولة: <b className="text-neutral-200">{o.countryName}</b></span>
                        <span>المحافظة: <b className="text-neutral-200">{o.governorate}</b></span>
                        {o.selectedSize && <span>المقاس: <b className="text-amber-400">{o.selectedSize}</b></span>}
                        {o.selectedColor && <span>اللون: <b className="text-amber-400">{o.selectedColor}</b></span>}
                      </div>
                      <div className="text-neutral-300">العنوان: {o.address}</div>
                      {o.notes && <div className="text-neutral-400 italic">ملاحظات: {o.notes}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 7. تبويب الأمان والبيكسل */}
        {activeTab === "security" && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
              <h3 className="font-bold text-amber-400 text-base border-b border-neutral-800 pb-2">التتبع والواتساب</h3>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  رقم الواتساب لاستقبال إشعارات الطلبات
                </label>
                <input
                  type="text"
                  value={config.whatsappNumber}
                  onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                  placeholder="+201000000000"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-left font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Meta Pixel ID (فيسبوك)</label>
                <input
                  type="text"
                  value={config.metaPixelId}
                  onChange={(e) => setConfig({ ...config, metaPixelId: e.target.value })}
                  placeholder="مثلاً: 123456789012345"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-left"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">TikTok Pixel ID</label>
                <input
                  type="text"
                  value={config.tiktokPixelId}
                  onChange={(e) => setConfig({ ...config, tiktokPixelId: e.target.value })}
                  placeholder="مثلاً: C6V1234567890"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-left"
                />
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
              <h3 className="font-bold text-amber-400 text-base border-b border-neutral-800 pb-2">بيانات دخول المشرف</h3>
              {authSuccessMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-2.5 rounded-lg text-center">
                  {authSuccessMsg}
                </div>
              )}
              <form onSubmit={handleUpdateSecurity} className="space-y-3">
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">البريد الجديد</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder={adminEmail}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-left"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-left"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 rounded-lg text-xs"
                >
                  حفظ بيانات الدخول
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
