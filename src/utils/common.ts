import type { Lang } from "./lang";

export type LangChangeEvent = CustomEvent<{ lang: Lang }>;

export function getCurrentLang(): Lang {
  return (document.documentElement.lang || "es") as Lang;
}

export function cloneAndReplace(el: HTMLElement): HTMLElement {
  const cloned = el.cloneNode(true) as HTMLElement;
  el.replaceWith(cloned);
  return cloned;
}

// eslint-disable-next-line no-unused-vars -- callback type parameter is documentation-only
export function initLangSwitch(updateFn: (_lang: Lang) => void): void {
  if (typeof document === "undefined") return;

  function handler(e: Event): void {
    const { lang } = (e as LangChangeEvent).detail;
    updateFn(lang);
  }

  window.addEventListener("langchange", handler);

  document.addEventListener("astro:page-load", () => {
    window.addEventListener("langchange", handler);
    updateFn(getCurrentLang());
  });
}

export function closeAllPanelsExcept(
  activePanel: HTMLElement | null,
  containerSelector: string,
  panelSelector: string,
  triggerSelector: string,
  openClass: string,
): void {
  const allPanels = document.querySelectorAll<HTMLElement>(
    `${containerSelector} ${panelSelector}`,
  );
  const allTriggers = document.querySelectorAll<HTMLElement>(
    `${containerSelector} ${triggerSelector}`,
  );

  allPanels.forEach((panel) => {
    if (panel !== activePanel) {
      panel.classList.remove(openClass);
    }
  });

  allTriggers.forEach((trigger) => {
    const panel = trigger
      .closest("[data-accordion-item]")
      ?.querySelector<HTMLElement>(panelSelector);
    if (panel && panel !== activePanel) {
      trigger.setAttribute("aria-expanded", "false");
    }
  });
}
