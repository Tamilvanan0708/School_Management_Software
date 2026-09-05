export const ROLES = {
  OWNER: 'owner',
  PRINCIPAL: 'principal',
  ADMIN: 'admin',
  COORDINATOR: 'coordinator',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
} as const;

export type RoleSlug = (typeof ROLES)[keyof typeof ROLES];