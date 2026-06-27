import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const url = process.env.DATABASE_URL ?? 'file:./dev.db';
const authToken = process.env.TURSO_AUTH_TOKEN;
const adapter = new PrismaLibSql({ url, ...(authToken ? { authToken } : {}) });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.blogPost.update({
    where: { slug_locale: { slug: 'bahia-palace-vs-dar-si-said', locale: 'en' } },
    data: {
      seoDesc:
        'Both built by brothers in 1894–1900, Bahia Palace and Dar Si Said stand 5 minutes apart in Marrakech. Compare crowds, entry fees and what each palace offers.',
    },
  });
  console.log('✓ Fixed EN seoDesc for bahia-palace-vs-dar-si-said');
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
