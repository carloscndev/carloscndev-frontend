import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  queryStrapi,
  fetchSingleType,
  fetchCollection,
  fetchCollectionEntry,
  type StrapiSingleResponse,
} from "../../services/strapi";

describe("strapi service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockFetch = (response: unknown, ok = true) => {
    global.fetch = vi.fn().mockResolvedValue({
      ok,
      status: ok ? 200 : 500,
      statusText: ok ? "OK" : "Internal Server Error",
      json: async () => response,
    });
  };

  describe("queryStrapi", () => {
    it("should construct the correct URL with qs query string", async () => {
      mockFetch({ data: { id: 1 }, meta: {} });

      await queryStrapi(
        "articles",
        { locale: "es", populate: ["image"] },
        {
          config: { baseUrl: "http://test.local", token: "test-token" },
        },
      );

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const [url, init] = vi.mocked(global.fetch).mock.calls[0];
      expect(url).toBe(
        "http://test.local/api/articles?locale=es&populate[0]=image",
      );
      expect((init as RequestInit).headers).toMatchObject({
        "Content-Type": "application/json",
        Authorization: "Bearer test-token",
      });
    });

    it("should work without optional token", async () => {
      mockFetch({ data: null, meta: {} });

      await queryStrapi(
        "global-config",
        {},
        {
          config: { baseUrl: "http://test.local" },
        },
      );

      const [, init] = vi.mocked(global.fetch).mock.calls[0];
      expect((init as RequestInit).headers).not.toHaveProperty("Authorization");
    });

    it("should merge custom headers", async () => {
      mockFetch({ data: null, meta: {} });

      await queryStrapi(
        "articles",
        {},
        {
          config: { baseUrl: "http://test.local", token: "abc" },
          headers: { "X-Custom": "value" },
        },
      );

      const [, init] = vi.mocked(global.fetch).mock.calls[0];
      expect((init as RequestInit).headers).toMatchObject({
        "Content-Type": "application/json",
        Authorization: "Bearer abc",
        "X-Custom": "value",
      });
    });

    it("should throw on non-ok response", async () => {
      mockFetch({ error: { message: "Bad Request" } }, false);

      await expect(
        queryStrapi(
          "articles",
          {},
          {
            config: { baseUrl: "http://test.local" },
          },
        ),
      ).rejects.toThrow(
        "Strapi query failed for articles: 500 Internal Server Error",
      );
    });

    it("should return typed response", async () => {
      interface Article {
        id: number;
        title: string;
      }

      mockFetch({ data: { id: 1, title: "Hello" }, meta: {} });

      const result = await queryStrapi<StrapiSingleResponse<Article>>(
        "articles",
        {},
        {
          config: { baseUrl: "http://test.local" },
        },
      );

      expect(result.data).toEqual({ id: 1, title: "Hello" });
      expect(result.meta).toEqual({});
    });
  });

  describe("fetchSingleType", () => {
    it("should return data for a single type", async () => {
      interface Config {
        siteName: string;
      }

      mockFetch({ data: { siteName: "Portfolio" }, meta: {} });

      const result = await fetchSingleType<Config>(
        "global-config",
        "es",
        {},
        { baseUrl: "http://test.local" },
      );

      expect(global.fetch).toHaveBeenCalledWith(
        "http://test.local/api/global-config?locale=es",
        expect.any(Object),
      );
      expect(result).toEqual({ siteName: "Portfolio" });
    });

    it("should return null when data is null", async () => {
      mockFetch({ data: null, meta: {} });

      const result = await fetchSingleType(
        "global-config",
        "en",
        {},
        {
          baseUrl: "http://test.local",
        },
      );

      expect(result).toBeNull();
    });
  });

  describe("fetchCollection", () => {
    it("should return an array of items", async () => {
      interface Project {
        title: string;
      }

      mockFetch({
        data: [{ title: "A" }, { title: "B" }],
        meta: { pagination: { total: 2 } },
      });

      const result = await fetchCollection<Project>(
        "projects",
        "en",
        { populate: "image" },
        { baseUrl: "http://test.local" },
      );

      expect(global.fetch).toHaveBeenCalledWith(
        "http://test.local/api/projects?locale=en&populate=image",
        expect.any(Object),
      );
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe("A");
    });

    it("should return empty array when data is empty", async () => {
      mockFetch({ data: [], meta: {} });

      const result = await fetchCollection(
        "projects",
        "es",
        {},
        {
          baseUrl: "http://test.local",
        },
      );

      expect(result).toEqual([]);
    });
  });

  describe("fetchCollectionEntry", () => {
    it("should return a single entry by id", async () => {
      interface Post {
        slug: string;
      }

      mockFetch({ data: { slug: "hello-world" }, meta: {} });

      const result = await fetchCollectionEntry<Post>(
        "posts",
        "hello-world",
        "es",
        { populate: "category" },
        { baseUrl: "http://test.local" },
      );

      expect(global.fetch).toHaveBeenCalledWith(
        "http://test.local/api/posts/hello-world?locale=es&populate=category",
        expect.any(Object),
      );
      expect(result).toEqual({ slug: "hello-world" });
    });

    it("should return null for missing entry", async () => {
      mockFetch({ data: null, meta: {} });

      const result = await fetchCollectionEntry(
        "posts",
        "missing",
        "en",
        {},
        {
          baseUrl: "http://test.local",
        },
      );

      expect(result).toBeNull();
    });
  });
});
