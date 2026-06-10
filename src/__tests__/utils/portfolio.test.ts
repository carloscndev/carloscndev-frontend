import { describe, it, expect, beforeEach } from "vitest";
import {
  updatePortfolioContent,
  initPortfolioLangSwitch,
  initPortfolioAccordion,
} from "../../utils/portfolio";

describe("portfolio", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("updatePortfolioContent", () => {
    it("should update portfolio content from embedded JSON for es", () => {
      const data = {
        es: {
          title: "Portafolio",
          intro: "Intro ES",
          view_more: "Ver mas",
          projects: [
            {
              id: "p1",
              title: "Project 1",
              description: "Desc",
              technologies: ["React"],
              links: { repo: "#" },
            },
          ],
        },
        en: {
          title: "Portfolio",
          intro: "Intro EN",
          view_more: "View more",
          projects: [
            {
              id: "p1",
              title: "Project 1 EN",
              description: "Desc EN",
              technologies: ["React"],
              links: { repo: "#" },
            },
          ],
        },
      };
      const el = document.createElement("script");
      el.id = "portfolio-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      document.body.innerHTML += `
        <p data-portfolio-title></p>
        <p data-portfolio-intro></p>
        <a data-portfolio-viewmore><span></span></a>
        <div data-project-id="p1">
          <span data-project-title></span>
          <span data-project-description></span>
          <button data-project-view-more><span>Ver mas</span></button>
        </div>
      `;

      updatePortfolioContent("es");

      const title = document.querySelector("[data-portfolio-title]")!;
      expect(title.textContent).toBe("Portafolio");
      const viewMoreSpan = document.querySelector(
        "[data-portfolio-viewmore] span",
      )!;
      expect(viewMoreSpan.textContent).toBe("Ver mas");
    });

    it("should update portfolio content for en locale", () => {
      const data = {
        es: {
          title: "Portafolio",
          intro: "Intro ES",
          view_more: "Ver mas",
          projects: [],
        },
        en: {
          title: "Portfolio",
          intro: "Intro EN",
          view_more: "View more",
          projects: [],
        },
      };
      const el = document.createElement("script");
      el.id = "portfolio-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      const container = document.createElement("div");
      container.innerHTML = `
        <p data-portfolio-title></p>
        <p data-portfolio-intro></p>
      `;
      document.body.appendChild(container);

      updatePortfolioContent("en");

      const title = document.querySelector("[data-portfolio-title]")!;
      expect(title.textContent).toBe("Portfolio");
    });

    it("should update project tags with technology pills", () => {
      const data = {
        es: {
          title: "Portafolio",
          intro: "Intro",
          view_more: "Ver mas",
          projects: [
            {
              id: "p1",
              title: "Project 1",
              description: "Desc",
              technologies: ["React", "TypeScript", "Node"],
              links: {},
            },
          ],
        },
      };
      const el = document.createElement("script");
      el.id = "portfolio-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      const container = document.createElement("div");
      container.innerHTML = `
        <div data-project-id="p1">
          <span data-project-tags></span>
        </div>
      `;
      document.body.appendChild(container);

      updatePortfolioContent("es");

      const tags = document.querySelector("[data-project-tags]")!;
      expect(tags.innerHTML).toContain("tech-pill");
      expect(tags.innerHTML).toContain("React");
      expect(tags.innerHTML).toContain("TypeScript");
      expect(tags.innerHTML).toContain("Node");
    });

    it("should create project links with correct attributes", () => {
      const data = {
        es: {
          title: "Portafolio",
          intro: "Intro",
          view_more: "Ver mas",
          projects: [
            {
              id: "p1",
              title: "Project 1",
              description: "Desc",
              technologies: [],
              links: {
                repo: "https://github.com/repo",
                demo: "https://demo.com",
                article: "https://article.com",
              },
            },
          ],
        },
      };
      const el = document.createElement("script");
      el.id = "portfolio-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      const container = document.createElement("div");
      container.innerHTML = `
        <div data-project-id="p1">
          <div data-project-links></div>
        </div>
      `;
      document.body.appendChild(container);

      updatePortfolioContent("es");

      const linksContainer = document.querySelector("[data-project-links]")!;
      const anchors = linksContainer.querySelectorAll("a");
      expect(anchors).toHaveLength(3);
      expect(anchors[0].href).toBe("https://github.com/repo");
      expect(anchors[0].target).toBe("_blank");
      expect(anchors[0].rel).toBe("noopener");
      expect(anchors[0].getAttribute("aria-label")).toBe("Repository");
    });

    it("should not render link if not present in links object", () => {
      const data = {
        es: {
          title: "Portafolio",
          intro: "Intro",
          view_more: "Ver mas",
          projects: [
            {
              id: "p1",
              title: "Project 1",
              description: "Desc",
              technologies: [],
              links: { repo: "https://github.com/repo" },
            },
          ],
        },
      };
      const el = document.createElement("script");
      el.id = "portfolio-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      const container = document.createElement("div");
      container.innerHTML = `
        <div data-project-id="p1">
          <div data-project-links></div>
        </div>
      `;
      document.body.appendChild(container);

      updatePortfolioContent("es");

      const linksContainer = document.querySelector("[data-project-links]")!;
      const anchors = linksContainer.querySelectorAll("a");
      expect(anchors).toHaveLength(1);
      expect(anchors[0].getAttribute("aria-label")).toBe("Repository");
    });

    it("should handle missing data element gracefully", () => {
      document.body.innerHTML = `
        <p data-portfolio-title></p>
      `;

      expect(() => updatePortfolioContent("es")).not.toThrow();
    });

    it("should handle empty data text content", () => {
      const el = document.createElement("script");
      el.id = "portfolio-data";
      el.textContent = "";
      document.body.appendChild(el);

      document.body.innerHTML = `
        <p data-portfolio-title></p>
      `;

      expect(() => updatePortfolioContent("es")).not.toThrow();
    });

    it("should handle missing locale data", () => {
      const data = {
        es: {
          title: "Portafolio",
          intro: "Intro",
          view_more: "Ver mas",
          projects: [],
        },
      };
      const el = document.createElement("script");
      el.id = "portfolio-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      document.body.innerHTML = `
        <p data-portfolio-title></p>
      `;

      expect(() => updatePortfolioContent("en")).not.toThrow();
    });

    it("should update multiple project containers with same id", () => {
      const data = {
        es: {
          title: "Portafolio",
          intro: "Intro",
          view_more: "Ver mas",
          projects: [
            {
              id: "p1",
              title: "Project 1",
              description: "Desc",
              technologies: [],
              links: {},
            },
          ],
        },
      };
      const el = document.createElement("script");
      el.id = "portfolio-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      const container = document.createElement("div");
      container.innerHTML = `
        <div data-project-id="p1">
          <span data-project-title></span>
        </div>
        <div data-project-id="p1">
          <span data-project-title></span>
        </div>
      `;
      document.body.appendChild(container);

      updatePortfolioContent("es");

      const titles = document.querySelectorAll("[data-project-title]");
      expect(titles).toHaveLength(2);
      expect(titles[0].textContent).toBe("Project 1");
      expect(titles[1].textContent).toBe("Project 1");
    });
  });

  describe("initPortfolioAccordion", () => {
    it("should bind accordion triggers", () => {
      document.body.innerHTML = `
        <div data-portfolio-accordion>
          <div data-accordion-item>
            <button data-accordion-trigger>Click</button>
            <div data-accordion-panel>Content</div>
          </div>
        </div>
      `;

      initPortfolioAccordion();

      const trigger = document.querySelector(
        "[data-accordion-trigger]",
      ) as HTMLElement;
      expect(trigger).toBeTruthy();
    });

    it("should do nothing if document is undefined", () => {
      const globalDoc = global.document;
      // @ts-expect-error - testing undefined document
      global.document = undefined;

      expect(() => initPortfolioAccordion()).not.toThrow();

      global.document = globalDoc;
    });
  });

  describe("initPortfolioLangSwitch", () => {
    it("should initialize lang switch listener", () => {
      document.body.innerHTML = `
        <script id="portfolio-data" type="application/json">{"es":{"title":"Portafolio","intro":"","view_more":"","projects":[]}}</script>
      `;

      expect(() => initPortfolioLangSwitch()).not.toThrow();
    });
  });
});
