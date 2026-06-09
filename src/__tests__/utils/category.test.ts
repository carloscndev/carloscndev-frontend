import { describe, it, expect } from "vitest";

describe("category.ts", () => {
  describe("CATEGORY_MAP", () => {
    it("should have all 4 categories defined", async () => {
      const { CATEGORY_MAP } = await import("../../utils/category");
      expect(CATEGORY_MAP["Tech"]).toBeDefined();
      expect(CATEGORY_MAP["Running"]).toBeDefined();
      expect(CATEGORY_MAP["Travel"]).toBeDefined();
      expect(CATEGORY_MAP["Books"]).toBeDefined();
    });

    it("should map Tech to correct theme and icon", async () => {
      const { CATEGORY_MAP } = await import("../../utils/category");
      expect(CATEGORY_MAP["Tech"]).toEqual({
        theme: "Tech",
        iconName: "TechIcon",
      });
    });

    it("should map Running to correct theme and icon", async () => {
      const { CATEGORY_MAP } = await import("../../utils/category");
      expect(CATEGORY_MAP["Running"]).toEqual({
        theme: "Running",
        iconName: "RunningIcon",
      });
    });

    it("should map Travel to correct theme and icon", async () => {
      const { CATEGORY_MAP } = await import("../../utils/category");
      expect(CATEGORY_MAP["Travel"]).toEqual({
        theme: "Travel",
        iconName: "TravelIcon",
      });
    });

    it("should map Books to correct theme and icon", async () => {
      const { CATEGORY_MAP } = await import("../../utils/category");
      expect(CATEGORY_MAP["Books"]).toEqual({
        theme: "Books",
        iconName: "BookIcon",
      });
    });
  });

  describe("getCategoryTheme", () => {
    it("should return Tech for Tech category", async () => {
      const { getCategoryTheme } = await import("../../utils/category");
      expect(getCategoryTheme("Tech")).toBe("Tech");
    });

    it("should return Running for Running category", async () => {
      const { getCategoryTheme } = await import("../../utils/category");
      expect(getCategoryTheme("Running")).toBe("Running");
    });

    it("should return Travel for Travel category", async () => {
      const { getCategoryTheme } = await import("../../utils/category");
      expect(getCategoryTheme("Travel")).toBe("Travel");
    });

    it("should return Books for Books category", async () => {
      const { getCategoryTheme } = await import("../../utils/category");
      expect(getCategoryTheme("Books")).toBe("Books");
    });

    it("should return Tech as default for unknown category", async () => {
      const { getCategoryTheme } = await import("../../utils/category");
      expect(getCategoryTheme("Unknown")).toBe("Tech");
      expect(getCategoryTheme("")).toBe("Tech");
    });
  });

  describe("getIconName", () => {
    it("should return TechIcon for Tech category", async () => {
      const { getIconName } = await import("../../utils/category");
      expect(getIconName("Tech")).toBe("TechIcon");
    });

    it("should return RunningIcon for Running category", async () => {
      const { getIconName } = await import("../../utils/category");
      expect(getIconName("Running")).toBe("RunningIcon");
    });

    it("should return TravelIcon for Travel category", async () => {
      const { getIconName } = await import("../../utils/category");
      expect(getIconName("Travel")).toBe("TravelIcon");
    });

    it("should return BookIcon for Books category", async () => {
      const { getIconName } = await import("../../utils/category");
      expect(getIconName("Books")).toBe("BookIcon");
    });

    it("should return TechIcon as default for unknown category", async () => {
      const { getIconName } = await import("../../utils/category");
      expect(getIconName("Unknown")).toBe("TechIcon");
      expect(getIconName("")).toBe("TechIcon");
    });
  });
});
