import { describe, it, expect, vi } from 'vitest';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PermissionsGuard } from './permissions.guard';

function ctxWith(user: any) {
  return {
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as unknown as ExecutionContext;
}

describe('PermissionsGuard', () => {
  it('allows access when no permissions required', () => {
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(undefined) };
    const guard = new PermissionsGuard(reflector as any);
    expect(guard.canActivate(ctxWith({ permissions: [] }))).toBe(true);
  });

  it('allows when user has ANY required permission', () => {
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(['fee:pay', 'fee:view']) };
    const guard = new PermissionsGuard(reflector as any);
    expect(guard.canActivate(ctxWith({ permissions: ['fee:view'] }))).toBe(true);
  });

  it('throws Forbidden when user lacks all required permissions', () => {
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(['fee:pay']) };
    const guard = new PermissionsGuard(reflector as any);
    expect(() => guard.canActivate(ctxWith({ permissions: ['attendance:view'] }))).toThrow(ForbiddenException);
  });

  it('throws when user has no permissions claim', () => {
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(['student:view']) };
    const guard = new PermissionsGuard(reflector as any);
    expect(() => guard.canActivate(ctxWith(undefined))).toThrow(ForbiddenException);
  });
});