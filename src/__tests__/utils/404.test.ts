import { describe, it, expect, beforeEach } from "vitest";
import { update404Content } from "../../utils/404";

describe("404", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should update 404 content from embedded JSON", () => {
    const data = {
      es: {
        title: "Ups!",
        message: "No existe",
        button_text: "Volver",
      },
      en: {
        title: "Oops!",
        message: "Not found",
        button_text: "Go back",
      },
    };
    const el = document.createElement("script");
    el.id = "error-404-data";
    el.textContent = JSON.stringify(data);
    document.body.appendChild(el);

    document.body.innerHTML += `
      <h1 data-404-title></h1>
      <p data-404-message></p>
      <a data-404-button><span></span></a>
    `;

    update404Content("es");

    const title = document.querySelector("[data-404-title]")!;
    expect(title.textContent).toBe("Ups!");
    const message = document.querySelector("[data-404-message]")!;
    expect(message.textContent).toBe("No existe");
    const span = document.querySelector("[data-404-button] span")!;
    expect(span.textContent).toBe("Volver");
  });
});
