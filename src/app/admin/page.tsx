import { getDb } from "@/db";
import { Separator } from "@/components/ui/separator";
import { isAdminAuthenticated } from "./actions";
import { LoginForm } from "./login-form";
import { CreateInviteForm } from "./create-invite";
import { AdminTable } from "./admin-table";
import { AgentPrompt } from "./agent-prompt";

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
    orderBy: (invites, { asc }) => [asc(invites.code)],
  });

  const allInvites = allInvitesRaw.filter((i) => !i.deleted);
  const totalGuests = allInvites.flatMap((i) => i.guests);
  const attending = totalGuests.filter(
    (g) => g.attendingFriday || g.attendingSaturday
  );
  const declined = totalGuests.filter(
    (g) => g.attendingFriday === false && g.attendingSaturday === false
  );
  const pending = totalGuests.filter(
    (g) => g.attendingFriday === null && g.attendingSaturday === null
  );
  const hotelYes = allInvites.filter(
    (i) => i.hotelBookings?.willBook === true
  );

  const tableData = allInvites.map((inv) => ({
    id: inv.id,
    code: inv.code,
    hotelEligible: inv.hotelEligible,
    address: inv.address,
    guests: inv.guests.map((g) => ({
      id: g.id,
      name: g.name,
      attendingFriday: g.attendingFriday,
      attendingSaturday: g.attendingSaturday,
      email: g.email,
      phone: g.phone,
      dietaryRestrictions: g.dietaryRestrictions,
      plusOneName: g.plusOneName,
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
        <h1 className="font-serif text-3xl font-light">Admin</h1>

        <AgentPrompt />

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
          <Stat label="Saturday" value={totalGuests.filter((g) => g.attendingSaturday === true).length} />
          <Stat label="Friday" value={totalGuests.filter((g) => g.attendingFriday === true).length} />
          <Stat label="Declined" value={declined.length} />
          <Stat label="Pending" value={pending.length} />
          <Stat label="Hotel" value={hotelYes.length} />
          <Stat label="Invites" value={allInvites.length} />
        </div>

        <Separator />

        <CreateInviteForm />

        <AdminTable invites={tableData} />
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
