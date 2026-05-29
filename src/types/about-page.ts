import type { StrapiEntity, StrapiMedia } from "./strapi";

export interface Technology {
  id: number;
  name: string;
  icon: string;
}

export interface AboutPageAttributes extends StrapiEntity {
  title: string;
  contentText: string;
  technologies: Technology[];
  image: StrapiMedia;
}
