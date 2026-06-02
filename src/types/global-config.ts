import type { StrapiEntity } from "./strapi";

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

export interface GlobalConfigAttributes extends StrapiEntity {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  siteAuthor: string;
  defaultLocale: string;
  navigation?: NavigationItem[];
  social?: SocialLink[];
}
