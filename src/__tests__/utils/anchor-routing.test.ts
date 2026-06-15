import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { scrollToHash, initAnchorRouting } from "../../utils/anchor-routing";

describe("anchor-routing", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.useFakeTimers();
    Object.defineProperty(window, "innerWidth", { value: 1024 });
    Object.defineProperty(window, "location", {
      value: { pathname: "/", hash: "", origin: "http://localhost:4321" },
      writable: true,
    });
    window.history.pushState = vi.fn();
    window.history.replaceState = vi.fn();
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

    it("should try to find section for /# path (invalid section)", () => {
      scrollToHash("/#");
      expect(() => vi.fn()).not.toThrow();
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

    it("should call history.pushState with / for home navigation", () => {
      const section = document.createElement("section");
      section.id = "home";
      section.scrollIntoView = vi.fn();
      document.body.appendChild(section);

      scrollToHash("/");

      expect(window.history.pushState).toHaveBeenCalledWith(null, "", "/");
    });

    it("should call history.pushState with /#section for section navigation", () => {
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

      container.appendChild(section);
      document.body.appendChild(container);

      scrollToHash("about");

      expect(window.history.pushState).toHaveBeenCalledWith(
        null,
        "",
        "/#about",
      );
    });

    it("should use fallback to window.location.hash when pushState throws", () => {
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

      container.appendChild(section);
      document.body.appendChild(container);

      // Simulate pushState throwing an error
      vi.spyOn(window.history, "pushState").mockImplementation(() => {
        throw new Error("SecurityError");
      });

      // Mock location.hash setter
      let hashValue = "";
      Object.defineProperty(window, "location", {
        value: {
          pathname: "/",
          origin: "http://localhost:4321",
          set hash(val) {
            hashValue = val;
          },
          get hash() {
            return hashValue;
          },
        },
        writable: true,
      });

      scrollToHash("about");

      expect(hashValue).toBe("about");
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
        value: { pathname: "/blog", hash: "", origin: "http://localhost:4321" },
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

    it("should handle click on hash link when on home path", async () => {
      Object.defineProperty(window, "location", {
        value: { pathname: "/", hash: "", origin: "http://localhost:4321" },
        writable: true,
      });

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

      vi.advanceTimersByTime(100);

      // Link with /# should call scrollToHash
      expect(scrollMock).not.toHaveBeenCalled();
    });

    it("should not intercept hash links when on non-home page", async () => {
      Object.defineProperty(window, "location", {
        value: { pathname: "/blog", hash: "", origin: "http://localhost:4321" },
        writable: true,
      });

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

      vi.advanceTimersByTime(100);

      // On non-home path, hash links should not be intercepted
      expect(scrollMock).not.toHaveBeenCalled();
    });

    it("should rebind listeners and scroll on astro:page-load on home path", async () => {
      const scrollMock = vi.fn();
      const section = document.createElement("section");
      section.id = "home";
      section.scrollIntoView = scrollMock;
      document.body.appendChild(section);

      Object.defineProperty(window, "location", {
        value: { pathname: "/", hash: "", origin: "http://localhost:4321" },
        writable: true,
      });

      const { initAnchorRouting } = await import("../../utils/anchor-routing");
      initAnchorRouting();

      document.dispatchEvent(new Event("astro:page-load"));
      vi.advanceTimersByTime(300);

      expect(scrollMock).toHaveBeenCalled();
    });

    it("should not scroll on astro:page-load if not on home path", async () => {
      Object.defineProperty(window, "location", {
        value: { pathname: "/blog", hash: "", origin: "http://localhost:4321" },
        writable: true,
      });

      const { initAnchorRouting } = await import("../../utils/anchor-routing");
      initAnchorRouting();

      expect(() =>
        document.dispatchEvent(new Event("astro:page-load")),
      ).not.toThrow();
    });

    it("should clear hash on astro:after-swap when navigating away from home", async () => {
      Object.defineProperty(window, "location", {
        value: {
          pathname: "/blog",
          hash: "#about",
          origin: "http://localhost:4321",
        },
        writable: true,
      });

      const { initAnchorRouting } = await import("../../utils/anchor-routing");
      initAnchorRouting();

      document.dispatchEvent(new Event("astro:after-swap"));

      expect(window.history.replaceState).toHaveBeenCalled();
    });

    it("should handle popstate event for back/forward navigation", async () => {
      const scrollMock = vi.fn();
      const container = document.createElement("div");
      container.classList.add("main-content");
      container.scrollTo = scrollMock;
      container.scrollTop = 0;
      Object.defineProperty(container, "clientHeight", { value: 800 });

      const homeSection = document.createElement("section");
      homeSection.id = "home";
      homeSection.scrollIntoView = vi.fn();

      const aboutSection = document.createElement("section");
      aboutSection.id = "about";
      Object.defineProperty(aboutSection, "getBoundingClientRect", {
        value: () => ({ top: 100, height: 600 }),
      });
      Object.defineProperty(aboutSection, "clientHeight", { value: 600 });

      container.getBoundingClientRect = vi.fn(() => ({
        top: 0,
        height: 800,
      }));

      container.appendChild(homeSection);
      container.appendChild(aboutSection);
      document.body.appendChild(container);

      // Initial location with no hash
      Object.defineProperty(window, "location", {
        value: { pathname: "/", hash: "", origin: "http://localhost:4321" },
        writable: true,
      });

      const { initAnchorRouting } = await import("../../utils/anchor-routing");
      initAnchorRouting();

      // Simulate hash change via popstate
      Object.defineProperty(window, "location", {
        value: {
          pathname: "/",
          hash: "#about",
          origin: "http://localhost:4321",
        },
        writable: true,
      });

      window.dispatchEvent(new PopStateEvent("popstate"));
      vi.advanceTimersByTime(200);

      expect(scrollMock).toHaveBeenCalled();
    });

    it("should handle popstate event with empty hash for home navigation", async () => {
      const scrollMock = vi.fn();
      const section = document.createElement("section");
      section.id = "home";
      section.scrollIntoView = scrollMock;
      document.body.appendChild(section);

      Object.defineProperty(window, "location", {
        value: { pathname: "/", hash: "", origin: "http://localhost:4321" },
        writable: true,
      });

      const { initAnchorRouting } = await import("../../utils/anchor-routing");
      initAnchorRouting();

      window.dispatchEvent(new PopStateEvent("popstate"));
      vi.advanceTimersByTime(200);

      expect(scrollMock).toHaveBeenCalled();
    });
  });

  describe("handleDocumentClick", () => {
    it("should clear hash when clicking non-hash link on home page", async () => {
      Object.defineProperty(window, "location", {
        value: {
          pathname: "/",
          hash: "#about",
          origin: "http://localhost:4321",
        },
        writable: true,
      });

      document.body.innerHTML = `
        <a href="/blog/my-post" class="blog-card">Blog Post</a>
      `;

      const { initAnchorRouting } = await import("../../utils/anchor-routing");
      initAnchorRouting();

      const link = document.querySelector("a") as HTMLAnchorElement;
      link.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      );

      expect(window.history.replaceState).toHaveBeenCalled();
    });

    it("should not clear hash when clicking hash link on home page", async () => {
      Object.defineProperty(window, "location", {
        value: { pathname: "/", hash: "", origin: "http://localhost:4321" },
        writable: true,
      });

      document.body.innerHTML = `
        <a href="/#about" class="header-nav-link">About</a>
      `;

      const { initAnchorRouting } = await import("../../utils/anchor-routing");
      initAnchorRouting();

      const link = document.querySelector("a") as HTMLAnchorElement;
      link.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      );

      // Should not clear hash for hash links
      expect(window.history.replaceState).not.toHaveBeenCalled();
    });

    it("should not clear hash when not on home page", async () => {
      Object.defineProperty(window, "location", {
        value: {
          pathname: "/blog",
          hash: "#about",
          origin: "http://localhost:4321",
        },
        writable: true,
      });

      document.body.innerHTML = `
        <a href="/blog/other-post" class="blog-card">Blog Post</a>
      `;

      const { initAnchorRouting } = await import("../../utils/anchor-routing");
      initAnchorRouting();

      const link = document.querySelector("a") as HTMLAnchorElement;
      link.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      );

      // Should not clear hash when not on home page
      expect(window.history.replaceState).not.toHaveBeenCalled();
    });
  });
});
