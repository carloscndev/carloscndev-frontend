import { describe, it, expect, beforeEach, vi } from "vitest";
import { scrollToHash } from "../../utils/anchor-routing";

describe("anchor-routing", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("scrollToHash", () => {
    it("should scroll home section for empty hash", () => {
      const scrollMock = vi.fn();
      const section = document.createElement("section");
      section.id = "home";
      section.scrollIntoView = scrollMock;
      document.body.appendChild(section);
      scrollToHash("");
      expect(scrollMock).toHaveBeenCalledWith({ block: "center" });
    });

    it("should call container.scrollTo for target section", () => {
      const scrollMock = vi.fn();
      const container = document.createElement("div");
      container.classList.add("main-content");
      container.scrollTo = scrollMock;
      container.scrollTop = 0;
      Object.defineProperty(container, "clientHeight", { value: 800 });

      const section = document.createElement("section");
      section.id = "about";
      Object.defineProperty(section, "clientHeight", { value: 600 });
      section.getBoundingClientRect = vi.fn(() => ({
        top: 100,
        bottom: 700,
        left: 0,
        right: 300,
        width: 300,
        height: 600,
        x: 0,
        y: 100,
        toJSON: () => ({}),
      }));

      container.getBoundingClientRect = vi.fn(() => ({
        top: 0,
        bottom: 800,
        left: 0,
        right: 300,
        width: 300,
        height: 800,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }));

      container.appendChild(section);
      document.body.appendChild(container);

      scrollToHash("about");
      expect(scrollMock).toHaveBeenCalled();
    });

    it("should do nothing for non-existent section", () => {
      scrollToHash("nonexistent");
      // Should not throw
    });
  });
});
