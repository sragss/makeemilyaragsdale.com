import { getDb } from "@/db";
import { hotelBookings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function upsertHotelBooking(
  inviteId: string,
  data: {
    willBook?: boolean | null;
    acknowledgedPolicy?: boolean;
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
      acknowledgedPolicy: data.acknowledgedPolicy ?? false,
      bookingComplete: data.bookingComplete ?? false,
      bookingValue: data.bookingValue ?? null,
    });
  }
}
