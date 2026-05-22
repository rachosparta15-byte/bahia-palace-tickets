import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  const result = await prisma.blogPost.updateMany({
    where: { published: false },
    data:  { published: true, publishedAt: new Date() },
  });
  console.log(`${result.count} articles published.`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
