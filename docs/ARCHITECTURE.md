# Architecture

```
Browser ──(static HTML, SSG)──▶ Next.js web (apps/web)
   │                                 │ reads typed content (src/content) at build time
   │                                 │ CONTENT_SOURCE=api → overlays API data (Phase 2)
   └──(POST /v1/leads, CORS)──▶ FastAPI (apps/api) ──▶ PostgreSQL 16
                                      └──▶ Mailer (console | SMTP) → studio inbox
```

## Web (`apps/web`)

| Folder                                            | Responsibility                                                                                                                                                                                                                                                       |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/(marketing)`                             | Routes. Server components by default; pages only compose sections from content.                                                                                                                                                                                      |
| `src/content`                                     | **All editable content and config**, Zod-validated at build (`schema.ts`). Pages read it only through `content/index.ts` accessors.                                                                                                                                  |
| `src/components/motion`                           | The motion library: `Reveal`, `SplitText`, `ImageReveal`, `Parallax`, `Marquee`, `Magnetic`, `Counter`, `HorizontalScroll`, `PageTransition`, `SmoothScroll`, `CustomCursor`, `DrawLine`, CSS `Intro*` for above-the-fold. Timing constants live in `lib/motion.ts`. |
| `src/components/{ui,layout,sections,forms,media}` | Restyled primitives, global chrome, page sections, lead forms, media (SmartImage / MediaPlaceholder / LazyVideo).                                                                                                                                                    |
| `src/lib`                                         | API client wrapper, analytics `track()`, attribution, SEO + JSON-LD builders, validation (mirrors the API), `mediaUrl()`.                                                                                                                                            |
| `src/styles`                                      | `tokens.css` (single source of design tokens) → mapped into Tailwind in `globals.css`.                                                                                                                                                                               |

Key seams:

- **Content source** — `content/source.ts` (`localSource` / `apiSource`), switched by `CONTENT_SOURCE`.
- **Media** — `lib/media.ts#mediaUrl` is the only place URLs are built (set `NEXT_PUBLIC_MEDIA_BASE_URL` for a CDN). Missing files fall back to `MediaPlaceholder` automatically.
- **Analytics** — `lib/analytics.ts#track` (GA4 only when an id is set and consent given).
- **Placeholders** — anything `placeholder: true` (testimonials, events, extra instructors, achievements, unverified trust badges, timeline items) is shown in development and hidden in production.

## API (`apps/api`) — modular monolith

`router → service → repository → database`. Routers hold no business logic; external
dependencies sit behind protocols: `notifications/base.py#Mailer`,
`media/storage.py#MediaStorage`, `core/rate_limit.py#RateLimiter`.

| Module                                | Phase 1                                                                                                                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `leads`                               | `POST /v1/leads` (honeypot, signed timing token, per-IP rate limit, optional Turnstile, idempotency, audit events, async notification), `GET /v1/leads/form-token` |
| `classes`, `instructors`, `marketing` | Read endpoints (`/v1/classes`, `/v1/instructors`, `/v1/testimonials`, `/v1/gallery`, `/v1/events`) over seeded tables                                              |
| `notifications`                       | Console + SMTP mailers, email templates                                                                                                                            |
| `media`                               | `LocalMediaStorage` (uploads arrive in Phase 2)                                                                                                                    |
| `bookings`, `payments`                | Reserved seams (table / README only)                                                                                                                               |

Every table has a UUID `id`, `created_at`, `updated_at` and `deleted_at`. Errors always
use `{"error": {"code", "message", "details"}}`. Logs are structured JSON with a request id;
phone numbers and emails are masked and IPs are stored only as keyed hashes.

## Data flow for a lead

1. The form fetches a signed timing token after mount and creates one `Idempotency-Key` per form session.
2. `POST /v1/leads` validates (Pydantic, E.164 phone, consent), runs spam checks, stores the lead and a `created` event, returns `201 {id, message}`.
3. A background task emails the studio (tel: and WhatsApp one-tap links) and records `notified` or `notify_failed` — a failed email never fails the request.
