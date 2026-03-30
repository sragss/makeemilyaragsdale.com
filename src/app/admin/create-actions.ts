"use server";

import { getDb } from "@/db";
import { invites, guests } from "@/db/schema";
import { generateCode } from "@/lib/codes";

export async function createInvite(data: {
  guestNames: string[];
  hotelEligible: boolean;
  address: string | null;
  notes: string | null;
}) {
  const db = getDb();
  const code = generateCode();

  const [inserted] = await db
    .insert(invites)
    .values({
      code,
      hotelEligible: data.hotelEligible,
      maxGuests: data.guestNames.length,
      address: data.address,
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

  return { code };
}
