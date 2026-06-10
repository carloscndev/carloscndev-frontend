import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  cloneAndReplace,
  getCurrentLang,
  closeAllPanelsExcept,
  initLangSwitch,
} from "../../utils/common";

describe("common", () => {
  describe("cloneAndReplace", () => {
    it("should replace element with clone and return the clone", () => {
      document.body.innerHTML =
        '<div id="parent"><button id="btn" class="old">Click</button></div>';
      const btn = document.getElementById("btn")!;
      const parent = btn.parentElement!;
      const cloned = cloneAndReplace(btn);

      expect(cloned).toBeDefined();
      expect(cloned.tagName).toBe("BUTTON");
      expect(cloned.classList.contains("old")).toBe(true);
      expect(parent.children.length).toBe(1);
      expect(parent.children[0]).toBe(cloned);
    });
  });

  describe("getCurrentLang", () => {
    it("should return document language if set", () => {
      document.documentElement.lang = "en";
      expect(getCurrentLang()).toBe("en");
    });

    it("should return es as fallback when lang is empty", () => {
      document.documentElement.lang = "";
      expect(getCurrentLang()).toBe("es");
    });
  });

  describe("closeAllPanelsExcept", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div data-accordion-container>
          <div data-accordion-item>
            <button data-accordion-trigger aria-expanded="true">Trigger 1</button>
            <div data-accordion-panel class="panel--open">Panel 1</div>
          </div>
          <div data-accordion-item>
            <button data-accordion-trigger aria-expanded="true">Trigger 2</button>
            <div data-accordion-panel class="panel--open">Panel 2</div>
          </div>
          <div data-accordion-item>
            <button data-accordion-trigger aria-expanded="false">Trigger 3</button>
            <div data-accordion-panel>Panel 3</div>
          </div>
        </div>
      `;
    });

    it("should close all panels except the active one", () => {
      const activePanel = document.querySelectorAll(
        "[data-accordion-panel]",
      )[0] as HTMLElement;
      closeAllPanelsExcept(
        activePanel,
        "[data-accordion-container]",
        "[data-accordion-panel]",
        "[data-accordion-trigger]",
        "panel--open",
      );

      const panels = document.querySelectorAll("[data-accordion-panel]");
      expect(panels[0].classList.contains("panel--open")).toBe(true);
      expect(panels[1].classList.contains("panel--open")).toBe(false);
      expect(panels[2].classList.contains("panel--open")).toBe(false);
    });

    it("should update aria-expanded on triggers", () => {
      const activePanel = document.querySelectorAll(
        "[data-accordion-panel]",
      )[0] as HTMLElement;
      closeAllPanelsExcept(
        activePanel,
        "[data-accordion-container]",
        "[data-accordion-panel]",
        "[data-accordion-trigger]",
        "panel--open",
      );

      const triggers = document.querySelectorAll("[data-accordion-trigger]");
      expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
      expect(triggers[1].getAttribute("aria-expanded")).toBe("false");
    });
  });

  describe("initLangSwitch", () => {
    it("should add langchange event listener", () => {
      const updateFn = vi.fn();
      initLangSwitch(updateFn);
      window.dispatchEvent(
        new CustomEvent("langchange", { detail: { lang: "en" } }),
      );

      expect(updateFn).toHaveBeenCalledWith("en");
    });

    it("should call updateFn on astro:page-load", () => {
      const updateFn = vi.fn();
      document.documentElement.lang = "es";
      initLangSwitch(updateFn);

      document.dispatchEvent(new Event("astro:page-load"));

      expect(updateFn).toHaveBeenCalledWith("es");
    });

    it("should do nothing if document is undefined", () => {
      const originalDoc = global.document;
      // @ts-expect-error - testing undefined document
      global.document = undefined;
      const updateFn = vi.fn();
      expect(() => initLangSwitch(updateFn)).not.toThrow();
      global.document = originalDoc;
    });
  });
});
