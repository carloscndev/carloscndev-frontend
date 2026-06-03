import { describe, it, expect, beforeEach } from "vitest";
import { updateBlogPostContent } from "../../utils/blog-post";

describe("blog-post", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.documentElement.lang = "es";
  });

  it("should update blog post content from embedded JSON", () => {
    const data = {
      es: {
        title: "Test Title",
        date: "2025",
        author: "dev",
        category: "tech",
        icon: "tech-icon",
        content: "<p>Hello ES</p>",
      },
      en: {
        title: "Test EN",
        date: "2025",
        author: "dev",
        category: "tech",
        icon: "tech-icon",
        content: "<p>Hello EN</p>",
      },
    };
    const dict = {
      es: {
        "post.author_prefix": "Autor:",
        "post.back_to_home": "Volver al inicio",
      },
      en: {
        "post.author_prefix": "Author:",
        "post.back_to_home": "Back to home",
      },
    };

    const dataEl = document.createElement("script");
    dataEl.id = "blog-post-data";
    dataEl.textContent = JSON.stringify(data);
    document.body.appendChild(dataEl);

    const dictEl = document.createElement("script");
    dictEl.id = "blog-post-dict";
    dictEl.textContent = JSON.stringify(dict);
    document.body.appendChild(dictEl);

    document.body.innerHTML += `
      <h1 data-post-hero-title></h1>
      <p data-post-hero-meta></p>
      <div data-post-content></div>
      <a data-post-back-home href="/"><span>Volver al inicio</span></a>
    `;

    updateBlogPostContent("es");

    const title = document.querySelector("[data-post-hero-title]")!;
    expect(title.textContent).toBe("Test Title");
    const meta = document.querySelector("[data-post-hero-meta]")!;
    expect(meta.textContent).toContain("2025");
    expect(meta.textContent).toContain("Autor:");
    expect(meta.textContent).toContain("dev");
    const content = document.querySelector("[data-post-content]")!;
    expect(content.innerHTML).toBe("<p>Hello ES</p>");
    const backHome = document.querySelector("[data-post-back-home] span")!;
    expect(backHome.textContent).toBe("Volver al inicio");
  });
});
