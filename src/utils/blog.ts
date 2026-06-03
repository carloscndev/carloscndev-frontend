import type { Lang } from "./lang";
import {
  getCurrentLang,
  initLangSwitch,
  cloneAndReplace,
  closeAllPanelsExcept,
} from "./common";

interface BlogPost {
  id: string;
  title: string;
  resume?: string;
  read_time: string;
  date: string;
  category: string;
  icon: string;
  image: string;
  link: string;
}

interface BlogData {
  title: string;
  intro: string;
  view_more: string;
  posts: BlogPost[];
}

export function updateBlogEntries(lang: Lang): void {
  if (typeof document === "undefined") return;

  const dataEl = document.getElementById("blog-data");
  if (!dataEl || !dataEl.textContent) return;

  const allData: Record<string, BlogData> = JSON.parse(dataEl.textContent);
  const blogData = allData[lang];
  if (!blogData) return;

  const introEl = document.querySelector("[data-blog-intro]");
  if (introEl) introEl.textContent = blogData.intro;

  const viewMoreEl = document.querySelector("[data-blog-viewmore]");
  if (viewMoreEl) {
    const span = viewMoreEl.querySelector("span");
    if (span) span.textContent = blogData.view_more;
  }

  blogData.posts.forEach((post) => {
    const cards = document.querySelectorAll(`[data-post-id="${post.id}"]`);
    cards.forEach((card) => {
      const titleEl = card.querySelector("[data-post-title]");
      if (titleEl) titleEl.textContent = post.title;

      const categoryEl = card.querySelector("[data-post-category]");
      if (categoryEl) categoryEl.textContent = post.category;

      const dateEl = card.querySelector("[data-post-date]");
      if (dateEl) dateEl.textContent = post.date;

      const readTimeEl = card.querySelector("[data-post-read-time]");
      if (readTimeEl) readTimeEl.textContent = post.read_time;

      const resumeEl = card.querySelector("[data-post-resume]");
      if (resumeEl) resumeEl.textContent = post.resume || "";
    });
  });
}

function bindBlogAccordion(): void {
  if (typeof document === "undefined") return;

  const triggers = document.querySelectorAll<HTMLElement>(
    "[data-blog-accordion] [data-accordion-trigger]",
  );

  triggers.forEach((trigger) => {
    const cloned = cloneAndReplace(trigger);

    cloned.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.closest(".blog-accordion__trigger-link")) return;

      const item = cloned.closest("[data-accordion-item]");
      if (!item) return;

      const panel = item.querySelector<HTMLElement>("[data-accordion-panel]");
      if (!panel) return;

      const isOpen = panel.classList.contains("blog-accordion__panel--open");

      if (isOpen) {
        panel.classList.remove("blog-accordion__panel--open");
        cloned.setAttribute("aria-expanded", "false");
      } else {
        closeAllPanelsExcept(
          panel,
          "[data-blog-accordion]",
          "[data-accordion-panel]",
          "[data-accordion-trigger]",
          "blog-accordion__panel--open",
        );
        panel.classList.add("blog-accordion__panel--open");
        cloned.setAttribute("aria-expanded", "true");
      }
    });
  });
}

export function initBlogLangSwitch(): void {
  initLangSwitch(updateBlogEntries);

  // Sync content immediately in case astro:page-load already fired.
  if (typeof document === "undefined") return;
  updateBlogEntries(getCurrentLang());
}

export function initBlogAccordion(): void {
  if (typeof document === "undefined") return;
  bindBlogAccordion();
  document.addEventListener("astro:page-load", () => {
    bindBlogAccordion();
  });
}
