import { describe, it, expect, beforeEach } from "vitest";

describe("about", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should update about content from embedded JSON", async () => {
    const data = {
      es: {
        title: "Sobre mi",
        contentText: "<p>ES text</p>",
        technologies: [{ name: "React", icon: "diamond" }],
        avatarPath: "working.png",
      },
      en: {
        title: "About me",
        contentText: "<p>EN text</p>",
        technologies: [{ name: "React", icon: "diamond" }],
        avatarPath: "working.png",
      },
    };
    const jsonEl = document.createElement("script");
    jsonEl.id = "about-data";
    jsonEl.type = "application/json";
    jsonEl.textContent = JSON.stringify(data);
    document.body.appendChild(jsonEl);

    const template = document.createElement("template");
    template.id = "tech-chip-template";
    template.innerHTML = "<span data-tech-name></span>";
    document.body.appendChild(template);

    document.body.innerHTML += `
      <p data-about-title></p>
      <div data-about-content></div>
      <div data-about-tech></div>
    `;

    const { updateAboutContent } = await import("../../utils/about");
    updateAboutContent("es");

    const title = document.querySelector("[data-about-title]")!;
    expect(title.textContent).toBe("Sobre mi");
  });
});
