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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { InviteTrashButton } from "./invite-trash-button";

export interface InviteRow {
  id: string;
  guests: {
    id: string;
    name: string;
    attendingFriday: boolean | null;
    attendingSaturday: boolean | null;
    email: string | null;
    phone: string | null;
    mainCoursePreference: string | null;
    dietaryRestrictions: string | null;
    plusOneName: string | null;
  }[];
  hotelBooking: {
    willBook: boolean | null;
    bookingComplete: boolean;
  } | null;
}

type SortKey = "name";

const STATUS_OPTIONS = [
  { value: "attending", label: "Attending" },
  { value: "declined", label: "Declined" },
  { value: "pending", label: "Pending" },
] as const;

const HOTEL_OPTIONS = [
  { value: "booking", label: "Booking" },
  { value: "booked", label: "Booked" },
  { value: "declined_hotel", label: "Declined" },
] as const;

const HOTEL_LABELS: Record<string, string> = {
  booking: "Booking",
  booked: "Booked",
  declined_hotel: "Declined",
};



export function AdminTable({ invites }: { invites: InviteRow[] }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Set<string>>(new Set());
  const [filterHotel, setFilterHotel] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  function toggleFilter(
    current: Set<string>,
    setter: (s: Set<string>) => void,
    value: string
  ) {
    const next = new Set(current);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  const activeFilters: { label: string; clear: () => void }[] = [];
  for (const v of filterStatus) {
    const opt = STATUS_OPTIONS.find((o) => o.value === v);
    if (opt)
      activeFilters.push({
        label: `Status: ${opt.label}`,
        clear: () => toggleFilter(filterStatus, setFilterStatus, v),
      });
  }
  for (const v of filterHotel) {
    activeFilters.push({
      label: `Hotel: ${HOTEL_LABELS[v] ?? v}`,
      clear: () => toggleFilter(filterHotel, setFilterHotel, v),
    });
  }
  const filtered = useMemo(() => {
    let result = invites;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((inv) => {
        return inv.guests.some(
          (g) =>
            g.name.toLowerCase().includes(q) ||
            g.email?.toLowerCase().includes(q) ||
            g.phone?.includes(q)
        );
      });
    }

    if (filterStatus.size > 0) {
      result = result.filter((inv) => {
        const guestStatuses = inv.guests.map((g) => {
          if (g.attendingFriday || g.attendingSaturday) return "attending";
          if (g.attendingFriday === false && g.attendingSaturday === false) return "declined";
          return "pending";
        });
        if (filterStatus.has("attending") && guestStatuses.includes("attending")) return true;
        if (filterStatus.has("declined") && guestStatuses.every((s) => s === "declined")) return true;
        if (filterStatus.has("pending") && guestStatuses.includes("pending")) return true;
        return false;
      });
    }

    if (filterHotel.size > 0) {
      result = result.filter((inv) => {
        if (filterHotel.has("booking") && inv.hotelBooking?.willBook === true && !inv.hotelBooking?.bookingComplete) return true;
        if (filterHotel.has("booked") && inv.hotelBooking?.bookingComplete === true) return true;
        if (filterHotel.has("declined_hotel") && inv.hotelBooking?.willBook === false) return true;
        return false;
      });
    }

    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") {
        const nameA = a.guests[0]?.name ?? "";
        const nameB = b.guests[0]?.name ?? "";
        cmp = nameA.localeCompare(nameB);
      }
      return sortAsc ? cmp : -cmp;
    });

    return result;
  }, [
    invites,
    search,
    filterStatus,
    filterHotel,
    sortKey,
    sortAsc,
  ]);

  const sortIndicator = (key: SortKey) =>
    sortKey === key ? (sortAsc ? " \u2191" : " \u2193") : "";

  return (
    <div className="space-y-3">
      {/* Search + Filter button */}
      <div className="flex gap-2">
        <Input
          placeholder="Search guests, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Popover>
          <PopoverTrigger
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-input bg-transparent px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
          >
            Filters
            {activeFilters.length > 0 && (
              <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
                {activeFilters.length}
              </span>
            )}
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 space-y-4">
            <FilterSection
              label="Status"
              options={STATUS_OPTIONS}
              selected={filterStatus}
              onToggle={(v) => toggleFilter(filterStatus, setFilterStatus, v)}
            />
            <Separator />
            <FilterSection
              label="Hotel"
              options={HOTEL_OPTIONS}
              selected={filterHotel}
              onToggle={(v) => toggleFilter(filterHotel, setFilterHotel, v)}
            />
            {activeFilters.length > 0 && (
              <>
                <Separator />
                <button
                  onClick={() => {
                    setFilterStatus(new Set());
                    setFilterHotel(new Set());
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Clear all filters
                </button>
              </>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Active filter tags */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {activeFilters.map((f) => (
            <span
              key={f.label}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-sm bg-secondary text-secondary-foreground border border-border"
            >
              {f.label}
              <button
                onClick={f.clear}
                className="ml-0.5 hover:text-foreground text-muted-foreground cursor-pointer"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Count */}
      <p className="text-xs text-muted-foreground">
        {filtered.length} RSVP{filtered.length !== 1 ? "s" : ""}
        {search && ` matching \u201c${search}\u201d`}
      </p>

      <div className="overflow-x-auto scrollbar-none">
      <Table className="min-w-[620px]">
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => toggleSort("name")}
            >
              Guests{sortIndicator("name")}
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Hotel</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((invite) => (
            <TableRow key={invite.id}>
              <TableCell>
                <div className="space-y-0.5">
                  <Link
                    href={`/admin/rsvp/${invite.id}`}
                    className="block underline-offset-4 decoration-muted-foreground/50 transition-colors hover:underline"
                  >
                    {invite.guests.map((g) => (
                      <span key={g.id} className="block text-sm">
                        {g.name}
                        {g.plusOneName && (
                          <span className="text-muted-foreground">
                            {" "}
                            + {g.plusOneName}
                          </span>
                        )}
                      </span>
                    ))}
                  </Link>
                </div>
              </TableCell>
              <TableCell>
                {invite.guests.map((g) => (
                  <div key={g.id}>
                    {(g.attendingFriday || g.attendingSaturday) ? (
                      <Badge variant="secondary" className="text-xs">
                        {g.attendingFriday && g.attendingSaturday
                          ? "Fri+Sat"
                          : g.attendingSaturday
                            ? "Sat"
                            : "Fri"}
                      </Badge>
                    ) : g.attendingFriday === false && g.attendingSaturday === false ? (
                      <Badge variant="outline" className="text-xs">
                        No
                      </Badge>
                    ) : (
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
                {invite.hotelBooking?.willBook === true ? (
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
                    Pending
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
                      {g.mainCoursePreference && (
                        <span className="block text-muted-foreground/70">
                          Meal: {g.mainCoursePreference}
                        </span>
                      )}
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
                <InviteTrashButton inviteId={invite.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}

function FilterSection({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: readonly { value: string; label: string }[];
  selected: Set<string>;
  onToggle: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onToggle(opt.value)}
            className={`px-2 py-1 text-xs rounded-sm border transition-colors cursor-pointer ${
              selected.has(opt.value)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-muted-foreground border-border hover:border-foreground/30"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
