import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkMermaid from "remark-mermaid-dataurl";
import rehypeExternalLinks from 'rehype-external-links';

export default defineConfig({
  site: "https://carloscndev.com",
  output: "static",
  integrations: [
    sitemap()
  ],
  markdown: {
    remarkPlugins: [remarkMermaid],
    rehypePlugins: [
      [rehypeExternalLinks, { 
        target: '_blank', 
        rel: ['noopener', 'noreferrer'] 
      }]
    ],
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
