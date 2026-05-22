import type { Lang } from "./lang";
import { initLangSwitch } from "./common";

interface ContactAttributes {
  title: string;
  status_message: string;
  button_text: string;
  mail_to: string;
  footer: string;
}

interface EmbeddedContactData {
  es: ContactAttributes;
  en: ContactAttributes;
}

function updateContactContent(lang: Lang): void {
  if (typeof document === "undefined") return;

  const dataEl = document.getElementById("contact-data");
  if (!dataEl?.textContent) return;

  const allData: EmbeddedContactData = JSON.parse(dataEl.textContent);
  const data = allData[lang];
  if (!data) return;

  const titleEl = document.querySelector<HTMLElement>("[data-contact-title]");
  if (titleEl) titleEl.textContent = data.title;

  const statusEl = document.querySelector<HTMLElement>("[data-contact-status]");
  if (statusEl) statusEl.textContent = data.status_message;

  const btnEl = document.querySelector<HTMLElement>("[data-contact-button]");
  if (btnEl) {
    btnEl.textContent = data.button_text;
    btnEl.setAttribute("href", data.mail_to);
  }

  const footerEl = document.querySelector<HTMLElement>("[data-contact-footer]");
  if (footerEl) footerEl.textContent = data.footer;
}

export function initContactLangSwitch(): void {
  initLangSwitch(updateContactContent);
}
