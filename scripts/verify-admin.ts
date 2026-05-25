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
  const user = await prisma.adminUser.findUnique({ where: { email: 'rachosparta13@gmail.com' } });
  if (!user) { console.log('❌ User not found'); return; }
  console.log('✅ User found:', user.email, '| role:', user.role);
  const valid = await bcrypt.compare('Visa2001@@', user.passwordHash);
  console.log('Password check:', valid ? '✅ correct' : '❌ wrong hash');
}

main().catch(console.error).finally(() => prisma.$disconnect());
