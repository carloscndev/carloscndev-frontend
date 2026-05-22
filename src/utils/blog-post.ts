import type { Lang } from "./lang";
import { initLangSwitch } from "./common";

interface BlogPostContent {
  type: string;
  text: string;
}

interface BlogPost {
  id: string;
  title: string;
  date: string;
  author: string;
  header_image: string;
  category: string;
  icon: string;
  content: BlogPostContent[];
}

interface BlogPostLocaleData {
  posts: BlogPost[];
}

interface BlogPostData {
  es: BlogPostLocaleData;
  en: BlogPostLocaleData;
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

  const posts = allData[lang]?.posts;
  if (!posts) return;

  const authorPrefix = dict[lang]?.["post.author_prefix"] || "Autor:";

  const heroTitle = document.querySelector("[data-post-hero-title]");
  const heroMeta = document.querySelector("[data-post-hero-meta]");
  const contentPs = document.querySelectorAll("[data-post-content-p]");

  const currentPath = window.location.pathname;
  const slug = currentPath.split("/").pop() || "";

  const post = posts.find((p) => p.id === slug);
  if (!post) return;

  if (heroTitle) heroTitle.textContent = post.title;
  if (heroMeta)
    heroMeta.textContent = `${post.date}  ${authorPrefix} ${post.author}`;

  contentPs.forEach((p, i) => {
    if (post.content[i]) {
      p.textContent = post.content[i].text;
    }
  });
}

export function initBlogPostLangSwitch(): void {
  initLangSwitch(updateBlogPostContent);
}
