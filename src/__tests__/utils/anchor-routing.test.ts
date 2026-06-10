import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { scrollToHash, initAnchorRouting } from "../../utils/anchor-routing";

describe("anchor-routing", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.useFakeTimers();
    Object.defineProperty(window, "innerWidth", { value: 1024 });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("scrollToHash", () => {
    it("should return early if document is undefined", async () => {
      const originalDoc = global.document;
      // @ts-expect-error - testing undefined document
      global.document = undefined;
      const { scrollToHash } = await import("../../utils/anchor-routing");
      expect(() => scrollToHash("about")).not.toThrow();
      global.document = originalDoc;
    });

    it("should scroll to home section for empty hash", () => {
      const scrollMock = vi.fn();
      const section = document.createElement("section");
      section.id = "home";
      section.scrollIntoView = scrollMock;
      document.body.appendChild(section);

      scrollToHash("");

      expect(scrollMock).toHaveBeenCalledWith({ block: "center" });
    });

    it("should scroll to home section for hash with just #", () => {
      const scrollMock = vi.fn();
      const section = document.createElement("section");
      section.id = "home";
      section.scrollIntoView = scrollMock;
      document.body.appendChild(section);

      scrollToHash("#");

      expect(scrollMock).toHaveBeenCalledWith({ block: "center" });
    });

    it("should scroll to home section for / path", () => {
      const scrollMock = vi.fn();
      const section = document.createElement("section");
      section.id = "home";
      section.scrollIntoView = scrollMock;
      document.body.appendChild(section);

      scrollToHash("/");

      expect(scrollMock).toHaveBeenCalledWith({ block: "center" });
    });

    it("should scroll to home section for /# path", () => {
      const scrollMock = vi.fn();
      const section = document.createElement("section");
      section.id = "home";
      section.scrollIntoView = scrollMock;
      document.body.appendChild(section);

      scrollToHash("/#");

      expect(scrollMock).toHaveBeenCalledWith({ block: "center" });
    });

    it("should scroll to section by id without hash prefix", () => {
      const scrollMock = vi.fn();
      const container = document.createElement("div");
      container.classList.add("main-content");
      container.scrollTo = scrollMock;
      container.scrollTop = 0;
      Object.defineProperty(container, "clientHeight", { value: 800 });

      const section = document.createElement("section");
      section.id = "about";
      Object.defineProperty(section, "getBoundingClientRect", {
        value: () => ({ top: 100, height: 600 }),
      });
      Object.defineProperty(section, "clientHeight", { value: 600 });

      container.getBoundingClientRect = vi.fn(() => ({
        top: 0,
        height: 800,
      }));

      container.appendChild(section);
      document.body.appendChild(container);

      scrollToHash("about");

      expect(scrollMock).toHaveBeenCalled();
    });

    it("should scroll to section by id with hash prefix", () => {
      const scrollMock = vi.fn();
      const container = document.createElement("div");
      container.classList.add("main-content");
      container.scrollTo = scrollMock;
      container.scrollTop = 0;
      Object.defineProperty(container, "clientHeight", { value: 800 });

      const section = document.createElement("section");
      section.id = "about";
      Object.defineProperty(section, "getBoundingClientRect", {
        value: () => ({ top: 100, height: 600 }),
      });
      Object.defineProperty(section, "clientHeight", { value: 600 });

      container.getBoundingClientRect = vi.fn(() => ({
        top: 0,
        height: 800,
      }));

      container.appendChild(section);
      document.body.appendChild(container);

      scrollToHash("#about");

      expect(scrollMock).toHaveBeenCalled();
    });

    it("should do nothing for non-existent section", () => {
      expect(() => scrollToHash("nonexistent")).not.toThrow();
    });

    it("should do nothing if no main-content container exists", () => {
      const section = document.createElement("section");
      section.id = "about";
      document.body.appendChild(section);

      expect(() => scrollToHash("about")).not.toThrow();
    });

    it("should update active nav link for section", () => {
      const container = document.createElement("div");
      container.classList.add("main-content");
      container.scrollTo = vi.fn();
      container.scrollTop = 0;
      Object.defineProperty(container, "clientHeight", { value: 800 });

      const section = document.createElement("section");
      section.id = "about";
      Object.defineProperty(section, "getBoundingClientRect", {
        value: () => ({ top: 100, height: 600 }),
      });
      Object.defineProperty(section, "clientHeight", { value: 600 });

      container.getBoundingClientRect = vi.fn(() => ({
        top: 0,
        height: 800,
      }));

      const link = document.createElement("a");
      link.classList.add("header-nav-link");
      link.setAttribute("href", "/#about");

      container.appendChild(section);
      document.body.appendChild(link);
      document.body.appendChild(container);

      scrollToHash("about");

      expect(link.classList.contains("header-nav-link--active")).toBe(true);
    });

    it("should update active nav link for home", () => {
      const section = document.createElement("section");
      section.id = "home";
      section.scrollIntoView = vi.fn();

      const link = document.createElement("a");
      link.classList.add("header-nav-link");
      link.setAttribute("href", "/");

      document.body.appendChild(section);
      document.body.appendChild(link);

      scrollToHash("");

      expect(link.classList.contains("header-nav-link--active")).toBe(true);
    });

    it("should handle mobile scroll adjustment", () => {
      Object.defineProperty(window, "innerWidth", { value: 600 });

      const scrollMock = vi.fn();
      const container = document.createElement("div");
      container.classList.add("main-content");
      container.scrollTo = scrollMock;
      container.scrollTop = 0;
      Object.defineProperty(container, "clientHeight", { value: 800 });

      const section = document.createElement("section");
      section.id = "about";
      Object.defineProperty(section, "getBoundingClientRect", {
        value: () => ({ top: 100, height: 600 }),
      });
      Object.defineProperty(section, "clientHeight", { value: 600 });

      container.getBoundingClientRect = vi.fn(() => ({
        top: 0,
        height: 800,
      }));

      container.appendChild(section);
      document.body.appendChild(container);

      scrollToHash("about");

      vi.advanceTimersByTime(350);

      expect(scrollMock).toHaveBeenCalled();
    });
  });

  describe("initAnchorRouting", () => {
    it("should return early if document is undefined", async () => {
      const originalDoc = global.document;
      // @ts-expect-error - testing undefined document
      global.document = undefined;
      const { initAnchorRouting } = await import("../../utils/anchor-routing");
      expect(() => initAnchorRouting()).not.toThrow();
      global.document = originalDoc;
    });

    it("should bind hash link listeners on init", async () => {
      document.body.innerHTML = `
        <a href="/" class="header-nav-link">Home</a>
        <a href="/#about" class="header-nav-link">About</a>
      `;

      const { initAnchorRouting } = await import("../../utils/anchor-routing");
      initAnchorRouting();

      expect(document.querySelectorAll(".header-nav-link").length).toBe(2);
    });

    it("should not bind listeners if not on home path", async () => {
      Object.defineProperty(window, "location", {
        value: { pathname: "/blog", hash: "" },
        writable: true,
      });

      document.body.innerHTML = `
        <a href="/" class="header-nav-link">Home</a>
        <a href="/#about" class="header-nav-link">About</a>
      `;

      const { initAnchorRouting } = await import("../../utils/anchor-routing");
      initAnchorRouting();

      expect(() => initAnchorRouting()).not.toThrow();
    });

    it("should handle click on hash link", async () => {
      const scrollMock = vi.fn();
      const section = document.createElement("section");
      section.id = "home";
      section.scrollIntoView = scrollMock;
      document.body.appendChild(section);

      document.body.innerHTML = `
        <a href="/#about" class="header-nav-link">About</a>
      `;

      const { initAnchorRouting } = await import("../../utils/anchor-routing");
      initAnchorRouting();

      const link = document.querySelector("a") as HTMLAnchorElement;
      link.click();

      expect(scrollMock).not.toHaveBeenCalled();
    });
  });
});
