import js from "@eslint/js";
import globals from "globals";
import astroPlugin from "eslint-plugin-astro";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";

const astroConfigs = astroPlugin.configs["flat/recommended"].filter(
  (config) => !config.files?.some((f) => f.includes("*.astro/*."))
);

export default [
  {
    ignores: ["node_modules/", "dist/", ".astro/", "public/", ".vercel/"],
  },
  js.configs.recommended,
  ...astroConfigs,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "warn",
    },
  },
  prettierConfig,
];
