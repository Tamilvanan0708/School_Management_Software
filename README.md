# School Management App

One digital platform for the entire school: a unified **mobile app** for students, parents, and teachers, and a unified **web portal** for all staff and management — with role-based access and permission-based control.

## Folder map

```
School Management App/
├── README.md              ← you are here
├── docs/                  ← product & engineering docs
│   ├── ARCHITECTURE.md       tech stack, system design, DB schema, module map
│   └── ROADMAP.md            step-by-step delivery plan (☑ = completed)
└── school-platform/       ← the code (monorepo)
    ├── apps/
    │   ├── web/              Next.js 15 admin/staff portal
    │   └── mobile/           Expo (React Native) app — student/parent/teacher
    ├── backend/              NestJS API + Prisma + PostgreSQL + Razorpay
    ├── packages/shared/      shared role & permission constants
    ├── Dockerfile.* / docker-compose.yml
    ├── DEPLOYMENT.md         production deploy guide
    └── README.md             quickstart, demo accounts, tests
```

## Start working

```bash
cd school-platform
pnpm dev
```

Portal → **http://localhost:3000** · API docs → **http://localhost:4000/api/docs**

Demo logins and full instructions: [`school-platform/README.md`](school-platform/README.md)

## Status

Phases 0-6 (v1 scope) implemented and verified: auth+RBAC, students/teachers/classes, attendance/timetable, homework/assignments/materials, exams/results, fees (Razorpay, mock mode), announcements/notifications/calendar/leaves/messaging, Today dashboards, reports, tests (15 passing), deploy configs. See [`docs/ROADMAP.md`](docs/ROADMAP.md).
