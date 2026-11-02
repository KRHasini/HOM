# @hom/api-client

Typed client for the HOM API. **Generated — never hand-edit `src/schema.d.ts`.**

```bash
pnpm gen:api   # exports the FastAPI OpenAPI schema, then regenerates the types
```

```ts
import { createApiClient } from "@hom/api-client";

const api = createApiClient("https://api.houseofmovements.in");
const { data, error } = await api.POST("/v1/leads", { body, headers: { "Idempotency-Key": key } });
```

CI fails if `openapi.json` is out of date with the API.
