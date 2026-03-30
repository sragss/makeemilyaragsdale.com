"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CopyButton } from "./copy-button";

interface InviteRow {
  id: string;
  code: string;
  hotelEligible: boolean;
  address: string | null;
  guests: {
    id: string;
    name: string;
    attending: boolean | null;
    email: string | null;
    phone: string | null;
    dietaryRestrictions: string | null;
    plusOneName: string | null;
  }[];
  hotelBooking: {
    willBook: boolean | null;
    bookingComplete: boolean;
  } | null;
}

type SortKey = "code" | "name";
type FilterStatus = "all" | "attending" | "declined" | "pending";
type FilterHotel = "all" | "eligible" | "booking" | "booked" | "declined_hotel";
type FilterAddr = "all" | "has_addr" | "no_addr";

export function AdminTable({ invites }: { invites: InviteRow[] }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterHotel, setFilterHotel] = useState<FilterHotel>("all");
  const [filterAddr, setFilterAddr] = useState<FilterAddr>("all");
  const [sortKey, setSortKey] = useState<SortKey>("code");
  const [sortAsc, setSortAsc] = useState(true);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  const filtered = useMemo(() => {
    let result = invites;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((inv) => {
        if (inv.code.toLowerCase().includes(q)) return true;
        return inv.guests.some(
          (g) =>
            g.name.toLowerCase().includes(q) ||
            g.email?.toLowerCase().includes(q) ||
            g.phone?.includes(q)
        );
      });
    }

    // Filter by status
    if (filterStatus !== "all") {
      result = result.filter((inv) => {
        const statuses = inv.guests.map((g) => g.attending);
        if (filterStatus === "attending")
          return statuses.some((s) => s === true);
        if (filterStatus === "declined")
          return statuses.every((s) => s === false);
        if (filterStatus === "pending")
          return statuses.some((s) => s === null);
        return true;
      });
    }

    // Filter by hotel
    if (filterHotel !== "all") {
      result = result.filter((inv) => {
        if (filterHotel === "eligible") return inv.hotelEligible;
        if (filterHotel === "booking")
          return inv.hotelBooking?.willBook === true && !inv.hotelBooking?.bookingComplete;
        if (filterHotel === "booked")
          return inv.hotelBooking?.bookingComplete === true;
        if (filterHotel === "declined_hotel")
          return inv.hotelBooking?.willBook === false;
        return true;
      });
    }

    // Filter by address
    if (filterAddr !== "all") {
      result = result.filter((inv) =>
        filterAddr === "has_addr" ? !!inv.address : !inv.address
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "code") {
        cmp = a.code.localeCompare(b.code);
      } else if (sortKey === "name") {
        const nameA = a.guests[0]?.name ?? "";
        const nameB = b.guests[0]?.name ?? "";
        cmp = nameA.localeCompare(nameB);
      }
      return sortAsc ? cmp : -cmp;
    });

    return result;
  }, [invites, search, filterStatus, filterHotel, filterAddr, sortKey, sortAsc]);

  const sortIndicator = (key: SortKey) =>
    sortKey === key ? (sortAsc ? " \u2191" : " \u2193") : "";

  return (
    <div className="space-y-4">
      {/* Search */}
      <Input
        placeholder="Search guests, codes, emails, phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
        <FilterGroup
          label="Status"
          value={filterStatus}
          onChange={(v) => setFilterStatus(v as FilterStatus)}
          options={[
            { value: "all", label: "All" },
            { value: "attending", label: "Attending" },
            { value: "declined", label: "Declined" },
            { value: "pending", label: "Pending" },
          ]}
        />
        <FilterGroup
          label="Hotel"
          value={filterHotel}
          onChange={(v) => setFilterHotel(v as FilterHotel)}
          options={[
            { value: "all", label: "All" },
            { value: "eligible", label: "Eligible" },
            { value: "booking", label: "Booking" },
            { value: "booked", label: "Booked" },
            { value: "declined_hotel", label: "Declined" },
          ]}
        />
        <FilterGroup
          label="Address"
          value={filterAddr}
          onChange={(v) => setFilterAddr(v as FilterAddr)}
          options={[
            { value: "all", label: "All" },
            { value: "has_addr", label: "Has address" },
            { value: "no_addr", label: "Missing" },
          ]}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} invite{filtered.length !== 1 ? "s" : ""}
        {search && ` matching \u201c${search}\u201d`}
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => toggleSort("code")}
            >
              Code{sortIndicator("code")}
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => toggleSort("name")}
            >
              Guests{sortIndicator("name")}
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <Tooltip>
                <TooltipTrigger className="underline decoration-dotted underline-offset-4 decoration-muted-foreground/50">
                  Hotel
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-xs">
                  Hotel-eligible guests are invited to book at the Belmond (3
                  nights, Thu-Sat). It&apos;s a subset of invitees — close
                  friends and family. Rooms are scarce and we need bookings
                  promptly as funds are held until the block fills.
                </TooltipContent>
              </Tooltip>
            </TableHead>
            <TableHead>Addr</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((invite) => (
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
                  invite.hotelBooking?.willBook === true ? (
                    invite.hotelBooking.bookingComplete ? (
                      <Badge variant="secondary" className="text-xs">
                        Booked
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Booking
                      </Badge>
                    )
                  ) : invite.hotelBooking?.willBook === false ? (
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
                {invite.address ? (
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="secondary" className="text-xs">
                        Yes
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs max-w-xs">
                      {invite.address}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <span className="text-xs text-muted-foreground">&mdash;</span>
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
                <CopyButton
                  url={`https://makeemilyaragsdale.com/rsvp/${invite.code}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function FilterGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-muted-foreground">{label}:</span>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-2 py-0.5 rounded-sm border transition-colors cursor-pointer ${
            value === opt.value
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-transparent text-muted-foreground border-border hover:border-foreground/30"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
