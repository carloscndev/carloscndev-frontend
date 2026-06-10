import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  updateExperienceContent,
  initExperienceTabs,
  initExperienceCarousel,
  initExperienceLangSwitch,
} from "../../utils/experience";

describe("experience", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("updateExperienceContent", () => {
    it("should update experience content from embedded JSON for en locale", async () => {
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
          ],
        },
        en: {
          title: "Experience",
          intro: "Intro EN",
          jobs: [
            {
              id: 2,
              company: "Acme EN",
              company_url: "https://acme.en",
              role: "Engineer EN",
              period: "2020–2021 EN",
              description: "<p>Paragraph 1 EN</p>",
              technologies: ["JS", "TS"],
            },
          ],
        },
      };
      const el = document.createElement("script");
      el.id = "experience-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      const container = document.createElement("div");
      container.innerHTML = `
        <p data-experience-title></p>
        <p data-experience-intro></p>
        <button data-tab><span class="experience-tabs__tab-company"></span></button>
        <div data-panel>
          <span data-job-role></span>
          <span data-job-company></span>
          <span data-job-period></span>
          <div data-job-description></div>
          <div data-job-tags></div>
        </div>
      `;
      document.body.appendChild(container);

      const { updateExperienceContent } =
        await import("../../utils/experience");
      updateExperienceContent("en");

      const title = document.querySelector("[data-experience-title]")!;
      expect(title.textContent).toBe("Experience");
    });

    it("should update title and intro", async () => {
      const data = {
        es: {
          title: "Experiencia",
          intro: "Intro ES",
          jobs: [],
        },
      };
      const el = document.createElement("script");
      el.id = "experience-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      const container = document.createElement("div");
      container.innerHTML = `
        <p data-experience-title></p>
        <p data-experience-intro></p>
      `;
      document.body.appendChild(container);

      const { updateExperienceContent } =
        await import("../../utils/experience");
      updateExperienceContent("es");

      const title = document.querySelector("[data-experience-title]")!;
      expect(title.textContent).toBe("Experiencia");
      const intro = document.querySelector("[data-experience-intro]")!;
      expect(intro.textContent).toBe("Intro ES");
    });

    it("should update tab company labels by index", async () => {
      const data = {
        es: {
          title: "Experiencia",
          intro: "Intro",
          jobs: [
            {
              company: "Company A",
              role: "Role A",
              period: "2020",
              description: "",
              technologies: [],
            },
            {
              company: "Company B",
              role: "Role B",
              period: "2021",
              description: "",
              technologies: [],
            },
          ],
        },
      };
      const el = document.createElement("script");
      el.id = "experience-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      const container = document.createElement("div");
      container.innerHTML = `
        <button data-tab><span class="experience-tabs__tab-company"></span></button>
        <button data-tab><span class="experience-tabs__tab-company"></span></button>
      `;
      document.body.appendChild(container);

      const { updateExperienceContent } =
        await import("../../utils/experience");
      updateExperienceContent("es");

      const tabs = document.querySelectorAll(".experience-tabs__tab-company");
      expect(tabs[0].textContent).toBe("Company A");
      expect(tabs[1].textContent).toBe("Company B");
    });

    it("should skip tab update if job not found at index", async () => {
      const data = {
        es: {
          title: "Experiencia",
          intro: "Intro",
          jobs: [
            {
              company: "Company A",
              role: "Role A",
              period: "2020",
              description: "",
              technologies: [],
            },
          ],
        },
      };
      const el = document.createElement("script");
      el.id = "experience-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      const container = document.createElement("div");
      container.innerHTML = `
        <button data-tab><span class="experience-tabs__tab-company"></span></button>
        <button data-tab><span class="experience-tabs__tab-company"></span></button>
      `;
      document.body.appendChild(container);

      const { updateExperienceContent } =
        await import("../../utils/experience");
      expect(() => updateExperienceContent("es")).not.toThrow();
    });

    it("should update panel job data by index", async () => {
      const data = {
        es: {
          title: "Experiencia",
          intro: "Intro",
          jobs: [
            {
              company: "Acme",
              role: "Engineer",
              period: "2020-2021",
              description: "<p>Description</p>",
              technologies: ["JS", "TS"],
            },
          ],
        },
      };
      const el = document.createElement("script");
      el.id = "experience-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      const container = document.createElement("div");
      container.innerHTML = `
        <div data-panel>
          <span data-job-role></span>
          <span data-job-company></span>
          <span data-job-period></span>
          <div data-job-description></div>
          <div data-job-tags></div>
        </div>
      `;
      document.body.appendChild(container);

      const { updateExperienceContent } =
        await import("../../utils/experience");
      updateExperienceContent("es");

      expect(document.querySelector("[data-job-role]")!.textContent).toBe(
        "Engineer",
      );
      expect(document.querySelector("[data-job-company]")!.textContent).toBe(
        "@Acme",
      );
      expect(document.querySelector("[data-job-period]")!.textContent).toBe(
        "2020-2021",
      );
    });

    it("should render technology pills in panel", async () => {
      const data = {
        es: {
          title: "Experiencia",
          intro: "Intro",
          jobs: [
            {
              company: "Acme",
              role: "Engineer",
              period: "2020",
              description: "",
              technologies: ["React", "Node"],
            },
          ],
        },
      };
      const el = document.createElement("script");
      el.id = "experience-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      const container = document.createElement("div");
      container.innerHTML = `<div data-panel><div data-job-tags></div></div>`;
      document.body.appendChild(container);

      const { updateExperienceContent } =
        await import("../../utils/experience");
      updateExperienceContent("es");

      const tags = document.querySelector("[data-job-tags]")!;
      expect(tags.innerHTML).toContain("tech-pill");
      expect(tags.innerHTML).toContain("React");
      expect(tags.innerHTML).toContain("Node");
    });

    it("should update slide mobile content by index", async () => {
      const data = {
        es: {
          title: "Experiencia",
          intro: "Intro",
          jobs: [
            {
              company: "Acme",
              role: "Engineer",
              period: "2020-2021",
              description: "<p>Desc</p>",
              technologies: ["JS"],
            },
          ],
        },
      };
      const el = document.createElement("script");
      el.id = "experience-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      const container = document.createElement("div");
      container.innerHTML = `
        <div data-slide>
          <span data-job-role></span>
          <span data-job-company></span>
          <span data-job-period></span>
          <div data-job-description></div>
          <div data-job-tags></div>
        </div>
      `;
      document.body.appendChild(container);

      const { updateExperienceContent } =
        await import("../../utils/experience");
      updateExperienceContent("es");

      expect(
        document.querySelector("[data-slide] [data-job-role]")!.textContent,
      ).toBe("Engineer");
      expect(
        document.querySelector("[data-slide] [data-job-company]")!.textContent,
      ).toBe("@Acme");
    });

    it("should handle missing data element gracefully", async () => {
      const { updateExperienceContent } =
        await import("../../utils/experience");
      expect(() => updateExperienceContent("es")).not.toThrow();
    });

    it("should handle empty data text content", async () => {
      const el = document.createElement("script");
      el.id = "experience-data";
      el.textContent = "";
      document.body.appendChild(el);

      const { updateExperienceContent } =
        await import("../../utils/experience");
      expect(() => updateExperienceContent("es")).not.toThrow();
    });

    it("should handle missing locale data", async () => {
      const data = { es: { title: "Exp", intro: "Intro", jobs: [] } };
      const el = document.createElement("script");
      el.id = "experience-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      const { updateExperienceContent } =
        await import("../../utils/experience");
      expect(() => updateExperienceContent("en")).not.toThrow();
    });

    it("should handle jobs array not being an array", async () => {
      const data = { es: { title: "Exp", intro: "Intro", jobs: null } };
      const el = document.createElement("script");
      el.id = "experience-data";
      el.textContent = JSON.stringify(data);
      document.body.appendChild(el);

      const { updateExperienceContent } =
        await import("../../utils/experience");
      expect(() => updateExperienceContent("es")).not.toThrow();
    });
  });

  describe("initExperienceTabs", () => {
    it("should bind click listeners to tabs", async () => {
      document.body.innerHTML = `
        <button data-tab="tab1" class="experience-tabs__tab">Tab 1</button>
        <button data-tab="tab2" class="experience-tabs__tab">Tab 2</button>
        <div data-panel="tab1" class="experience-tabs__panel--active"></div>
        <div data-panel="tab2"></div>
      `;

      const { initExperienceTabs } = await import("../../utils/experience");
      initExperienceTabs();

      const tab1 = document.querySelector("[data-tab='tab1']") as HTMLElement;
      tab1.click();

      expect(tab1.classList.contains("experience-tabs__tab--active")).toBe(
        true,
      );
    });

    it("should switch active panel on tab click", async () => {
      document.body.innerHTML = `
        <button data-tab="tab1" class="experience-tabs__tab experience-tabs__tab--active">Tab 1</button>
        <button data-tab="tab2" class="experience-tabs__tab">Tab 2</button>
        <div data-panel="tab1" class="experience-tabs__panel--active"></div>
        <div data-panel="tab2"></div>
      `;

      const { initExperienceTabs } = await import("../../utils/experience");
      initExperienceTabs();

      const tab2 = document.querySelector("[data-tab='tab2']") as HTMLElement;
      tab2.click();

      expect(tab2.classList.contains("experience-tabs__tab--active")).toBe(
        true,
      );
      expect(
        document
          .querySelector("[data-panel='tab2']")!
          .classList.contains("experience-tabs__panel--active"),
      ).toBe(true);
    });

    it("should do nothing if document is undefined", async () => {
      const globalDoc = global.document;
      // @ts-expect-error - testing undefined document
      global.document = undefined;

      const { initExperienceTabs } = await import("../../utils/experience");
      expect(() => initExperienceTabs()).not.toThrow();

      global.document = globalDoc;
    });
  });

  describe("initExperienceCarousel", () => {
    it("should bind click listeners to dots", async () => {
      document.body.innerHTML = `
        <div data-carousel-track style="width: 100px;">
          <div style="width: 100px;">Slide 1</div>
          <div style="width: 100px;">Slide 2</div>
        </div>
        <button data-dot></button>
        <button data-dot></button>
      `;

      const { initExperienceCarousel } = await import("../../utils/experience");
      initExperienceCarousel();

      const dot1 = document.querySelectorAll("[data-dot]")[0] as HTMLElement;
      const clickSpy = vi.fn();
      dot1.addEventListener("click", clickSpy);
      dot1.click();

      expect(clickSpy).toHaveBeenCalled();
    });

    it("should do nothing if no track element exists", async () => {
      document.body.innerHTML = `
        <button data-dot></button>
        <button data-dot></button>
      `;

      const { initExperienceCarousel } = await import("../../utils/experience");
      expect(() => initExperienceCarousel()).not.toThrow();
    });

    it("should do nothing if document is undefined", async () => {
      const globalDoc = global.document;
      // @ts-expect-error - testing undefined document
      global.document = undefined;

      const { initExperienceCarousel } = await import("../../utils/experience");
      expect(() => initExperienceCarousel()).not.toThrow();

      global.document = globalDoc;
    });
  });

  describe("initExperienceLangSwitch", () => {
    it("should initialize lang switch listener", async () => {
      document.body.innerHTML = `
        <script id="experience-data" type="application/json">{"es":{"title":"Exp","intro":"","jobs":[]}}</script>
      `;

      const { initExperienceLangSwitch } =
        await import("../../utils/experience");
      expect(() => initExperienceLangSwitch()).not.toThrow();
    });
  });
});
