import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const iconsDir = path.resolve(__dirname, "../../components/icons");
const iconFiles = fs.readdirSync(iconsDir).filter((f) => f.endsWith(".astro"));

describe("icons", () => {
  iconFiles.forEach((file) => {
    describe(file, () => {
      const content = fs.readFileSync(path.join(iconsDir, file), "utf-8");

      it("should contain an svg element", () => {
        expect(content).toContain("<svg");
      });

      it("should have a viewBox attribute", () => {
        expect(content).toMatch(/viewBox="[^"]+"/);
      });

      it("should have width and height props or defaults", () => {
        expect(content).toMatch(/size/);
      });
    });
  });
});
