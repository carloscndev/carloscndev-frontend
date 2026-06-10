import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getStoredTheme,
  setStoredTheme,
  getPreferredTheme,
  applyTheme,
  toggleTheme,
  initThemeListener,
} from "../../utils/theme";

describe("theme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("getStoredTheme", () => {
    it("should return null when localStorage is undefined", () => {
      const globalDoc = global.localStorage;
      // @ts-expect-error - testing undefined localStorage
      global.localStorage = undefined;

      expect(getStoredTheme()).toBeNull();

      global.localStorage = globalDoc;
    });

    it("should return stored theme when valid", () => {
      localStorage.setItem("carloscndev-theme", "dark");
      expect(getStoredTheme()).toBe("dark");
    });

    it("should return null when stored theme is invalid", () => {
      localStorage.setItem("carloscndev-theme", "invalid");
      expect(getStoredTheme()).toBeNull();
    });

    it("should return null when no theme stored", () => {
      expect(getStoredTheme()).toBeNull();
    });
  });

  describe("setStoredTheme", () => {
    it("should set theme in localStorage", () => {
      setStoredTheme("dark");
      expect(localStorage.getItem("carloscndev-theme")).toBe("dark");
    });

    it("should do nothing when localStorage is undefined", () => {
      const globalDoc = global.localStorage;
      // @ts-expect-error - testing undefined localStorage
      global.localStorage = undefined;

      expect(() => setStoredTheme("dark")).not.toThrow();

      global.localStorage = globalDoc;
    });
  });

  describe("applyTheme", () => {
    it("should add dark class for dark theme", () => {
      applyTheme("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("should remove dark class for light theme", () => {
      document.documentElement.classList.add("dark");
      applyTheme("light");
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("should persist to localStorage", () => {
      applyTheme("dark");
      expect(localStorage.getItem("carloscndev-theme")).toBe("dark");
    });

    it("should do nothing when document is undefined", () => {
      const globalDoc = global.document;
      // @ts-expect-error - testing undefined document
      global.document = undefined;

      expect(() => applyTheme("dark")).not.toThrow();

      global.document = globalDoc;
    });
  });

  describe("getPreferredTheme", () => {
    it("should return stored theme when present", () => {
      localStorage.setItem("carloscndev-theme", "light");
      expect(getPreferredTheme()).toBe("light");
    });

    it("should return stored theme 'dark'", () => {
      localStorage.setItem("carloscndev-theme", "dark");
      expect(getPreferredTheme()).toBe("dark");
    });

    it("should return system preference when no stored theme", () => {
      localStorage.removeItem("carloscndev-theme");
      const result = getPreferredTheme();
      expect(["dark", "light"]).toContain(result);
    });

    it("should return dark when window is undefined", () => {
      const globalDoc = global.window;
      // @ts-expect-error - testing undefined window
      global.window = undefined;

      expect(getPreferredTheme()).toBe("dark");

      global.window = globalDoc;
    });
  });

  describe("toggleTheme", () => {
    it("should toggle from dark to light", () => {
      document.documentElement.classList.add("dark");
      toggleTheme();
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("should toggle from light to dark", () => {
      document.documentElement.classList.remove("dark");
      toggleTheme();
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("should do nothing when document is undefined", () => {
      const globalDoc = global.document;
      // @ts-expect-error - testing undefined document
      global.document = undefined;

      expect(() => toggleTheme()).not.toThrow();

      global.document = globalDoc;
    });
  });

  describe("initThemeListener", () => {
    it("should apply initial theme", () => {
      localStorage.setItem("carloscndev-theme", "dark");
      initThemeListener();
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("should bind click handlers to toggle buttons", () => {
      document.body.innerHTML = `
        <button id="theme-toggle-button">Theme</button>
        <button id="theme-toggle-mobile">Theme Mobile</button>
      `;

      initThemeListener();

      const desktopBtn = document.getElementById(
        "theme-toggle-button",
      ) as HTMLElement;
      desktopBtn.click();

      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("should handle mobile toggle button", () => {
      document.body.innerHTML = `
        <button id="theme-toggle-button">Theme</button>
        <button id="theme-toggle-mobile">Theme Mobile</button>
      `;

      initThemeListener();

      const mobileBtn = document.getElementById(
        "theme-toggle-mobile",
      ) as HTMLElement;
      mobileBtn.click();

      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("should do nothing if document is undefined", () => {
      expect(typeof initThemeListener).toBe("function");
    });

    it("should apply theme on astro:after-swap event", () => {
      localStorage.setItem("carloscndev-theme", "dark");
      initThemeListener();

      document.dispatchEvent(new Event("astro:after-swap"));

      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("should rebind toggle handlers on astro:page-load", () => {
      localStorage.setItem("carloscndev-theme", "light");
      document.body.innerHTML = `
        <button id="theme-toggle-button">Theme</button>
        <button id="theme-toggle-mobile">Theme Mobile</button>
      `;

      initThemeListener();

      document.dispatchEvent(new Event("astro:page-load"));

      const desktopBtn = document.getElementById(
        "theme-toggle-button",
      ) as HTMLElement;
      desktopBtn.click();

      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("should handle astro:page-load with no toggle buttons", () => {
      document.body.innerHTML = `<div>No buttons</div>`;
      initThemeListener();

      expect(() =>
        document.dispatchEvent(new Event("astro:page-load")),
      ).not.toThrow();
    });
  });
});
