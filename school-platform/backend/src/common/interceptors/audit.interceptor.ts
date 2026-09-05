import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    if (!['POST', 'PATCH', 'DELETE', 'PUT'].includes(method)) return next.handle();
    const path: string = (req.originalUrl || req.url || '').split('?')[0];
    if (path.startsWith('/api/v1/fees/webhook')) return next.handle(); // high volume + payload already in DB

    return next.handle().pipe(
      tap({
        next: (res) => this.log(req, res?.statusCode ?? 201),
        error: (err: any) => this.log(req, err?.status || err?.response?.statusCode || 500),
      }),
    );
  }

  private log(req: any, statusCode: number) {
    const user = req.user;
    const segments = String((req.originalUrl || req.url || '').split('?')[0]).split('/').filter(Boolean);
    this.prisma.auditLog
      .create({
        data: {
          userId: user?.id ?? null,
          schoolId: user?.schoolId ?? null,
          action: req.method,
          resource: segments[2] ?? 'unknown',
          path: segments.slice(2).join('/') || '/',
          statusCode,
          ip: req.headers?.['x-forwarded-for']?.toString().split(',')[0]?.trim() ?? req.ip ?? null,
        },
      })
      .catch(() => undefined);
  }
}