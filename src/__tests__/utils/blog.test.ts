import { describe, it, expect, beforeEach } from "vitest";
import { updateBlogEntries } from "../../utils/blog";

describe("blog", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should update blog entries from embedded JSON", () => {
    const data = {
      es: {
        title: "Blog",
        intro: "Blog ES",
        view_more: "Ver más",
        posts: [
          {
            id: "post-01",
            title: "Titulo",
            category: "Tech",
            date: "2025",
            read_time: "5 min",
          },
        ],
      },
      en: {
        title: "Blog",
        intro: "Blog EN",
        view_more: "View more",
        posts: [
          {
            id: "post-01",
            title: "Title",
            category: "Technology",
            date: "2025",
            read_time: "5 min",
          },
        ],
      },
    };
    const el = document.createElement("script");
    el.id = "blog-data";
    el.textContent = JSON.stringify(data);
    document.body.appendChild(el);

    document.body.innerHTML += `
      <p data-blog-intro></p>
      <div data-post-id="post-01">
        <span data-post-title></span>
        <span data-post-category></span>
        <span data-post-date></span>
        <span data-post-read-time></span>
      </div>
    `;

    updateBlogEntries("es");

    const intro = document.querySelector("[data-blog-intro]")!;
    expect(intro.textContent).toBe("Blog ES");
    const title = document.querySelector("[data-post-title]")!;
    expect(title.textContent).toBe("Titulo");
  });
});
