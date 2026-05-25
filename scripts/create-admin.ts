import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? '',
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const hash = await bcrypt.hash('Visa2001@@', 12);
  const existing = await prisma.adminUser.findUnique({ where: { email: 'rachosparta13@gmail.com' } });
  if (existing) {
    await prisma.adminUser.update({ where: { email: 'rachosparta13@gmail.com' }, data: { passwordHash: hash } });
    console.log('Password updated for rachosparta13@gmail.com');
  } else {
    await prisma.adminUser.create({ data: { email: 'rachosparta13@gmail.com', passwordHash: hash, name: 'Admin', role: 'admin' } });
    console.log('Admin created: rachosparta13@gmail.com');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
