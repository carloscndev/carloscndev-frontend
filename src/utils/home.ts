import type { Lang } from "./lang";

interface HomeAttributes {
  intro: string;
  title: string;
  subtitle: string;
  content: string;
  avatar: {
    default: string;
    variants: Record<string, string>;
  };
  locale: string;
  avatarPaths: Record<string, string>;
}

interface EmbeddedHomeData {
  es: HomeAttributes;
  en: HomeAttributes;
}

let hobbyTimer: ReturnType<typeof setTimeout> | null = null;

function updateHomeContent(lang: Lang): void {
  if (typeof document === "undefined") return;

  const dataEl = document.getElementById("home-data");
  if (!dataEl?.textContent) return;

  const allData: EmbeddedHomeData = JSON.parse(dataEl.textContent);
  const data = allData[lang];
  if (!data) return;

  const introEl = document.querySelector<HTMLElement>("[data-home-intro]");
  if (introEl) introEl.textContent = data.intro;

  const titleEl = document.querySelector<HTMLElement>("[data-home-title]");
  if (titleEl) titleEl.textContent = data.title;

  const subtitleEl = document.querySelector<HTMLElement>(
    ".home-section__subtitle",
  );
  if (subtitleEl) {
    subtitleEl.innerHTML = data.subtitle.replace(
      /dev$/,
      "<strong>dev</strong>",
    );
  }

  const contentEl = document.querySelector<HTMLElement>("[data-home-content]");
  if (contentEl) contentEl.innerHTML = data.content;

  bindHobbyListeners(data.avatarPaths);
}

function bindHobbyListeners(avatarPaths: Record<string, string>): void {
  if (typeof document === "undefined") return;

  const avatarImg = document.getElementById("home-avatar") as HTMLImageElement;
  if (!avatarImg) return;

  const defaultSrc = avatarPaths.default;
  const defaultAlt = avatarImg.alt;

  const hobbyStrongs = document.querySelectorAll<HTMLElement>(
    ".home-section__body strong[data-action]",
  );

  hobbyStrongs.forEach((el) => {
    const newEl = el.cloneNode(true) as HTMLElement;
    newEl.setAttribute("tabindex", "0");
    newEl.setAttribute("role", "button");
    el.replaceWith(newEl);

    function triggerSwap(action: string) {
      if (!action || !avatarPaths[action]) return;

      if (hobbyTimer) {
        clearTimeout(hobbyTimer);
        hobbyTimer = null;
      }

      const hobbyLabel = newEl.textContent || action;
      avatarImg.alt = `${defaultAlt} — ${hobbyLabel}`;

      avatarImg.classList.add("home-section__avatar-img--swapping");
      setTimeout(() => {
        avatarImg.src = avatarPaths[action];
        avatarImg.classList.remove("home-section__avatar-img--swapping");
      }, 200);

      hobbyTimer = setTimeout(() => {
        avatarImg.classList.add("home-section__avatar-img--swapping");
        setTimeout(() => {
          avatarImg.src = defaultSrc;
          avatarImg.alt = defaultAlt;
          avatarImg.classList.remove("home-section__avatar-img--swapping");
          hobbyTimer = null;
        }, 200);
      }, 5000);
    }

    newEl.addEventListener("click", () => {
      triggerSwap(newEl.dataset.action || "");
    });

    newEl.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        triggerSwap(newEl.dataset.action || "");
      }
    });
  });
}

function handleLangChange(e: Event): void {
  const { lang } = (e as CustomEvent<{ lang: Lang }>).detail;
  updateHomeContent(lang);
}

export function initHomeLangSwitch(): void {
  if (typeof document === "undefined") return;

  window.addEventListener("langchange", handleLangChange);

  document.addEventListener("astro:page-load", () => {
    window.addEventListener("langchange", handleLangChange);

    const currentLang = (document.documentElement.lang || "es") as Lang;
    updateHomeContent(currentLang);
  });
}

export function initHomeHobbies(): void {
  if (typeof document === "undefined") return;

  const dataEl = document.getElementById("home-data");
  if (!dataEl?.textContent) return;

  const allData: EmbeddedHomeData = JSON.parse(dataEl.textContent);
  const currentLang = (document.documentElement.lang || "es") as Lang;
  const data = allData[currentLang] || allData.es;

  bindHobbyListeners(data.avatarPaths);

  document.addEventListener("astro:page-load", () => {
    const updatedDataEl = document.getElementById("home-data");
    if (!updatedDataEl?.textContent) return;
    const updatedAllData: EmbeddedHomeData = JSON.parse(
      updatedDataEl.textContent,
    );
    const updatedLang = (document.documentElement.lang || "es") as Lang;
    const updatedData = updatedAllData[updatedLang] || updatedAllData.es;
    bindHobbyListeners(updatedData.avatarPaths);
  });
}
