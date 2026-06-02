import type { StrapiMedia } from "./strapi";

export interface BlogPost {
  id: string;
  title: string;
  link: string;
  icon: string;
  category: string;
  date: string;
  read_time: string;
  resume: string;
  featuredImage?: StrapiMedia;
}

export interface BlogPageAttributes {
  title: string;
  intro: string;
  view_more: string;
  posts: BlogPost[];
}
