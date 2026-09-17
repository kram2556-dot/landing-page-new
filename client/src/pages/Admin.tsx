import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  ShoppingBag, 
  Settings, 
  Palette, 
  Image as ImageIcon, 
  MessageSquare, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2,
  AlertCircle,
  BarChart3
} from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Master Store Settings State
  const [settings, setSettings] = useState({
    adminEmail: 'admin@example.com',
    adminPassword: 'admin',
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

  // Load Settings from KV endpoint
  useEffect(() => {
    fetch('/api/store')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      })
      .catch(err => console.error('Error loading settings from Cloudflare KV:', err));

    const authSession = sessionStorage.getItem('admin_authenticated');
    if (authSession === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === settings.adminEmail && loginPassword === settings.adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setLoginError('');
    } else {
      setLoginError('بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const response = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus('error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-['Cairo']" dir="rtl">
        <Card className="w-full max-w-md shadow-xl border-slate-200">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <Lock className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold">تسجيل الدخول للوحة التحكم</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">أدخل بيانات المدير لإدارة المتجر والإعدادات</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input 
                  type="email" 
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>كلمة المرور</Label>
                <Input 
                  type="password" 
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full text-base font-bold py-5">
                دخول اللوحة
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Cairo'] pb-20" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-2 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">لوحة تحكم المتجر</h1>
              <p className="text-xs text-muted-foreground">متصل سحابياً بـ Cloudflare KV</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleSave} 
              disabled={saveStatus === 'saving'}
              className="font-bold flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {saveStatus === 'saving' ? (
                <span>جاري الحفظ...</span>
              ) : saveStatus === 'saved' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تم الحفظ السحابي!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>حفظ التعديلات</span>
                </>
              )}
            </Button>
            <Button variant="outline" size="icon" onClick={handleLogout} title="تسجيل الخروج">
              <LogOut className="w-4 h-4 text-slate-600" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Tabs */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <Tabs defaultValue="product" className="space-y-6">
          <TabsList className="bg-white p-1 border border-slate-200 rounded-xl grid grid-cols-2 md:grid-cols-6 gap-1 h-auto">
            <TabsTrigger value="product" className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold py-2.5">
              <ShoppingBag className="w-4 h-4 ml-2 inline-block" /> المنتج والسعر
            </TabsTrigger>
            <TabsTrigger value="design" className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold py-2.5">
              <Palette className="w-4 h-4 ml-2 inline-block" /> الثيم والتصميم
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold py-2.5">
              <ImageIcon className="w-4 h-4 ml-2 inline-block" /> معرض الصور
            </TabsTrigger>
            <TabsTrigger value="pixels" className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold py-2.5">
              <BarChart3 className="w-4 h-4 ml-2 inline-block" /> بكسلات التتبع
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold py-2.5">
              <MessageSquare className="w-4 h-4 ml-2 inline-block" /> التقييمات والضمانات
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold py-2.5">
              <ShieldCheck className="w-4 h-4 ml-2 inline-block" /> الأمان والمدير
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Product & Pricing */}
          <TabsContent value="product" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>بيانات المنتج الأساسية والأسعار</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>اسم المتجر</Label>
                    <Input value={settings.storeName} onChange={e => setSettings({...settings, storeName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>اسم المنتج الرئيسي</Label>
                    <Input value={settings.productName} onChange={e => setSettings({...settings, productName: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>الوصف الترويجي المختصر</Label>
                  <Textarea value={settings.productSubtitle} onChange={e => setSettings({...settings, productSubtitle: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>السعر بعد الخصم (سعر البيع)</Label>
                    <Input value={settings.salePrice} onChange={e => setSettings({...settings, salePrice: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>السعر قبل الخصم (المشطوب)</Label>
                    <Input value={settings.originalPrice} onChange={e => setSettings({...settings, originalPrice: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>العملة</Label>
                    <Input value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Theme & Design */}
          <TabsContent value="design" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>نمط المتجر والألوان</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>اختر هوية وثيم المتجر</Label>
                  <select 
                    className="w-full h-10 px-3 border border-slate-200 rounded-md bg-white"
                    value={settings.theme}
                    onChange={e => setSettings({...settings, theme: e.target.value})}
                  >
                    <option value="sneakers">أحذية وسنيكرز (Sneakers)</option>
                    <option value="perfume">عطور وبخور (Perfume)</option>
                    <option value="fashion">أزياء وملابس (Fashion)</option>
                    <option value="medical">منتجات طبية وصحية (Medical)</option>
                    <option value="home">منزل وديكور (Home)</option>
                    <option value="kids">أطفال وألعاب (Kids)</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Gallery */}
          <TabsContent value="gallery" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>روابط صور المعرض</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {settings.galleryImages.map((img, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input 
                      value={img} 
                      onChange={e => {
                        const newImgs = [...settings.galleryImages];
                        newImgs[idx] = e.target.value;
                        setSettings({...settings, galleryImages: newImgs});
                      }} 
                    />
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => {
                        const newImgs = settings.galleryImages.filter((_, i) => i !== idx);
                        setSettings({...settings, galleryImages: newImgs});
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={() => setSettings({...settings, galleryImages: [...settings.galleryImages, '']})}
                  className="w-full flex gap-2 items-center"
                >
                  <Plus className="w-4 h-4" /> إضافة رابط صورة جديد
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Marketing Pixels */}
          <TabsContent value="pixels" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>بكسلات التتبع الإعلاني (Meta, TikTok, Google)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Meta Pixel ID (Facebook)</Label>
                  <Input 
                    placeholder="مثال: 123456789012345" 
                    value={settings.metaPixelId} 
                    onChange={e => setSettings({...settings, metaPixelId: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>TikTok Pixel ID</Label>
                  <Input 
                    placeholder="مثال: C1234567890ABCDEF" 
                    value={settings.tiktokPixelId} 
                    onChange={e => setSettings({...settings, tiktokPixelId: e.target.value})} 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Google Ads Conversion ID</Label>
                    <Input 
                      placeholder="AW-123456789" 
                      value={settings.googleAdsId} 
                      onChange={e => setSettings({...settings, googleAdsId: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Google Conversion Label</Label>
                    <Input 
                      placeholder="AbCdEfGhIjK" 
                      value={settings.googleEventLabel} 
                      onChange={e => setSettings({...settings, googleEventLabel: e.target.value})} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 5: Reviews & Guarantees */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>شهادات العملاء والتقييمات</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {settings.reviews.map((rev, idx) => (
                  <div key={idx} className="p-4 border rounded-lg space-y-2 relative bg-slate-50">
                    <div className="flex justify-between items-center">
                      <Input 
                        placeholder="اسم العميل" 
                        value={rev.name} 
                        onChange={e => {
                          const newRevs = [...settings.reviews];
                          newRevs[idx].name = e.target.value;
                          setSettings({...settings, reviews: newRevs});
                        }} 
                        className="w-1/2 bg-white"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500"
                        onClick={() => {
                          const newRevs = settings.reviews.filter((_, i) => i !== idx);
                          setSettings({...settings, reviews: newRevs});
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea 
                      placeholder="تعليق العميل" 
                      value={rev.comment} 
                      onChange={e => {
                        const newRevs = [...settings.reviews];
                        newRevs[idx].comment = e.target.value;
                        setSettings({...settings, reviews: newRevs});
                      }} 
                      className="bg-white"
                    />
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={() => setSettings({...settings, reviews: [...settings.reviews, { name: '', rating: 5, comment: '' }]})}
                  className="w-full flex gap-2 items-center"
                >
                  <Plus className="w-4 h-4" /> إضافة تقييم جديد
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 6: Security & Credentials */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>بيانات حساب مدير المتجر</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>البريد الإلكتروني لتسجيل الدخول</Label>
                  <Input 
                    type="email" 
                    value={settings.adminEmail} 
                    onChange={e => setSettings({...settings, adminEmail: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>كلمة المرور الجديدة</Label>
                  <Input 
                    type="password" 
                    value={settings.adminPassword} 
                    onChange={e => setSettings({...settings, adminPassword: e.target.value})} 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
