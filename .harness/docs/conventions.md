# Development Conventions

- **Framework:** Astro (Static by default), React for island interactivity.
- **Styling:** Tailwind CSS.
  - Use `dark:` prefix for all dark mode styles.
  - Theme transition: `transition-colors duration-300 ease-in-out`.
- **I18n:** Dictionary-based (JSON) in `src/i18n/`.
- **Component Pattern:** Atomic Design (atoms, molecules, organisms, sections).
- **Naming:** Kebab-case for files (e.g., `hero-section.astro`).
