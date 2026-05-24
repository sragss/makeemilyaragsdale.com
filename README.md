# MakeEmilyARagsdale.com

Wedding website for Emily Devery & Sam Ragsdale - February 27, 2027 - San Miguel de Allende, Mexico.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Neon Postgres + Drizzle ORM
- **Hosting**: Vercel (sragss-projects/makeemilyaragsdale-com)
- **Domain**: makeemilyaragsdale.com

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing - date, names, location |
| `/schedule` | Event schedule |
| `/travel` | Travel and hotel information |
| `/explore` | San Miguel recommendations |
| `/dress-code` | Dress code |
| `/faq` | Frequently asked questions |
| `/rsvp` | Public RSVP form with hotel booking question |
| `/admin` | Password-protected dashboard |
| `/admin/rsvp/[id]` | Edit an RSVP |

## Getting Started

```bash
pnpm install
pnpm dev
```

Requires `.env.local` with:

```bash
DATABASE_URL="postgresql://..."
ADMIN_PASSWORD="..."
```

## Scripts

```bash
pnpm dev          # Local dev server
pnpm build        # Production build
pnpm db:push      # Push schema changes to Neon
pnpm db:seed      # Seed test RSVP data
pnpm db:studio    # Drizzle Studio
```

## RSVP

Guests use `/rsvp` directly. There is no invite code entry and no hotel eligibility gate; anyone attending can select a main course and indicate whether they plan to book at the Belmond.

## Admin

- **URL**: makeemilyaragsdale.com/admin
- **Password**: Set via `ADMIN_PASSWORD`
- Click a guest group in the table to edit guest details, hotel booking status, and booking value
- Create manual RSVP records with the "+ New RSVP" button
