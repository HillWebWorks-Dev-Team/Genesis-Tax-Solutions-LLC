# Genesis Tax & Notary Solutions

Next.js site + admin for Genesis Tax Solutions LLC (Jacksonville, FL).

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Prisma + Supabase Postgres
- Resend (transactional email)
- Mailchimp Marketing API (subscribers / campaign status)

## Local setup

```bash
npm install
cp .env.example .env
```

Fill `.env` with Supabase `DATABASE_URL` / `DIRECT_URL`, a strong `SESSION_SECRET`, and optional Resend / Mailchimp keys.

```bash
npx prisma migrate deploy
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin first-time setup: `/admin/setup` with `ADMIN_SETUP_CODE` from `.env`.

Optional CMS seed:

```bash
node --env-file=.env ./scripts/seed-cms.mjs
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Create/apply local migrations |
| `npm run db:deploy` | Apply migrations (production) |

## Deploy (Vercel + Supabase)

1. Import this repo in Vercel (root = repository root).
2. Set env vars from `.env.example` (never commit real secrets).
3. Build command: `npm run build`
4. After first deploy, run migrations against production:

```bash
npx prisma migrate deploy
```

5. Visit `/admin/setup` once, then configure Availability and Website CMS.

## Notes

- Do not commit `.env` or database credentials.
- Setup code is server-only for first admin provisioning.
- Live cutover to `gtsnotarytax.com` only after DNS + email are approved.
