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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
type FilterHotel =
  | "all"
  | "eligible"
  | "booking"
  | "booked"
  | "declined_hotel";
type FilterAddr = "all" | "has_addr" | "no_addr";

const STATUS_LABELS: Record<FilterStatus, string> = {
  all: "All",
  attending: "Attending",
  declined: "Declined",
  pending: "Pending",
};

const HOTEL_LABELS: Record<FilterHotel, string> = {
  all: "All",
  eligible: "Eligible",
  booking: "Booking",
  booked: "Booked",
  declined_hotel: "Declined",
};

const ADDR_LABELS: Record<FilterAddr, string> = {
  all: "All",
  has_addr: "Has address",
  no_addr: "Missing",
};

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

  const activeFilters: { label: string; clear: () => void }[] = [];
  if (filterStatus !== "all")
    activeFilters.push({
      label: `Status: ${STATUS_LABELS[filterStatus]}`,
      clear: () => setFilterStatus("all"),
    });
  if (filterHotel !== "all")
    activeFilters.push({
      label: `Hotel: ${HOTEL_LABELS[filterHotel]}`,
      clear: () => setFilterHotel("all"),
    });
  if (filterAddr !== "all")
    activeFilters.push({
      label: `Address: ${ADDR_LABELS[filterAddr]}`,
      clear: () => setFilterAddr("all"),
    });

  const filtered = useMemo(() => {
    let result = invites;

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

    if (filterHotel !== "all") {
      result = result.filter((inv) => {
        if (filterHotel === "eligible") return inv.hotelEligible;
        if (filterHotel === "booking")
          return (
            inv.hotelBooking?.willBook === true &&
            !inv.hotelBooking?.bookingComplete
          );
        if (filterHotel === "booked")
          return inv.hotelBooking?.bookingComplete === true;
        if (filterHotel === "declined_hotel")
          return inv.hotelBooking?.willBook === false;
        return true;
      });
    }

    if (filterAddr !== "all") {
      result = result.filter((inv) =>
        filterAddr === "has_addr" ? !!inv.address : !inv.address
      );
    }

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
  }, [
    invites,
    search,
    filterStatus,
    filterHotel,
    filterAddr,
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
          placeholder="Search guests, codes, emails, phone..."
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
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <div className="flex flex-wrap gap-1">
                {(
                  Object.entries(STATUS_LABELS) as [FilterStatus, string][]
                ).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setFilterStatus(value)}
                    className={`px-2 py-1 text-xs rounded-sm border transition-colors cursor-pointer ${
                      filterStatus === value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-transparent text-muted-foreground border-border hover:border-foreground/30"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                <Tooltip>
                  <TooltipTrigger className="underline decoration-dotted underline-offset-4 decoration-muted-foreground/50">
                    Hotel
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs">
                    Hotel-eligible guests are invited to book at the Belmond
                    (3 nights, Thu-Sat). Close friends and family. Rooms are
                    scarce — we need bookings promptly as funds are held until
                    the block fills.
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex flex-wrap gap-1">
                {(
                  Object.entries(HOTEL_LABELS) as [FilterHotel, string][]
                ).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setFilterHotel(value)}
                    className={`px-2 py-1 text-xs rounded-sm border transition-colors cursor-pointer ${
                      filterHotel === value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-transparent text-muted-foreground border-border hover:border-foreground/30"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Address</Label>
              <div className="flex flex-wrap gap-1">
                {(Object.entries(ADDR_LABELS) as [FilterAddr, string][]).map(
                  ([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setFilterAddr(value)}
                      className={`px-2 py-1 text-xs rounded-sm border transition-colors cursor-pointer ${
                        filterAddr === value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-transparent text-muted-foreground border-border hover:border-foreground/30"
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>

            {activeFilters.length > 0 && (
              <>
                <Separator />
                <button
                  onClick={() => {
                    setFilterStatus("all");
                    setFilterHotel("all");
                    setFilterAddr("all");
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
            <TableHead>Hotel</TableHead>
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
