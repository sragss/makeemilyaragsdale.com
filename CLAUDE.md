# MakeEmilyARagsdale.com - Project Context

Wedding website for Emily Devery & Sam Ragsdale. February 27, 2027. San Miguel de Allende, Mexico.

## Architecture

- **Next.js 16** App Router. Read `node_modules/next/dist/docs/` before changing Next conventions.
- **Tailwind CSS v4** + **shadcn/ui** components in `src/components/ui/`.
- **Neon Postgres** via `@neondatabase/serverless` + **Drizzle ORM**. Schema in `src/db/schema.ts`, DB init in `src/db/index.ts`.
- **Framer Motion** for RSVP transitions and confetti.
- **NoiseBackground** (`src/components/ui/noise-background.tsx`) powers the textured form controls.

## Database

- Schema changes: edit `src/db/schema.ts`, then run `pnpm db:push`.
- Seed data: `pnpm db:seed`.
- Main tables:
  - `invites`: internal RSVP group records. The database still has a legacy `code` column, mapped in code as `internalKey`; it is not guest-facing.
  - `guests`: names, event attendance, contact info, dietary needs, optional plus-one name.
  - `hotel_bookings`: will book, acknowledged policy, booking complete, booking value.
  - `invite_events`: legacy activity log rows for older tracked events.

## RSVP Flow

1. Guest visits `/rsvp`.
2. Form collects guest names, attendance toggle, Friday/Saturday event checkboxes, contact info, main course preference, dietary needs, and hotel booking intent.
3. Hotel booking is available to everyone who is attending; there is no hotel eligibility flag.
4. Submit creates a new internal RSVP group and guest rows, then shows the completion state.

There is no invite-code flow and no `/rsvp/[code]` route.

## Admin

- `/admin` is password-protected with `ADMIN_PASSWORD`.
- Dashboard shows attendance, pending/declined counts, hotel bookings, and all RSVP groups.
- Click a guest group to open `/admin/rsvp/[id]` and edit guests or hotel booking fields.
- "+ New RSVP" manually creates an RSVP group without exposing any code.

## Admin API

All requests require `Authorization: Bearer <ADMIN_PASSWORD>`.

Base URL: `https://makeemilyaragsdale.com/api/admin`.

### Read

```bash
curl -H "Authorization: Bearer $ADMIN_PASSWORD" \
  "https://makeemilyaragsdale.com/api/admin?action=list"
```

Returns `{ rsvps: [...], count: N }`.

```bash
curl -H "Authorization: Bearer $ADMIN_PASSWORD" \
  "https://makeemilyaragsdale.com/api/admin?action=get&id=RSVP_ID"
```

Returns one RSVP with guests, hotel booking, and activity events.

```bash
curl -H "Authorization: Bearer $ADMIN_PASSWORD" \
  "https://makeemilyaragsdale.com/api/admin?action=stats"
```

Returns `{ rsvps, guests, attending, declined, pending, hotelBooking, hotelComplete }`.

### Write

```json
{"action":"create","guestNames":["Jane Doe","John Doe"],"address":"123 Main St","notes":"College friends"}
{"action":"update_rsvp","id":"RSVP_ID","address":"456 Oak Ave","notes":"Updated note"}
{"action":"update_guest","guestId":"GUEST_ID","attendingFriday":true,"attendingSaturday":true,"email":"jane@example.com","phone":"+1 555 123 4567","mainCoursePreference":"Steak"}
{"action":"update_hotel","id":"RSVP_ID","willBook":true,"bookingComplete":true,"bookingValue":"4500.00"}
{"action":"delete","id":"RSVP_ID","confirm":true}
```

Guest lookup can use `guestId`, or `inviteId` + `guestName`. `mainCoursePreference` is a string such as Steak, Chicken, Fish, Vegetarian, Vegan, or a custom value.

## Design

- Light mode only with a warm San Miguel palette.
- Fonts: Cormorant Garamond for headings, Geist Sans for body, Edict/Eros local fonts where already used.
- Avoid adding code-entry, hotel-eligibility, or phil-mode UI back into the guest flow.

## Key Files

- `src/app/(site)/rsvp/rsvp-flow.tsx` - public RSVP client flow.
- `src/app/(site)/rsvp/actions.ts` - RSVP submit server action.
- `src/app/admin/page.tsx` - admin dashboard.
- `src/app/admin/admin-table.tsx` - admin table search, filters, sorting.
- `src/app/admin/rsvp/[id]/page.tsx` - admin RSVP detail/edit.
- `src/app/api/admin/route.ts` - admin API.
- `src/db/schema.ts` - Drizzle schema.
- `src/components/botanicals.tsx` - canvas confetti.
- `src/app/globals.css` - theme variables and global styles.
