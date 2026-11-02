/**
 * Lead form validation. Mirrors apps/api/app/modules/leads/schemas.py — keep in sync.
 * The API is authoritative (full libphonenumber validation); this gives instant,
 * friendly feedback without shipping a phone metadata library to the browser.
 */
import { z } from "zod";

export const weekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export const timeWindows = ["morning", "afternoon", "evening", "weekend", "flexible"] as const;
export type Weekday = (typeof weekdays)[number];
export type TimeWindow = (typeof timeWindows)[number];

/** Normalise to E.164 with India (+91) as the default region. Returns null if invalid. */
export function normalizePhone(raw: string): string | null {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("+")) {
    if (digits.startsWith("91")) return /^91[6-9]\d{9}$/.test(digits) ? `+${digits}` : null;
    return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
  }
  const national =
    digits.length === 11 && digits.startsWith("0")
      ? digits.slice(1)
      : digits.length === 12 && digits.startsWith("91")
        ? digits.slice(2)
        : digits;
  return /^[6-9]\d{9}$/.test(national) ? `+91${national}` : null;
}

export const leadMessages = {
  name: "Please enter your name (2–80 characters).",
  phone: "Enter a valid phone number, e.g. 98765 43210.",
  email: "Enter a valid email address or leave it blank.",
  message: "Please keep your message under 1000 characters.",
  consent: "Please accept the privacy note to continue.",
  audience: "Choose who the class is for.",
  age: "Enter an age between 2 and 99.",
  classSlug: "Choose a class.",
  days: "Pick at least one day.",
  time: "Pick a time that suits you.",
} as const;

const name = z.string().trim().min(2, leadMessages.name).max(80, leadMessages.name);
const phone = z
  .string()
  .trim()
  .refine((v) => normalizePhone(v) !== null, leadMessages.phone);
const email = z.union([z.literal(""), z.email(leadMessages.email).max(254)]);
const message = z.string().max(1000, leadMessages.message);
const consent = z.boolean().refine((v) => v, leadMessages.consent);

export const contactFormSchema = z.object({
  name,
  phone,
  email,
  message,
  consent,
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const quickTrialSchema = z.object({
  name,
  phone,
  classSlug: z.string().min(1, leadMessages.classSlug),
  consent,
});
export type QuickTrialValues = z.infer<typeof quickTrialSchema>;

/** Multi-step trial wizard — validated per step via `trialStepFields`. */
export const trialFormSchema = z.object({
  audience: z.enum(["self", "child"], { error: leadMessages.audience }),
  age: z
    .string()
    .trim()
    .refine((v) => /^\d{1,2}$/.test(v) && Number(v) >= 2 && Number(v) <= 99, leadMessages.age),
  classSlug: z.string().min(1, leadMessages.classSlug),
  preferredDays: z.array(z.enum(weekdays)).min(1, leadMessages.days),
  preferredTime: z.enum(timeWindows, { error: leadMessages.time }),
  name,
  phone,
  email,
  message,
  consent,
});
export type TrialFormValues = z.infer<typeof trialFormSchema>;

export const trialStepFields = [
  ["audience", "age"],
  ["classSlug", "preferredDays", "preferredTime"],
  ["name", "phone", "email", "message", "consent"],
] as const satisfies readonly (readonly (keyof TrialFormValues)[])[];
