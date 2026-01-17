import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import prettierPlugin from "eslint-plugin-prettier";
import astroPlugin from "eslint-plugin-astro";

export default defineConfig([
  js.configs.recommended,
  {
    files: ["**/*.{js,ts}"],
    ignores: ["node_modules", "dist"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  {
    files: ["**/*.astro"],
    plugins: {
      astro: astroPlugin,
    },
    languageOptions: {
      parser: astroPlugin.parser,
    },
    rules: {
      "astro/no-set-html-directive": "warn",
      "astro/no-unused-css-selector": "warn",
    },
  },
]);
