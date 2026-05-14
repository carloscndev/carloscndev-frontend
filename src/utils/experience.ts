import type { Lang } from "./lang";

function updateExperienceContent(lang: Lang): void {
  if (typeof document === "undefined") return;
  const dataEl = document.getElementById("experience-data");
  if (!dataEl?.textContent) return;
  const data = JSON.parse(dataEl.textContent)[lang];

  const title = document.querySelector("[data-experience-title]");
  if (title) title.textContent = data.title;

  data.jobs.forEach((job: any) => {
    const panels = document.querySelectorAll(
      `[data-panel="${job.id}"], [data-slide="${job.id}"]`,
    );
    panels.forEach((p) => {
      const role = p.querySelector("[data-job-role]");
      if (role) role.textContent = job.role;
      const desc = p.querySelector("[data-job-description]");
      if (desc)
        desc.innerHTML = `<p>${job.description_p1}</p><p>${job.description_p2}</p>`;
    });
  });
}

export function initExperienceTabs(): void {
  if (typeof document === "undefined") return;
  const tabs = document.querySelectorAll<HTMLElement>("[data-tab]");
  const panels = document.querySelectorAll<HTMLElement>("[data-panel]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.dataset.tab;
      tabs.forEach((t) => t.classList.remove("experience-tabs__tab--active"));
      panels.forEach((p) =>
        p.classList.remove("experience-tabs__panel--active"),
      );

      tab.classList.add("experience-tabs__tab--active");
      document
        .querySelector(`[data-panel="${id}"]`)
        ?.classList.add("experience-tabs__panel--active");
    });
  });
}

export function initExperienceCarousel(): void {
  if (typeof document === "undefined") return;
  const track = document.querySelector<HTMLElement>("[data-carousel-track]");
  const dots = document.querySelectorAll<HTMLElement>("[data-dot]");

  if (!track || !dots.length) return;

  // Click en dots
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      track.scrollTo({
        left: track.offsetWidth * i,
        behavior: "smooth",
      });
    });
  });

  // Sync scroll con dots
  track.addEventListener("scroll", () => {
    const index = Math.round(track.scrollLeft / track.offsetWidth);
    dots.forEach((d, i) =>
      d.classList.toggle("experience-carousel__dot--active", i === index),
    );
  });
}

export function initExperienceLangSwitch(): void {
  if (typeof document === "undefined") return;
  window.addEventListener("langchange", (e: any) =>
    updateExperienceContent(e.detail.lang),
  );
}
