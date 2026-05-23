import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import compress from "astro-compress";

export default defineConfig({
  site: "https://carloscndev.com",

  output: "static",

  integrations: [
    sitemap(),
    compress(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
});
