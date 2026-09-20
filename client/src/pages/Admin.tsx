import React, { useState, useEffect } from "react";
import { STORE_THEMES, StoreTheme } from "../const";

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
  caption?: string;
}

export interface BundleItem {
  id?: string;
  qty: number;
  title: string;
  price: number;
  enabled?: boolean;
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
  selectedTheme: string;
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
  videoUrl?: string;
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
  enableExitPopup?: boolean;
  exitPopupTitle?: string;
  exitPopupText?: string;
  exitCouponCode?: string;
  exitCouponDiscountPercent?: number;
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

const DEFAULT_BUNDLES: BundleItem[] = [
  { id: "b1", qty: 1, title: "قطعة واحدة", price: 320, enabled: true },
  { id: "b2", qty: 2, title: "قطعتان (باقة التوفير)", price: 580, enabled: true, badge: "الأكثر طلباً", savings: "وفر 60 ج.م" },
  { id: "b3", qty: 3, title: "3 قطع (عرض العائلة)", price: 790, enabled: false, badge: "أكبر توفير", savings: "وفر 170 ج.م" }
];

const DEFAULT_CONFIG: StoreConfig = {
  storeName: "متجر تجريبي",
  adminEmail: "admin@example.com",
  adminPassword: "",
  logoUrl: "",
  selectedTheme: "dark-onyx",
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
  productTitle: "سنيكرز إير كومفورت برو الطبي",
  productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
  gallery: [],
  videoUrl: "",
  currentPrice: 320,
  oldPrice: 550,
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
  bundles: DEFAULT_BUNDLES,
  showGuarantee: true,
  guaranteeText: "معاينة مجانية كاملة عند باب منزلك قبل السداد",
  guaranteeSubtext: "يحق لك فحص الجودة وتجربة المقاس مع المندوب دون أي التزام",
  showReviews: true,
  reviews: [
    { name: "محمود س.", comment: "ممتاز جداً وخامته مريحة ومطابق للوصف بالظبط.", rating: 5 }
  ],
  whatsappNumber: "",
  metaPixelId: "",
  metaAccessToken: "",
  tiktokPixelId: "",
  googlePixelId: "",
  enableExitPopup: true,
  exitPopupTitle: "انتظر! لا تفوت هذا العرض الخاص 🎁",
  exitPopupText: "احصل على خصم إضافي خاص بك الآن قبل المغادرة!",
  exitCouponCode: "SPECIAL10",
  exitCouponDiscountPercent: 10
};

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

  // حالات جديدة لإضافة آراء العملاء
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);

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
          const loadedBundles = (cloudData.bundles && cloudData.bundles.length > 0)
            ? cloudData.bundles.map((b: any, idx: number) => ({
                id: b.id || `b_${idx}_${Date.now()}`,
                qty: Number(b.qty) || 1,
                title: b.title || `باقة ${b.qty} قطع`,
                price: Number(b.price) || 0,
                enabled: b.enabled !== undefined ? b.enabled : true,
                badge: b.badge || "",
                savings: b.savings || ""
              }))
            : DEFAULT_BUNDLES;

          setConfig({
            ...DEFAULT_CONFIG,
            ...cloudData,
            adminPassword: "",
            gallery: cloudData.gallery || [],
            features: cloudData.features || DEFAULT_CONFIG.features,
            reviews: cloudData.reviews || DEFAULT_CONFIG.reviews,
            bundles: loadedBundles,
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

    localStorage.setItem("store_theme_id", config.selectedTheme);

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

  const handleAddReview = () => {
    if (!newReviewName.trim() || !newReviewComment.trim()) {
      alert("يرجى إدخال اسم العميل والتعليق أولاً");
      return;
    }
    const newRev: ReviewItem = {
      name: newReviewName.trim(),
      comment: newReviewComment.trim(),
      rating: Number(newReviewRating) || 5
    };
    setConfig({
      ...config,
      reviews: [...(config.reviews || []), newRev]
    });
    setNewReviewName("");
    setNewReviewComment("");
    setNewReviewRating(5);
  };

  const exportToCSV = () => {
    if (orders.length === 0) return alert("لا توجد طلبات لتصديرها");
    const headers = ["معرف الطلب", "التاريخ والوقت", "الاسم", "الهاتف", "المحافظة", "العنوان", "الكمية", "تفاصيل المقاسات والألوان", "الإجمالي", "الحالة"];
    const rows = orders.map((o) => [
      o.id,
      `"${o.orderDateAr || new Date(o.createdAt || o.date).toLocaleString("ar-EG")}"`,
      `"${o.fullName || ""}"`,
      `"${o.phone || ""}"`,
      `"${o.governorate || ""}"`,
      `"${(o.address || "").replace(/"/g, '""')}"`,
      o.qty || 1,
      `"${o.itemsBreakdown || `${o.selectedSize || "-"} / ${o.selectedColor || "-"}`}"`,
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
            { id: "product", name: "المنتج والصور والمميزات" },
            { id: "marketing_tools", name: "باقات العروض والترويج" },
            { id: "themes", name: `ثيمات المتجر (10 ثيمات)` },
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

        {/* 1. تبويب المنتج والصور والفيديو والمعرض والمميزات */}
        {activeTab === "product" && (
          <div className="space-y-6 bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
            <h2 className="font-bold text-base text-amber-400">بيانات المنتج وتفاصيل العرض</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1 font-bold">اسم المتجر</label>
                <input type="text" value={config.storeName} onChange={(e) => setConfig({ ...config, storeName: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs sm:text-sm" />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1 font-bold">عنوان المنتج الرئيسي</label>
                <input type="text" value={config.productTitle} onChange={(e) => setConfig({ ...config, productTitle: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs sm:text-sm font-bold" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1 font-bold">السعر الأساسي للقطعة</label>
                  <input type="number" value={config.currentPrice} onChange={(e) => setConfig({ ...config, currentPrice: Number(e.target.value) })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm font-bold text-amber-400" />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1 font-bold">السعر القديم المشطوب</label>
                  <input type="number" value={config.oldPrice} onChange={(e) => setConfig({ ...config, oldPrice: Number(e.target.value) })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm" />
                </div>
              </div>

              {/* حقل مميزات ومواصفات المنتج */}
              <div className="space-y-2 border-t border-neutral-800 pt-4">
                <div className="flex justify-between items-center">
                  <label className="block text-xs text-amber-400 font-bold">مميزات ومواصفات المنتج (تظهر كنقاط في الصفحة)</label>
                  <span className="text-[10px] text-neutral-500">اكتب كل ميزة في سطر منفصل</span>
                </div>
                <textarea
                  rows={4}
                  value={config.features?.join("\n") || ""}
                  onChange={(e) => {
                    const lines = e.target.value.split("\n");
                    setConfig({ ...config, features: lines });
                  }}
                  placeholder="خامات ممتازة ومرنة تمنح القدم تهوية&#10;نعل ممتص للصدمات ومقاوم للانزلاق&#10;معاينة وقياس مجاني بالكامل قبل الدفع"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 leading-relaxed focus:border-amber-500 outline-none"
                />
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

              {/* فيديو المنتج */}
              <div className="space-y-2 border-t border-neutral-800 pt-4">
                <div className="flex justify-between items-center">
                  <label className="block text-xs text-amber-400 font-bold">رابط فيديو المنتج (اختياري - فيسبوك أو يوتيوب)</label>
                  <span className="text-[10px] text-neutral-500">يعمل بدون خروج العميل من الصفحة</span>
                </div>
                <input
                  type="text"
                  value={config.videoUrl || ""}
                  onChange={(e) => setConfig({ ...config, videoUrl: e.target.value })}
                  placeholder="ضع رابط فيديو من فيسبوك أو يوتيوب (مثال: https://www.facebook.com/... أو https://youtu.be/...)"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white"
                />
              </div>

              {/* معرض الصور التفصيلي */}
              <div className="space-y-3 border-t border-neutral-800 pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="block text-xs text-amber-400 font-bold">معرض الصور التفصيلي (مع وصف اختياري لكل صورة)</label>
                    <span className="text-[10px] text-neutral-500">ارفع حتى 8 صور مع كتابة ميزة أو وصف يظهر أسفل كل صورة</span>
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
                              const newGalleryItem: GalleryItem = { id: `img_${Date.now()}`, image: b, caption: "" };
                              setConfig({ ...config, gallery: [...(config.gallery || []), newGalleryItem] });
                            });
                          }
                        }} 
                      />
                    </label>
                  )}
                </div>

                {config.gallery && config.gallery.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {config.gallery.map((item, idx) => (
                      <div key={item.id || idx} className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 flex gap-3 items-center">
                        <img src={item.image} alt={`Gallery ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg border border-neutral-800 flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={item.caption || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updated = config.gallery.map((g, i) => i === idx ? { ...g, caption: val } : g);
                              setConfig({ ...config, gallery: updated });
                            }}
                            placeholder="وصف أو ميزة الصورة (اختياري)"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = config.gallery.filter((_, i) => i !== idx);
                              setConfig({ ...config, gallery: updated });
                            }}
                            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-bold py-1 rounded-lg border border-red-500/20 transition"
                          >
                            حذف الصورة ✕
                          </button>
                        </div>
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
                  <input type="text" disabled={!config.enableColors} value={config.colors} onChange={(e) => setConfig({ ...config, colors: e.target.value })} placeholder="أسود, أحمر, كحلي, بيج" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs disabled:opacity-40" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. تبويب باقات العروض وأدوات التحفيز وتقييمات العملاء */}
        {activeTab === "marketing_tools" && (
          <div className="space-y-6 bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
            <h2 className="font-bold text-base text-amber-400">باقات العروض وأدوات التحفيز والمبيعات</h2>

            {/* نظام تخصيص الباقات المرن (Custom Bundles) */}
            <div className="bg-neutral-950 border border-amber-500/30 p-4 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-amber-400 block">نظام باقات العروض (قطعة، قطعتين، 3 قطع)</label>
                  <span className="text-[10px] text-neutral-400">تحكم كامل في تفعيل كل باقة وسعرها الفردي وشارتها الترويجية</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={config.showBundles} 
                  onChange={(e) => setConfig({ ...config, showBundles: e.target.checked })} 
                  className="w-4 h-4 accent-amber-500" 
                />
              </div>

              {config.showBundles && (
                <div className="space-y-3 pt-3 border-t border-neutral-800">
                  {config.bundles?.map((bundle, bIdx) => (
                    <div key={bundle.id || bIdx} className="bg-neutral-900/90 border border-neutral-800 p-3.5 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={bundle.enabled !== false}
                            onChange={(e) => {
                              const updated = config.bundles.map((b, i) => i === bIdx ? { ...b, enabled: e.target.checked } : b);
                              setConfig({ ...config, bundles: updated });
                            }}
                            className="w-4 h-4 accent-amber-500"
                          />
                          <span className="text-xs font-bold text-neutral-200">
                            {bundle.title || `باقة ${bundle.qty} قطع`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = config.bundles.filter((_, i) => i !== bIdx);
                            setConfig({ ...config, bundles: updated });
                          }}
                          className="text-red-400 hover:text-red-300 text-[11px]"
                        >
                          حذف الباقة ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        <div>
                          <label className="block text-[10px] text-neutral-400 mb-1">الكمية (قطع)</label>
                          <input
                            type="number"
                            min="1"
                            value={bundle.qty}
                            onChange={(e) => {
                              const updated = config.bundles.map((b, i) => i === bIdx ? { ...b, qty: Number(e.target.value) } : b);
                              setConfig({ ...config, bundles: updated });
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-center font-bold text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-neutral-400 mb-1">عنوان الباقة</label>
                          <input
                            type="text"
                            value={bundle.title}
                            onChange={(e) => {
                              const updated = config.bundles.map((b, i) => i === bIdx ? { ...b, title: e.target.value } : b);
                              setConfig({ ...config, bundles: updated });
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-neutral-400 mb-1">السعر الإجمالي للباقة</label>
                          <input
                            type="number"
                            value={bundle.price}
                            onChange={(e) => {
                              const updated = config.bundles.map((b, i) => i === bIdx ? { ...b, price: Number(e.target.value) } : b);
                              setConfig({ ...config, bundles: updated });
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-center font-bold text-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-neutral-400 mb-1">شارة الباقة (Badge)</label>
                          <input
                            type="text"
                            value={bundle.badge || ""}
                            placeholder="الأكثر طلباً"
                            onChange={(e) => {
                              const updated = config.bundles.map((b, i) => i === bIdx ? { ...b, badge: e.target.value } : b);
                              setConfig({ ...config, bundles: updated });
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      const nextQty = (config.bundles?.length || 0) + 1;
                      const newB: BundleItem = {
                        id: `b_${Date.now()}`,
                        qty: nextQty,
                        title: `${nextQty} قطع (عرض خاص)`,
                        price: (config.currentPrice || 300) * nextQty - 50,
                        enabled: true,
                        badge: "عرض جديد",
                        savings: "توفير إضافي"
                      };
                      setConfig({ ...config, bundles: [...(config.bundles || []), newB] });
                    }}
                    className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold rounded-xl border border-amber-500/30 transition"
                  >
                    + إضافة باقة عرض جديدة
                  </button>
                </div>
              )}
            </div>

            {/* قسم إدارة آراء وتقييمات العملاء */}
            <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-white block">قسم آراء وتقييمات العملاء (Social Proof)</label>
                  <span className="text-[10px] text-neutral-400">إظهار تجارب وتقييمات المشترين السابقة لزيادة الثقة</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={config.showReviews} 
                  onChange={(e) => setConfig({ ...config, showReviews: e.target.checked })} 
                  className="w-4 h-4 accent-amber-500" 
                />
              </div>

              {config.showReviews && (
                <div className="space-y-3 pt-3 border-t border-neutral-800">
                  {/* قائمة التقييمات الحالية */}
                  {config.reviews && config.reviews.length > 0 ? (
                    <div className="space-y-2">
                      {config.reviews.map((rev, rIdx) => (
                        <div key={rIdx} className="flex items-start justify-between bg-neutral-900 p-3 rounded-xl border border-neutral-800 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{rev.name}</span>
                              <span className="text-amber-400">{"★".repeat(rev.rating)}</span>
                            </div>
                            <p className="text-neutral-300 mt-1">{rev.comment}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = config.reviews.filter((_, i) => i !== rIdx);
                              setConfig({ ...config, reviews: updated });
                            }}
                            className="text-red-400 hover:text-red-300 text-xs p-1"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500 text-center py-2">لا توجد تقييمات مضافة حالياً.</p>
                  )}

                  {/* إضافة تقييم جديد */}
                  <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-800 space-y-2">
                    <span className="text-xs font-bold text-amber-400 block">+ إضافة تقييم عميل جديد</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="اسم العميل (مثال: أحمد م.)"
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        className="bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="نص التقييم والتجربة"
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        className="sm:col-span-2 bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <div className="flex items-center gap-2">
                        <label className="text-[11px] text-neutral-400">التقييم:</label>
                        <select
                          value={newReviewRating}
                          onChange={(e) => setNewReviewRating(Number(e.target.value))}
                          className="bg-neutral-950 border border-neutral-800 text-xs rounded-lg p-1.5 text-amber-400 font-bold"
                        >
                          <option value="5">★★★★★ (5 نجوم)</option>
                          <option value="4">★★★★☆ (4 نجوم)</option>
                          <option value="3">★★★☆☆ (3 نجوم)</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddReview}
                        className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-1.5 rounded-lg text-xs font-bold transition"
                      >
                        إضافة التقييم
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* نافذة الخصم عند الخروج */}
            <div className="bg-neutral-950 border border-amber-500/30 p-4 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-amber-400 block">نافذة كود الخصم عند محاولة الخروج (Exit-Intent)</label>
                  <span className="text-[10px] text-neutral-400">تظهر للعميل المتردد عند محاولة مغادرة الصفحة لإنقاذ عملية البيع</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={config.enableExitPopup ?? true} 
                  onChange={(e) => setConfig({ ...config, enableExitPopup: e.target.checked })} 
                  className="w-4 h-4 accent-amber-500" 
                />
              </div>

              {(config.enableExitPopup ?? true) && (
                <div className="space-y-3 pt-2 border-t border-neutral-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">كود الخصم</label>
                      <input 
                        type="text" 
                        value={config.exitCouponCode || "SPECIAL10"} 
                        onChange={(e) => setConfig({ ...config, exitCouponCode: e.target.value.toUpperCase().trim() })} 
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs font-mono font-bold text-amber-400" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">نسبة الخصم (%)</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="90" 
                        value={config.exitCouponDiscountPercent || 10} 
                        onChange={(e) => setConfig({ ...config, exitCouponDiscountPercent: Number(e.target.value) })} 
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs font-mono font-bold text-emerald-400" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">عنوان النافذة الترحيبية</label>
                    <input 
                      type="text" 
                      value={config.exitPopupTitle || "انتظر! لا تفوت هذا العرض الخاص 🎁"} 
                      onChange={(e) => setConfig({ ...config, exitPopupTitle: e.target.value })} 
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">نص العرض الترويجي</label>
                    <input 
                      type="text" 
                      value={config.exitPopupText || "احصل على خصم إضافي خاص بك الآن قبل المغادرة!"} 
                      onChange={(e) => setConfig({ ...config, exitPopupText: e.target.value })} 
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs text-white" 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* العداد وشريط المخزون */}
            <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-white block">عداد التنازل (العد التنازلي)</label>
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

            {/* شارات الضمان والمعاينة */}
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

            {/* الشريط الإعلاني وإشعارات الشراء */}
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

        {/* 3. تبويب الـ 10 ثيمات */}
        {activeTab === "themes" && (
          <div className="space-y-4 bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
            <div className="border-b border-neutral-800 pb-3">
              <h2 className="font-bold text-base text-amber-400">ثيمات ألوان المتجر (10 ثيمات تخصصية)</h2>
              <p className="text-xs text-neutral-400 mt-1">اختر الثيم المتوافق مع طبيعة منتجك لتغيير ألوان وهوية المتجر فوراً.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STORE_THEMES.map((th: StoreTheme) => {
                const isSelected = config.selectedTheme === th.id;
                return (
                  <div
                    key={th.id}
                    onClick={() => {
                      setConfig({ ...config, selectedTheme: th.id });
                      localStorage.setItem("store_theme_id", th.id);
                    }}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition flex items-center justify-between ${isSelected ? "border-amber-400 bg-amber-500/10" : "border-neutral-800 bg-neutral-950"}`}
                  >
                    <div className="flex items-center gap-3">
                      <span style={{ backgroundColor: th.primary }} className="w-5 h-5 rounded-full shadow-md flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-white">{th.name}</p>
                        <p className="text-[11px] text-neutral-400">{th.category}</p>
                      </div>
                    </div>
                    {isSelected && <span className="text-amber-400 font-bold text-xs">✓ مفعل</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. تبويب الشحن والمحافظات */}
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

        {/* 5. تبويب البيكسلات والتتبع */}
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

        {/* 6. تبويب حساب الإدارة والأمان */}
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

        {/* 7. تبويب الطلبات السحابية */}
        {activeTab === "orders" && (
          <div className="space-y-4 bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div>
                <h2 className="font-bold text-base text-amber-400">سجل الطلبات السحابية ({orders.length})</h2>
                <span className="text-[10px] text-neutral-500">تفصيل كامل للمقاسات والألوان المتعددة مع دعم الترقيم الآلي والتاريخ العربي</span>
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
                    
                    <div className="bg-neutral-900/70 p-2.5 rounded-lg border border-neutral-800/80 space-y-1">
                      <div className="text-amber-400 font-bold text-[11px]">الكمية المطلوبة: {ord.qty || 1}</div>
                      {ord.itemsBreakdown ? (
                        <div className="text-neutral-300 text-[11px] whitespace-pre-line leading-relaxed font-mono">
                          {ord.itemsBreakdown}
                        </div>
                      ) : (
                        <div className="flex gap-4 text-neutral-400 text-[11px]">
                          {ord.selectedSize && <span>المقاس: {ord.selectedSize}</span>}
                          {ord.selectedColor && <span>اللون: {ord.selectedColor}</span>}
                        </div>
                      )}
                      {ord.appliedDiscount > 0 && (
                        <div className="text-emerald-400 text-[10px] font-bold">
                          تم تطبيق كوبون خصم: {ord.appliedCoupon} (خصم {ord.appliedDiscount}%)
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-neutral-500 text-[10px] pt-1">
                      <span>{ord.orderDateAr || new Date(ord.createdAt || ord.date).toLocaleString("ar-EG")}</span>
                      {ord.notes && <span className="italic text-neutral-400">ملاحظة: {ord.notes}</span>}
                    </div>
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
