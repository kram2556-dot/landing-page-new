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

const THEMES_LIST = [
  { id: "sneakers" as ThemeType, name: "أحذية ورياضة (Street Sneakers)", desc: "داكن كربوني / برتقالي ناري محفز", color: "#f59e0b" },
  { id: "perfume" as ThemeType, name: "عطور وتجميل (Royal Perfume)", desc: "بنفسجي ليلي ملكي / ذهب شمبانيا", color: "#dfba73" },
  { id: "fashion" as ThemeType, name: "ملابس وأزياء (Fashion Elegance)", desc: "إسبريسو دافئ / برونزي توسكاني", color: "#d4a373" },
  { id: "medical" as ThemeType, name: "منتجات طبية وصحية (Clinical Clean)", desc: "أبيض بورسلين نقي / أزرق ملكي كحلي", color: "#0284c7" },
  { id: "home" as ThemeType, name: "أدوات منزلية وإلكترونيات (Home & Tech)", desc: "كحلي تكنولوجي داكن / تيتانيوم أزرق", color: "#3b82f6" },
  { id: "kids" as ThemeType, name: "ألعاب أطفال وهدايا (Kids Joy)", desc: "رمادي ناعم ونظيف / أخضر زمردي مبهج", color: "#10b981" }
];

export default function Admin() {
  const [config, setConfig] = useState<StoreConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<"product" | "themes" | "shipping" | "marketing" | "settings" | "orders">("product");
  const [savedMsg, setSavedMsg] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // جلب البيانات السحابية والإعدادات
  useEffect(() => {
    fetch('/api/store')
      .then(res => res.json())
      .then(cloudData => {
        if (cloudData && Object.keys(cloudData).length > 0) {
          setConfig({
            ...DEFAULT_CONFIG,
            ...cloudData,
            adminPassword: cloudData.adminPassword || "admin",
            countries: { ...DEFAULT_COUNTRIES, ...(cloudData.countries || {}) }
          });
          localStorage.setItem("store_config", JSON.stringify(cloudData));
        } else {
          loadFromLocal();
        }
      })
      .catch(() => loadFromLocal());

    function loadFromLocal() {
      const saved = localStorage.getItem("store_config");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setConfig({
            ...DEFAULT_CONFIG,
            ...parsed,
            adminPassword: parsed.adminPassword || "admin",
            countries: { ...DEFAULT_COUNTRIES, ...(parsed.countries || {}) }
          });
        } catch (e) {
          console.error(e);
        }
      }
    }

    // جلب الطلبات السحابية من مسار /api/orders
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
          localStorage.setItem("store_orders", JSON.stringify(data));
        }
      })
      .catch(() => {
        const ords = localStorage.getItem("store_orders");
        if (ords) {
          try {
            setOrders(JSON.parse(ords));
          } catch (e) {
            console.error(e);
          }
        }
      });

    if (sessionStorage.getItem("admin_logged_in") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctEmail = config.adminEmail || "admin@example.com";
    const correctPass = config.adminPassword || "admin";

    if (loginEmail.trim().toLowerCase() === correctEmail.trim().toLowerCase() && loginPassword === correctPass) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_logged_in", "true");
      setLoginError("");
    } else {
      setLoginError("بيانات الدخول غير صحيحة، يرجى التأكد من البريد وكلمة السر");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_logged_in");
  };

  // الحفظ السحابي في Cloudflare KV والمحلي
  const handleSave = async () => {
    localStorage.setItem("store_config", JSON.stringify(config));
    try {
      await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
    } catch (e) {
      console.error("Cloud save failed:", e);
    }
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleClearOrders = async () => {
    if (confirm("هل أنت متأكد من مسح جميع الطلبات نهائياً من السحابة؟")) {
      try {
        await fetch('/api/orders', { method: 'DELETE' });
      } catch (e) {
        console.error(e);
      }
      localStorage.removeItem("store_orders");
      setOrders([]);
    }
  };

  const compressAndSetImage = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 900;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        callback(compressedBase64);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="bg-neutral-900 border border-neutral-800 p-7 rounded-3xl max-w-sm w-full space-y-5 shadow-2xl">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto text-2xl font-bold border border-amber-500/20">
              🔒
            </div>
            <h1 className="text-xl font-black text-amber-400">لوحة تحكم المتجر</h1>
            <p className="text-xs text-neutral-400">أدخل بيانات المدير لتسجيل الدخول</p>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs text-center font-bold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1 font-bold">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder={config.adminEmail}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1 font-bold">كلمة المرور</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="كلمة السر"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-3 rounded-xl text-sm transition shadow-lg"
            >
              تسجيل الدخول
            </button>
          </form>

          <div className="text-center">
            <a href="/" className="text-xs text-neutral-500 hover:text-neutral-400">الرجوع للمتجر</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans p-4 sm:p-6" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* شريط الإدارة العلوي */}
        <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
          <div>
            <h1 className="text-xl font-black text-amber-400">إدارة المتجر</h1>
            <p className="text-xs text-emerald-400 font-semibold">متصل سحابياً بـ Cloudflare KV ✓</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {savedMsg && <span className="text-emerald-400 text-xs font-bold animate-pulse">تم الحفظ السحابي بنجاح! ✓</span>}
            <button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition"
            >
              حفظ التعديلات
            </button>
            <a href="/" target="_blank" className="bg-neutral-800 hover:bg-neutral-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition">
              عرض المتجر ↗
            </a>
            <button
              onClick={handleLogout}
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition"
            >
              خروج
            </button>
          </div>
        </div>

        {/* أزرار التبويبات الشاملة */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-3">
          {[
            { id: "product", name: "المنتج والعروض" },
            { id: "themes", name: "ثيمات الألوان (6 ثيمات)" },
            { id: "shipping", name: "الشحن والمحافظات" },
            { id: "marketing", name: "التسويق والبكسل (ميتا/تيك توك/جوجل)" },
            { id: "settings", name: "حساب الإدارة والأمان (الباسورد)" },
            { id: "orders", name: `الطلبات السحابية (${orders.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === tab.id ? "bg-amber-500 text-black shadow-md" : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* 1. تبويب المنتج والعروض */}
        {activeTab === "product" && (
          <div className="space-y-6 bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
            <h2 className="font-bold text-base text-amber-400">بيانات المنتج وتفاصيل العرض</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">اسم المتجر</label>
                <input
                  type="text"
                  value={config.storeName}
                  onChange={(e) => setConfig({ ...config, storeName: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">عنوان المنتج الرئيسي</label>
                <input
                  type="text"
                  value={config.productTitle}
                  onChange={(e) => setConfig({ ...config, productTitle: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs sm:text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">السعر الحالي</label>
                  <input
                    type="number"
                    value={config.currentPrice}
                    onChange={(e) => setConfig({ ...config, currentPrice: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm font-bold text-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">السعر القديم (المشطوب)</label>
                  <input
                    type="number"
                    value={config.oldPrice}
                    onChange={(e) => setConfig({ ...config, oldPrice: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">رابط صورة المنتج أو رفع ملف</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={config.productImage}
                    onChange={(e) => setConfig({ ...config, productImage: e.target.value })}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs"
                  />
                  <label className="bg-neutral-800 hover:bg-neutral-700 px-4 py-3 rounded-xl text-xs font-bold cursor-pointer transition">
                    رفع صورة
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) compressAndSetImage(file, (base64) => setConfig({ ...config, productImage: base64 }));
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="border-t border-neutral-800 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-amber-400 block">شريط أسفل صورة المنتج (المعاينة والبادج)</label>
                    <span className="text-[10px] text-neutral-500">يمكنك إيقافه بالكامل، أو تعديل نصوصه، أو حذف البادج بمسح خانته</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.showBadge}
                    onChange={(e) => setConfig({ ...config, showBadge: e.target.checked })}
                    className="w-4 h-4 accent-amber-500"
                  />
                </div>
                {config.showBadge && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">النص الأيمن (المعاينة)</label>
                      <input
                        type="text"
                        value={config.badgeText}
                        onChange={(e) => setConfig({ ...config, badgeText: e.target.value })}
                        placeholder="معاينة مجانية للمنتج قبل الدفع"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">بادج الشحن والتغليف (اتركه فارغاً لإلغائه)</label>
                      <input
                        type="text"
                        value={config.guaranteeBadgeText}
                        onChange={(e) => setConfig({ ...config, guaranteeBadgeText: e.target.value })}
                        placeholder="يشمل التوصيل والتغليف"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-neutral-800 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold">تفعيل اختيار المقاسات</label>
                    <input
                      type="checkbox"
                      checked={config.enableSizes}
                      onChange={(e) => setConfig({ ...config, enableSizes: e.target.checked })}
                      className="w-4 h-4 accent-amber-500"
                    />
                  </div>
                  <input
                    type="text"
                    value={config.sizes}
                    onChange={(e) => setConfig({ ...config, sizes: e.target.value })}
                    placeholder="41, 42, 43 أو 41، 42، 43"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold">تفعيل اختيار الألوان (دوائر ملونة)</label>
                    <input
                      type="checkbox"
                      checked={config.enableColors}
                      onChange={(e) => setConfig({ ...config, enableColors: e.target.checked })}
                      className="w-4 h-4 accent-amber-500"
                    />
                  </div>
                  <input
                    type="text"
                    value={config.colors}
                    onChange={(e) => setConfig({ ...config, colors: e.target.value })}
                    placeholder="أسود, كحلي, رمادي, أصفر"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              <div className="border-t border-neutral-800 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-neutral-300">معرض الصور التوضيحي مع الشرح</h3>
                  <label className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition">
                    + إضافة صورة للمعرض
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          compressAndSetImage(file, (base64) => {
                            const newG: GalleryItem = { id: String(Date.now()), image: base64, caption: "" };
                            setConfig({ ...config, gallery: [...config.gallery, newG] });
                          });
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="space-y-3">
                  {config.gallery.map((item, idx) => (
                    <div key={item.id} className="flex gap-3 bg-neutral-950 border border-neutral-800 p-3 rounded-xl items-center">
                      <img src={item.image} alt="Thumb" className="w-16 h-16 object-cover rounded-lg border border-neutral-800" />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={item.caption}
                          placeholder="اكتب شرحاً أو تعليقاً توضيحياً لهذه الصورة"
                          onChange={(e) => {
                            const updated = [...config.gallery];
                            updated[idx].caption = e.target.value;
                            setConfig({ ...config, gallery: updated });
                          }}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs"
                        />
                      </div>
                      <button
                        onClick={() => setConfig({ ...config, gallery: config.gallery.filter((_, i) => i !== idx) })}
                        className="text-red-400 hover:text-red-300 text-xs px-2"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. تبويب ثيمات الألوان الستة */}
        {activeTab === "themes" && (
          <div className="space-y-4 bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
            <h2 className="font-bold text-base text-amber-400">اختر ثيم المتجر الجاهز</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEMES_LIST.map((th) => {
                const isSelected = config.selectedTheme === th.id;
                return (
                  <div
                    key={th.id}
                    onClick={() => setConfig({ ...config, selectedTheme: th.id })}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition flex items-center justify-between ${
                      isSelected ? "border-amber-400 bg-amber-500/10" : "border-neutral-800 bg-neutral-950 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span style={{ backgroundColor: th.color }} className="w-5 h-5 rounded-full shadow-md flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-white">{th.name}</p>
                        <p className="text-[11px] text-neutral-400">{th.desc}</p>
                      </div>
                    </div>
                    {isSelected && <span className="text-amber-400 font-bold text-xs">✓ مفعل</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. تبويب الشحن والمحافظات */}
        {activeTab === "shipping" && (
          <div className="space-y-4 bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
            <h2 className="font-bold text-base text-amber-400">إدارة أسعار الشحن والمحافظات</h2>
            <div className="flex items-center gap-3">
              <label className="text-xs text-neutral-400">الدولة المستهدفة:</label>
              <select
                value={config.activeCountry}
                onChange={(e) => setConfig({ ...config, activeCountry: e.target.value })}
                className="bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs font-bold"
              >
                {Object.values(config.countries).map((c) => (
                  <option key={c.code} value={c.code}>{c.name} ({c.currency})</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {config.countries[config.activeCountry]?.provinces.map((prov, idx) => (
                <div key={prov.id} className="flex items-center justify-between bg-neutral-950 border border-neutral-800 p-3 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={prov.enabled}
                      onChange={(e) => {
                        const updated = { ...config };
                        updated.countries[config.activeCountry].provinces[idx].enabled = e.target.checked;
                        setConfig(updated);
                      }}
                      className="w-4 h-4 accent-amber-500"
                    />
                    <span className="font-bold">{prov.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>تكلفة الشحن:</span>
                    <input
                      type="number"
                      value={prov.shippingCost}
                      onChange={(e) => {
                        const updated = { ...config };
                        updated.countries[config.activeCountry].provinces[idx].shippingCost = Number(e.target.value);
                        setConfig(updated);
                      }}
                      className="w-20 bg-neutral-900 border border-neutral-800 rounded-lg p-1.5 text-center font-bold text-amber-400"
                    />
                    <span className="text-neutral-500">{config.countries[config.activeCountry]?.currency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. تبويب التسويق والبكسل */}
        {activeTab === "marketing" && (
          <div className="space-y-4 bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
            <h2 className="font-bold text-base text-amber-400">إعدادات التسويق وأكواد التتبع والواتساب</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">
                  رقم واتساب لاستقبال تفاصيل الطلبات (صيغة دولية مثل: 201012345678)
                </label>
                <input
                  type="text"
                  value={config.whatsappNumber}
                  onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                  placeholder="201000000000"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">
                  رقم واتساب لأيقونة الدعم العائمة (صيغة دولية مثل: 201012345678)
                </label>
                <input
                  type="text"
                  value={config.supportWhatsappNumber}
                  onChange={(e) => setConfig({ ...config, supportWhatsappNumber: e.target.value })}
                  placeholder="201000000000"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Meta Pixel ID (فيسبوك)</label>
                  <input
                    type="text"
                    value={config.metaPixelId}
                    onChange={(e) => setConfig({ ...config, metaPixelId: e.target.value })}
                    placeholder="1234567890"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">TikTok Pixel ID</label>
                  <input
                    type="text"
                    value={config.tiktokPixelId}
                    onChange={(e) => setConfig({ ...config, tiktokPixelId: e.target.value })}
                    placeholder="C1234567890"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1 text-emerald-400">Google Ads Tag / Pixel ID (جوجل)</label>
                  <input
                    type="text"
                    value={config.googlePixelId}
                    onChange={(e) => setConfig({ ...config, googlePixelId: e.target.value })}
                    placeholder="AW-123456789"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. تبويب حساب الإدارة والأمان */}
        {activeTab === "settings" && (
          <div className="space-y-4 bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
            <h2 className="font-bold text-base text-amber-400">حساب المدير والأمان للدخول للوحة</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1 font-bold">البريد الإلكتروني المعتمد للمدير</label>
                <input
                  type="email"
                  value={config.adminEmail}
                  onChange={(e) => setConfig({ ...config, adminEmail: e.target.value })}
                  placeholder="admin@example.com"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1 font-bold text-amber-400">كلمة المرور للدخول للوحة التحكم</label>
                <input
                  type="password"
                  value={config.adminPassword || ""}
                  onChange={(e) => setConfig({ ...config, adminPassword: e.target.value })}
                  placeholder="اكتب كلمة مرور قوية"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono"
                />
                <p className="text-[11px] text-neutral-500 mt-1">احفظ كلمة المرور جيداً لأنك ستدخل بها في كل مرة تفتح لوحة التحكم.</p>
              </div>
            </div>
          </div>
        )}

        {/* 6. تبويب الطلبات السحابية */}
        {activeTab === "orders" && (
          <div className="space-y-4 bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold text-base text-amber-400">سجل الطلبات السحابية ({orders.length})</h2>
                <span className="text-[10px] text-neutral-500">يتم سحب الطلبات مباشرة من Cloudflare KV</span>
              </div>
              {orders.length > 0 && (
                <button
                  onClick={handleClearOrders}
                  className="text-red-400 hover:text-red-300 text-xs bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg transition"
                >
                  مسح السجل سحابياً
                </button>
              )}
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-neutral-500 py-8 text-center">لا توجد طلبات مسجلة بعد على السحابة</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {orders.map((ord, i) => (
                  <div key={ord.id || i} className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold text-amber-400">
                      <span>{ord.fullName}</span>
                      <span>{ord.total} {ord.currency}</span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-300">
                      <span>الهاتف: {ord.phone} {ord.altPhone ? `(بديل: ${ord.altPhone})` : ""}</span>
                      <a 
                        href={`https://wa.me/${ord.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank" 
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline text-[11px]"
                      >
                        مراسلة المشتري واتساب ↗
                      </a>
                    </div>
                    <p className="text-neutral-400">العنوان: {ord.governorate} — {ord.address}</p>
                    {(ord.selectedSize || ord.selectedColor) && (
                      <p className="text-neutral-400">
                        {ord.selectedSize ? `المقاس: ${ord.selectedSize} ` : ""}
                        {ord.selectedColor ? `| اللون: ${ord.selectedColor}` : ""}
                      </p>
                    )}
                    {ord.date && (
                      <p className="text-[10px] text-neutral-500">
                        تاريخ الطلب: {new Date(ord.date).toLocaleString("ar-EG")}
                      </p>
                    )}
                    {ord.notes && <p className="text-neutral-500 italic">ملاحظات: {ord.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
