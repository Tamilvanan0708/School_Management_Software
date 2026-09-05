import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('School Platform (e2e)', () => {
  let app: INestApplication;
  let teacherToken: string;
  let ownerToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    const owner = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'owner@demo.com', password: 'owner123' })
      .expect(201);
    ownerToken = owner.body.accessToken;

    const teacher = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'teacher@demo.com', password: 'password123' })
      .expect(201);
    teacherToken = teacher.body.accessToken;
    expect(teacher.body.user.firstName).toBe('Priya');
  });

  afterAll(async () => { await app.close(); });

  const base = () => request(app.getHttpServer());

  it('rejects unauthenticated access to protected routes', async () => {
    await base().get('/api/v1/students').expect(401);
    await base().get('/api/v1/dashboard/today').expect(401);
    await base().get('/api/v1/fees/summary').expect(401);
  });

  it('rejects invalid credentials', async () => {
    await base().post('/api/v1/auth/login').send({ email: 'teacher@demo.com', password: 'wrong' }).expect(401);
  });

  it('issues a JWT containing roles and permissions for teacher', async () => {
    const payload = JSON.parse(Buffer.from(teacherToken.split('.')[1], 'base64').toString());
    expect(payload.roles).toEqual(['teacher']);
    expect(payload.permissions).toContain('homework:create');
    expect(payload.permissions).not.toContain('fee:pay');
  });

  it('teacher can view students and mark attendance', async () => {
    const res = await base().get('/api/v1/students').set('Authorization', `Bearer ${teacherToken}`).expect(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    const cls = await base().get('/api/v1/classes').set('Authorization', `Bearer ${teacherToken}`).expect(200);
    const sectionId = cls.body[0].sections[0].id;
    const roster = await base().get(`/api/v1/attendance/section/${sectionId}`).set('Authorization', `Bearer ${teacherToken}`).expect(200);
    const first = roster.body[0];
    await base()
      .post('/api/v1/attendance')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ userId: first.userId, status: 'PRESENT', date: '2026-09-05', sectionId })
      .expect(201);
  });

  it('teacher is FORBIDDEN from school-wide fee and role endpoints', async () => {
    await base().get('/api/v1/fees/summary').set('Authorization', `Bearer ${teacherToken}`).expect(403);
    await base().get('/api/v1/roles').set('Authorization', `Bearer ${teacherToken}`).expect(403);
    await base().post('/api/v1/leaves').set('Authorization', `Bearer ${teacherToken}`).send({ leaveType: 'staff', startDate: '2026-09-10', endDate: '2026-09-11' }).expect(403);
  });

  it('owner can create announcements and view fee summary', async () => {
    await base()
      .post('/api/v1/announcements')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'E2E smoke test notice', content: 'verification only', type: 'general' })
      .expect(201);
    const summary = await base().get('/api/v1/fees/summary').set('Authorization', `Bearer ${ownerToken}`).expect(200);
    expect(typeof summary.body.collected).toBe('number');
  });

  it('dashboard/today adapts per role', async () => {
    const t = await base().get('/api/v1/dashboard/today').set('Authorization', `Bearer ${teacherToken}`).expect(200);
    expect(t.body.role).toBe('teacher');
    const o = await base().get('/api/v1/dashboard/today').set('Authorization', `Bearer ${ownerToken}`).expect(200);
    expect(o.body.role).toBe('admin');
    expect(o.body.stats.students).toBeGreaterThanOrEqual(2);
  });
});