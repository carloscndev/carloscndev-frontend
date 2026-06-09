import type { StrapiMedia } from "./strapi";

export interface AuthorAttributes {
  id: number;
  documentId: string;
  name: string;
  nickname: string;
  slug: string;
  avatar?: StrapiMedia;
  bio?: string;
  role?: string;
  twitter?: string;
  github?: string;
}

export interface SeoAttributes {
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: StrapiMedia;
  keywords?: string;
  metaRobots?: string;
}

export interface BlogPostAttributes {
  documentId: string;
  title: string;
  slug: string;
  author: AuthorAttributes;
  excerpt: string;
  readTime: string;
  date: string;
  content: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  coverImage?: StrapiMedia;
  seo?: SeoAttributes;
}
