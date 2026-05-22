import { describe, it, expect } from "vitest";
import config from "../../data/config.json";

describe("config.json", () => {
  describe("site", () => {
    it("should have valid URL", () => {
      expect(config.site.url).toMatch(/^https:\/\//);
    });

    it("should have required site fields", () => {
      expect(config.site.name).toBeTruthy();
      expect(config.site.title).toBeTruthy();
      expect(config.site.description).toBeTruthy();
      expect(config.site.author).toBeTruthy();
    });
  });

  describe("locales", () => {
    it("should have at least 2 locales", () => {
      expect(config.locales.length).toBeGreaterThanOrEqual(2);
    });

    it("should have a valid defaultLocale", () => {
      expect(config.locales).toContain(config.defaultLocale);
    });
  });

  describe("navigation", () => {
    it("should have key and href for each nav item", () => {
      config.navigation.forEach((item) => {
        expect(item.key).toBeTruthy();
        expect(item.href).toBeTruthy();
      });
    });

    it("should have at least 3 navigation items", () => {
      expect(config.navigation.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("social", () => {
    it("should have all required social links", () => {
      expect(config.social.github).toMatch(/^https:\/\/github\.com\//);
      expect(config.social.instagram).toMatch(/^https:\/\//);
      expect(config.social.linkedin).toMatch(/linkedin\.com/);
      expect(config.social.cv).toMatch(/^https:\/\//);
      expect(config.social.email).toMatch(/^mailto:/);
    });
  });
});
