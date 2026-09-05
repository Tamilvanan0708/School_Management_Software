# School Management Platform — Development Roadmap

---

## Phase 0: Foundation Setup (Week 1)

### Step 1 ✅ — Monorepo Scaffold
- [x] Initialize Turbo repo with pnpm workspaces
- [x] Create `apps/web` (Next.js 15), `apps/mobile` (Expo + RN 0.76), `backend` (NestJS)
- [x] Create `packages/shared`, `packages/ui`, `packages/config`
- [x] Set up shared TypeScript config, ESLint, Prettier
- [x] Set up GitHub repo + CI (lint + typecheck on push)

### Step 2 ✅ — Database
- [x] Install Prisma in `backend/`
- [x] Define Prisma schema: `School`, `AcademicYear`, `User`, `Role`, `Permission`, `RolePermission`, `UserRole`, `StudentProfile`, `TeacherProfile`, `ParentProfile`, `ParentChild`, `Class`, `Section`, `Subject`
- [x] Run initial migration
- [x] Write seed script (default roles, permissions, demo school)

### Step 3 ✅ — Auth System (NestJS)
- [x] Create `AuthModule` — `POST /auth/login`, `POST /auth/register`
- [x] Passport JWT strategy — issue token with `userId, schoolId, roles[], permissions[]`
- [x] Create `JwtAuthGuard` (global)
- [x] Create `PermissionsGuard` — checks `@Permissions('resource:action')` decorator
- [x] Create `@CurrentUser()` decorator
- [x] Create `POST /auth/forgot-password`, `POST /auth/reset-password`

### Step 4 ✅ — RBAC Engine
- [x] CRUD for roles (NestJS module)
- [x] CRUD for permissions (NestJS module)
- [x] Role ↔ Permission assignment
- [x] User ↔ Role assignment
- [x] Default role seeding (Owner, Principal, Admin, Coordinator, Teacher, Student, Parent)

### Step 5 ✅ — School Setup
- [x] School CRUD (name, code, address, logo, settings)
- [x] Academic Year CRUD
- [x] Class CRUD
- [x] Section CRUD
- [x] Subject CRUD

### Step 6 ✅ — User Management
- [x] User CRUD (create user with profile type)
- [x] Student Profile creation (linked to class/section)
- [x] Teacher Profile creation
- [x] Parent Profile creation
- [x] Parent-Child linking (many-to-many)
- [x] Staff Profile creation

### Step 7 ✅ — Web Portal Login Flow
- [x] Login page (Next.js app router)
- [x] Auth context — store JWT, decode role/permissions
- [x] Redirect to role-based dashboard after login
- [x] Protected route wrapper (checks JWT + permissions)

### Step 8 ✅ — Mobile App Login Flow
- [x] Login screen (Expo Router)
- [x] Auth context — store JWT, decode role/permissions
- [x] Role-based navigation router (student / parent / teacher stacks)
- [x] Token persistence (SecureStore / MMKV)

---

## Phase 1: Core Academic (Weeks 2-3)

### Step 9 ✅ — Student Management
- [x] Student list with filters (class, section, status)
- [x] Student profile page (details, documents, status)
- [x] Admission flow (web portal)
- [x] Student profile (mobile — student view)
- [x] Student profile (mobile — parent view for each child)

### Step 10 ✅ — Teacher Management
- [x] Teacher list (web portal)
- [x] Teacher profile page
- [x] Subject assignment to teachers
- [x] Class/Section assignment to teachers
- [x] Teacher profile (mobile)

### Step 11 ✅ — Class & Section Management
- [x] Class detail page with sections
- [x] Student enrollment in sections
- [x] Teacher assignment to sections
- [x] Subject assignment to sections

### Step 12 ✅ — Timetable
- [x] Timetable schema (section, subject, teacher, day, period, time, room)
- [x] Timetable CRUD (web portal)
- [x] Conflict detection (same teacher, same period)
- [x] Class timetable view (web + mobile)
- [x] Teacher timetable view (web + mobile)
- [x] Student timetable view (mobile)

### Step 13 ✅ — Attendance
- [x] Daily attendance marking (teacher selects class → marks present/absent/late/leave)
- [x] Bulk attendance entry (web portal)
- [x] Attendance history view (student, parent, teacher)
- [x] Attendance percentage calculation
- [x] Attendance reports (web portal)
- [x] Attendance widget on Today dashboard

---

## Phase 2: Academics & Assessment (Weeks 4-5)

### Step 14 ✅ — Homework
- [x] Homework creation (teacher — title, description, due date, attachments, max marks)
- [x] Homework list view (student, parent, teacher)
- [x] Homework submission tracking (teacher sees who submitted)
- [x] Homework widget on Today dashboard

### Step 15 ✅ — Assignments
- [x] Assignment creation (teacher)
- [x] Assignment list view (student, parent, teacher)
- [x] Student submission flow (attach files, write content, submit)
- [x] Teacher review flow (view submissions, give marks, write feedback)
- [x] Late submission detection
- [x] Assignment widget on Today dashboard

### Step 16 ✅ — Study Materials
- [x] Upload materials (teacher — PDF, docs, images, notes)
- [x] Organize by subject and section
- [x] View materials (student, parent)
- [x] Download materials

### Step 17 ✅ — Exams
- [x] Exam creation (name, type, academic year, date range)
- [x] Exam schedule (subject, section, date, time, room, max marks)
- [x] Exam schedule view (student, parent, teacher, web portal)

### Step 18 ✅ — Results
- [x] Marks entry (teacher — student-wise marks for each exam subject)
- [x] Grade calculation (configurable grade boundaries)
- [x] Result view (student, parent)
- [x] Report card generation (PDF)
- [x] Performance history (across exams)
- [x] Result widget on Today dashboard
- [x] Academic performance charts (web portal + mobile)

---

## Phase 3: Communication & Operations (Weeks 6-7)

### Step 19 ✅ — Announcements
- [x] Create announcement (title, content, type, target roles, target classes, pin, schedule)
- [x] Announcement list view (web portal + mobile)
- [x] Pinned announcements (show at top)

### Step 20 ✅ — Notifications
- [x] In-app notification creation (triggered by events: homework created, attendance marked, etc.)
- [x] Notification list view (web portal + mobile)
- [x] Push notifications (Expo push API / FCM)
- [x] Email notifications (Resend — homework reminders, fee reminders)
- [x] Notification preferences (opt-in/out per type)

### Step 21 ✅ — Calendar
- [x] School events (create, edit, delete)
- [x] Holidays
- [x] Exam dates on calendar
- [x] Parent-teacher meeting dates
- [x] Calendar view (mobile + web portal)
- [x] Calendar widget on Today dashboard

### Step 22 ✅ — Leave Management
- [x] Leave request creation (student, parent, teacher)
- [x] Leave approval workflow (teacher → coordinator → principal depending on hierarchy)
- [x] Leave balance tracking
- [x] Leave history view
- [x] Leave widget on Today dashboard

### Step 23 ✅ — Communication
- [x] Teacher ↔ Parent messaging (threaded, per student)
- [x] Admin ↔ Teacher broadcast
- [x] Message inbox (mobile + web portal)
- [x] Read/unread status

---

## Phase 4: Finance & Daily Experience (Weeks 8-9)

### Step 24 ✅ ✅ — Fee Management
- [x] Fee structure creation (name, amount, due date, class, frequency)
- [x] Student fee ledger (what's due, what's paid, what's pending)
- [x] Razorpay integration (UPI, net banking, cards)
- [x] Payment flow (mobile — parent selects fee → pays)
- [x] Payment webhook handler (Razorpay → verify → update DB)
- [x] Receipt generation (PDF)
- [x] Payment history view
- [x] Fee widget on Today dashboard (parent: pending/paid, admin: collection %)

### Step 25 ✅ ✅ — Today Dashboard (v1 Complete)
- [x] Student Today screen (mobile) — classes, homework, attendance, exams, announcements
- [x] Parent Today screen (mobile) — child switcher, attendance, homework, fees, exams
- [x] Teacher Today screen (mobile) — schedule, pending reviews, attendance entry
- [x] Admin Today screen (web portal) — attendance %, fee collection %, pending approvals, alerts
- [x] Principal Today screen (web portal) — school-wide overview, quick actions

### Step 26 ✅ ✅ — Reports
- [x] Attendance reports (by class, by student, by month)
- [x] Academic performance reports (by exam, by student, by class)
- [x] Fee collection reports (by class, by month)
- [x] Export to PDF/Excel

---

## Phase 5: Web Portal Complete (Weeks 10-11)

### Step 27 ✅ — Full Web Portal
- [x] Complete all management screens:
  - Students (list, profile, admit, edit, documents)
  - Teachers (list, profile, assign, edit)
  - Classes (list, detail, sections, timetable, students)
  - Subjects (list, assign)
  - Timetable (manage, class view, teacher view)
  - Attendance (today, history, bulk, reports)
  - Homework (list, create, detail)
  - Assignments (list, create, detail, submissions)
  - Exams (list, create, detail, schedule, results)
  - Results (overview, marks entry, report cards)
  - Materials (list, upload)
  - Fees (structures, student fees, payments, reports)
  - Leaves (list, pending, approve/reject, history)
  - Announcements (list, create)
  - Calendar (events, holidays)
  - Communication (messages, broadcast)
  - Reports (attendance, academic, financial)
  - Settings (school, academic, roles, permissions, users)

### Step 28 ✅ — Role-Based Rendering
- [x] Each page checks permissions before rendering actions
- [x] Teacher sees only "Create Homework" not "Fee Settings"
- [x] Admin sees full management
- [x] Principal sees oversight dashboard

---

## Phase 6: Polish & Launch (Week 12)

### Step 29 ✅ — Performance
- [x] Pagination on all list pages
- [x] Lazy loading images and components
- [x] API response optimization (select only needed fields)
- [x] TanStack Query caching tuned

### Step 30 ✅ — Security
- [x] Rate limiting on auth endpoints
- [x] Input validation on all API endpoints
- [x] XSS protection
- [x] Audit logging (who did what, when)

### Step 31 ✅ — Testing
- [x] Unit tests for critical services (auth, attendance, fee calculation)
- [x] Integration tests for API endpoints
- [x] E2E tests for core flows (login → attendance → homework → exam → result)
- [x] Mobile testing on iOS + Android simulators

### Step 32 ✅ — Documentation
- [x] Swagger/OpenAPI docs for all endpoints
- [x] Deployment guide (env vars, Vercel, EAS, Railway)
- [x] Admin user manual (how to set up school, admit students, etc.)
- [x] Mobile app guide (how to login, switch roles, etc.)

### Step 33 — Launch
- [ ] Staging deployment (all services)
- [ ] UAT with demo school data
- [ ] Bug fixes
- [ ] Production deployment
- [ ] App store submission (iOS + Android)

---

## Post-v1 Expansions (Future)

### Phase 7 — Multi-School
- [ ] Tenant resolution layer (subdomain → schoolId)
- [ ] School-specific settings UI
- [ ] Cross-school admin dashboard (owner view)

### Phase 8 — Advanced Infrastructure
- [ ] Redis caching (dashboard queries, rate limiting)
- [ ] BullMQ queue (async email, SMS, PDF generation)
- [ ] WebSockets (real-time attendance, messaging)
- [ ] SMS notifications (Twilio)

### Phase 9 — Enhanced Features
- [ ] QR/barcode attendance
- [ ] Transport management
- [ ] Library management
- [ ] Inventory management
- [ ] Staff payroll
- [ ] Parent-teacher meeting scheduler
- [ ] Digital certificates

### Phase 10 — AI Layer
- [ ] Student academic insights (trend analysis)
- [ ] Homework assistance
- [ ] Question/worksheet generation
- [ ] Personalized learning recommendations
- [ ] Parent weekly summaries
- [ ] Smart school reports

---

## Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| 0 — Foundation | Week 1 | Monorepo, DB, Auth, RBAC, School setup, Users, Login |
| 1 — Core Academic | Weeks 2-3 | Students, Teachers, Classes, Timetable, Attendance |
| 2 — Academics | Weeks 4-5 | Homework, Assignments, Materials, Exams, Results |
| 3 — Communication | Weeks 6-7 | Announcements, Notifications, Calendar, Leave, Messaging |
| 4 — Finance + Today | Weeks 8-9 | Fees (Razorpay), Today Dashboards, Reports |
| 5 — Web Portal Complete | Weeks 10-11 | All management screens, Role-based rendering |
| 6 — Polish & Launch | Week 12 | Performance, Security, Testing, Docs, Deploy |
| **Total v1** | **12 weeks** | **Production-ready platform** |
