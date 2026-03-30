"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "admin_auth";

export async function adminLogin(password: string) {
  console.log("Login attempt:", JSON.stringify({
    input: password,
    envSet: !!process.env.ADMIN_PASSWORD,
    envLength: process.env.ADMIN_PASSWORD?.length,
    match: password === process.env.ADMIN_PASSWORD
  }));
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Wrong password" };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/admin",
  });

  return { success: true };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === "authenticated";
}
