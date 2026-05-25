/**
 * Anchor Routing Utility
 * Handles hash-based navigation and smooth scrolling for single-page section routing.
 * Survives Astro ClientRouter page transitions via astro:after-swap and astro:page-load events.
 */

/**
 * Scrolls to the element matching the given hash using smooth behavior.
 * For home (empty hash or "#"), scrolls to the top of the page.
 */
export function scrollToHash(hash: string): void {
  if (typeof document === "undefined") return;

  suppressObserver = true;

  const cleanHash = hash.replace(/^#/, "");

  if (!cleanHash || cleanHash === "/") {
    const homeSection = document.getElementById("home");
    if (homeSection) {
      homeSection.scrollIntoView({ block: "center" });
    }
    updateActiveNavLink("");

    setTimeout(() => {
      suppressObserver = false;
    }, 800);
    return;
  }

  const element = document.getElementById(cleanHash);
  if (element) {
    const container = element.closest(".main-content") as HTMLElement;
    if (container) {
      const elRect = element.getBoundingClientRect();
      const contRect = container.getBoundingClientRect();
      const relativeTop = elRect.top - contRect.top + container.scrollTop;
      const targetY =
        relativeTop - container.clientHeight / 2 + elRect.height / 2;
      container.scrollTo({ top: targetY, behavior: "auto" });
    }
    updateActiveNavLink(cleanHash);

    if (window.innerWidth < 768) {
      setTimeout(() => {
        const el = document.getElementById(cleanHash);
        const cont = el?.closest(".main-content") as HTMLElement;
        if (el && cont) {
          const r = el.getBoundingClientRect();
          const cr = cont.getBoundingClientRect();
          const rt = r.top - cr.top + cont.scrollTop;
          const y = rt - cont.clientHeight / 2 + r.height / 2;
          cont.scrollTo({ top: y, behavior: "auto" });
        }
      }, 300);
    }
  }

  setTimeout(() => {
    suppressObserver = false;
  }, 800);
}

/**
 * Updates the active state of navigation links based on the current section hash.
 */
function updateActiveNavLink(sectionId: string): void {
  if (typeof document === "undefined") return;

  const navLinks = document.querySelectorAll<HTMLAnchorElement>(
    ".header-nav-link, .mobile-menu-link",
  );

  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const isActive =
      sectionId === "" ? href === "/" : href === `/#${sectionId}`;

    const activeClass = link.classList.contains("mobile-menu-link")
      ? "mobile-menu-link--active"
      : "header-nav-link--active";

    if (isActive) {
      link.classList.add(activeClass);
    } else {
      link.classList.remove(activeClass);
    }
  });
}

/**
 * Handles click events on hash links for smooth scrolling.
 */
function handleHashLinkClick(event: Event): void {
  const target = event.currentTarget as HTMLAnchorElement;
  if (!target) return;

  const href = target.getAttribute("href");
  if (!href) return;

  // Only intercept internal hash links and the home link on the root path
  if (href === "/" || href.startsWith("/#")) {
    event.preventDefault();
    if (href === "/") {
      scrollToHash("/");
    } else {
      const hash = href.substring(href.indexOf("#"));
      scrollToHash(hash);
    }

    // Update browser URL without a full page reload
    if (typeof window !== "undefined" && window.history) {
      window.history.pushState(null, "", href);
    }
  }
}

/**
 * Binds click listeners to all hash links in the document.
 */
function bindHashLinkListeners(): void {
  if (typeof document === "undefined") return;

  const pathname = window.location.pathname;
  if (pathname !== "/" && pathname !== "/index.html") return;

  const hashLinks = document.querySelectorAll<HTMLAnchorElement>(
    'a[href="/"], a[href^="/#"]',
  );

  hashLinks.forEach((link) => {
    link.removeEventListener("click", handleHashLinkClick);
    link.addEventListener("click", handleHashLinkClick);
  });
}

/**
 * Initializes the full anchor routing system.
 * Call this once on page load to set up all hash-based navigation.
 *
 * Handles:
 * - Initial hash scrolling on DOMContentLoaded
 * - Smooth scroll interception for hash link clicks
 * - Re-scrolling after Astro ClientRouter navigation (astro:after-swap)
 * - Re-binding listeners after Astro page transitions (astro:page-load)
 */
let scrollHandlerAttached = false;
let suppressObserver = false;

function bindScrollObserver(): void {
  if (typeof document === "undefined") return;
  if (typeof window === "undefined") return;

  const pathname = window.location.pathname;
  if (pathname !== "/" && pathname !== "/index.html") return;

  const container = document.querySelector<HTMLElement>(".main-content");
  if (!container) return;

  if (scrollHandlerAttached) return;

  let ticking = false;

  container.addEventListener(
    "scroll",
    () => {
      if (ticking || suppressObserver) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;

        if (suppressObserver) return;

        const containerCenter =
          container.scrollTop + container.clientHeight / 2;
        const sections = container.querySelectorAll<HTMLElement>("section[id]");

        let closestId = "";
        let closestDistance = Infinity;

        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const sectionCenter =
            rect.top +
            rect.height / 2 -
            containerRect.top +
            container.scrollTop;
          const distance = Math.abs(sectionCenter - containerCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestId = section.id;
          }
        });

        if (closestId) {
          const sectionId = closestId === "home" ? "" : closestId;
          updateActiveNavLink(sectionId);
          const newUrl = closestId === "home" ? "/" : `/#${closestId}`;
          window.history.replaceState(null, "", newUrl);
        }
      });
    },
    { passive: true },
  );

  scrollHandlerAttached = true;
}

export function initAnchorRouting(): void {
  if (typeof document === "undefined") return;

  bindHashLinkListeners();
  bindScrollObserver();

  document.addEventListener("astro:page-load", () => {
    scrollHandlerAttached = false;
    bindHashLinkListeners();
    bindScrollObserver();

    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      if (pathname !== "/" && pathname !== "/index.html") return;
      const hash = window.location.hash;
      setTimeout(() => scrollToHash(hash || "/"), 200);
    }
  });
}
