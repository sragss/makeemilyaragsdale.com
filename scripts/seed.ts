import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { randomUUID } from "crypto";
import { invites, guests, hotelBookings, inviteEvents } from "../src/db/schema";

const FORCE = process.argv.includes("--force");

// Seeding wipes every invite, guest, hotel booking, and event row. Real RSVPs
// arrive with an RSVP- key (public form) or ADMIN- key (admin "+ New RSVP");
// seed rows use SEED-. Finding any of the former means this is the live
// database, not a dev one.
async function assertSafeToSeed(sql: NeonQueryFunction<false, false>) {
  const [row] = (await sql`
    SELECT COUNT(*)::int AS real_rsvps FROM invites
    WHERE code LIKE 'RSVP-%' OR code LIKE 'ADMIN-%'
  `) as { real_rsvps: number }[];

  if (row.real_rsvps === 0) return;

  if (FORCE) {
    console.warn(
      `WARNING: --force given, deleting ${row.real_rsvps} real RSVP(s).\n`
    );
    return;
  }

  console.error(
    `Refusing to seed: found ${row.real_rsvps} real RSVP(s) in this database.\n` +
      `Seeding DELETES every invite, guest, hotel booking, and event row, and\n` +
      `RSVPs are not recoverable — the admin only ever soft-deletes them.\n\n` +
      `Check that DATABASE_URL points at a dev database. To wipe anyway:\n` +
      `  pnpm db:seed -- --force\n`
  );
  process.exit(1);
}

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  await assertSafeToSeed(sql);

  // Clear existing data (order matters for FK constraints)
  await db.delete(inviteEvents);
  await db.delete(hotelBookings);
  await db.delete(guests);
  await db.delete(invites);

  const testData = [
    {
      maxGuests: 2,
      notes: "The happy couple's test RSVP",
      guestNames: ["Sam Ragsdale", "Emily Devery"],
    },
    {
      maxGuests: 2,
      notes: "Close friends",
      guestNames: ["John Smith", "Jane Smith"],
    },
    {
      maxGuests: 1,
      notes: "Solo RSVP",
      guestNames: ["Alex Jones"],
    },
  ];

  for (const data of testData) {
    const [inserted] = await db
      .insert(invites)
      .values({
        internalKey: `SEED-${randomUUID()}`,
        maxGuests: data.maxGuests,
        notes: data.notes,
      })
      .returning();

    await db.insert(guests).values(
      data.guestNames.map((name, i) => ({
        inviteId: inserted.id,
        name,
        isPrimary: i === 0,
      }))
    );

    console.log(`  ${data.guestNames.join(" & ")}`);
  }

  console.log("\nSeeded 3 RSVPs");
}

seed().catch(console.error);
