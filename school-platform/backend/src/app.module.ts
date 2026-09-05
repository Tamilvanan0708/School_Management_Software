import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { ClassesModule } from './modules/classes/classes.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { TimetableModule } from './modules/timetable/timetable.module';
import { HomeworkModule } from './modules/homework/homework.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { ExamsModule } from './modules/exams/exams.module';
import { ResultsModule } from './modules/results/results.module';
import { MaterialsModule } from './modules/materials/materials.module';
import { FeesModule } from './modules/fees/fees.module';
import { LeavesModule } from './modules/leaves/leaves.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { CommunicationModule } from './modules/communication/communication.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { RolesModule } from './modules/roles/roles.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SchoolModule } from './modules/school/school.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 120 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    StudentsModule,
    TeachersModule,
    ClassesModule,
    SubjectsModule,
    AttendanceModule,
    TimetableModule,
    HomeworkModule,
    AssignmentsModule,
    ExamsModule,
    ResultsModule,
    MaterialsModule,
    FeesModule,
    LeavesModule,
    AnnouncementsModule,
    CalendarModule,
    CommunicationModule,
    NotificationsModule,
    DashboardModule,
    RolesModule,
    ReportsModule,
    SchoolModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
})
export class AppModule {}