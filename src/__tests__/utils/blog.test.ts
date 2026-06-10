import { describe, it, expect, beforeEach } from "vitest";
import {
  updateBlogEntries,
  initBlogLangSwitch,
  initBlogAccordion,
} from "../../utils/blog";

describe("blog", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("updateBlogEntries", () => {
    it("should update blog entries from embedded JSON for es", () => {
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

      const container = document.createElement("div");
      container.innerHTML = `
        <p data-blog-intro></p>
        <a data-blog-viewmore><span></span></a>
        <div data-post-id="post-01">
          <span data-post-title></span>
          <span data-post-category></span>
          <span data-post-date></span>
          <span data-post-read-time></span>
          <span data-post-resume></span>
        </div>
      `;
      document.body.appendChild(container);

      updateBlogEntries("es");

      const intro = document.querySelector("[data-blog-intro]")!;
      expect(intro.textContent).toBe("Blog ES");
      const title = document.querySelector("[data-post-title]")!;
      expect(title.textContent).toBe("Titulo");
    });

    it("should update blog entries for en locale", () => {
      const data = {
        es: {
          title: "Blog",
          intro: "Blog ES",
          view_more: "Ver más",
          posts: [],
        },
        en: {
          title: "Blog",
          intro: "Blog EN",
          view_more: "View more",
          posts: [],
        },
      };
      const el = document.createElement("script");
      el.id = "blog-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      const container = document.createElement("div");
      container.innerHTML = `<p data-blog-intro></p>`;
      document.body.appendChild(container);

      updateBlogEntries("en");

      const intro = document.querySelector("[data-blog-intro]")!;
      expect(intro.textContent).toBe("Blog EN");
    });

    it("should update view more text", () => {
      const data = {
        es: {
          title: "Blog",
          intro: "Intro",
          view_more: "Ver más",
          posts: [],
        },
      };
      const el = document.createElement("script");
      el.id = "blog-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      const container = document.createElement("div");
      container.innerHTML = `<a data-blog-viewmore><span></span></a>`;
      document.body.appendChild(container);

      updateBlogEntries("es");

      const viewMore = document.querySelector("[data-blog-viewmore] span")!;
      expect(viewMore.textContent).toBe("Ver más");
    });

    it("should update post category with space", () => {
      const data = {
        es: {
          title: "Blog",
          intro: "Intro",
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
      };
      const el = document.createElement("script");
      el.id = "blog-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      const container = document.createElement("div");
      container.innerHTML = `
        <div data-post-id="post-01">
          <span data-post-category><text>Category</text></span>
        </div>
      `;
      document.body.appendChild(container);

      updateBlogEntries("es");

      const category = document.querySelector("[data-post-category]")!;
      expect(category.textContent).toBe("Tech ");
    });

    it("should update post date", () => {
      const data = {
        es: {
          title: "Blog",
          intro: "Intro",
          view_more: "Ver más",
          posts: [
            {
              id: "post-01",
              title: "Titulo",
              category: "Tech",
              date: "2025-01-15",
              read_time: "5 min",
            },
          ],
        },
      };
      const el = document.createElement("script");
      el.id = "blog-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      const container = document.createElement("div");
      container.innerHTML = `
        <div data-post-id="post-01">
          <span data-post-date></span>
        </div>
      `;
      document.body.appendChild(container);

      updateBlogEntries("es");

      const date = document.querySelector("[data-post-date]")!;
      expect(date.textContent).toBe("2025-01-15");
    });

    it("should update post read time", () => {
      const data = {
        es: {
          title: "Blog",
          intro: "Intro",
          view_more: "Ver más",
          posts: [
            {
              id: "post-01",
              title: "Titulo",
              category: "Tech",
              date: "2025",
              read_time: "5 min de lectura",
            },
          ],
        },
      };
      const el = document.createElement("script");
      el.id = "blog-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      const container = document.createElement("div");
      container.innerHTML = `
        <div data-post-id="post-01">
          <span data-post-read-time></span>
        </div>
      `;
      document.body.appendChild(container);

      updateBlogEntries("es");

      const readTime = document.querySelector("[data-post-read-time]")!;
      expect(readTime.textContent).toBe("5 min de lectura");
    });

    it("should update post resume", () => {
      const data = {
        es: {
          title: "Blog",
          intro: "Intro",
          view_more: "Ver más",
          posts: [
            {
              id: "post-01",
              title: "Titulo",
              category: "Tech",
              date: "2025",
              read_time: "5 min",
              resume: "Short summary",
            },
          ],
        },
      };
      const el = document.createElement("script");
      el.id = "blog-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      const container = document.createElement("div");
      container.innerHTML = `
        <div data-post-id="post-01">
          <span data-post-resume></span>
        </div>
      `;
      document.body.appendChild(container);

      updateBlogEntries("es");

      const resume = document.querySelector("[data-post-resume]")!;
      expect(resume.textContent).toBe("Short summary");
    });

    it("should handle missing resume gracefully", () => {
      const data = {
        es: {
          title: "Blog",
          intro: "Intro",
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
      };
      const el = document.createElement("script");
      el.id = "blog-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      const container = document.createElement("div");
      container.innerHTML = `<span data-post-resume></span>`;
      document.body.appendChild(container);

      updateBlogEntries("es");

      const resume = document.querySelector("[data-post-resume]")!;
      expect(resume.textContent).toBe("");
    });

    it("should update multiple cards with same post id", () => {
      const data = {
        es: {
          title: "Blog",
          intro: "Intro",
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
      };
      const el = document.createElement("script");
      el.id = "blog-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      const container = document.createElement("div");
      container.innerHTML = `
        <div data-post-id="post-01">
          <span data-post-title></span>
        </div>
        <div data-post-id="post-01">
          <span data-post-title></span>
        </div>
      `;
      document.body.appendChild(container);

      updateBlogEntries("es");

      const titles = document.querySelectorAll("[data-post-title]");
      expect(titles).toHaveLength(2);
      expect(titles[0].textContent).toBe("Titulo");
      expect(titles[1].textContent).toBe("Titulo");
    });

    it("should handle missing data element", () => {
      document.body.innerHTML = `<p data-blog-intro></p>`;
      expect(() => updateBlogEntries("es")).not.toThrow();
    });

    it("should handle empty data text content", () => {
      const el = document.createElement("script");
      el.id = "blog-data";
      el.textContent = "";
      document.body.appendChild(el);

      document.body.innerHTML = `<p data-blog-intro></p>`;
      expect(() => updateBlogEntries("es")).not.toThrow();
    });

    it("should handle missing locale data", () => {
      const data = {
        es: {
          title: "Blog",
          intro: "Intro",
          view_more: "Ver más",
          posts: [],
        },
      };
      const el = document.createElement("script");
      el.id = "blog-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      document.body.innerHTML = `<p data-blog-intro></p>`;
      expect(() => updateBlogEntries("en")).not.toThrow();
    });
  });

  describe("initBlogAccordion", () => {
    it("should bind accordion triggers", () => {
      document.body.innerHTML = `
        <div data-blog-accordion>
          <div data-accordion-item>
            <button data-accordion-trigger>Click</button>
            <div data-accordion-panel>Content</div>
          </div>
        </div>
      `;

      initBlogAccordion();

      const trigger = document.querySelector(
        "[data-accordion-trigger]",
      ) as HTMLElement;
      expect(trigger).toBeTruthy();
    });

    it("should open panel on trigger click", () => {
      document.body.innerHTML = `
        <div data-blog-accordion>
          <div data-accordion-item>
            <button data-accordion-trigger>Click</button>
            <div data-accordion-panel>Content</div>
          </div>
        </div>
      `;

      initBlogAccordion();

      const trigger = document.querySelector(
        "[data-accordion-trigger]",
      ) as HTMLButtonElement;
      trigger.click();

      const panel = document.querySelector("[data-accordion-panel]")!;
      expect(panel.classList.contains("blog-accordion__panel--open")).toBe(
        true,
      );
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
    });

    it("should close panel on second click", () => {
      document.body.innerHTML = `
        <div data-blog-accordion>
          <div data-accordion-item>
            <button data-accordion-trigger>Click</button>
            <div data-accordion-panel>Content</div>
          </div>
        </div>
      `;

      initBlogAccordion();

      const trigger = document.querySelector(
        "[data-accordion-trigger]",
      ) as HTMLButtonElement;
      trigger.click();
      trigger.click();

      const panel = document.querySelector("[data-accordion-panel]")!;
      expect(panel.classList.contains("blog-accordion__panel--open")).toBe(
        false,
      );
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
    });

    it("should close other panels when opening a panel", () => {
      document.body.innerHTML = `
        <div data-blog-accordion>
          <div data-accordion-item>
            <button data-accordion-trigger>Trigger 1</button>
            <div data-accordion-panel>Panel 1</div>
          </div>
          <div data-accordion-item>
            <button data-accordion-trigger>Trigger 2</button>
            <div data-accordion-panel>Panel 2</div>
          </div>
        </div>
      `;

      initBlogAccordion();

      const trigger1 = document.querySelectorAll(
        "[data-accordion-trigger]",
      )[0] as HTMLButtonElement;
      const trigger2 = document.querySelectorAll(
        "[data-accordion-trigger]",
      )[1] as HTMLButtonElement;

      trigger1.click();
      trigger2.click();

      const panel1 = document.querySelectorAll(
        "[data-accordion-panel]",
      )[0] as HTMLElement;
      const panel2 = document.querySelectorAll(
        "[data-accordion-panel]",
      )[1] as HTMLElement;

      expect(panel1.classList.contains("blog-accordion__panel--open")).toBe(
        false,
      );
      expect(panel2.classList.contains("blog-accordion__panel--open")).toBe(
        true,
      );
    });

    it("should not toggle if click is on a link inside trigger", () => {
      document.body.innerHTML = `
        <div data-blog-accordion>
          <div data-accordion-item>
            <button data-accordion-trigger>
              <a href="#" class="blog-accordion__trigger-link">Link</a>
            </button>
            <div data-accordion-panel>Content</div>
          </div>
        </div>
      `;

      initBlogAccordion();

      const link = document.querySelector(
        ".blog-accordion__trigger-link",
      ) as HTMLAnchorElement;
      link.click();

      const panel = document.querySelector("[data-accordion-panel]")!;
      expect(panel.classList.contains("blog-accordion__panel--open")).toBe(
        false,
      );
    });

    it("should do nothing if document is undefined", () => {
      const globalDoc = global.document;
      // @ts-expect-error - testing undefined document
      global.document = undefined;

      expect(() => initBlogAccordion()).not.toThrow();

      global.document = globalDoc;
    });
  });

  describe("initBlogLangSwitch", () => {
    it("should initialize lang switch listener", () => {
      document.body.innerHTML = `
        <script id="blog-data" type="application/json">{"es":{"title":"Blog","intro":"","view_more":"","posts":[]}}</script>
      `;

      expect(() => initBlogLangSwitch()).not.toThrow();
    });
  });
});
