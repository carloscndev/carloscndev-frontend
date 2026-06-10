import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  updateHomeContent,
  initHomeLangSwitch,
  initHomeHobbies,
} from "../../utils/home";

describe("home", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.documentElement.lang = "es";
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("updateHomeContent", () => {
    it("should update home content from embedded JSON for es", () => {
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

    it("should update home content from embedded JSON for en", () => {
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

      updateHomeContent("en");

      const intro = document.querySelector("[data-home-intro]")!;
      expect(intro.textContent).toBe("Hi");
    });

    it("should wrap 'dev' in subtitle with strong tag", () => {
      const data = {
        es: {
          intro: "Hola",
          title: "Carlos",
          subtitle: "Software dev",
          content: "<p>Test</p>",
          avatarPaths: { default: "hello.png" },
        },
        en: {
          intro: "Hi",
          title: "Carlos",
          subtitle: "Software dev",
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

      const subtitle = document.querySelector(".home-section__subtitle")!;
      expect(subtitle.innerHTML).toBe("Software <strong>dev</strong>");
    });

    it("should not update if data element is missing", () => {
      document.body.innerHTML += `
        <p data-home-intro></p>
        <p data-home-title></p>
      `;

      expect(() => updateHomeContent("es")).not.toThrow();
    });

    it("should not update if data element has no text content", () => {
      const jsonEl = document.createElement("script");
      jsonEl.id = "home-data";
      jsonEl.type = "application/json";
      jsonEl.textContent = "";
      document.body.appendChild(jsonEl);

      document.body.innerHTML += `
        <p data-home-intro></p>
        <p data-home-title></p>
      `;

      expect(() => updateHomeContent("es")).not.toThrow();
    });

    it("should not update if lang data is missing", () => {
      const data = {
        es: {
          intro: "Hola",
          title: "Carlos",
          subtitle: "Dev",
          content: "<p>Test</p>",
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
      `;

      expect(() => updateHomeContent("en")).not.toThrow();
    });

    it("should handle missing optional elements gracefully", () => {
      const data = {
        es: {
          intro: "Hola",
          title: "Carlos",
          subtitle: "Dev",
          content: "<p>Test</p>",
          avatarPaths: { default: "hello.png" },
        },
      };
      const jsonEl = document.createElement("script");
      jsonEl.id = "home-data";
      jsonEl.type = "application/json";
      jsonEl.textContent = JSON.stringify(data);
      document.body.appendChild(jsonEl);

      document.body.innerHTML = `<p data-home-intro></p>`;

      expect(() => updateHomeContent("es")).not.toThrow();
    });
  });

  describe("initHomeHobbies", () => {
    it("should bind hobby listeners to avatar switching", () => {
      const data = {
        es: {
          intro: "Hola",
          title: "Carlos",
          subtitle: "Dev",
          content: "<p>Test</p>",
          avatarPaths: {
            default: "default.png",
            coding: "coding.png",
            gaming: "gaming.png",
          },
        },
      };
      const jsonEl = document.createElement("script");
      jsonEl.id = "home-data";
      jsonEl.type = "application/json";
      jsonEl.textContent = JSON.stringify(data);
      document.body.appendChild(jsonEl);

      const avatarImg = document.createElement("img");
      avatarImg.id = "home-avatar";
      avatarImg.src = "default.png";
      avatarImg.alt = "Avatar";
      document.body.appendChild(avatarImg);

      document.body.innerHTML += `
        <div class="home-section__body">
          <strong data-action="coding">Coding</strong>
          <strong data-action="gaming">Gaming</strong>
        </div>
      `;

      initHomeHobbies();

      const codingEl = document.querySelector(
        "[data-action='coding']",
      ) as HTMLElement;
      expect(codingEl).toBeTruthy();
      expect(codingEl.getAttribute("tabindex")).toBe("0");
      expect(codingEl.getAttribute("role")).toBe("button");
    });

    it("should switch avatar on hobby click", () => {
      const data = {
        es: {
          intro: "Hola",
          title: "Carlos",
          subtitle: "Dev",
          content: "<p>Test</p>",
          avatarPaths: {
            default: "default.png",
            coding: "coding.png",
          },
        },
      };
      const jsonEl = document.createElement("script");
      jsonEl.id = "home-data";
      jsonEl.type = "application/json";
      jsonEl.textContent = JSON.stringify(data);
      document.body.appendChild(jsonEl);

      const container = document.createElement("div");
      container.innerHTML = `
        <img id="home-avatar" src="default.png" alt="My Avatar" />
        <div class="home-section__body">
          <strong data-action="coding">Coding</strong>
        </div>
      `;
      document.body.appendChild(container);

      const avatarImg = document.getElementById(
        "home-avatar",
      ) as HTMLImageElement;

      initHomeHobbies();

      const codingEl = document.querySelector(
        "[data-action='coding']",
      ) as HTMLElement;
      codingEl.click();

      vi.advanceTimersByTime(300);

      expect(avatarImg.src).toContain("coding.png");
      expect(avatarImg.alt).toBe("My Avatar — Coding");
    });

    it("should switch back to default after timeout", () => {
      const data = {
        es: {
          intro: "Hola",
          title: "Carlos",
          subtitle: "Dev",
          content: "<p>Test</p>",
          avatarPaths: {
            default: "default.png",
            coding: "coding.png",
          },
        },
      };
      const jsonEl = document.createElement("script");
      jsonEl.id = "home-data";
      jsonEl.type = "application/json";
      jsonEl.textContent = JSON.stringify(data);
      document.body.appendChild(jsonEl);

      const avatarImg = document.createElement("img");
      avatarImg.id = "home-avatar";
      avatarImg.src = "default.png";
      avatarImg.alt = "My Avatar";
      document.body.appendChild(avatarImg);

      document.body.innerHTML += `
        <div class="home-section__body">
          <strong data-action="coding">Coding</strong>
        </div>
      `;

      initHomeHobbies();

      const codingEl = document.querySelector(
        "[data-action='coding']",
      ) as HTMLElement;
      codingEl.click();

      vi.advanceTimersByTime(5200);

      expect(avatarImg.src).toContain("default.png");
      expect(avatarImg.alt).toBe("My Avatar");
    });

    it("should handle keyboard navigation on hobby elements", () => {
      const data = {
        es: {
          intro: "Hola",
          title: "Carlos",
          subtitle: "Dev",
          content: "<p>Test</p>",
          avatarPaths: {
            default: "default.png",
            gaming: "gaming.png",
          },
        },
      };
      const jsonEl = document.createElement("script");
      jsonEl.id = "home-data";
      jsonEl.type = "application/json";
      jsonEl.textContent = JSON.stringify(data);
      document.body.appendChild(jsonEl);

      const container = document.createElement("div");
      container.innerHTML = `
        <img id="home-avatar" src="default.png" alt="Avatar" />
        <div class="home-section__body">
          <strong data-action="gaming">Gaming</strong>
        </div>
      `;
      document.body.appendChild(container);

      const avatarImg = document.getElementById(
        "home-avatar",
      ) as HTMLImageElement;

      initHomeHobbies();

      const gamingEl = document.querySelector(
        "[data-action='gaming']",
      ) as HTMLElement;
      gamingEl.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

      vi.advanceTimersByTime(300);

      expect(avatarImg.src).toContain("gaming.png");
    });

    it("should do nothing if no avatar element exists", () => {
      const data = {
        es: {
          intro: "Hola",
          title: "Carlos",
          subtitle: "Dev",
          content: "<p>Test</p>",
          avatarPaths: { default: "default.png" },
        },
      };
      const jsonEl = document.createElement("script");
      jsonEl.id = "home-data";
      jsonEl.type = "application/json";
      jsonEl.textContent = JSON.stringify(data);
      document.body.appendChild(jsonEl);

      document.body.innerHTML = `<div class="home-section__body"></div>`;

      expect(() => initHomeHobbies()).not.toThrow();
    });

    it("should switch avatar when clicking hobby element", () => {
      const data = {
        es: {
          intro: "Hola",
          title: "Carlos",
          subtitle: "Dev",
          content: "<p>Test</p>",
          avatarPaths: {
            default: "default.png",
            gaming: "gaming.png",
          },
        },
      };
      const jsonEl = document.createElement("script");
      jsonEl.id = "home-data";
      jsonEl.type = "application/json";
      jsonEl.textContent = JSON.stringify(data);
      document.body.appendChild(jsonEl);

      const container = document.createElement("div");
      container.innerHTML = `
        <img id="home-avatar" src="default.png" alt="Avatar" />
        <div class="home-section__body">
          <strong data-action="gaming">Gaming</strong>
        </div>
      `;
      document.body.appendChild(container);

      const avatarImg = document.getElementById(
        "home-avatar",
      ) as HTMLImageElement;

      initHomeHobbies();

      const gamingEl = document.querySelector(
        "[data-action='gaming']",
      ) as HTMLElement;
      gamingEl.click();

      vi.advanceTimersByTime(300);

      expect(avatarImg.src).toContain("gaming.png");
    });

    it("should rebind listeners on astro:page-load", () => {
      const data = {
        es: {
          intro: "Hola",
          title: "Carlos",
          subtitle: "Dev",
          content: "<p>Test</p>",
          avatarPaths: {
            default: "default.png",
            gaming: "gaming.png",
          },
        },
      };
      const jsonEl = document.createElement("script");
      jsonEl.id = "home-data";
      jsonEl.type = "application/json";
      jsonEl.textContent = JSON.stringify(data);
      document.body.appendChild(jsonEl);

      const container = document.createElement("div");
      container.innerHTML =
        '<img id="home-avatar" src="default.png" alt="Avatar" /><div class="home-section__body"><strong data-action="gaming">Gaming</strong></div>';
      document.body.appendChild(container);

      initHomeHobbies();
      document.dispatchEvent(new Event("astro:page-load"));

      const gamingEl = document.querySelector(
        "[data-action='gaming']",
      ) as HTMLElement;
      gamingEl.click();

      vi.advanceTimersByTime(300);

      const avatarImg = document.getElementById(
        "home-avatar",
      ) as HTMLImageElement;
      expect(avatarImg.src).toContain("gaming.png");
    });

    it("should do nothing on astro:page-load if data element is missing", () => {
      document.body.innerHTML = '<div class="home-section__body"></div>';
      initHomeHobbies();
      expect(() =>
        document.dispatchEvent(new Event("astro:page-load")),
      ).not.toThrow();
    });
  });

  describe("initHomeLangSwitch", () => {
    it("should initialize lang switch listener", () => {
      const data = {
        es: {
          intro: "Hola",
          title: "Carlos",
          subtitle: "Dev",
          content: "<p>Test</p>",
          avatarPaths: { default: "hello.png" },
        },
      };
      const jsonEl = document.createElement("script");
      jsonEl.id = "home-data";
      jsonEl.type = "application/json";
      jsonEl.textContent = JSON.stringify(data);
      document.body.appendChild(jsonEl);

      document.body.innerHTML = `
        <p data-home-intro></p>
        <p data-home-title></p>
      `;

      expect(() => initHomeLangSwitch()).not.toThrow();
    });
  });
});
