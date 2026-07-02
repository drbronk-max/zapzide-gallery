import { describe, expect, it } from "vitest";
import type { NostrEvent } from "applesauce-core/helpers";
import { getImages, isGmPost } from "./content";

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

describe("isGmPost", () => {
  it("matches gm as a word, case-insensitively", () => {
    expect(isGmPost(note("GM everyone"))).toBe(true);
    expect(isGmPost(note("gm"))).toBe(true);
  });

  it("does not match gm inside other words", () => {
    expect(isGmPost(note("programming is fun"))).toBe(false);
  });
});
