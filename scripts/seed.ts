import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { randomUUID } from "crypto";
import { invites, guests, hotelBookings, inviteEvents } from "../src/db/schema";

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

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
