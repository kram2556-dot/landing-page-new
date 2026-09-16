import React, { useState, useEffect } from "react";

interface BundleItem {
  qty: number;
  title: string;
  price: number;
  badge?: string;
  savings?: string;
}

interface StoreConfig {
  storeName: string;
  logoUrl?: string;
  showTopBar: boolean;
  topBarText: string;
  showTimer: boolean;
  timerMinutes: number;
  productTitle: string;
  productImage: string;
  currentPrice: number;
  oldPrice: number;
  currency: string;
  features: string[];
  showBundles: boolean;
  bundles: BundleItem[];
  showGuarantee: boolean;
  guaranteeText: string;
  guaranteeSubtext?: string;
  showReviews: boolean;
  reviews: { name: string; comment: string; rating: number }[];
  whatsappNumber: string;
}

const DEFAULT_CONFIG: StoreConfig = {
  storeName: "متجر النخبة",
  logoUrl: "",
  showTopBar: true,
  topBarText: "عرض خاص لفترة محدودة — شحن سريع وتوصيل للمنزل",
  showTimer: true,
  timerMinutes: 15,
  productTitle: "مصباح لوما الذكي — إضاءة دافئة بتصميم عصري",
  productImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
  currentPrice: 32,
  oldPrice: 49,
  currency: "د.أ",
  features: [
    "إضاءة دافئة مريحة للعين وقابلة للتحكم باللمس",
    "تصميم عصري من خامات متينة وموفرة للطاقة",
    "توصيل سريع حتى باب المنزل والدفع عند الاستلام"
  ],
  showBundles: true,
  bundles: [
    { qty: 1, title: "قطعة واحدة", price: 32 },
    { qty: 2, title: "قطعتان", price: 58, badge: "الأكثر طلباً", savings: "وفر 6 د.أ" },
    { qty: 3, title: "ثلاث قطع", price: 81, savings: "وفر 15 د.أ" }
  ],
  showGuarantee: true,
  guaranteeText: "معاينة مجانية للمنتج قبل الاستلام والدفع للمندوب",
  guaranteeSubtext: "إن لم يعجبك المنتج فلن تدفع أي رسوم",
  showReviews: true,
  reviews: [
    { name: "عمر س.", comment: "ممتاز جداً وخامته فاخرة والتوصيل كان سريعاً في يومين فقط.", rating: 5 },
    { name: "نور ع.", comment: "الإضاءة هادئة وممتازة للمكتب، شكراً لكم على حسن التعامل.", rating: 5 }
  ],
  whatsappNumber: "+962790000000"
};

export default function Admin() {
  // المصادقة والأمان
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // بيانات حساب المشرف المخزنة
  const [adminEmail, setAdminEmail] = useState("admin@store.com");
  const [adminPassword, setAdminPassword] = useState("admin123");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [authSuccessMsg, setAuthSuccessMsg] = useState("");

  // التبويب النشط
  const [activeTab, setActiveTab] = useState<"settings" | "orders" | "security">("settings");

  // إعدادات المتجر والطلبات
  const [config, setConfig] = useState<StoreConfig>(DEFAULT_CONFIG);
  const [orders, setOrders] = useState<any[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // جلب بيانات الدخول المحفوظة
    const savedEmail = localStorage.getItem("store_admin_email");
    const savedPassword = localStorage.getItem("store_admin_password");
    if (savedEmail) setAdminEmail(savedEmail);
    if (savedPassword) setAdminPassword(savedPassword);

    // فحص جلسة الدخول
    if (sessionStorage.getItem("store_admin_session") === "true") {
      setIsAuthenticated(true);
    }

    // جلب الإعدادات
    const savedConfig = localStorage.getItem("store_config");
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error(e);
      }
    }

    // جلب الطلبات
    const savedOrders = localStorage.getItem("store_orders");
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim().toLowerCase() === adminEmail.toLowerCase() && passwordInput === adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("store_admin_session", "true");
      setLoginError("");
    } else {
      setLoginError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("store_admin_session");
    setIsAuthenticated(false);
  };

  const handleUpdateSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newPassword) return;

    localStorage.setItem("store_admin_email", newEmail.trim());
    localStorage.setItem("store_admin_password", newPassword);
    setAdminEmail(newEmail.trim());
    setAdminPassword(newPassword);
    setAuthSuccessMsg("تم تحديث بيانات الدخول بنجاح!");
    setTimeout(() => setAuthSuccessMsg(""), 3000);
  };

  const handleSaveConfig = () => {
    localStorage.setItem("store_config", JSON.stringify(config));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // شاشة تسجيل الدخول
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl max-w-sm w-full space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-amber-400">تسجيل دخول التاجر</h1>
            <p className="text-xs text-neutral-400">أدخل بيانات الاعتماد لإدارة صفحة الهبوط</p>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg text-center font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-neutral-300 font-semibold mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@store.com"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-left transition"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-300 font-semibold mb-1">كلمة المرور</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-left transition"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition text-sm shadow-md"
            >
              دخول إلى اللوحة
            </button>
          </form>

          <div className="text-center text-[11px] text-neutral-500 border-t border-neutral-800/80 pt-4">
            البيانات الافتراضية للتجربة: <span className="text-neutral-300">admin@store.com</span> / <span className="text-neutral-300">admin123</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-16" dir="rtl">
      {/* الهيدر العلوي */}
      <header className="border-b border-neutral-800 bg-neutral-900 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-amber-400 text-lg tracking-tight">لوحة تحكم المتجر</span>
            <span className="bg-neutral-800 text-neutral-400 text-xs px-2.5 py-0.5 rounded-full border border-neutral-700">
              {config.storeName}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveConfig}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-lg text-sm transition shadow-sm"
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

      {/* التبويبات */}
      <div className="max-w-5xl mx-auto px-4 mt-6">
        <div className="flex gap-2 border-b border-neutral-800 pb-2">
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
              activeTab === "settings" ? "bg-amber-500 text-black" : "text-neutral-400 hover:text-white"
            }`}
          >
            إعدادات الصفحة والمنتج
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
              activeTab === "orders" ? "bg-amber-500 text-black" : "text-neutral-400 hover:text-white"
            }`}
          >
            الطلبات المستلمة ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
              activeTab === "security" ? "bg-amber-500 text-black" : "text-neutral-400 hover:text-white"
            }`}
          >
            بيانات الدخول والأمان
          </button>
        </div>

        {/* 1. تبويب الإعدادات والصفحة */}
        {activeTab === "settings" && (
          <div className="mt-6 space-y-6">
            {/* هوية المتجر */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
              <h3 className="font-bold text-amber-400 text-base border-b border-neutral-800 pb-2">هوية المتجر والشعار</h3>
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
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">رابط الشعار / اللوجو (Logo URL)</label>
                  <input
                    type="text"
                    value={config.logoUrl || ""}
                    onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
                    placeholder="اتركه فارغاً ليظهر اسم المتجر كنص أنيق"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-left"
                  />
                </div>
              </div>
            </div>

            {/* الشريط العلوي والمؤقت */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <h3 className="font-bold text-amber-400 text-base">شريط العرض والمؤقت التنازلي</h3>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={config.showTopBar}
                    onChange={(e) => setConfig({ ...config, showTopBar: e.target.checked })}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span>تفعيل الشريط العلوي</span>
                </label>
              </div>

              {config.showTopBar && (
                <div className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">نص العرض الترويجي</label>
                    <input
                      type="text"
                      value={config.topBarText}
                      onChange={(e) => setConfig({ ...config, topBarText: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                      <input
                        type="checkbox"
                        checked={config.showTimer}
                        onChange={(e) => setConfig({ ...config, showTimer: e.target.checked })}
                        className="w-4 h-4 accent-amber-500"
                      />
                      <span>تفعيل العداد التنازلي الوهمي</span>
                    </label>
                    {config.showTimer && (
                      <div className="flex items-center gap-2 text-xs">
                        <span>المدة (بالدقائق):</span>
                        <input
                          type="number"
                          value={config.timerMinutes}
                          onChange={(e) => setConfig({ ...config, timerMinutes: Number(e.target.value) })}
                          className="w-20 bg-neutral-950 border border-neutral-800 rounded-lg p-1.5 text-center text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* تفاصيل المنتج والتسعير */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
              <h3 className="font-bold text-amber-400 text-base border-b border-neutral-800 pb-2">بيانات المنتج والتسعير</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">عنوان / اسم المنتج الرئيسي</label>
                  <input
                    type="text"
                    value={config.productTitle}
                    onChange={(e) => setConfig({ ...config, productTitle: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">رابط صورة المنتج الرئيسية (Image URL)</label>
                  <input
                    type="text"
                    value={config.productImage}
                    onChange={(e) => setConfig({ ...config, productImage: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-left"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">السعر الحالي للقطعة</label>
                    <input
                      type="number"
                      value={config.currentPrice}
                      onChange={(e) => setConfig({ ...config, currentPrice: Number(e.target.value) })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">السعر قبل الخصم (المشطوب)</label>
                    <input
                      type="number"
                      value={config.oldPrice}
                      onChange={(e) => setConfig({ ...config, oldPrice: Number(e.target.value) })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">رمز العملة (مثلاً: د.أ / ج.م / ر.س)</label>
                    <input
                      type="text"
                      value={config.currency}
                      onChange={(e) => setConfig({ ...config, currency: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-center font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">نقاط المميزات السريعة (3 أسطر)</label>
                  {config.features.map((feat, index) => (
                    <input
                      key={index}
                      type="text"
                      value={feat}
                      onChange={(e) => {
                        const updated = [...config.features];
                        updated[index] = e.target.value;
                        setConfig({ ...config, features: updated });
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-sm mb-2"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* باقات العروض (اختيارية) */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <h3 className="font-bold text-amber-400 text-base">باقات العروض والكميات (Bundles)</h3>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={config.showBundles}
                    onChange={(e) => setConfig({ ...config, showBundles: e.target.checked })}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span>تفعيل قسم باقات الكمية</span>
                </label>
              </div>

              {config.showBundles && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {config.bundles.map((bundle, idx) => (
                    <div key={idx} className="bg-neutral-950 border border-neutral-800 p-3 rounded-lg space-y-2 text-xs">
                      <div className="font-bold text-neutral-200">باقة ({bundle.qty} قطع)</div>
                      <div>
                        <label className="block text-[10px] text-neutral-400">العنوان:</label>
                        <input
                          type="text"
                          value={bundle.title}
                          onChange={(e) => {
                            const newBundles = [...config.bundles];
                            newBundles[idx].title = e.target.value;
                            setConfig({ ...config, bundles: newBundles });
                          }}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 mt-0.5"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-400">السعر الإجمالي:</label>
                        <input
                          type="number"
                          value={bundle.price}
                          onChange={(e) => {
                            const newBundles = [...config.bundles];
                            newBundles[idx].price = Number(e.target.value);
                            setConfig({ ...config, bundles: newBundles });
                          }}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 mt-0.5"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-400">شارة مميزة (اختياري):</label>
                        <input
                          type="text"
                          value={bundle.badge || ""}
                          onChange={(e) => {
                            const newBundles = [...config.bundles];
                            newBundles[idx].badge = e.target.value;
                            setConfig({ ...config, bundles: newBundles });
                          }}
                          placeholder="مثلاً: الأكثر طلباً"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 mt-0.5"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* شارة الضمان / المعاينة (اختيارية) */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <h3 className="font-bold text-amber-400 text-base">شارة الضمان أو المعاينة قبل الدفع</h3>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={config.showGuarantee}
                    onChange={(e) => setConfig({ ...config, showGuarantee: e.target.checked })}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span>تفعيل الشارة</span>
                </label>
              </div>

              {config.showGuarantee && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">نص الشارة الأساسي</label>
                    <input
                      type="text"
                      value={config.guaranteeText}
                      onChange={(e) => setConfig({ ...config, guaranteeText: e.target.value })}
                      placeholder="مثلاً: معاينة مجانية للمنتج قبل الاستلام والدفع"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">نص فرعي إضافي</label>
                    <input
                      type="text"
                      value={config.guaranteeSubtext || ""}
                      onChange={(e) => setConfig({ ...config, guaranteeSubtext: e.target.value })}
                      placeholder="مثلاً: إن لم يعجبك المنتج فلن تدفع أي رسوم"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* رقم استلام الطلبات عبر الواتساب */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
              <h3 className="font-bold text-amber-400 text-base border-b border-neutral-800 pb-2">استقبال الطلبات على الواتساب</h3>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  رقم الواتساب مع رمز الدولة (مثال: 201012345678+ أو 966501234567+)
                </label>
                <input
                  type="text"
                  value={config.whatsappNumber}
                  onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                  placeholder="+962790000000"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-left font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. تبويب الطلبات المستلمة */}
        {activeTab === "orders" && (
          <div className="mt-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                <h3 className="font-bold text-amber-400 text-base">سجل الطلبات الحالية</h3>
                {orders.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm("هل أنت متأكد من مسح جميع الطلبات؟")) {
                        localStorage.removeItem("store_orders");
                        setOrders([]);
                      }
                    }}
                    className="text-xs text-red-400 hover:text-red-300 underline"
                  >
                    مسح السجل
                  </button>
                )}
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-10 text-neutral-500 text-sm">لا توجد طلبات مسجلة حتى الآن</div>
              ) : (
                <div className="divide-y divide-neutral-800">
                  {orders.map((order, idx) => (
                    <div key={idx} className="py-4 space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-neutral-200">{order.fullName}</span>
                        <span className="text-amber-400 font-bold">
                          {order.total} {order.currency}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-400 flex flex-wrap gap-4">
                        <span>الهاتف: <b className="text-neutral-200">{order.phone}</b></span>
                        {order.altPhone && <span>بديل: <b className="text-neutral-200">{order.altPhone}</b></span>}
                        <span>المحافظة: <b className="text-neutral-200">{order.governorate}</b></span>
                        <span>الكمية: <b className="text-neutral-200">{order.qty}</b></span>
                      </div>
                      <div className="text-xs text-neutral-300">
                        <span>العنوان: </span>{order.address}
                      </div>
                      {order.notes && (
                        <div className="text-xs text-neutral-400 italic">
                          <span>ملاحظات: </span>{order.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. تبويب الأمان وبيانات الدخول */}
        {activeTab === "security" && (
          <div className="mt-6 max-w-md">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
              <h3 className="font-bold text-amber-400 text-base border-b border-neutral-800 pb-2">
                تغيير البريد الإلكتروني وكلمة المرور
              </h3>

              {authSuccessMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3 rounded-lg text-center font-medium">
                  {authSuccessMsg}
                </div>
              )}

              <form onSubmit={handleUpdateSecurity} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">البريد الإلكتروني الجديد</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder={adminEmail}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-left"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-left"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 rounded-lg text-sm transition"
                >
                  حفظ بيانات الدخول الجديدة
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
