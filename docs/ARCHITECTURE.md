# School Management Platform — Architecture & Development Plan

---

## 1. Technology Stack

### 1.1 Monorepo Structure
```
school-platform/
├── apps/
│   ├── web/          # Next.js 15 (Web Management Portal)
│   └── mobile/       # React Native + Expo (Unified Mobile App)
├── packages/
│   ├── shared/       # Shared types, validations, constants
│   ├── ui/           # Shared UI components (web + mobile)
│   └── config/       # ESLint, TypeScript, Tailwind configs
├── backend/          # NestJS API server
└── database/         # Prisma schema + migrations
```

### 1.2 Technology Decisions

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Web Portal** | Next.js 15 (App Router) + TypeScript | SSR/SSG, file-based routing, RSC, server actions, SEO |
| **Mobile App** | React Native 0.76 + Expo SDK 52 + TypeScript | Single codebase iOS/Android, OTA updates, 30-40% cost reduction |
| **Backend API** | NestJS + TypeScript | Modular architecture, guards/interceptors for RBAC, decorators, OpenAPI |
| **Database** | PostgreSQL 16 | Relational integrity, JSONB for flexible role configs, arrays, enums |
| **ORM** | Prisma | Type-safe queries, migrations, multi-tenancy ready, joins |
| **Auth** | NestJS (Passport + JWT) — single source of truth | One auth system for both web and mobile; JWT issued by NestJS, consumed by all clients; no split auth logic |
| **API Style** | REST | Simple, predictable, easy to debug and maintain |
| **File Storage** | Cloudflare R2 / AWS S3 | Study materials, assignments, student documents, images |
| **Payments** | Razorpay + Webhooks | India-first: UPI, net banking, cards, wallets; receipts, payment lifecycle |
| **Caching** | In-memory (v1) → Redis (future) | Start simple, add Redis when needed for rate limiting or queues |
| **Background Jobs** | In-process (v1) → BullMQ (future) | Start with sync operations, add async queue for PDF/email later |
| **Deployment** | Vercel (web) + EAS Build (mobile) + Railway/Docker (backend) | Managed hosting, auto-scaling, CI/CD |
| **Monitoring** | Sentry + Logtail | Error tracking, performance monitoring |
| **CI/CD** | GitHub Actions | Lint, test, build, deploy pipeline |

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                              │
│  ┌──────────────────────┐    ┌──────────────────────────────┐ │
│  │  Next.js Web Portal  │    │  React Native Mobile App     │ │
│  │  (Admin/Staff/       │    │  (Student/Parent/Teacher)    │ │
│  │   Management)        │    │                              │ │
│  └──────────┬───────────┘    └─────────────┬────────────────┘ │
└─────────────┼──────────────────────────────┼──────────────────┘
              │           HTTPS/REST          │
              ▼                               ▼
┌──────────────────────────────────────────────────────────────┐
│                    API GATEWAY (NestJS)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │  Auth Guard   │ │  RBAC Guard   │ │  Rate     │ │ Request/       │  │
│  │  (NestJS      │ │  (resource +  │ │  Limiter  │ │ Response Pipe  │  │
│  │   Passport)   │ │   action)     │ │           │ │                │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER (NestJS Modules)             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │ Student  │ │ Teacher  │ │ Class    │ │ Attendance     │  │
│  │ Module   │ │ Module   │ │ Module   │ │ Module         │  │
│  ├──────────┤ ├──────────┤ ├──────────┤ ├────────────────┤  │
│  │ Timetable│ │ Homework │ │ Exam     │ │ Fee            │  │
│  │ Module   │ │ Module   │ │ Module   │ │ Module         │  │
│  ├──────────┤ ├──────────┤ ├──────────┤ ├────────────────┤  │
│  │ Comm     │ │ Leave    │ │ Calendar │ │ Notification   │  │
│  │ Module   │ │ Module   │ │ Module   │ │ Module         │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────┐
│           DATA LAYER             │
│  ┌──────────────────┐  ┌──────┐ │
│  │  PostgreSQL       │  │  S3  │ │
│  │  (Prisma ORM)    │  │ / R2 │ │
│  │                   │  │Files │ │
│  └──────────────────┘  └──────┘ │
└─────────────────────────────────┘
```

### 2.2 Database Schema — Core Entities (High-Level)

```
School (id, name, code, address, phone, email, logo, settings, isActive, createdAt)
├── AcademicYear (id, schoolId, name, startDate, endDate, isCurrent)
├── Class (id, schoolId, name, code, description)
│   └── Section (id, classId, name, code, capacity)
├── Subject (id, schoolId, name, code, type, credits)
├── User (id, schoolId, email, phone, password, firstName, lastName, avatar, isActive)
│   ├── StudentProfile (id, userId, admissionNo, rollNo, classId, sectionId, academicYearId, bloodGroup, dob, address, guardianName, guardianPhone, enrollmentDate, status)
│   ├── TeacherProfile (id, userId, employeeId, qualification, specialization, joinDate, address, bloodGroup)
│   ├── StaffProfile (id, userId, employeeId, department, designation, joinDate)
│   └── ParentProfile (id, userId, occupation, address, primaryContact)
├── ParentChild (parentId, childId, relationship)  // M2M: one parent -> many children
├── Role (id, schoolId, name, slug, hierarchy, isSystem, description)
├── Permission (id, schoolId, resource, action, description)
├── RolePermission (roleId, permissionId, isAllowed)
├── UserRole (userId, roleId, schoolId)
├── Timetable (id, sectionId, subjectId, teacherId, dayOfWeek, periodNumber, startTime, endTime, room, academicYearId)
├── Attendance (id, userId, sectionId, date, status [PRESENT/ABSENT/LATE/LEAVE], takenBy, markedAt, academicYearId)
├── Homework (id, sectionId, subjectId, teacherId, title, description, dueDate, attachments, maxMarks, academicYearId)
├── Assignment (id, sectionId, subjectId, teacherId, title, description, dueDate, attachments, maxMarks, type, academicYearId)
│   └── AssignmentSubmission (id, assignmentId, studentId, content, attachments, submittedAt, marks, feedback, status)
├── Exam (id, schoolId, name, type, academicYearId, startDate, endDate, description)
│   └── ExamSchedule (id, examId, subjectId, sectionId, date, startTime, endTime, maxMarks, room)
│       └── ExamResult (id, examScheduleId, studentId, marksObtained, grade, remarks)
├── StudyMaterial (id, sectionId, subjectId, teacherId, title, type, fileUrl, description, uploadedAt)
├── FeeStructure (id, schoolId, classId, academicYearId, name, amount, dueDate, frequency, description)
│   └── FeePayment (id, studentId, feeStructureId, amountPaid, paidDate, paymentMethod, transactionId, receiptUrl, status, academicYearId)
├── Leave (id, userId, leaveType, startDate, endDate, reason, status, approvedBy, approverRemarks, appliedAt, academicYearId)
├── Announcement (id, schoolId, title, content, type, targetRoles, targetClasses, publishedBy, publishDate, expiresAt, isPinned)
├── Event (id, schoolId, title, description, startDate, endDate, location, type, isPublic, createdBy)
├── Notification (id, userId, title, body, type, referenceId, referenceType, isRead, createdAt)
├── Communication (id, senderId, receiverId, subject, message, attachments, parentId, isRead, sentAt)
└── SchoolHoliday (id, schoolId, name, date, type, description)
```

---

## 3. Role & Permission Architecture

### 3.1 Permission Model

**Resource + Action model:**

```
Permission = { resource: string, action: string }
```

- **Resources:** `student`, `teacher`, `class`, `attendance`, `timetable`, `homework`, `assignment`, `exam`, `result`, `fee`, `leave`, `announcement`, `notification`, `communication`, `settings`, `user`, `role`, `permission`, `report`, `dashboard`
- **Actions:** `view`, `create`, `edit`, `delete`, `approve`, `publish`, `import`, `export`, `manage`

### 3.2 Default Role Hierarchy

```
School Owner (hierarchy: 100)
  └── Principal (hierarchy: 90)
       └── Administrator (hierarchy: 80)
            └── Academic Coordinator (hierarchy: 70)
                 └── Teacher (hierarchy: 50)
                      └── Student (hierarchy: 10)
                           └── Parent (hierarchy: 5)
```

### 3.3 Default Permission Sets

| Role | Core Permissions (examples) |
|------|---------------------------|
| **Owner** | `*:*` (all resources, all actions) |
| **Principal** | `student:*`, `teacher:*`, `attendance:*`, `exam:*`, `result:*`, `fee:view`, `report:*`, `settings:view`, `settings:edit` |
| **Admin** | `student:*`, `teacher:*`, `class:*`, `attendance:*`, `timetable:*`, `fee:*`, `leave:approve`, `announcement:*` |
| **Coordinator** | `student:view`, `teacher:view`, `attendance:view`, `exam:*`, `result:*`, `timetable:view`, `report:view` |
| **Teacher** | `student:view`, `attendance:create`, `attendance:view`, `homework:*`, `assignment:*`, `exam:view`, `result:create`, `result:view`, `study_material:*` |
| **Student** | `attendance:view`, `homework:view`, `assignment:view`, `assignment:create`, `exam:view`, `result:view`, `timetable:view`, `study_material:view` |
| **Parent** | `attendance:view`, `homework:view`, `assignment:view`, `exam:view`, `result:view`, `timetable:view`, `fee:view`, `fee:pay`, `leave:create` |

### 3.4 Permission Enforcement

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  API Request  │────▶│  Auth Guard   │────▶│  RBAC Guard   │
│  + JWT Token  │     │  (validates   │     │  (checks if   │
│              │     │   token)      │     │   user has    │
│              │     │              │     │   resource:   │
│              │     │              │     │   action)     │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                 │
                                                 ▼
                                        ┌──────────────┐
                                        │  Data Scope   │
                                        │  Filter       │
                                        │  (hierarchy   │
                                        │   scoping)    │
                                        └──────────────┘
```

**Implementation approach:**
- NestJS Passport strategy issues JWT on login
- JWT contains `userId`, `schoolId`, `roles[]`, `permissions[]`
- Both web portal and mobile app authenticate through the same POST `/auth/login` endpoint
- NestJS `@SetMetadata('permissions', ['student:view'])` decorator
- Global `PermissionsGuard` checks token claims
- Data-level scoping: teacher sees only assigned students, principal sees all

---

## 4. "Today" — The Daily Overview Experience

Every user's first screen after login should be a **Today** dashboard — not a generic homepage, but a personalized daily briefing.

### 4.1 Student Today Dashboard

```
┌─────────────────────────────────────────────────┐
│  Good morning, Aarav!                    🔔  👤  │
│  Today: Wed, 5 Sep 2026                        │
├─────────────────────────────────────────────────┤
│  ┌───────────┐  ┌───────────┐  ┌─────────────┐│
│  │ 📚 Classes │  │ 📝 Homework│  │ 📊 Attendance││
│  │ Today: 6   │  │ Pending: 2│  │ This Month  ││
│  │ Next: Math │  │ Due: Math │  │ 92%         ││
│  │ (10:30 AM) │  │ (Tomorrow)│  │ ✅ Good     ││
│  └───────────┘  └───────────┘  └─────────────┘│
│  ┌─────────────────────────────────────────────┐│
│  │ 🔔 Upcoming Exam: Mid-Term Exams            ││
│  │   Math: 12 Sep  •  Science: 15 Sep          ││
│  │   English: 18 Sep  •  Hindi: 20 Sep         ││
│  └─────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────┐│
│  │ 📢 School Announcement                      ││
│  │   "PTM on 25 Sep — details to follow"       ││
│  └─────────────────────────────────────────────┘│
│  ┌───────────┐  ┌───────────┐  ┌─────────────┐│
│  │ 📅 Next    │  │ 📋 Pending │  │ 📖 Recent   ││
│  │ Event      │  │ Assignmnt │  │ Materials   ││
│  │ Sports Day │  │ Science   │  │ Ch. 5 Notes ││
│  │ 30 Sep     │  │ Due: 10th │  │ (by Mr. R)  ││
│  └───────────┘  └───────────┘  └─────────────┘│
└─────────────────────────────────────────────────┘
```

**Widgets:** Today's classes timetable, pending homework count, attendance percentage, upcoming exams, recent announcements, pending assignments, quick-access to materials.

### 4.2 Parent Today Dashboard

```
┌─────────────────────────────────────────────────┐
│  Good morning, Mr. Sharma!            🔔  👤    │
│  👶 Swipe to switch:  Aarav  |  Ananya  |  Rohan│
├─────────────────────────────────────────────────┤
│  ┌───────────┐  ┌───────────┐  ┌─────────────┐│
│  │ 📊 Today's │  │ 📝 Homework│  │ 💰 Fee Status││
│  │ Attendance │  │ Pending: 2│  │ This Month  ││
│  │ ✅ Present │  │ 📘 Math   │  │ ✅ Paid     ││
│  │            │  │ 📗 Science│  │             ││
│  └───────────┘  └───────────┘  └─────────────┘│
│  ┌─────────────────────────────────────────────┐│
│  │ 🔔 Upcoming Exams for Aarav                 ││
│  │   Math: 12 Sep  •  Science: 15 Sep          ││
│  └─────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────┐│
│  │ 📢 School Notice: "Holiday on 2 Oct"        ││
│  └─────────────────────────────────────────────┘│
│  ┌───────────┐  ┌───────────┐  ┌─────────────┐│
│  │ 📅 Events  │  │ 📋 Leave  │  │ 📈 Academic ││
│  │ This Week  │  │ Requests  │  │ Performance ││
│  │ PTM: 25th  │  │ (if any)  │  │ Last Exam   ││
│  └───────────┘  └───────────┘  └─────────────┘│
└─────────────────────────────────────────────────┘
```

**Key differentiator:** Child switcher at the top. Swiping changes the entire dashboard to the selected child's data. Parents see a consolidated view of all children's status.

### 4.3 Teacher Today Dashboard

```
┌─────────────────────────────────────────────────┐
│  Good morning, Ms. Patel!               🔔  👤  │
├─────────────────────────────────────────────────┤
│  ┌───────────┐  ┌───────────┐  ┌─────────────┐│
│  │ 📚 My      │  │ 📝 Pending │  │ 📋 Pending  ││
│  │ Schedule  │  │ Homework  │  │ Assignments ││
│  │ 10:30 Math │  │ Review: 3 │  │ Review: 5   ││
│  │ 11:30 Sci  │  │ Class 5-A │  │ Class 5-B   ││
│  │ 12:30 Eng  │  │           │  │             ││
│  └───────────┘  └───────────┘  └─────────────┘│
│  ┌─────────────────────────────────────────────┐│
│  │ 📋 Attendance Pending: Class 5-A (tap to   ││
│  │   mark) — 3 students not yet marked         ││
│  └─────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────┐│
│  │ 🔔 Announcements                            ││
│  │   "Staff meeting on 8 Sep at 3 PM"          ││
│  └─────────────────────────────────────────────┘│
│  ┌───────────┐  ┌───────────┐                  │
│  │ 📅 Today's │  │ 🎯 Tasks   │                  │
│  │ Events     │  │ Remainder │                  │
│  │ PTM: 25th  │  │ 2 items   │                  │
│  └───────────┘  └───────────┘                  │
└─────────────────────────────────────────────────┘
```

**Key differentiator:** Action-oriented. Attendance entry, homework review, and assignment review are surfaced as action items, not just data.

### 4.4 Admin / Principal Today Dashboard

```
┌─────────────────────────────────────────────────┐
│  Good morning, Principal!               🔔  👤  │
├─────────────────────────────────────────────────┤
│  ┌───────────┐  ┌───────────┐  ┌─────────────┐│
│  │ 📊 Today   │  │ 👨‍🏫 Teacher  │  │ 📋 Pending  ││
│  │ Attendance │  │ Attendance │  │ Approvals   ││
│  │ 85% (450/530)│ │ 92% (35/38)│  │ Leaves: 3   ││
│  │ ↓ 3% from  │  │           │  │ Fee Waiver:1││
│  │ yesterday  │  │           │  │             ││
│  └───────────┘  └───────────┘  └─────────────┘│
│  ┌───────────┐  ┌───────────┐  ┌─────────────┐│
│  │ 💰 Fee     │  │ 📈 Exam   │  │ 🔔 Recent   ││
│  │ Collection │  │ Status    │  │ Alerts      ││
│  │ 72% this   │  │ Mid-Term  │  │ 2 unread    ││
│  │ month      │  │ in 7 days │  │ notices     ││
│  │ ₹12.4L/₹17L│  │           │  │             ││
│  └───────────┘  └───────────┘  └─────────────┘│
│  ┌─────────────────────────────────────────────┐│
│  │ 📢 Quick Actions                             ││
│  │   [Make Announcement] [Send Notification]   ││
│  │   [View Reports] [Manage Timetable]         ││
│  └─────────────────────────────────────────────┘│
└─────────────────────────────────────────────────┘
```

**Key differentiator:** Operational overview with quick-action buttons. The principal sees the school's health at a glance and can take action immediately.

### 4.5 Implementation Principle

The Today screen is **not a static page**. It is a **role-specific widget composition**:

```
TodayScreen
  ├── TodayHeader (greeting, date, role-based)
  ├── WidgetGrid
  │   ├── AttendanceWidget (role-scoped)
  │   ├── HomeworkWidget (role-scoped)
  │   ├── ExamWidget (role-scoped)
  │   ├── AnnouncementWidget (school-wide)
  │   ├── PendingActionsWidget (role-specific)
  │   └── QuickActionsWidget (permission-based)
  └── NotificationStrip
```

Each widget fetches its own data (or is batched via a single `/api/dashboard/today` endpoint) and renders based on the user's role and permissions.

---

## 5. Multi-School Tenant Architecture (Future)

### 4.1 Data Isolation Strategy

**Single database, shared schema, row-level isolation via `schoolId`:**

- Every table has `schoolId` column
- Every query filters by `schoolId`
- `schoolId` extracted from JWT in middleware
- Prisma middleware auto-injects `schoolId` on create/query

### 4.2 Tenant Resolution

```
Request → Subdomain (school1.app.com) or Custom Domain → Tenant Resolution → schoolId → Scoped Queries
```

---

## 5. Module Breakdown & Development Phases

### Phase 1: Foundation (Weeks 1-4)

| Module | Deliverables |
|--------|-------------|
| **Monorepo Setup** | Turbo repo, shared packages, configs, CI/CD |
| **Auth System** | Login/register, JWT, role assignment, password reset, session management |
| **RBAC Engine** | Role CRUD, Permission CRUD, Role-Permission assignment, User-Role assignment |
| **School Setup** | School creation, academic year, class, section, subject CRUD |
| **User Management** | User CRUD, student/teacher/parent profile creation, parent-child linking |
| **Database** | Prisma schema, migrations, seed scripts |

### Phase 2: Core Academic (Weeks 5-8)

| Module | Deliverables |
|--------|-------------|
| **Student Management** | Profiles, admission, enrollment, status, documents, academic records |
| **Teacher Management** | Profiles, subject/class assignment, timetable, workload |
| **Class & Section** | Academic structure, student enrollment, teacher assignments |
| **Timetable** | Period management, class timetable, teacher timetable, conflict detection |
| **Attendance** | Daily attendance, bulk entry, QR/barcode scan, reports, percentage calc |

### Phase 3: Academics & Assessment (Weeks 9-12)

| Module | Deliverables |
|--------|-------------|
| **Homework** | Create, publish, due dates, attachments, submission tracking |
| **Assignments** | Full lifecycle: create → submit → review → grade → feedback |
| **Study Materials** | Upload, organize by subject, file management, access control |
| **Exams** | Exam creation, scheduling, subject mapping, hall management |
| **Results** | Marks entry, grade calculation, report cards, performance analytics |

### Phase 4: Communication & Operations (Weeks 13-16)

| Module | Deliverables |
|--------|-------------|
| **Announcements** | Create, target by role/class, pin, schedule, publish |
| **Notifications** | In-app, push (FCM/APNs), email (Resend), SMS (Twilio) |
| **Calendar** | School events, holidays, exam dates, parent meetings |
| **Leave Management** | Request, approval workflow, balance tracking, history |
| **Communication** | Teacher-parent messaging, student-teacher, admin broadcast |

### Phase 5: Finance & Advanced (Weeks 17-20)

| Module | Deliverables |
|--------|-------------|
| **Fee Management** | Fee structures, invoice generation, payment gateway (Razorpay), receipts, UPI/net banking/cards |
| **Reports** | Attendance reports, performance reports, fee reports, custom reports |
| **Dashboard** | Role-specific dashboards, widgets, charts, daily overviews |
| **Web Portal** | Full admin/staff portal with all management screens |
| **Mobile App** | Unified mobile app with role-based routing |

### Phase 6: Polish & Scale (Weeks 21-24)

| Module | Deliverables |
|--------|-------------|
| **Performance** | Query optimization, pagination, lazy loading, caching |
| **Security** | Audit logs, rate limiting, input validation, XSS/CSRF protection |
| **Testing** | Unit tests, integration tests, E2E tests |
| **Documentation** | API docs (Swagger/OpenAPI), deployment guide, user manual |

### Future Expansions (Post-v1)

The following features are deferred beyond the initial release but are architecturally supported:

| Feature | Notes |
|---------|-------|
| **Multi-school** | `schoolId` column already exists on every table; add tenant resolution layer |
| **Redis caching** | Add when dashboard queries or rate limiting require it |
| **BullMQ queue** | Add when email/SMS/PDF generation volume justifies async processing |
| **WebSockets** | Add when real-time attendance or chat becomes a priority |
| **GraphQL** | Add for complex nested dashboard queries |
| **CQRS pattern** | Add when read/write workloads diverge significantly |
| **QR/barcode attendance** | Hardware procurement adds complexity; start with manual entry |
| **Load testing** | Run before multi-school rollout |
| **SMS notifications** | Twilio integration; start with in-app + email only |

---

## 6. Web Portal — Route Structure (Next.js App Router)

```
/school/[slug]/
├── /login
├── /today              # Role-specific daily overview (NEW)
├── /dashboard
│   ├── /admin          # Admin/Principal dashboard
│   ├── /teacher        # Teacher dashboard
│   └── /staff          # Office staff dashboard
├── /students
│   ├── /               # Student list (with filters)
│   ├── /[id]           # Student profile
│   ├── /[id]/attendance
│   ├── /[id]/academics
│   ├── /[id]/fees
│   └── /admit          # New admission
├── /teachers
│   ├── /               # Teacher list
│   ├── /[id]           # Teacher profile
│   └── /assign         # Subject/class assignment
├── /classes
│   ├── /               # Class list
│   ├── /[id]           # Class detail
│   ├── /[id]/sections
│   ├── /[id]/timetable
│   └── /[id]/students
├── /subjects
│   ├── /               # Subject list
│   └── /[id]           # Subject detail
├── /attendance
│   ├── /today          # Today's attendance
│   ├── /history        # Attendance reports
│   └── /bulk           # Bulk attendance entry
├── /timetable
│   ├── /classes        # Class timetables
│   ├── /teachers       # Teacher timetables
│   └── /manage         # Timetable management
├── /homework
│   ├── /               # Homework list
│   ├── /create
│   └── /[id]           # Homework detail
├── /assignments
│   ├── /               # Assignment list
│   ├── /create
│   ├── /[id]           # Assignment detail
│   └── /[id]/submissions
├── /exams
│   ├── /               # Exam list
│   ├── /create
│   ├── /[id]           # Exam detail
│   ├── /[id]/schedule
│   └── /[id]/results
├── /results
│   ├── /               # Results overview
│   ├── /entry          # Marks entry
│   └── /reports        # Report cards
├── /materials
│   ├── /               # Study materials
│   └── /upload
├── /fees
│   ├── /structures     # Fee structures
│   ├── /students       # Student fees
│   ├── /payments       # Payment history
│   └── /reports        # Fee reports
├── /leaves
│   ├── /               # Leave requests
│   ├── /pending        # Pending approvals
│   └── /history
├── /announcements
│   ├── /               # Announcement list
│   └── /create
├── /calendar
│   ├── /               # School calendar
│   └── /events
├── /communication
│   ├── /messages       # Message center
│   └── /broadcast      # Bulk communication
├── /reports
│   ├── /attendance
│   ├── /academic
│   ├── /financial
│   └── /custom
├── /settings
│   ├── /school         # School settings
│   ├── /academic       # Academic year config
│   ├── /roles          # Role management
│   ├── /permissions    # Permission management
│   └── /users          # User management
└── /notifications
```

---

## 7. Mobile App — Navigation Structure (React Native)

```
App (Root Navigator)
├── Auth Stack (unauthenticated)
│   ├── LoginScreen
│   ├── ForgotPasswordScreen
│   └── OnboardingScreen
│
├── Student Tab Navigator (role: student)
│   ├── TodayScreen (Dashboard)
│   ├── TimetableScreen
│   ├── HomeworkScreen
│   ├── AssignmentsScreen
│   │   └── AssignmentDetailScreen
│   │       └── SubmissionScreen
│   ├── ExamsScreen
│   │   └── ExamResultScreen
│   ├── AttendanceScreen
│   ├── MaterialsScreen
│   ├── CalendarScreen
│   ├── NotificationsScreen
│   ├── MessagesScreen
│   └── ProfileScreen
│       ├── EditProfileScreen
│       └── LeaveRequestScreen
│
├── Parent Tab Navigator (role: parent)
│   ├── ChildSelector (top bar to switch children)
│   ├── TodayScreen (Child Dashboard)
│   ├── TimetableScreen
│   ├── HomeworkScreen
│   ├── AssignmentsScreen
│   ├── ExamsScreen
│   │   └── ExamResultScreen
│   ├── AttendanceScreen
│   ├── FeesScreen
│   │   ├── FeeDetailScreen
│   │   └── PaymentScreen
│   ├── CalendarScreen
│   ├── NotificationsScreen
│   ├── MessagesScreen
│   └── ProfileScreen
│       └── LeaveRequestScreen
│
├── Teacher Tab Navigator (role: teacher)
│   ├── TodayScreen (Teacher Dashboard)
│   ├── TimetableScreen
│   ├── ClassesScreen
│   │   ├── ClassDetailScreen
│   │   │   ├── StudentListScreen
│   │   │   ├── AttendanceEntryScreen
│   │   │   └── MarksEntryScreen
│   ├── HomeworkScreen
│   │   └── CreateHomeworkScreen
│   ├── AssignmentsScreen
│   │   ├── CreateAssignmentScreen
│   │   └── AssignmentReviewScreen
│   ├── ExamsScreen
│   │   └── MarksEntryScreen
│   ├── MaterialsScreen
│   │   └── UploadMaterialScreen
│   ├── NotificationsScreen
│   ├── MessagesScreen
│   └── ProfileScreen
│       └── LeaveRequestScreen
│
└── Shared Components
    ├── NotificationBell
    ├── AttendanceBadge
    ├── HomeworkCard
    ├── AssignmentCard
    ├── ExamCard
    ├── TimetableGrid
    ├── CalendarView
    ├── ChildSwitcher (parent only)
    └── FileAttachment
```

---

## 8. Key Architecture Decisions

### 8.1 Why NestJS (not Next.js API routes)

- Complex business logic with multiple interdependent modules
- Middleware-heavy auth/RBAC system
- Scheduled tasks (attendance reports, fee reminders via cron)
- Queue-based async processing (notifications, PDF generation)
- WebSocket management for real-time features
- Separation of concerns: API layer independent of web rendering

### 8.2 Why React Native (not Flutter)

- Code sharing with Next.js web portal via shared TypeScript types
- Larger talent pool for hiring
- React Native Web bridge for potential future web components
- Expo ecosystem maturity (EAS, OTA updates, 50+ SDK modules)
- `react-native-web` for shared component patterns

### 8.3 Why PostgreSQL (not MongoDB)

- Strict relational integrity for school data (student ↔ class ↔ teacher ↔ subjects)
- Transactions across multiple entities (fee payment updates multiple tables)
- JSONB for flexible role/permission/student metadata
- Rich querying for attendance reports, performance analytics
- Prisma ORM is more mature with PostgreSQL than MongoDB

### 8.4 Why Monorepo (not separate repos)

- Shared TypeScript types between web, mobile, and backend
- Single version control for coordinated changes
- Unified CI/CD pipeline
- Shared ESLint, Prettier, TypeScript configs
- Atomic commits across all layers

---

## 9. Key Design Patterns

### 9.1 Repository Pattern (NestJS)

```
Controller → Service → Repository (Prisma) → Database
```

### 9.2 CQRS (Future — for complex queries)

```
Commands: CreateStudent, MarkAttendance, SubmitAssignment
Queries: GetStudentDashboard, GetAttendanceReport, GetFeeStatus
```

### 9.3 Event-Driven Notifications

```
StudentAttendanceMarked → NotificationService → [Push, Email, SMS, InApp]
HomeworkCreated → NotificationService → [Push to assigned students]
FeeDueReminder → CronJob → NotificationService → [Push + Email]
```

### 9.4 Strategy Pattern (Role-based Dashboards)

```
DashboardStrategyFactory
  ├── StudentDashboardStrategy
  ├── ParentDashboardStrategy
  ├── TeacherDashboardStrategy
  ├── AdminDashboardStrategy
  └── PrincipalDashboardStrategy
```

---

## 10. Recommended Tools & Libraries

### Web Portal (Next.js)

| Purpose | Library |
|---------|---------|
| UI Components | shadcn/ui (Radix + Tailwind) |
| Forms | react-hook-form + zod |
| Tables | TanStack Table (react-table v8) |
| Charts | recharts / chart.js |
| Calendar | react-big-calendar / @rehookify/datepicker |
| Rich Text | TipTap (ProseMirror-based) |
| Date Handling | date-fns |
| State Management | Zustand (global) + TanStack Query (server) |
| Drag & Drop | @dnd-kit |

### Mobile App (React Native)

| Purpose | Library |
|---------|---------|
| Navigation | expo-router (file-based) |
| Forms | react-hook-form + zod |
| HTTP Client | TanStack Query (React Query) + axios |
| UI Components | react-native-paper / NativeBase |
| Charts | react-native-chart-kit / victory-native |
| Calendar | react-native-calendars |
| File Picker | expo-document-picker / expo-image-picker |
| Push Notifications | expo-notifications + Firebase Cloud Messaging |
| Biometrics | expo-local-authentication |
| Offline | WatermelonDB / MMKV + TanStack Query persistence |
| Animations | react-native-reanimated |

### Backend (NestJS)

| Purpose | Library | Priority |
|---------|---------|----------|
| Validation | class-validator + class-transformer | v1 |
| Auth | @nestjs/passport + passport-jwt | v1 |
| Docs | @nestjs/swagger (OpenAPI) | v1 |
| Rate Limiting | @nestjs/throttler | v1 |
| Scheduling | @nestjs/schedule | v1 |
| File Upload | multer + sharp (image processing) | v1 |
| Email | Resend / nodemailer | v1 |
| PDF | puppeteer / pdfkit | v1 |
| Logging | @nestjs/config + winston | v1 |
| Testing | Jest + Supertest (E2E) | v1 |
| Queues | @nestjs/bull + BullMQ | v2 (add when volume grows) |
| SMS | Twilio | v2 (start with in-app + email) |

### DevOps

| Purpose | Tool | Priority |
|---------|------|----------|
| Container | Docker + docker-compose | v1 |
| CI/CD | GitHub Actions | v1 |
| Hosting (Web) | Vercel | v1 |
| Hosting (Backend) | Railway / DigitalOcean | v1 |
| Mobile Build | EAS Build (Expo) | v1 |
| OTA Updates | EAS Update (Expo) | v1 |
| Monitoring | Sentry | v1 |
| Uptime | Better Uptime / Checkly | v2 |
| Database Hosting | Supabase / Railway / AWS RDS | v1 |

---

## 11. Development Workflow

### 11.1 Git Branch Strategy

```
main          → Production-ready code
├── develop   → Integration branch
│   ├── feature/student-management
│   ├── feature/attendance
│   ├── feature/exam-results
│   └── ...
└── release/v1.0.0
```

### 11.2 PR Workflow

```
Feature Branch → PR → Lint/Test CI → Review → Merge to develop → Release → Merge to main
```

### 11.3 Commit Convention (Conventional Commits)

```
feat: add student attendance module
fix: correct timetable conflict detection
chore: update dependencies
docs: add API documentation for exams
refactor: extract fee calculation to service
```

---

## 12. Project Setup Commands

```bash
# Initialize monorepo
mkdir school-platform && cd school-platform
pnpm init
pnpm add -g turbo

# Create apps
pnpm create next-app apps/web --typescript
pnpm create expo-app apps/mobile --template blank-typescript

# Create packages
mkdir packages/shared packages/ui packages/config

# Initialize backend
mkdir backend && cd backend
pnpm init
pnpm add @nestjs/core @nestjs/common @nestjs/platform-express
pnpm add prisma @prisma/client

# Initialize database
npx prisma init
```

---

## 13. Cost Estimation

| Phase | Duration | Team Size | Estimated Cost |
|-------|----------|-----------|----------------|
| Foundation (Auth + RBAC + School Setup) | 4 weeks | 3 devs | $30,000 – $45,000 |
| Core Academic (Students, Teachers, Classes, Timetable, Attendance) | 4 weeks | 4 devs | $40,000 – $60,000 |
| Academics (Homework, Assignments, Exams, Results) | 4 weeks | 4 devs | $40,000 – $60,000 |
| Communication (Notifications, Calendar, Messaging, Leave) | 4 weeks | 3 devs | $30,000 – $45,000 |
| Finance + Today Dashboard (Fees, Reports, Daily Overviews) | 4 weeks | 3 devs | $30,000 – $45,000 |
| Polish (Performance, Security, Testing, Docs) | 4 weeks | 3 devs | $30,000 – $45,000 |
| **Total (v1)** | **24 weeks** | **3-4 devs** | **$200,000 – $300,000** |

---

## 14. Next Steps

1. **Set up monorepo** with Turbo repo + pnpm
2. **Initialize all three apps** (web, mobile, backend) with TypeScript
3. **Create Prisma schema** with all core entities
4. **Build auth module** (login, register, JWT, RBAC guards)
5. **Build school setup flow** (create school, academic year, classes, sections)
6. **Build user management** (create users with roles, parent-child linking)
7. **Deploy foundation** to staging environment
8. **Begin Phase 2** (Core Academic modules)

---

## 15. File Structure (Full Project)

```
school-platform/
├── package.json                 # Root package.json (workspaces)
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── .eslintrc.js
├── .prettierrc
├── docker-compose.yml
├── Dockerfile
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── apps/
│   ├── web/                     # Next.js 15 Web Portal
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   └── login/
│   │   │   ├── (dashboard)/
│   │   │   ├── students/
│   │   │   ├── teachers/
│   │   │   ├── classes/
│   │   │   ├── attendance/
│   │   │   ├── timetable/
│   │   │   ├── homework/
│   │   │   ├── assignments/
│   │   │   ├── exams/
│   │   │   ├── results/
│   │   │   ├── fees/
│   │   │   ├── announcements/
│   │   │   ├── calendar/
│   │   │   ├── communication/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   ├── components/
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   ├── auth/
│   │   │   └── utils/
│   │   └── ...
│   │
│   └── mobile/                  # React Native + Expo
│       ├── app/                 # expo-router file-based routing
│       │   ├── (auth)/
│       │   │   └── login.tsx
│       │   ├── (student)/
│       │   │   ├── today.tsx
│       │   │   ├── timetable.tsx
│       │   │   ├── homework.tsx
│       │   │   └── ...
│       │   ├── (parent)/
│       │   │   ├── today.tsx
│       │   │   ├── timetable.tsx
│       │   │   └── ...
│       │   └── (teacher)/
│       │       ├── today.tsx
│       │       ├── timetable.tsx
│       │       └── ...
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       └── ...
│
├── backend/                     # NestJS API
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── common/
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   ├── roles.guard.ts
│   │   │   │   └── permissions.guard.ts
│   │   │   ├── decorators/
│   │   │   │   ├── current-user.decorator.ts
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── permissions.decorator.ts
│   │   │   ├── filters/
│   │   │   └── pipes/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── students/
│   │   │   ├── teachers/
│   │   │   ├── classes/
│   │   │   ├── subjects/
│   │   │   ├── attendance/
│   │   │   ├── timetable/
│   │   │   ├── homework/
│   │   │   ├── assignments/
│   │   │   ├── exams/
│   │   │   ├── results/
│   │   │   ├── materials/
│   │   │   ├── fees/
│   │   │   ├── leaves/
│   │   │   ├── announcements/
│   │   │   ├── calendar/
│   │   │   ├── communication/
│   │   │   ├── notifications/
│   │   │   ├── roles/
│   │   │   ├── reports/
│   │   │   └── school/
│   │   └── prisma/
│   │       ├── prisma.service.ts
│   │       └── prisma.module.ts
│   └── prisma/
│       └── schema.prisma
│
├── packages/
│   ├── shared/                  # Shared types, constants, validators
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── user.types.ts
│   │   │   │   ├── student.types.ts
│   │   │   │   ├── class.types.ts
│   │   │   │   ├── attendance.types.ts
│   │   │   │   ├── homework.types.ts
│   │   │   │   ├── exam.types.ts
│   │   │   │   ├── fee.types.ts
│   │   │   │   └── notification.types.ts
│   │   │   ├── constants/
│   │   │   │   ├── roles.ts
│   │   │   │   ├── permissions.ts
│   │   │   │   └── attendance-status.ts
│   │   │   ├── validators/
│   │   │   │   ├── student.validator.ts
│   │   │   │   ├── homework.validator.ts
│   │   │   │   └── fee.validator.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── ui/                      # Shared UI components
│   │   ├── src/
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Input/
│   │   │   ├── Table/
│   │   │   ├── Modal/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── config/
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
│
└── README.md
```

---

## 16. Key Technical Decisions Summary

| Decision | Choice | Why |
|----------|--------|-----|
| Language | TypeScript everywhere | Type safety across full stack, shared types |
| Monorepo | Turbo + pnpm | Fast installs, parallel builds, shared packages |
| ORM | Prisma | Type-safe queries, easy migrations, great DX |
| Auth | NestJS Passport + JWT (single source of truth) | One auth system for web + mobile; no split logic |
| API | NestJS REST | Modular, scalable, decorator-based guards |
| Database | PostgreSQL | Relational integrity, JSONB, mature |
| Web UI | Tailwind + shadcn/ui | Utility-first, accessible, customizable |
| Mobile UI | Expo Router + React Native Paper | File-based routing, material design |
| Testing | Jest + Playwright | Unit + E2E coverage |
| Deployment | Vercel + EAS + Railway | Managed, scalable, minimal ops overhead |
| State (Web) | TanStack Query + Zustand | Server state caching + lightweight global state |
| State (Mobile) | TanStack Query + MMKV | Offline-first, fast local storage |
| Forms | react-hook-form + zod | Performant, type-safe validation |
| Payments | Razorpay | India-first: UPI, net banking, cards; webhooks for verification |
| Files | Cloudflare R2 | S3-compatible, no egress fees |
| Monitoring | Sentry | Error tracking, performance monitoring |