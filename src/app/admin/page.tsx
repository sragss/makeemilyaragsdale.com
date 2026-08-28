import Link from "next/link";
import { getDb } from "@/db";
import { addressSubmissions, followUps } from "@/db/schema";
import { asc, desc } from "drizzle-orm";
import { Separator } from "@/components/ui/separator";
import {
  expandHousehold,
  guestNamesToPeople,
  householdHasRsvped,
} from "@/lib/guest-matching";
import { formatDisplayName } from "@/lib/format-name";
import { isAdminAuthenticated } from "./actions";
import { LoginForm } from "./login-form";
import { CreateRsvpForm } from "./create-rsvp";
import { AdminViews } from "./admin-views";
import { AgentPrompt } from "./agent-prompt";

function formatAddress(row: {
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}) {
  const cityLine = [
    row.city,
    [row.region, row.postalCode].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");
  return [row.addressLine1, row.addressLine2, cityLine, row.country]
    .filter(Boolean)
    .join("\n");
}

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        <div className="space-y-6 text-center">
          <h1 className="font-serif text-3xl font-light">Admin</h1>
          <LoginForm />
        </div>
      </main>
    );
  }

  const db = getDb();

  const allInvitesRaw = await db.query.invites.findMany({
    with: {
      guests: true,
      hotelBookings: true,
    },
    orderBy: (invites, { desc }) => [desc(invites.createdAt)],
  });

  const allInvites = allInvitesRaw.filter((i) => !i.deleted);

  const addresses = await db
    .select()
    .from(addressSubmissions)
    .orderBy(desc(addressSubmissions.createdAt));
  const addressCount = addresses.length;

  const followUpRows = await db
    .select()
    .from(followUps)
    .orderBy(asc(followUps.resolved), desc(followUps.createdAt));

  // Households that gave a mailing address but have no RSVP yet.
  const rsvpedPeople = guestNamesToPeople(
    allInvites.flatMap((i) => i.guests.map((g) => g.name))
  );
  const awaiting = addresses
    .filter((row) => !householdHasRsvped(row.name, rsvpedPeople))
    .map((row) => ({
      id: row.id,
      name: formatDisplayName(row.name),
      // A household line can cover several people ("Phil, Faith & Wells
      // Budding"), so the awaiting count is people, not rows.
      people: Math.max(expandHousehold(row.name).length, 1),
      status: (row.status as "unknown" | "yes" | "likely_no" | "no") ?? "unknown",
      email: row.email,
      phone: row.phone,
      address: formatAddress(row),
      submittedAt: row.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }));

  const totalGuests = allInvites.flatMap((i) => i.guests);
  const declined = totalGuests.filter(
    (g) => g.attendingFriday === false && g.attendingSaturday === false
  );
  const pending = totalGuests.filter(
    (g) => g.attendingFriday === null && g.attendingSaturday === null
  );
  const hotelYes = allInvites.filter(
    (i) => i.hotelBookings?.willBook === true
  );

  // Where we stand on numbers: everyone who has said yes, plus the households
  // flagged as expected who have not replied yet.
  const attendingCount = totalGuests.filter(
    (g) => g.attendingFriday || g.attendingSaturday
  ).length;
  const expectedCount = awaiting
    .filter((row) => row.status === "yes")
    .reduce((n, row) => n + row.people, 0);
  const projectedCount = attendingCount + expectedCount;

  const tableData = allInvites.map((inv) => ({
    id: inv.id,
    guests: inv.guests.map((g) => ({
      id: g.id,
      name: formatDisplayName(g.name),
      attendingFriday: g.attendingFriday,
      attendingSaturday: g.attendingSaturday,
      email: g.email,
      phone: g.phone,
      mainCoursePreference: g.mainCoursePreference,
      dietaryRestrictions: g.dietaryRestrictions,
      plusOneName: g.plusOneName ? formatDisplayName(g.plusOneName) : null,
    })),
    hotelBooking: inv.hotelBookings
      ? {
          willBook: inv.hotelBookings.willBook,
          bookingComplete: inv.hotelBookings.bookingComplete,
        }
      : null,
  }));

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-16">
      <div className="max-w-5xl w-full space-y-8">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-serif text-3xl font-light">Admin</h1>
          <Link
            href="/admin/addresses"
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            Addresses ({addressCount})
          </Link>
        </div>

        <AgentPrompt />

        <div className="rounded-lg border border-input bg-muted/30 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Projected headcount
          </p>
          <p className="mt-1 text-4xl font-light leading-none">
            {projectedCount}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {attendingCount} confirmed
            <span className="mx-1.5 text-muted-foreground/50">·</span>
            {expectedCount} expected
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
          <Stat label="Saturday" value={totalGuests.filter((g) => g.attendingSaturday === true).length} />
          <Stat label="Friday" value={totalGuests.filter((g) => g.attendingFriday === true).length} />
          <Stat label="Declined" value={declined.length} />
          <Stat label="Pending" value={pending.length} />
          <Stat label="Hotel" value={hotelYes.length} />
          <Stat label="Groups" value={allInvites.length} />
        </div>

        <Separator />

        <CreateRsvpForm />

        <AdminViews
          invites={tableData}
          awaiting={awaiting}
          followUps={followUpRows.map((f) => ({
            id: f.id,
            name: f.name,
            note: f.note,
            resolved: f.resolved,
          }))}
        />
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <p className="text-2xl font-light">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
