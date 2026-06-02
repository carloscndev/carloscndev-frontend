import { describe, it, expect } from "vitest";
import type { ContactPageAttributes } from "../../types/contact-page";

describe("contact-page types", () => {
  it("ContactPageAttributes should have all fields", () => {
    const contact: ContactPageAttributes = {
      title: "Hablemos",
      statusMessage: "No estoy buscando...",
      buttonText: "Escríbeme",
      mailTo: "mailto:hola@carloscndev.com",
      footer: "Diseñado por @carloscndev",
    };
    expect(contact.title).toBe("Hablemos");
    expect(contact.mailTo).toContain("mailto:");
    expect(contact.statusMessage).toBe("No estoy buscando...");
  });
});
