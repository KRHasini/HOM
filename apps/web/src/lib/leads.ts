/**
 * Lead submission through the generated API client. Handles the timing token,
 * idempotency key, attribution and the API's error envelope.
 */
import type { LeadCreate } from "@hom/api-client";

import { api } from "./api";
import { readAttribution } from "./attribution";
import { normalizePhone } from "./validation/lead";

export type LeadInput = Omit<
  LeadCreate,
  "form_token" | "utm_source" | "utm_medium" | "utm_campaign" | "referrer" | "landing_page"
>;

export type SubmitResult =
  | { ok: true; id: string }
  | {
      ok: false;
      reason: "validation" | "rejected" | "rate_limited" | "network" | "server";
      fieldErrors?: Record<string, string>;
    };

export async function fetchFormToken(): Promise<string | null> {
  try {
    const { data } = await api.GET("/v1/leads/form-token", { cache: "no-store" });
    return data?.token ?? null;
  } catch {
    return null;
  }
}

export function newIdempotencyKey(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export async function submitLead(
  input: LeadInput,
  { formToken, idempotencyKey }: { formToken: string | null; idempotencyKey: string },
): Promise<SubmitResult> {
  const token = formToken ?? (await fetchFormToken());
  if (!token) return { ok: false, reason: "network" };

  try {
    const { data, error, response } = await api.POST("/v1/leads", {
      headers: { "Idempotency-Key": idempotencyKey },
      body: {
        ...input,
        phone: normalizePhone(input.phone) ?? input.phone,
        email: input.email || null,
        message: input.message || null,
        ...readAttribution(),
        form_token: token,
      },
    });
    if (data) return { ok: true, id: data.id };

    const envelope = (error as { error?: { code?: string; details?: unknown } } | undefined)?.error;
    if (response.status === 422) {
      const details = Array.isArray(envelope?.details)
        ? (envelope.details as { field?: string; message?: string }[])
        : [];
      return {
        ok: false,
        reason: "validation",
        fieldErrors: Object.fromEntries(
          details.filter((d) => d.field).map((d) => [d.field!, d.message ?? "Invalid value"]),
        ),
      };
    }
    if (response.status === 429) return { ok: false, reason: "rate_limited" };
    if (response.status === 400) return { ok: false, reason: "rejected" };
    return { ok: false, reason: "server" };
  } catch {
    return { ok: false, reason: "network" };
  }
}
