import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { invites, guests, hotelBookings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateCode } from "@/lib/codes";

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

// GET /api/admin?action=list|get&code=XXX
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") ?? "list";
  const db = getDb();

  if (action === "list") {
    const all = await db.query.invites.findMany({
      with: { guests: true, hotelBookings: true },
      orderBy: (invites, { asc }) => [asc(invites.code)],
    });
    const result = all
      .filter((i) => !i.deleted)
      .map((inv) => ({
        id: inv.id,
        code: inv.code,
        hotelEligible: inv.hotelEligible,
        maxGuests: inv.maxGuests,
        address: inv.address,
        notes: inv.notes,
        philMode: inv.philMode,
        guests: inv.guests.map((g) => ({
          id: g.id,
          name: g.name,
          isPrimary: g.isPrimary,
          attendingFriday: g.attendingFriday,
          attendingSaturday: g.attendingSaturday,
          email: g.email,
          phone: g.phone,
          dietaryRestrictions: g.dietaryRestrictions,
          plusOneName: g.plusOneName,
        })),
        hotel: inv.hotelBookings
          ? {
              willBook: inv.hotelBookings.willBook,
              bookingComplete: inv.hotelBookings.bookingComplete,
              bookingValue: inv.hotelBookings.bookingValue,
            }
          : null,
      }));
    return NextResponse.json({ invites: result, count: result.length });
  }

  if (action === "get") {
    const code = searchParams.get("code");
    if (!code) return badRequest("Missing ?code= parameter");

    const invite = await db.query.invites.findFirst({
      where: eq(invites.code, code.toUpperCase()),
      with: {
        guests: true,
        hotelBookings: true,
        events: { orderBy: (events, { desc }) => [desc(events.createdAt)] },
      },
    });
    if (!invite || invite.deleted)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      id: invite.id,
      code: invite.code,
      hotelEligible: invite.hotelEligible,
      maxGuests: invite.maxGuests,
      address: invite.address,
      notes: invite.notes,
      philMode: invite.philMode,
      guests: invite.guests.map((g) => ({
        id: g.id,
        name: g.name,
        isPrimary: g.isPrimary,
        attendingFriday: g.attendingFriday,
        attendingSaturday: g.attendingSaturday,
        email: g.email,
        phone: g.phone,
        dietaryRestrictions: g.dietaryRestrictions,
        plusOneName: g.plusOneName,
      })),
      hotel: invite.hotelBookings
        ? {
            willBook: invite.hotelBookings.willBook,
            bookingComplete: invite.hotelBookings.bookingComplete,
            bookingValue: invite.hotelBookings.bookingValue,
          }
        : null,
      events: invite.events.map((e) => ({
        type: e.type,
        ip: e.ip,
        createdAt: e.createdAt.toISOString(),
      })),
    });
  }

  if (action === "stats") {
    const all = await db.query.invites.findMany({
      with: { guests: true, hotelBookings: true },
    });
    const active = all.filter((i) => !i.deleted);
    const allGuests = active.flatMap((i) => i.guests);
    return NextResponse.json({
      invites: active.length,
      guests: allGuests.length,
      attendingFriday: allGuests.filter((g) => g.attendingFriday === true).length,
      attendingSaturday: allGuests.filter((g) => g.attendingSaturday === true).length,
      attending: allGuests.filter((g) => g.attendingFriday || g.attendingSaturday).length,
      declined: allGuests.filter((g) => g.attendingFriday === false && g.attendingSaturday === false).length,
      pending: allGuests.filter((g) => g.attendingFriday === null && g.attendingSaturday === null).length,
      hotelEligible: active.filter((i) => i.hotelEligible).length,
      hotelBooking: active.filter((i) => i.hotelBookings?.willBook === true)
        .length,
      hotelComplete: active.filter(
        (i) => i.hotelBookings?.bookingComplete === true
      ).length,
    });
  }

  return badRequest(
    'Unknown action. Use ?action=list, ?action=get&code=XXX, or ?action=stats'
  );
}

// POST /api/admin
// Body: { action: "create" | "update_invite" | "update_guest" | "update_hotel" | "delete", ... }
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

  // ── CREATE ──
  if (action === "create") {
    const guestNames = body.guestNames as string[] | undefined;
    if (!guestNames || !Array.isArray(guestNames) || guestNames.length === 0) {
      return badRequest(
        "create requires 'guestNames': string[] with at least one name"
      );
    }
    const trimmed = guestNames.map((n) => String(n).trim()).filter(Boolean);
    if (trimmed.length === 0)
      return badRequest("All guest names are empty");

    const code = generateCode();
    const [inserted] = await db
      .insert(invites)
      .values({
        code,
        hotelEligible: body.hotelEligible === true,
        maxGuests: trimmed.length,
        address: (body.address as string) || null,
        notes: (body.notes as string) || null,
        philMode: body.philMode === true,
      })
      .returning();

    await db.insert(guests).values(
      trimmed.map((name, i) => ({
        inviteId: inserted.id,
        name,
        isPrimary: i === 0,
      }))
    );

    return NextResponse.json({
      success: true,
      code,
      url: `https://makeemilyaragsdale.com/address/${code}`,
      addressUrl: `https://makeemilyaragsdale.com/address/${code}`,
      rsvpUrl: `https://makeemilyaragsdale.com/rsvp/${code}`,
      id: inserted.id,
    });
  }

  // ── UPDATE INVITE ──
  if (action === "update_invite") {
    const code = body.code as string;
    if (!code) return badRequest("update_invite requires 'code'");

    const invite = await db.query.invites.findFirst({
      where: eq(invites.code, code.toUpperCase()),
    });
    if (!invite) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updates: Record<string, unknown> = {};
    if ("hotelEligible" in body) updates.hotelEligible = body.hotelEligible === true;
    if ("maxGuests" in body) updates.maxGuests = Number(body.maxGuests);
    if ("address" in body) updates.address = (body.address as string) || null;
    if ("notes" in body) updates.notes = (body.notes as string) || null;
    if ("philMode" in body) updates.philMode = body.philMode === true;

    if (Object.keys(updates).length === 0)
      return badRequest(
        "No fields to update. Provide hotelEligible, maxGuests, address, or notes"
      );

    await db.update(invites).set(updates).where(eq(invites.id, invite.id));
    return NextResponse.json({ success: true, code: invite.code });
  }

  // ── UPDATE GUEST ──
  if (action === "update_guest") {
    const guestId = body.guestId as string;
    const code = body.code as string;
    const guestName = body.guestName as string;

    // Look up by guestId OR by code + guestName
    let guest;
    if (guestId) {
      guest = await db.query.guests.findFirst({
        where: eq(guests.id, guestId),
      });
    } else if (code && guestName) {
      const invite = await db.query.invites.findFirst({
        where: eq(invites.code, code.toUpperCase()),
        with: { guests: true },
      });
      if (invite) {
        guest = invite.guests.find(
          (g) => g.name.toLowerCase() === guestName.toLowerCase()
        );
      }
    }

    if (!guest)
      return badRequest(
        "Guest not found. Provide 'guestId' or both 'code' and 'guestName'"
      );

    const updates: Record<string, unknown> = {};
    if ("name" in body) {
      const name = String(body.name).trim();
      if (!name) return badRequest("Guest name cannot be empty");
      updates.name = name;
    }
    if ("attendingFriday" in body)
      updates.attendingFriday = body.attendingFriday === null ? null : body.attendingFriday === true;
    if ("attendingSaturday" in body)
      updates.attendingSaturday = body.attendingSaturday === null ? null : body.attendingSaturday === true;
    if ("email" in body) {
      const email = (body.email as string) || null;
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return badRequest(`Invalid email format: ${email}`);
      updates.email = email;
    }
    if ("phone" in body) updates.phone = (body.phone as string) || null;
    if ("dietaryRestrictions" in body)
      updates.dietaryRestrictions =
        (body.dietaryRestrictions as string) || null;
    if ("plusOneName" in body)
      updates.plusOneName = (body.plusOneName as string) || null;

    if (Object.keys(updates).length === 0)
      return badRequest(
        "No fields to update. Provide name, attendingFriday, attendingSaturday, email, phone, dietaryRestrictions, or plusOneName"
      );

    updates.updatedAt = new Date();
    await db.update(guests).set(updates).where(eq(guests.id, guest.id));
    return NextResponse.json({ success: true, guestId: guest.id });
  }

  // ── UPDATE HOTEL ──
  if (action === "update_hotel") {
    const code = body.code as string;
    if (!code) return badRequest("update_hotel requires 'code'");

    const invite = await db.query.invites.findFirst({
      where: eq(invites.code, code.toUpperCase()),
    });
    if (!invite) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!invite.hotelEligible)
      return badRequest(`Invite ${invite.code} is not hotel-eligible`);

    const updates: Record<string, unknown> = {};
    if ("willBook" in body)
      updates.willBook = body.willBook === null ? null : body.willBook === true;
    if ("bookingComplete" in body)
      updates.bookingComplete = body.bookingComplete === true;
    if ("bookingValue" in body)
      updates.bookingValue = (body.bookingValue as string) || null;

    if (Object.keys(updates).length === 0)
      return badRequest(
        "No fields to update. Provide willBook, bookingComplete, or bookingValue"
      );

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
        willBook: (updates.willBook as boolean) ?? null,
        bookingComplete: (updates.bookingComplete as boolean) ?? false,
        bookingValue: (updates.bookingValue as string) ?? null,
      });
    }
    return NextResponse.json({ success: true, code: invite.code });
  }

  // ── DELETE (soft) ──
  if (action === "delete") {
    const code = body.code as string;
    if (!code) return badRequest("delete requires 'code'");

    const invite = await db.query.invites.findFirst({
      where: eq(invites.code, code.toUpperCase()),
    });
    if (!invite) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (body.confirm !== true)
      return badRequest(
        `This will soft-delete invite ${invite.code} and hide it from the admin. Pass "confirm": true to proceed.`
      );

    await db
      .update(invites)
      .set({ deleted: true })
      .where(eq(invites.id, invite.id));
    return NextResponse.json({ success: true, code: invite.code, deleted: true });
  }

  return badRequest(
    "Unknown action. Use: create, update_invite, update_guest, update_hotel, delete"
  );
}
