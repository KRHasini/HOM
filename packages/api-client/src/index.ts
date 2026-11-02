/**
 * Typed HOM API client. Request/response types are generated from the FastAPI
 * OpenAPI schema — never hand-write them. Regenerate with `pnpm gen:api`.
 */
import createClient, { type ClientOptions } from "openapi-fetch";

import type { components, paths } from "./schema";

export type ApiPaths = paths;
export type ApiSchemas = components["schemas"];

export type LeadCreate = ApiSchemas["LeadCreate"];
export type LeadCreated = ApiSchemas["LeadCreated"];
export type FormTokenResponse = ApiSchemas["FormTokenResponse"];
export type ClassOut = ApiSchemas["ClassOut"];
export type InstructorOut = ApiSchemas["InstructorOut"];
export type TestimonialOut = ApiSchemas["TestimonialOut"];
export type GalleryItemOut = ApiSchemas["GalleryItemOut"];
export type EventOut = ApiSchemas["EventOut"];
export type ApiErrorBody = ApiSchemas["ErrorBody"];

export type ApiClient = ReturnType<typeof createApiClient>;

export function createApiClient(baseUrl: string, options: Omit<ClientOptions, "baseUrl"> = {}) {
  return createClient<paths>({ baseUrl: baseUrl.replace(/\/$/, ""), ...options });
}
