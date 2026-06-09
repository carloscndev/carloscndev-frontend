import type { Lang } from "./lang";
import { initLangSwitch } from "./common";

interface BlogPost {
  title: string;
  date: string;
  readTime: string;
  authorName: string;
  authorNickname: string;
  authorAvatar: string;
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

  const heroTitle = document.querySelector("[data-post-hero-title]");
  const contentEl = document.querySelector("[data-post-content]");
  const backHomeEl = document.querySelector("[data-post-back-home]");

  if (heroTitle) heroTitle.textContent = post.title;

  const dateEl = document.querySelector("[data-post-date]");
  const readtimeEl = document.querySelector("[data-post-readtime]");
  const authorNameEl = document.querySelector("[data-post-author-name]");
  const authorNicknameEl = document.querySelector(
    "[data-post-author-nickname]",
  );
  const authorAvatarEl = document.querySelector("[data-post-author-avatar]");

  if (dateEl) dateEl.textContent = post.date;
  if (readtimeEl) readtimeEl.textContent = post.readTime;
  if (authorNameEl) authorNameEl.textContent = post.authorName;
  if (authorNicknameEl)
    authorNicknameEl.textContent = `@${post.authorNickname}`;

  if (authorAvatarEl) {
    const imgEl = authorAvatarEl as HTMLImageElement;
    if (post.authorAvatar) {
      imgEl.src = post.authorAvatar;
      imgEl.alt = post.authorName;
      imgEl.style.display = "block";
    } else {
      imgEl.style.display = "none";
    }
  }

  if (contentEl) contentEl.innerHTML = post.content;

  const backHomeText = dict[lang]?.["post.back_to_home"] || "Back to home";
  if (backHomeEl) {
    const span = backHomeEl.querySelector("span");
    if (span) span.textContent = backHomeText;
  }
}

export function initBlogPostLangSwitch(): void {
  initLangSwitch(updateBlogPostContent);
}
