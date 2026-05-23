This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Required Environment Variables

These must be set in Vercel → Settings → Environment Variables (and in `.env.local` for local dev).

| Variable | Required | Format | Description |
|---|---|---|---|
| `DATABASE_URL` | ✅ Yes | `https://<name>.turso.io` | Turso database URL |
| `TURSO_AUTH_TOKEN` | ✅ Yes | string | Turso auth token |
| `NEXTAUTH_SECRET` | ✅ Yes | random 32+ char string | JWT signing secret — **must be set in production** |
| `NEXT_PUBLIC_SITE_URL` | ✅ Yes | `https://visitbahiapalace.com` | Canonical base URL (no trailing slash) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | ⚠️ Set before launch | `212XXXXXXXXX` | WhatsApp Business number without `+`. If missing or set to `212600000000`, all WhatsApp buttons are hidden site-wide |
| `BLOB_READ_WRITE_TOKEN` | ⚠️ Set before launch | Vercel Blob token | Required for admin image uploads in production |
| `SUPPORT_EMAIL` | Optional | email address | Recipient of contact form notifications (defaults to `support@visitbahiapalace.com`) |
| `RESEND_API_KEY` | Optional | `re_…` | Resend API key — required if `EMAIL_PROVIDER=resend` |
| `NEXT_PUBLIC_GOOGLE_VERIFY` | Optional | string | Google Search Console verification token |

> **Generate `NEXTAUTH_SECRET`:** `openssl rand -base64 32`

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
