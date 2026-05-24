import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { guests, hotelBookings, invites } from "@/db/schema";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth) return false;
  const token = auth.replace(/^Bearer\s+/i, "");
  return token === process.env.ADMIN_PASSWORD;
}

// GET /api/admin?action=list|get|stats
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") ?? "list";
  const db = getDb();

  if (action === "list") {
    const all = await db.query.invites.findMany({
      with: { guests: true, hotelBookings: true },
      orderBy: (invites, { desc }) => [desc(invites.createdAt)],
    });
    const result = all
      .filter((invite) => !invite.deleted)
      .map((invite) => ({
        id: invite.id,
        maxGuests: invite.maxGuests,
        address: invite.address,
        notes: invite.notes,
        guests: invite.guests.map((guest) => ({
          id: guest.id,
          name: guest.name,
          isPrimary: guest.isPrimary,
          attendingFriday: guest.attendingFriday,
          attendingSaturday: guest.attendingSaturday,
          email: guest.email,
          phone: guest.phone,
          mainCoursePreference: guest.mainCoursePreference,
          dietaryRestrictions: guest.dietaryRestrictions,
          plusOneName: guest.plusOneName,
        })),
        hotel: invite.hotelBookings
          ? {
              willBook: invite.hotelBookings.willBook,
              bookingComplete: invite.hotelBookings.bookingComplete,
              bookingValue: invite.hotelBookings.bookingValue,
            }
          : null,
      }));
    return NextResponse.json({ rsvps: result, count: result.length });
  }

  if (action === "get") {
    const id = searchParams.get("id");
    if (!id) return badRequest("Missing ?id= parameter");

    const invite = await db.query.invites.findFirst({
      where: eq(invites.id, id),
      with: {
        guests: true,
        hotelBookings: true,
        events: { orderBy: (events, { desc }) => [desc(events.createdAt)] },
      },
    });
    if (!invite || invite.deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: invite.id,
      maxGuests: invite.maxGuests,
      address: invite.address,
      notes: invite.notes,
      guests: invite.guests.map((guest) => ({
        id: guest.id,
        name: guest.name,
        isPrimary: guest.isPrimary,
        attendingFriday: guest.attendingFriday,
        attendingSaturday: guest.attendingSaturday,
        email: guest.email,
        phone: guest.phone,
        mainCoursePreference: guest.mainCoursePreference,
        dietaryRestrictions: guest.dietaryRestrictions,
        plusOneName: guest.plusOneName,
      })),
      hotel: invite.hotelBookings
        ? {
            willBook: invite.hotelBookings.willBook,
            bookingComplete: invite.hotelBookings.bookingComplete,
            bookingValue: invite.hotelBookings.bookingValue,
          }
        : null,
      events: invite.events.map((event) => ({
        type: event.type,
        ip: event.ip,
        createdAt: event.createdAt.toISOString(),
      })),
    });
  }

  if (action === "stats") {
    const all = await db.query.invites.findMany({
      with: { guests: true, hotelBookings: true },
    });
    const active = all.filter((invite) => !invite.deleted);
    const allGuests = active.flatMap((invite) => invite.guests);
    return NextResponse.json({
      rsvps: active.length,
      guests: allGuests.length,
      attendingFriday: allGuests.filter((guest) => guest.attendingFriday === true)
        .length,
      attendingSaturday: allGuests.filter(
        (guest) => guest.attendingSaturday === true
      ).length,
      attending: allGuests.filter(
        (guest) => guest.attendingFriday || guest.attendingSaturday
      ).length,
      declined: allGuests.filter(
        (guest) =>
          guest.attendingFriday === false && guest.attendingSaturday === false
      ).length,
      pending: allGuests.filter(
        (guest) =>
          guest.attendingFriday === null && guest.attendingSaturday === null
      ).length,
      hotelBooking: active.filter(
        (invite) => invite.hotelBookings?.willBook === true
      ).length,
      hotelComplete: active.filter(
        (invite) => invite.hotelBookings?.bookingComplete === true
      ).length,
    });
  }

  return badRequest("Unknown action. Use ?action=list, ?action=get&id=ID, or ?action=stats");
}

// POST /api/admin
// Body: { action: "create" | "update_rsvp" | "update_guest" | "update_hotel" | "delete", ... }
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const action = body.action as string;
  if (!action) return badRequest("Missing 'action' field in body");

  const db = getDb();

  if (action === "create") {
    const guestNames = body.guestNames as string[] | undefined;
    if (!guestNames || !Array.isArray(guestNames) || guestNames.length === 0) {
      return badRequest(
        "create requires 'guestNames': string[] with at least one name"
      );
    }
    const trimmed = guestNames.map((name) => String(name).trim()).filter(Boolean);
    if (trimmed.length === 0) return badRequest("All guest names are empty");

    const [inserted] = await db
      .insert(invites)
      .values({
        internalKey: `ADMIN-${randomUUID()}`,
        maxGuests: trimmed.length,
        address: (body.address as string) || null,
        notes: (body.notes as string) || null,
      })
      .returning();

    await db.insert(guests).values(
      trimmed.map((name, index) => ({
        inviteId: inserted.id,
        name,
        isPrimary: index === 0,
      }))
    );

    return NextResponse.json({
      success: true,
      id: inserted.id,
      rsvpUrl: "https://makeemilyaragsdale.com/rsvp",
    });
  }

  if (action === "update_rsvp") {
    const id = body.id as string;
    if (!id) return badRequest("update_rsvp requires 'id'");

    const invite = await db.query.invites.findFirst({
      where: eq(invites.id, id),
    });
    if (!invite) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updates: Record<string, unknown> = {};
    if ("maxGuests" in body) updates.maxGuests = Number(body.maxGuests);
    if ("address" in body) updates.address = (body.address as string) || null;
    if ("notes" in body) updates.notes = (body.notes as string) || null;

    if (Object.keys(updates).length === 0) {
      return badRequest(
        "No fields to update. Provide maxGuests, address, or notes"
      );
    }

    await db.update(invites).set(updates).where(eq(invites.id, invite.id));
    return NextResponse.json({ success: true, id: invite.id });
  }

  if (action === "update_guest") {
    const guestId = body.guestId as string;
    const inviteId = body.inviteId as string;
    const guestName = body.guestName as string;

    let guest;
    if (guestId) {
      guest = await db.query.guests.findFirst({
        where: eq(guests.id, guestId),
      });
    } else if (inviteId && guestName) {
      const invite = await db.query.invites.findFirst({
        where: eq(invites.id, inviteId),
        with: { guests: true },
      });
      if (invite) {
        guest = invite.guests.find(
          (candidate) =>
            candidate.name.toLowerCase() === guestName.toLowerCase()
        );
      }
    }

    if (!guest) {
      return badRequest(
        "Guest not found. Provide 'guestId' or both 'inviteId' and 'guestName'"
      );
    }

    const updates: Record<string, unknown> = {};
    if ("name" in body) {
      const name = String(body.name).trim();
      if (!name) return badRequest("Guest name cannot be empty");
      updates.name = name;
    }
    if ("attendingFriday" in body) {
      updates.attendingFriday =
        body.attendingFriday === null ? null : body.attendingFriday === true;
    }
    if ("attendingSaturday" in body) {
      updates.attendingSaturday =
        body.attendingSaturday === null
          ? null
          : body.attendingSaturday === true;
    }
    if ("email" in body) {
      const email = (body.email as string) || null;
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return badRequest(`Invalid email format: ${email}`);
      }
      updates.email = email;
    }
    if ("phone" in body) updates.phone = (body.phone as string) || null;
    if ("mainCoursePreference" in body) {
      updates.mainCoursePreference =
        (body.mainCoursePreference as string) || null;
    }
    if ("dietaryRestrictions" in body) {
      updates.dietaryRestrictions =
        (body.dietaryRestrictions as string) || null;
    }
    if ("plusOneName" in body) {
      updates.plusOneName = (body.plusOneName as string) || null;
    }

    if (Object.keys(updates).length === 0) {
      return badRequest(
        "No fields to update. Provide name, attendingFriday, attendingSaturday, email, phone, mainCoursePreference, dietaryRestrictions, or plusOneName"
      );
    }

    updates.updatedAt = new Date();
    await db.update(guests).set(updates).where(eq(guests.id, guest.id));
    return NextResponse.json({ success: true, guestId: guest.id });
  }

  if (action === "update_hotel") {
    const id = body.id as string;
    if (!id) return badRequest("update_hotel requires 'id'");

    const invite = await db.query.invites.findFirst({
      where: eq(invites.id, id),
    });
    if (!invite) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updates: Record<string, unknown> = {};
    if ("willBook" in body) {
      updates.willBook = body.willBook === null ? null : body.willBook === true;
    }
    if ("bookingComplete" in body) {
      updates.bookingComplete = body.bookingComplete === true;
    }
    if ("bookingValue" in body) {
      updates.bookingValue = (body.bookingValue as string) || null;
    }

    if (Object.keys(updates).length === 0) {
      return badRequest(
        "No fields to update. Provide willBook, bookingComplete, or bookingValue"
      );
    }

    const existing = await db.query.hotelBookings.findFirst({
      where: eq(hotelBookings.inviteId, invite.id),
    });

    if (existing) {
      await db
        .update(hotelBookings)
        .set(updates)
        .where(eq(hotelBookings.inviteId, invite.id));
    } else {
      await db.insert(hotelBookings).values({
        inviteId: invite.id,
        willBook: (updates.willBook as boolean | null) ?? null,
        bookingComplete: (updates.bookingComplete as boolean) ?? false,
        bookingValue: (updates.bookingValue as string) ?? null,
      });
    }
    return NextResponse.json({ success: true, id: invite.id });
  }

  if (action === "delete") {
    const id = body.id as string;
    if (!id) return badRequest("delete requires 'id'");

    const invite = await db.query.invites.findFirst({
      where: eq(invites.id, id),
    });
    if (!invite) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (body.confirm !== true) {
      return badRequest(
        'This will soft-delete the RSVP and hide it from the admin. Pass "confirm": true to proceed.'
      );
    }

    await db
      .update(invites)
      .set({ deleted: true })
      .where(eq(invites.id, invite.id));
    return NextResponse.json({ success: true, id: invite.id, deleted: true });
  }

  return badRequest(
    "Unknown action. Use: create, update_rsvp, update_guest, update_hotel, delete"
  );
}
