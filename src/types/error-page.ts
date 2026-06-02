import type { StrapiMedia } from "./strapi";

export interface ErrorPageAttributes {
  title: string;
  message: string;
  button_text: string;
  image: StrapiMedia;
}
