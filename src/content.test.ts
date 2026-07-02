import { describe, expect, it } from "vitest";
import type { NostrEvent } from "applesauce-core/helpers";
import { getImages, matchesFilter } from "./content";

function note(content: string): NostrEvent {
  return { id: "x", pubkey: "y", created_at: 0, kind: 1, tags: [], content, sig: "" };
}

describe("getImages", () => {
  it("extracts image links and de-dupes them", () => {
    const event = note("gm https://example.com/a.jpg and again https://example.com/a.jpg");
    expect(getImages(event)).toEqual(["https://example.com/a.jpg"]);
  });

  it("ignores non-image links", () => {
    expect(getImages(note("gm https://example.com/article"))).toEqual([]);
  });
});

describe("matchesFilter", () => {
  it("matches the term as a word, case-insensitively (default gm)", () => {
    expect(matchesFilter(note("GM everyone"))).toBe(true);
    expect(matchesFilter(note("gm"))).toBe(true);
  });

  it("does not match the term inside other words", () => {
    expect(matchesFilter(note("programming is fun"))).toBe(false);
  });
});
