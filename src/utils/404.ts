import { initLangSwitch } from "./common";

interface Error404Data {
  title: string;
  message: string;
  button_text: string;
}

interface Locale404Data {
  error_404: Error404Data;
}

interface Full404Data {
  es: Locale404Data;
  en: Locale404Data;
}

export function update404Content(lang: string): void {
  if (typeof document === "undefined") return;

  const dataEl = document.getElementById("error-404-data");
  if (!dataEl?.textContent) return;

  const allData: Full404Data = JSON.parse(dataEl.textContent);
  const data = allData[lang]?.error_404;
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
