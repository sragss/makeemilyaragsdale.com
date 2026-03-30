import Link from "next/link";
import { getDb } from "@/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { isAdminAuthenticated } from "./actions";
import { LoginForm } from "./login-form";
import { CreateInviteForm } from "./create-invite";
import { CopyButton } from "./copy-button";

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
  const attending = totalGuests.filter((g) => g.attending === true);
  const declined = totalGuests.filter((g) => g.attending === false);
  const pending = totalGuests.filter((g) => g.attending === null);
  const hotelYes = allInvites.filter(
    (i) => i.hotelBookings?.willBook === true
  );

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-16">
      <div className="max-w-4xl w-full space-y-8">
        <h1 className="font-serif text-3xl font-light">Admin</h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <Stat label="Attending" value={attending.length} />
          <Stat label="Declined" value={declined.length} />
          <Stat label="Pending" value={pending.length} />
          <Stat label="Hotel bookings" value={hotelYes.length} />
        </div>

        <Separator />

        <CreateInviteForm />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hotel</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allInvites.map((invite) => (
              <TableRow key={invite.id}>
                <TableCell className="font-mono text-xs">
                  <Link
                    href={`/admin/rsvp/${invite.code}`}
                    className="underline underline-offset-4 decoration-muted-foreground/50 hover:decoration-foreground transition-colors"
                  >
                    {invite.code}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    {invite.guests.map((g) => (
                      <div key={g.id} className="text-sm">
                        {g.name}
                        {g.plusOneName && (
                          <span className="text-muted-foreground">
                            {" "}
                            + {g.plusOneName}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {invite.guests.map((g) => (
                    <div key={g.id}>
                      {g.attending === true && (
                        <Badge variant="secondary" className="text-xs">
                          Yes
                        </Badge>
                      )}
                      {g.attending === false && (
                        <Badge variant="outline" className="text-xs">
                          No
                        </Badge>
                      )}
                      {g.attending === null && (
                        <Badge
                          variant="outline"
                          className="text-xs text-muted-foreground"
                        >
                          Pending
                        </Badge>
                      )}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {invite.hotelEligible ? (
                    invite.hotelBookings?.willBook === true ? (
                      <Badge variant="secondary" className="text-xs">
                        Booking
                      </Badge>
                    ) : invite.hotelBookings?.willBook === false ? (
                      <span className="text-xs text-muted-foreground">
                        Declined
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Eligible
                      </span>
                    )
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      &mdash;
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    {invite.guests.map((g) => (
                      <div
                        key={g.id}
                        className="text-xs text-muted-foreground"
                      >
                        {g.email && <span>{g.email}</span>}
                        {g.email && g.phone && <span> / </span>}
                        {g.phone && <span>{g.phone}</span>}
                        {g.dietaryRestrictions && (
                          <span className="block text-muted-foreground/60">
                            Diet: {g.dietaryRestrictions}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <CopyButton url={`https://makeemilyaragsdale.com/rsvp/${invite.code}`} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
