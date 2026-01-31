import * as astroPlugin from "prettier-plugin-astro";

export default {
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
  tabWidth: 2,
  printWidth: 80,
  endOfLine: "auto",
  plugins: [astroPlugin],
};
