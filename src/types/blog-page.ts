import type { StrapiMediaAttributes } from "./strapi-media";

export interface BlogPost {
  id: string;
  title: string;
  link: string;
  icon: string;
  category: string;
  date: string;
  read_time: string;
  resume: string;
  featuredImage?: StrapiMediaAttributes;
}

export interface BlogPageAttributes {
  title: string;
  intro: string;
  view_more: string;
  posts: BlogPost[];
}
