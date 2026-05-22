import { describe, it, expect, beforeEach } from "vitest";

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
            description_p1: "P1",
            description_p2: "P2",
          },
        ],
      },
      en: {
        title: "Experience",
        jobs: [
          {
            id: "c3ai",
            role: "Engineer EN",
            description_p1: "P1 EN",
            description_p2: "P2 EN",
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
  });
});
