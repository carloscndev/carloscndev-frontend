---
name: design-system-tokens
description: Definitive design tokens for the portfolio. Establishes the color palette, typography scales, and thematic variables derived from visual specifications.
---

# Design System (Tokens)

This document defines the visual DNA of the project. All styling must consume these tokens to ensure pixel-perfect fidelity with the `visual-specs/` across all platforms and themes.

## 1. Color Architecture (CSS Variables)

We utilize a dual-layer variable system to handle global theme switching and contextual content flavoring (e.g., Blog categories).

### Global Theme (Primitive Tokens)

These tokens form the core foundation of the UI.

| Token            | Dark (Default) | Light     | Purpose                                      |
| :--------------- | :------------- | :-------- | :------------------------------------------- |
| `--bg-primary`   | `#080d29`      | `#d6def5` | Main application background.                 |
| `--text-base`    | `#d6def5`      | `#080d29` | Primary body and heading text.               |
| `--color-accent` | `#331fe8`      | `#331fe8` | Interactive elements and brand highlights.   |
| `--color-word`   | `#7f8be4`      | `#2F42A0` | Secondary emphasis and keyword highlighting. |

### Contextual Themes (Semantic Tokens)

Used to style category-specific components in the Blog and Portfolio.

| Category             | Mode  | Primary   | Secondary |
| :------------------- | :---- | :-------- | :-------- |
| **Running & Travel** | Dark  | `#001221` | `#0092da` |
|                      | Light | `#bcdbff` | `#001221` |
| **Technology**       | Dark  | `#070341` | `#8c88f7` |
|                      | Light | `#8c88f7` | `#070341` |

## 2. Typography Scale (Fluid REM)

Based on a `16px` root. Typography must use `Space Grotesk` for display and `Inter` for functional text.

| Level    | Desktop           | Tablet     | Mobile     | Weight             |
| :------- | :---------------- | :--------- | :--------- | :----------------- |
| **h1**   | `4rem` (64px)     | `3rem`     | `2.25rem`  | **Bold** (700).    |
| **h2**   | `2.5rem` (40px)   | `2rem`     | `1.75rem`  | **Medium** (500).  |
| **h3**   | `1.5rem` (24px)   | `1.375rem` | `1.25rem`  | **Medium** (500).  |
| **Body** | `1.125rem` (18px) | `1rem`     | `0.875rem` | **Regular** (400). |

- **Display Font**: `Space Grotesk` (System fallback: sans-serif).
- **Interface Font**: `Inter` (System fallback: sans-serif).

## 3. UI Effects & Elevation

Derived from the "Portfolio" and "Experience" card designs.

- **Card Overlay**: Dark overlays with a 0.4 to 0.6 opacity range for text legibility over background images.
- **Interactive Glow**: Accent color (`--color-accent`) used as a subtle outer glow or border-highlight on hover.
- **Transitions**: All theme and state changes must utilize `transition-all duration-300 ease-in-out`.

## 4. Breakpoints (Layout Control)

| Device      | Constraint                  | Tailwind Prefix |
| :---------- | :-------------------------- | :-------------- |
| **Mobile**  | Default (Max-width: 767px)  | -               |
| **Desktop** | `@media (min-width: 768px)` | `md:`           |

**Note**: Landscape mobile devices that do not meet the `768px` width requirement must render the Mobile UI.
