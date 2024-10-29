import bcrypt from 'bcrypt';
import request from 'supertest';
import { FastifyInstance } from 'fastify';

import { buildServer } from '../../index';
import prisma from '../../config/prisma.db';

let app: FastifyInstance;
let authCookie: string;
let userId: string = 'user-id';

const SALT_ROUNDS = 10;
const password = 'Test@#12345';

const DUMMY_ROLE_USER = { id: 'role-id', name: 'user', createdAt: new Date(), updatedAt: new Date() };
const DUMMY_USER_ROLE = {
  id: 'user-role-id',
  userId: 'user-id',
  roleId: 'role-id',
  role: DUMMY_ROLE_USER,
  createdAt: new Date(),
  updatedAt: new Date(),
};
const DUMMY_USER_WITH_USER_ROLE = {
  id: 'role-id',
  firstName: 'user',
  lastName: 'user',
  email: 'text@test.com',
  password: 'hashedpassword',
  roles: [DUMMY_USER_ROLE],
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeAll(async () => {
  app = buildServer();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('User Controller', () => {
  it('should register a new user', async () => {
    const body = {
      email: 'testuser@example.com',
      password: 'Test@#12345',
      firstName: 'Test',
      lastName: 'User',
    };
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);
    jest.spyOn(prisma.role, 'findFirst').mockResolvedValueOnce(DUMMY_ROLE_USER);
    jest.spyOn(prisma.user, 'create').mockResolvedValueOnce(DUMMY_USER_WITH_USER_ROLE);
    jest.spyOn(prisma.userRole, 'create').mockResolvedValueOnce(DUMMY_USER_ROLE as any);

    const response = await request(app.server).post('/api/users/register').send(body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should login an existing user and return a cookie', async () => {
    const body = { email: 'testuser@example.com', password: 'Test@#12345' };

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    jest
      .spyOn(prisma.user, 'findUnique')
      .mockResolvedValueOnce({ ...DUMMY_USER_WITH_USER_ROLE, password: hash, roles: [DUMMY_USER_ROLE] } as any);

    const response = await request(app.server).post('/api/users/login').send(body);

    expect(response.status).toBe(200);
    authCookie = response.headers['set-cookie'][0];
  });

  it('should fetch a list of users', async () => {
    const response = await request(app.server).get('/api/users').set('Cookie', authCookie);

    jest.spyOn(prisma.user, 'findMany').mockResolvedValueOnce([DUMMY_USER_WITH_USER_ROLE]);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it.skip('should assign a role to the user', async () => {
    jest
      .spyOn(prisma.user, 'findUnique')
      .mockResolvedValueOnce({ ...DUMMY_USER_WITH_USER_ROLE, roles: [DUMMY_USER_ROLE] } as any)
      .mockResolvedValueOnce({
        ...DUMMY_USER_WITH_USER_ROLE,
        roles: [
          DUMMY_USER_ROLE,
          {
            id: 'user-role-2',
            role: { id: 'author-role-id', name: 'user', createdAt: new Date(), updatedAt: new Date() },
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
      .post(`/api/users/${userId}/assing-role`)
      .set('Cookie', authCookie)
      .send({
        roleIds: ['author-role-id'],
      });

    expect(response.status).toBe(201);
    expect(response.body.roles).toContainEqual(expect.objectContaining({ role: { name: 'admin' } }));
  });
});
