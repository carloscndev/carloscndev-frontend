import { describe, it, expect, beforeEach } from "vitest";
import { updateBlogPostContent } from "../../utils/blog-post";

describe("blog-post", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.documentElement.lang = "es";
  });

  it("should update blog post content from embedded JSON by URL slug", () => {
    const data = {
      es: {
        posts: [
          {
            id: "test-post",
            title: "Test Title",
            date: "2025",
            author: "dev",
            content: [{ type: "paragraph", text: "Hello" }],
          },
        ],
      },
      en: {
        posts: [
          {
            id: "test-post",
            title: "Test EN",
            date: "2025",
            author: "dev",
            content: [{ type: "paragraph", text: "Hello EN" }],
          },
        ],
      },
    };
    const dict = {
      es: { "post.author_prefix": "Autor:" },
      en: { "post.author_prefix": "Author:" },
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
      <p data-post-content-p></p>
    `;

    // Mock URL pathname
    Object.defineProperty(window, "location", {
      value: { pathname: "/blog/test-post" },
      writable: true,
    });

    updateBlogPostContent("es");

    const title = document.querySelector("[data-post-hero-title]")!;
    expect(title.textContent).toBe("Test Title");
    const meta = document.querySelector("[data-post-hero-meta]")!;
    expect(meta.textContent).toContain("2025");
    expect(meta.textContent).toContain("Autor:");
  });
});
