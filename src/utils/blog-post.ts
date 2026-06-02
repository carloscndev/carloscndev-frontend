import type { Lang } from "./lang";
import { initLangSwitch } from "./common";

interface BlogPost {
  title: string;
  date: string;
  author: string;
  category: string;
  icon: string;
  content: string;
}

interface BlogPostData {
  es: BlogPost | null;
  en: BlogPost | null;
}

interface UIDict {
  es: Record<string, string>;
  en: Record<string, string>;
}

export function updateBlogPostContent(lang: Lang): void {
  if (typeof document === "undefined") return;

  const dataEl = document.getElementById("blog-post-data");
  const dictEl = document.getElementById("blog-post-dict");

  if (!dataEl?.textContent || !dictEl?.textContent) return;

  const allData: BlogPostData = JSON.parse(dataEl.textContent);
  const dict: UIDict = JSON.parse(dictEl.textContent);

  const post = allData[lang];
  if (!post) return;

  const authorPrefix = dict[lang]?.["post.author_prefix"] || "Autor:";

  const heroTitle = document.querySelector("[data-post-hero-title]");
  const heroMeta = document.querySelector("[data-post-hero-meta]");
  const contentEl = document.querySelector("[data-post-content]");

  if (heroTitle) heroTitle.textContent = post.title;
  if (heroMeta)
    heroMeta.textContent = `${post.date} \u00A0${authorPrefix} ${post.author}`;

  if (contentEl) contentEl.innerHTML = post.content;
}

export function initBlogPostLangSwitch(): void {
  initLangSwitch(updateBlogPostContent);
}
