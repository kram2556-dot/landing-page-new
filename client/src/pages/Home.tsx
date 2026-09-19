import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { parseColors, parseSizes } from "../const";

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

export interface GalleryItem {
  id: string;
  image: string;
  caption?: string;
}

export interface StoreConfig {
  storeName: string;
  logoUrl: string;
  selectedTheme?: string;
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
  tiktokPixelId: string;
  googlePixelId: string;
  ctaButtonText?: string;
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

const SAMPLE_BUYERS = [
  { name: "أحمد م.", city: "القاهرة", time: "منذ 4 دقائق" },
  { name: "خالد ع.", city: "الجيزة", time: "منذ دقيقتين" },
  { name: "محمد س.", city: "الإسكندرية", time: "منذ 7 دقائق" },
  { name: "محمود د.", city: "المنصورة", time: "منذ 3 دقائق" }
];

interface ItemSelection {
  size: string;
  color: string;
}

export default function Home() {
  const { activeStoreTheme, setStoreThemeById } = useTheme();

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
  const [websiteHpField, setWebsiteHpField] = useState("");

  const [showExitModal, setShowExitModal] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);
  const [timeLeft, setTimeLeft] = useState({ minutes: 15, seconds: 0 });
  const [recentBuyer, setRecentBuyer] = useState<any | null>(null);

  const enableColors = config ? (localStorage.getItem("store_enable_colors") !== "false" && config.enableColors !== false) : true;
  const colorsRaw = localStorage.getItem("store_colors_input") || config?.colors || "اسود, احمر, كحلي";
  const parsedColorsList = parseColors(colorsRaw);

  const enableSizes = config ? (localStorage.getItem("store_enable_sizes") !== "false" && config.enableSizes !== false) : true;
  const sizesRaw = localStorage.getItem("store_sizes_input") || config?.sizes || "40, 41, 42, 43, 44";
  const parsedSizesList = parseSizes(sizesRaw);

  const ctaButtonText = localStorage.getItem("store_cta_text") || config?.ctaButtonText || "اطلب الآن والدفع عند الاستلام";

  useEffect(() => {
    if (!config) return;
    const defaultSize = enableSizes && parsedSizesList[0] ? parsedSizesList[0] : "";
    const defaultColor = enableColors && parsedColorsList[0] ? parsedColorsList[0].name : "";

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
  }, [selectedQty, config, enableSizes, enableColors]);

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

          if (data.themeId || data.selectedTheme) {
            setStoreThemeById(data.themeId || data.selectedTheme);
          }

          const defaultSize = data.enableSizes && data.sizes ? data.sizes.split(",")[0]?.trim() : "";
          const defaultColor = data.enableColors && data.colors ? data.colors.split(",")[0]?.trim() : "";
          setItemsSelections([{ size: defaultSize, color: defaultColor }]);

          const currentCountry = data.countries?.[data.activeCountry];
          const firstProv = currentCountry?.provinces?.find((p: any) => p.enabled);
          if (firstProv) setSelectedProvinceId(firstProv.id);

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
  }, [setStoreThemeById]);

  useEffect(() => {
    if (!config || config.enableExitPopup === false) return;
    if (sessionStorage.getItem("exit_modal_shown") === "true") return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 15 && sessionStorage.getItem("exit_modal_shown") !== "true") {
        setShowExitModal(true);
        sessionStorage.setItem("exit_modal_shown", "true");
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);

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

  const activeCountry = config.countries[config.activeCountry];
  const activeProvince = activeCountry?.provinces.find((p) => p.id === selectedProvinceId);
  const shippingCost = activeProvince?.shippingCost || 0;

  let productPriceTotal = config.currentPrice * selectedQty;
  if (config.showBundles && config.bundles?.length > 0) {
    const matchedBundle = config.bundles.find((b) => b.qty === selectedQty);
    if (matchedBundle) {
      productPriceTotal = matchedBundle.price;
    }
  }

  let discountAmount = 0;
  if (appliedDiscount > 0) {
    discountAmount = Math.round((productPriceTotal * appliedDiscount) / 100);
  }
  const grandTotal = Math.max(0, productPriceTotal - discountAmount) + shippingCost;

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

    const now = new Date();
    const orderDateAr = new Intl.DateTimeFormat("ar-EG", {
      timeZone: "Africa/Cairo",
      dateStyle: "full",
      timeStyle: "short",
    }).format(now);

    const itemsBreakdown = itemsSelections.map((item, i) => {
      const sizeStr = enableSizes && item.size ? `مقاس: ${item.size}` : "";
      const colorStr = enableColors && item.color ? `لون: ${item.color}` : "";
      const combined = [sizeStr, colorStr].filter(Boolean).join(" - ");
      return `قطعة ${i + 1}: ${combined || "قياسي"}`;
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
      selectedSize: enableSizes ? (itemsSelections[0]?.size || "") : "",
      selectedColor: enableColors ? (itemsSelections[0]?.color || "") : "",
      total: grandTotal,
      appliedCoupon: appliedCouponCode,
      appliedDiscount,
      currency: activeCountry?.currency || "ج.م",
      createdAt: now.toISOString(),
      orderDateAr: orderDateAr,
      website_hp_field: websiteHpField
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

        if (window.fbq && config.metaPixelId) {
          window.fbq("track", "Purchase", {
            currency: activeCountry?.currency || "EGP",
            value: grandTotal,
            content_name: config.productTitle
          }, { eventID: orderId });
        }

        if (window.ttq && config.tiktokPixelId) {
          window.ttq.track("CompletePayment", {
            content_name: config.productTitle,
            value: grandTotal,
            currency: activeCountry?.currency || "EGP"
          });
        }

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

  const renderVideoPlayer = (url: string) => {
    if (!url || !url.trim()) return null;
    const clean = url.trim();

    if (clean.includes("youtube.com") || clean.includes("youtu.be")) {
      let vidId = "";
      if (clean.includes("youtu.be/")) {
        vidId = clean.split("youtu.be/")[1]?.split("?")[0];
      } else if (clean.includes("shorts/")) {
        vidId = clean.split("shorts/")[1]?.split("?")[0];
      } else if (clean.includes("v=")) {
        vidId = clean.split("v=")[1]?.split("&")[0];
      }
      if (vidId) {
        return (
          <div className="aspect-video w-full rounded-2xl overflow-hidden border shadow-lg" style={{ borderColor: "var(--color-border)" }}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${vidId}?rel=0&modestbranding=1`}
              title="Product Video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }
    }

    if (clean.includes("facebook.com") || clean.includes("fb.watch")) {
      const fbEmbedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(clean)}&show_text=0&width=500`;
      return (
        <div className="aspect-video w-full rounded-2xl overflow-hidden border shadow-lg" style={{ borderColor: "var(--color-border)" }}>
          <iframe
            src={fbEmbedUrl}
            title="Facebook Product Video"
            className="w-full h-full"
            scrolling="no"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      );
    }

    if (clean.endsWith(".mp4") || clean.includes(".mp4?")) {
      return (
        <div className="w-full rounded-2xl overflow-hidden border shadow-lg" style={{ borderColor: "var(--color-border)" }}>
          <video controls playsInline className="w-full h-auto">
            <source src={clean} type="video/mp4" />
            متصفحك لا يدعم تشغيل الفيديو.
          </video>
        </div>
      );
    }

    return null;
  };

  if (orderSuccess) {
    const waNumber = (config.whatsappNumber || localStorage.getItem("store_whatsapp") || "").replace(/[^0-9]/g, "");
    const messageLines = [
      `*طلب شراء جديد 🛍️*`,
      `--------------------------`,
      `*رقم الطلب:* ${orderSuccess.id}`,
      `*توقيت الطلب:* ${orderSuccess.orderDateAr}`,
      `*الاسم:* ${orderSuccess.fullName}`,
      `*الهاتف:* ${orderSuccess.phone}${orderSuccess.altPhone ? ` (بديل: ${orderSuccess.altPhone})` : ""}`,
      `*المنتج:* ${config.productTitle}`,
      `*الكمية الإجمالية:* ${orderSuccess.qty}`,
      (enableSizes || enableColors) ? `--------------------------\n*تفاصيل القطع:*\n${orderSuccess.itemsBreakdown}` : null,
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
      <div className="min-h-screen flex items-center justify-center p-4 font-sans" style={{ background: "var(--color-bg)", color: "var(--color-text, #111827)" }} dir="rtl">
        <div className="p-8 rounded-3xl max-w-md w-full text-center space-y-5 shadow-2xl" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl font-bold" style={{ background: "var(--color-badge-bg)", color: "var(--color-primary)" }}>
            ✓
          </div>
          <h2 className="text-2xl font-black" style={{ color: "var(--color-primary)" }}>تم استلام طلبك بنجاح!</h2>
          <p className="text-xs opacity-90" style={{ color: "var(--color-text, #111827)" }}>
            شكراً لك <span className="font-bold">{orderSuccess.fullName}</span>، سيتواصل معك فريق خدمة العملاء قريباً لتأكيد الشحن.
          </p>
          <div className="p-4 rounded-2xl text-xs text-right space-y-1.5" style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text, #111827)" }}>
            <p>رقم الطلب: <span className="font-mono font-bold">{orderSuccess.id}</span></p>
            <p>توقيت الطلب: <span className="font-mono">{orderSuccess.orderDateAr}</span></p>
            <p>المنتج: <span className="font-bold">{config.productTitle}</span></p>
            <p>الكمية: <span className="font-bold">{orderSuccess.qty}</span></p>
            {(enableSizes || enableColors) && (
              <div className="border-t border-neutral-800/20 pt-1 text-[11px] whitespace-pre-line font-mono opacity-80">
                {orderSuccess.itemsBreakdown}
              </div>
            )}
            {orderSuccess.appliedDiscount > 0 && (
              <p className="font-bold text-emerald-600">تم تطبيق خصم {orderSuccess.appliedDiscount}%</p>
            )}
            <p className="border-t border-neutral-800/20 pt-1">
              الإجمالي المطلوب: <span className="font-bold text-sm" style={{ color: "var(--color-primary)" }}>{orderSuccess.total} {orderSuccess.currency}</span>
            </p>
          </div>
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(messageLines)}`}
            target="_blank"
            rel="noreferrer"
            className="block w-full font-bold py-3.5 rounded-xl text-sm transition shadow-lg text-white"
            style={{ background: "#25D366" }}
          >
            تأكيد ومتابعة تفاصيل الطلب عبر واتساب ↗
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans pb-28" style={{ background: "var(--color-bg)", color: "var(--color-text, #111827)" }} dir="rtl">
      {/* 1. الشريط العلوي */}
      {config.showTopBar && (
        <div className="text-xs font-black py-2.5 text-center px-4 transition text-white" style={{ background: "var(--color-primary)" }}>
          {config.topBarText}
        </div>
      )}

      {/* 2. ترويسة المتجر متوافقة بالكامل مع لون الثيم */}
      <header className="border-b sticky top-0 z-40 px-4 py-3 backdrop-blur shadow-sm" style={{ borderColor: "var(--color-border)", background: "var(--color-card, #FFFFFF)" }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.logoUrl && <img src={config.logoUrl} alt="Logo" className="h-7 w-auto object-contain" />}
            <span className="font-black text-sm tracking-wide" style={{ color: "var(--color-text, #111827)" }}>{config.storeName}</span>
          </div>
          <span className="text-[11px] px-3 py-1 rounded-full font-bold" style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text, #111827)" }}>
            {activeCountry?.name} ({activeCountry?.currency})
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* 3. معرض الصور الرئيسي */}
        <div className="space-y-3">
          <div className="aspect-square rounded-3xl overflow-hidden relative shadow-xl" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--border-radius)" }}>
            <img src={selectedImage || config.productImage} alt={config.productTitle} className="w-full h-full object-cover" />
            {config.showBadge && (
              <span className="absolute top-4 right-4 text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg" style={{ background: "var(--color-primary)", color: "#FFFFFF" }}>
                {config.badgeText}
              </span>
            )}
          </div>
          {config.gallery?.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedImage(config.productImage)}
                className="w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0"
                style={{ borderColor: selectedImage === config.productImage ? "var(--color-primary)" : "var(--color-border)" }}
              >
                <img src={config.productImage} alt="Main" className="w-full h-full object-cover" />
              </button>
              {config.gallery.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedImage(g.image)}
                  className="w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0"
                  style={{ borderColor: selectedImage === g.image ? "var(--color-primary)" : "var(--color-border)" }}
                >
                  <img src={g.image} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. العداد وشريط المخزون */}
        {(config.showTimer || config.showStockBar) && (
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl shadow-sm" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
            {config.showTimer && (
              <div className="text-center border-l pl-2" style={{ borderColor: "var(--color-border)" }}>
                <span className="text-[10px] opacity-70 block font-bold" style={{ color: "var(--color-text, #111827)" }}>ينتهي العرض المؤقت خلال</span>
                <span className="text-sm font-black font-mono" style={{ color: "var(--color-primary)" }}>
                  {String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
            )}
            {config.showStockBar && (
              <div className="text-center pr-2">
                <span className="text-[10px] opacity-70 block font-bold" style={{ color: "var(--color-text, #111827)" }}>المتبقي في المستودع</span>
                <span className="text-sm font-black text-rose-500 font-mono">{config.stockLeft} قطع فقط</span>
              </div>
            )}
          </div>
        )}

        {/* 5. تفاصيل السعر والاسم وعداد الكمية (مع تصحيح وضوح العنوان) */}
        <div className="space-y-3">
          <h1 className="text-lg sm:text-xl font-black leading-snug" style={{ color: "var(--color-text, #111827)" }}>
            {config.productTitle}
          </h1>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black font-mono" style={{ color: "var(--color-primary)" }}>
                {config.currentPrice} {activeCountry?.currency}
              </span>
              {config.oldPrice > config.currentPrice && (
                <span className="text-xs opacity-50 line-through font-mono" style={{ color: "var(--color-text, #111827)" }}>
                  {config.oldPrice} {activeCountry?.currency}
                </span>
              )}
            </div>

            {/* عداد الكمية */}
            <div className="flex items-center gap-3 rounded-2xl px-3 py-1.5 shadow-sm" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
              <span className="text-xs opacity-75 font-bold" style={{ color: "var(--color-text, #111827)" }}>الكمية:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-xl font-black text-base flex items-center justify-center transition"
                  style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text, #111827)" }}
                >
                  -
                </button>
                <span className="font-mono font-bold text-sm w-5 text-center" style={{ color: "var(--color-primary)" }}>{selectedQty}</span>
                <button
                  type="button"
                  onClick={() => setSelectedQty((q) => q + 1)}
                  className="w-8 h-8 rounded-xl font-black text-base flex items-center justify-center transition"
                  style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text, #111827)" }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 6. باقات التوفير */}
        {config.showBundles && config.bundles?.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-bold opacity-80" style={{ color: "var(--color-text, #111827)" }}>اختر العرض الأنسب لك:</label>
            <div className="space-y-2">
              {config.bundles.map((b) => {
                const isSelected = selectedQty === b.qty;
                return (
                  <div
                    key={b.qty}
                    onClick={() => setSelectedQty(b.qty)}
                    className="p-3.5 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition"
                    style={{
                      borderColor: isSelected ? "var(--color-primary)" : "var(--color-border)",
                      background: isSelected ? "var(--color-badge-bg)" : "var(--color-card)"
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <input type="radio" checked={isSelected} readOnly style={{ accentColor: "var(--color-primary)" }} />
                      <div>
                        <p className="text-xs font-bold" style={{ color: "var(--color-text, #111827)" }}>{b.title}</p>
                        {b.savings && <p className="text-[10px] text-emerald-500 font-bold">{b.savings}</p>}
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-black font-mono" style={{ color: "var(--color-primary)" }}>{b.price} {activeCountry?.currency}</span>
                      {b.badge && <span className="block text-[9px] px-2 py-0.5 rounded font-black mt-0.5" style={{ background: "var(--color-primary)", color: "#FFFFFF" }}>{b.badge}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 7. المقاسات والألوان */}
        {(enableSizes || enableColors) && (
          <div className="p-4 rounded-2xl space-y-4 shadow-sm" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
            <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: "var(--color-border)" }}>
              <label className="text-xs font-black" style={{ color: "var(--color-primary)" }}>
                {selectedQty > 1 ? `حدد خيارات كل قطعة مطلوبة (${selectedQty} قطع):` : "حدد المقاس واللون:"}
              </label>
              {selectedQty > 1 && (
                <span className="text-[10px] opacity-70" style={{ color: "var(--color-text, #111827)" }}>يمكنك اختيار مقاس ولون مختلف لكل قطعة</span>
              )}
            </div>

            <div className="space-y-3">
              {itemsSelections.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl border space-y-2.5" style={{ background: "var(--color-bg)", borderColor: "var(--color-border)" }}>
                  {selectedQty > 1 && (
                    <span className="text-xs font-bold block" style={{ color: "var(--color-primary)" }}>تفاصيل القطعة {idx + 1}:</span>
                  )}

                  {/* اختيار المقاس */}
                  {enableSizes && parsedSizesList.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] opacity-75 font-bold block" style={{ color: "var(--color-text, #111827)" }}>المقاس:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {parsedSizesList.map((val) => {
                          const isSelected = item.size === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleUpdateItemSelection(idx, "size", val)}
                              className="px-3.5 py-1.5 rounded-lg text-xs font-bold border transition"
                              style={{
                                background: isSelected ? "var(--color-primary)" : "var(--color-card)",
                                color: isSelected ? "#FFFFFF" : "var(--color-text, #111827)",
                                borderColor: isSelected ? "var(--color-primary)" : "var(--color-border)"
                              }}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* اختيار اللون */}
                  {enableColors && parsedColorsList.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] opacity-75 font-bold block" style={{ color: "var(--color-text, #111827)" }}>اللون:</span>
                      <div className="flex flex-wrap gap-2">
                        {parsedColorsList.map((color) => {
                          const isSelected = item.color === color.name;
                          return (
                            <button
                              key={color.name}
                              type="button"
                              onClick={() => handleUpdateItemSelection(idx, "color", color.name)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition"
                              style={{
                                borderColor: isSelected ? "var(--color-primary)" : "var(--color-border)",
                                background: isSelected ? "var(--color-badge-bg)" : "var(--color-card)",
                                color: "var(--color-text, #111827)",
                                transform: isSelected ? "scale(1.05)" : "none"
                              }}
                            >
                              <span
                                className="w-3.5 h-3.5 rounded-full border shadow-sm"
                                style={{ backgroundColor: color.hex, borderColor: "rgba(0,0,0,0.15)" }}
                              />
                              <span>{color.name}</span>
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

        {/* 8. قسم الفيديو المدمج (فيسبوك أو يوتيوب أو MP4) */}
        {config.videoUrl && config.videoUrl.trim() !== "" && (
          <div className="p-4 rounded-2xl space-y-3 shadow-sm" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
            <h3 className="text-xs font-bold flex items-center gap-2" style={{ color: "var(--color-primary)" }}>
              <span>🎥</span> فيديو توضيحي واستعراض تفاصيل المنتج:
            </h3>
            {renderVideoPlayer(config.videoUrl)}
          </div>
        )}

        {/* 9. معرض الصور التفصيلي مع الوصف المكتوب تحت كل صورة */}
        {config.gallery && config.gallery.length > 0 && (
          <div className="space-y-4">
            <div className="text-center space-y-1 pt-2">
              <h3 className="text-sm font-black" style={{ color: "var(--color-primary)" }}>
                تفاصيل ومميزات المنتج بالصور
              </h3>
              <p className="text-[11px] opacity-70" style={{ color: "var(--color-text, #111827)" }}>تعرف عن قرب على جودة الخامات والتصميم</p>
            </div>

            <div className="space-y-4">
              {config.gallery.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="rounded-2xl overflow-hidden border shadow-lg"
                  style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
                >
                  <img
                    src={item.image}
                    alt={item.caption || `صورة توضيحية ${idx + 1}`}
                    className="w-full h-auto object-cover max-h-96"
                    loading="lazy"
                  />
                  {item.caption && item.caption.trim() !== "" && (
                    <div className="p-3 text-center border-t" style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}>
                      <p className="text-xs font-bold leading-relaxed" style={{ color: "var(--color-text, #111827)" }}>{item.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. مميزات ومواصفات المنتج */}
        {config.features?.length > 0 && (
          <div className="p-4 rounded-2xl space-y-2.5 shadow-sm" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
            <h3 className="text-xs font-bold" style={{ color: "var(--color-primary)" }}>مميزات ومواصفات المنتج:</h3>
            <ul className="space-y-1.5 text-xs opacity-90 list-disc list-inside" style={{ color: "var(--color-text, #111827)" }}>
              {config.features.map((feat, idx) => (
                <li key={idx}>{feat}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 11. آراء وتقييمات العملاء */}
        {config.showReviews && config.reviews?.length > 0 && (
          <div className="p-4 rounded-2xl space-y-3 shadow-sm" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
            <h3 className="text-xs font-bold" style={{ color: "var(--color-primary)" }}>آراء وتقييمات العملاء:</h3>
            <div className="space-y-2.5">
              {config.reviews.map((rev, idx) => (
                <div key={idx} className="p-3 rounded-xl border space-y-1" style={{ background: "var(--color-bg)", borderColor: "var(--color-border)" }}>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold" style={{ color: "var(--color-text, #111827)" }}>{rev.name}</span>
                    <span className="text-amber-500 font-bold">{"★".repeat(rev.rating || 5)}</span>
                  </div>
                  <p className="text-[11px] opacity-75" style={{ color: "var(--color-text, #111827)" }}>{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 12. استمارة تسجيل الطلب السريعة */}
        <div id="order-form" className="p-5 rounded-3xl space-y-4 shadow-xl" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
          <div className="border-b pb-3" style={{ borderColor: "var(--color-border)" }}>
            <h2 className="text-base font-black" style={{ color: "var(--color-primary)" }}>بيانات التوصيل والشحن للمنزل</h2>
            <p className="text-[11px] opacity-70" style={{ color: "var(--color-text, #111827)" }}>الدفع نقداً عند استلام وفحص المنتج أمام المندوب</p>
          </div>

          <form onSubmit={handleSubmitOrder} className="space-y-3">
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
              <label className="block text-xs mb-1 font-bold" style={{ color: "var(--color-text, #111827)" }}>الاسم بالكامل *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="اكتب اسمك كاملاً"
                className="w-full border rounded-xl p-3 text-xs focus:outline-none"
                style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text, #111827)" }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1 font-bold" style={{ color: "var(--color-text, #111827)" }}>رقم الهاتف *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="رقم الهاتف للتواصل"
                  className="w-full border rounded-xl p-3 text-xs font-mono focus:outline-none"
                  style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text, #111827)" }}
                />
              </div>
              <div>
                <label className="block text-xs opacity-75 mb-1" style={{ color: "var(--color-text, #111827)" }}>رقم هاتف بديل (اختياري)</label>
                <input
                  type="tel"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  placeholder="رقم احتياطي للمندوب"
                  className="w-full border rounded-xl p-3 text-xs font-mono focus:outline-none"
                  style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text, #111827)" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs mb-1 font-bold" style={{ color: "var(--color-text, #111827)" }}>المحافظة *</label>
              <select
                value={selectedProvinceId}
                onChange={(e) => setSelectedProvinceId(e.target.value)}
                className="w-full border rounded-xl p-3 text-xs focus:outline-none"
                style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text, #111827)" }}
              >
                {activeCountry?.provinces.filter((p) => p.enabled).map((p) => (
                  <option key={p.id} value={p.id} style={{ background: "var(--color-card)", color: "var(--color-text, #111827)" }}>
                    {p.name} {p.shippingCost > 0 ? `(+${p.shippingCost} ${activeCountry.currency} شحن)` : "(شحن مجاني)"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs mb-1 font-bold" style={{ color: "var(--color-text, #111827)" }}>تفاصيل العنوان (الشارع / رقم العقار / علامة مميزة) *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="المنطقة، اسم الشارع، رقم العقار أو علامة مميزة"
                className="w-full border rounded-xl p-3 text-xs focus:outline-none"
                style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text, #111827)" }}
              />
            </div>

            <div>
              <label className="block text-xs opacity-70 mb-1" style={{ color: "var(--color-text, #111827)" }}>ملاحظات إضافية (اختياري)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي تعليمات خاصة بموعد الاستلام"
                className="w-full border rounded-xl p-3 text-xs focus:outline-none"
                style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text, #111827)" }}
              />
            </div>

            {/* ملخص السعر */}
            <div className="p-3.5 rounded-xl border space-y-1.5 text-xs" style={{ background: "var(--color-bg)", borderColor: "var(--color-border)" }}>
              <div className="flex justify-between opacity-75" style={{ color: "var(--color-text, #111827)" }}>
                <span>سعر الطلب ({selectedQty} قطع):</span>
                <span className="font-mono">{productPriceTotal} {activeCountry?.currency}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>كوبون الخصم ({appliedCouponCode} - {appliedDiscount}%):</span>
                  <span className="font-mono">-{discountAmount} {activeCountry?.currency}</span>
                </div>
              )}
              <div className="flex justify-between opacity-75" style={{ color: "var(--color-text, #111827)" }}>
                <span>تكلفة الشحن:</span>
                <span className="font-mono">
                  {shippingCost > 0 ? `${shippingCost} ${activeCountry?.currency}` : "مجاني"}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black border-t pt-2" style={{ borderColor: "var(--color-border)", color: "var(--color-primary)" }}>
                <span>المجموع النهائي عند الاستلام:</span>
                <span className="font-mono">{grandTotal} {activeCountry?.currency}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-black py-4 rounded-xl text-base shadow-xl transition disabled:opacity-50 text-white cursor-pointer"
              style={{ background: "var(--color-primary)" }}
            >
              {isSubmitting ? "جاري تسجيل الطلب..." : `${ctaButtonText} 🛍️`}
            </button>
          </form>
        </div>

        {/* 13. قسم الضمان */}
        {config.showGuarantee && (
          <div className="p-4 rounded-2xl text-center space-y-1 shadow-sm" style={{ background: "rgba(5, 150, 105, 0.1)", border: "1px solid rgba(5, 150, 105, 0.3)" }}>
            <h4 className="text-xs font-bold text-emerald-600">{config.guaranteeText}</h4>
            {config.guaranteeSubtext && <p className="text-[11px] opacity-75" style={{ color: "var(--color-text, #111827)" }}>{config.guaranteeSubtext}</p>}
          </div>
        )}
      </main>

      {/* 14. إشعار المبيعات اللحظية */}
      {recentBuyer && (
        <div className="fixed bottom-20 left-4 z-50 p-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs animate-fade-in" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", color: "var(--color-text, #111827)" }}>
          <span className="text-emerald-500 text-lg">⚡</span>
          <div>
            <p className="font-bold">{recentBuyer.name} من {recentBuyer.city}</p>
            <p className="text-[10px] opacity-70">اشترى للتو ({recentBuyer.time})</p>
          </div>
        </div>
      )}

      {/* 15. زر الدعم الفني العائم لواتساب */}
      {config.showSupportWhatsapp && config.supportWhatsappNumber && (
        <a
          href={`https://wa.me/${config.supportWhatsappNumber.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-20 right-4 z-50 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-2xl text-2xl transition"
          style={{ background: "#25D366" }}
          title="تواصل مع الدعم الفني"
        >
          💬
        </a>
      )}

      {/* 16. زر الشراء العائم للموبايل */}
      {config.showStickyButton && (
        <div className="fixed bottom-0 left-0 right-0 p-3 backdrop-blur border-t z-40 max-w-2xl mx-auto flex items-center justify-between gap-3 shadow-lg" style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <div>
            <span className="text-[10px] opacity-70 block" style={{ color: "var(--color-text, #111827)" }}>الإجمالي:</span>
            <span className="text-base font-black font-mono" style={{ color: "var(--color-primary)" }}>{grandTotal} {activeCountry?.currency}</span>
          </div>
          <button
            onClick={() => document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth" })}
            className="flex-1 font-black py-3 rounded-xl text-xs sm:text-sm shadow-lg transition text-white"
            style={{ background: "var(--color-primary)" }}
          >
            {ctaButtonText}
          </button>
        </div>
      )}

      {/* 17. نافذة كود الخصم عند محاولة الخروج */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" dir="rtl">
          <div className="p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl relative" style={{ background: "var(--color-card)", border: "2px solid var(--color-primary)", color: "var(--color-text, #111827)" }}>
            <button
              onClick={() => setShowExitModal(false)}
              className="absolute top-4 left-4 opacity-60 hover:opacity-100 text-lg font-bold"
              style={{ color: "var(--color-text, #111827)" }}
            >
              ✕
            </button>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl font-bold" style={{ background: "var(--color-badge-bg)", color: "var(--color-primary)" }}>
              🎁
            </div>
            <h3 className="text-lg font-black" style={{ color: "var(--color-text, #111827)" }}>
              {config.exitPopupTitle || "انتظر! لا تفوت هذا العرض الخاص 🎁"}
            </h3>
            <p className="text-xs opacity-80 leading-relaxed" style={{ color: "var(--color-text, #111827)" }}>
              {config.exitPopupText || "احصل على خصم إضافي خاص بك الآن قبل المغادرة!"}
            </p>
            <div className="border border-dashed p-3 rounded-2xl" style={{ background: "var(--color-bg)", borderColor: "var(--color-primary)" }}>
              <span className="text-[11px] opacity-70 block" style={{ color: "var(--color-text, #111827)" }}>كوبون خصم إضافي حصري:</span>
              <span className="text-xl font-black font-mono tracking-wider" style={{ color: "var(--color-primary)" }}>
                {config.exitCouponCode || "SPECIAL10"} (خصم {config.exitCouponDiscountPercent || 10}%)
              </span>
            </div>
            <button
              onClick={handleApplyExitCoupon}
              className="w-full text-white font-black py-3 rounded-xl text-sm transition shadow-lg"
              style={{ background: "#059669" }}
            >
              تفعيل الخصم الآن وإتمام الطلب ⚡
            </button>
            <button
              onClick={() => setShowExitModal(false)}
              className="text-[11px] opacity-50 hover:opacity-100 block mx-auto underline"
              style={{ color: "var(--color-text, #111827)" }}
            >
              شكراً، لا أريد هذا الخصم
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
