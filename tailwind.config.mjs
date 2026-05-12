/** @type {import("tailwindcss").Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          dark: "var(--bg-primary)",
          light: "var(--bg-primary)",
        },
        accent: "var(--color-accent)",
        word: "var(--color-word)",
        text: "var(--text-base)",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      transitionDuration: {
        300: "300ms",
      },
      transitionTimingFunction: {
        "ease-in-out": "ease-in-out",
      },
    },
  },
  plugins: [],
};
