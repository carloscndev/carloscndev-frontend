import type { Lang } from "./lang";
import { getCurrentLang } from "./common";
import { initLangSwitch } from "./common";

export function updateExperienceContent(lang: Lang): void {
  if (typeof document === "undefined") return;
  const dataEl = document.getElementById("experience-data");
  if (!dataEl?.textContent) return;
  const allData = JSON.parse(dataEl.textContent);
  const data = allData[lang];
  if (!data || !Array.isArray(data.jobs)) return;

  const title = document.querySelector("[data-experience-title]");
  if (title) title.textContent = data.title;

  const intro = document.querySelector("[data-experience-intro]");
  if (intro) intro.textContent = data.intro;

  // Update tab labels (desktop) by index — Strapi id differs per locale
  const tabs = document.querySelectorAll<HTMLElement>("[data-tab]");
  tabs.forEach((tab, idx) => {
    const job = data.jobs[idx];
    if (!job) return;
    const companySpan = tab.querySelector(".experience-tabs__tab-company");
    if (companySpan) companySpan.textContent = job.company;
  });

  // Update desktop panels by index
  const panels = document.querySelectorAll<HTMLElement>("[data-panel]");
  panels.forEach((panel, idx) => {
    const job = data.jobs[idx];
    if (!job) return;

    const role = panel.querySelector("[data-job-role]");
    if (role) role.textContent = job.role;

    const company = panel.querySelector("[data-job-company]");
    if (company) company.textContent = `@${job.company}`;

    const period = panel.querySelector("[data-job-period]");
    if (period) period.textContent = job.period;

    const desc = panel.querySelector("[data-job-description]");
    if (desc && typeof job.description === "string")
      desc.innerHTML = job.description;

    const tags = panel.querySelector("[data-job-tags]");
    if (tags && Array.isArray(job.technologies)) {
      tags.innerHTML = job.technologies
        .map((t) => `<span class="tech-pill">${t}</span>`)
        .join("");
    }
  });

  // Update mobile carousel slides by index
  const slides = document.querySelectorAll<HTMLElement>("[data-slide]");
  slides.forEach((slide, idx) => {
    const job = data.jobs[idx];
    if (!job) return;

    const role = slide.querySelector("[data-job-role]");
    if (role) role.textContent = job.role;

    const company = slide.querySelector("[data-job-company]");
    if (company) company.textContent = `@${job.company}`;

    const period = slide.querySelector("[data-job-period]");
    if (period) period.textContent = job.period;

    const desc = slide.querySelector("[data-job-description]");
    if (desc && typeof job.description === "string")
      desc.innerHTML = job.description;

    const tags = slide.querySelector("[data-job-tags]");
    if (tags && Array.isArray(job.technologies)) {
      tags.innerHTML = job.technologies
        .map((t) => `<span class="tech-pill">${t}</span>`)
        .join("");
    }
  });
}

/* ------------------------------------------------------------------ */
/*  Carousel dot logic (mobile)                                       */
/* ------------------------------------------------------------------ */

function bindCarouselLogic(): void {
  if (typeof document === "undefined") return;
  const track = document.querySelector<HTMLElement>("[data-carousel-track]");
  const dots = document.querySelectorAll<HTMLElement>("[data-dot]");

  if (!track || !dots.length) return;

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      track.scrollTo({
        left: track.offsetWidth * i,
        behavior: "smooth",
      });
    });
  });

  const scrollHandler = () => {
    const index = Math.round(track.scrollLeft / track.offsetWidth);
    document
      .querySelectorAll<HTMLElement>("[data-dot]")
      .forEach((d, i) =>
        d.classList.toggle("experience-carousel__dot--active", i === index),
      );
  };
  track.addEventListener("scroll", scrollHandler);
}

/* ------------------------------------------------------------------ */
/*  Tab logic (desktop)                                               */
/* ------------------------------------------------------------------ */

function bindTabListeners(): void {
  if (typeof document === "undefined") return;
  const tabs = document.querySelectorAll<HTMLElement>("[data-tab]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.dataset.tab;
      document
        .querySelectorAll<HTMLElement>("[data-tab]")
        .forEach((t) => t.classList.remove("experience-tabs__tab--active"));
      document
        .querySelectorAll<HTMLElement>("[data-panel]")
        .forEach((p) => p.classList.remove("experience-tabs__panel--active"));
      tab.classList.add("experience-tabs__tab--active");
      document
        .querySelector(`[data-panel="${id}"]`)
        ?.classList.add("experience-tabs__panel--active");
    });
  });
}

export function initExperienceTabs(): void {
  if (typeof document === "undefined") return;
  bindTabListeners();

  document.addEventListener("astro:page-load", () => {
    bindTabListeners();
  });
}

export function initExperienceCarousel(): void {
  if (typeof document === "undefined") return;
  bindCarouselLogic();

  document.addEventListener("astro:page-load", () => {
    bindCarouselLogic();
  });
}

export function initExperienceLangSwitch(): void {
  initLangSwitch(updateExperienceContent);

  document.addEventListener("astro:page-load", () => {
    updateExperienceContent(getCurrentLang());
  });

  updateExperienceContent(getCurrentLang());
}
