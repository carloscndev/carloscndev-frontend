import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const layoutsDir = path.resolve(__dirname, "../../layouts");

describe("layouts", () => {
  const files = ["BaseLayout.astro", "MainLayout.astro", "PostLayout.astro"];

  files.forEach((file) => {
    describe(file, () => {
      const content = fs.readFileSync(path.join(layoutsDir, file), "utf-8");

      it("should import BaseLayout or be BaseLayout", () => {
        if (file === "BaseLayout.astro") {
          expect(content).toContain("<!doctype html>");
        } else {
          expect(content).toMatch(/BaseLayout/);
        }
      });

      it("should include ClientRouter for transitions", () => {
        if (file === "BaseLayout.astro") {
          expect(content).toContain("ClientRouter");
        }
      });

      it("should render a slot for content", () => {
        expect(content).toContain("<slot");
      });
    });
  });
});
