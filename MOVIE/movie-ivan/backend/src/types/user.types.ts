import { Role, RoleAllowed } from '@prisma/client';

export interface UserRole {
  role: Role & { rolesAllowed: RoleAllowed[] };
}
