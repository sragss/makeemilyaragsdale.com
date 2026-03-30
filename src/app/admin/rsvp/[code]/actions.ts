"use server";

import { getDb } from "@/db";
import { invites, guests, hotelBookings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateGuest(
  guestId: string,
  data: {
    name?: string;
    attending?: boolean | null;
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

export async function updateHotelBooking(
  inviteId: string,
  data: {
    willBook?: boolean | null;
    bookingComplete?: boolean;
    bookingValue?: string | null;
  }
) {
  const db = getDb();
  const existing = await db.query.hotelBookings.findFirst({
    where: eq(hotelBookings.inviteId, inviteId),
  });

  if (existing) {
    await db
      .update(hotelBookings)
      .set(data)
      .where(eq(hotelBookings.inviteId, inviteId));
  } else {
    await db.insert(hotelBookings).values({
      inviteId,
      willBook: data.willBook ?? null,
      bookingComplete: data.bookingComplete ?? false,
      bookingValue: data.bookingValue ?? null,
    });
  }
  return { success: true };
}

export async function deleteInvite(inviteId: string) {
  const db = getDb();
  await db
    .update(invites)
    .set({ deleted: true })
    .where(eq(invites.id, inviteId));
  return { success: true };
}
