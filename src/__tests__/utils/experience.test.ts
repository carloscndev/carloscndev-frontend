import { describe, it, expect } from "vitest";

describe("experience", () => {
  it("should update experience content from embedded JSON by index", async () => {
    document.body.innerHTML = "";
    const data = {
      es: {
        title: "Experiencia",
        intro: "Intro ES",
        jobs: [
          {
            id: 1,
            company: "Acme ES",
            company_url: "https://acme.es",
            role: "Engineer ES",
            period: "2020–2021 ES",
            description: "<p>Paragraph 1 ES</p>",
            technologies: ["JS", "TS"],
          },
          {
            id: 2,
            company: "Globex ES",
            company_url: "https://globex.es",
            role: "Lead ES",
            period: "2021–2022 ES",
            description: "<p>Paragraph 2 ES</p>",
            technologies: ["Astro"],
          },
        ],
      },
      en: {
        title: "Experience",
        intro: "Intro EN",
        jobs: [
          {
            id: 3,
            company: "Acme EN",
            company_url: "https://acme.en",
            role: "Engineer EN",
            period: "2020–2021 EN",
            description: "<p>Paragraph 1 EN</p>",
            technologies: ["JS", "TS"],
          },
          {
            id: 4,
            company: "Globex EN",
            company_url: "https://globex.en",
            role: "Lead EN",
            period: "2021–2022 EN",
            description: "<p>Paragraph 2 EN</p>",
            technologies: ["Astro"],
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
      <p data-experience-intro></p>
      <button data-tab><span class="experience-tabs__tab-company"></span></button>
      <button data-tab><span class="experience-tabs__tab-company"></span></button>
      <div data-panel>
        <span data-job-role></span>
        <span data-job-company></span>
        <span data-job-period></span>
        <div data-job-description></div>
        <div data-job-tags><span class="tech-pill">JS</span><span class="tech-pill">TS</span></div>
      </div>
      <div data-panel>
        <span data-job-role></span>
        <span data-job-company></span>
        <span data-job-period></span>
        <div data-job-description></div>
        <div data-job-tags><span class="tech-pill">Astro</span></div>
      </div>
    `;

    const { updateExperienceContent } = await import("../../utils/experience");
    updateExperienceContent("en");

    const title = document.querySelector("[data-experience-title]")!;
    expect(title.textContent).toBe("Experience");

    const intro = document.querySelector("[data-experience-intro]")!;
    expect(intro.textContent).toBe("Intro EN");

    const tabLabels = document.querySelectorAll(
      ".experience-tabs__tab-company",
    );
    expect(tabLabels[0].textContent).toBe("Acme EN");
    expect(tabLabels[1].textContent).toBe("Globex EN");

    const panels = document.querySelectorAll("[data-panel]");
    expect(panels[0].querySelector("[data-job-role]")!.textContent).toBe(
      "Engineer EN",
    );
    expect(panels[0].querySelector("[data-job-company]")!.textContent).toBe(
      "@Acme EN",
    );
    expect(panels[0].querySelector("[data-job-period]")!.textContent).toBe(
      "2020–2021 EN",
    );
    expect(panels[0].querySelector("[data-job-description]")!.innerHTML).toBe(
      "<p>Paragraph 1 EN</p>",
    );
    const pills0 = panels[0].querySelectorAll("[data-job-tags] .tech-pill");
    expect(pills0[0].textContent).toBe("JS");
    expect(pills0[1].textContent).toBe("TS");

    expect(panels[1].querySelector("[data-job-role]")!.textContent).toBe(
      "Lead EN",
    );
    expect(panels[1].querySelector("[data-job-description]")!.innerHTML).toBe(
      "<p>Paragraph 2 EN</p>",
    );
    const pills1 = panels[1].querySelectorAll("[data-job-tags] .tech-pill");
    expect(pills1[0].textContent).toBe("Astro");
  });
});
