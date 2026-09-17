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
  metaAccessToken: string;
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
      { id: "alex", name: "الإسكندرية", enabled: true, shippingCost: 0 },
      { id: "qalyubia", name: "القليوبية", enabled: true, shippingCost: 0 },
      { id: "sharqia", name: "الشرقية", enabled: true, shippingCost: 0 },
      { id: "dakahlia", name: "الدقهلية", enabled: true, shippingCost: 0 }
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
      { id: "dammam", name: "الدمام", enabled: true, shippingCost: 0 },
      { id: "madinah", name: "المدينة المنورة", enabled: true, shippingCost: 0 }
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
      { id: "ajman", name: "عجمان", enabled: true, shippingCost: 0 }
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
      { id: "zawiya", name: "الزاوية", enabled: true, shippingCost: 0 }
    ]
  }
};

const DEFAULT_CONFIG: StoreConfig = {
  storeName: "متجر تجريبي",
  adminEmail: "admin@example.com",
  adminPassword: "",
  logoUrl: "",
  selectedTheme: "sneakers",
  showTopBar: true,
  topBarText: "عرض خاص لفترة محدودة — شحن سريع وتوصيل للمنزل",
  showTimer: true,
  timerMinutes: 15,
  showStockBar: true,
  stockLeft: 10,
  showBadge: true,
  badgeText: "معاينة مجانية للمنتج قبل الدفع",
  guaranteeBadgeText: "يشمل التوصيل والتغليف",
  showRecentSales: true,
  showStickyButton: true,
  showSupportWhatsapp: false,
  supportWhatsappNumber: "",
  activeCountry: "EG",
  countries: DEFAULT_COUNTRIES,
  productTitle: "اسم المنتج هنا",
  productImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
  gallery: [],
  currentPrice: 199,
  oldPrice: 350,
  features: [
    "خامات عالية الجودة وممتازة",
    "ضمان معاينة وفحص قبل الاستلام",
    "توصيل سريع حتى باب المنزل"
  ],
  enableSizes: false,
  sizes: "M, L, XL",
  enableColors: false,
  colors: "أسود, أبيض",
  showBundles: false,
  bundles: [
    { qty: 1, title: "قطعة واحدة", price: 199 },
    { qty: 2, title: "قطعتان (باقة التوفير)", price: 349, badge: "الأكثر طلباً", savings: "وفر 49" }
  ],
  showGuarantee: true,
  guaranteeText: "معاينة مجانية كاملة عند باب منزلك قبل السداد",
  guaranteeSubtext: "يحق لك فحص الجودة وتجربة المنتج مع المندوب دون أي التزام",
  showReviews: true,
  reviews: [
    { name: "عميل موثق", comment: "منتج ممتاز وخامة ممتازة وسرعة في التوصيل.", rating: 5 }
  ],
  whatsappNumber: "",
  metaPixelId: "",
  metaAccessToken: "",
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
  const [activeTab, setActiveTab] = useState<"product" | "marketing_tools" | "themes" | "shipping" | "pixels" | "settings" | "orders">("product");
  const [savedMsg, setSavedMsg] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passMsg, setPassMsg] = useState("");

  const [newProvinceName, setNewProvinceName] = useState("");
  const [newProvinceCost, setNewProvinceCost] = useState(0);

  const [newCountryName, setNewCountryName] = useState("");
  const [newCountryCode, setNewCountryCode] = useState("");
  const [newCountryCurrency, setNewCountryCurrency] = useState("");
  const [newCountryPhoneCode, setNewCountryPhoneCode] = useState("");

  const fetchCloudOrders = (token?: string) => {
    const currentToken = token || sessionStorage.getItem("admin_token");
    if (!currentToken) return;
    fetch("/api/orders", {
      headers: { "x-admin-token": currentToken }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch((err) => console.error(err));
  };

  const loadStoreConfig = (token?: string) => {
    const currentToken = token || sessionStorage.getItem("admin_token");
    const headers: Record<string, string> = {};
    if (currentToken) headers["x-admin-token"] = currentToken;

    fetch("/api/store", { headers })
      .then((res) => res.json())
      .then((cloudData) => {
        if (cloudData && Object.keys(cloudData).length > 0) {
          setConfig({
            ...DEFAULT_CONFIG,
            ...cloudData,
            adminPassword: "",
            gallery: cloudData.gallery || [],
            countries: { ...DEFAULT_COUNTRIES, ...(cloudData.countries || {}) }
          });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    const existingToken = sessionStorage.getItem("admin_token");
    if (existingToken) {
      setIsAuthenticated(true);
      loadStoreConfig(existingToken);
      fetchCloudOrders(existingToken);
    } else {
      loadStoreConfig();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        sessionStorage.setItem("admin_token", data.token);
        setIsAuthenticated(true);
        setLoginError("");
        loadStoreConfig(data.token);
        fetchCloudOrders(data.token);
      } else {
        setLoginError(data.error || "بيانات الدخول غير صحيحة");
      }
    } catch (err) {
      setLoginError("تعذر الاتصال بخادم الحماية");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_token");
  };

  const handleSave = async () => {
    const token = sessionStorage.getItem("admin_token");
    const payload = { ...config };
    if (newPassword.trim() !== "") {
      if (newPassword !== confirmPassword) {
        setPassMsg("كلمتا المرور غير متطابقتين!");
        return;
      }
      payload.adminPassword = newPassword;
    }

    try {
      const res = await fetch("/api/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token || ""
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSavedMsg(true);
        if (newPassword.trim() !== "") {
          setPassMsg("تم تحديث كلمة المرور بنجاح!");
          setNewPassword("");
          setConfirmPassword("");
        }
        setTimeout(() => setSavedMsg(false), 4000);
      } else {
        alert("انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى");
        handleLogout();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    const token = sessionStorage.getItem("admin_token");
    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token || ""
        },
        body: JSON.stringify({ id, status: newStatus })
      });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
    } catch (e) {
      alert("فشل تحديث حالة الطلب");
    }
  };

  const handleClearOrders = async () => {
    const token = sessionStorage.getItem("admin_token");
    if (confirm("هل أنت متأكد من مسح جميع الطلبات نهائياً من السحابة؟")) {
      try {
        await fetch("/api/orders", {
          method: "DELETE",
          headers: { "x-admin-token": token || "" }
        });
        setOrders([]);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleAddProvince = () => {
    if (!newProvinceName.trim()) return;
    const currentCountry = config.countries[config.activeCountry];
    if (!currentCountry) return;

    const newId = `prov_${Date.now()}`;
    const updatedProvinces = [
      ...currentCountry.provinces,
      { id: newId, name: newProvinceName.trim(), enabled: true, shippingCost: Number(newProvinceCost) || 0 }
    ];

    setConfig({
      ...config,
      countries: {
        ...config.countries,
        [config.activeCountry]: {
          ...currentCountry,
          provinces: updatedProvinces
        }
      }
    });

    setNewProvinceName("");
    setNewProvinceCost(0);
  };

  const handleAddCountry = () => {
    if (!newCountryName.trim() || !newCountryCode.trim()) {
      alert("يرجى كتابة اسم الدولة ورمزها (مثال: KW للكويت)");
      return;
    }
    const cleanCode = newCountryCode.trim().toUpperCase();
    if (config.countries[cleanCode]) {
      alert("هذه الدولة مسجلة بالفعل!");
      return;
    }

    const newCountryObj: CountryConfig = {
      code: cleanCode,
      name: newCountryName.trim(),
      currency: newCountryCurrency.trim() || "عملة",
      phoneCode: newCountryPhoneCode.trim() || "+",
      provinces: [
        { id: `prov_${Date.now()}`, name: "المدينة الرئيسية", enabled: true, shippingCost: 0 }
      ]
    };

    setConfig({
      ...config,
      activeCountry: cleanCode,
      countries: {
        ...config.countries,
        [cleanCode]: newCountryObj
      }
    });

    setNewCountryName("");
    setNewCountryCode("");
    setNewCountryCurrency("");
    setNewCountryPhoneCode("");
    alert(`تمت إضافة دولة (${newCountryObj.name}) بنجاح!`);
  };

  const exportToCSV = () => {
    if (orders.length === 0) return alert("لا توجد طلبات لتصديرها");
    const headers = ["معرف الطلب", "التاريخ", "الاسم", "الهاتف", "المحافظة", "العنوان", "الكمية", "المقاس", "اللون", "الإجمالي", "الحالة"];
    const rows = orders.map((o) => [
      o.id,
      new Date(o.createdAt || o.date).toLocaleString("ar-EG"),
      `"${o.fullName || ""}"`,
      `"${o.phone || ""}"`,
      `"${o.governorate || ""}"`,
      `"${(o.address || "").replace(/"/g, '""')}"`,
      o.qty || 1,
      o.selectedSize || "-",
      o.selectedColor || "-",
      `${o.total} ${o.currency}`,
      o.status || "جديد"
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        callback(canvas.toDataURL("image/jpeg", 0.7));
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
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto text-2xl font-bold border border-amber-500/20">🔒</div>
            <h1 className="text-xl font-black text-amber-400">لوحة تحكم المتجر</h1>
            <p className="text-xs text-neutral-400">تسجيل دخول مشفر ومحمي بالسيرفر</p>
          </div>
          {loginError && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs text-center font-bold">{loginError}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1 font-bold">البريد الإلكتروني</label>
              <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="admin@example.com" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1 font-bold">كلمة المرور</label>
              <input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="كلمة السر" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs focus:outline-none" />
            </div>
            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-3 rounded-xl text-sm transition shadow-lg">تسجيل الدخول</button>
          </form>
          <div className="text-center"><a href="/" className="text-xs text-neutral-500 hover:text-neutral-400">الرجوع للمتجر</a></div>
        </div>
      </div>
    );
  }

  const activeCountryData = config.countries[config.activeCountry] || DEFAULT_COUNTRIES.EG;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans p-4 sm:p-6" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
          <div>
            <h1 className="text-xl font-black text-amber-400">إدارة المتجر</h1>
            <p className="text-xs text-emerald-400 font-semibold">حماية سحابية كاملة ومصادقة مشفرة ✓</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {savedMsg && <span className="text-emerald-400 text-xs font-bold animate-pulse">تم الحفظ بنجاح! ✓</span>}
            <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition">حفظ التعديلات</button>
            <a href="/" target="_blank" className="bg-neutral-800 hover:bg-neutral-700 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition">عرض المتجر ↗</a>
            <button onClick={handleLogout} className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition">خروج</button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-3">
          {[
            { id: "product", name: "المنتج والصور" },
            { id: "marketing_tools", name: "أدوات الترويج والعداد" },
            { id: "themes", name: "ثيمات الألوان" },
            { id: "shipping", name: "الدول والشحن" },
            { id: "pixels", name: "البيكسل و CAPI" },
            { id: "settings", name: "حساب الإدارة والأمان" },
            { id: "orders", name: `الطلبات السحابية (${orders.length})` }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${activeTab === tab.id ? "bg-amber-500 text-black shadow-md" : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800"}`}>
              {tab.name}
            </button>
          ))}
        </div>

        {/* تبويب المنتج والصور والمعرض */}
        {activeTab === "product" && (
          <div className="space-y-6 bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
            <h2 className="font-bold text-base text-amber-400">بيانات المنتج وتفاصيل العرض</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">اسم المتجر</label>
                <input type="text" value={config.storeName} onChange={(e) => setConfig({ ...config, storeName: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs sm:text-sm" />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">عنوان المنتج الرئيسي</label>
                <input type="text" value={config.productTitle} onChange={(e) => setConfig({ ...config, productTitle: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs sm:text-sm font-bold" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">السعر الحالي</label>
                  <input type="number" value={config.currentPrice} onChange={(e) => setConfig({ ...config, currentPrice: Number(e.target.value) })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm font-bold text-amber-400" />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">السعر القديم المشطوب</label>
                  <input type="number" value={config.oldPrice} onChange={(e) => setConfig({ ...config, oldPrice: Number(e.target.value) })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm" />
                </div>
              </div>

              {/* الصورة الرئيسية */}
              <div className="space-y-2 border-t border-neutral-800 pt-4">
                <label className="block text-xs text-neutral-300 font-bold">صورة المنتج الرئيسية</label>
                <div className="flex items-center gap-3">
                  {config.productImage && (
                    <img src={config.productImage} alt="Main Preview" className="w-14 h-14 rounded-xl object-cover border border-neutral-800 flex-shrink-0" />
                  )}
                  <div className="flex-1 flex gap-2">
                    <input type="text" value={config.productImage} onChange={(e) => setConfig({ ...config, productImage: e.target.value })} placeholder="رابط الصورة أو ارفع من جهازك" className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs" />
                    <label className="bg-neutral-800 hover:bg-neutral-700 px-4 py-3 rounded-xl text-xs font-bold cursor-pointer transition flex items-center justify-center flex-shrink-0">
                      رفع صورة
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) compressAndSetImage(f, (b) => setConfig({ ...config, productImage: b })); }} />
                    </label>
                  </div>
                </div>
              </div>

              {/* معرض الصور الإضافية (حتى 8 صور) */}
              <div className="space-y-3 border-t border-neutral-800 pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="block text-xs text-amber-400 font-bold">معرض الصور الإضافية (Gallery)</label>
                    <span className="text-[10px] text-neutral-500">تقليب زوايا وتفاصيل المنتج (حتى 8 صور)</span>
                  </div>
                  {(!config.gallery || config.gallery.length < 8) && (
                    <label className="bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition">
                      + إضافة صورة للمعرض
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => { 
                          const f = e.target.files?.[0]; 
                          if (f) {
                            compressAndSetImage(f, (b) => {
                              const newGalleryItem = { id: `img_${Date.now()}`, image: b, caption: "" };
                              setConfig({ ...config, gallery: [...(config.gallery || []), newGalleryItem] });
                            });
                          }
                        }} 
                      />
                    </label>
                  )}
                </div>

                {config.gallery && config.gallery.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {config.gallery.map((item, idx) => (
                      <div key={item.id || idx} className="relative bg-neutral-950 border border-neutral-800 rounded-xl p-2 flex flex-col items-center gap-2">
                        <img src={item.image} alt={`Gallery ${idx + 1}`} className="w-full h-24 object-cover rounded-lg border border-neutral-800" />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = config.gallery.filter((_, i) => i !== idx);
                            setConfig({ ...config, gallery: updated });
                          }}
                          className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-bold py-1 rounded-lg border border-red-500/20 transition"
                        >
                          حذف ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-neutral-950/60 border border-dashed border-neutral-800 p-4 rounded-xl text-center">
                    <p className="text-xs text-neutral-500">لا توجد صور إضافية في المعرض حالياً (يتم عرض الصورة الرئيسية فقط).</p>
                  </div>
                )}
              </div>

              {/* المقاسات والألوان */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-neutral-800 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold">تفعيل خيارات المقاسات</label>
                    <input type="checkbox" checked={config.enableSizes} onChange={(e) => setConfig({ ...config, enableSizes: e.target.checked })} className="w-4 h-4 accent-amber-500" />
                  </div>
                  <input type="text" disabled={!config.enableSizes} value={config.sizes} onChange={(e) => setConfig({ ...config, sizes: e.target.value })} placeholder="41, 42, 43, 44" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs disabled:opacity-40" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold">تفعيل خيارات الألوان</label>
                    <input type="checkbox" checked={config.enableColors} onChange={(e) => setConfig({ ...config, enableColors: e.target.checked })} className="w-4 h-4 accent-amber-500" />
                  </div>
                  <input type="text" disabled={!config.enableColors} value={config.colors} onChange={(e) => setConfig({ ...config, colors: e.target.value })} placeholder="أسود, أبيض, رمادي" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs disabled:opacity-40" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* تبويب أدوات الترويج والعداد والعروض (اختياري بالكامل) */}
        {activeTab === "marketing_tools" && (
          <div className="space-y-6 bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
            <h2 className="font-bold text-base text-amber-400">التحكم في عناصر التحفيز (إظهار / إخفاء)</h2>

            {/* العداد التنازلي وشريط المخزون */}
            <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-white block">عداد التنازل (العد التنازلي الوهمي)</label>
                  <span className="text-[10px] text-neutral-400">إظهار مؤقت انتهاء العرض لإضفاء طابع الاستعجال</span>
                </div>
                <input type="checkbox" checked={config.showTimer} onChange={(e) => setConfig({ ...config, showTimer: e.target.checked })} className="w-4 h-4 accent-amber-500" />
              </div>
              {config.showTimer && (
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">مدة العداد بالدقائق</label>
                  <input type="number" value={config.timerMinutes} onChange={(e) => setConfig({ ...config, timerMinutes: Number(e.target.value) })} className="w-32 bg-neutral-900 border border-neutral-800 rounded-xl p-2 text-xs text-amber-400 font-bold" />
                </div>
              )}

              <div className="border-t border-neutral-800/80 pt-3 flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-white block">شريط المخزون المتبقي</label>
                  <span className="text-[10px] text-neutral-400">إظهار كمية متبقية قليلة في المستودع</span>
                </div>
                <input type="checkbox" checked={config.showStockBar} onChange={(e) => setConfig({ ...config, showStockBar: e.target.checked })} className="w-4 h-4 accent-amber-500" />
              </div>
              {config.showStockBar && (
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">العدد المتبقي في المخزون</label>
                  <input type="number" value={config.stockLeft} onChange={(e) => setConfig({ ...config, stockLeft: Number(e.target.value) })} className="w-32 bg-neutral-900 border border-neutral-800 rounded-xl p-2 text-xs text-amber-400 font-bold" />
                </div>
              )}
            </div>

            {/* باقات العروض (Bundles) */}
            <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-white block">باقات العروض والكميات (قطعة، قطعتين، 3 قطع)</label>
                  <span className="text-[10px] text-neutral-400">إذا عطلتها، سيشتري العميل بالقطعة الواحدة بالسعر الأساسي</span>
                </div>
                <input type="checkbox" checked={config.showBundles} onChange={(e) => setConfig({ ...config, showBundles: e.target.checked })} className="w-4 h-4 accent-amber-500" />
              </div>
            </div>

            {/* الشحن المجاني والمعاينة */}
            <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-white block">شارة المعاينة / الضمان على الصورة</label>
                  <span className="text-[10px] text-neutral-400">تظهر أعلى صورة المنتج الرئيسية</span>
                </div>
                <input type="checkbox" checked={config.showBadge} onChange={(e) => setConfig({ ...config, showBadge: e.target.checked })} className="w-4 h-4 accent-amber-500" />
              </div>
              {config.showBadge && (
                <input type="text" value={config.badgeText} onChange={(e) => setConfig({ ...config, badgeText: e.target.value })} placeholder="معاينة مجانية للمنتج قبل الدفع" className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs" />
              )}

              <div className="border-t border-neutral-800/80 pt-3 flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-white block">صندوق تفاصيل الضمان والمعاينة قبل الاستلام</label>
                  <span className="text-[10px] text-neutral-400">قسم إيضاح حق فحص المنتج قبل دفع المبلغ للمندوب</span>
                </div>
                <input type="checkbox" checked={config.showGuarantee} onChange={(e) => setConfig({ ...config, showGuarantee: e.target.checked })} className="w-4 h-4 accent-amber-500" />
              </div>
            </div>

            {/* الشريط العلوي وإشعارات الشراء اللحظية */}
            <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-white block">الشريط الإعلاني العلوي (Top Bar)</label>
                  <span className="text-[10px] text-neutral-400">شريط العروض في أعلى المتجر</span>
                </div>
                <input type="checkbox" checked={config.showTopBar} onChange={(e) => setConfig({ ...config, showTopBar: e.target.checked })} className="w-4 h-4 accent-amber-500" />
              </div>
              {config.showTopBar && (
                <input type="text" value={config.topBarText} onChange={(e) => setConfig({ ...config, topBarText: e.target.value })} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs" />
              )}

              <div className="border-t border-neutral-800/80 pt-3 flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-white block">إشعارات الشراء اللحظية (Recent Sales Toast)</label>
                  <span className="text-[10px] text-neutral-400">إشعار ينبثق كل بضع ثوانٍ: (اشترى فلان من القاهرة الآن)</span>
                </div>
                <input type="checkbox" checked={config.showRecentSales} onChange={(e) => setConfig({ ...config, showRecentSales: e.target.checked })} className="w-4 h-4 accent-amber-500" />
              </div>
            </div>
          </div>
        )}

        {/* تبويب الثيمات */}
        {activeTab === "themes" && (
          <div className="space-y-4 bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
            <h2 className="font-bold text-base text-amber-400">ثيمات ألوان المتجر</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEMES_LIST.map((th) => (
                <div key={th.id} onClick={() => setConfig({ ...config, selectedTheme: th.id })} className={`cursor-pointer p-4 rounded-xl border-2 transition flex items-center justify-between ${config.selectedTheme === th.id ? "border-amber-400 bg-amber-500/10" : "border-neutral-800 bg-neutral-950"}`}>
                  <div className="flex items-center gap-3">
                    <span style={{ backgroundColor: th.color }} className="w-5 h-5 rounded-full shadow-md flex-shrink-0" />
                    <div><p className="text-xs font-bold text-white">{th.name}</p><p className="text-[11px] text-neutral-400">{th.desc}</p></div>
                  </div>
                  {config.selectedTheme === th.id && <span className="text-amber-400 font-bold text-xs">✓ مفعل</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* تبويب الشحن والمحافظات (مع تحديد الشحن المجاني أو تسعيره) */}
        {activeTab === "shipping" && (
          <div className="space-y-6 bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
            <div className="border-b border-neutral-800 pb-4 space-y-3">
              <h2 className="font-bold text-base text-amber-400">الدولة والعملة النشطة</h2>
              <div>
                <label className="block text-xs text-neutral-400 mb-1 font-bold">اختر الدولة الحالية للمتجر</label>
                <select
                  value={config.activeCountry}
                  onChange={(e) => setConfig({ ...config, activeCountry: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm font-bold text-amber-400 focus:outline-none"
                >
                  {Object.keys(config.countries).map((code) => {
                    const c = config.countries[code];
                    return (
                      <option key={code} value={code}>
                        {c.name} ({c.currency} - {c.phoneCode})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="bg-neutral-950/80 border border-amber-500/20 p-4 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-amber-400">🌍 إضافة دولة جديدة للمتجر</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] text-neutral-400 mb-1">اسم الدولة</label>
                  <input type="text" value={newCountryName} onChange={(e) => setNewCountryName(e.target.value)} placeholder="الكويت" className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2 text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 mb-1">رمز الدولة</label>
                  <input type="text" value={newCountryCode} onChange={(e) => setNewCountryCode(e.target.value)} placeholder="KW" className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2 text-xs uppercase" />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 mb-1">العملة</label>
                  <input type="text" value={newCountryCurrency} onChange={(e) => setNewCountryCurrency(e.target.value)} placeholder="د.ك" className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2 text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 mb-1">كود الاتصال</label>
                  <input type="text" value={newCountryPhoneCode} onChange={(e) => setNewCountryPhoneCode(e.target.value)} placeholder="+965" className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2 text-xs" />
                </div>
              </div>
              <button type="button" onClick={handleAddCountry} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 rounded-xl text-xs transition">+ حفظ وإضافة الدولة</button>
            </div>

            <div className="space-y-3 border-t border-neutral-800 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-neutral-200">محافظات ومدن دولة ({activeCountryData.name})</span>
                <span className="text-xs text-amber-400 font-bold">ضع 0 للشحن المجاني</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {activeCountryData.provinces.map((prov, idx) => (
                  <div key={prov.id} className="flex items-center justify-between bg-neutral-950 border border-neutral-800 p-3 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={prov.enabled} 
                        onChange={(e) => { 
                          const currentProvs = config.countries[config.activeCountry]?.provinces || [];
                          const updated = currentProvs.map((p, pIdx) => pIdx === idx ? { ...p, enabled: e.target.checked } : p);
                          setConfig({
                            ...config,
                            countries: {
                              ...config.countries,
                              [config.activeCountry]: { ...config.countries[config.activeCountry], provinces: updated }
                            }
                          });
                        }} 
                        className="w-4 h-4 accent-amber-500" 
                      />
                      <span className="font-bold">{prov.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={prov.shippingCost} 
                        onChange={(e) => { 
                          const currentProvs = config.countries[config.activeCountry]?.provinces || [];
                          const updated = currentProvs.map((p, pIdx) => pIdx === idx ? { ...p, shippingCost: Number(e.target.value) } : p);
                          setConfig({
                            ...config,
                            countries: {
                              ...config.countries,
                              [config.activeCountry]: { ...config.countries[config.activeCountry], provinces: updated }
                            }
                          });
                        }} 
                        className="w-20 bg-neutral-900 border border-neutral-800 rounded-lg p-1.5 text-center font-bold text-amber-400" 
                      />
                      <span className="text-neutral-500">{activeCountryData.currency}</span>
                      {prov.shippingCost === 0 && <span className="text-[10px] text-emerald-400 font-bold">(مجاني)</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder={`اسم المحافظة في (${activeCountryData.name})`}
                  value={newProvinceName}
                  onChange={(e) => setNewProvinceName(e.target.value)}
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="سعر الشحن (0 للمجاني)"
                    value={newProvinceCost || ""}
                    onChange={(e) => setNewProvinceCost(Number(e.target.value))}
                    className="w-32 bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs text-center font-bold text-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddProvince}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex-shrink-0"
                  >
                    + إضافة المحافظة
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* تبويب الواتساب والبيكسل و CAPI */}
        {activeTab === "pixels" && (
          <div className="space-y-4 bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
            <h2 className="font-bold text-base text-amber-400">أرقام الواتساب وبيكسلات التتبع (CAPI)</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1 font-bold">رقم واتساب استلام الطلبات</label>
                  <input type="text" value={config.whatsappNumber} onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })} placeholder="+201000000000" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-neutral-400 font-bold">زر واتساب الدعم الفني العائم</label>
                    <input type="checkbox" checked={config.showSupportWhatsapp} onChange={(e) => setConfig({ ...config, showSupportWhatsapp: e.target.checked })} className="w-4 h-4 accent-amber-500" />
                  </div>
                  <input type="text" disabled={!config.showSupportWhatsapp} value={config.supportWhatsappNumber} onChange={(e) => setConfig({ ...config, supportWhatsappNumber: e.target.value })} placeholder="+201000000000" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono disabled:opacity-40" />
                </div>
              </div>

              <div className="border-t border-neutral-800 pt-4 space-y-3">
                <h3 className="text-xs font-bold text-neutral-300">أكواد البيكسل و Meta Conversions API (CAPI)</h3>
                
                <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 space-y-2.5">
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1 font-bold">Meta Pixel ID (المتصفح)</label>
                    <input type="text" value={config.metaPixelId} onChange={(e) => setConfig({ ...config, metaPixelId: e.target.value })} placeholder="مثال: 123456789012345" className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs text-emerald-400 mb-1 font-bold">Meta CAPI Access Token (تتبع السيرفر المباشر ⚡)</label>
                    <input type="password" value={config.metaAccessToken} onChange={(e) => setConfig({ ...config, metaAccessToken: e.target.value })} placeholder="EAAB... (رمز الوصول من مدير أحداث فيسبوك)" className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs font-mono text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">TikTok Pixel ID</label>
                  <input type="text" value={config.tiktokPixelId} onChange={(e) => setConfig({ ...config, tiktokPixelId: e.target.value })} placeholder="C6ABCD1234567890EFGH" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono" />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Google Analytics / Ads Tag</label>
                  <input type="text" value={config.googlePixelId} onChange={(e) => setConfig({ ...config, googlePixelId: e.target.value })} placeholder="G-XXXXXXX أو AW-XXXXXXX" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* تبويب حساب الإدارة والأمان */}
        {activeTab === "settings" && (
          <div className="space-y-4 bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
            <div className="border-b border-neutral-800 pb-3">
              <h2 className="font-bold text-base text-amber-400">حساب الإدارة والأمان</h2>
              <p className="text-xs text-neutral-400 mt-1">تشفير قياسي بـ PBKDF2 مع إبطال فوري للجلسات السابقة عند تغيير كلمة المرور.</p>
            </div>

            {passMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold ${passMsg.includes('غير متطابقتين') ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>
                {passMsg}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-300 mb-1 font-bold">البريد الإلكتروني للوحة التحكم</label>
                <input 
                  type="email" 
                  value={config.adminEmail} 
                  onChange={(e) => setConfig({ ...config, adminEmail: e.target.value })} 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-amber-500" 
                />
              </div>

              <div className="border-t border-neutral-800 pt-4 space-y-3">
                <h3 className="text-xs font-bold text-amber-400">تعيين كلمة مرور جديدة</h3>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">كلمة المرور الجديدة</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="اكتب كلمة مرور جديدة" 
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-amber-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">تأكيد كلمة المرور الجديدة</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="أعد كتابة كلمة المرور للتأكيد" 
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-amber-500" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* تبويب الطلبات السحابية */}
        {activeTab === "orders" && (
          <div className="space-y-4 bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div>
                <h2 className="font-bold text-base text-amber-400">سجل الطلبات السحابية ({orders.length})</h2>
                <span className="text-[10px] text-neutral-500">نظام مستقل لكل طلب مع دعم الترقيم الآلي</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={exportToCSV} className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1">
                  <span>تصدير Excel/CSV</span> 📥
                </button>
                {orders.length > 0 && (
                  <button onClick={handleClearOrders} className="text-red-400 hover:text-red-300 text-xs bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg transition">
                    مسح السجل
                  </button>
                )}
              </div>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-neutral-500 py-8 text-center">لا توجد طلبات مسجلة بعد على السحابة</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {orders.map((ord) => (
                  <div key={ord.id} className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center font-bold text-amber-400 border-b border-neutral-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span>{ord.fullName}</span>
                        <span className="text-[10px] font-mono text-neutral-500">({ord.id})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={ord.status || "new"}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="bg-neutral-900 border border-neutral-700 text-[11px] rounded px-2 py-1 text-white"
                        >
                          <option value="new">🟡 جديد</option>
                          <option value="confirmed">🔵 تم التأكيد</option>
                          <option value="shipped">🚚 تم الشحن</option>
                          <option value="cancelled">🔴 ملغي</option>
                        </select>
                        <span className="text-sm font-black text-amber-400">{ord.total} {ord.currency}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-neutral-300 pt-1">
                      <span>الهاتف: {ord.phone} {ord.altPhone ? `(بديل: ${ord.altPhone})` : ""}</span>
                      <a 
                        href={`https://wa.me/${ord.phone?.replace(/[^0-9]/g, "")}`}
                        target="_blank" 
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline text-[11px] font-bold"
                      >
                        مراسلة المشتري واتساب ↗
                      </a>
                    </div>
                    <p className="text-neutral-400">العنوان: {ord.governorate} — {ord.address}</p>
                    <div className="flex flex-wrap gap-4 text-neutral-400 text-[11px]">
                      <span>الكمية: {ord.qty || 1}</span>
                      {ord.selectedSize && <span>المقاس: {ord.selectedSize}</span>}
                      {ord.selectedColor && <span>اللون: {ord.selectedColor}</span>}
                      <span className="text-neutral-500">
                        {new Date(ord.createdAt || ord.date).toLocaleString("ar-EG")}
                      </span>
                    </div>
                    {ord.notes && <p className="text-neutral-500 italic bg-neutral-900/50 p-2 rounded">ملاحظة: {ord.notes}</p>}
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
