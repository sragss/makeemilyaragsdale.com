"use server";

import { getDb } from "@/db";
import { addressSubmissions } from "@/db/schema";

export interface AddressSubmissionInput {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trimAll(input: AddressSubmissionInput) {
  return {
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    addressLine1: input.addressLine1.trim(),
    addressLine2: input.addressLine2.trim(),
    city: input.city.trim(),
    region: input.region.trim(),
    postalCode: input.postalCode.trim(),
    country: input.country.trim(),
  };
}

export async function submitAddressEntry(input: AddressSubmissionInput) {
  const data = trimAll(input);

  if (!data.name) throw new Error("Name is required");
  if (!data.email || !EMAIL_REGEX.test(data.email)) {
    throw new Error("A valid email is required");
  }
  if (!data.phone) throw new Error("Phone is required");
  if (!data.addressLine1) throw new Error("Street address is required");
  if (!data.city) throw new Error("City is required");
  if (!data.region) throw new Error("State / region is required");
  if (!data.postalCode) throw new Error("Postal code is required");
  if (!data.country) throw new Error("Country is required");

  const db = getDb();
  await db.insert(addressSubmissions).values({
    name: data.name,
    email: data.email,
    phone: data.phone,
    addressLine1: data.addressLine1,
    addressLine2: data.addressLine2 || null,
    city: data.city,
    region: data.region,
    postalCode: data.postalCode,
    country: data.country,
  });

  return { success: true };
}
