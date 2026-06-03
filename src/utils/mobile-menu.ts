const MOBILE_MENU_ID = "mobile-menu";
const BODY_LOCK_CLASS = "overflow-hidden";

export function isMobileMenuOpen(): boolean {
  if (typeof document === "undefined") return false;
  const menu = document.getElementById(MOBILE_MENU_ID);
  return menu !== null && menu.dataset.open === "true";
}

export function openMobileMenu(): void {
  if (typeof document === "undefined") return;

  const menu = document.getElementById(MOBILE_MENU_ID);
  if (!menu) return;

  menu.dataset.open = "true";
  document.body.classList.add(BODY_LOCK_CLASS);

  // Sync aria-expanded on toggle button
  const toggle = document.querySelector<HTMLElement>(
    "[data-mobile-menu-toggle]",
  );
  if (toggle) {
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation menu");
  }

  // Focus the close button for accessibility
  const closeBtn = menu.querySelector<HTMLElement>("[data-mobile-menu-close]");
  if (closeBtn) {
    closeBtn.focus();
  }
}

export function closeMobileMenu(): void {
  if (typeof document === "undefined") return;

  const menu = document.getElementById(MOBILE_MENU_ID);
  if (!menu) return;

  menu.dataset.open = "false";
  document.body.classList.remove(BODY_LOCK_CLASS);

  // Sync aria-expanded on toggle button
  const toggle = document.querySelector<HTMLElement>(
    "[data-mobile-menu-toggle]",
  );
  if (toggle) {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
  }
}

export function toggleMobileMenu(): void {
  if (isMobileMenuOpen()) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function trapFocus(menu: HTMLElement, e: KeyboardEvent): void {
  if (e.key !== "Tab") return;

  const focusable = menu.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

function handleEscKey(e: KeyboardEvent): void {
  if (e.key === "Escape" && isMobileMenuOpen()) {
    closeMobileMenu();
  }
}

// eslint-disable-next-line no-unused-vars
let menuKeydownHandler: ((event: Event) => void) | null = null;

function bindMobileMenuListeners(): void {
  if (typeof document === "undefined") return;

  // Hamburger toggle
  const menuToggle = document.querySelector("[data-mobile-menu-toggle]");
  if (menuToggle) {
    menuToggle.removeEventListener("click", toggleMobileMenu);
    menuToggle.addEventListener("click", toggleMobileMenu);
  }

  // Close button
  const closeBtn = document.querySelector("[data-mobile-menu-close]");
  if (closeBtn) {
    closeBtn.removeEventListener("click", closeMobileMenu);
    closeBtn.addEventListener("click", closeMobileMenu);
  }

  // Close on nav link click (anchor links only — external nav is handled
  // by astro:after-swap to avoid Safari cancelling the click)
  const navLinks = document.querySelectorAll("[data-mobile-menu-link]");
  navLinks.forEach((link) => {
    link.removeEventListener("click", closeMobileMenuOnAnchor);
    link.addEventListener("click", closeMobileMenuOnAnchor);
  });

  // Trap focus inside menu
  const menu = document.getElementById(MOBILE_MENU_ID);
  if (menu) {
    if (menuKeydownHandler) {
      menu.removeEventListener("keydown", menuKeydownHandler);
    }
    menuKeydownHandler = (e: Event) => trapFocus(menu, e as KeyboardEvent);
    menu.addEventListener("keydown", menuKeydownHandler);
  }

  // Escape key closes menu
  document.removeEventListener("keydown", handleEscKey);
  document.addEventListener("keydown", handleEscKey);
}

function closeMobileMenuOnAnchor(e: Event): void {
  const target = e.currentTarget as HTMLElement;
  const href = target.getAttribute("href") || "";
  // Only close immediately for same-page anchors; for cross-page links
  // we let astro:after-swap close the menu so Safari doesn't cancel navigation.
  if (href.startsWith("#")) {
    closeMobileMenu();
  }
}

export function initMobileMenuListener(): void {
  // Initial binding
  bindMobileMenuListeners();

  // Re-bind after Astro DOM swaps
  document.addEventListener("astro:page-load", () => {
    bindMobileMenuListeners();
  });

  // Clean up menu state after page swap (covers cross-page nav from mobile menu)
  document.addEventListener("astro:after-swap", () => {
    document.body.classList.remove(BODY_LOCK_CLASS);
    closeMobileMenu();
  });
}
