export function calculateReadingTime(
  content: string,
  lang: string = "es",
): string {
  const trimmed = content?.trim();
  if (!trimmed) return lang === "en" ? "0 min read" : "0 min de lectura";
  const words = trimmed.split(/\s+/).length;
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);
  return lang === "en" ? `${minutes} min read` : `${minutes} min de lectura`;
}
