import {
  pgTable,
  text,
  boolean,
  integer,
  numeric,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const invites = pgTable("invites", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(),
  hotelEligible: boolean("hotel_eligible").notNull().default(false),
  maxGuests: integer("max_guests").notNull().default(2),
  notes: text("notes"),
  address: text("address"),
  deleted: boolean("deleted").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const guests = pgTable("guests", {
  id: uuid("id").defaultRandom().primaryKey(),
  inviteId: uuid("invite_id")
    .notNull()
    .references(() => invites.id),
  name: text("name").notNull(),
  isPrimary: boolean("is_primary").notNull().default(true),
  email: text("email"),
  phone: text("phone"),
  attendingFriday: boolean("attending_friday"),
  attendingSaturday: boolean("attending_saturday"),
  dietaryRestrictions: text("dietary_restrictions"),
  plusOneName: text("plus_one_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const inviteEvents = pgTable("invite_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  inviteId: uuid("invite_id")
    .notNull()
    .references(() => invites.id),
  type: text("type").notNull(), // "view", "belmond_click"
  ip: text("ip"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const inviteRelations = relations(invites, ({ many, one }) => ({
  guests: many(guests),
  hotelBookings: one(hotelBookings),
  events: many(inviteEvents),
}));

export const guestRelations = relations(guests, ({ one }) => ({
  invite: one(invites, {
    fields: [guests.inviteId],
    references: [invites.id],
  }),
}));

export const inviteEventRelations = relations(inviteEvents, ({ one }) => ({
  invite: one(invites, {
    fields: [inviteEvents.inviteId],
    references: [invites.id],
  }),
}));

export const hotelBookings = pgTable("hotel_bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  inviteId: uuid("invite_id")
    .notNull()
    .unique()
    .references(() => invites.id),
  willBook: boolean("will_book"),
  acknowledgedPolicy: boolean("acknowledged_policy").notNull().default(false),
  bookingComplete: boolean("booking_complete").notNull().default(false),
  bookingValue: numeric("booking_value"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const hotelBookingRelations = relations(hotelBookings, ({ one }) => ({
  invite: one(invites, {
    fields: [hotelBookings.inviteId],
    references: [invites.id],
  }),
}));
