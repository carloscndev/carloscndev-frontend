import type { Lang } from "./lang";

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
/*  Inline SVG icon strings (match the Astro icon component visuals)  */
/* ------------------------------------------------------------------ */

const GITHUB_SVG = (size: number) =>
  `<svg role="img" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" style="display:inline-flex;align-items:center"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`;

const ExternalLink_SVG = (size: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="${size}" height="${size}"><path d="M21 22H3V4h8V2H3a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-8h-2v6zM16 2v2h4.59L8.59 16 10 17.41 22 5.41V10h2V2h-8z"/></svg>`;

const FILE_SVG = (size: number) =>
  `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${size}" height="${size}" style="display:inline-flex;align-items:center"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`;

/* ------------------------------------------------------------------ */
/*  Helper: rebuild links container                                   */
/* ------------------------------------------------------------------ */

function buildLinkElements(
  links: ProjectLink,
  container: HTMLElement,
  linkClass: string,
  iconSize: number,
): void {
  container.innerHTML = "";

  if (links.repo) {
    const a = document.createElement("a");
    a.href = links.repo;
    a.className = linkClass;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", "Repository");
    a.innerHTML = GITHUB_SVG(iconSize);
    container.appendChild(a);
  }

  if (links.demo) {
    const a = document.createElement("a");
    a.href = links.demo;
    a.className = linkClass;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", "Demo");
    a.innerHTML = ExternalLink_SVG(iconSize);
    container.appendChild(a);
  }

  if (links.article) {
    const a = document.createElement("a");
    a.href = links.article;
    a.className = linkClass;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", "Article");
    a.innerHTML = FILE_SVG(iconSize);
    container.appendChild(a);
  }
}

/* ------------------------------------------------------------------ */
/*  Helper: rebuild tags container                                    */
/* ------------------------------------------------------------------ */

function buildTagElements(
  technologies: string[],
  container: HTMLElement,
  tagClass: string,
): void {
  container.innerHTML = "";

  technologies.forEach((tech) => {
    const span = document.createElement("span");
    span.className = tagClass;
    span.textContent = tech;
    container.appendChild(span);
  });
}

/* ------------------------------------------------------------------ */
/*  Core: update all portfolio content for a given language           */
/* ------------------------------------------------------------------ */

function updatePortfolioContent(lang: Lang): void {
  if (typeof document === "undefined") return;

  const dataEl = document.getElementById("portfolio-data");
  if (!dataEl?.textContent) return;

  const allData: EmbeddedPortfolioData = JSON.parse(dataEl.textContent);
  const data = allData[lang];
  if (!data) return;

  /* --- Section-level text --- */
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

  /* --- Per-project updates --- */
  data.projects.forEach((project) => {
    const containers = document.querySelectorAll<HTMLElement>(
      `[data-project-id="${project.id}"]`,
    );

    containers.forEach((container) => {
      /* Title */
      const titleElement = container.querySelector<HTMLElement>(
        "[data-project-title]",
      );
      if (titleElement) titleElement.textContent = project.title;

      /* Description */
      const descElement = container.querySelector<HTMLElement>(
        "[data-project-description]",
      );
      if (descElement) descElement.textContent = project.description;

      /* Tags */
      const tagsContainer = container.querySelector<HTMLElement>(
        "[data-project-tags]",
      );
      if (tagsContainer) {
        const tagClass = "tech-pill tech-pill--card";
        buildTagElements(project.technologies, tagsContainer, tagClass);
      }

      /* Links */
      const linksContainer = container.querySelector<HTMLElement>(
        "[data-project-links]",
      );
      if (linksContainer) {
        const linkClass = linksContainer.classList.contains(
          "portfolio-accordion__links",
        )
          ? "portfolio-accordion__link"
          : "portfolio-card__link";
        const iconSize = linkClass === "portfolio-accordion__link" ? 16 : 18;
        buildLinkElements(project.links, linksContainer, linkClass, iconSize);
      }
    });
  });
}

/* ------------------------------------------------------------------ */
/*  Lang-switch event handler                                         */
/* ------------------------------------------------------------------ */

function handleLangChange(e: Event): void {
  const { lang } = (e as CustomEvent<{ lang: Lang }>).detail;
  updatePortfolioContent(lang);
}

export function initPortfolioLangSwitch(): void {
  if (typeof document === "undefined") return;

  window.addEventListener("langchange", handleLangChange);

  document.addEventListener("astro:page-load", () => {
    window.removeEventListener("langchange", handleLangChange);
    window.addEventListener("langchange", handleLangChange);

    const currentLang = (document.documentElement.lang || "es") as Lang;
    updatePortfolioContent(currentLang);
  });
}

/* ------------------------------------------------------------------ */
/*  Accordion logic                                                   */
/* ------------------------------------------------------------------ */

function closeAllPanelsExcept(activePanel: HTMLElement | null): void {
  const allPanels = document.querySelectorAll<HTMLElement>(
    "[data-accordion-panel]",
  );
  const allTriggers = document.querySelectorAll<HTMLElement>(
    "[data-accordion-trigger]",
  );

  allPanels.forEach((panel) => {
    if (panel !== activePanel) {
      panel.classList.remove("portfolio-accordion__panel--open");
    }
  });

  allTriggers.forEach((trigger) => {
    const panel = trigger
      .closest("[data-accordion-item]")
      ?.querySelector<HTMLElement>("[data-accordion-panel]");
    if (panel && panel !== activePanel) {
      trigger.setAttribute("aria-expanded", "false");
    }
  });
}

function bindAccordionTriggers(): void {
  if (typeof document === "undefined") return;

  const triggers = document.querySelectorAll<HTMLElement>(
    "[data-accordion-trigger]",
  );

  triggers.forEach((trigger) => {
    const cloned = trigger.cloneNode(true) as HTMLElement;
    trigger.replaceWith(cloned);

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
        closeAllPanelsExcept(panel);
        panel.classList.add("portfolio-accordion__panel--open");
        cloned.setAttribute("aria-expanded", "true");
      }
    });
  });
}

export function initPortfolioAccordion(): void {
  if (typeof document === "undefined") return;

  bindAccordionTriggers();

  document.addEventListener("astro:page-load", () => {
    bindAccordionTriggers();
  });
}
