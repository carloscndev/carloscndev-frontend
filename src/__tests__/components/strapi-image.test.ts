import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const uiDir = path.resolve(__dirname, "../../components/ui");

describe("ui components", () => {
  describe("StrapiImage.astro", () => {
    const content = fs.readFileSync(
      path.join(uiDir, "StrapiImage.astro"),
      "utf-8",
    );

    it("should accept image and alt props", () => {
      expect(content).toContain("image");
      expect(content).toContain("alt");
    });

    it("should render an <img> with srcset", () => {
      expect(content).toContain("<img");
      expect(content).toContain("srcset");
    });

    it("should generate srcset from Strapi formats", () => {
      expect(content).toContain("srcSet");
      expect(content).toContain("formats.small");
      expect(content).toContain("formats.medium");
      expect(content).toContain("formats.large");
    });

    it("should use getStrapiMediaUrl for absolute URLs", () => {
      expect(content).toContain("getStrapiMediaUrl");
    });

    it("should support lazy loading and async decoding", () => {
      expect(content).toContain("loading={loading}");
      expect(content).toContain("decoding={decoding}");
    });
  });
});
