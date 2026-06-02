import { describe, it, expect } from "vitest";

describe("contact", () => {
  it("should update contact content from embedded JSON", async () => {
    document.body.innerHTML = "";
    const data = {
      es: {
        title: "Hablemos",
        statusMessage: "Abierto",
        buttonText: "Escribe",
        mailTo: "mailto:test@test.com",
        footer: "Footer ES",
      },
      en: {
        title: "Let's talk",
        statusMessage: "Open",
        buttonText: "Write",
        mailTo: "mailto:test@test.com",
        footer: "Footer EN",
      },
    };
    const jsonEl = document.createElement("script");
    jsonEl.id = "contact-data";
    jsonEl.type = "application/json";
    jsonEl.textContent = JSON.stringify(data);
    document.body.appendChild(jsonEl);

    document.body.innerHTML += `
      <p data-contact-title></p>
      <p data-contact-status></p>
      <a data-contact-button></a>
      <p data-contact-footer></p>
    `;

    const { updateContactContent } = await import("../../utils/contact");
    updateContactContent("es");

    const title = document.querySelector("[data-contact-title]")!;
    expect(title.textContent).toBe("Hablemos");
    const status = document.querySelector("[data-contact-status]")!;
    expect(status.textContent).toBe("Abierto");
    const btn = document.querySelector("[data-contact-button]")!;
    expect(btn.textContent).toBe("Escribe");
    expect(btn.getAttribute("href")).toBe("mailto:test@test.com");
  });
});
