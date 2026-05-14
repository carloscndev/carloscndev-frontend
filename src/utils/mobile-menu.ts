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

  // Focus the close button for accessibility
  const closeBtn = menu.querySelector("[data-mobile-menu-close]");
  if (closeBtn instanceof HTMLElement) {
    closeBtn.focus();
  }
}

export function closeMobileMenu(): void {
  if (typeof document === "undefined") return;

  const menu = document.getElementById(MOBILE_MENU_ID);
  if (!menu) return;

  menu.dataset.open = "false";
  document.body.classList.remove(BODY_LOCK_CLASS);
}

export function toggleMobileMenu(): void {
  if (isMobileMenuOpen()) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function bindMobileMenuListeners(): void {
  if (typeof document === "undefined") return;

  // Listen for clicks on the hamburger menu icon
  const menuToggle = document.querySelector("[data-mobile-menu-toggle]");
  if (menuToggle) {
    menuToggle.removeEventListener("click", toggleMobileMenu);
    menuToggle.addEventListener("click", toggleMobileMenu);
  }

  // Listen for clicks on the close button
  const closeBtn = document.querySelector("[data-mobile-menu-close]");
  if (closeBtn) {
    closeBtn.removeEventListener("click", closeMobileMenu);
    closeBtn.addEventListener("click", closeMobileMenu);
  }

  // Close menu when clicking a navigation link
  const navLinks = document.querySelectorAll("[data-mobile-menu-link]");
  navLinks.forEach((link) => {
    link.removeEventListener("click", closeMobileMenu);
    link.addEventListener("click", closeMobileMenu);
  });
}

export function initMobileMenuListener(): void {
  // Initial binding on first load
  bindMobileMenuListeners();

  // Re-bind listeners after Astro swaps DOM content
  document.addEventListener("astro:page-load", () => {
    bindMobileMenuListeners();
  });

  // Clean up body lock class after page swap
  document.addEventListener("astro:after-swap", () => {
    document.body.classList.remove(BODY_LOCK_CLASS);
  });
}
