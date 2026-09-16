import React, { useState, useEffect } from "react";

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
  bundles: {
    qty: number;
    title: string;
    price: number;
    badge?: string;
    savings?: string;
  }[];
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

export default function Home() {
  const [config, setConfig] = useState<StoreConfig>(DEFAULT_CONFIG);
  const [selectedQty, setSelectedQty] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 59 });

  // نموذج الطلب
  const [fullName, setFullName] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    // جلب الإعدادات من التخزين المحلي إن وجدت
    const saved = localStorage.getItem("store_config");
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

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

  const currentBundle = config.bundles.find((b) => b.qty === selectedQty) || {
    qty: 1,
    title: "قطعة واحدة",
    price: config.currentPrice
  };

  const totalPrice = config.showBundles ? currentBundle.price : config.currentPrice * selectedQty;

  const scrollToCheckout = () => {
    document.getElementById("checkout-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !governorate || !phone || !address) {
      alert("يرجى ملء جميع الحقول الإلزامية");
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      fullName,
      governorate,
      phone,
      altPhone,
      address,
      notes,
      qty: selectedQty,
      total: totalPrice,
      currency: config.currency,
      date: new Date().toISOString()
    };

    // حفظ الطلب في التخزين المحلي
    const existingOrders = JSON.parse(localStorage.getItem("store_orders") || "[]");
    localStorage.setItem("store_orders", JSON.stringify([orderData, ...existingOrders]));

    setIsSubmitting(false);
    setOrderSuccess(true);

    // توجيه تلقائي لواتساب التاجر مع نص الطلب
    if (config.whatsappNumber) {
      const msg = `طلب جديد:%0A- الاسم: ${fullName}%0A- الهاتف: ${phone}${altPhone ? ` (%D8%A8%D8%AF%D9%8A%D9%84: ${altPhone})` : ""}%0A- المحافظة: ${governorate}%0A- العنوان: ${address}%0A- الكمية: ${selectedQty}%0A- الإجمالي: ${totalPrice} ${config.currency}${notes ? `%0A- ملاحظات: ${notes}` : ""}`;
      const cleanPhone = config.whatsappNumber.replace(/[^0-9]/g, "");
      window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-4" dir="rtl">
        <div className="bg-neutral-800 border border-emerald-500/30 p-8 rounded-2xl max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
            ✓
          </div>
          <h2 className="text-2xl font-bold">تم استلام طلبك بنجاح!</h2>
          <p className="text-neutral-300 text-sm">
            شكراً لك {fullName}، سيقوم فريق خدمة العملاء بالتواصل معك هاتفياً لتأكيد موعد التسليم.
          </p>
          <button
            onClick={() => setOrderSuccess(false)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 rounded-xl transition"
          >
            العودة للمتجر
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500 selection:text-black" dir="rtl">
      {/* الشريط العلوي والمؤقت */}
      {config.showTopBar && (
        <div className="bg-amber-500 text-black py-2 px-4 text-xs sm:text-sm font-semibold text-center sticky top-0 z-50 shadow-md">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-6">
            <span>{config.topBarText}</span>
            {config.showTimer && (
              <span className="bg-black/80 text-amber-400 px-2 py-0.5 rounded font-mono text-xs">
                ينتهي خلال {String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
              </span>
            )}
          </div>
        </div>
      )}

      {/* الهيدر: اللوجو واسم المتجر */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-8 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt={config.storeName} className="h-9 object-contain" />
            ) : (
              <span className="text-xl font-bold tracking-tight text-amber-400">{config.storeName}</span>
            )}
          </div>
          <button
            onClick={scrollToCheckout}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-1.5 rounded-lg text-sm transition"
          >
            اطلب الآن
          </button>
        </div>
      </header>

      {/* واجهة المنتج الأساسية (Hero) */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-snug">{config.productTitle}</h1>
          <div className="flex items-center justify-center gap-3 text-lg">
            <span className="text-3xl font-black text-amber-400">
              {config.currentPrice} {config.currency}
            </span>
            {config.oldPrice > config.currentPrice && (
              <span className="text-neutral-500 line-through text-lg">
                {config.oldPrice} {config.currency}
              </span>
            )}
          </div>
        </div>

        {/* صورة المنتج */}
        <div className="rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-900">
          <img
            src={config.productImage}
            alt={config.productTitle}
            className="w-full h-80 sm:h-[420px] object-cover"
          />
        </div>

        {/* المميزات السريعة */}
        <div className="bg-neutral-900 border border-neutral-800/80 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-amber-400 text-base">مميزات المنتج:</h3>
          <ul className="space-y-2 text-sm sm:text-base text-neutral-300">
            {config.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-amber-400 font-bold">✓</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* باقات العروض (اختيارية) */}
        {config.showBundles && (
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-center text-neutral-200">اختر باقتك المفضلة:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {config.bundles.map((bundle) => {
                const isSelected = selectedQty === bundle.qty;
                return (
                  <div
                    key={bundle.qty}
                    onClick={() => setSelectedQty(bundle.qty)}
                    className={`cursor-pointer border-2 rounded-xl p-4 text-center relative transition ${
                      isSelected
                        ? "border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/5"
                        : "border-neutral-800 bg-neutral-900 hover:border-neutral-700"
                    }`}
                  >
                    {bundle.badge && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                        {bundle.badge}
                      </span>
                    )}
                    <p className="font-bold text-base">{bundle.title}</p>
                    <p className="text-xl font-black text-amber-400 my-1">
                      {bundle.price} {config.currency}
                    </p>
                    {bundle.savings && <p className="text-xs text-emerald-400 font-semibold">{bundle.savings}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* فورم إتمام الطلب (Checkout Form) */}
        <section id="checkout-form" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-neutral-800 pb-4 text-center">
            <h2 className="text-xl sm:text-2xl font-bold">أدخل بياناتك لتأكيد الطلب</h2>
            <p className="text-xs text-neutral-400 mt-1">الدفع عند الاستلام بعد معاينة المنتج</p>
          </div>

          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">الاسم بالكامل *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="اكتب اسمك الثلاثي"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">المحافظة / المدينة *</label>
              <input
                type="text"
                required
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                placeholder="مثال: القاهرة / الجيزة / عمان"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">رقم الهاتف الأساسي *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="رقم الهاتف للتوصيل"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">رقم هاتف بديل (اختياري)</label>
                <input
                  type="tel"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  placeholder="رقم إضافي إن وجد"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition text-right"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">العنوان بالتفصيل *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="اسم الشارع، رقم العقار، أو علامة مميزة قريبة"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">ملاحظات إضافية (اختياري)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي تعليمات للمندوب أو موعد مفضل للتسليم"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition resize-none"
              />
            </div>

            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex justify-between items-center text-sm">
              <span>الإجمالي المطلوب دفعه:</span>
              <span className="text-xl font-bold text-amber-400">
                {totalPrice} {config.currency}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-base py-4 rounded-xl shadow-lg shadow-amber-500/20 transition transform active:scale-98"
            >
              {isSubmitting ? "جاري الإرسال..." : "تأكيد الطلب — الدفع عند الاستلام"}
            </button>
          </form>
        </section>

        {/* ختم الضمان والمعاينة (اختياري) */}
        {config.showGuarantee && (
          <div className="border border-amber-500/30 bg-amber-500/5 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
              🛡️
            </div>
            <div>
              <p className="font-bold text-sm text-neutral-200">{config.guaranteeText}</p>
              {config.guaranteeSubtext && (
                <p className="text-xs text-neutral-400 mt-0.5">{config.guaranteeSubtext}</p>
              )}
            </div>
          </div>
        )}

        {/* آراء العملاء (اختياري) */}
        {config.showReviews && (
          <div className="space-y-3">
            <h3 className="font-bold text-base text-neutral-300">تقييمات المشترين:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {config.reviews.map((rev, i) => (
                <div key={i} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-neutral-200">{rev.name}</span>
                    <span className="text-amber-400">{"★".repeat(rev.rating)}</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* الفوتر */}
      <footer className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
        <p>جميع الحقوق محفوظة © {new Date().getFullYear()} {config.storeName}</p>
      </footer>
    </div>
  );
}
