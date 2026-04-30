"use server";

import { getDb } from "@/db";
import { invites } from "@/db/schema";
import { eq } from "drizzle-orm";
import { trackEvent } from "@/app/rsvp/track";

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

export async function lookupAddressInvite(code: string) {
  const db = getDb();
  const normalized = normalizeCode(code);
  if (!normalized) return null;

  const invite = await db.query.invites.findFirst({
    where: eq(invites.code, normalized),
    with: {
      guests: true,
    },
  });

  if (!invite || invite.deleted) return null;

  await trackEvent(invite.id, "address_view");

  return {
    code: invite.code,
    address: invite.address,
    guestNames: invite.guests.map((guest) => guest.name),
  };
}

export type AddressInviteData = NonNullable<
  Awaited<ReturnType<typeof lookupAddressInvite>>
>;

export async function submitAddress(data: { code: string; address: string }) {
  const db = getDb();
  const code = normalizeCode(data.code);
  const address = data.address.trim();

  if (!code) {
    throw new Error("Missing invite code");
  }

  if (!address) {
    throw new Error("Mailing address is required");
  }

  if (address.length > 800) {
    throw new Error("Mailing address is too long");
  }

  const invite = await db.query.invites.findFirst({
    where: eq(invites.code, code),
  });

  if (!invite || invite.deleted) {
    throw new Error("Invite not found");
  }

  await db
    .update(invites)
    .set({
      address,
    })
    .where(eq(invites.id, invite.id));

  await trackEvent(invite.id, "address_submit");

  return { success: true };
}
