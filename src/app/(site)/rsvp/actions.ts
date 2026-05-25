"use server";

import { randomUUID } from "crypto";
import { getDb } from "@/db";
import { guests, hotelBookings, invites } from "@/db/schema";
import { EMAIL_REGEX } from "@/lib/constants";

interface GuestSubmission {
  name: string;
  attendingFriday: boolean;
  attendingSaturday: boolean;
  email: string;
  phone: string;
  mainCoursePreference: string;
  dietaryRestrictions: string;
}

interface RsvpSubmission {
  guests: GuestSubmission[];
  hotelWillBook?: boolean;
  hotelAcknowledged?: boolean;
}

export async function submitRsvp(data: RsvpSubmission) {
  const db = getDb();
  const submittedGuests = data.guests
    .map((guest) => ({
      ...guest,
      name: guest.name.trim(),
      email: guest.email.trim(),
      phone: guest.phone.trim(),
      mainCoursePreference: guest.mainCoursePreference.trim(),
      dietaryRestrictions: guest.dietaryRestrictions.trim(),
    }))
    .filter((guest) => guest.name.length > 0);

  if (submittedGuests.length === 0) {
    throw new Error("At least one guest name is required");
  }

  for (const guest of submittedGuests) {
    if (guest.email && !EMAIL_REGEX.test(guest.email)) {
      throw new Error(`Invalid email: ${guest.email}`);
    }
    if (
      (guest.attendingFriday || guest.attendingSaturday) &&
      !guest.mainCoursePreference
    ) {
      throw new Error(`Main course preference is required for ${guest.name}`);
    }
  }

  const [invite] = await db
    .insert(invites)
    .values({
      internalKey: `RSVP-${randomUUID()}`,
      maxGuests: submittedGuests.length,
    })
    .returning();

  await db.insert(guests).values(
    submittedGuests.map((guest, index) => ({
      inviteId: invite.id,
      name: guest.name,
      isPrimary: index === 0,
      attendingFriday: guest.attendingFriday,
      attendingSaturday: guest.attendingSaturday,
      email: guest.email || null,
      phone: guest.phone || null,
      mainCoursePreference: guest.mainCoursePreference || null,
      dietaryRestrictions: guest.dietaryRestrictions || null,
    }))
  );

  if (data.hotelWillBook !== undefined) {
    await db.insert(hotelBookings).values({
      inviteId: invite.id,
      willBook: data.hotelWillBook,
      acknowledgedPolicy: data.hotelAcknowledged ?? false,
    });
  }

  return { success: true, inviteId: invite.id };
}
