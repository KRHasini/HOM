# syntax=docker/dockerfile:1.7
# House of Movements web — multi-stage Next.js standalone build, non-root, healthcheck.
# Build context: repository root (docker build -f apps/web/Dockerfile .)

FROM node:24-alpine AS base
ENV PNPM_HOME=/pnpm NEXT_TELEMETRY_DISABLED=1
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /repo

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/
COPY packages/config/package.json packages/config/
COPY packages/api-client/package.json packages/api-client/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter "@hom/web..."

FROM deps AS build
COPY . .
# Public values are inlined into the browser bundle at build time.
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ARG NEXT_PUBLIC_MEDIA_BASE_URL=
ARG NEXT_PUBLIC_GA_ID=
ARG NEXT_PUBLIC_TURNSTILE_ENABLED=false
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_MEDIA_BASE_URL=$NEXT_PUBLIC_MEDIA_BASE_URL \
    NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID \
    NEXT_PUBLIC_TURNSTILE_ENABLED=$NEXT_PUBLIC_TURNSTILE_ENABLED \
    NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
RUN pnpm --filter @hom/web build

FROM node:24-alpine AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S -g 10001 hom && adduser -S -u 10001 -G hom hom
WORKDIR /app
COPY --from=build --chown=hom:hom /repo/apps/web/.next/standalone ./
COPY --from=build --chown=hom:hom /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=hom:hom /repo/apps/web/public ./apps/web/public
USER hom
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=4s --start-period=20s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "apps/web/server.js"]
