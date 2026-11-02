import { describe, expect, it } from "vitest";

import {
  contactFormSchema,
  normalizePhone,
  quickTrialSchema,
  trialFormSchema,
} from "@/lib/validation/lead";

describe("normalizePhone", () => {
  it.each([
    ["97425 08862", "+919742508862"],
    ["9742508862", "+919742508862"],
    ["09742508862", "+919742508862"],
    ["+91 97425-08862", "+919742508862"],
    ["919742508862", "+919742508862"],
    ["+44 20 7946 0958", "+442079460958"],
  ])("normalises %s to E.164", (raw, expected) => {
    expect(normalizePhone(raw)).toBe(expected);
  });

  it.each(["", "12345", "abcdefghij", "+91 12345", "5742508862"])("rejects %s", (raw) => {
    expect(normalizePhone(raw)).toBeNull();
  });
});

describe("lead form schemas (mirror the API rules)", () => {
  const contact = { name: "Ravi", phone: "98450 12345", email: "", message: "", consent: true };

  it("accepts a valid contact enquiry with optional fields blank", () => {
    expect(contactFormSchema.safeParse(contact).success).toBe(true);
  });

  it.each([
    ["name too short", { name: "R" }],
    ["name too long", { name: "x".repeat(81) }],
    ["invalid phone", { phone: "123" }],
    ["invalid email", { email: "nope" }],
    ["message too long", { message: "x".repeat(1001) }],
    ["consent missing", { consent: false }],
  ])("rejects %s", (_, override) => {
    expect(contactFormSchema.safeParse({ ...contact, ...override }).success).toBe(false);
  });

  it("requires a class for the quick trial form", () => {
    const base = { name: "Ravi", phone: "9845012345", consent: true };
    expect(quickTrialSchema.safeParse({ ...base, classSlug: "" }).success).toBe(false);
    expect(quickTrialSchema.safeParse({ ...base, classSlug: "yoga" }).success).toBe(true);
  });

  it("validates every trial wizard step", () => {
    const valid = {
      audience: "child",
      age: "9",
      classSlug: "bharatanatyam",
      preferredDays: ["sat"],
      preferredTime: "morning",
      name: "Ananya",
      phone: "9845012345",
      email: "",
      message: "",
      consent: true,
    };
    expect(trialFormSchema.safeParse(valid).success).toBe(true);
    expect(trialFormSchema.safeParse({ ...valid, age: "120" }).success).toBe(false);
    expect(trialFormSchema.safeParse({ ...valid, preferredDays: [] }).success).toBe(false);
  });
});
