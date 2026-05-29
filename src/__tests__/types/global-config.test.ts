import { describe, it, expect } from "vitest";
import type {
  GlobalConfigAttributes,
  NavigationItem,
  SocialLink,
} from "../../types/global-config";

describe("global-config types", () => {
  it("NavigationItem should have id, key, href", () => {
    const item: NavigationItem = {
      id: 1,
      key: "home",
      href: "/",
    };
    expect(item.key).toBe("home");
    expect(item.href).toBe("/");
  });

  it("SocialLink should have id, platform, url", () => {
    const link: SocialLink = {
      id: 2,
      platform: "github",
      url: "https://github.com/carloscndev",
    };
    expect(link.platform).toBe("github");
    expect(link.url).toContain("github");
  });

  it("GlobalConfigAttributes should extend StrapiEntity", () => {
    const config: GlobalConfigAttributes = {
      id: 1,
      documentId: "doc-abc",
      siteName: "Carlos Castañeda",
      siteTitle: "carloscndev",
      siteDescription: "Portfolio",
      siteAuthor: "carloscndev",
      defaultLocale: "es",
      navigation: [{ id: 1, key: "home", href: "/" }],
      social: [{ id: 1, platform: "github", url: "https://github.com" }],
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
      publishedAt: "2024-01-01T00:00:00.000Z",
      locale: "es",
    };
    expect(config.siteName).toBe("Carlos Castañeda");
    expect(config.defaultLocale).toBe("es");
    expect(config.navigation).toHaveLength(1);
    expect(config.social).toHaveLength(1);
    expect(config.documentId).toBe("doc-abc");
  });
});
