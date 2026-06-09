import { describe, it, expect } from "vitest";

describe("reading-time.ts", () => {
  describe("calculateReadingTime", () => {
    describe("in Spanish", () => {
      it("should return 0 min de lectura for empty content", async () => {
        const { calculateReadingTime } =
          await import("../../utils/reading-time");
        expect(calculateReadingTime("")).toBe("0 min de lectura");
        expect(calculateReadingTime(null as any)).toBe("0 min de lectura");
        expect(calculateReadingTime(undefined as any)).toBe("0 min de lectura");
      });

      it("should return 0 min de lectura for whitespace only content", async () => {
        const { calculateReadingTime } =
          await import("../../utils/reading-time");
        expect(calculateReadingTime("   ")).toBe("0 min de lectura");
        expect(calculateReadingTime("\n\t")).toBe("0 min de lectura");
      });

      it("should calculate reading time for short content", async () => {
        const { calculateReadingTime } =
          await import("../../utils/reading-time");
        const shortText =
          "This is a short blog post with about 50 words that should note less than a minute to read.";
        expect(calculateReadingTime(shortText)).toBe("1 min de lectura");
      });

      it("should calculate reading time for content with 200 words", async () => {
        const { calculateReadingTime } =
          await import("../../utils/reading-time");
        const words = Array(200).fill("word").join(" ");
        expect(calculateReadingTime(words)).toBe("1 min de lectura");
      });

      it("should calculate reading time for content with 400 words (2 minutes)", async () => {
        const { calculateReadingTime } =
          await import("../../utils/reading-time");
        const words = Array(400).fill("word").join(" ");
        expect(calculateReadingTime(words)).toBe("2 min de lectura");
      });

      it("should round up to the nearest minute", async () => {
        const { calculateReadingTime } =
          await import("../../utils/reading-time");
        const words = Array(201).fill("word").join(" ");
        expect(calculateReadingTime(words)).toBe("2 min de lectura");
      });

      it("should handle content with extra whitespace", async () => {
        const { calculateReadingTime } =
          await import("../../utils/reading-time");
        const textWithWhitespace = "  word   word   word  ";
        expect(calculateReadingTime(textWithWhitespace)).toBe(
          "1 min de lectura",
        );
      });
    });

    describe("in English", () => {
      it("should return 0 min read for empty content", async () => {
        const { calculateReadingTime } =
          await import("../../utils/reading-time");
        expect(calculateReadingTime("", "en")).toBe("0 min read");
        expect(calculateReadingTime(null as any, "en")).toBe("0 min read");
        expect(calculateReadingTime(undefined as any, "en")).toBe("0 min read");
      });

      it("should return 0 min read for whitespace only content", async () => {
        const { calculateReadingTime } =
          await import("../../utils/reading-time");
        expect(calculateReadingTime("   ", "en")).toBe("0 min read");
        expect(calculateReadingTime("\n\t", "en")).toBe("0 min read");
      });

      it("should calculate reading time for short content", async () => {
        const { calculateReadingTime } =
          await import("../../utils/reading-time");
        const shortText =
          "This is a short blog post with about 50 words that should note less than a minute to read.";
        expect(calculateReadingTime(shortText, "en")).toBe("1 min read");
      });

      it("should calculate reading time for content with 200 words", async () => {
        const { calculateReadingTime } =
          await import("../../utils/reading-time");
        const words = Array(200).fill("word").join(" ");
        expect(calculateReadingTime(words, "en")).toBe("1 min read");
      });

      it("should calculate reading time for content with 400 words (2 minutes)", async () => {
        const { calculateReadingTime } =
          await import("../../utils/reading-time");
        const words = Array(400).fill("word").join(" ");
        expect(calculateReadingTime(words, "en")).toBe("2 min read");
      });

      it("should round up to the nearest minute", async () => {
        const { calculateReadingTime } =
          await import("../../utils/reading-time");
        const words = Array(201).fill("word").join(" ");
        expect(calculateReadingTime(words, "en")).toBe("2 min read");
      });

      it("should handle content with extra whitespace", async () => {
        const { calculateReadingTime } =
          await import("../../utils/reading-time");
        const textWithWhitespace = "  word   word   word  ";
        expect(calculateReadingTime(textWithWhitespace, "en")).toBe(
          "1 min read",
        );
      });
    });
  });
});
