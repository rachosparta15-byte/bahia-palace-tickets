import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  const deleted = await prisma.review.deleteMany({});
  console.log(`Deleted ${deleted.count} reviews.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
