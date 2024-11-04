import { User } from './user.types';

export interface Movie {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  description?: string;
  year: number;
  duration: number;
  ownerId: string;
  owner: User;
}
