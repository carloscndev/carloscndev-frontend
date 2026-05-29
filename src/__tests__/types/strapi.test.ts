import { describe, it, expect } from "vitest";
import type {
  StrapiResponse,
  StrapiSingleResponse,
  StrapiCollectionResponse,
  StrapiMedia,
  StrapiMediaFormat,
  StrapiRelation,
  StrapiRelationCollection,
  StrapiEntity,
  StrapiLocalized,
} from "../../types/strapi";

describe("strapi types", () => {
  it("StrapiResponse should accept generic data and meta", () => {
    const response: StrapiResponse<{ title: string }> = {
      data: { title: "Hello" },
      meta: { pagination: { total: 1 } },
    };
    expect(response.data.title).toBe("Hello");
    expect(response.meta.pagination).toEqual({ total: 1 });
  });

  it("StrapiSingleResponse should allow null data", () => {
    const response: StrapiSingleResponse<{ name: string }> = {
      data: null,
      meta: {},
    };
    expect(response.data).toBeNull();
  });

  it("StrapiCollectionResponse should accept array data", () => {
    const response: StrapiCollectionResponse<{ id: number }> = {
      data: [{ id: 1 }, { id: 2 }],
      meta: {},
    };
    expect(response.data).toHaveLength(2);
  });

  it("StrapiMediaFormat should have all required fields", () => {
    const format: StrapiMediaFormat = {
      name: "thumbnail_test.webp",
      hash: "thumbnail_test_abc123",
      ext: ".webp",
      mime: "image/webp",
      path: null,
      width: 138,
      height: 156,
      size: 3.54,
      sizeInBytes: 3544,
      url: "/uploads/thumbnail_test_abc123.webp",
    };
    expect(format.url).toBe("/uploads/thumbnail_test_abc123.webp");
    expect(format.width).toBe(138);
  });

  it("StrapiMedia should have formats and url", () => {
    const media: StrapiMedia = {
      id: 1,
      documentId: "doc-123",
      name: "test.webp",
      alternativeText: null,
      caption: null,
      focalPoint: null,
      width: 1920,
      height: 1080,
      formats: {
        thumbnail: {
          name: "thumb.webp",
          hash: "thumb_abc",
          ext: ".webp",
          mime: "image/webp",
          path: null,
          width: 200,
          height: 112,
          size: 10,
          sizeInBytes: 10000,
          url: "/uploads/thumb_abc.webp",
        },
      },
      hash: "test_abc",
      ext: ".webp",
      mime: "image/webp",
      size: 100,
      url: "/uploads/test_abc.webp",
      previewUrl: null,
      provider: "local",
      provider_metadata: null,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
      publishedAt: "2024-01-01T00:00:00.000Z",
    };
    expect(media.url).toBe("/uploads/test_abc.webp");
    expect(media.formats.thumbnail?.width).toBe(200);
  });

  it("StrapiRelation should hold nullable data", () => {
    const relation: StrapiRelation<{ name: string }> = {
      data: { name: "Category" },
    };
    expect(relation.data?.name).toBe("Category");
  });

  it("StrapiRelationCollection should hold array data", () => {
    const relation: StrapiRelationCollection<{ title: string }> = {
      data: [{ title: "A" }, { title: "B" }],
    };
    expect(relation.data).toHaveLength(2);
  });

  it("StrapiEntity should have base fields", () => {
    const entity: StrapiEntity = {
      id: 1,
      documentId: "doc-456",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
      publishedAt: "2024-01-01T00:00:00.000Z",
      locale: "es",
    };
    expect(entity.locale).toBe("es");
    expect(entity.documentId).toBe("doc-456");
  });

  it("StrapiLocalized should hold localizations array", () => {
    const localized: StrapiLocalized<{ title: string }> = {
      localizations: [{ title: "English" }],
    };
    expect(localized.localizations).toHaveLength(1);
  });
});
