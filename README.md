# Aspire Platform

Full-stack platform for **Team Aspire** — a women-only NGO rooted in deen, sisterhood & humanitarian service. Three apps, one PostgreSQL source of truth (rpi homeserver `192.168.0.108`).

| App | Stack | Port | Purpose |
| --- | --- | --- | --- |
| [backend](backend/) | Express + TS + Sequelize + Redis ([NodeTs-Express-Service-Based-Template](https://github.com/Thre4dripper/NodeTs-Express-Service-Based-Template)) | 8000 | Modular service-based API, Swagger at `/api-docs` |
| [product-site](product-site/) | Next.js 15 + Tailwind + shadcn/ui | 3000 | Public website — projects, donations, courses, verification |
| [admin-console](admin-console/) | Vite + React + TanStack Query + shadcn/ui | 5173 | Operational control plane — CRM, LMS, finance, RBAC |

## Quick start

```bash
# 1. Backend (creates tables via sequelize sync on boot)
cd backend
pnpm install
pnpm keys:generate       # RS256 keypair for JWT
pnpm db:seed             # roles, permissions, demo team + content
pnpm dev

# 2. Public site
cd ../product-site && pnpm install && pnpm dev

# 3. Admin console
cd ../admin-console && pnpm install && pnpm dev
```

Environment lives in `backend/.env` (DB + Redis on the homeserver, see `.env.sample`), `product-site/.env.local`, `admin-console/.env`.

## Seeded accounts

| Role | Email | Password |
| --- | --- | --- |
| Super admin | admin@teamaspire.org | Admin@123 |
| Admin | fatima@teamaspire.org | Admin@123 |
| Program manager | maryam@teamaspire.org | Admin@123 |
| Finance | khadija@teamaspire.org | Admin@123 |
| Teacher | aaliyah@teamaspire.org | Teacher@123 |
| Student/member | zara@example.com | Student@123 |

## Domain map

- **Identity & RBAC** — one canonical `User`, roles → permissions (27-grant catalogue), Redis-cached context, permission matrix editable in the admin.
- **Donations** — mock gateway lifecycle (`initiated → success/failed/refunded`), idempotent webhook, receipts, campaign & project attribution, refunds with total rollback.
- **Projects** — public storytelling + funding progress + impact stats + updates timeline.
- **LMS** — courses → cohorts → class sessions → attendance; teacher-scoped access; self-enrollment from the public site.
- **Certificates** — attendance-based eligibility, public verification codes (`/verify`).
- **CRM** — auto-maintained contacts + interaction timeline (donations, enrollments, forms, notes) with a Person-360 view.
- **CMS** — block-based pages (hero/richText/stats/cta/faq) rendered by the product site.
- **Platform** — settings & feature flags (public slice cached), audit log on every sensitive action, in-app notifications.

The architecture rationale lives in [sdlc.md](sdlc.md).

> ⚠️ MVP/prototype: payments are simulated, transactional email is not wired, and the homeserver credentials in `.env` are for the local dev environment only.
