import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getUITranslation,
  getStoredLang,
  setStoredLang,
  getNavLabel,
  toggleLanguage,
  initLangListener,
  type Lang,
} from "../../utils/lang";

describe("lang", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "es";
    document.body.innerHTML = `
      <button id="language-toggle">EN</button>
      <button id="language-toggle-mobile">EN</button>
      <span data-lang-indicator></span>
      <nav>
        <span data-i18n-nav="home">Inicio</span>
        <span data-i18n-nav="about">Acerca de</span>
      </nav>
    `;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("getUITranslation", () => {
    it("should return translation for existing key in es", async () => {
      const { getUITranslation } = await import("../../utils/lang");
      const result = getUITranslation("nav.home", "es");
      expect(result).toBeTruthy();
    });

    it("should return translation for existing key in en", async () => {
      const { getUITranslation } = await import("../../utils/lang");
      const result = getUITranslation("nav.home", "en");
      expect(result).toBeTruthy();
    });

    it("should return key when translation not found", async () => {
      const { getUITranslation } = await import("../../utils/lang");
      const result = getUITranslation("nonexistent.key", "es");
      expect(result).toBe("nonexistent.key");
    });
  });

  describe("getStoredLang", () => {
    it("should return null when no lang stored", () => {
      expect(getStoredLang()).toBeNull();
    });

    it("should return stored lang when valid", () => {
      localStorage.setItem("carloscndev-lang", "en");
      expect(getStoredLang()).toBe("en");
    });

    it("should return null when stored lang is invalid", () => {
      localStorage.setItem("carloscndev-lang", "fr");
      expect(getStoredLang()).toBeNull();
    });
  });

  describe("setStoredLang", () => {
    it("should set lang in localStorage", () => {
      setStoredLang("en");
      expect(localStorage.getItem("carloscndev-lang")).toBe("en");
    });
  });

  describe("getNavLabel", () => {
    it("should return nav label for existing key in es", async () => {
      const { getNavLabel } = await import("../../utils/lang");
      const result = getNavLabel("home", "es");
      expect(result).toBe("Inicio");
    });

    it("should return nav label for existing key in en", async () => {
      const { getNavLabel } = await import("../../utils/lang");
      const result = getNavLabel("home", "en");
      expect(result).toBe("Home");
    });

    it("should return key when nav label not found", async () => {
      const { getNavLabel } = await import("../../utils/lang");
      const result = getNavLabel("nonexistent", "es");
      expect(result).toBe("nonexistent");
    });
  });

  describe("toggleLanguage", () => {
    it("should toggle from es to en", async () => {
      const module = await import("../../utils/lang");
      module.initLangListener();

      const btn = document.getElementById("language-toggle") as HTMLElement;
      btn.click();

      expect(document.documentElement.lang).toBe("en");
    });

    it("should toggle from en to es", async () => {
      document.documentElement.lang = "en";
      const module = await import("../../utils/lang");
      module.initLangListener();

      const btn = document.getElementById("language-toggle") as HTMLElement;
      btn.click();

      expect(document.documentElement.lang).toBe("es");
    });

    it("should dispatch langchange event", async () => {
      const module = await import("../../utils/lang");
      const eventHandler = vi.fn();
      window.addEventListener("langchange", eventHandler);
      module.initLangListener();

      const btn = document.getElementById("language-toggle") as HTMLElement;
      btn.click();

      expect(eventHandler).toHaveBeenCalled();
    });

    it("should update lang indicator text to En", async () => {
      const module = await import("../../utils/lang");
      module.initLangListener();

      const btn = document.getElementById("language-toggle") as HTMLElement;
      btn.click();

      const indicator = document.querySelector("[data-lang-indicator]")!;
      expect(indicator.textContent).toBe("En");
    });

    it("should update lang indicator text to Es when toggling back", async () => {
      document.documentElement.lang = "en";
      const module = await import("../../utils/lang");
      module.initLangListener();

      const btn = document.getElementById("language-toggle") as HTMLElement;
      btn.click();

      const indicator = document.querySelector("[data-lang-indicator]")!;
      expect(indicator.textContent).toBe("Es");
    });

    it("should update toggle aria-label", async () => {
      const module = await import("../../utils/lang");
      module.initLangListener();

      const btn = document.getElementById("language-toggle") as HTMLElement;
      btn.click();

      expect(btn.getAttribute("aria-label")).toBe(
        "Switch language, currently English",
      );
    });
  });

  describe("initLangListener", () => {
    it("should initialize with stored lang when different from dom lang", () => {
      localStorage.setItem("carloscndev-lang", "en");
      document.documentElement.lang = "es";
      initLangListener();
      expect(document.documentElement.lang).toBe("en");
    });

    it("should bind click handlers to toggle buttons", () => {
      initLangListener();

      const btn = document.getElementById("language-toggle") as HTMLElement;
      btn.click();

      expect(document.documentElement.lang).toBe("en");
    });

    it("should bind click handlers to mobile toggle button", () => {
      initLangListener();

      const btn = document.getElementById(
        "language-toggle-mobile",
      ) as HTMLElement;
      btn.click();

      expect(document.documentElement.lang).toBe("en");
    });

    it("should update nav labels on init", () => {
      initLangListener();

      const navLabel = document.querySelector("[data-i18n-nav='home']")!;
      expect(navLabel.textContent).toBeTruthy();
    });

    it("should handle keyboard Enter key on toggle", () => {
      initLangListener();

      const btn = document.getElementById(
        "language-toggle",
      ) as HTMLButtonElement;
      const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
      btn.dispatchEvent(enterEvent);

      expect(document.documentElement.lang).toBe("en");
    });

    it("should handle keyboard Space key on toggle", () => {
      initLangListener();

      const btn = document.getElementById(
        "language-toggle",
      ) as HTMLButtonElement;
      const spaceEvent = new KeyboardEvent("keydown", { key: " " });
      btn.dispatchEvent(spaceEvent);

      expect(document.documentElement.lang).toBe("en");
    });

    it("should handle astro:after-swap event", () => {
      initLangListener();

      document.dispatchEvent(new Event("astro:after-swap"));

      expect(document.documentElement.lang).toBe("es");
    });

    it("should handle astro:after-swap with stored lang", () => {
      localStorage.setItem("carloscndev-lang", "en");
      initLangListener();

      document.dispatchEvent(new Event("astro:after-swap"));

      expect(document.documentElement.lang).toBe("en");
    });
  });
});
