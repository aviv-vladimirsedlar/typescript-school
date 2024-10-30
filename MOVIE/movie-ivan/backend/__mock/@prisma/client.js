const mockPrismaClient = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
  },
  role: {
    findFirst: jest.fn(),
  },
  userRole: {
    create: jest.fn(),
    createMany: jest.fn(),
  },
};

const PrismaClient = jest.fn(() => mockPrismaClient);

export default PrismaClient;
