import { describe, it, expect } from "vitest";

describe("experience", () => {
  it("should update experience content from embedded JSON", async () => {
    document.body.innerHTML = "";
    const data = {
      es: {
        title: "Experiencia",
        jobs: [
          {
            id: "c3ai",
            role: "Engineer",
            description: "<p>Paragraph 1</p><p>Paragraph 2</p>",
          },
        ],
      },
      en: {
        title: "Experience",
        jobs: [
          {
            id: "c3ai",
            role: "Engineer EN",
            description: "<p>Paragraph 1 EN</p><p>Paragraph 2 EN</p>",
          },
        ],
      },
    };
    const el = document.createElement("script");
    el.id = "experience-data";
    el.textContent = JSON.stringify(data);
    document.body.appendChild(el);

    document.body.innerHTML += `
      <p data-experience-title></p>
      <div data-panel="c3ai">
        <span data-job-role></span>
        <div data-job-description></div>
      </div>
    `;

    const { updateExperienceContent } = await import("../../utils/experience");
    updateExperienceContent("es");

    const title = document.querySelector("[data-experience-title]")!;
    expect(title.textContent).toBe("Experiencia");
    const role = document.querySelector("[data-job-role]")!;
    expect(role.textContent).toBe("Engineer");
    const desc = document.querySelector("[data-job-description]")!;
    expect(desc.innerHTML).toContain("<p>Paragraph 1</p>");
    expect(desc.innerHTML).toContain("<p>Paragraph 2</p>");
  });
});
