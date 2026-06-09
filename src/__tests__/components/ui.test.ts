import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const uiDir = path.resolve(__dirname, "../../components/ui");

describe("ui components", () => {
  describe("BlogCard.astro", () => {
    const content = fs.readFileSync(
      path.join(uiDir, "BlogCard.astro"),
      "utf-8",
    );

    it("should accept all required props", () => {
      expect(content).toContain("id");
      expect(content).toContain("title");
      expect(content).toContain("link");
      expect(content).toContain("icon");
      expect(content).toContain("category");
      expect(content).toContain("date");
      expect(content).toContain("readTime");
      expect(content).toContain("resume");
    });

    it("should render an image with overlay", () => {
      expect(content).toContain("blog-card__image");
      expect(content).toContain("blog-card__overlay");
      expect(content).toContain("blog-card__overlay-text");
    });

    it("should render post metadata", () => {
      expect(content).toContain("data-post-title");
      expect(content).toContain("data-post-read-time");
      expect(content).toContain("data-post-date");
      expect(content).toContain("data-post-category");
    });

    it("should support multiple category themes via category.ts", () => {
      expect(content).toContain("getCategoryTheme");
      expect(content).toContain("getIconName");
      expect(content).toContain("TravelIcon");
      expect(content).toContain("BookIcon");
    });

    it("should use LinkWrapper for navigation", () => {
      expect(content).toContain("LinkWrapper");
      expect(content).toContain("href={link}");
    });
  });

  describe("BlogAccordionItem.astro", () => {
    const content = fs.readFileSync(
      path.join(uiDir, "BlogAccordionItem.astro"),
      "utf-8",
    );

    it("should accept required props", () => {
      expect(content).toContain("id");
      expect(content).toContain("title");
      expect(content).toContain("link");
      expect(content).toContain("icon");
      expect(content).toContain("resume");
    });

    it("should render accordion trigger with expand button", () => {
      expect(content).toContain("data-accordion-trigger");
      expect(content).toContain('aria-expanded="false"');
      expect(content).toContain("blog-accordion__trigger-chevron");
    });

    it("should render accordion panel with resume", () => {
      expect(content).toContain("data-accordion-panel");
      expect(content).toContain("data-post-resume");
    });

    it("should support multiple category themes via category.ts", () => {
      expect(content).toContain("getCategoryTheme");
      expect(content).toContain("getIconName");
      expect(content).toContain("TravelIcon");
      expect(content).toContain("BookIcon");
    });

    it("should have a link to open the article", () => {
      expect(content).toContain("LinkWrapper");
      expect(content).toContain("href={link}");
      expect(content).toContain('aria-label="Open article"');
    });
  });
});
