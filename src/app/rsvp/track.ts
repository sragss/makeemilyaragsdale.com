"use server";

import { getDb } from "@/db";
import { inviteEvents, invites } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function trackEvent(inviteId: string, type: string) {
  const db = getDb();
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    null;
  const userAgent = hdrs.get("user-agent") || null;

  await db.insert(inviteEvents).values({
    inviteId,
    type,
    ip,
    userAgent,
  });
}

export async function trackView(code: string) {
  const db = getDb();
  const invite = await db.query.invites.findFirst({
    where: eq(invites.code, code.trim().toUpperCase()),
  });
  if (!invite) return;
  await trackEvent(invite.id, "view");
}
