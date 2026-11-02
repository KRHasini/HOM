# House of Movements — digital platform (Phase 1)

The public marketing website and lead API for **House of Movements (HOM)**, a dance and
fitness studio — _Move . Express . Transform_. Its job is to turn visitors (mostly on
phones, from Instagram and Google) into free-trial bookings and WhatsApp enquiries.

|                       |                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| `apps/web`            | Next.js 16 (App Router, React 19, TypeScript strict), Tailwind CSS 4, Motion, GSAP ScrollTrigger, Lenis |
| `apps/api`            | FastAPI · Pydantic v2 · SQLAlchemy 2 (async) · Alembic · PostgreSQL 16                                  |
| `packages/api-client` | Typed client generated from the API's OpenAPI schema                                                    |
| `packages/config`     | Shared TypeScript and ESLint configuration                                                              |

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## Quick start

### Everything with Docker (one command)

```bash
cp .env.example .env        # optional for local use — sensible defaults apply
docker compose up --build
```

- Website → http://localhost:3000
- API → http://localhost:8000 (interactive docs at `/docs` outside production)
- PostgreSQL → localhost:5432 (migrations and the content seed run automatically)

### Local development

Requirements: Node 24 + pnpm (`corepack enable`), Python 3.12 + [uv](https://docs.astral.sh/uv/), PostgreSQL 16.

```bash
cp .env.example .env              # set DATABASE_URL to your Postgres
pnpm install
cd apps/api && uv sync && cd ../..
pnpm db:migrate && pnpm db:seed   # create tables, load content
pnpm api:dev                      # API on :8000 (terminal 1)
pnpm dev                          # web on :3000 (terminal 2)
```

Without the API running the site still works; only form submission needs it.

---

## Editing content (no code changes)

Everything a studio owner may want to change lives in **`apps/web/src/content/`**, fully
typed and validated at build time — a typo fails the build instead of breaking the site.

| File                                                                                  | Holds                                                                                                                            |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `site.config.ts`                                                                      | Name, taglines, phone, WhatsApp + prefilled message, email, address, map, hours, socials, SEO defaults, analytics, feature flags |
| `brand.config.ts`                                                                     | Logo paths, colors (mirrors `styles/tokens.css`), fonts, per-class accent colors                                                 |
| `navigation.ts`                                                                       | Header/footer links and CTA labels                                                                                               |
| `classes.ts`                                                                          | Every class: taglines, descriptions, benefits, audiences, schedule, fees text, imagery, FAQs, instructors                        |
| `instructors.ts`, `testimonials.ts`, `gallery.ts`, `events.ts`, `faqs.ts`, `stats.ts` | Collections                                                                                                                      |
| `home.ts`, `about.ts`, `pages.ts`, `legal.ts`, `forms.ts`, `ui.ts`                    | Page and interface copy                                                                                                          |

**Each of these is a one-line change that updates the whole site:**

```ts
// Phone number — header menu, footer, contact page, action bar, tap-to-call, JSON-LD
// apps/web/src/content/site.config.ts
phone: { display: "98765 43210", e164: "+919876543210" },
whatsapp: { number: "919876543210", prefill: "Hi HOM, I would like to book a free trial class." },

// A class description — class card, showcase, class page, SEO, structured data, DB seed
// apps/web/src/content/classes.ts  →  the "yoga" entry
summary: "Breath-led strength and calm for every body.",

// A colour token — every gold accent, button, hairline and focus ring
// apps/web/src/styles/tokens.css
--gold: #c39448;

// A social link — footer, mobile menu, contact page, founder profile, JSON-LD sameAs
// apps/web/src/content/site.config.ts
social: { instagram: "https://www.instagram.com/houseofmovements.official", youtube: "…" },
```

Then rebuild (`pnpm build`, or restart `pnpm dev`). If you changed classes, instructors,
testimonials, gallery or events, also run `pnpm content:export` so the database seed matches.

**Placeholders.** Unconfirmed values are marked `TODO(confirm)` in the content files.
Entries with `placeholder: true` (sample testimonials, events, extra instructors,
unverified badges) show in development and are **hidden automatically in production**.
Numeric stats stay hidden until each is `visible: true` and `features.showStats` is on.

## Adding photos and video

Drop files into `apps/web/public/media/` at the documented path — see
[`apps/web/public/media/README.md`](apps/web/public/media/README.md) for every slot and
recommended size. A real file is used automatically; until then an art-directed
placeholder renders. Then run `pnpm media:optimize`. In development append
`?placeholders=1` to any URL to list slots that still need real media.

Logo files go in `apps/web/public/brand/` ([README](apps/web/public/brand/README.md)).

---

## Commands

| Command                                              | What it does                                                                           |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `pnpm dev` / `pnpm api:dev`                          | Web / API in watch mode                                                                |
| `pnpm build`                                         | Production build of the web app                                                        |
| `pnpm lint` · `pnpm typecheck` · `pnpm format:check` | ESLint, `tsc`, Prettier                                                                |
| `pnpm test`                                          | Web unit tests (Vitest + Testing Library)                                              |
| `pnpm api:test` · `pnpm api:lint`                    | API tests (pytest, needs `TEST_DATABASE_URL`) · Ruff + mypy                            |
| `pnpm test:e2e`                                      | Playwright end-to-end + axe accessibility (desktop and mobile); run after `pnpm build` |
| `pnpm screenshots`                                   | Full-page screenshots of every route at 375/768/1440 px → `screenshots/`               |
| `pnpm lighthouse`                                    | Lighthouse CI against the production build (budgets in `apps/web/lighthouserc.json`)   |
| `pnpm gen:api`                                       | Regenerate the typed API client from the OpenAPI schema                                |
| `pnpm content:export`                                | Refresh the API seed snapshot from the content files                                   |
| `pnpm media:optimize`                                | Downscale originals and record sizes + blur previews                                   |
| `pnpm db:migrate` · `pnpm db:seed`                   | Alembic migrations · idempotent content seed                                           |

API tests expect a disposable database, e.g.
`TEST_DATABASE_URL=postgresql+asyncpg://hom:hom@localhost:5432/hom_test pnpm api:test`.

Optional git hooks: `pip install pre-commit && pre-commit install`.

## Environment variables

Every variable is documented in [`.env.example`](.env.example). One `.env` at the repo
root serves the web app, the API and docker compose. Secrets are never committed.

## Privacy

Forms collect only what is needed, require consent, store IPs as keyed hashes and never
log full phone numbers or emails. To erase a person's data on request:

```bash
cd apps/api && uv run python -m app.scripts.delete_lead --phone "+919876543210" --dry-run
cd apps/api && uv run python -m app.scripts.delete_lead --phone "+919876543210"
```

## Deployment

Production Dockerfiles (multi-stage, non-root, healthchecks), `docker-compose.prod.yml`
with Caddy (automatic HTTPS), nightly backups and the release procedure are described in
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
