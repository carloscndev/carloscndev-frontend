import qs from "qs";

export interface StrapiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

export interface StrapiSingleResponse<T> {
  data: T | null;
  meta: Record<string, unknown>;
}

export interface StrapiCollectionResponse<T> {
  data: T[];
  meta: Record<string, unknown>;
}

export interface StrapiClientConfig {
  baseUrl?: string;
  token?: string;
}

function getDefaultConfig(): Pick<StrapiClientConfig, "baseUrl" | "token"> {
  return {
    baseUrl: import.meta.env?.STRAPI_URL,
    token: import.meta.env?.STRAPI_TOKEN,
  };
}

function buildHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function queryStrapi<T>(
  endpoint: string,
  queryObj: Record<string, unknown> = {},
  options: RequestInit & { config?: StrapiClientConfig } = {},
): Promise<T> {
  const defaultConfig = getDefaultConfig();
  const baseUrl = options.config?.baseUrl ?? defaultConfig.baseUrl;
  const token = options.config?.token ?? defaultConfig.token;

  if (!baseUrl) {
    throw new Error("Missing STRAPI_URL environment variable");
  }

  const queryString = qs.stringify(queryObj, { encodeValuesOnly: true });
  const url = `${baseUrl}/api/${endpoint}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...buildHeaders(token),
      ...((options.headers as Record<string, string>) ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(
      `Strapi query failed for ${endpoint}: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

export async function fetchSingleType<T>(
  slug: string,
  locale: string,
  queryObj: Record<string, unknown> = {},
  config?: StrapiClientConfig,
): Promise<T | null> {
  const response = await queryStrapi<StrapiSingleResponse<T>>(
    slug,
    {
      locale,
      ...queryObj,
    },
    { config },
  );
  return response.data;
}

export async function fetchCollection<T>(
  slug: string,
  locale: string,
  queryObj: Record<string, unknown> = {},
  config?: StrapiClientConfig,
): Promise<T[]> {
  try {
    const response = await queryStrapi<StrapiCollectionResponse<T>>(
      slug,
      {
        locale,
        ...queryObj,
      },
      { config },
    );
    return response.data;
  } catch {
    return [];
  }
}

export function getStrapiMediaUrl(
  mediaUrl: string,
  config?: StrapiClientConfig,
): string {
  const defaultConfig = getDefaultConfig();
  const baseUrl = config?.baseUrl ?? defaultConfig.baseUrl;
  if (mediaUrl.startsWith("http")) return mediaUrl;
  if (!baseUrl) return mediaUrl;
  return `${baseUrl}${mediaUrl}`;
}

export async function fetchCollectionEntry<T>(
  slug: string,
  id: string,
  locale: string,
  queryObj: Record<string, unknown> = {},
  config?: StrapiClientConfig,
): Promise<T | null> {
  try {
    const response = await queryStrapi<StrapiSingleResponse<T>>(
      `${slug}/${id}`,
      {
        locale,
        ...queryObj,
      },
      { config },
    );
    return response.data;
  } catch {
    return null;
  }
}
