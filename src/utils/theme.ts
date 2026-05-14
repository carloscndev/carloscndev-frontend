const STORAGE_KEY = "carloscndev-theme";
const DARK = "dark";
const LIGHT = "light";

export function getStoredTheme(): string | null {
  if (typeof localStorage === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === DARK || stored === LIGHT) {
    return stored;
  }
  return null;
}

export function setStoredTheme(theme: string): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, theme);
  }
}

export function getPreferredTheme(): string {
  const stored = getStoredTheme();
  if (stored) return stored;
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? DARK
      : LIGHT;
  }
  return DARK;
}

export function applyTheme(theme: string): void {
  if (typeof document !== "undefined") {
    const html = document.documentElement;
    if (theme === DARK) {
      html.classList.add(DARK);
    } else {
      html.classList.remove(DARK);
    }
    setStoredTheme(theme);
  }
}

export function toggleTheme(): void {
  if (typeof document !== "undefined") {
    const current = document.documentElement.classList.contains(DARK)
      ? DARK
      : LIGHT;
    const next = current === DARK ? LIGHT : DARK;
    applyTheme(next);
  }
}

export function initThemeListener(): void {
  applyTheme(getPreferredTheme());
  document.addEventListener("astro:after-swap", () => {
    applyTheme(getPreferredTheme());
  });
  document.addEventListener("astro:page-load", () => {
    const toggleBtn = document.getElementById("theme-toggle-button");
    if (toggleBtn) {
      toggleBtn.removeEventListener("click", toggleTheme);
      toggleBtn.addEventListener("click", toggleTheme);
    }
  });
}
