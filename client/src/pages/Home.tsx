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
  gallery: { id: string; image: string; caption: string }[];
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
  // إعدادات كود الخصم عند الخروج
  enableExitPopup?: boolean;
  exitPopupTitle?: string;
  exitPopupText?: string;
  exitCouponCode?: string;
  exitCouponDiscountPercent?: number;
}

declare global {
  interface Window {
    fbq?: any;
    ttq?: any;
    gtag?: any;
    dataLayer?: any[];
  }
}

// محرك لوحات الألوان للثيمات الستة
const THEME_STYLES: Record<ThemeType, {
  bg: string;
  cardBg: string;
  primary: string;
  primaryText: string;
  accent: string;
  border: string;
  badgeBg: string;
}> = {
  sneakers: {
    bg: "bg-neutral-950",
    cardBg: "bg-neutral-900",
    primary: "bg-amber-500 hover:bg-amber-400 text-black",
    primaryText: "text-amber-400",
    accent: "border-amber-500",
    border: "border-neutral-800",
    badgeBg: "bg-amber-500 text-black"
  },
  perfume: {
    bg: "bg-[#0f0919]",
    cardBg: "bg-[#1b122c]",
    primary: "bg-[#dfba73] hover:bg-[#ebd29c] text-[#1b122c]",
    primaryText: "text-[#dfba73]",
    accent: "border-[#dfba73]",
    border: "border-[#2d1f47]",
    badgeBg: "bg-[#dfba73] text-[#1b122c]"
  },
  fashion: {
    bg: "bg-[#14100e]",
    cardBg: "bg-[#211a17]",
    primary: "bg-[#d4a373] hover:bg-[#e0b992] text-[#14100e]",
    primaryText: "text-[#d4a373]",
    accent: "border-[#d4a373]",
    border: "border-[#382d28]",
    badgeBg: "bg-[#d4a373] text-[#14100e]"
  },
  medical: {
    bg: "bg-slate-950",
    cardBg: "bg-slate-900",
    primary: "bg-cyan-500 hover:cyan-400 text-slate-950",
    primaryText: "text-cyan-400",
    accent: "border-cyan-500",
    border: "border-slate-800",
    badgeBg: "bg-cyan-500 text-slate-950"
  },
  home: {
    bg: "bg-[#090d16]",
    cardBg: "bg-[#111827]",
    primary: "bg-blue-500 hover:bg-blue-400 text-white",
    primaryText: "text-blue-400",
    accent: "border-blue-500",
    border: "border-slate-800",
    badgeBg: "bg-blue-500 text-white"
  },
  kids: {
    bg: "bg-[#061412]",
    cardBg: "bg-[#0c2420]",
    primary: "bg-emerald-500 hover:bg-emerald-400 text-black",
    primaryText: "text-emerald-400",
    accent: "border-emerald-500",
    border: "border-emerald-900/60",
    badgeBg: "bg-emerald-500 text-black"
  }
};

const SAMPLE_BUYERS = [
  { name: "أحمد م.", city: "القاهرة", time: "منذ 4 دقائق" },
  { name: "خالد ع.", city: "الرياض", time: "منذ دقيقتين" },
  { name: "محمد س.", city: "الإسكندرية", time: "منذ 7 دقائق" },
  { name: "سلطان د.", city: "جدة", time: "منذ 3 دقائق" }
];

interface ItemSelection {
  size: string;
  color: string;
}

export default function Home() {
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedQty, setSelectedQty] = useState<number>(1);
  const [itemsSelections, setItemsSelections] = useState<ItemSelection[]>([{ size: "", color: "" }]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [websiteHpField, setWebsiteHpField] = useState(""); // مصيدة Honeypot

  // نظام كود الخصم عند الخروج
  const [showExitModal, setShowExitModal] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);
  const [timeLeft, setTimeLeft] = useState({ minutes: 15, seconds: 0 });
  const [recentBuyer, setRecentBuyer] = useState<any | null>(null);

  // مزامنة مصفوفة القطع عند تغير الكمية
  useEffect(() => {
    if (!config) return;
    const defaultSize = config.enableSizes && config.sizes ? config.sizes.split(",")[0]?.trim() : "";
    const defaultColor = config.enableColors && config.colors ? config.colors.split(",")[0]?.trim() : "";

    setItemsSelections((prev) => {
      const updated = [...prev];
      if (selectedQty > updated.length) {
        for (let i = updated.length; i < selectedQty; i++) {
          updated.push({ size: defaultSize, color: defaultColor });
        }
      } else if (selectedQty < updated.length) {
        return updated.slice(0, selectedQty);
      }
      return updated;
    });
  }, [selectedQty, config]);

  useEffect(() => {
    fetch("/api/store")
      .then((res) => res.json())
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setConfig(data);
          setSelectedImage(data.productImage);
          if (data.timerMinutes) {
            setTimeLeft({ minutes: data.timerMinutes, seconds: 0 });
          }

          const defaultSize = data.enableSizes && data.sizes ? data.sizes.split(",")[0]?.trim() : "";
          const defaultColor = data.enableColors && data.colors ? data.colors.split(",")[0]?.trim() : "";
          setItemsSelections([{ size: defaultSize, color: defaultColor }]);

          const currentCountry = data.countries?.[data.activeCountry];
          const firstProv = currentCountry?.provinces?.find((p: any) => p.enabled);
          if (firstProv) setSelectedProvinceId(firstProv.id);

          // 1. حقن Meta Pixel
          if (data.metaPixelId && !window.fbq) {
            const s = document.createElement("script");
            s.innerHTML = `
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${data.metaPixelId}');
              fbq('track', 'PageView');
            `;
            document.head.appendChild(s);
          }

          // 2. حقن TikTok Pixel
          if (data.tiktokPixelId && !window.ttq) {
            const s = document.createElement("script");
            s.innerHTML = `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                ttq.load('${data.tiktokPixelId}');
                ttq.page();
              }(window, document, 'ttq');
            `;
            document.head.appendChild(s);
          }

          // 3. حقن Google Tag
          if (data.googlePixelId && !window.gtag) {
            const s1 = document.createElement("script");
            s1.async = true;
            s1.src = `https://www.googletagmanager.com/gtag/js?id=${data.googlePixelId}`;
            document.head.appendChild(s1);

            const s2 = document.createElement("script");
            s2.innerHTML = `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${data.googlePixelId}');
            `;
            document.head.appendChild(s2);
          }
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // مستشعر خروج الزائر (Exit-Intent Trigger) للكمبيوتر والموبايل
  useEffect(() => {
    if (!config || config.enableExitPopup === false) return;
    if (sessionStorage.getItem("exit_modal_shown") === "true") return;

    // 1. للكمبيوتر: تحرك الماوس لأعلى الشاشة
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 15 && sessionStorage.getItem("exit_modal_shown") !== "true") {
        setShowExitModal(true);
        sessionStorage.setItem("exit_modal_shown", "true");
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);

    // 2. للموبايل: اعتراض زر الرجوع والتمرير
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      if (sessionStorage.getItem("exit_modal_shown") !== "true") {
        setShowExitModal(true);
        sessionStorage.setItem("exit_modal_shown", "true");
        window.history.pushState(null, "", window.location.href);
      }
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [config]);

  // عداد التنازل الديناميكي
  useEffect(() => {
    if (!config?.showTimer) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { minutes: prev.minutes - 1, seconds: 59 };
        return { minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [config?.showTimer]);

  // منبّه المبيعات الحية (Recent Sales Toast)
  useEffect(() => {
    if (!config?.showRecentSales) return;
    const interval = setInterval(() => {
      const randomBuyer = SAMPLE_BUYERS[Math.floor(Math.random() * SAMPLE_BUYERS.length)];
      setRecentBuyer(randomBuyer);
      setTimeout(() => setRecentBuyer(null), 4500);
    }, 14000);
    return () => clearInterval(interval);
  }, [config?.showRecentSales]);

  if (!config) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-amber-400 font-bold" dir="rtl">
        جاري تحميل المتجر...
      </div>
    );
  }

  const theme = THEME_STYLES[config.selectedTheme] || THEME_STYLES.sneakers;
  const activeCountry = config.countries[config.activeCountry];
  const activeProvince = activeCountry?.provinces.find((p) => p.id === selectedProvinceId);
  const shippingCost = activeProvince?.shippingCost || 0;

  // احتساب السعر وباقات العروض
  let productPriceTotal = config.currentPrice * selectedQty;
  if (config.showBundles && config.bundles?.length > 0) {
    const matchedBundle = config.bundles.find((b) => b.qty === selectedQty);
    if (matchedBundle) {
      productPriceTotal = matchedBundle.price;
    }
  }

  // تطبيق نسبة الخصم إن وجدت
  let discountAmount = 0;
  if (appliedDiscount > 0) {
    discountAmount = Math.round((productPriceTotal * appliedDiscount) / 100);
  }
  const grandTotal = Math.max(0, productPriceTotal - discountAmount) + shippingCost;

  // تطبيق كود الخصم بضغطة زر من نافذة الخروج
  const handleApplyExitCoupon = () => {
    const percent = config.exitCouponDiscountPercent || 10;
    setAppliedDiscount(percent);
    setAppliedCouponCode(config.exitCouponCode || "SPECIAL10");
    setShowExitModal(false);
    document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUpdateItemSelection = (index: number, field: "size" | "color", value: string) => {
    setItemsSelections((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsSubmitting(true);
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // تجهيز التقرير التفصيلي للقطع
    const itemsBreakdown = itemsSelections.map((item, i) => {
      const sizeStr = config.enableSizes && item.size ? `مقاس: ${item.size}` : "";
      const colorStr = config.enableColors && item.color ? `لون: ${item.color}` : "";
      const combined = [sizeStr, colorStr].filter(Boolean).join(" - ");
      return `قطعة ${i + 1}: ${combined || "افتراضي"}`;
    }).join("\n");

    const orderPayload = {
      id: orderId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      altPhone: altPhone.trim(),
      governorate: activeProvince?.name || "",
      address: address.trim(),
      notes: notes.trim(),
      qty: selectedQty,
      itemsBreakdown,
      selectedSize: itemsSelections[0]?.size || "",
      selectedColor: itemsSelections[0]?.color || "",
      total: grandTotal,
      appliedCoupon: appliedCouponCode,
      appliedDiscount,
      currency: activeCountry?.currency || "ج.م",
      website_hp_field: websiteHpField // مصيدة Honeypot
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();

      if (res.ok) {
        setOrderSuccess(orderPayload);

        // إرسال لـ Meta بالتزامن مع CAPI
        if (window.fbq && config.metaPixelId) {
          window.fbq("track", "Purchase", {
            currency: activeCountry?.currency || "EGP",
            value: grandTotal,
            content_name: config.productTitle
          }, { eventID: orderId });
        }

        // إرسال لـ TikTok
        if (window.ttq && config.tiktokPixelId) {
          window.ttq.track("CompletePayment", {
            content_name: config.productTitle,
            value: grandTotal,
            currency: activeCountry?.currency || "EGP"
          });
        }

        // إرسال لـ Google Tag
        if (window.gtag && config.googlePixelId) {
          window.gtag("event", "purchase", {
            transaction_id: orderId,
            value: grandTotal,
            currency: activeCountry?.currency || "EGP"
          });
        }
      } else {
        alert(data.error || "تعذر إرسال الطلب");
      }
    } catch (err) {
      alert("تعذر الاتصال بالخادم");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    const waNumber = (config.whatsappNumber || "").replace(/[^0-9]/g, "");
    const messageLines = [
      `*طلب شراء جديد 🛍️*`,
      `--------------------------`,
      `*رقم الطلب:* ${orderSuccess.id}`,
      `*الاسم:* ${orderSuccess.fullName}`,
      `*الهاتف:* ${orderSuccess.phone}${orderSuccess.altPhone ? ` (بديل: ${orderSuccess.altPhone})` : ""}`,
      `*المنتج:* ${config.productTitle}`,
      `*الكمية الإجمالية:* ${orderSuccess.qty}`,
      `--------------------------`,
      `*تفاصيل القطع المطلوبة:*`,
      orderSuccess.itemsBreakdown,
      `--------------------------`,
      orderSuccess.appliedDiscount > 0 ? `*كوبون الخصم:* ${orderSuccess.appliedCoupon} (وفر ${orderSuccess.appliedDiscount}%)` : null,
      `*المحافظة:* ${orderSuccess.governorate}`,
      `*العنوان:* ${orderSuccess.address}`,
      orderSuccess.notes ? `*ملاحظات:* ${orderSuccess.notes}` : null,
      `--------------------------`,
      `*الإجمالي المطلوب عند الاستلام:* ${orderSuccess.total} ${orderSuccess.currency}`,
      `--------------------------`,
      `أرجو تأكيد تجهيز الشحنة وموعد التوصيل.`
    ].filter(Boolean).join("\n");

    return (
      <div className={`min-h-screen ${theme.bg} text-white flex items-center justify-center p-4 font-sans`} dir="rtl">
        <div className={`${theme.cardBg} border border-emerald-500/30 p-8 rounded-3xl max-w-md w-full text-center space-y-5 shadow-2xl`}>
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
            ✓
          </div>
          <h2 className="text-2xl font-black text-emerald-400">تم استلام طلبك بنجاح!</h2>
          <p className="text-xs text-neutral-300">
            شكراً لك <span className="text-white font-bold">{orderSuccess.fullName}</span>، سيتواصل معك فريق خدمة العملاء قريباً لتأكيد الشحن.
          </p>
          <div className={`p-4 rounded-2xl ${theme.bg} ${theme.border} border text-xs text-right space-y-1.5 text-neutral-400`}>
            <p>رقم الطلب: <span className="font-mono text-white">{orderSuccess.id}</span></p>
            <p>المنتج: <span className="text-white">{config.productTitle}</span></p>
            <p>الكمية: <span className="text-white">{orderSuccess.qty}</span></p>
            <div className="border-t border-neutral-800 pt-1 text-[11px] text-neutral-300 whitespace-pre-line font-mono">
              {orderSuccess.itemsBreakdown}
            </div>
            {orderSuccess.appliedDiscount > 0 && (
              <p className="text-emerald-400 font-bold">تم تطبيق خصم {orderSuccess.appliedDiscount}%</p>
            )}
            <p className="border-t border-neutral-800 pt-1">
              الإجمالي المطلوب: <span className={`${theme.primaryText} font-bold text-sm`}>{orderSuccess.total} {orderSuccess.currency}</span>
            </p>
          </div>
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(messageLines)}`}
            target="_blank"
            rel="noreferrer"
            className="block w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg"
          >
            تأكيد ومتابعة تفاصيل الطلب عبر واتساب ↗
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg} text-neutral-100 font-sans pb-28`} dir="rtl">
      {/* 1. الشريط العلوي */}
      {config.showTopBar && (
        <div className={`${theme.primary} text-xs font-black py-2.5 text-center px-4 transition`}>
          {config.topBarText}
        </div>
      )}

      {/* 2. ترويسة المتجر */}
      <header className={`border-b ${theme.border} bg-neutral-900/40 backdrop-blur sticky top-0 z-40 px-4 py-3`}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.logoUrl && <img src={config.logoUrl} alt="Logo" className="h-7 w-auto object-contain" />}
            <span className="font-black text-sm tracking-wide text-white">{config.storeName}</span>
          </div>
          <span className="text-[11px] bg-neutral-800/80 text-neutral-300 px-3 py-1 rounded-full font-bold">
            {activeCountry?.name} ({activeCountry?.currency})
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* 3. معرض الصور */}
        <div className="space-y-3">
          <div className={`aspect-square ${theme.cardBg} rounded-3xl overflow-hidden border ${theme.border} relative shadow-xl`}>
            <img src={selectedImage || config.productImage} alt={config.productTitle} className="w-full h-full object-cover" />
            {config.showBadge && (
              <span className={`absolute top-4 right-4 ${theme.badgeBg} text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg`}>
                {config.badgeText}
              </span>
            )}
          </div>
          {config.gallery?.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedImage(config.productImage)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 ${selectedImage === config.productImage ? theme.accent : theme.border}`}
              >
                <img src={config.productImage} alt="Main" className="w-full h-full object-cover" />
              </button>
              {config.gallery.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedImage(g.image)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 ${selectedImage === g.image ? theme.accent : theme.border}`}
                >
                  <img src={g.image} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. العداد وشريط المخزون */}
        {(config.showTimer || config.showStockBar) && (
          <div className={`grid grid-cols-2 gap-3 ${theme.cardBg} border ${theme.border} p-3.5 rounded-2xl`}>
            {config.showTimer && (
              <div className={`text-center border-l ${theme.border} pl-2`}>
                <span className="text-[10px] text-neutral-400 block font-bold">ينتهي العرض المؤقت خلال</span>
                <span className={`text-sm font-black ${theme.primaryText} font-mono`}>
                  {String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
            )}
            {config.showStockBar && (
              <div className="text-center pr-2">
                <span className="text-[10px] text-neutral-400 block font-bold">المتبقي في المستودع</span>
                <span className="text-sm font-black text-rose-400 font-mono">{config.stockLeft} قطع فقط</span>
              </div>
            )}
          </div>
        )}

        {/* 5. تفاصيل السعر والاسم وعداد الكمية المرن */}
        <div className="space-y-3">
          <h1 className="text-lg sm:text-xl font-black text-white leading-snug">{config.productTitle}</h1>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-baseline gap-3">
              <span className={`text-2xl font-black ${theme.primaryText} font-mono`}>
                {config.currentPrice} {activeCountry?.currency}
              </span>
              {config.oldPrice > config.currentPrice && (
                <span className="text-xs text-neutral-500 line-through font-mono">
                  {config.oldPrice} {activeCountry?.currency}
                </span>
              )}
            </div>

            {/* عداد الكمية (+ / -) التفاعلي */}
            <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-2xl px-3 py-1.5">
              <span className="text-xs text-neutral-400 font-bold">الكمية:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-black text-base flex items-center justify-center transition"
                >
                  -
                </button>
                <span className="font-mono font-bold text-sm text-amber-400 w-5 text-center">{selectedQty}</span>
                <button
                  type="button"
                  onClick={() => setSelectedQty((q) => q + 1)}
                  className="w-8 h-8 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-black text-base flex items-center justify-center transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 6. باقات التوفير (إن وجدت) */}
        {config.showBundles && config.bundles?.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-300">اختر العرض الأنسب لك:</label>
            <div className="space-y-2">
              {config.bundles.map((b) => (
                <div
                  key={b.qty}
                  onClick={() => setSelectedQty(b.qty)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition ${selectedQty === b.qty ? `${theme.accent} bg-white/5` : `${theme.border} ${theme.cardBg}`}`}
                >
                  <div className="flex items-center gap-2.5">
                    <input type="radio" checked={selectedQty === b.qty} readOnly className="accent-amber-500" />
                    <div>
                      <p className="text-xs font-bold text-white">{b.title}</p>
                      {b.savings && <p className="text-[10px] text-emerald-400 font-bold">{b.savings}</p>}
                    </div>
                  </div>
                  <div className="text-left">
                    <span className={`text-sm font-black ${theme.primaryText} font-mono`}>{b.price} {activeCountry?.currency}</span>
                    {b.badge && <span className={`block text-[9px] ${theme.badgeBg} px-2 py-0.5 rounded font-black mt-0.5`}>{b.badge}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. تحديد المقاسات والألوان لكل قطعة مستقلة (Dynamic Multi-Item Selectors) */}
        {(config.enableSizes || config.enableColors) && (
          <div className={`${theme.cardBg} border ${theme.border} p-4 rounded-2xl space-y-4`}>
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <label className={`text-xs font-black ${theme.primaryText}`}>
                {selectedQty > 1 ? `حدد خيارات كل قطعة مطلوبة (${selectedQty} قطع):` : "حدد المقاس واللون:"}
              </label>
              {selectedQty > 1 && (
                <span className="text-[10px] text-neutral-400">يمكنك اختيار مقاس ولون مختلف لكل قطعة</span>
              )}
            </div>

            <div className="space-y-3">
              {itemsSelections.map((item, idx) => (
                <div key={idx} className={`p-3 rounded-xl border ${theme.border} bg-neutral-950/60 space-y-2.5`}>
                  {selectedQty > 1 && (
                    <span className="text-xs font-bold text-amber-400 block">👟 تفاصيل القطعة {idx + 1}:</span>
                  )}
                  
                  {/* اختيار المقاس */}
                  {config.enableSizes && config.sizes && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] text-neutral-400 font-bold block">المقاس:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {config.sizes.split(",").map((s) => {
                          const val = s.trim();
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleUpdateItemSelection(idx, "size", val)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${item.size === val ? `${theme.primary} border-transparent shadow` : `${theme.cardBg}${theme.border} text-neutral-300`}`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* اختيار اللون */}
                  {config.enableColors && config.colors && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] text-neutral-400 font-bold block">اللون:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {config.colors.split(",").map((c) => {
                          const val = c.trim();
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleUpdateItemSelection(idx, "color", val)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${item.color === val ? `${theme.primary} border-transparent shadow` : `${theme.cardBg}${theme.border} text-neutral-300`}`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. مميزات المنتج */}
        {config.features?.length > 0 && (
          <div className={`${theme.cardBg} border ${theme.border} p-4 rounded-2xl space-y-2.5`}>
            <h3 className={`text-xs font-bold ${theme.primaryText}`}>مميزات ومواصفات المنتج:</h3>
            <ul className="space-y-1.5 text-xs text-neutral-300 list-disc list-inside">
              {config.features.map((feat, idx) => (
                <li key={idx}>{feat}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 9. آراء وتقييمات العملاء */}
        {config.showReviews && config.reviews?.length > 0 && (
          <div className={`${theme.cardBg} border ${theme.border} p-4 rounded-2xl space-y-3`}>
            <h3 className={`text-xs font-bold ${theme.primaryText}`}>آراء وتقييمات العملاء:</h3>
            <div className="space-y-2.5">
              {config.reviews.map((rev, idx) => (
                <div key={idx} className={`p-3 rounded-xl border ${theme.border} ${theme.bg} space-y-1`}>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{rev.name}</span>
                    <span className="text-amber-400 font-bold">{"★".repeat(rev.rating || 5)}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. استمارة تسجيل الطلب */}
        <div id="order-form" className={`${theme.cardBg} border ${theme.border} p-5 rounded-3xl space-y-4 shadow-xl`}>
          <div className={`border-b ${theme.border} pb-3`}>
            <h2 className={`text-base font-black ${theme.primaryText}`}>بيانات التوصيل والشحن للمنزل</h2>
            <p className="text-[11px] text-neutral-400">الدفع نقداً عند استلام وفحص المنتج أمام المندوب</p>
          </div>

          <form onSubmit={handleSubmitOrder} className="space-y-3">
            {/* حقل المصيدة (Honeypot) */}
            <input
              type="text"
              name="website_hp_field"
              value={websiteHpField}
              onChange={(e) => setWebsiteHpField(e.target.value)}
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />

            <div>
              <label className="block text-xs text-neutral-300 mb-1 font-bold">الاسم ثلاثي *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="اكتب اسمك كاملاً"
                className={`w-full ${theme.bg} border ${theme.border} rounded-xl p-3 text-xs text-white focus:outline-none`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-neutral-300 mb-1 font-bold">رقم الهاتف *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="رقم الهاتف للتواصل"
                  className={`w-full ${theme.bg} border ${theme.border} rounded-xl p-3 text-xs text-white font-mono focus:outline-none`}
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-300 mb-1">رقم هاتف بديل (اختياري)</label>
                <input
                  type="tel"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  placeholder="رقم هاتف آخر احتياطي"
                  className={`w-full ${theme.bg} border ${theme.border} rounded-xl p-3 text-xs text-white font-mono focus:outline-none`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-neutral-300 mb-1 font-bold">المحافظة / المدينة *</label>
              <select
                value={selectedProvinceId}
                onChange={(e) => setSelectedProvinceId(e.target.value)}
                className={`w-full ${theme.bg} border ${theme.border} rounded-xl p-3 text-xs text-white focus:outline-none`}
              >
                {activeCountry?.provinces.filter((p) => p.enabled).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.shippingCost > 0 ? `(+${p.shippingCost} ${activeCountry.currency} شحن)` : "(شحن مجاني)"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-neutral-300 mb-1 font-bold">العنوان بالتفصيل *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="المنطقة، اسم الشارع، رقم العقار والشقة"
                className={`w-full ${theme.bg} border ${theme.border} rounded-xl p-3 text-xs text-white focus:outline-none`}
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1">ملاحظات للمندوب</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي تعليمات خاصة بموعد التسليم"
                className={`w-full ${theme.bg} border ${theme.border} rounded-xl p-3 text-xs text-white focus:outline-none`}
              />
            </div>

            {/* ملخص السعر وكود الخصم المطبق */}
            <div className={`${theme.bg} p-3.5 rounded-xl border ${theme.border} space-y-1.5 text-xs`}>
              <div className="flex justify-between text-neutral-400">
                <span>سعر الطلب ({selectedQty} قطع):</span>
                <span className="font-mono text-white">{productPriceTotal} {activeCountry?.currency}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>كوبون الخصم ({appliedCouponCode} - {appliedDiscount}%):</span>
                  <span className="font-mono">-{discountAmount} {activeCountry?.currency}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-400">
                <span>تكلفة الشحن:</span>
                <span className="font-mono text-white">
                  {shippingCost > 0 ? `${shippingCost} ${activeCountry?.currency}` : "مجاني"}
                </span>
              </div>
              <div className={`flex justify-between text-sm font-black ${theme.primaryText} border-t ${theme.border} pt-2`}>
                <span>المجموع النهائي عند الاستلام:</span>
                <span className="font-mono">{grandTotal} {activeCountry?.currency}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full ${theme.primary} font-black py-4 rounded-xl text-base shadow-xl transition disabled:opacity-50`}
            >
              {isSubmitting ? "جاري تسجيل الطلب..." : "تأكيد الطلب الآن 🛍️"}
            </button>
          </form>
        </div>

        {/* 11. قسم الضمان */}
        {config.showGuarantee && (
          <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-2xl text-center space-y-1">
            <h4 className="text-xs font-bold text-emerald-400">{config.guaranteeText}</h4>
            {config.guaranteeSubtext && <p className="text-[11px] text-neutral-400">{config.guaranteeSubtext}</p>}
          </div>
        )}
      </main>

      {/* 12. إشعار المبيعات اللحظية (Recent Sales Toast) */}
      {recentBuyer && (
        <div className="fixed bottom-20 left-4 z-50 bg-neutral-900 border border-neutral-700 text-white p-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs animate-fade-in">
          <span className="text-emerald-400 text-lg">⚡</span>
          <div>
            <p className="font-bold">{recentBuyer.name} من {recentBuyer.city}</p>
            <p className="text-[10px] text-neutral-400">اشترى للتو ({recentBuyer.time})</p>
          </div>
        </div>
      )}

      {/* 13. زر الدعم الفني العائم لواتساب */}
      {config.showSupportWhatsapp && config.supportWhatsappNumber && (
        <a
          href={`https://wa.me/${config.supportWhatsappNumber.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-20 right-4 z-50 bg-emerald-600 hover:bg-emerald-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-2xl text-2xl transition"
          title="تواصل مع الدعم الفني"
        >
          💬
        </a>
      )}

      {/* 14. زر الشراء العائم للموبايل */}
      {config.showStickyButton && (
        <div className={`fixed bottom-0 left-0 right-0 p-3 bg-neutral-900/90 backdrop-blur border-t ${theme.border} z-40 max-w-2xl mx-auto flex items-center justify-between gap-3`}>
          <div>
            <span className="text-[10px] text-neutral-400 block">الإجمالي:</span>
            <span className={`text-base font-black ${theme.primaryText} font-mono`}>{grandTotal} {activeCountry?.currency}</span>
          </div>
          <button
            onClick={() => document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth" })}
            className={`flex-1 ${theme.primary} font-black py-3 rounded-xl text-xs sm:text-sm shadow-lg transition`}
          >
            اطلب الآن وادفع عند الاستلام
          </button>
        </div>
      )}

      {/* 15. نافذة كود الخصم عند محاولة الخروج (Exit-Intent Coupon Modal) */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" dir="rtl">
          <div className="bg-neutral-900 border-2 border-amber-500/40 p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowExitModal(false)}
              className="absolute top-4 left-4 text-neutral-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>
            <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto text-3xl font-bold border border-amber-500/30">
              🎁
            </div>
            <h3 className="text-lg font-black text-white">
              {config.exitPopupTitle || "انتظر! لا تفوت هذا العرض الخاص 🎁"}
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {config.exitPopupText || "احصل على خصم إضافي خاص بك الآن قبل المغادرة!"}
            </p>
            <div className="bg-neutral-950 border border-dashed border-amber-500/50 p-3 rounded-2xl">
              <span className="text-[11px] text-neutral-400 block">كوبون خصم إضافي حصري:</span>
              <span className="text-xl font-black text-amber-400 font-mono tracking-wider">
                {config.exitCouponCode || "SPECIAL10"} (خصم {config.exitCouponDiscountPercent || 10}%)
              </span>
            </div>
            <button
              onClick={handleApplyExitCoupon}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl text-sm transition shadow-lg"
            >
              تفعيل الخصم الآن وإتمام الطلب ⚡
            </button>
            <button
              onClick={() => setShowExitModal(false)}
              className="text-[11px] text-neutral-500 hover:text-neutral-400 block mx-auto underline"
            >
              شكراً، لا أريد هذا الخصم
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
