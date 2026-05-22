import type { Lang } from "./lang";
import { initLangSwitch } from "./common";

interface TechItem {
  name: string;
  icon: string;
}

interface AboutAttributes {
  title: string;
  contentText: string;
  technologies: TechItem[];
  image: string;
  avatarPath: string;
}

interface EmbeddedAboutData {
  es: AboutAttributes;
  en: AboutAttributes;
}

function updateAboutContent(lang: Lang): void {
  if (typeof document === "undefined") return;

  const dataEl = document.getElementById("about-data");
  if (!dataEl?.textContent) return;

  const allData: EmbeddedAboutData = JSON.parse(dataEl.textContent);
  const data = allData[lang];
  if (!data) return;

  const titleEl = document.querySelector<HTMLElement>("[data-about-title]");
  if (titleEl) titleEl.textContent = data.title;

  const contentEl = document.querySelector<HTMLElement>("[data-about-content]");
  if (contentEl) contentEl.innerHTML = data.contentText;

  const techContainer =
    document.querySelector<HTMLElement>("[data-about-tech]");
  const template = document.getElementById(
    "tech-chip-template",
  ) as HTMLTemplateElement;

  if (techContainer && template && data.technologies) {
    techContainer.innerHTML = "";

    data.technologies.forEach((tech) => {
      const clone = template.content.cloneNode(true) as DocumentFragment;
      const textSpan = clone.querySelector("[data-tech-name]");
      if (textSpan) textSpan.textContent = tech.name;
      techContainer.appendChild(clone);
    });
  }

  const avatarImg = document.getElementById("about-avatar") as HTMLImageElement;
  if (avatarImg && data.avatarPath) {
    avatarImg.src = data.avatarPath;
  }
}

export function initAboutLangSwitch(): void {
  initLangSwitch(updateAboutContent);
}
