import Link from "next/link";
import { getDb } from "@/db";
import { invites } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Separator } from "@/components/ui/separator";
import { isAdminAuthenticated } from "../../actions";
import { redirect } from "next/navigation";
import { EditForm } from "./edit-form";
import { EventLog } from "./event-log";
import { DeleteButton } from "./delete-button";

export const dynamic = "force-dynamic";

export default async function AdminRsvpDetail({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin");

  const { code } = await params;
  const db = getDb();

  const invite = await db.query.invites.findFirst({
    where: eq(invites.code, code.toUpperCase()),
    with: {
      guests: true,
      hotelBookings: true,
      events: {
        orderBy: (events, { desc }) => [desc(events.createdAt)],
      },
    },
  });

  if (!invite) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        <p className="text-muted-foreground">
          Invite <span className="font-mono">{code.toUpperCase()}</span> not
          found.
        </p>
      </main>
    );
  }

  const data = {
    id: invite.id,
    code: invite.code,
    hotelEligible: invite.hotelEligible,
    maxGuests: invite.maxGuests,
    notes: invite.notes,
    address: invite.address,
    philMode: invite.philMode,
    guests: invite.guests.map((g) => ({
      id: g.id,
      name: g.name,
      attendingFriday: g.attendingFriday,
      attendingSaturday: g.attendingSaturday,
      email: g.email,
      phone: g.phone,
      dietaryRestrictions: g.dietaryRestrictions,
      plusOneName: g.plusOneName,
    })),
    hotelBooking: invite.hotelBookings
      ? {
          willBook: invite.hotelBookings.willBook,
          acknowledgedPolicy: invite.hotelBookings.acknowledgedPolicy,
          bookingComplete: invite.hotelBookings.bookingComplete,
          bookingValue: invite.hotelBookings.bookingValue,
        }
      : null,
  };

  const events = invite.events.map((e) => ({
    id: e.id,
    type: e.type,
    ip: e.ip,
    userAgent: e.userAgent,
    createdAt: e.createdAt.toISOString(),
  }));

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-16">
      <div className="max-w-2xl w-full space-y-8">
        <div className="flex items-baseline justify-between">
          <div className="space-y-1">
            <Link
              href="/admin"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              &larr; Back
            </Link>
            <h1 className="font-serif text-3xl font-light">
              {invite.code}
            </h1>
          </div>
          <a
            href={`/rsvp/${invite.code}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
          >
            View RSVP page
          </a>
        </div>

        <Separator />

        <EditForm invite={data} />

        <Separator />

        <EventLog events={events} />

        <Separator />

        <DeleteButton inviteId={invite.id} code={invite.code} />
      </div>
    </main>
  );
}
