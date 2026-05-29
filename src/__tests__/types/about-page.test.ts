import { describe, it, expect } from "vitest";
import type { AboutPageAttributes, Technology } from "../../types/about-page";

describe("about-page types", () => {
  it("Technology should have id, name, icon", () => {
    const tech: Technology = {
      id: 1,
      name: "React",
      icon: "diamond",
    };
    expect(tech.name).toBe("React");
    expect(tech.icon).toBe("diamond");
  });

  it("AboutPageAttributes should have all fields", () => {
    const about: AboutPageAttributes = {
      id: 1,
      documentId: "doc-about",
      title: "About",
      contentText: "<p>Hello</p>",
      technologies: [
        { id: 1, name: "React", icon: "diamond" },
        { id: 2, name: "TypeScript", icon: "diamond" },
      ],
      image: {
        id: 1,
        documentId: "img-1",
        name: "working.webp",
        alternativeText: null,
        caption: null,
        focalPoint: null,
        width: 1920,
        height: 2176,
        formats: {},
        hash: "working_abc",
        ext: ".webp",
        mime: "image/webp",
        size: 100,
        url: "/uploads/working_abc.webp",
        previewUrl: null,
        provider: "local",
        provider_metadata: null,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
        publishedAt: "2024-01-01T00:00:00.000Z",
      },
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
      publishedAt: "2024-01-01T00:00:00.000Z",
      locale: "es",
    };
    expect(about.title).toBe("About");
    expect(about.technologies).toHaveLength(2);
    expect(about.image.url).toContain("working");
    expect(about.documentId).toBe("doc-about");
  });
});
