"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { addressSubmissions } from "@/db/schema";

export async function deleteAddressSubmission(id: string) {
  const db = getDb();
  await db.delete(addressSubmissions).where(eq(addressSubmissions.id, id));
  revalidatePath("/admin/addresses");
  revalidatePath("/admin");
  return { success: true };
}
