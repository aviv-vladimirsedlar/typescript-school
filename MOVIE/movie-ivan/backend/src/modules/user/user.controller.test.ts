/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import { FastifyInstance } from 'fastify';
import request from 'supertest';

import * as authorizationModule from '../../config/constants'; // Adjust path as necessary
import prisma from '../../config/prisma.db';
import { buildServer } from '../../index';

let app: FastifyInstance;
let authCookie: string;
const userId: string = 'user-id';

const SALT_ROUNDS = 10;
const password = 'Test@#12345';

const createdAt = new Date('2021-08-01T00:00:00.000Z');
const updatedAt = new Date('2021-08-01T00:00:00.000Z');

const mockRoleAdmin = {
  id: 'admin-role-id',
  name: 'admin',
  createdAt,
  updatedAt,
  roleAllowed: [{ action: 'assign_roles' }],
};
const mockRoleUser = { id: 'user-role-id', name: 'user', createdAt, updatedAt };
const mockUserRoleRoleUser = {
  id: 'user-role-id',
  userId,
  roleId: 'role-id',
  role: mockRoleUser,
  createdAt,
  updatedAt,
};
const mockUserWithUserRole = {
  id: 'role-id',
  firstName: 'user',
  lastName: 'user',
  email: 'text@test.com',
  password: 'hashedpassword',
  roles: [mockUserRoleRoleUser],
  createdAt,
  updatedAt,
};

beforeAll(async () => {
  app = buildServer();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('User Controller', () => {
  describe('Register', () => {
    it('should register a new user', async () => {
      const body = {
        email: 'testuser@example.com',
        password: password,
        firstName: 'Test',
        lastName: 'User',
      };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);
      jest.spyOn(prisma.role, 'findFirst').mockResolvedValueOnce(mockRoleUser);
      jest.spyOn(prisma.user, 'create').mockResolvedValueOnce(mockUserWithUserRole);
      jest.spyOn(prisma.userRole, 'create').mockResolvedValueOnce(mockUserRoleRoleUser);

      const response = await request(app.server).post('/api/users/register').send(body);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should fail on register - user already exists', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(mockUserWithUserRole);

      const response = await request(app.server).post('/api/users/register').send({
        email: 'testuser@example.com',
        password: password,
        firstName: 'Test',
        lastName: 'User',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'User already exists with this email');
    });

    it('should fail on register - role user does not exist', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);
      jest.spyOn(prisma.role, 'findFirst').mockResolvedValueOnce(null);

      const response = await request(app.server).post('/api/users/register').send({
        email: 'testuser@example.com',
        password: password,
        firstName: 'Test',
        lastName: 'User',
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 on register - database error', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);
      jest.spyOn(prisma.role, 'findFirst').mockRejectedValue('error');

      const response = await request(app.server).post('/api/users/register').send({
        email: 'testuser@example.com',
        password: password,
        firstName: 'Test',
        lastName: 'User',
      });

      expect(response.status).toBe(500);
    });
  });

  describe('Login', () => {
    it('should login and return a JWT token', async () => {
      jest.spyOn(authorizationModule, 'getAuthorizationStrategy').mockReturnValue('jwt');

      const hash = await bcrypt.hash(password, SALT_ROUNDS);
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValueOnce({ ...mockUserWithUserRole, password: hash, roles: [mockUserRoleRoleUser] } as any);

      const response = await request(app.server)
        .post('/api/users/login')
        .send({ email: 'testuser@example.com', password });

      expect(response.status).toBe(200);
    });

    it('should login and return a cookie', async () => {
      jest.spyOn(authorizationModule, 'getAuthorizationStrategy').mockReturnValue('cookie');

      const hash = await bcrypt.hash(password, SALT_ROUNDS);
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValueOnce({ ...mockUserWithUserRole, password: hash, roles: [mockUserRoleRoleUser] } as any);

      const response = await request(app.server)
        .post('/api/users/login')
        .send({ email: 'testuser@example.com', password });

      expect(response.status).toBe(200);
      authCookie = response.headers['set-cookie'][0];
    });

    it('should fail on login - user not found', async () => {
      const body = { email: 'testuser@example.com', password: password };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);

      const response = await request(app.server).post('/api/users/login').send(body);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });

    it('should fail on login - password missmatch', async () => {
      const body = { email: 'testuser@example.com', password: 'Test@#1234' };

      const hash = await bcrypt.hash(password, SALT_ROUNDS);
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValueOnce({ ...mockUserWithUserRole, password: hash, roles: [mockUserRoleRoleUser] } as any);

      const response = await request(app.server).post('/api/users/login').send(body);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });
  });

  describe('User list', () => {
    it('should fetch a list of users', async () => {
      jest
        .spyOn(prisma.user, 'findMany')
        .mockResolvedValueOnce([
          { ...mockUserWithUserRole, roles: [{ ...mockUserRoleRoleUser, role: mockRoleAdmin }] } as any,
        ]);
      const response = await request(app.server).get('/api/users').set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('Assing role', () => {
    it('should assign a role to the user - adding only "author" role', async () => {
      jest
        .spyOn(prisma.userRole, 'findMany')
        .mockResolvedValueOnce([{ ...mockUserRoleRoleUser, role: mockRoleAdmin }] as any);
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValueOnce({ ...mockUserWithUserRole, roles: [mockUserRoleRoleUser] } as any)
        .mockResolvedValueOnce({
          ...mockUserWithUserRole,
          roles: [
            {
              ...mockUserRoleRoleUser,
              id: 'user-role-2',
              role: { ...mockUserRoleRoleUser.role, id: 'author-role-id', name: 'author' },
            },
            mockUserRoleRoleUser,
          ],
        } as any);

      jest.spyOn(prisma.role, 'findMany').mockResolvedValueOnce([
        { id: 'admin-role-id', name: 'admin', createdAt: new Date(), updatedAt: new Date() },
        { id: 'author-role-id', name: 'author', createdAt: new Date(), updatedAt: new Date() },
        { id: 'user-role-id', name: 'user', createdAt: new Date(), updatedAt: new Date() },
      ]);
      jest.spyOn(prisma.userRole, 'createMany').mockResolvedValueOnce({ count: 1 });

      const response = await request(app.server)
        .post(`/api/users/${userId}/assign-role`)
        .set('Cookie', authCookie)
        .send({
          roleIds: ['author-role-id'],
        });

      expect(response.status).toBe(201);
      expect(response.body.roles).toContainEqual(expect.objectContaining({ role: { name: 'author' } }));
    });

    it('should assign a role to the user - adding two roles, "author" and "admin"', async () => {
      jest
        .spyOn(prisma.userRole, 'findMany')
        .mockResolvedValueOnce([{ ...mockUserRoleRoleUser, role: mockRoleAdmin }] as any);
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValueOnce({ ...mockUserWithUserRole, roles: [mockUserRoleRoleUser] } as any)
        .mockResolvedValueOnce({
          ...mockUserWithUserRole,
          roles: [
            {
              id: 'author-role-2',
              roleId: 'author-role-id',
              role: { id: 'author-role-id', name: 'author', createdAt: new Date(), updatedAt: new Date() },
            },
            mockUserRoleRoleUser,
            {
              ...mockUserRoleRoleUser,
              id: 'admin-role-3',
              roleId: 'admin-role-id',
              role: { ...mockUserRoleRoleUser.role, id: 'admin-role-id', name: 'admin' },
            },
          ],
        } as any);

      jest.spyOn(prisma.role, 'findMany').mockResolvedValueOnce([
        { id: 'admin-role-id', name: 'admin', createdAt: new Date(), updatedAt: new Date() },
        { id: 'author-role-id', name: 'author', createdAt: new Date(), updatedAt: new Date() },
        { id: 'user-role-id', name: 'user', createdAt: new Date(), updatedAt: new Date() },
      ]);
      jest.spyOn(prisma.userRole, 'createMany').mockResolvedValueOnce({ count: 1 });

      const response = await request(app.server)
        .post(`/api/users/${userId}/assign-role`)
        .set('Cookie', authCookie)
        .send({
          roleIds: ['admin-role-id', 'author-role-id'],
        });

      expect(response.status).toBe(201);
      expect(response.body.roles).toContainEqual(expect.objectContaining({ role: { name: 'admin' } }));
      expect(response.body.roles).toContainEqual(expect.objectContaining({ role: { name: 'author' } }));
    });

    it('should not assign a role to the user - user already has role', async () => {
      jest
        .spyOn(prisma.userRole, 'findMany')
        .mockResolvedValueOnce([{ ...mockUserRoleRoleUser, role: mockRoleAdmin }] as any);
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
        ...mockUserWithUserRole,
        roles: [
          mockUserRoleRoleUser,
          {
            ...mockUserRoleRoleUser,
            id: 'admin-role-2',
            roleId: 'author-role-id',
            role: { ...mockUserRoleRoleUser.role, id: 'author-role-id', name: 'author' },
          },
        ],
      } as any);

      const response = await request(app.server)
        .post(`/api/users/${userId}/assign-role`)
        .set('Cookie', authCookie)
        .send({
          roleIds: ['author-role-id'],
        });
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'User already has all of the roles');
    });

    it('should not assign a role to the user - user not found', async () => {
      jest
        .spyOn(prisma.userRole, 'findMany')
        .mockResolvedValueOnce([{ ...mockUserRoleRoleUser, role: mockRoleAdmin }] as any);
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);

      const response = await request(app.server)
        .post(`/api/users/${userId}/assign-role`)
        .set('Cookie', authCookie)
        .send({
          roleIds: ['admin-role-id', 'author-role-id'],
        });
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should return 500 on assigning roles - database error', async () => {
      jest
        .spyOn(prisma.userRole, 'findMany')
        .mockResolvedValueOnce([{ ...mockUserRoleRoleUser, role: mockRoleAdmin }] as any);
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValueOnce({ ...mockUserWithUserRole, roles: [mockUserRoleRoleUser] } as any)
        .mockResolvedValueOnce({
          ...mockUserWithUserRole,
          roles: [
            {
              ...mockUserRoleRoleUser,
              id: 'author-role-2',
              roleId: 'author-role-id',
              role: { ...mockUserRoleRoleUser.role, id: 'author-role-id', name: 'author' },
            },
            mockUserRoleRoleUser,
            {
              id: 'admin-role-3',
              roleId: 'admin-role-id',
              role: { id: 'admin-role-id', name: 'admin', createdAt: new Date(), updatedAt: new Date() },
            },
          ],
        } as any);

      jest.spyOn(prisma.role, 'findMany').mockResolvedValueOnce([
        { id: 'admin-role-id', name: 'admin', createdAt, updatedAt },
        { id: 'author-role-id', name: 'author', createdAt, updatedAt },
        { id: 'user-role-id', name: 'user', createdAt, updatedAt },
      ]);
      jest.spyOn(prisma.userRole, 'createMany').mockRejectedValueOnce(new Error('Error assigning roles'));

      const response = await request(app.server)
        .post(`/api/users/${userId}/assign-role`)
        .set('Cookie', authCookie)
        .send({
          roleIds: ['admin-role-id', 'author-role-id'],
        });
      expect(response.status).toBe(500);
    });
  });

  describe('Logout', () => {
    it('should logout', async () => {
      const response = await request(app.server).delete(`/api/users/logout`).set('Cookie', authCookie);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Logout successful');
    });
  });
});
