import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import mermaid from 'astro-mermaid';

export default defineConfig({
  site: "https://carloscndev.com",
  output: "static",
  integrations: [
    sitemap(),
    mermaid()
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['mermaid']
    }
  },
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
  build: {
    inlineStylesheets: 'always',
  },
});
