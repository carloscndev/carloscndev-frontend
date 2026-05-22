import { describe, it, expect, beforeEach } from "vitest";
import {
  isMobileMenuOpen,
  openMobileMenu,
  closeMobileMenu,
  toggleMobileMenu,
} from "../../utils/mobile-menu";

describe("mobile-menu", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button data-mobile-menu-toggle aria-expanded="false">Menu</button>
      <div id="mobile-menu" data-open="false" role="dialog">
        <button data-mobile-menu-close>Close</button>
        <a data-mobile-menu-link href="/#about">About</a>
      </div>
    `;
    document.body.classList.remove("overflow-hidden");
  });

  describe("isMobileMenuOpen", () => {
    it("should return false when menu is closed", () => {
      expect(isMobileMenuOpen()).toBe(false);
    });

    it("should return true when menu is open", () => {
      openMobileMenu();
      expect(isMobileMenuOpen()).toBe(true);
    });
  });

  describe("openMobileMenu", () => {
    it("should set data-open and add overflow-hidden", () => {
      openMobileMenu();
      const menu = document.getElementById("mobile-menu")!;
      expect(menu.dataset.open).toBe("true");
      expect(document.body.classList.contains("overflow-hidden")).toBe(true);
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
  });

  describe("toggleMobileMenu", () => {
    it("should open when closed and close when open", () => {
      toggleMobileMenu();
      expect(isMobileMenuOpen()).toBe(true);
      toggleMobileMenu();
      expect(isMobileMenuOpen()).toBe(false);
    });
  });
});
