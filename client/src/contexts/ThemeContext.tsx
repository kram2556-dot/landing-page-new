import React, { createContext, useContext, useEffect, useState } from "react";
import { STORE_THEMES, StoreTheme } from "../const";

type Theme = "light" | "dark";

interface ThemeContextType {
  // الخصائص القديمة (للتوافق الكامل)
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;

  // الإضافات الجديدة الخاصة بالـ 10 ثيمات
  activeStoreTheme: StoreTheme;
  setStoreThemeById: (themeId: string) => void;
  themesList: StoreTheme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
  defaultStoreThemeId?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
  defaultStoreThemeId = "dark-onyx",
}: ThemeProviderProps) {
  // 1. إدارة الوضع الفاتح / الداكن القديم
  const [theme, setTheme] = useState<Theme>(() => {
    if (switchable) {
      const stored = localStorage.getItem("theme");
      return (stored as Theme) || defaultTheme;
    }
    return defaultTheme;
  });

  // 2. إدارة الثيم التجاري النشط من الـ 10 ثيمات
  const [currentStoreThemeId, setCurrentStoreThemeId] = useState<string>(() => {
    const saved = localStorage.getItem("store_theme_id");
    return saved || defaultStoreThemeId;
  });

  const activeStoreTheme =
    STORE_THEMES.find((t) => t.id === currentStoreThemeId) || STORE_THEMES[0];

  // 3. تطبيق الوضع الفاتح / الداكن
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    if (switchable) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, switchable]);

  // 4. تطبيق وحقن ألوان الثيم التجاري المختار على الـ CSS Variables
  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty("--color-primary", activeStoreTheme.primary);
    root.style.setProperty("--color-primary-hover", activeStoreTheme.primaryHover);
    root.style.setProperty("--color-bg", activeStoreTheme.background);
    root.style.setProperty("--color-card", activeStoreTheme.cardBackground);
    root.style.setProperty("--color-text", activeStoreTheme.text);
    root.style.setProperty("--color-text-muted", activeStoreTheme.textMuted);
    root.style.setProperty("--color-border", activeStoreTheme.border);
    root.style.setProperty("--color-badge-bg", activeStoreTheme.badgeBg);
    root.style.setProperty("--color-badge-text", activeStoreTheme.badgeText);
    root.style.setProperty("--color-accent", activeStoreTheme.accent);
    root.style.setProperty("--border-radius", activeStoreTheme.radius);

    // تلوين خلفية الصفحة والخط الرئيسي وفقاً للثيم
    document.body.style.backgroundColor = activeStoreTheme.background;
    document.body.style.color = activeStoreTheme.text;

    localStorage.setItem("store_theme_id", activeStoreTheme.id);
  }, [activeStoreTheme]);

  const toggleTheme = switchable
    ? () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
      }
    : undefined;

  const setStoreThemeById = (themeId: string) => {
    if (STORE_THEMES.some((t) => t.id === themeId)) {
      setCurrentStoreThemeId(themeId);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        switchable,
        activeStoreTheme,
        setStoreThemeById,
        themesList: STORE_THEMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
