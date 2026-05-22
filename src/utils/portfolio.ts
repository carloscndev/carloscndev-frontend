import type { Lang } from "./lang";
import {
  initLangSwitch,
  cloneAndReplace,
  closeAllPanelsExcept,
} from "./common";

interface ProjectLink {
  repo?: string;
  demo?: string;
  article?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  links: ProjectLink;
}

interface PortfolioAttributes {
  title: string;
  intro: string;
  view_more: string;
  projects: Project[];
}

interface EmbeddedPortfolioData {
  es: PortfolioAttributes;
  en: PortfolioAttributes;
}

/* ------------------------------------------------------------------ */
/*  Static SVG templates (used for client-side link rebuild)          */
/* ------------------------------------------------------------------ */

const GithubIcon_SVG = `<svg role="img" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>`;

const ExternalLink_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>`;

const FileIcon_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`;

export function updatePortfolioContent(lang: Lang): void {
  if (typeof document === "undefined") return;

  const dataEl = document.getElementById("portfolio-data");
  if (!dataEl?.textContent) return;

  const allData: EmbeddedPortfolioData = JSON.parse(dataEl.textContent);
  const data = allData[lang];
  if (!data) return;

  const titleEl = document.querySelector<HTMLElement>("[data-portfolio-title]");
  if (titleEl) titleEl.textContent = data.title;

  const introEl = document.querySelector<HTMLElement>("[data-portfolio-intro]");
  if (introEl) introEl.textContent = data.intro;

  const viewMoreEl = document.querySelector<HTMLElement>(
    "[data-portfolio-viewmore]",
  );
  if (viewMoreEl) {
    const span = viewMoreEl.querySelector("span");
    if (span) span.textContent = data.view_more;
  }

  data.projects.forEach((project) => {
    const containers = document.querySelectorAll<HTMLElement>(
      `[data-project-id="${project.id}"]`,
    );

    containers.forEach((container) => {
      const titleElement = container.querySelector<HTMLElement>(
        "[data-project-title]",
      );
      if (titleElement) titleElement.textContent = project.title;

      const descElement = container.querySelector<HTMLElement>(
        "[data-project-description]",
      );
      if (descElement) descElement.textContent = project.description;

      const tagsContainers = container.querySelectorAll<HTMLElement>(
        "[data-project-tags]",
      );
      tagsContainers.forEach((tc) => {
        tc.innerHTML = project.technologies
          .map((t) => `<span>${t}</span>`)
          .join("");
      });

      const linkContainers = container.querySelectorAll<HTMLElement>(
        "[data-project-links]",
      );
      linkContainers.forEach((lc) => {
        lc.innerHTML = "";

        if (project.links.repo) {
          const anchor = document.createElement("a");
          anchor.href = project.links.repo;
          anchor.className = "portfolio-card__link";
          anchor.target = "_blank";
          anchor.rel = "noopener";
          anchor.setAttribute("aria-label", "Repository");
          anchor.innerHTML = GithubIcon_SVG;
          lc.appendChild(anchor);
        }

        if (project.links.demo) {
          const anchor = document.createElement("a");
          anchor.href = project.links.demo;
          anchor.className = "portfolio-card__link";
          anchor.target = "_blank";
          anchor.rel = "noopener";
          anchor.setAttribute("aria-label", "Demo");
          anchor.innerHTML = ExternalLink_SVG;
          lc.appendChild(anchor);
        }

        if (project.links.article) {
          const anchor = document.createElement("a");
          anchor.href = project.links.article;
          anchor.className = "portfolio-card__link";
          anchor.target = "_blank";
          anchor.rel = "noopener";
          anchor.setAttribute("aria-label", "Article");
          anchor.innerHTML = FileIcon_SVG;
          lc.appendChild(anchor);
        }
      });
    });
  });
}

/* ------------------------------------------------------------------ */
/*  Accordion logic (mobile)                                           */
/* ------------------------------------------------------------------ */

function bindAccordionTriggers(): void {
  if (typeof document === "undefined") return;

  const triggers = document.querySelectorAll<HTMLElement>(
    "[data-portfolio-accordion] [data-accordion-trigger]",
  );

  triggers.forEach((trigger) => {
    const cloned = cloneAndReplace(trigger);

    cloned.addEventListener("click", () => {
      const item = cloned.closest("[data-accordion-item]");
      if (!item) return;

      const panel = item.querySelector<HTMLElement>("[data-accordion-panel]");
      if (!panel) return;

      const isOpen = panel.classList.contains(
        "portfolio-accordion__panel--open",
      );

      if (isOpen) {
        panel.classList.remove("portfolio-accordion__panel--open");
        cloned.setAttribute("aria-expanded", "false");
      } else {
        closeAllPanelsExcept(
          panel,
          "[data-portfolio-accordion]",
          "[data-accordion-panel]",
          "[data-accordion-trigger]",
          "portfolio-accordion__panel--open",
        );
        panel.classList.add("portfolio-accordion__panel--open");
        cloned.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* ------------------------------------------------------------------ */
/*  Entry points                                                      */
/* ------------------------------------------------------------------ */

export function initPortfolioLangSwitch(): void {
  initLangSwitch(updatePortfolioContent);
}

export function initPortfolioAccordion(): void {
  if (typeof document === "undefined") return;
  bindAccordionTriggers();

  document.addEventListener("astro:page-load", () => {
    bindAccordionTriggers();
  });
}
