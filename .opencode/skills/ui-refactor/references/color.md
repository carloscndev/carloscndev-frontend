# Working with Color

## Color Models

- **Use HSL**: Hue, Saturation, Lightness. It is intuitive.
  - _Hue_: The "color" (0-360).
  - _Saturation_: Vividness (0% grey, 100% pure).
  - _Lightness_: 0% black, 100% white.

## Palette Generation

Do not use "5 color generators." You need more colors than you think.

1.  **Greys**: You need 8-10 shades. Tint them slightly blue (cool) or yellow (warm) to avoid "dead" greys.
2.  **Primary**: 5-10 shades of your main brand color.
3.  **Accents**: Semantic colors (Red/Destructive, Yellow/Warning, Green/Positive) need multiple shades for backgrounds vs text.

## Creating Shades (The Curve)

Do not just lighten/darken the Lightness channel.

- **Saturation Falloff**: As lightness approaches 0% or 100%, perceived saturation drops. You must _increase_ saturation for very light or very dark shades to prevent them from looking washed out.
- **Hue Rotation**: Rotate the hue slightly as you change lightness to mimic natural light.
  - _Darker_: Rotate toward cool/dark colors (Blue/Purple/Red).
  - _Lighter_: Rotate toward bright colors (Yellow/Cyan).

## Accessibility & Contrast

- **WCAG**: 4.5:1 for normal text.
- **Flip Contrast**: If white text on a colored background is hard to read, do not darken the background until it looks black. Flip it: use dark text on a light colored background (e.g., a light red background with dark red text for errors).
- **Rotating Hue**: To increase contrast on colored text without making it black, rotate the hue toward a darker/brighter spectrum (e.g., darken yellow text by moving it toward orange).
- **Color Blindness**: Never rely on color alone. Use icons or text labels to accompany status colors (e.g., graphs, alerts).
