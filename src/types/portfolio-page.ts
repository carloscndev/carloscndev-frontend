import type { StrapiMedia } from "./strapi";

export interface ProjectLink {
  type: "repo" | "demo" | "article";
  url: string;
}

export interface Project {
  id: string;
  documentId: string;
  title: string;
  description: string;
  technologies: string[];
  links: ProjectLink[];
  coverImage?: StrapiMedia;
}

export interface PortfolioPageAttributes {
  title: string;
  intro: string;
  viewMore?: string;
  view_more?: string;
  projects: Project[];
}
