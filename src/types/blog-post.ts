import type { StrapiMedia } from "./strapi";

export interface BlogPostAttributes {
  documentId: string;
  title: string;
  slug: string;
  author: string;
  resume: string;
  readTime: string;
  date: string;
  icon: string;
  content: string;
  category?: {
    id: number;
    name: string;
    slug: string;
    icon: string;
  };
  headerImage?: StrapiMedia;
  featuredImage?: StrapiMedia;
}
