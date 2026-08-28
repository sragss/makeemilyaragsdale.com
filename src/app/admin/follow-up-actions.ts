"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { followUps } from "@/db/schema";

export async function addFollowUp(name: string, note: string) {
  const trimmed = name.trim();
  if (!trimmed) return { success: false, error: "Name is required" };

  const db = getDb();
  await db.insert(followUps).values({
    name: trimmed,
    note: note.trim() || null,
  });
  revalidatePath("/admin");
  return { success: true };
}

export async function setFollowUpResolved(id: string, resolved: boolean) {
  const db = getDb();
  await db.update(followUps).set({ resolved }).where(eq(followUps.id, id));
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteFollowUp(id: string) {
  const db = getDb();
  await db.delete(followUps).where(eq(followUps.id, id));
  revalidatePath("/admin");
  return { success: true };
}
