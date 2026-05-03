import Link from "next/link";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { addressSubmissions } from "@/db/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { isAdminAuthenticated } from "../actions";
import { CopyButton } from "../copy-button";
import { DeleteSubmissionButton } from "./delete-button";

export const dynamic = "force-dynamic";

function formatAddress(row: {
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}) {
  const cityLine = [row.city, [row.region, row.postalCode].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
  return [row.addressLine1, row.addressLine2, cityLine, row.country]
    .filter(Boolean)
    .join("\n");
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminAddressesPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin");

  const db = getDb();
  const submissions = await db
    .select()
    .from(addressSubmissions)
    .orderBy(desc(addressSubmissions.createdAt));

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-16">
      <div className="max-w-6xl w-full space-y-8">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-serif text-3xl font-light">Address Submissions</h1>
          <Link
            href="/admin"
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Admin
          </Link>
        </div>

        <p className="text-sm text-muted-foreground">
          {submissions.length}{" "}
          {submissions.length === 1 ? "submission" : "submissions"} from the
          public address form at <span className="font-mono">/address</span>.
        </p>

        <Separator />

        {submissions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-12 text-center">
            No submissions yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="w-10"></TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((row) => {
                const address = formatAddress(row);
                return (
                  <TableRow key={row.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(new Date(row.createdAt))}
                    </TableCell>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="text-sm">
                      <a
                        href={`mailto:${row.email}`}
                        className="hover:underline"
                      >
                        {row.email}
                      </a>
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {row.phone}
                    </TableCell>
                    <TableCell className="text-sm whitespace-pre-line leading-snug">
                      {address}
                    </TableCell>
                    <TableCell>
                      <CopyButton url={address} label="Address" />
                    </TableCell>
                    <TableCell>
                      <DeleteSubmissionButton id={row.id} name={row.name} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </main>
  );
}
