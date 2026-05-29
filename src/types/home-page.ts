import type { StrapiEntity, StrapiMedia } from "./strapi";

export interface HomePageAttributes extends StrapiEntity {
  intro: string;
  title: string;
  subtitle: string;
  content: string;
  avatarDefault: StrapiMedia;
  avatarRunning: StrapiMedia;
  avatarReading: StrapiMedia;
  avatarVideogames: StrapiMedia;
}
