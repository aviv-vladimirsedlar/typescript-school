import bcrypt from 'bcryptjs';

import prisma from '../src/config/prisma.db';
const SALT_ROUNDS = 10;

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });
  const authorRole = await prisma.role.upsert({
    where: { name: 'author' },
    update: {},
    create: { name: 'author' },
  });
  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user' },
  });

  // Role Allowed Actions
  const roleAllowedData = [
    { roleId: adminRole.id, action: 'assign_roles', description: 'Can assign roles to users' },
    { roleId: adminRole.id, action: 'create_movie', description: 'Can create movies' },
    { roleId: adminRole.id, action: 'edit_movie', description: 'Can edit any movie' },
    { roleId: adminRole.id, action: 'delete_movie', description: 'Can delete any movie' },
    { roleId: authorRole.id, action: 'create_movie', description: 'Can create movies' },
    { roleId: authorRole.id, action: 'edit_own_movie', description: 'Can edit own movies' },
    { roleId: authorRole.id, action: 'delete_own_movie', description: 'Can delete own movies' },
    { roleId: userRole.id, action: 'view_movie', description: 'Can view movies' },
  ];
  for (const roleAllowed of roleAllowedData) {
    const found = await prisma.roleAllowed.findFirst({
      where: { roleId: roleAllowed.roleId, action: roleAllowed.action },
    });
    if (!found) {
      await prisma.roleAllowed.create({ data: roleAllowed });
    }
  }

  const hashedPassword = await bcrypt.hashSync('Test@#12345', SALT_ROUNDS);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@aviv-group.com' },
    update: {},
    create: {
      email: 'admin@aviv-group.com',
      firstName: 'Admin',
      lastName: 'User',
      password: hashedPassword,
      roles: { create: { roleId: adminRole.id } },
    },
  });

  console.log('Seed data created:', { adminUser, adminRole, authorRole, userRole });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
