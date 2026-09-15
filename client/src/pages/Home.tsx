import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Globe2,
  Instagram,
  Menu,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";

type Lang = "ar" | "en";

type Copy = {
  brand: string;
  nav: { story: string; features: string; reviews: string; faq: string };
  language: string;
  announcement: string;
  timer: string;
  timerButton: string;
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  heroCta: string;
  heroSecondary: string;
  priceLabel: string;
  oldPrice: string;
  price: string;
  shipping: string;
  trust: { title: string; text: string }[];
  editorial: { eyebrow: string; title: string; body: string; cta: string };
  steps: { number: string; title: string; text: string }[];
  galleryTitle: string;
  galleryBody: string;
  featuresEyebrow: string;
  featuresTitle: string;
  features: { title: string; text: string }[];
  socialEyebrow: string;
  socialTitle: string;
  socialBody: string;
  bundlesTitle: string;
  bundlesBody: string;
  perPiece: string;
  mostPopular: string;
  bundleNames: string[];
  bundleNotes: string[];
  reviewsEyebrow: string;
  reviewsTitle: string;
  reviews: { quote: string; name: string; detail: string }[];
  faqEyebrow: string;
  faqTitle: string;
  faqs: { q: string; a: string }[];
  guaranteeTitle: string;
  guaranteeBody: string;
  formEyebrow: string;
  formTitle: string;
  formBody: string;
  form: { name: string; phone: string; city: string; address: string; note: string; submit: string };
  required: string;
  summary: string;
  subtotal: string;
  shippingFee: string;
  total: string;
  free: string;
  successTitle: string;
  successBody: string;
  whatsapp: string;
  footer: string;
  rights: string;
};

const copy: Record<Lang, Copy> = {
  ar: {
    brand: "LUMA / 01",
    nav: { story: "القصة", features: "التفاصيل", reviews: "الآراء", faq: "الأسئلة" },
    language: "English",
    announcement: "شحن مجاني لأول 100 طلب · ضمان استرجاع لمدة 30 يومًا",
    timer: "ينتهي العرض خلال",
    timerButton: "اطلب الآن",
    heroEyebrow: "طقس يومي، بصياغة أجمل",
    heroTitle: "الشيء الصغير الذي يغيّر مزاج يومك.",
    heroBody: "LUMA قطعة مكتبية هادئة تجمع بين الضوء الدافئ، التصميم النظيف، وإحساس الرفاهية الذي تستحقه مساحتك.",
    heroCta: "امتلك LUMA الآن",
    heroSecondary: "اكتشف القصة",
    priceLabel: "سعر الإطلاق",
    oldPrice: "49.00 د.أ",
    price: "32.00 د.أ",
    shipping: "يشمل الشحن والتغليف الفاخر",
    trust: [
      { title: "صُنع بعناية", text: "مواد مختارة بعمر طويل" },
      { title: "ضوء مريح", text: "ثلاث درجات تناسب مزاجك" },
      { title: "وصول سريع", text: "بين 2–4 أيام عمل" },
    ],
    editorial: {
      eyebrow: "لماذا LUMA؟",
      title: "فكرة بسيطة. أثر واضح.",
      body: "لم نصمم LUMA لتكون قطعة أخرى على مكتبك، بل لتمنحك لحظة هدوء صغيرة كلما احتجت إليها. قاعدة من الألمنيوم المصقول، إضاءة قابلة للتعديل، وحضور يترك المكان أجمل.",
      cta: "شاهد التفاصيل",
    },
    steps: [
      { number: "01", title: "المشكلة", text: "إضاءة قاسية، وفوضى بصرية، ومساحة لا تشبهك." },
      { number: "02", title: "الفكرة", text: "مصباح واحد يوازن بين الوظيفة والإحساس." },
      { number: "03", title: "الطقس", text: "اضغط. تنفّس. واترك الضوء يقوم بالباقي." },
    ],
    galleryTitle: "صُممت لتُرى من كل زاوية.",
    galleryBody: "الخطوط المنحنية، الملمس الناعم، والتفاصيل التي لا تظهر إلا عند الاقتراب.",
    featuresEyebrow: "التفاصيل التي تهم",
    featuresTitle: "كل شيء في مكانه الصحيح.",
    features: [
      { title: "إضاءة تتنفس", text: "تدرّج دافئ من ضوء القراءة إلى ضوء المساء الهادئ." },
      { title: "لمسة واحدة", text: "تحكم سلس باللمس، بلا أزرار مزعجة أو قوائم معقدة." },
      { title: "مصممة لتدوم", text: "ألمنيوم متين وتشطيب مطفي يحتفظ بجماله يومًا بعد يوم." },
      { title: "تعمل بهدوء", text: "تقنية موفرة للطاقة وحرارة منخفضة لتبقى المساحة مريحة." },
    ],
    socialEyebrow: "اختيار مجتمع LUMA",
    socialTitle: "أكثر من 2,400 مساحة أصبحت أهدأ.",
    socialBody: "انضم إلى أشخاص اختاروا تفاصيل أقل، وحضورًا أكثر.",
    bundlesTitle: "اختر طقسك.",
    bundlesBody: "كل طلب يصل في صندوق أنيق، جاهز للإهداء أو لبداية جديدة.",
    perPiece: "للقطعة",
    mostPopular: "الأكثر اختيارًا",
    bundleNames: ["قطعة واحدة", "قطعتان", "ثلاث قطع"],
    bundleNotes: ["لك ولمكتبك", "واحدة لك، وواحدة لمن تحب", "للمكتب، غرفة النوم، والهدية"],
    reviewsEyebrow: "كلماتهم بعد LUMA",
    reviewsTitle: "الجمال الذي يترك أثرًا.",
    reviews: [
      { quote: "أخيرًا وجدت إضاءة لا تحاول لفت الانتباه، لكنها تجعل كل شيء حولها يبدو أجمل.", name: "ليان م.", detail: "عميلة منذ 2024" },
      { quote: "التفاصيل فاخرة فعلًا. أستخدمها كل ليلة مع كتابي، وأحب أن الضوء لا يرهق العين.", name: "عمر س.", detail: "عميل موثّق" },
      { quote: "وصلت بسرعة وتغليفها كان تجربة بحد ذاته. أهدتني أختي LUMA وأصبحت قطعتنا المفضلة.", name: "نور ع.", detail: "عميلة موثّقة" },
    ],
    faqEyebrow: "قبل أن تطلب",
    faqTitle: "أسئلة بسيطة، إجابات واضحة.",
    faqs: [
      { q: "هل يمكن تغيير درجة الإضاءة؟", a: "نعم، يمنحك سطح اللمس ثلاث درجات إضاءة دافئة، من ضوء القراءة إلى الإضاءة الهادئة." },
      { q: "كم يستغرق التوصيل؟", a: "تصل الطلبات عادة خلال 2 إلى 4 أيام عمل داخل المدن الرئيسية، مع تحديثات على حالة الشحنة." },
      { q: "هل يوجد ضمان؟", a: "نعم، يشمل كل طلب ضمانًا لمدة عام، ويمكنك الاسترجاع خلال 30 يومًا إذا لم تناسبك القطعة." },
      { q: "هل أستطيع إهداء الطلب مباشرة؟", a: "بالتأكيد. كل طلب يأتي في تغليف LUMA الفاخر، ويمكنك إضافة ملاحظة قصيرة في خانة الملاحظات." },
    ],
    guaranteeTitle: "تجربة بلا قلق.",
    guaranteeBody: "جرّب LUMA لمدة 30 يومًا. إن لم تشعر أنها أضافت شيئًا لمساحتك، أعدها إلينا وسنعتني بالباقي.",
    formEyebrow: "خطوتك التالية",
    formTitle: "اجعل مساحتك تشبهك أكثر.",
    formBody: "اترك بياناتك وسيتواصل معك فريقنا لتأكيد الطلب وتفاصيل التوصيل.",
    form: { name: "الاسم الكامل", phone: "رقم الهاتف", city: "المدينة", address: "العنوان بالتفصيل", note: "ملاحظات إضافية (اختياري)", submit: "تأكيد الطلب" },
    required: "مطلوب",
    summary: "ملخص الطلب",
    subtotal: "المجموع الفرعي",
    shippingFee: "الشحن",
    total: "الإجمالي",
    free: "مجاني",
    successTitle: "وصلنا طلبك.",
    successBody: "شكرًا لثقتك بـ LUMA. سيتواصل معك فريقنا قريبًا لتأكيد التفاصيل.",
    whatsapp: "تواصل عبر واتساب",
    footer: "ضوء أجمل، يوم أهدأ.",
    rights: "© 2025 LUMA Studio. جميع الحقوق محفوظة.",
  },
  en: {
    brand: "LUMA / 01",
    nav: { story: "Story", features: "Details", reviews: "Reviews", faq: "FAQ" },
    language: "العربية",
    announcement: "Free shipping for the first 100 orders · 30-day returns",
    timer: "Offer ends in",
    timerButton: "Order now",
    heroEyebrow: "A daily ritual, made better",
    heroTitle: "The little thing that changes the mood of your day.",
    heroBody: "LUMA is a quiet desk object that brings together warm light, clean design, and the kind of luxury your space deserves.",
    heroCta: "Own LUMA now",
    heroSecondary: "Discover the story",
    priceLabel: "Launch price",
    oldPrice: "$49.00",
    price: "$32.00",
    shipping: "Shipping & premium packaging included",
    trust: [
      { title: "Made with care", text: "Thoughtful materials, built to last" },
      { title: "Gentle light", text: "Three moods for your space" },
      { title: "Fast arrival", text: "Delivered in 2–4 business days" },
    ],
    editorial: {
      eyebrow: "Why LUMA?",
      title: "A simple idea. A clear effect.",
      body: "We didn't design LUMA to be another object on your desk. We designed it to give you a small moment of calm whenever you need it. Brushed aluminum, adjustable warmth, and a presence that leaves the room better.",
      cta: "See the details",
    },
    steps: [
      { number: "01", title: "The problem", text: "Harsh light, visual noise, and a space that feels unlike you." },
      { number: "02", title: "The idea", text: "One lamp that balances function with feeling." },
      { number: "03", title: "The ritual", text: "Tap. Breathe. Let the light do the rest." },
    ],
    galleryTitle: "Designed to be seen from every angle.",
    galleryBody: "Curved lines, a soft touch, and details you only notice up close.",
    featuresEyebrow: "The details that matter",
    featuresTitle: "Everything in its right place.",
    features: [
      { title: "Light that breathes", text: "A warm range from focused reading light to a quiet evening glow." },
      { title: "One touch", text: "Smooth touch control, without noisy buttons or complicated menus." },
      { title: "Built to last", text: "Durable aluminum and a matte finish that stays beautiful." },
      { title: "Quiet by design", text: "Energy-efficient technology with low heat for a comfortable space." },
    ],
    socialEyebrow: "The LUMA community",
    socialTitle: "More than 2,400 spaces feel calmer now.",
    socialBody: "Join people choosing fewer details, with more presence.",
    bundlesTitle: "Choose your ritual.",
    bundlesBody: "Every order arrives in a considered box, ready to gift or begin again.",
    perPiece: "per piece",
    mostPopular: "Most chosen",
    bundleNames: ["One piece", "Two pieces", "Three pieces"],
    bundleNotes: ["For your desk", "One for you, one to share", "Desk, bedroom, and a gift"],
    reviewsEyebrow: "Their words after LUMA",
    reviewsTitle: "Beauty that leaves a mark.",
    reviews: [
      { quote: "Finally, a light that doesn't ask for attention, but makes everything around it look better.", name: "Lian M.", detail: "Customer since 2024" },
      { quote: "The details really feel premium. I use it every night with a book, and it never tires my eyes.", name: "Omar S.", detail: "Verified customer" },
      { quote: "Fast delivery and the packaging was an experience on its own. It became our favorite piece.", name: "Nour A.", detail: "Verified customer" },
    ],
    faqEyebrow: "Before you order",
    faqTitle: "Simple questions, clear answers.",
    faqs: [
      { q: "Can I change the light temperature?", a: "Yes. The touch surface gives you three warm light settings, from reading light to a quiet glow." },
      { q: "How long does delivery take?", a: "Orders typically arrive within 2–4 business days in major cities, with shipping updates along the way." },
      { q: "Is there a warranty?", a: "Yes. Every order includes a one-year warranty and a 30-day return window." },
      { q: "Can I send it as a gift?", a: "Absolutely. Every order arrives in LUMA's premium packaging, and you can add a short note at checkout." },
    ],
    guaranteeTitle: "A worry-free experience.",
    guaranteeBody: "Try LUMA for 30 days. If it doesn't add something to your space, send it back and we'll take care of the rest.",
    formEyebrow: "Your next step",
    formTitle: "Make your space feel more like you.",
    formBody: "Leave your details and our team will reach out to confirm your order and delivery.",
    form: { name: "Full name", phone: "Phone number", city: "City", address: "Full address", note: "Additional note (optional)", submit: "Confirm order" },
    required: "Required",
    summary: "Order summary",
    subtotal: "Subtotal",
    shippingFee: "Shipping",
    total: "Total",
    free: "Free",
    successTitle: "Your order is in.",
    successBody: "Thank you for choosing LUMA. Our team will reach out shortly to confirm the details.",
    whatsapp: "Chat on WhatsApp",
    footer: "Better light, quieter days.",
    rights: "© 2025 LUMA Studio. All rights reserved.",
  },
};

const gallery = [
  "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=85",
];

const featureIcons = [Sparkles, Clock3, ShieldCheck, Globe2];

export default function Home() {
  const [language, setLanguage] = useState<Lang>("ar");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [hours, setHours] = useState(11);
  const [minutes, setMinutes] = useState(42);
  const [seconds, setSeconds] = useState(18);

  const t = copy[language];
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const bundleQty = selectedBundle + 1;
  const unitPrice = 32;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    const timer = window.setInterval(() => {
      setSeconds((current) => {
        if (current > 0) return current - 1;
        setMinutes((currentMinutes) => {
          if (currentMinutes > 0) return currentMinutes - 1;
          setHours((currentHours) => (currentHours > 0 ? currentHours - 1 : 11));
          return 59;
        });
        return 59;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [direction, language]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const format = (value: number) => String(value).padStart(2, "0");

  const submitOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOrderError("");
    const form = new FormData(event.currentTarget);
    const subtotalCents = unitPrice * bundleQty * quantity * 100;
    const discountCode = String(form.get("discountCode") || "");
    try {
      let discountCents = 0;
      if (discountCode) { const discountResponse = await fetch("/api/discounts/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: discountCode, subtotalCents }) }); const discount = await discountResponse.json() as { valid?: boolean; amountCents?: number }; if (!discount.valid) throw new Error(isArabic ? "كود الخصم غير صالح" : "Discount code is not valid"); discountCents = Number(discount.amountCents ?? 0); }
      const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName: form.get("fullName"), phone: form.get("phone"), phoneExtra: form.get("phoneExtra"), country: form.get("country"), city: form.get("city"), address: form.get("address"), landmark: form.get("landmark"), addressType: form.get("addressType"), floor: form.get("floor"), apartment: form.get("apartment"), deliveryNote: form.get("deliveryNote"), discountCode, quantity: quantity * bundleQty, bundleId: selectedBundle + 1, subtotalCents: subtotalCents - discountCents, shippingCents: 0, totalCents: subtotalCents - discountCents, currency: "USD" }) });
      if (!response.ok) { const failure = await response.json() as { error?: string }; throw new Error(failure.error || "Order failed"); }
      const result = await response.json() as { whatsapp?: string };
      setWhatsappUrl(result.whatsapp || "");
      setSubmitted(true);
    } catch (error) { setOrderError(error instanceof Error ? error.message : (isArabic ? "تعذر إرسال الطلب" : "Unable to submit order")); }
  };

  return (
    <main className="site-shell" dir={direction}>
      <div className="announcement"><span>{t.announcement}</span><button onClick={() => scrollTo("checkout")}>{t.timerButton} <ArrowLeft size={14} /></button></div>
      <section className="timer-bar">
        <div className="container timer-inner">
          <div className="timer-copy"><span className="live-dot" />{t.timer}</div>
          <div className="countdown" aria-label={t.timer}>
            <span>{format(hours)}</span><b>:</b><span>{format(minutes)}</span><b>:</b><span>{format(seconds)}</span>
          </div>
          <button className="timer-link" onClick={() => scrollTo("checkout")}>{t.timerButton}<ArrowLeft size={15} /></button>
        </div>
      </section>

      <header className="site-header container">
        <a className="brand" href="#top" aria-label="LUMA home"><span className="brand-mark">L</span><span>{t.brand}</span></a>
        <nav className={menuOpen ? "main-nav open" : "main-nav"}>
          <button onClick={() => scrollTo("story")}>{t.nav.story}</button>
          <button onClick={() => scrollTo("features")}>{t.nav.features}</button>
          <button onClick={() => scrollTo("reviews")}>{t.nav.reviews}</button>
          <button onClick={() => scrollTo("faq")}>{t.nav.faq}</button>
        </nav>
        <div className="header-actions">
          <button className="language-switch" onClick={() => setLanguage(isArabic ? "en" : "ar")}><Globe2 size={16} />{t.language}</button>
          <button className="outline-button header-cta" onClick={() => scrollTo("checkout")}>{t.timerButton} <ArrowLeft size={15} /></button>
          <button className="menu-button" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </header>

      <section className="hero container" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" />{t.heroEyebrow}</div>
          <h1>{t.heroTitle}</h1>
          <p className="hero-body">{t.heroBody}</p>
          <div className="hero-actions">
            <button className="gold-button" onClick={() => scrollTo("checkout")}>{t.heroCta}<ArrowLeft size={17} /></button>
            <button className="text-button" onClick={() => scrollTo("story")}>{t.heroSecondary}<ArrowLeft size={17} /></button>
          </div>
          <div className="price-line"><div><small>{t.priceLabel}</small><div><strong>{t.price}</strong><del>{t.oldPrice}</del></div></div><span className="price-shipping">{t.shipping}</span></div>
        </div>
        <div className="hero-art">
          <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
          <div className="hero-image-card"><img src={gallery[0]} alt="LUMA lamp in a warm interior" /><div className="image-caption"><span>01 / 03</span><span>LUMA object study</span></div></div>
          <div className="floating-note"><span className="note-icon"><Sparkles size={14} /></span><span><b>{isArabic ? "إضاءة دافئة" : "Warm glow"}</b><small>{isArabic ? "مصممة لتهدأ" : "Designed to soften"}</small></span></div>
        </div>
      </section>

      <section className="trust-strip"><div className="container trust-grid">{t.trust.map((item, index) => <div className="trust-item" key={item.title}><span className="trust-number">0{index + 1}</span><div><b>{item.title}</b><span>{item.text}</span></div></div>)}</div></section>

      <section className="story-section container" id="story">
        <div className="section-label">{t.editorial.eyebrow}</div>
        <div className="story-layout"><div><h2>{t.editorial.title}</h2><p>{t.editorial.body}</p><button className="text-button" onClick={() => scrollTo("gallery")}>{t.editorial.cta}<ArrowLeft size={17} /></button></div><div className="step-list">{t.steps.map((step) => <div className="step" key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></div>)}</div></div>
      </section>

      <section className="gallery-section container" id="gallery"><div className="gallery-heading"><div><div className="section-label">LUMA / VISUALS</div><h2>{t.galleryTitle}</h2></div><p>{t.galleryBody}</p></div><div className="gallery-grid"><div className="gallery-main"><img src={gallery[1]} alt="LUMA on a minimalist desk" /><span>Everyday object / 02</span></div><div className="gallery-side"><img src={gallery[2]} alt="Warm lamp detail" /><span>Soft geometry / 03</span></div></div></section>

      <section className="features-section" id="features"><div className="container"><div className="features-heading"><div><div className="section-label">{t.featuresEyebrow}</div><h2>{t.featuresTitle}</h2></div><p>01—04<br />{isArabic ? "تفاصيل صنعت لتُعاش." : "Details made to be lived with."}</p></div><div className="feature-grid">{t.features.map((feature, index) => { const Icon = featureIcons[index]; return <article className="feature-card" key={feature.title}><div className="feature-top"><span>0{index + 1}</span><Icon size={23} strokeWidth={1.5} /></div><h3>{feature.title}</h3><p>{feature.text}</p></article>; })}</div></div></section>

      <section className="social-proof"><div className="container social-proof-inner"><div className="social-copy"><div className="section-label">{t.socialEyebrow}</div><h2>{t.socialTitle}</h2><p>{t.socialBody}</p></div><div className="social-stat"><strong>2,400<span>+</span></strong><div className="avatar-row"><span>LM</span><span>OS</span><span>NA</span><span>+2k</span></div><div className="stars">★★★★★ <small>4.9 / 5</small></div></div></div></section>

      <section className="bundles-section container" id="checkout"><div className="bundles-heading"><div><div className="section-label">LUMA / EDITION</div><h2>{t.bundlesTitle}</h2></div><p>{t.bundlesBody}</p></div><div className="bundle-grid">{t.bundleNames.map((name, index) => <button className={selectedBundle === index ? "bundle-card selected" : "bundle-card"} key={name} onClick={() => { setSelectedBundle(index); setQuantity(1); }}><div className="bundle-top"><span>{index === 1 && <span className="popular-tag">{t.mostPopular}</span>}</span><span className="radio-dot">{selectedBundle === index && <span />}</span></div><div className="bundle-visual"><span>{index + 1}</span><div className="mini-lamp" /></div><h3>{name}</h3><p>{t.bundleNotes[index]}</p><div className="bundle-price"><strong>{index === 0 ? "$32" : index === 1 ? "$58" : "$81"}</strong><span>{t.perPiece}</span></div>{index > 0 && <small className="saving">{isArabic ? `وفّر ${index === 1 ? "6" : "15"} د.أ` : `Save ${index === 1 ? "$6" : "$15"}`}</small>}</button>)}</div>
        <div className="checkout-layout"><form className="checkout-form" onSubmit={submitOrder}><div className="form-heading"><div className="section-label">{t.formEyebrow}</div><h2>{t.formTitle}</h2><p>{t.formBody}</p></div>{submitted ? <div className="success-message"><div className="success-icon"><Check size={25} /></div><h3>{t.successTitle}</h3><p>{t.successBody}</p><a href={whatsappUrl || "#"} target="_blank" rel="noreferrer" className="gold-button"><MessageCircle size={17} />{t.whatsapp}</a></div> : <><div className="form-grid"><label>{t.form.name}<span>*</span><input name="fullName" required placeholder={t.form.name} /></label><label>{t.form.phone}<span>*</span><input name="phone" required type="tel" placeholder={t.form.phone} /></label><label>{t.form.city}<span>*</span><select name="city" required defaultValue=""><option value="" disabled>{t.form.city}</option><option>{isArabic ? "عمّان" : "Amman"}</option><option>{isArabic ? "دبي" : "Dubai"}</option><option>{isArabic ? "الرياض" : "Riyadh"}</option></select></label><label>{t.form.address}<span>*</span><input name="address" required placeholder={t.form.address} /></label></div><div className="form-grid extra-fields"><label>{isArabic ? "هاتف إضافي (اختياري)" : "Additional phone (optional)"}<input name="phoneExtra" type="tel" placeholder="+962..." /></label><label>{isArabic ? "الدولة" : "Country"}<select name="country" required defaultValue=""><option value="" disabled>{isArabic ? "اختر الدولة" : "Select country"}</option><option>{isArabic ? "الأردن" : "Jordan"}</option><option>{isArabic ? "السعودية" : "Saudi Arabia"}</option><option>{isArabic ? "الإمارات" : "United Arab Emirates"}</option><option>{isArabic ? "مصر" : "Egypt"}</option><option>{isArabic ? "ليبيا" : "Libya"}</option></select></label><label>{isArabic ? "العلامة المميزة (اختياري)" : "Landmark (optional)"}<input name="landmark" placeholder={isArabic ? "بالقرب من..." : "Near..."} /></label><label>{isArabic ? "نوع العنوان" : "Address type"}<select name="addressType" defaultValue="home"><option value="home">{isArabic ? "منزل" : "Home"}</option><option value="work">{isArabic ? "عمل" : "Work"}</option></select></label><label>{isArabic ? "الطابق (اختياري)" : "Floor (optional)"}<input name="floor" placeholder="3" /></label><label>{isArabic ? "رقم الشقة (اختياري)" : "Apartment (optional)"}<input name="apartment" placeholder="12" /></label></div><label className="full-field">{t.form.note}<textarea name="deliveryNote" rows={3} placeholder={t.form.note} /></label><label className="full-field">{isArabic ? "كود الخصم (اختياري)" : "Discount code (optional)"}<input name="discountCode" placeholder="LUMA10" /></label><button className="gold-button submit-button" type="submit">{t.form.submit}<ArrowLeft size={17} /></button>{orderError && <p className="form-error">{orderError}</p>}<p className="form-safe"><ShieldCheck size={15} />{isArabic ? "بياناتك محمية ولن نشاركها مع أي طرف." : "Your data is private and never shared."}</p></>}</form><aside className="order-summary"><div className="summary-heading"><span>{t.summary}</span><Sparkles size={17} /></div><div className="summary-product"><img src={gallery[0]} alt="LUMA product" /><div><b>LUMA / 01</b><span>{t.bundleNames[selectedBundle]}</span></div><div className="quantity"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={13} /></button><span>{quantity}</span><button type="button" onClick={() => setQuantity(quantity + 1)}><Plus size={13} /></button></div></div><div className="summary-lines"><div><span>{t.subtotal}</span><b>${unitPrice * bundleQty * quantity}.00</b></div><div><span>{t.shippingFee}</span><b className="green-text">{t.free}</b></div></div><div className="total-line"><span>{t.total}</span><strong>${unitPrice * bundleQty * quantity}.00</strong></div><div className="summary-note"><Check size={14} />{isArabic ? "تغليف فاخر وشحن مجاني" : "Premium packaging & free shipping"}</div></aside></div>
      </section>

      <section className="reviews-section" id="reviews"><div className="container"><div className="reviews-heading"><div className="section-label">{t.reviewsEyebrow}</div><h2>{t.reviewsTitle}</h2><div className="stars large">★★★★★ <small>4.9 / 5</small></div></div><div className="reviews-grid">{t.reviews.map((review) => <article className="review-card" key={review.name}><div className="stars">★★★★★</div><p>“{review.quote}”</p><div className="review-author"><span>{review.name.slice(0, 2).toUpperCase()}</span><div><b>{review.name}</b><small>{review.detail}</small></div></div></article>)}</div></div></section>

      <section className="faq-section container" id="faq"><div className="faq-heading"><div className="section-label">{t.faqEyebrow}</div><h2>{t.faqTitle}</h2></div><div className="faq-list">{t.faqs.map((faq, index) => <div className={openFaq === index ? "faq-item open" : "faq-item"} key={faq.q}><button onClick={() => setOpenFaq(openFaq === index ? null : index)}><span><em>0{index + 1}</em>{faq.q}</span><ChevronDown size={18} /></button><div className="faq-answer"><p>{faq.a}</p></div></div>)}</div></section>

      <section className="guarantee-section"><div className="container guarantee-inner"><div className="guarantee-seal"><ShieldCheck size={29} /><span>30<br /><small>days</small></span></div><div><div className="section-label">LUMA PROMISE</div><h2>{t.guaranteeTitle}</h2><p>{t.guaranteeBody}</p></div><button className="outline-button" onClick={() => scrollTo("checkout")}>{t.timerButton}<ArrowLeft size={16} /></button></div></section>

      <footer className="site-footer"><div className="container footer-top"><div><a className="brand" href="#top"><span className="brand-mark">L</span><span>{t.brand}</span></a><p>{t.footer}</p></div><div className="footer-links"><a href="#story">{t.nav.story}</a><a href="#features">{t.nav.features}</a><a href="#reviews">{t.nav.reviews}</a><a href="#faq">{t.nav.faq}</a></div><div className="social-links"><a href="#top" aria-label="Instagram"><Instagram size={18} /></a><a href="#top" aria-label="WhatsApp"><MessageCircle size={18} /></a></div></div><div className="container footer-bottom"><span>{t.rights}</span><span>{isArabic ? "صُمم بهدوء" : "Designed quietly"}</span></div></footer>
    </main>
  );
}
