import { z } from "zod";

// ── Shared types ──

export const GuestSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  isPrimary: z.boolean(),
  attendingFriday: z.boolean().nullable(),
  attendingSaturday: z.boolean().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  dietaryRestrictions: z.string().nullable(),
  plusOneName: z.string().nullable(),
});

export const HotelBookingSchema = z.object({
  willBook: z.boolean().nullable(),
  bookingComplete: z.boolean(),
  bookingValue: z.string().nullable(),
});

export const EventSchema = z.object({
  type: z.enum(["view", "belmond_click"]),
  ip: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export const InviteSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  hotelEligible: z.boolean(),
  maxGuests: z.number().int(),
  address: z.string().nullable(),
  notes: z.string().nullable(),
  guests: z.array(GuestSchema),
  hotel: HotelBookingSchema.nullable(),
});

export const InviteWithEventsSchema = InviteSchema.extend({
  events: z.array(EventSchema),
});

// ── Request schemas ──

export const CreateInviteRequest = z.object({
  action: z.literal("create"),
  guestNames: z.array(z.string().min(1)).min(1),
  hotelEligible: z.boolean().optional().default(false),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export const UpdateInviteRequest = z.object({
  action: z.literal("update_invite"),
  code: z.string().min(1),
  hotelEligible: z.boolean().optional(),
  maxGuests: z.number().int().positive().optional(),
  address: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const UpdateGuestRequest = z.object({
  action: z.literal("update_guest"),
  guestId: z.string().uuid().optional(),
  code: z.string().optional(),
  guestName: z.string().optional(),
  name: z.string().optional(),
  attendingFriday: z.boolean().nullable().optional(),
  attendingSaturday: z.boolean().nullable().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  dietaryRestrictions: z.string().nullable().optional(),
  plusOneName: z.string().nullable().optional(),
});

export const UpdateHotelRequest = z.object({
  action: z.literal("update_hotel"),
  code: z.string().min(1),
  willBook: z.boolean().nullable().optional(),
  bookingComplete: z.boolean().optional(),
  bookingValue: z.string().nullable().optional(),
});

export const DeleteInviteRequest = z.object({
  action: z.literal("delete"),
  code: z.string().min(1),
  confirm: z.literal(true),
});

export const AdminPostRequest = z.discriminatedUnion("action", [
  CreateInviteRequest,
  UpdateInviteRequest,
  UpdateGuestRequest,
  UpdateHotelRequest,
  DeleteInviteRequest,
]);

// ── Response schemas ──

export const ListResponseSchema = z.object({
  invites: z.array(InviteSchema),
  count: z.number().int(),
});

export const StatsResponseSchema = z.object({
  invites: z.number().int(),
  guests: z.number().int(),
  attending: z.number().int(),
  attendingFriday: z.number().int(),
  attendingSaturday: z.number().int(),
  declined: z.number().int(),
  pending: z.number().int(),
  hotelEligible: z.number().int(),
  hotelBooking: z.number().int(),
  hotelComplete: z.number().int(),
});

export const CreateResponseSchema = z.object({
  success: z.literal(true),
  code: z.string(),
  url: z.string().url(),
  id: z.string().uuid(),
});

export const SuccessResponseSchema = z.object({
  success: z.literal(true),
  code: z.string().optional(),
  guestId: z.string().uuid().optional(),
  deleted: z.boolean().optional(),
});

export const ErrorResponseSchema = z.object({
  error: z.string(),
});
