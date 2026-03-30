"use server";

import { getDb } from "@/db";
import { invites, guests, hotelBookings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function lookupInvite(code: string) {
  const db = getDb();
  const invite = await db.query.invites.findFirst({
    where: eq(invites.code, code.trim().toUpperCase()),
    with: {
      guests: true,
      hotelBookings: true,
    },
  });

  if (!invite) return null;

  return {
    id: invite.id,
    code: invite.code,
    hotelEligible: invite.hotelEligible,
    maxGuests: invite.maxGuests,
    guests: invite.guests.map((g) => ({
      id: g.id,
      name: g.name,
      isPrimary: g.isPrimary,
      email: g.email,
      phone: g.phone,
      attending: g.attending,
      dietaryRestrictions: g.dietaryRestrictions,
      plusOneName: g.plusOneName,
    })),
    hotelBooking: invite.hotelBookings ?? null,
  };
}

export type InviteData = NonNullable<Awaited<ReturnType<typeof lookupInvite>>>;

interface GuestSubmission {
  id: string;
  attending: boolean;
  email: string;
  phone: string;
  dietaryRestrictions: string;
  plusOneName: string;
}

interface RsvpSubmission {
  inviteId: string;
  guests: GuestSubmission[];
  hotelWillBook?: boolean;
  hotelAcknowledged?: boolean;
}

export async function submitRsvp(data: RsvpSubmission) {
  const db = getDb();

  for (const guest of data.guests) {
    await db
      .update(guests)
      .set({
        attending: guest.attending,
        email: guest.email || null,
        phone: guest.phone || null,
        dietaryRestrictions: guest.dietaryRestrictions || null,
        plusOneName: guest.plusOneName || null,
        updatedAt: new Date(),
      })
      .where(eq(guests.id, guest.id));
  }

  if (data.hotelWillBook !== undefined) {
    const existing = await db.query.hotelBookings.findFirst({
      where: eq(hotelBookings.inviteId, data.inviteId),
    });

    if (existing) {
      await db
        .update(hotelBookings)
        .set({
          willBook: data.hotelWillBook,
          acknowledgedPolicy: data.hotelAcknowledged ?? false,
        })
        .where(eq(hotelBookings.inviteId, data.inviteId));
    } else {
      await db.insert(hotelBookings).values({
        inviteId: data.inviteId,
        willBook: data.hotelWillBook,
        acknowledgedPolicy: data.hotelAcknowledged ?? false,
      });
    }
  }

  return { success: true };
}
