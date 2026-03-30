import { NextResponse } from "next/server";

const spec = {
  openapi: "3.1.0",
  info: {
    title: "MakeEmilyARagsdale Admin API",
    version: "1.0.0",
    description:
      "Manage wedding invites, guests, hotel bookings, and track RSVP activity. Auth: Bearer token using ADMIN_PASSWORD.",
  },
  servers: [
    { url: "https://makeemilyaragsdale.com", description: "Production" },
    { url: "http://localhost:3002", description: "Local dev" },
  ],
  security: [{ bearerAuth: [] }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        description: "Use the ADMIN_PASSWORD as the bearer token",
      },
    },
    schemas: {
      Guest: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          isPrimary: { type: "boolean" },
          attendingFriday: { type: ["boolean", "null"], description: "Attending Friday pool party (Feb 26)" },
          attendingSaturday: { type: ["boolean", "null"], description: "Attending Saturday wedding (Feb 27)" },
          email: { type: ["string", "null"] },
          phone: { type: ["string", "null"] },
          dietaryRestrictions: { type: ["string", "null"] },
          plusOneName: { type: ["string", "null"] },
        },
      },
      HotelBooking: {
        type: "object",
        properties: {
          willBook: { type: ["boolean", "null"] },
          bookingComplete: { type: "boolean" },
          bookingValue: { type: ["string", "null"] },
        },
      },
      Event: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["view", "belmond_click"] },
          ip: { type: ["string", "null"] },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Invite: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          code: { type: "string", example: "EBR-TOVIK" },
          hotelEligible: { type: "boolean" },
          maxGuests: { type: "integer" },
          address: { type: ["string", "null"] },
          notes: { type: ["string", "null"] },
          guests: { type: "array", items: { $ref: "#/components/schemas/Guest" } },
          hotel: { oneOf: [{ $ref: "#/components/schemas/HotelBooking" }, { type: "null" }] },
        },
      },
      InviteWithEvents: {
        allOf: [
          { $ref: "#/components/schemas/Invite" },
          {
            type: "object",
            properties: {
              events: { type: "array", items: { $ref: "#/components/schemas/Event" } },
            },
          },
        ],
      },
      Error: {
        type: "object",
        properties: { error: { type: "string" } },
        required: ["error"],
      },
    },
  },
  paths: {
    "/api/admin": {
      get: {
        summary: "Query invites and stats",
        parameters: [
          {
            name: "action",
            in: "query",
            required: true,
            schema: { type: "string", enum: ["list", "get", "stats"] },
            description: "list: all invites. get: single invite (requires code). stats: aggregate counts.",
          },
          {
            name: "code",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Invite code (required for action=get)",
          },
        ],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  oneOf: [
                    {
                      type: "object",
                      properties: {
                        invites: { type: "array", items: { $ref: "#/components/schemas/Invite" } },
                        count: { type: "integer" },
                      },
                      description: "action=list response",
                    },
                    { $ref: "#/components/schemas/InviteWithEvents", description: "action=get response" },
                    {
                      type: "object",
                      properties: {
                        invites: { type: "integer" },
                        guests: { type: "integer" },
                        attending: { type: "integer", description: "Guests attending either event" },
                        attendingFriday: { type: "integer" },
                        attendingSaturday: { type: "integer" },
                        declined: { type: "integer" },
                        pending: { type: "integer" },
                        hotelEligible: { type: "integer" },
                        hotelBooking: { type: "integer" },
                        hotelComplete: { type: "integer" },
                      },
                      description: "action=stats response",
                    },
                  ],
                },
              },
            },
          },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      post: {
        summary: "Create, update, or delete invites/guests/hotel bookings",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                oneOf: [
                  {
                    type: "object",
                    required: ["action", "guestNames"],
                    properties: {
                      action: { type: "string", const: "create" },
                      guestNames: { type: "array", items: { type: "string" }, minItems: 1 },
                      hotelEligible: { type: "boolean", default: false },
                      address: { type: "string" },
                      notes: { type: "string" },
                    },
                    description: "Create a new invite with auto-generated code",
                  },
                  {
                    type: "object",
                    required: ["action", "code"],
                    properties: {
                      action: { type: "string", const: "update_invite" },
                      code: { type: "string" },
                      hotelEligible: { type: "boolean" },
                      maxGuests: { type: "integer" },
                      address: { type: ["string", "null"] },
                      notes: { type: ["string", "null"] },
                    },
                    description: "Update invite settings",
                  },
                  {
                    type: "object",
                    required: ["action"],
                    properties: {
                      action: { type: "string", const: "update_guest" },
                      guestId: { type: "string", format: "uuid" },
                      code: { type: "string" },
                      guestName: { type: "string" },
                      name: { type: "string" },
                      attendingFriday: { type: ["boolean", "null"], description: "Attending Friday pool party" },
                      attendingSaturday: { type: ["boolean", "null"], description: "Attending Saturday wedding" },
                      email: { type: ["string", "null"] },
                      phone: { type: ["string", "null"] },
                      dietaryRestrictions: { type: ["string", "null"] },
                      plusOneName: { type: ["string", "null"] },
                    },
                    description: "Update a guest. Identify by guestId OR code+guestName.",
                  },
                  {
                    type: "object",
                    required: ["action", "code"],
                    properties: {
                      action: { type: "string", const: "update_hotel" },
                      code: { type: "string" },
                      willBook: { type: ["boolean", "null"] },
                      bookingComplete: { type: "boolean" },
                      bookingValue: { type: ["string", "null"] },
                    },
                    description: "Update hotel booking. Invite must be hotel-eligible.",
                  },
                  {
                    type: "object",
                    required: ["action", "code", "confirm"],
                    properties: {
                      action: { type: "string", const: "delete" },
                      code: { type: "string" },
                      confirm: { type: "boolean", const: true },
                    },
                    description: "Soft-delete an invite. Requires confirm:true.",
                  },
                ],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", const: true },
                    code: { type: "string" },
                    url: { type: "string" },
                    id: { type: "string", format: "uuid" },
                    guestId: { type: "string", format: "uuid" },
                    deleted: { type: "boolean" },
                  },
                },
              },
            },
          },
          "400": { description: "Bad request", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(spec);
}
