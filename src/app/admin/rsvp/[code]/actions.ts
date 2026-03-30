"use server";

import { getDb } from "@/db";
import { invites, guests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { upsertHotelBooking } from "@/lib/hotel";

export async function updateGuest(
  guestId: string,
  data: {
    name?: string;
    attendingFriday?: boolean | null;
    attendingSaturday?: boolean | null;
    email?: string | null;
    phone?: string | null;
    dietaryRestrictions?: string | null;
    plusOneName?: string | null;
  }
) {
  const db = getDb();
  await db
    .update(guests)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(guests.id, guestId));
  return { success: true };
}

export async function updateInvite(
  inviteId: string,
  data: {
    hotelEligible?: boolean;
    maxGuests?: number;
    notes?: string | null;
    address?: string | null;
  }
) {
  const db = getDb();
  await db.update(invites).set(data).where(eq(invites.id, inviteId));
  return { success: true };
}

export { upsertHotelBooking as updateHotelBooking };

export async function deleteInvite(inviteId: string) {
  const db = getDb();
  await db
    .update(invites)
    .set({ deleted: true })
    .where(eq(invites.id, inviteId));
  return { success: true };
}
