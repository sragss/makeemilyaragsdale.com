# MakeEmilyARagsdale.com

Wedding website for Emily Devery & Sam Ragsdale — February 27, 2027 — San Miguel de Allende, Mexico.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Neon Postgres + Drizzle ORM
- **Hosting**: Vercel (sragss-projects/makeemilyaragsdale-com)
- **Domain**: makeemilyaragsdale.com

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing — date, names, location |
| `/details` | Schedule, venue, dress code, accommodation |
| `/rsvp` | Code entry → RSVP form |
| `/rsvp/[code]` | Direct RSVP link (e.g. `/rsvp/EBR-TOVIK`) |
| `/admin` | Password-protected dashboard |
| `/admin/rsvp/[code]` | Edit individual invite details |

## Getting Started

```bash
pnpm install
pnpm dev
```

Requires `.env.local` with:
```
DATABASE_URL="postgresql://..."
ADMIN_PASSWORD="emily-ragsdale"
```

## Scripts

```bash
pnpm dev          # Local dev server
pnpm build        # Production build
pnpm db:push      # Push schema changes to Neon
pnpm db:seed      # Seed test data (generates new random codes)
pnpm db:studio    # Drizzle Studio (database GUI)
```

## Deployment

Push to `main` → auto-deploys to production on Vercel. PRs get preview deployments.

Environment variables (`DATABASE_URL`, `ADMIN_PASSWORD`) are set in Vercel project settings.

## RSVP Codes

Each invite gets a pronounceable code like `EBR-TOVIK` (consonant-vowel alternating pattern). Codes are generated in `src/lib/codes.ts`. Guests enter codes at `/rsvp` or visit `/rsvp/EBR-TOVIK` directly.

New invites can be created from the admin dashboard.

## Admin

- **URL**: makeemilyaragsdale.com/admin
- **Password**: Set via `ADMIN_PASSWORD` env var
- Click any code in the table to edit guest details, hotel booking status, and booking value
- Create new invites with the "+ New Invite" button
