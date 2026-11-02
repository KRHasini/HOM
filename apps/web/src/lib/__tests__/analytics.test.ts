import { afterEach, describe, expect, it, vi } from "vitest";

import { getConsent, setConsent, track } from "@/lib/analytics";

describe("analytics wrapper", () => {
  afterEach(() => {
    delete window.gtag;
    window.localStorage.clear();
  });

  it("is a no-op when no GA id is configured", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    expect(() => track("cta_click", { location: "test" })).not.toThrow();
    expect(gtag).not.toHaveBeenCalled();
  });

  it("does not throw before gtag has loaded", () => {
    expect(() => track("trial_submitted")).not.toThrow();
  });

  it("persists the visitor's consent decision", () => {
    expect(getConsent()).toBeNull();
    setConsent("granted");
    expect(getConsent()).toBe("granted");
  });
});
