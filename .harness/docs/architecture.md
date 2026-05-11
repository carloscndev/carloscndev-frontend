# Architecture — The Portfolio Standard

## 1. Directory Structure

- `src/assets/fonts/`: Local .ttf files.
- `src/assets/images/`: Hobbies, Profile pictures, Projects.
- `src/assets/icons/`: Pure SVG React components or Raw SVGs.
- `src/components/ui/`: Atomic elements (Buttons, Links).
- `src/components/sections/`: Page sections (Hero, About, etc.).
- `src/layouts/`: Base layouts (MainLayout, BlogLayout).
- `src/pages/`: Routing (Astro pages).

## 2. Global Strategy

- **Styling:** Tailwind CSS with explicit Dark Mode classes.
- **State:** React Hooks for the "Hobby Timer" (5 seconds logic).
- **Transitions:** View Transitions API (Astro) + CSS Scroll Snapping.
