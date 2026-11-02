import { describe, expect, it } from "vitest";

import { mediaUrl } from "@/lib/media";

describe("mediaUrl", () => {
  it("serves local media from /public by default", () => {
    expect(mediaUrl("/media/classes/yoga/cover.jpg", "")).toBe("/media/classes/yoga/cover.jpg");
  });

  it("prefixes a CDN base when configured (the single seam for a cloud move)", () => {
    expect(mediaUrl("/media/hero/hero.mp4", "https://cdn.example.com/")).toBe(
      "https://cdn.example.com/media/hero/hero.mp4",
    );
  });

  it("adds a missing leading slash and leaves absolute URLs untouched", () => {
    expect(mediaUrl("media/a.jpg", "")).toBe("/media/a.jpg");
    expect(mediaUrl("https://x.test/a.jpg", "https://cdn")).toBe("https://x.test/a.jpg");
  });
});
