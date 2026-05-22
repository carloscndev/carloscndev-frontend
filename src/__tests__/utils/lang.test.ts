import { describe, it, expect, beforeEach, vi } from "vitest";

describe("lang", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "es";
  });

  it("should define NAV_LABELS for all sections", async () => {
    const { NAV_LABELS } = await import("../../utils/lang");
    expect(NAV_LABELS.home.es).toBe("Inicio");
    expect(NAV_LABELS.home.en).toBe("Home");
    expect(NAV_LABELS.about.es).toBe("Acerca de");
    expect(NAV_LABELS.about.en).toBe("About");
    expect(NAV_LABELS.portfolio).toBeDefined();
    expect(NAV_LABELS.blog).toBeDefined();
    expect(NAV_LABELS.contact).toBeDefined();
  });

  it("should toggle language and dispatch langchange event", async () => {
    localStorage.getItem = vi.fn(() => "es");

    const module = await import("../../utils/lang");
    const handler = vi.fn();
    window.addEventListener("langchange", handler);

    const btn = document.createElement("div");
    btn.id = "language-toggle";
    document.body.appendChild(btn);

    module.initLangListener();
    btn.click();

    expect(handler).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalled();
  });
});
