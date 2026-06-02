import type { Lang } from "./lang";
import { initLangSwitch } from "./common";

interface ContactAttributes {
  title: string;
  statusMessage: string;
  buttonText: string;
  mailTo: string;
  footer: string;
}

interface EmbeddedContactData {
  es: ContactAttributes;
  en: ContactAttributes;
}

export function updateContactContent(lang: Lang): void {
  if (typeof document === "undefined") return;

  const dataEl = document.getElementById("contact-data");
  if (!dataEl?.textContent) return;

  const allData: EmbeddedContactData = JSON.parse(dataEl.textContent);
  const data = allData[lang];
  if (!data) return;

  const titleEl = document.querySelector<HTMLElement>("[data-contact-title]");
  if (titleEl) titleEl.textContent = data.title;

  const statusEl = document.querySelector<HTMLElement>("[data-contact-status]");
  if (statusEl) statusEl.textContent = data.statusMessage;

  const btnEl = document.querySelector<HTMLElement>("[data-contact-button]");
  if (btnEl) {
    btnEl.textContent = data.buttonText;
    btnEl.setAttribute("href", data.mailTo);
  }

  const footerEl = document.querySelector<HTMLElement>("[data-contact-footer]");
  if (footerEl) footerEl.textContent = data.footer;
}

export function initContactLangSwitch(): void {
  initLangSwitch(updateContactContent);
}
