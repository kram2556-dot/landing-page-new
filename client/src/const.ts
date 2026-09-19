export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

// ----------------------------------------------------
// 1. قاموس الألوان العربي الذكي
// ----------------------------------------------------
export const ARABIC_COLOR_MAP: Record<string, string> = {
  "اسود": "#111111",
  "أسود": "#111111",
  "ابيض": "#FFFFFF",
  "أبيض": "#FFFFFF",
  "احمر": "#DC2626",
  "أحمر": "#DC2626",
  "ازرق": "#2563EB",
  "أزرق": "#2563EB",
  "كحلي": "#1E293B",
  "اخضر": "#16A34A",
  "أخضر": "#16A34A",
  "زيتوني": "#556B2F",
  "رمادي": "#64748B",
  "بني": "#78350F",
  "بيج": "#F5F5DC",
  "اصفر": "#EAB308",
  "أصفر": "#EAB308",
  "وردي": "#EC4899",
  "برتقالي": "#EA580C",
  "هافان": "#C19A6B"
};

// ----------------------------------------------------
// 2. تعريف الـ 10 ثيمات التخصصية
// ----------------------------------------------------
export interface StoreTheme {
  id: string;
  name: string;
  category: string;
  primary: string;
  primaryHover: string;
  background: string;
  cardBackground: string;
  text: string;
  textMuted: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  accent: string;
  radius: string;
}

export const STORE_THEMES: StoreTheme[] = [
  {
    id: "dark-onyx",
    name: "Dark Onyx",
    category: "أحذية وسنيكرز ورياضة",
    primary: "#F97316",
    primaryHover: "#EA580C",
    background: "#09090B",
    cardBackground: "#18181B",
    text: "#FFFFFF",
    textMuted: "#A1A1AA",
    border: "#27272A",
    badgeBg: "rgba(249, 115, 22, 0.15)",
    badgeText: "#FB923C",
    accent: "#F97316",
    radius: "0.5rem"
  },
  {
    id: "royal-oud",
    name: "Royal Oud",
    category: "عطور ملكية وساعات فاخرة",
    primary: "#D4AF37",
    primaryHover: "#C59B27",
    background: "#0C0A09",
    cardBackground: "#1C1917",
    text: "#F5F5F4",
    textMuted: "#A8A29E",
    border: "#292524",
    badgeBg: "rgba(212, 175, 55, 0.15)",
    badgeText: "#EAB308",
    accent: "#D4AF37",
    radius: "0.375rem"
  },
  {
    id: "clean-clinical",
    name: "Clean Clinical",
    category: "منتجات طبية وصحية",
    primary: "#059669",
    primaryHover: "#047857",
    background: "#F8FAFC",
    cardBackground: "#FFFFFF",
    text: "#0F172A",
    textMuted: "#64748B",
    border: "#E2E8F0",
    badgeBg: "rgba(5, 150, 105, 0.1)",
    badgeText: "#059669",
    accent: "#0D9488",
    radius: "0.5rem"
  },
  {
    id: "rose-glam",
    name: "Rose Glam",
    category: "مكياج وعناية وتجميل",
    primary: "#E11D48",
    primaryHover: "#BE123C",
    background: "#FFF1F2",
    cardBackground: "#FFFFFF",
    text: "#881337",
    textMuted: "#9F1239",
    border: "#FFE4E6",
    badgeBg: "rgba(225, 29, 72, 0.1)",
    badgeText: "#E11D48",
    accent: "#FB7185",
    radius: "1rem"
  },
  {
    id: "modern-tech",
    name: "Modern Tech",
    category: "إلكترونيات وإكسسوارات ذكية",
    primary: "#0284C7",
    primaryHover: "#0369A1",
    background: "#0B1120",
    cardBackground: "#1E293B",
    text: "#F8FAFC",
    textMuted: "#94A3B8",
    border: "#334155",
    badgeBg: "rgba(2, 132, 199, 0.2)",
    badgeText: "#38BDF8",
    accent: "#06B6D4",
    radius: "0.75rem"
  },
  {
    id: "urban-street",
    name: "Urban Street",
    category: "ملابس وأزياء كاجوال",
    primary: "#EAB308",
    primaryHover: "#CA8A04",
    background: "#18181B",
    cardBackground: "#27272A",
    text: "#FAFAFA",
    textMuted: "#A1A1AA",
    border: "#3F3F46",
    badgeBg: "rgba(234, 179, 8, 0.15)",
    badgeText: "#FACC15",
    accent: "#EAB308",
    radius: "0.25rem"
  },
  {
    id: "home-deco",
    name: "Home Deco",
    category: "أدوات منزلية ومطبخ",
    primary: "#EA580C",
    primaryHover: "#C2410C",
    background: "#FAFAF9",
    cardBackground: "#FFFFFF",
    text: "#292524",
    textMuted: "#78716C",
    border: "#E7E5E4",
    badgeBg: "rgba(234, 88, 12, 0.1)",
    badgeText: "#EA580C",
    accent: "#D97706",
    radius: "0.75rem"
  },
  {
    id: "kids-joy",
    name: "Kids & Joy",
    category: "ألعاب أطفال وهدايا",
    primary: "#8B5CF6",
    primaryHover: "#7C3AED",
    background: "#FAF5FF",
    cardBackground: "#FFFFFF",
    text: "#3B0764",
    textMuted: "#6B21A8",
    border: "#F3E8FF",
    badgeBg: "rgba(139, 92, 246, 0.15)",
    badgeText: "#8B5CF6",
    accent: "#F43F5E",
    radius: "1.25rem"
  },
  {
    id: "luxury-leather",
    name: "Luxury Leather",
    category: "جلود طبيعية ومحافظ",
    primary: "#B45309",
    primaryHover: "#92400E",
    background: "#1C1917",
    cardBackground: "#292524",
    text: "#FDE68A",
    textMuted: "#D6D3D1",
    border: "#44403C",
    badgeBg: "rgba(180, 83, 9, 0.2)",
    badgeText: "#F59E0B",
    accent: "#D97706",
    radius: "0.375rem"
  },
  {
    id: "pure-organic",
    name: "Pure Organic",
    category: "عسل ومنتجات طبيعية",
    primary: "#65A30D",
    primaryHover: "#4D7C0F",
    background: "#F7FEE7",
    cardBackground: "#FFFFFF",
    text: "#1A2E05",
    textMuted: "#4D7C0F",
    border: "#ECFCCB",
    badgeBg: "rgba(101, 163, 13, 0.15)",
    badgeText: "#65A30D",
    accent: "#84CC16",
    radius: "0.625rem"
  }
];

// ----------------------------------------------------
// 3. دوال فك المقاسات والألوان
// ----------------------------------------------------
export function parseColors(input: string) {
  if (!input || !input.trim()) return [];
  return input.split(/[,،]/).map((item) => {
    const name = item.trim();
    const hex = name.startsWith("#") ? name : (ARABIC_COLOR_MAP[name] || "#94A3B8");
    return { name, hex };
  }).filter((c) => c.name.length > 0);
}

export function parseSizes(input: string) {
  if (!input || !input.trim()) return [];
  return input.split(/[,،]/).map((s) => s.trim()).filter(Boolean);
}
