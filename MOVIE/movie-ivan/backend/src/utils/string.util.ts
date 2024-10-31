import { UserRole } from '../types/user.types';

export const sanitizeEmail = (value: string) => {
  return value.trim().replace(/\s+/g, '');
};

export const sanitizeString = (value: string) => {
  return value.trim().replace(/\s+/g, ' ');
};

export const extractAndSanitizeRoles = (roles: UserRole[]) =>
  [...roles]
    .sort((a, b) => {
      if (a.role.name < b.role.name) {
        return -1;
      }
      if (a.role.name > b.role.name) {
        return 1;
      }
      return 0;
    })
    .map((userRole) => ({
      ...userRole,
      role: { name: userRole.role.name, roleAllowed: userRole.role.rolesAllowed?.map((action) => action.action) },
    }));
