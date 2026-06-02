import { describe, it, expect } from "vitest";
import type { ErrorPageAttributes } from "../../types/error-page";

describe("error-page types", () => {
  it("ErrorPageAttributes should have all fields", () => {
    const error: ErrorPageAttributes = {
      title: "¡Ups!",
      message: "Página no encontrada.",
      button_text: "Regresar",
    };
    expect(error.title).toBe("¡Ups!");
    expect(error.button_text).toBe("Regresar");
  });
});
