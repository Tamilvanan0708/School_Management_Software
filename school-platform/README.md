# School Management Platform

One unified platform: **one mobile app** (students / parents / teachers) + **one web portal** (all staff & management) + **role- and permission-based access** for every feature.

Design docs: [`../docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) · Phase plan: [`../docs/ROADMAP.md`](../docs/ROADMAP.md)

## Stack

- **`apps/web`** — Next.js 15 portal (all staff, one login, role-filtered navigation & permissions)
- **`apps/mobile`** — Expo Router 4 + React Native 0.76 (Student / Parent / Teacher routes from one app)
- **`backend`** — NestJS 11 API + JWT Passport + RBAC guard, Prisma → PostgreSQL, Razorpay fees, file-uploaded study materials
- **`packages/shared`** — role & permission constants shared by all three apps

## Quickstart (dev)

```bash
corepack enable && pnpm install

# 1. database (postgres must be running)
createdb school_platform
cd backend && npx prisma migrate dev && npx prisma db seed

# 2. API  → http://localhost:4000/api/v1  · Swagger: /api/docs
pnpm --filter @school/backend dev

# 3. portal  → http://localhost:3000
pnpm --filter @school/web dev

# 4. mobile
pnpm --filter @school/mobile dev
```

## Demo accounts (seeded)

| Role | Email | Password | What they see |
|---|---|---|---|
| School Owner | `owner@demo.com` | `owner123` | Everything: fee management, role/permission matrix, staff directory, announcements |
| Teacher | `teacher@demo.com` | `password123` | Today's schedule, attendance, homework/assignments, marks entry |
| Student | `aarav@demo.com` | `password123` | Classes, homework, exams, attendance (Class 5-A) |
| Student | `ananya@demo.com` | `password123` | Sister's independent account, same class |
| Parent | `parent@demo.com` | `password123` | **Both children**, switchable dashboards, fee pay, leave requests |

## Tests

```bash
pnpm --filter @school/backend test       # unit: guard OR-permissions, fee HMAC, dashboard shapes
pnpm --filter @school/backend test:e2e   # e2e: auth, RBAC 403s, attendance, announcements, dashboards
```

## One-command demo stack (Docker)

```bash
docker compose up --build   # portal :3000 · API :4000 · postgres
```

## Deploying

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) — Vercel (web) · Railway/Fly (backend) · EAS (mobile) · Supabase (Postgres) · Razorpay live keys + webhooks.

## Security posture (shipped)

- JWTs carry `roles` + flattened `resource:action` permissions; `PermissionsGuard` enforces per-endpoint.
- `@nestjs/throttler` (120 req/min/IP) · `helmet` · allow-listed CORS origins · `ValidationPipe(whitelist)` everywhere.
- Every POST/PATCH/DELETE lands in the `AuditLog` table (who/what/status/IP).
- Razorpay webhook verified via HMAC-SHA256 over raw body; payments markable `PAID` only through verified paths.
