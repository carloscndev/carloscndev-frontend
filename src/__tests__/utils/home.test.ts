import { describe, it, expect, beforeEach } from "vitest";
import { updateHomeContent } from "../../utils/home";

describe("home", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.documentElement.lang = "es";
  });

  it("should update home content from embedded JSON", () => {
    const data = {
      es: {
        intro: "Hola",
        title: "Carlos",
        subtitle: "Dev",
        content: "<p>Test</p>",
        avatarPaths: { default: "hello.png" },
      },
      en: {
        intro: "Hi",
        title: "Carlos",
        subtitle: "Dev",
        content: "<p>Test EN</p>",
        avatarPaths: { default: "hello.png" },
      },
    };
    const jsonEl = document.createElement("script");
    jsonEl.id = "home-data";
    jsonEl.type = "application/json";
    jsonEl.textContent = JSON.stringify(data);
    document.body.appendChild(jsonEl);

    document.body.innerHTML += `
      <p data-home-intro></p>
      <p data-home-title></p>
      <div class="home-section__subtitle"></div>
      <div data-home-content></div>
    `;

    updateHomeContent("es");

    const intro = document.querySelector("[data-home-intro]")!;
    expect(intro.textContent).toBe("Hola");
    const title = document.querySelector("[data-home-title]")!;
    expect(title.textContent).toBe("Carlos");
  });
});
