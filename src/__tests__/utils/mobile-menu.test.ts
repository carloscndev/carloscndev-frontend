import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  isMobileMenuOpen,
  openMobileMenu,
  closeMobileMenu,
  toggleMobileMenu,
  initMobileMenuListener,
} from "../../utils/mobile-menu";

describe("mobile-menu", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="theme-toggle-button">Theme</button>
      <button data-mobile-menu-toggle aria-expanded="false" aria-label="Open navigation menu">Menu</button>
      <div id="mobile-menu" data-open="false" role="dialog">
        <button data-mobile-menu-close>Close</button>
        <a data-mobile-menu-link href="/#about">About</a>
        <a data-mobile-menu-link href="/#portfolio">Portfolio</a>
      </div>
    `;
    document.body.classList.remove("overflow-hidden");
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("isMobileMenuOpen", () => {
    it("should return false when menu is closed", () => {
      expect(isMobileMenuOpen()).toBe(false);
    });

    it("should return true when menu is open", () => {
      openMobileMenu();
      expect(isMobileMenuOpen()).toBe(true);
    });

    it("should return false if menu element does not exist", () => {
      document.body.innerHTML = "";
      expect(isMobileMenuOpen()).toBe(false);
    });
  });

  describe("openMobileMenu", () => {
    it("should set data-open and add overflow-hidden", () => {
      openMobileMenu();
      const menu = document.getElementById("mobile-menu")!;
      expect(menu.dataset.open).toBe("true");
      expect(document.body.classList.contains("overflow-hidden")).toBe(true);
    });

    it("should update toggle button aria-expanded to true", () => {
      openMobileMenu();
      const toggle = document.querySelector(
        "[data-mobile-menu-toggle]",
      ) as HTMLElement;
      expect(toggle.getAttribute("aria-expanded")).toBe("true");
    });

    it("should update toggle button aria-label to Close", () => {
      openMobileMenu();
      const toggle = document.querySelector(
        "[data-mobile-menu-toggle]",
      ) as HTMLElement;
      expect(toggle.getAttribute("aria-label")).toBe("Close navigation menu");
    });

    it("should focus the close button", () => {
      openMobileMenu();
      const closeBtn = document.querySelector(
        "[data-mobile-menu-close]",
      ) as HTMLElement;
      expect(document.activeElement).toBe(closeBtn);
    });

    it("should do nothing if menu element does not exist", () => {
      document.body.innerHTML = "";
      expect(() => openMobileMenu()).not.toThrow();
    });
  });

  describe("closeMobileMenu", () => {
    it("should remove overflow-hidden and set data-open false", () => {
      openMobileMenu();
      closeMobileMenu();
      const menu = document.getElementById("mobile-menu")!;
      expect(menu.dataset.open).toBe("false");
      expect(document.body.classList.contains("overflow-hidden")).toBe(false);
    });

    it("should update toggle button aria-expanded to false", () => {
      openMobileMenu();
      closeMobileMenu();
      const toggle = document.querySelector(
        "[data-mobile-menu-toggle]",
      ) as HTMLElement;
      expect(toggle.getAttribute("aria-expanded")).toBe("false");
    });

    it("should update toggle button aria-label to Open", () => {
      openMobileMenu();
      closeMobileMenu();
      const toggle = document.querySelector(
        "[data-mobile-menu-toggle]",
      ) as HTMLElement;
      expect(toggle.getAttribute("aria-label")).toBe("Open navigation menu");
    });

    it("should do nothing if menu element does not exist", () => {
      document.body.innerHTML = "";
      expect(() => closeMobileMenu()).not.toThrow();
    });
  });

  describe("toggleMobileMenu", () => {
    it("should open when closed and close when open", () => {
      toggleMobileMenu();
      expect(isMobileMenuOpen()).toBe(true);
      toggleMobileMenu();
      expect(isMobileMenuOpen()).toBe(false);
    });

    it("should do nothing if menu element does not exist", () => {
      document.body.innerHTML = "";
      expect(() => toggleMobileMenu()).not.toThrow();
    });
  });

  describe("initMobileMenuListener", () => {
    it("should bind click listeners to toggle and close button", () => {
      initMobileMenuListener();

      const toggle = document.querySelector(
        "[data-mobile-menu-toggle]",
      ) as HTMLElement;
      toggle.click();

      expect(isMobileMenuOpen()).toBe(true);
    });

    it("should close menu when close button is clicked", () => {
      openMobileMenu();
      initMobileMenuListener();

      const closeBtn = document.querySelector(
        "[data-mobile-menu-close]",
      ) as HTMLElement;
      closeBtn.click();

      expect(isMobileMenuOpen()).toBe(false);
    });

    it("should close menu when nav link is clicked", () => {
      openMobileMenu();
      initMobileMenuListener();

      const navLink = document.querySelector(
        "[data-mobile-menu-link]",
      ) as HTMLElement;
      navLink.click();

      vi.advanceTimersByTime(100);

      expect(isMobileMenuOpen()).toBe(false);
    });

    it("should handle keyboard navigation with Tab", () => {
      openMobileMenu();
      initMobileMenuListener();

      const menu = document.getElementById("mobile-menu")!;

      const tabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
      });
      Object.defineProperty(tabEvent, "shiftKey", { value: false });

      menu.dispatchEvent(tabEvent);
    });

    it("should handle keyboard navigation with Shift+Tab", () => {
      openMobileMenu();
      initMobileMenuListener();

      const menu = document.getElementById("mobile-menu")!;
      const closeBtn = document.querySelector(
        "[data-mobile-menu-close]",
      ) as HTMLElement;

      (closeBtn as HTMLButtonElement).focus();

      const tabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
      });
      Object.defineProperty(tabEvent, "shiftKey", { value: true });

      menu.dispatchEvent(tabEvent);
    });

    it("should close menu on Escape key", () => {
      openMobileMenu();
      initMobileMenuListener();

      const escEvent = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
      });
      document.dispatchEvent(escEvent);

      expect(isMobileMenuOpen()).toBe(false);
    });

    it("should not close menu on other keys", () => {
      openMobileMenu();
      initMobileMenuListener();

      const keyEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      });
      document.dispatchEvent(keyEvent);

      expect(isMobileMenuOpen()).toBe(true);
    });

    it("should remove overflow-hidden on astro:after-swap", () => {
      openMobileMenu();
      initMobileMenuListener();

      const event = new Event("astro:after-swap");
      document.dispatchEvent(event);

      expect(document.body.classList.contains("overflow-hidden")).toBe(false);
    });
  });
});
