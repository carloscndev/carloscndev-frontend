import type { Lang } from "./lang";

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
  blog: {
    title: string;
    intro: string;
    view_more: string;
    posts: BlogPost[];
  };
}

/**
 * Reads the embedded blog data JSON from the DOM and updates
 * all blog card elements to reflect the new language.
 */
export function updateBlogEntries(lang: Lang): void {
  if (typeof document === "undefined") return;

  const dataEl = document.getElementById("blog-data");
  if (!dataEl || !dataEl.textContent) return;

  const allData: Record<string, BlogData> = JSON.parse(dataEl.textContent);
  const blogData = allData[lang];
  if (!blogData) return;

  // Update intro text
  const introEl = document.querySelector("[data-blog-intro]");
  if (introEl) {
    introEl.textContent = blogData.blog.intro;
  }

  // Update each card by matching the data-post-id attribute
  blogData.blog.posts.forEach((post) => {
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

function bindBlogLangSwitch(): void {
  type LangChangeEvent = CustomEvent<{ lang: Lang }>;

  if (typeof window === "undefined") return;

  window.addEventListener("langchange", (e: Event) => {
    const { lang } = (e as LangChangeEvent).detail;
    updateBlogEntries(lang);
  });
}

/**
 * Initialize the blog language switch listener.
 * Re-binds on astro:page-load to handle Astro's DOM swapping.
 */
export function initBlogLangSwitch(): void {
  bindBlogLangSwitch();

  document.addEventListener("astro:page-load", () => {
    bindBlogLangSwitch();
    bindBlogAccordion();
  });
}

/* ------------------------------------------------------------------ */
/*  Blog accordion logic (mobile)                                     */
/* ------------------------------------------------------------------ */

function closeAllPanelsExcept(activePanel: HTMLElement | null): void {
  const allPanels = document.querySelectorAll<HTMLElement>(
    "[data-blog-accordion] [data-accordion-panel]",
  );
  const allTriggers = document.querySelectorAll<HTMLElement>(
    "[data-blog-accordion] [data-accordion-trigger]",
  );

  allPanels.forEach((panel) => {
    if (panel !== activePanel) {
      panel.classList.remove("blog-accordion__panel--open");
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

function bindBlogAccordion(): void {
  if (typeof document === "undefined") return;

  const triggers = document.querySelectorAll<HTMLElement>(
    "[data-blog-accordion] [data-accordion-trigger]",
  );

  triggers.forEach((trigger) => {
    const cloned = trigger.cloneNode(true) as HTMLElement;
    trigger.replaceWith(cloned);

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
        closeAllPanelsExcept(panel);
        panel.classList.add("blog-accordion__panel--open");
        cloned.setAttribute("aria-expanded", "true");
      }
    });
  });
}

export function initBlogAccordion(): void {
  if (typeof document === "undefined") return;
  bindBlogAccordion();
}
