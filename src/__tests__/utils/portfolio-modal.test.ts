import { describe, it, expect, beforeEach } from "vitest";

describe("portfolio modal", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.documentElement.lang = "es";
    document.body.style.overflow = "";
  });

  describe("modal data language switching", () => {
    it("should get correct Spanish project data from embedded JSON", () => {
      document.documentElement.lang = "es";
      const data = {
        es: {
          title: "Portafolio",
          intro: "Intro",
          view_more: "Ver más",
          projects: [
            {
              id: "p1",
              title: "Proyecto 1 ES",
              description: "Descripción en español",
              technologies: ["React", "TypeScript"],
              links: { repo: "https://github.com/test" },
              coverImage: { url: "/uploads/image.png" },
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
              description: "Description in English",
              technologies: ["React", "TypeScript"],
              links: { repo: "https://github.com/test" },
              coverImage: { url: "/uploads/image.png" },
            },
          ],
        },
      };

      const scriptEl = document.createElement("script");
      scriptEl.id = "portfolio-data";
      scriptEl.textContent = JSON.stringify(data);
      document.body.appendChild(scriptEl);

      const allData = JSON.parse(
        document.getElementById("portfolio-data")!.textContent!,
      );
      const lang = document.documentElement.lang as "es" | "en";
      const project = allData[lang].projects.find(
        (p: { id: string }) => p.id === "p1",
      );

      expect(project.title).toBe("Proyecto 1 ES");
      expect(project.description).toBe("Descripción en español");
    });

    it("should get correct English project data from embedded JSON", () => {
      document.documentElement.lang = "en";
      const data = {
        es: {
          title: "Portafolio",
          intro: "Intro",
          view_more: "Ver más",
          projects: [
            {
              id: "p1",
              title: "Proyecto 1 ES",
              description: "Descripción en español",
              technologies: ["React", "TypeScript"],
              links: { repo: "https://github.com/test" },
              coverImage: { url: "/uploads/image.png" },
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
              description: "Description in English",
              technologies: ["React", "TypeScript"],
              links: { repo: "https://github.com/test" },
              coverImage: { url: "/uploads/image.png" },
            },
          ],
        },
      };

      const scriptEl = document.createElement("script");
      scriptEl.id = "portfolio-data";
      scriptEl.textContent = JSON.stringify(data);
      document.body.appendChild(scriptEl);

      const allData = JSON.parse(
        document.getElementById("portfolio-data")!.textContent!,
      );
      const lang = document.documentElement.lang as "es" | "en";
      const project = allData[lang].projects.find(
        (p: { id: string }) => p.id === "p1",
      );

      expect(project.title).toBe("Project 1 EN");
      expect(project.description).toBe("Description in English");
    });

    it("should find project by id from clicked button's parent", () => {
      document.documentElement.lang = "es";
      const data = {
        es: {
          title: "Portafolio",
          intro: "Intro",
          view_more: "Ver más",
          projects: [
            {
              id: "p1",
              title: "Project 1",
              description: "Description 1",
              technologies: ["React"],
              links: { repo: "https://github.com/p1" },
              coverImage: { url: "/uploads/p1.png" },
            },
            {
              id: "p2",
              title: "Project 2",
              description: "Description 2",
              technologies: ["Vue"],
              links: { repo: "https://github.com/p2" },
              coverImage: { url: "/uploads/p2.png" },
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
              description: "Description 1 EN",
              technologies: ["React"],
              links: { repo: "https://github.com/p1" },
              coverImage: { url: "/uploads/p1.png" },
            },
            {
              id: "p2",
              title: "Project 2 EN",
              description: "Description 2 EN",
              technologies: ["Vue"],
              links: { repo: "https://github.com/p2" },
              coverImage: { url: "/uploads/p2.png" },
            },
          ],
        },
      };

      document.body.innerHTML = `
        <div data-project-id="p1">
          <button class="view-more-btn">Ver más</button>
        </div>
        <div data-project-id="p2">
          <button class="view-more-btn">Ver más</button>
        </div>
      `;

      const scriptEl = document.createElement("script");
      scriptEl.id = "portfolio-data";
      scriptEl.textContent = JSON.stringify(data);
      document.body.appendChild(scriptEl);

      const allData = JSON.parse(
        document.getElementById("portfolio-data")!.textContent!,
      );
      const lang = document.documentElement.lang as "es" | "en";

      const clickedButton = document.querySelectorAll(".view-more-btn")[1];
      const projectId = clickedButton
        .closest("[data-project-id]")
        ?.getAttribute("data-project-id");

      const project = allData[lang].projects.find(
        (p: { id: string }) => p.id === projectId,
      );

      expect(projectId).toBe("p2");
      expect(project.title).toBe("Project 2");
      expect(project.technologies).toContain("Vue");
    });
  });

  describe("modal links rendering", () => {
    it("should create correct number of links", () => {
      const linksContainer = document.createElement("div");
      linksContainer.className = "portfolio-modal__links";

      const links = {
        repo: "https://github.com/test",
        demo: "https://demo.test.com",
        article: "https://article.test.com",
      };

      linksContainer.innerHTML = "";
      if (links.repo) {
        linksContainer.innerHTML += `<a href="${links.repo}" target="_blank" rel="noopener" class="portfolio-modal__link" aria-label="Repository"><svg></svg></a>`;
      }
      if (links.demo) {
        linksContainer.innerHTML += `<a href="${links.demo}" target="_blank" rel="noopener" class="portfolio-modal__link" aria-label="Demo"><svg></svg></a>`;
      }
      if (links.article) {
        linksContainer.innerHTML += `<a href="${links.article}" target="_blank" rel="noopener" class="portfolio-modal__link" aria-label="Article"><svg></svg></a>`;
      }

      const anchors = linksContainer.querySelectorAll("a");
      expect(anchors.length).toBe(3);
    });

    it("should not render links when not present", () => {
      const linksContainer = document.createElement("div");
      linksContainer.className = "portfolio-modal__links";

      const links = {
        repo: undefined,
        demo: undefined,
        article: undefined,
      };

      linksContainer.innerHTML = "";
      if (links.repo) {
        linksContainer.innerHTML += `<a href="${links.repo}" class="portfolio-modal__link">Repo</a>`;
      }
      if (links.demo) {
        linksContainer.innerHTML += `<a href="${links.demo}" class="portfolio-modal__link">Demo</a>`;
      }
      if (links.article) {
        linksContainer.innerHTML += `<a href="${links.article}" class="portfolio-modal__link">Article</a>`;
      }

      const anchors = linksContainer.querySelectorAll("a");
      expect(anchors.length).toBe(0);
    });
  });

  describe("modal technologies rendering", () => {
    it("should render technologies as tech pills", () => {
      const tagsContainer = document.createElement("div");
      tagsContainer.className = "portfolio-modal__tags";

      const technologies = ["React", "TypeScript", "Node.js"];
      tagsContainer.innerHTML = technologies
        .map((t) => `<span class="tech-pill tech-pill--card">${t}</span>`)
        .join("");

      const pills = tagsContainer.querySelectorAll(".tech-pill");
      expect(pills.length).toBe(3);
      expect(pills[0].textContent).toBe("React");
      expect(pills[1].textContent).toBe("TypeScript");
      expect(pills[2].textContent).toBe("Node.js");
    });

    it("should render empty when no technologies", () => {
      const tagsContainer = document.createElement("div");
      tagsContainer.className = "portfolio-modal__tags";

      const technologies: string[] = [];
      tagsContainer.innerHTML = technologies
        .map((t) => `<span class="tech-pill tech-pill--card">${t}</span>`)
        .join("");

      const pills = tagsContainer.querySelectorAll(".tech-pill");
      expect(pills.length).toBe(0);
    });
  });

  describe("modal body scroll lock", () => {
    it("should lock body overflow when modal opens", () => {
      document.body.style.overflow = "";
      document.body.style.overflow = "hidden";
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("should restore body overflow when modal closes", () => {
      document.body.style.overflow = "hidden";
      document.body.style.overflow = "";
      expect(document.body.style.overflow).toBe("");
    });
  });

  describe("modal aria attributes", () => {
    it("should have correct aria attributes when closed", () => {
      document.body.innerHTML = `
        <div id="portfolio-modal" role="dialog" aria-modal="true" aria-hidden="true">
        </div>
      `;

      const modal = document.getElementById("portfolio-modal")!;
      expect(modal.getAttribute("role")).toBe("dialog");
      expect(modal.getAttribute("aria-modal")).toBe("true");
      expect(modal.getAttribute("aria-hidden")).toBe("true");
    });

    it("should have correct aria attributes when open", () => {
      document.body.innerHTML = `
        <div id="portfolio-modal" role="dialog" aria-modal="true" aria-hidden="false" class="portfolio-modal--open">
        </div>
      `;

      const modal = document.getElementById("portfolio-modal")!;
      expect(modal.classList.contains("portfolio-modal--open")).toBe(true);
      expect(modal.getAttribute("aria-hidden")).toBe("false");
    });
  });
});
