import type { Lang } from "./lang";

interface BlogPost {
  id: string;
  title: string;
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
    const card = document.querySelector(`[data-post-id="${post.id}"]`);
    if (!card) return;

    const titleEl = card.querySelector("[data-post-title]");
    if (titleEl) titleEl.textContent = post.title;

    const categoryEl = card.querySelector("[data-post-category]");
    if (categoryEl) categoryEl.textContent = post.category;

    const dateEl = card.querySelector("[data-post-date]");
    if (dateEl) dateEl.textContent = post.date;

    const readTimeEl = card.querySelector("[data-post-read-time]");
    if (readTimeEl) readTimeEl.textContent = post.read_time;
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
  });
}
