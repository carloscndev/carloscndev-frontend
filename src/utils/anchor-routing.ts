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
    try {
      window.history.pushState(null, "", "/");
    } catch {
      window.location.hash = "";
    }

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
    try {
      window.history.pushState(null, "", `/#${cleanHash}`);
    } catch {
      window.location.hash = cleanHash;
    }

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

  // Don't intercept if event already handled
  if (event.defaultPrevented) return;

  const href = target.getAttribute("href");
  if (!href) return;

  const pathname = window.location.pathname;

  // Only handle "/" for home navigation when already on home page
  if (href === "/" && (pathname === "/" || pathname === "/index.html")) {
    event.preventDefault();
    window.location.hash = "";
    scrollToHash("/");
    return;
  }

  // Handle /#section links ONLY when on home page
  if (
    href.startsWith("/#") &&
    (pathname === "/" || pathname === "/index.html")
  ) {
    event.preventDefault();
    const hash = href.substring(href.indexOf("#"));
    scrollToHash(hash);
  }
}

/**
 * Clear hash before any navigation to prevent Safari issues
 * This runs in capture phase before ClientRouter
 */
function handleDocumentClick(event: Event): void {
  const target = event.target as HTMLElement;
  if (!target) return;

  // Find the closest anchor element
  const anchor = target.closest("a");
  if (!anchor) return;

  const href = anchor.getAttribute("href");
  if (!href) return;

  // If navigating away from home page and we have a hash, clear it
  // This fixes Safari URL issues with ClientRouter
  if (
    href.startsWith("/") &&
    !href.startsWith("/#") &&
    window.location.hash &&
    (window.location.pathname === "/" ||
      window.location.pathname === "/index.html")
  ) {
    // Build clean URL without hash
    const cleanUrl = window.location.origin + window.location.pathname;
    try {
      window.history.replaceState(null, "", cleanUrl);
    } catch {
      // Safari fallback: set href directly which forces navigation
      window.location.href = cleanUrl;
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
 * Resets anchor routing state - call on astro:after-swap to clean up
 */
function resetAnchorRoutingState(): void {
  suppressObserver = false;
  scrollHandlerAttached = false;
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
          try {
            window.history.replaceState(null, "", newUrl);
          } catch {
            window.location.hash = closestId;
          }
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

  // Use capture phase to clear hash before ClientRouter processes clicks
  document.addEventListener("click", handleDocumentClick, { capture: true });

  // On astro:after-swap, clear hash if navigating away from home page
  // This fixes Safari URL update issues with ClientRouter
  document.addEventListener("astro:after-swap", () => {
    resetAnchorRoutingState();
    // Clear hash when navigating away from home page
    const pathname = window.location.pathname;
    if (pathname !== "/" && pathname !== "/index.html") {
      try {
        window.history.replaceState(null, "", window.location.pathname);
      } catch {
        // Safari fallback - try to clear hash
        if (window.location.hash) {
          window.location.hash = "";
        }
      }
    }
  });

  document.addEventListener("astro:page-load", () => {
    scrollHandlerAttached = false;
    suppressObserver = false;
    bindHashLinkListeners();
    bindScrollObserver();

    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      if (pathname !== "/" && pathname !== "/index.html") return;
      const hash = window.location.hash;
      setTimeout(() => scrollToHash(hash || "/"), 200);
    }
  });

  // Handle browser back/forward navigation
  window.addEventListener("popstate", () => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => scrollToHash(hash), 100);
    } else {
      setTimeout(() => scrollToHash("/"), 100);
    }
  });
}
