---
name: portfolio-architecture
description: Engineering standards and structural blueprints for the professional portfolio. Defines directory organization, global strategies, and data-driven constraints.
---

# Architecture — The Portfolio Standard

This document establishes the technical foundation for the project. Every line of code written by the **Coder** must align with these architectural pillars to ensure scalability and design fidelity.

## 1. Directory Structure

A strict modular organization is required to maintain a separation of concerns:

- `src/assets/fonts/`: Local `.ttf` / `.woff2` files (Space Grotesk & Inter).
- `src/assets/images/`: Optimized assets for Hobbies, Profile, and Projects.
- `src/components/icons/`: Astro components for social and UI elements.
- `src/components/ui/`: Atomic, reusable elements (Buttons, Badges, Inputs).
- `src/components/sections/`: High-level page modules (Hero, Experience, BlogGrid).
- `src/layouts/`: Structural wrappers (MainLayout, PostLayout).
- `src/pages/`: File-based routing (Index, Blog, Portfolio Detail).

## 2. Technical Execution Strategy

- **Styling Engine**: Tailwind CSS. Implementation must use explicit dark mode utility classes (`dark:`) to match the visual specs for both themes.
- **Dynamic Interactivity**: For complex logic, create a helper function within a utils file to keep the logic isolated. Use Astro <script> tags strictly to capture DOM elements and trigger those helper functions, specifically for the 'Hobby Switcher' (5-second rotation logic)
- **Fluid Navigation**: Native Astro View Transitions API for seamless page loads and CSS Scroll Snapping for section-based layouts.

## 3. High-Fidelity Asset Mapping

### Typography

- **Headings**: `Space Grotesk` (Medium, Regular, SemiBold). Focused on bold, distinctive display.
- **Body**: `Inter` (Regular, Medium, Italic). Focused on readability and refined precision.

### Hobby Image Registry (`src/assets/images/`)

Images must swap dynamically in the Hero section based on the current active hobby:

- **Default**: `hello.png`
- **Running**: `running.png`
- **Reading**: `reading.png`
- **Gaming**: `playing.png`
- **Secondary**: `working.png`, `sleeping.png`.

### Iconography Registry (`src/assets/icons/`)

- **Socials**: GitHub, Instagram, LinkedIn (Persistent sidebar placement).
- **Systems**: Theme Toggle (Dark/Light), Language Switch (En/Es), External Links.

## 4. Data-Driven Constraint (The "No Hardcoding" Rule)

- **Source of Truth**: Hardcoding text in Astro components is strictly forbidden. All content must be consumed from `src/data/*.json`.
- **Prop Injection**: Components must be "dumb" and receive data via typed props.
- **Internationalization (i18n)**: Data structures must follow the `es` / `en` key-value pattern to allow for future translation injection without refactoring the UI logic.
