---
name: development-conventions
description: Engineering and design standards for the portfolio project. Defines styling protocols, naming systems, and component architecture to ensure production-grade quality.
---

# Development Conventions

These conventions act as the "Source of Truth" for implementation. All agents must follow these rules to maintain a cohesive codebase that avoids "AI slop" and reflects a professional engineering standard.

## 1. Technical Stack & Rendering

- **Primary Framework**: Astro (Static Site Generation by default).
- **Interactivity**: React for "Island Architecture" (Hydrated components only where logic is required, such as the Hobby Timer).
- **Transitions**: Native View Transitions API for seamless navigation between `/blog` and `/home`.

## 2. Styling Protocol (Tailwind CSS)

Implementation must be meticulous to match the visual specs:

- **Theme Support**: Use the `dark:` prefix for all styles. Primary background is deep navy; secondary containers use a subtle blue-gray glow.
- **Motion**: Every interactive element must include `transition-colors duration-300 ease-in-out`.
- **Spacing**: Use a consistent 4-point or 8-point grid. Maintain generous negative space as seen in the "About" and "Experience" sections.

## 3. Internationalization (i18n)

- **Dictionary Strategy**: Content is strictly dictionary-based, stored as JSON in `src/data/` (or `src/i18n/`).
- **Key-Value Mapping**: Component logic must dynamically switch between `es` and `en` keys without changing the JSX/Astro structure.

## 4. Component Pattern: Structural Hierarchy

We follow a modified **Atomic Design** system to organize the UI:

- **Atoms (UI)**: Basic elements like `Button.astro`, `Icon.astro`, or `Badge.astro`.
- **Molecules**: Combined atoms, such as a `ProjectBadge` or a `SocialLink`.
- **Organisms/Sections**: High-level layout blocks like `HeroSection.astro`, `ExperienceTimeline.astro`, or `BlogGrid.astro`.

## 5. Responsiveness & Breakpoints

- **Mobile-First Approach**: All styles are mobile by default.
- **Desktop Breakpoint**: Use `@media (min-width: 768px)` (Tailwind `md:`) as the strict threshold for the Desktop version.
- **Orientation Behavior**: The UI must maintain the Mobile layout even on landscape orientation if the width is below `768px`. The Desktop layout is strictly reserved for screens `768px` and wider.

## 6. Naming & Syntax

- **Files**: Use `kebab-case` for all files (e.g., `experience-card.astro`, `MainLayout.astro`).
- **Variables**: Use `camelCase` for JavaScript/TypeScript logic.
- **Props**: Destructure props at the top of the component with explicit TypeScript interfaces.

## 7. Definition of Done (DoD)

A task is only "Done" when:

- It matches the **Visual Specs** (Screenshots) exactly in both Light and Dark modes.
- It contains **Zero Hardcoded Text**.
- It is **Accessible** (semantic HTML and appropriate ARIA labels).
