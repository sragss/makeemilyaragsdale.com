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
  mainCoursePreference: z.string().nullable(),
  dietaryRestrictions: z.string().nullable(),
  plusOneName: z.string().nullable(),
});

export const HotelBookingSchema = z.object({
  willBook: z.boolean().nullable(),
  bookingComplete: z.boolean(),
  bookingValue: z.string().nullable(),
});

export const EventSchema = z.object({
  type: z.enum(["view", "belmond_click", "address_view", "address_submit"]),
  ip: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export const RsvpSchema = z.object({
  id: z.string().uuid(),
  maxGuests: z.number().int(),
  address: z.string().nullable(),
  notes: z.string().nullable(),
  guests: z.array(GuestSchema),
  hotel: HotelBookingSchema.nullable(),
});

export const RsvpWithEventsSchema = RsvpSchema.extend({
  events: z.array(EventSchema),
});

// ── Request schemas ──

export const CreateRsvpRequest = z.object({
  action: z.literal("create"),
  guestNames: z.array(z.string().min(1)).min(1),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export const UpdateRsvpRequest = z.object({
  action: z.literal("update_rsvp"),
  id: z.string().uuid(),
  maxGuests: z.number().int().positive().optional(),
  address: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const UpdateGuestRequest = z.object({
  action: z.literal("update_guest"),
  guestId: z.string().uuid().optional(),
  inviteId: z.string().uuid().optional(),
  guestName: z.string().optional(),
  name: z.string().optional(),
  attendingFriday: z.boolean().nullable().optional(),
  attendingSaturday: z.boolean().nullable().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  mainCoursePreference: z.string().nullable().optional(),
  dietaryRestrictions: z.string().nullable().optional(),
  plusOneName: z.string().nullable().optional(),
});

export const UpdateHotelRequest = z.object({
  action: z.literal("update_hotel"),
  id: z.string().uuid(),
  willBook: z.boolean().nullable().optional(),
  bookingComplete: z.boolean().optional(),
  bookingValue: z.string().nullable().optional(),
});

export const DeleteRsvpRequest = z.object({
  action: z.literal("delete"),
  id: z.string().uuid(),
  confirm: z.literal(true),
});

export const AdminPostRequest = z.discriminatedUnion("action", [
  CreateRsvpRequest,
  UpdateRsvpRequest,
  UpdateGuestRequest,
  UpdateHotelRequest,
  DeleteRsvpRequest,
]);

// ── Response schemas ──

export const ListResponseSchema = z.object({
  rsvps: z.array(RsvpSchema),
  count: z.number().int(),
});

export const StatsResponseSchema = z.object({
  rsvps: z.number().int(),
  guests: z.number().int(),
  attending: z.number().int(),
  attendingFriday: z.number().int(),
  attendingSaturday: z.number().int(),
  declined: z.number().int(),
  pending: z.number().int(),
  hotelBooking: z.number().int(),
  hotelComplete: z.number().int(),
});

export const CreateResponseSchema = z.object({
  success: z.literal(true),
  rsvpUrl: z.string().url(),
  id: z.string().uuid(),
});

export const SuccessResponseSchema = z.object({
  success: z.literal(true),
  id: z.string().uuid().optional(),
  guestId: z.string().uuid().optional(),
  deleted: z.boolean().optional(),
});

export const ErrorResponseSchema = z.object({
  error: z.string(),
});
