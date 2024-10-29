import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// eslint-disable-next-line no-undef
beforeAll(async () => {
  await prisma.$connect();
});

// eslint-disable-next-line no-undef
afterAll(async () => {
  await prisma.$disconnect();
});
