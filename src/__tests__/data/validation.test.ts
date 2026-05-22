import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const dataDir = path.resolve(__dirname, "../../data");
const jsonFiles = fs.readdirSync(dataDir).filter((f) => f.endsWith(".json"));

describe("data validation", () => {
  jsonFiles.forEach((file) => {
    const filepath = path.join(dataDir, file);

    describe(file, () => {
      const data = JSON.parse(fs.readFileSync(filepath, "utf-8"));

      if (file === "config.json") {
        it("should have site, locales, navigation, social sections", () => {
          expect(data.site).toBeDefined();
          expect(data.site.url).toBeDefined();
          expect(data.locales).toBeDefined();
          expect(data.navigation).toBeDefined();
          expect(data.social).toBeDefined();
        });
        return;
      }

      it("should have es and en keys", () => {
        expect(data.es).toBeDefined();
        expect(data.en).toBeDefined();
      });

      it("should have identical key structure in ES and EN", () => {
        const esKeys = JSON.stringify(Object.keys(data.es).sort());
        const enKeys = JSON.stringify(Object.keys(data.en).sort());
        expect(esKeys).toBe(enKeys);
      });
    });
  });

  describe("blog-post.json", () => {
    const data = JSON.parse(
      fs.readFileSync(path.join(dataDir, "blog-post.json"), "utf-8"),
    );

    it("should have matching post IDs in ES and EN", () => {
      const esIds = data.es.posts.map((p: any) => p.id).sort();
      const enIds = data.en.posts.map((p: any) => p.id).sort();
      expect(esIds).toEqual(enIds);
    });

    it("should have content arrays with paragraphs", () => {
      data.es.posts.forEach((post: any) => {
        expect(Array.isArray(post.content)).toBe(true);
        post.content.forEach((block: any) => {
          expect(block.type).toBeDefined();
          expect(block.text).toBeDefined();
        });
      });
    });
  });

  describe("home.json", () => {
    const data = JSON.parse(
      fs.readFileSync(path.join(dataDir, "home.json"), "utf-8"),
    );

    it("should have avatar variants defined", () => {
      expect(data.es.avatar.variants.running).toBeDefined();
      expect(data.es.avatar.variants.reading).toBeDefined();
      expect(data.es.avatar.variants.videogames).toBeDefined();
    });
  });

  describe("contact.json", () => {
    const data = JSON.parse(
      fs.readFileSync(path.join(dataDir, "contact.json"), "utf-8"),
    );

    it("should have valid mailto links", () => {
      expect(data.es.mail_to).toMatch(/^mailto:/);
      expect(data.en.mail_to).toMatch(/^mailto:/);
    });
  });
});
