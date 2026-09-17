import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Star, 
  ShoppingBag, 
  Phone, 
  MapPin, 
  User, 
  Clock, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function Home() {
  const [settings, setSettings] = useState({
    theme: 'sneakers',
    storeName: 'متجر النخبة',
    storeTagline: 'أفضل العروض الحصرية مع شحن مجاني وضمان استبدال',
    productName: 'حذاء أورا سنيكرز الرياضي العصري',
    productSubtitle: 'خفة لا مثيل لها وراحة تدوم طوال اليوم',
    originalPrice: '1200',
    salePrice: '750',
    currency: 'ج.م',
    metaPixelId: '',
    tiktokPixelId: '',
    googleAdsId: '',
    googleEventLabel: '',
    shippingFee: 'مجاني',
    phoneRequired: true,
    addressRequired: true,
    governorates: 'القاهرة, الجيزة, الإسكندرية, الشرقية, الدقهلية, القليوبية, المنوفية, الغربية, كفر الشيخ, البحيرة, الفيوم, بني سويف, المنيا, أسيوط, سوهاج, قنا, الأقصر, أسوان, البحر الأحمر, الوادي الجديد, مطروح, شمال سيناء, جنوب سيناء, السويس, الإسماعيلية, بورسعيد, دمياط',
    colors: [
      { name: 'أسود ملوكي', hex: '#000000' },
      { name: 'أبيض كلاسيك', hex: '#FFFFFF' },
      { name: 'رمادي عصري', hex: '#6B7280' }
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    heroBadges: [
      { text: 'شحن مجاني وسريع', icon: 'truck' },
      { text: 'الدفع عند الاستلام', icon: 'shield' },
      { text: 'معاينة المنتج قبل الدفع', icon: 'check' },
      { text: 'ضمان استرجاع 14 يوم', icon: 'rotate' }
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80'
    ],
    reviews: [
      { name: 'أحمد محمود', rating: 5, comment: 'جودة ممتازة جداً ومريحة في المشي والتوصيل سريع جداً.' },
      { name: 'سارة طارق', rating: 5, comment: 'نفس الصورة بالظبط والخامة نضيفة جداً شكراً ليكم.' },
      { name: 'محمد إبراهيم', rating: 4, comment: 'المنتج محترم ووصل في خلال يومين مع إمكانية المعاينة.' }
    ]
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('42');
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    governorate: '',
    address: '',
    notes: ''
  });

  // Load Settings from KV Cloud Endpoint
  useEffect(() => {
    fetch('/api/store')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      })
      .catch(err => console.error('Error fetching store settings:', err));
  }, []);

  // Tracking Pixels Integration
  useEffect(() => {
    if (settings.metaPixelId) {
      const script = document.createElement('script');
      script.innerHTML = `
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${settings.metaPixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    }
  }, [settings.metaPixelId]);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    // Track purchase event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        value: Number(settings.salePrice),
        currency: settings.currency === 'ج.م' ? 'EGP' : 'USD'
      });
    }

    setOrderSuccess(true);
  };

  const governorateList = settings.governorates.split(',').map(g => g.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Cairo'] pb-24 md:pb-12" dir="rtl">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white text-xs sm:text-sm py-2 px-4 text-center font-bold flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
        <span>{settings.storeTagline}</span>
      </div>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-8">
        {/* Product Headline */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            {settings.storeName}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            {settings.productName}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            {settings.productSubtitle}
          </p>
        </div>

        {/* Gallery */}
        <div className="space-y-3">
          <div className="aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm relative">
            <img 
              src={settings.galleryImages[selectedImage] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'} 
              alt={settings.productName} 
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute top-3 left-3 bg-red-600 text-white font-black px-3 py-1 rounded-full text-xs sm:text-sm shadow-md">
              خصم خاص اليوم
            </div>
          </div>

          {/* Thumbnails */}
          {settings.galleryImages.length > 1 && (
            <div className="flex gap-2 justify-center overflow-x-auto py-1">
              {settings.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                    selectedImage === idx ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-slate-200 opacity-70'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price & Value Cards */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-white to-white shadow-sm">
          <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-right">
              <span className="text-xs text-slate-500 font-semibold block mb-1">السعر الحصري شامل الشحن:</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-primary">{settings.salePrice} {settings.currency}</span>
                <span className="text-lg sm:text-xl line-through text-slate-400">{settings.originalPrice} {settings.currency}</span>
              </div>
            </div>
            <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-200 text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>شحن مجاني ومعاينة قبل الاستلام</span>
            </div>
          </CardContent>
        </Card>

        {/* Guarantee Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {settings.heroBadges.map((badge, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-3 text-center space-y-1 shadow-sm">
              <Check className="w-5 h-5 mx-auto text-emerald-600" />
              <p className="text-xs font-bold text-slate-800">{badge.text}</p>
            </div>
          ))}
        </div>

        {/* COD Checkout Form */}
        <Card className="border-2 border-primary/30 shadow-lg" id="order-form">
          <CardContent className="p-6 sm:p-8">
            {orderSuccess ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">تم تسجيل طلبك بنجاح!</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  شكراً لثقتك بنا يا {formData.name}. سيقوم فريق خدمة العملاء بالتواصل معك هاتفياً على الرقم ({formData.phone}) لتأكيد موعد الشحن.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitOrder} className="space-y-6">
                <div className="text-center pb-2 border-b border-slate-100">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">املأ بياناتك للشحن السريع</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">الدفع كاش عند الاستلام بعد فحص المنتج ومعاينته بنفسك</p>
                </div>

                {/* Color Selection */}
                {settings.colors.length > 0 && (
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-800">اختر اللون:</Label>
                    <div className="flex gap-3">
                      {settings.colors.map((color, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setSelectedColor(idx)}
                          className={`px-4 py-2 rounded-lg border text-sm font-bold flex items-center gap-2 transition-all ${
                            selectedColor === idx ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20' : 'border-slate-200 bg-white'
                          }`}
                        >
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-300" style={{ backgroundColor: color.hex }} />
                          <span>{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                {settings.sizes.length > 0 && (
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-800">اختر المقاس:</Label>
                    <div className="flex flex-wrap gap-2">
                      {settings.sizes.map((size, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setSelectedSize(size)}
                          className={`w-12 h-12 rounded-lg border text-sm font-bold transition-all ${
                            selectedSize === size ? 'border-primary bg-primary text-white shadow' : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inputs */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-bold flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-500" /> الاسم بالكامل
                    </Label>
                    <Input 
                      placeholder="اكتب اسمك الثلاثي" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500" /> رقم الهاتف المحمول (متاح به واتساب)
                    </Label>
                    <Input 
                      type="tel"
                      placeholder="01xxxxxxxxx" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" /> المحافظة
                    </Label>
                    <select 
                      className="w-full h-10 px-3 border border-slate-200 rounded-md bg-white text-sm"
                      value={formData.governorate}
                      onChange={e => setFormData({...formData, governorate: e.target.value})}
                      required
                    >
                      <option value="">اختر المحافظة</option>
                      {governorateList.map((gov, idx) => (
                        <option key={idx} value={gov}>{gov}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" /> العنوان بالتفصيل (المنطقة، الشارع، رقم العقار)
                    </Label>
                    <Input 
                      placeholder="مثال: مدينة نصر، شارع عباس العقاد، عمارة 15" 
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full py-6 text-lg font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg rounded-xl">
                  تأكيد الطلب الآن (الدفع عند الاستلام)
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Customer Reviews */}
        {settings.reviews.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-center">آراء وتقييمات العملاء</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {settings.reviews.map((rev, idx) => (
                <Card key={idx} className="bg-white border-slate-200">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{rev.name}</span>
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur border-t border-slate-200 z-50 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-500 block">السعر الإجمالي:</span>
          <span className="text-lg font-black text-primary">{settings.salePrice} {settings.currency}</span>
        </div>
        <Button 
          onClick={() => {
            const form = document.getElementById('order-form');
            form?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-5 rounded-xl shadow"
        >
          اطلب الآن
        </Button>
      </div>
    </div>
  );
}
