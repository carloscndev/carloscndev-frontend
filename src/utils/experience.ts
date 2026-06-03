import type { Lang } from "./lang";
import { getCurrentLang } from "./common";
import { initLangSwitch } from "./common";

export function updateExperienceContent(lang: Lang): void {
  if (typeof document === "undefined") return;
  const dataEl = document.getElementById("experience-data");
  if (!dataEl?.textContent) return;
  const data = JSON.parse(dataEl.textContent)[lang];

  const title = document.querySelector("[data-experience-title]");
  if (title) title.textContent = data.title;

  const intro = document.querySelector("[data-experience-intro]");
  if (intro) intro.textContent = data.intro;

  data.jobs.forEach((job: any) => {
    const panels = document.querySelectorAll(
      `[data-panel="${job.id}"], [data-slide="${job.id}"]`,
    );
    panels.forEach((p) => {
      const role = p.querySelector("[data-job-role]");
      if (role) role.textContent = job.role;

      const company = p.querySelector("[data-job-company]");
      if (company) company.textContent = `@${job.company}`;

      const period = p.querySelector("[data-job-period]");
      if (period) period.textContent = job.period;

      const desc = p.querySelector("[data-job-description]");
      if (desc && typeof job.description === "string")
        desc.innerHTML = job.description;

      const tags = p.querySelector("[data-job-tags]");
      if (tags && Array.isArray(job.technologies)) {
        tags.innerHTML = job.technologies
          .map(
            (tech: string) =>
              `<span class="experience-tabs__tag">${tech}</span>`,
          )
          .join("");
      }
    });
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
    const cloned = cloneAndReplace(dot);

    cloned.addEventListener("click", () => {
      track.scrollTo({
        left: track.offsetWidth * i,
        behavior: "smooth",
      });
    });
  });

  track.onscroll = null;
  track.addEventListener("scroll", () => {
    const index = Math.round(track.scrollLeft / track.offsetWidth);
    document
      .querySelectorAll<HTMLElement>("[data-dot]")
      .forEach((d, i) =>
        d.classList.toggle("experience-carousel__dot--active", i === index),
      );
  });
}

/* ------------------------------------------------------------------ */
/*  Tab logic (desktop)                                               */
/* ------------------------------------------------------------------ */

function bindTabListeners(): void {
  if (typeof document === "undefined") return;
  const tabs = document.querySelectorAll<HTMLElement>("[data-tab]");

  tabs.forEach((tab) => {
    const cloned = cloneAndReplace(tab);

    cloned.addEventListener("click", () => {
      const id = cloned.dataset.tab;
      document
        .querySelectorAll<HTMLElement>("[data-tab]")
        .forEach((t) => t.classList.remove("experience-tabs__tab--active"));
      document
        .querySelectorAll<HTMLElement>("[data-panel]")
        .forEach((p) => p.classList.remove("experience-tabs__panel--active"));
      cloned.classList.add("experience-tabs__tab--active");
      document
        .querySelector(`[data-panel="${id}"]`)
        ?.classList.add("experience-tabs__panel--active");
    });
  });
}

export function initExperienceTabs(): void {
  if (typeof document === "undefined") return;
  bindTabListeners();
}

export function initExperienceCarousel(): void {
  if (typeof document === "undefined") return;
  bindCarouselLogic();
}

export function initExperienceLangSwitch(): void {
  initLangSwitch(updateExperienceContent);

  // Sync content immediately in case astro:page-load already fired.
  if (typeof document === "undefined") return;
  updateExperienceContent(getCurrentLang());
}

document.addEventListener("astro:page-load", () => {
  bindTabListeners();
  bindCarouselLogic();
});
