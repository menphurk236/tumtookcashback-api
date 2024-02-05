// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// initialize the Prisma Client
const prisma = new PrismaClient();

const roundsOfHashing = 10;

async function main() {
  // create two dummy users
  const password = await bcrypt.hash('123456', roundsOfHashing);

  const user1 = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      password: password,
    },
    create: {
      username: 'admin',
      password: password,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'superAdmin',
      tel: '0987654321',
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
