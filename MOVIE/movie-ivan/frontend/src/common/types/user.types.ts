export interface UserRole {
  id: string;
  role: {
    name: string;
  };
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles?: UserRole[];
}
