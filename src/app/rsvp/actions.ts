"use server";

import { getDb } from "@/db";
import { invites, guests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { upsertHotelBooking } from "@/lib/hotel";
import { EMAIL_REGEX } from "@/lib/constants";

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
      attendingFriday: g.attendingFriday,
      attendingSaturday: g.attendingSaturday,
      dietaryRestrictions: g.dietaryRestrictions,
      plusOneName: g.plusOneName,
    })),
    hotelBooking: invite.hotelBookings ?? null,
  };
}

export type InviteData = NonNullable<Awaited<ReturnType<typeof lookupInvite>>>;

interface GuestSubmission {
  id: string;
  attendingFriday: boolean;
  attendingSaturday: boolean;
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
    if (guest.email && !EMAIL_REGEX.test(guest.email)) {
      throw new Error(`Invalid email: ${guest.email}`);
    }

    await db
      .update(guests)
      .set({
        attendingFriday: guest.attendingFriday,
        attendingSaturday: guest.attendingSaturday,
        email: guest.email || null,
        phone: guest.phone || null,
        dietaryRestrictions: guest.dietaryRestrictions || null,
        plusOneName: guest.plusOneName || null,
        updatedAt: new Date(),
      })
      .where(eq(guests.id, guest.id));
  }

  if (data.hotelWillBook !== undefined) {
    await upsertHotelBooking(data.inviteId, {
      willBook: data.hotelWillBook,
      acknowledgedPolicy: data.hotelAcknowledged ?? false,
    });
  }

  return { success: true };
}
