import type { Lang } from "./lang";

interface Job {
  id: string;
  company: string;
  role: string;
  period: string;
  description_p1: string;
  description_p2: string;
  technologies: string[];
}

interface ExperienceAttributes {
  title: string;
  intro: string;
  jobs: Job[];
  locale: string;
}

interface EmbeddedExperienceData {
  es: ExperienceAttributes;
  en: ExperienceAttributes;
}

function updateExperienceContent(lang: Lang): void {
  if (typeof document === "undefined") return;
  const dataEl = document.getElementById("experience-data");
  if (!dataEl?.textContent) return;
  const allData: EmbeddedExperienceData = JSON.parse(dataEl.textContent);
  const data = allData[lang];
  if (!data) return;

  const titleEl = document.querySelector<HTMLElement>(
    "[data-experience-title]",
  );
  if (titleEl) titleEl.textContent = data.title;
  const introEl = document.querySelector<HTMLElement>(
    "[data-experience-intro]",
  );
  if (introEl) introEl.textContent = data.intro;

  data.jobs.forEach((job) => {
    // Update ALL matching elements (both desktop panel and mobile slide)
    const panels = document.querySelectorAll(
      `[data-panel="${job.id}"], [data-slide="${job.id}"]`,
    );
    panels.forEach((panel) => {
      const roleEl = panel.querySelector<HTMLElement>("[data-job-role]");
      if (roleEl) roleEl.textContent = job.role;
      const companyEl = panel.querySelector<HTMLElement>("[data-job-company]");
      if (companyEl) companyEl.textContent = `@${job.company}`;
      const periodEl = panel.querySelector<HTMLElement>("[data-job-period]");
      if (periodEl) periodEl.textContent = job.period;
      const descEl = panel.querySelector<HTMLElement>("[data-job-description]");
      if (descEl)
        descEl.innerHTML = `<p>${job.description_p1}</p><p>${job.description_p2}</p>`;
      const tagsEl = panel.querySelector<HTMLElement>("[data-job-tags]");
      if (tagsEl) {
        tagsEl.innerHTML = "";
        const isMobile = tagsEl.closest(".experience-carousel") !== null;
        const tagClass = isMobile
          ? "experience-carousel__tag"
          : "experience-tabs__tag";
        job.technologies.forEach((tech) => {
          const span = document.createElement("span");
          span.className = tagClass;
          span.textContent = tech;
          tagsEl.appendChild(span);
        });
      }
    });
  });
}

function bindTabListeners(): void {
  const tabs = document.querySelectorAll<HTMLButtonElement>("[data-tab]");
  tabs.forEach((tab) => {
    const newTab = tab.cloneNode(true) as HTMLButtonElement;
    tab.replaceWith(newTab);
    newTab.addEventListener("click", () => {
      const tabId = newTab.dataset.tab;
      document
        .querySelectorAll<HTMLButtonElement>("[data-tab]")
        .forEach((t) => {
          t.classList.remove("experience-tabs__tab--active");
          t.setAttribute("aria-selected", "false");
        });
      newTab.classList.add("experience-tabs__tab--active");
      newTab.setAttribute("aria-selected", "true");
      document.querySelectorAll<HTMLElement>("[data-panel]").forEach((p) => {
        p.classList.remove("experience-tabs__panel--active");
        if (p.dataset.panel === tabId)
          p.classList.add("experience-tabs__panel--active");
      });
    });
  });
}

function updateDotState(activeIndex: number): void {
  document
    .querySelectorAll<HTMLElement>("[data-carousel-dots] [data-dot]")
    .forEach((dot, i) => {
      dot.classList.toggle(
        "experience-carousel__dot--active",
        i === activeIndex,
      );
    });
}

function bindCarouselLogic(): void {
  const track = document.querySelector<HTMLElement>("[data-carousel-track]");
  const slides = document.querySelectorAll<HTMLElement>("[data-slide]");
  if (!track || slides.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Array.from(slides).indexOf(entry.target as HTMLElement);
          if (idx >= 0) updateDotState(idx);
        }
      });
    },
    { root: track, threshold: 0.5 },
  );
  slides.forEach((slide) => observer.observe(slide));

  const dots = document.querySelectorAll<HTMLElement>("[data-dot]");
  dots.forEach((dot, idx) => {
    dot.removeEventListener("click", () => {});
    dot.addEventListener("click", () => {
      slides[idx].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    });
  });
}

function handleLangChange(e: Event): void {
  const { lang } = (e as CustomEvent<{ lang: Lang }>).detail;
  updateExperienceContent(lang);
}

export function initExperienceLangSwitch(): void {
  if (typeof document === "undefined") return;
  window.addEventListener("langchange", handleLangChange);
  document.addEventListener("astro:page-load", () => {
    window.addEventListener("langchange", handleLangChange);
    const currentLang = (document.documentElement.lang || "es") as Lang;
    updateExperienceContent(currentLang);
  });
}

export function initExperienceTabs(): void {
  if (typeof document === "undefined") return;
  bindTabListeners();
  document.addEventListener("astro:page-load", () => bindTabListeners());
}

export function initExperienceCarousel(): void {
  if (typeof document === "undefined") return;
  bindCarouselLogic();
  document.addEventListener("astro:page-load", () => bindCarouselLogic());
}
