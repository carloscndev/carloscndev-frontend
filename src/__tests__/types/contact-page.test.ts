import { describe, it, expect } from "vitest";
import type { ContactPageAttributes } from "../../types/contact-page";

describe("contact-page types", () => {
  it("ContactPageAttributes should have all fields", () => {
    const contact: ContactPageAttributes = {
      title: "Hablemos",
      status_message: "No estoy buscando...",
      button_text: "Escríbeme",
      mail_to: "mailto:hola@carloscndev.com",
      footer: "Diseñado por @carloscndev",
    };
    expect(contact.title).toBe("Hablemos");
    expect(contact.mail_to).toContain("mailto:");
  });
});
