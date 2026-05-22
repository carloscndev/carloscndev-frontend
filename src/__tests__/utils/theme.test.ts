import { describe, it, expect, beforeEach, vi } from "vitest";
import { getPreferredTheme, applyTheme } from "../../utils/theme";

describe("theme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
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
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "carloscndev-theme",
        "dark",
      );
    });
  });

  describe("getPreferredTheme", () => {
    it("should return stored theme if present", () => {
      localStorage.getItem = vi.fn(() => "light");
      expect(getPreferredTheme()).toBe("light");
    });

    it("should return system preference if no stored theme", () => {
      localStorage.getItem = vi.fn(() => null);
      const result = getPreferredTheme();
      expect(["dark", "light"]).toContain(result);
    });
  });
});
