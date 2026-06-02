import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const pagesDir = path.resolve(__dirname, "../../pages");

describe("pages", () => {
  describe("index.astro", () => {
    const content = fs.readFileSync(
      path.join(pagesDir, "index.astro"),
      "utf-8",
    );

    it("should import all 6 sections", () => {
      expect(content).toContain("Home");
      expect(content).toContain("About");
      expect(content).toContain("Experience");
      expect(content).toContain("Portfolio");
      expect(content).toContain("Blog");
      expect(content).toContain("Contact");
    });

    it("should use MainLayout", () => {
      expect(content).toContain("MainLayout");
    });
  });

  describe("404.astro", () => {
    const content = fs.readFileSync(path.join(pagesDir, "404.astro"), "utf-8");

    it("should use PostLayout", () => {
      expect(content).toContain("PostLayout");
    });

    it("should use StrapiImage and have error text", () => {
      expect(content).toContain("StrapiImage");
      expect(content).toContain("not-found");
    });
  });

  describe("posts.astro", () => {
    const content = fs.readFileSync(
      path.join(pagesDir, "posts.astro"),
      "utf-8",
    );

    it("should use PostLayout", () => {
      expect(content).toContain("PostLayout");
    });

    it("should render blog cards", () => {
      expect(content).toContain("blog-card");
    });
  });

  describe("projects.astro", () => {
    const content = fs.readFileSync(
      path.join(pagesDir, "projects.astro"),
      "utf-8",
    );

    it("should use PostLayout", () => {
      expect(content).toContain("PostLayout");
    });

    it("should render portfolio cards", () => {
      expect(content).toContain("portfolio-grid");
    });
  });

  describe("blog/[slug].astro", () => {
    const content = fs.readFileSync(
      path.join(pagesDir, "blog", "[slug].astro"),
      "utf-8",
    );

    it("should use PostLayout", () => {
      expect(content).toContain("PostLayout");
    });

    it("should have hero banner and article content", () => {
      expect(content).toContain("post-hero");
      expect(content).toContain("post-body");
    });
  });
});
