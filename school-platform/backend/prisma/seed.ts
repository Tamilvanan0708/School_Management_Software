import { PrismaClient, AttendanceStatus, PaymentStatus, LeaveStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ── 1. School ──
  const school = await prisma.school.upsert({
    where: { code: 'DEMO001' },
    update: {},
    create: {
      name: 'Demo International School',
      code: 'DEMO001',
      address: '123 Education Lane, Knowledge City',
      phone: '+91-9876543210',
      email: 'info@demoschool.edu',
      settings: { timezone: 'Asia/Kolkata', currency: 'INR', academicYearFormat: '2025-2026' },
    },
  });
  console.log(`  ✓ School: ${school.name}`);

  // ── 2. Academic Year ──
  const academicYear = await prisma.academicYear.create({
    data: {
      schoolId: school.id,
      name: '2025-2026',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2026-03-31'),
      isCurrent: true,
    },
  });
  console.log(`  ✓ Academic Year: ${academicYear.name}`);

  // ── 3. Classes & Sections ──
  const classData = await prisma.class.create({
    data: {
      schoolId: school.id,
      name: 'Class 5',
      code: '5',
      sections: { create: [{ name: 'A', capacity: 40 }, { name: 'B', capacity: 40 }] },
    },
    include: { sections: true },
  });
  const class6 = await prisma.class.create({
    data: {
      schoolId: school.id,
      name: 'Class 6',
      code: '6',
      sections: { create: [{ name: 'A', capacity: 40 }] },
    },
    include: { sections: true },
  });
  console.log(`  ✓ Classes: ${classData.name}, ${class6.name}`);

  // ── 4. Subjects ──
  const subjects = await Promise.all(
    ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies'].map((name) =>
      prisma.subject.create({ data: { schoolId: school.id, name, code: name.substring(0, 3).toUpperCase() } }),
    ),
  );
  console.log(`  ✓ ${subjects.length} Subjects created`);

  // ── 5. Roles ──
  const roleData = [
    { name: 'School Owner', slug: 'owner', hierarchy: 100, isSystem: true },
    { name: 'Principal', slug: 'principal', hierarchy: 90, isSystem: true },
    { name: 'Administrator', slug: 'admin', hierarchy: 80, isSystem: true },
    { name: 'Academic Coordinator', slug: 'coordinator', hierarchy: 70, isSystem: true },
    { name: 'Teacher', slug: 'teacher', hierarchy: 50, isSystem: true },
    { name: 'Student', slug: 'student', hierarchy: 10, isSystem: true },
    { name: 'Parent', slug: 'parent', hierarchy: 5, isSystem: true },
  ];

  const roles: Record<string, any> = {};
  for (const r of roleData) {
    roles[r.slug] = await prisma.role.upsert({
      where: { id: `${school.id}-${r.slug}` },
      update: {},
      create: { id: `${school.id}-${r.slug}`, schoolId: school.id, ...r },
    });
  }
  console.log(`  ✓ ${Object.keys(roles).length} Roles created`);

  // ── 6. Permissions ──
  const resources = ['student', 'teacher', 'class', 'attendance', 'timetable', 'homework', 'assignment', 'exam', 'result', 'fee', 'leave', 'announcement', 'notification', 'communication', 'settings', 'user', 'role', 'report'];
  const actions = ['view', 'create', 'edit', 'delete', 'approve', 'publish', 'manage', 'pay'];

  const permissionMap: Record<string, any> = {};
  for (const resource of resources) {
    for (const action of actions) {
      const key = `${resource}:${action}`;
      permissionMap[key] = await prisma.permission.create({
        data: { schoolId: school.id, resource, action, description: `Can ${action} ${resource}` },
      });
    }
  }
  console.log(`  ✓ ${Object.keys(permissionMap).length} Permissions created`);

  // ── 7. Role-Permission Assignments ──
  // Owner gets all
  for (const perm of Object.values(permissionMap)) {
    await prisma.rolePermission.create({
      data: { roleId: roles.owner.id, permissionId: (perm as any).id, isAllowed: true },
    }).catch(() => {});
  }

  // Principal gets broad access
  const principalPerms = ['student', 'teacher', 'class', 'attendance', 'timetable', 'exam', 'result', 'report', 'announcement'];
  for (const r of principalPerms) {
    for (const a of ['view', 'create', 'edit', 'delete']) {
      const key = `${r}:${a}`;
      if (permissionMap[key]) {
        await prisma.rolePermission.create({
          data: { roleId: roles.principal.id, permissionId: permissionMap[key].id, isAllowed: true },
        }).catch(() => {});
      }
    }
  }
  // Principal can also approve and view settings
  for (const key of ['fee:view', 'leave:approve', 'settings:view', 'settings:edit']) {
    if (permissionMap[key]) {
      await prisma.rolePermission.create({
        data: { roleId: roles.principal.id, permissionId: permissionMap[key].id, isAllowed: true },
      }).catch(() => {});
    }
  }

  // Teacher permissions
  const teacherPerms = ['student:view', 'class:view', 'subject:view', 'attendance:view', 'attendance:create', 'attendance:edit', 'homework:view', 'homework:create', 'homework:edit', 'homework:delete', 'assignment:view', 'assignment:create', 'assignment:edit', 'exam:view', 'result:view', 'result:create', 'result:edit', 'timetable:view'];
  for (const key of teacherPerms) {
    if (permissionMap[key]) {
      await prisma.rolePermission.create({
        data: { roleId: roles.teacher.id, permissionId: permissionMap[key].id, isAllowed: true },
      }).catch(() => {});
    }
  }

  // Student permissions
  const studentPerms = ['attendance:view', 'homework:view', 'assignment:view', 'assignment:create', 'exam:view', 'result:view', 'timetable:view', 'leave:create', 'leave:view'];
  for (const key of studentPerms) {
    if (permissionMap[key]) {
      await prisma.rolePermission.create({
        data: { roleId: roles.student.id, permissionId: permissionMap[key].id, isAllowed: true },
      }).catch(() => {});
    }
  }

  // Parent permissions
  const parentPerms = ['attendance:view', 'homework:view', 'assignment:view', 'exam:view', 'result:view', 'timetable:view', 'fee:view', 'fee:pay', 'leave:create', 'leave:view'];
  for (const key of parentPerms) {
    if (permissionMap[key]) {
      await prisma.rolePermission.create({
        data: { roleId: roles.parent.id, permissionId: permissionMap[key].id, isAllowed: true },
      }).catch(() => {});
    }
  }
  console.log('  ✓ Role-Permission assignments done');

  // ── 8. Demo Users ──
  const password = await bcrypt.hash('password123', 10);

  // Teacher
  const teacherUser = await prisma.user.create({
    data: {
      schoolId: school.id, email: 'teacher@demo.com', password, firstName: 'Priya', lastName: 'Sharma',
      teacher: { create: { employeeId: 'TCH001', qualification: 'M.Sc. Mathematics', specialization: 'Mathematics', joinDate: new Date('2023-06-01') } },
    },
  });
  await prisma.userRole.create({ data: { userId: teacherUser.id, roleId: roles.teacher.id, schoolId: school.id } });

  // Owner (full access for management testing)
  const ownerUser = await prisma.user.create({
    data: {
      schoolId: school.id, email: 'owner@demo.com', password: await bcrypt.hash('owner123', 10), firstName: 'Anil', lastName: 'Kapoor',
    },
  });
  await prisma.userRole.create({ data: { userId: ownerUser.id, roleId: roles.owner.id, schoolId: school.id } });
  console.log('  ✓ Owner user created');

  // Student 1
  const student1User = await prisma.user.create({
    data: {
      schoolId: school.id, email: 'aarav@demo.com', password, firstName: 'Aarav', lastName: 'Verma',
      student: { create: { admissionNo: 'STU001', rollNo: '1', classId: classData.id, sectionId: classData.sections[0].id, academicYearId: academicYear.id, gender: 'MALE', dob: new Date('2014-05-12'), guardianName: 'Rahul Verma', guardianPhone: '+91-9876543211' } },
    },
    include: { student: true },
  });
  await prisma.userRole.create({ data: { userId: student1User.id, roleId: roles.student.id, schoolId: school.id } });

  // Student 2
  const student2User = await prisma.user.create({
    data: {
      schoolId: school.id, email: 'ananya@demo.com', password, firstName: 'Ananya', lastName: 'Verma',
      student: { create: { admissionNo: 'STU002', rollNo: '2', classId: classData.id, sectionId: classData.sections[0].id, academicYearId: academicYear.id, gender: 'FEMALE', dob: new Date('2014-08-23'), guardianName: 'Rahul Verma', guardianPhone: '+91-9876543211' } },
    },
    include: { student: true },
  });
  await prisma.userRole.create({ data: { userId: student2User.id, roleId: roles.student.id, schoolId: school.id } });

  // Parent (linked to both children)
  const parentUser = await prisma.user.create({
    data: {
      schoolId: school.id, email: 'parent@demo.com', password, firstName: 'Rahul', lastName: 'Verma',
      parent: { create: { occupation: 'Engineer', address: '456 Green Park, New Delhi', primaryContact: '+91-9876543211' } },
    },
    include: { parent: true },
  });
  await prisma.userRole.create({ data: { userId: parentUser.id, roleId: roles.parent.id, schoolId: school.id } });
  await prisma.parentChild.create({ data: { parentId: parentUser.parent!.id, childId: student1User.student!.id, relationship: 'father' } });
  await prisma.parentChild.create({ data: { parentId: parentUser.parent!.id, childId: student2User.student!.id, relationship: 'father' } });

  // ── 9. Fee structures + payments ──
  const feeTuition = await prisma.feeStructure.create({
    data: { schoolId: school.id, classId: classData.id, academicYearId: academicYear.id, name: 'Tuition Fee — Sept 2026', amount: 5000, dueDate: new Date('2026-09-15'), frequency: 'MONTHLY' },
  });
  const feeTransport = await prisma.feeStructure.create({
    data: { schoolId: school.id, classId: classData.id, academicYearId: academicYear.id, name: 'Transport Fee', amount: 2500, dueDate: new Date('2026-09-20'), frequency: 'MONTHLY' },
  });
  await prisma.feePayment.createMany({
    data: [
      { studentId: student1User.student!.id, feeStructureId: feeTuition.id, amountPaid: 0, status: 'PENDING' as PaymentStatus, paidDate: new Date('2026-08-20') },
      { studentId: student1User.student!.id, feeStructureId: feeTransport.id, amountPaid: 0, status: 'PENDING' as PaymentStatus, paidDate: new Date('2026-08-25') },
      { studentId: student2User.student!.id, feeStructureId: feeTuition.id, amountPaid: 0, status: 'PENDING' as PaymentStatus, paidDate: new Date('2026-08-20') },
    ],
  });
  console.log('  ✓ Fee structures: 2; Payments: 3 (2 pending for 1 child, 1 pending for the other)');

  // ── 10. Exam ──
  const exam = await prisma.exam.create({
    data: { schoolId: school.id, name: 'Mid-Term Exams 2026', type: 'midterm', academicYearId: academicYear.id, startDate: new Date('2026-10-01'), endDate: new Date('2026-10-08') },
  });
  const math = subjects.find((s) => s.name === 'Mathematics');
  const sci = subjects.find((s) => s.name === 'Science');
  const schedule1 = await prisma.examSchedule.create({
    data: { examId: exam.id, subjectId: math!.id, sectionId: classData.sections[0].id, date: new Date('2026-10-02'), startTime: '09:00', endTime: '12:00', maxMarks: 100 },
  });
  const schedule2 = await prisma.examSchedule.create({
    data: { examId: exam.id, subjectId: sci!.id, sectionId: classData.sections[0].id, date: new Date('2026-10-04'), startTime: '09:00', endTime: '12:00', maxMarks: 100 },
  });
  await prisma.examResult.createMany({
    data: [
      { examScheduleId: schedule1.id, studentId: student1User.student!.id, marksObtained: 82, grade: 'A' },
      { examScheduleId: schedule1.id, studentId: student2User.student!.id, marksObtained: 64, grade: 'B' },
      { examScheduleId: schedule2.id, studentId: student1User.student!.id, marksObtained: 74, grade: 'B' },
    ],
  });
  console.log('  ✓ Exam: Mid-Term Exams 2026 (2 schedules, 3 results)');

  // ── 11. Leave (pending, for approval flow testing) ──
  const leave = await prisma.leave.create({
    data: { userId: student1User.id, leaveType: 'student', startDate: new Date('2026-09-12'), endDate: new Date('2026-09-13'), reason: 'Family function', status: 'PENDING' as LeaveStatus },
  });
  console.log('  ✓ Leave: 1 pending request (id ' + leave.id + ')');

  console.log('  ✓ Demo users created');
  console.log('\n── Demo Credentials ──');
  console.log('  Teacher: teacher@demo.com / password123');
  console.log('  Student: aarav@demo.com / password123');
  console.log('  Student: ananya@demo.com / password123');
  console.log('  Parent:  parent@demo.com / password123');
  console.log('\n✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });