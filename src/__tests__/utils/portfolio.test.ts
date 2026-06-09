import { describe, it, expect, beforeEach } from "vitest";
import { updatePortfolioContent } from "../../utils/portfolio";

describe("portfolio", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should update portfolio content from embedded JSON", () => {
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
});
