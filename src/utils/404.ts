import { initLangSwitch } from "./common";
import type { Lang } from "./lang";

interface Error404Data {
  title: string;
  message: string;
  button_text: string;
}

interface Full404Data {
  es: Error404Data;
  en: Error404Data;
}

export function update404Content(lang: Lang): void {
  if (typeof document === "undefined") return;

  const dataEl = document.getElementById("error-404-data");
  if (!dataEl?.textContent) return;

  const allData: Full404Data = JSON.parse(dataEl.textContent);
  const data = allData[lang];
  if (!data) return;

  const titleEl = document.querySelector("[data-404-title]");
  const messageEl = document.querySelector("[data-404-message]");
  const buttonEl = document.querySelector("[data-404-button]");

  if (titleEl) titleEl.textContent = data.title;
  if (messageEl) messageEl.textContent = data.message;
  if (buttonEl) {
    const span = buttonEl.querySelector("span");
    if (span) span.textContent = data.button_text;
  }
}

export function init404LangSwitch(): void {
  initLangSwitch(update404Content);
}
