import js from "@eslint/js";
import globals from "globals";
import astroPlugin from "eslint-plugin-astro";
import astroParser from "astro-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  // 1. Ignorar carpetas generadas
  {
    ignores: ["node_modules/", "dist/", ".astro/", "public/"],
  },

  // 2. Configuración base para JavaScript
  js.configs.recommended,
  prettierConfig, // Desactiva reglas de ESLint que choquen con Prettier
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },

  // 3. Configuración específica para archivos .astro
  {
    files: ["**/*.astro"],
    plugins: {
      astro: astroPlugin,
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        sourceType: "module",
        ecmaVersion: "latest",
        extraFileExtensions: [".astro"],
      },
    },
    rules: {
      // Reglas recomendadas de Astro
      ...astroPlugin.configs.recommended.rules,
      // Forzamos a Prettier a usar el parser de Astro para evitar el error de tokens
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          parser: "astro",
        },
      ],
    },
  },

  // 4. Configuración para archivos JS/MJS individuales
  {
    files: ["**/*.js", "**/*.mjs"],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
];
