"use server";

import { randomUUID } from "crypto";
import { getDb } from "@/db";
import { invites, guests } from "@/db/schema";

export async function createRsvp(data: {
  guestNames: string[];
  address: string | null;
  notes: string | null;
}) {
  const db = getDb();

  const [inserted] = await db
    .insert(invites)
    .values({
      internalKey: `ADMIN-${randomUUID()}`,
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

  return { id: inserted.id };
}
