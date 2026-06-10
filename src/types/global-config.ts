import type { StrapiEntity, StrapiMedia } from "./strapi";

export interface NavigationItem {
  id: number;
  key: string;
  href: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
}

export interface GlobalConfigSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  metaImage?: StrapiMedia;
  metaRobots?: string;
}

export interface GlobalConfigAttributes extends StrapiEntity {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  siteAuthor: string;
  defaultLocale: string;
  navigation?: NavigationItem[];
  social?: SocialLink[];
  seo?: GlobalConfigSeo;
}
