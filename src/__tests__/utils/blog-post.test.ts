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
        readTime: "5 min de lectura",
        authorName: "Carlos CN",
        authorNickname: "carloscndev",
        authorAvatar: "https://example.com/avatar.jpg",
        category: "tech",
        icon: "tech-icon",
        content: "<p>Hello ES</p>",
      },
      en: {
        title: "Test EN",
        date: "2025",
        readTime: "5 min read",
        authorName: "Carlos CN",
        authorNickname: "carloscndev",
        authorAvatar: "https://example.com/avatar.jpg",
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
      <div data-post-hero-meta>
        <div data-post-meta-left>
          <span data-post-date></span>
          <span data-post-readtime></span>
        </div>
        <div data-post-meta-right>
          <img data-post-author-avatar />
          <div data-post-author-info>
            <span data-post-author-name></span>
            <span data-post-author-nickname></span>
          </div>
        </div>
      </div>
      <div data-post-content></div>
      <a data-post-back-home href="/"><span>Volver al inicio</span></a>
    `;

    updateBlogPostContent("es");

    const title = document.querySelector("[data-post-hero-title]")!;
    expect(title.textContent).toBe("Test Title");
    const dateEl = document.querySelector("[data-post-date]")!;
    expect(dateEl.textContent).toBe("2025");
    const readtimeEl = document.querySelector("[data-post-readtime]")!;
    expect(readtimeEl.textContent).toBe("5 min de lectura");
    const authorNameEl = document.querySelector("[data-post-author-name]")!;
    expect(authorNameEl.textContent).toBe("Carlos CN");
    const authorNicknameEl = document.querySelector(
      "[data-post-author-nickname]",
    )!;
    expect(authorNicknameEl.textContent).toBe("@carloscndev");
    const authorAvatarEl = document.querySelector(
      "[data-post-author-avatar]",
    ) as HTMLImageElement;
    expect(authorAvatarEl.src).toBe("https://example.com/avatar.jpg");
    const content = document.querySelector("[data-post-content]")!;
    expect(content.innerHTML).toBe("<p>Hello ES</p>");
    const backHome = document.querySelector("[data-post-back-home] span")!;
    expect(backHome.textContent).toBe("Volver al inicio");
  });
});
