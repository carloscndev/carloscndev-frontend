import uiTranslations from "../i18n/ui.json";

const STORAGE_KEY = "carloscndev-lang";

export type Lang = "es" | "en";

const NAV_LABELS: Record<string, Record<Lang, string>> = {
  home: { es: "Inicio", en: "Home" },
  about: { es: "Acerca de", en: "About" },
  portfolio: { es: "Portafolio", en: "Portfolio" },
  blog: { es: "Blog", en: "Blog" },
  contact: { es: "Contacto", en: "Contact" },
};

export function getUITranslation(key: string, lang: Lang): string {
  const translations = (
    uiTranslations as Record<string, Record<string, string>>
  )[lang];
  if (!translations) return key;
  return translations[key] || key;
}

export function updateContentLabels(lang: Lang): void {
  if (typeof document === "undefined") return;

  const elements = document.querySelectorAll("[data-i18n-content]");
  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n-content");
    if (key) {
      el.textContent = getUITranslation(key, lang);
    }
  });
}

export function getStoredLang(): Lang | null {
  if (typeof localStorage === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "es" || stored === "en") return stored;
  return null;
}

export function setStoredLang(lang: Lang): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, lang);
  }
}

export function getNavLabel(key: string, lang: Lang): string {
  return NAV_LABELS[key]?.[lang] || key;
}

export function updateLangUI(newLang: Lang): void {
  // Update language indicator text
  const indicator = document.querySelector("[data-lang-indicator]");
  if (indicator) {
    indicator.textContent = newLang === "es" ? "Es" : "En";
  }

  // Update aria-label
  const toggle = document.getElementById("language-toggle");
  if (toggle) {
    toggle.setAttribute(
      "aria-label",
      `Switch language, currently ${newLang === "es" ? "Spanish" : "English"}`,
    );
  }

  // Update navigation labels via data-i18n attributes
  const navLabels = document.querySelectorAll("[data-i18n-nav]");
  navLabels.forEach((el) => {
    const key = el.getAttribute("data-i18n-nav");
    if (key) {
      el.textContent = getNavLabel(key, newLang);
    }
  });

  updateContentLabels(newLang);
}

export function toggleLanguage(): void {
  if (typeof document === "undefined") return;

  const currentLang =
    getStoredLang() || (document.documentElement.lang as Lang);
  const newLang: Lang = currentLang === "es" ? "en" : "es";

  setStoredLang(newLang);
  document.documentElement.lang = newLang;
  updateLangUI(newLang);

  // Dispatch custom event for other components to listen
  window.dispatchEvent(
    new CustomEvent("langchange", { detail: { lang: newLang } }),
  );
}

function bindLangListeners(): void {
  if (typeof document === "undefined") return;

  const toggle = document.getElementById("language-toggle");
  if (toggle) {
    toggle.removeEventListener("click", toggleLanguage);
    toggle.removeEventListener("keydown", handleLangKeydown);
    toggle.addEventListener("click", toggleLanguage);
    toggle.addEventListener("keydown", handleLangKeydown);
  }
}

function handleLangKeydown(e: Event): void {
  const keyboardEvent = e as KeyboardEvent;
  if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
    keyboardEvent.preventDefault();
    toggleLanguage();
  }
}

export function initLangListener(): void {
  const storedLang = getStoredLang();
  const currentLang = document.documentElement.lang as Lang;
  const initialLang = storedLang || currentLang;

  if (storedLang && storedLang !== currentLang) {
    document.documentElement.lang = storedLang;
  }

  updateLangUI(initialLang);

  // Initial binding on first load
  bindLangListeners();

  // Re-bind listeners after Astro swaps DOM content
  document.addEventListener("astro:page-load", () => {
    bindLangListeners();
  });

  document.addEventListener("astro:after-swap", () => {
    const lang = document.documentElement.lang as Lang;
    updateLangUI(lang);
  });
}
