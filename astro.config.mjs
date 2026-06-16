import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkMermaid from "remark-mermaidjs";

export default defineConfig({
  site: "https://carloscndev.com",
  output: "static",
  integrations: [
    sitemap()
  ],
  markdown: {
    remarkPlugins: [remarkMermaid],
  },
  vite: {
    plugins: [tailwindcss()]
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
