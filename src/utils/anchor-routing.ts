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

  const cleanHash = hash.replace(/^#/, "");

  if (!cleanHash || cleanHash === "/") {
    const homeSection = document.getElementById("home");
    if (homeSection) {
      homeSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    updateActiveNavLink("");
    return;
  }

  const element = document.getElementById(cleanHash);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    updateActiveNavLink(cleanHash);
  }
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
 * Handles the initial hash on page load.
 */
function handleInitialHash(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const hash = window.location.hash;
  requestAnimationFrame(() => scrollToHash(hash || "/"));
}

/**
 * Binds click listeners to all hash links in the document.
 */
function bindHashLinkListeners(): void {
  if (typeof document === "undefined") return;

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
export function initAnchorRouting(): void {
  if (typeof document === "undefined") return;

  // Handle initial hash on first load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", handleInitialHash);
  } else {
    handleInitialHash();
  }

  // Bind hash link click listeners
  bindHashLinkListeners();

  // After Astro client router swaps DOM content, scroll to hash if present
  document.addEventListener("astro:after-swap", () => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      requestAnimationFrame(() => scrollToHash(hash || "/"));
    }
  });

  // Re-bind listeners after Astro page loads (handles ClientRouter navigation)
  document.addEventListener("astro:page-load", () => {
    bindHashLinkListeners();
  });
}
