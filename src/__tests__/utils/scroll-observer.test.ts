import { describe, it, expect, vi, beforeEach } from "vitest";

function buildFixture(scrollTop = 0) {
  document.body.innerHTML = `
    <nav>
      <a href="/" class="header-nav-link header-nav-link--active">Home</a>
      <a href="/#about" class="header-nav-link">About</a>
      <a href="/#contact" class="header-nav-link">Contact</a>
    </nav>
    <div class="main-content" style="height:800px;overflow-y:auto;">
      <section id="home" style="height:800px;"></section>
      <section id="about" style="height:800px;"></section>
      <section id="contact" style="height:800px;"></section>
    </div>
  `;

  const container = document.querySelector(".main-content") as HTMLElement;
  Object.defineProperty(container, "clientHeight", { value: 800 });
  container.scrollTo = vi.fn();

  const sections = document.querySelectorAll<HTMLElement>("section[id]");
  const positions = [
    { top: 0, bottom: 800 },
    { top: 800, bottom: 1600 },
    { top: 1600, bottom: 2400 },
  ];

  sections.forEach((section, i) => {
    Object.defineProperty(section, "offsetTop", { value: positions[i].top });
    Object.defineProperty(section, "offsetHeight", { value: 800 });
    section.getBoundingClientRect = vi.fn(() => ({
      top: positions[i].top - scrollTop,
      bottom: positions[i].bottom - scrollTop,
      left: 0,
      right: 400,
      width: 400,
      height: 800,
      x: 0,
      y: positions[i].top - scrollTop,
      toJSON: () => ({}),
    }));
  });

  container.getBoundingClientRect = vi.fn(() => ({
    top: 0,
    bottom: 800,
    left: 0,
    right: 400,
    width: 400,
    height: 800,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  }));

  return container;
}

describe("bindScrollObserver", () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = "";
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((cb: (...args: unknown[]) => void) => {
        cb();
        return 0;
      }),
    );
    Object.defineProperty(window, "location", {
      value: { pathname: "/", hash: "" },
      writable: true,
      configurable: true,
    });
  });

  it("should update active nav link when scrolling to about", async () => {
    const container = buildFixture(700);
    Object.defineProperty(container, "scrollTop", {
      value: 700,
      configurable: true,
    });
    const replaceSpy = vi.spyOn(window.history, "replaceState");

    const { initAnchorRouting } = await import("../../utils/anchor-routing");
    initAnchorRouting();

    container.dispatchEvent(new Event("scroll"));

    const homeLink = document.querySelector('a[href="/"]')!;
    const aboutLink = document.querySelector('a[href="/#about"]')!;

    expect(homeLink.classList.contains("header-nav-link--active")).toBe(false);
    expect(aboutLink.classList.contains("header-nav-link--active")).toBe(true);
    expect(replaceSpy).toHaveBeenCalledWith(null, "", "/#about");
  });

  it("should activate home nav link when scrolled to top", async () => {
    const container = buildFixture(0);
    Object.defineProperty(container, "scrollTop", {
      value: 0,
      configurable: true,
    });
    const replaceSpy = vi.spyOn(window.history, "replaceState");

    // First, mark something else as active
    const aboutLink = document.querySelector('a[href="/#about"]')!;
    aboutLink.classList.add("header-nav-link--active");

    const { initAnchorRouting } = await import("../../utils/anchor-routing");
    initAnchorRouting();

    container.dispatchEvent(new Event("scroll"));

    const homeLink = document.querySelector('a[href="/"]')!;
    expect(homeLink.classList.contains("header-nav-link--active")).toBe(true);
    expect(aboutLink.classList.contains("header-nav-link--active")).toBe(false);
    expect(replaceSpy).toHaveBeenCalledWith(null, "", "/");
  });

  it("should update URL hash when scrolling to contact", async () => {
    const container = buildFixture(1500);
    Object.defineProperty(container, "scrollTop", {
      value: 1500,
      configurable: true,
    });
    const replaceSpy = vi.spyOn(window.history, "replaceState");

    const { initAnchorRouting } = await import("../../utils/anchor-routing");
    initAnchorRouting();

    container.dispatchEvent(new Event("scroll"));

    const contactLink = document.querySelector('a[href="/#contact"]')!;
    expect(contactLink.classList.contains("header-nav-link--active")).toBe(
      true,
    );
    expect(replaceSpy).toHaveBeenCalledWith(null, "", "/#contact");
  });

  it("should skip observer on non-root pages", async () => {
    Object.defineProperty(window, "location", {
      value: { pathname: "/posts", hash: "" },
      writable: true,
      configurable: true,
    });

    const container = buildFixture(700);
    Object.defineProperty(container, "scrollTop", {
      value: 700,
      configurable: true,
    });

    const { initAnchorRouting } = await import("../../utils/anchor-routing");
    initAnchorRouting();

    container.dispatchEvent(new Event("scroll"));

    // Nav should remain unchanged
    const homeLink = document.querySelector('a[href="/"]')!;
    const aboutLink = document.querySelector('a[href="/#about"]')!;
    expect(homeLink.classList.contains("header-nav-link--active")).toBe(true);
    expect(aboutLink.classList.contains("header-nav-link--active")).toBe(false);
  });
});
