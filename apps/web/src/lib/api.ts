import { createApiClient } from "@hom/api-client";

import { publicEnv } from "./env";

/** Browser-facing API client (all request/response types are generated). */
export const api = createApiClient(publicEnv.apiUrl);
