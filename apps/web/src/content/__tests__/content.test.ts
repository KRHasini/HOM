import { afterEach, describe, expect, it, vi } from "vitest";

async function loadContent() {
  vi.resetModules();
  return import("@/content");
}

describe("content accessors", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("validates and exposes all eight classes in sort order", async () => {
    const { getClasses } = await loadContent();
    const classes = await getClasses();
    expect(classes).toHaveLength(8);
    expect(classes.map((c) => c.sortOrder)).toEqual(
      [...classes.map((c) => c.sortOrder)].sort((a, b) => a - b),
    );
    expect(classes.every((c) => c.href === `/classes/${c.slug}`)).toBe(true);
  });

  it("filters classes by category and audience", async () => {
    const { getClasses } = await loadContent();
    const traditional = await getClasses({ category: "traditional" });
    expect(traditional.map((c) => c.slug)).toEqual(["bharatanatyam"]);
    const kids = await getClasses({ audience: "kids" });
    expect(kids.every((c) => c.audiences.includes("kids"))).toBe(true);
  });

  it("resolves a class by slug and returns null for unknown slugs", async () => {
    const { getClassBySlug } = await loadContent();
    expect((await getClassBySlug("yoga"))?.name).toBe("Yoga");
    expect(await getClassBySlug("ballet")).toBeNull();
  });

  it("falls back to placeholders for missing media files", async () => {
    const { getFounder } = await loadContent();
    const founder = await getFounder();
    expect(founder.photo.exists).toBe(false);
    expect(founder.photo.motif).toBe("portrait");
  });

  it("uses real media with manifest dimensions when the file exists", async () => {
    const { getClassBySlug } = await loadContent();
    const cover = (await getClassBySlug("bharatanatyam"))!.cover;
    expect(cover.exists).toBe(true);
    expect(cover.blurDataURL).toMatch(/^data:image\/webp;base64,/);
  });

  it("shows placeholder testimonials, events and instructors in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { getTestimonials, getEvents, getInstructors } = await loadContent();
    expect((await getTestimonials()).length).toBeGreaterThan(0);
    expect((await getEvents()).upcoming.length).toBeGreaterThan(0);
    expect((await getInstructors()).length).toBeGreaterThan(1);
  });

  it("hides every placeholder and unverified claim in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const {
      getTestimonials,
      hasTestimonials,
      getEvents,
      getInstructors,
      getHome,
      getStats,
      getNavigation,
    } = await loadContent();
    expect(await getTestimonials()).toEqual([]);
    expect(await hasTestimonials()).toBe(false);
    expect((await getEvents()).upcoming).toEqual([]);
    expect((await getInstructors()).map((i) => i.slug)).toEqual(["vignesh-k"]);
    expect((await getHome()).trust.items.every((t) => t.verified)).toBe(true);
    expect(getStats()).toEqual([]);
    const nav = await getNavigation();
    expect(nav.footer.flatMap((g) => g.links).some((l) => l.href === "/testimonials")).toBe(false);
  });

  it("fills the class count into trust copy", async () => {
    const { getHome } = await loadContent();
    expect((await getHome()).trust.items.some((t) => t.label.startsWith("8 "))).toBe(true);
  });

  it("throws on unknown FAQ ids so typos fail the build", async () => {
    const { getFaqsByIds } = await loadContent();
    expect(() => getFaqsByIds(["does-not-exist"])).toThrow(/Unknown FAQ id/);
  });
});
