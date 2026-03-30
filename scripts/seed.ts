import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { invites, guests, hotelBookings } from "../src/db/schema";
import { generateCode } from "../src/lib/codes";

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  // Clear existing data (order matters for FK constraints)
  await db.delete(hotelBookings);
  await db.delete(guests);
  await db.delete(invites);

  const testData = [
    {
      hotelEligible: true,
      maxGuests: 2,
      notes: "The happy couple's test invite",
      guestNames: ["Sam Ragsdale", "Emily Devery"],
    },
    {
      hotelEligible: true,
      maxGuests: 2,
      notes: "Close friends, hotel eligible",
      guestNames: ["John Smith", "Jane Smith"],
    },
    {
      hotelEligible: false,
      maxGuests: 1,
      notes: "Solo invite with +1 option",
      guestNames: ["Alex Jones"],
    },
  ];

  for (const data of testData) {
    const code = generateCode();
    const [inserted] = await db
      .insert(invites)
      .values({
        code,
        hotelEligible: data.hotelEligible,
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

    console.log(`  ${code} → ${data.guestNames.join(" & ")}`);
  }

  console.log("\nSeeded 3 invites");
}

seed().catch(console.error);
