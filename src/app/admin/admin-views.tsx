"use client";

import { useState } from "react";
import { AdminTable, type InviteRow } from "./admin-table";
import { AwaitingTable, type AwaitingRow } from "./awaiting-table";
import { FollowUpTable, type FollowUpRow } from "./follow-up-table";

type View = "rsvps" | "expected" | "notComing" | "awaiting" | "followUp";

const EXPECTED_NOTE =
  "Believed to be coming, but they have not formally RSVP'd. These people count toward the projected headcount.";

const NOT_COMING_NOTE =
  "Believed not to be coming, but they have not formally declined. Not counted in the projected headcount.";

const AWAITING_NOTE =
  "Invited, no RSVP, and no read on them yet — everyone here still needs chasing. People you have marked coming or not coming have moved to their own tabs.";

export function AdminViews({
  invites,
  awaiting,
  followUps,
}: {
  invites: InviteRow[];
  awaiting: AwaitingRow[];
  followUps: FollowUpRow[];
}) {
  const [view, setView] = useState<View>("rsvps");

  const expected = awaiting.filter((r) => r.status === "yes");
  const notComing = awaiting.filter(
    (r) => r.status === "likely_no" || r.status === "no"
  );
  const unknown = awaiting.filter((r) => r.status === "unknown");

  // Counts are people, not groups — a single RSVP or address line can cover a
  // couple or a whole family.
  const people = (rows: AwaitingRow[]) =>
    rows.reduce((n, row) => n + row.people, 0);
  const rsvpPeople = invites.reduce((n, inv) => n + inv.guests.length, 0);

  const tab = (value: View, label: string, count: number) => (
    <button
      type="button"
      onClick={() => setView(value)}
      aria-pressed={view === value}
      className={`cursor-pointer rounded-md px-3 py-1.5 text-sm transition-colors ${
        view === value
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label} <span className="text-xs text-muted-foreground">({count})</span>
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="inline-flex flex-wrap gap-1 rounded-lg border border-input bg-muted/40 p-1">
        {tab("rsvps", "RSVPs", rsvpPeople)}
        {tab("expected", "Expected yes", people(expected))}
        {tab("notComing", "Expected no", people(notComing))}
        {tab("awaiting", "Awaiting RSVP", people(unknown))}
        {tab(
          "followUp",
          "Follow up",
          followUps.filter((f) => !f.resolved).length
        )}
      </div>

      {view === "rsvps" && <AdminTable invites={invites} />}
      {view === "expected" && (
        <AwaitingTable rows={expected} note={EXPECTED_NOTE} />
      )}
      {view === "notComing" && (
        <AwaitingTable rows={notComing} note={NOT_COMING_NOTE} showStatus />
      )}
      {view === "awaiting" && (
        <AwaitingTable rows={unknown} note={AWAITING_NOTE} />
      )}
      {view === "followUp" && <FollowUpTable rows={followUps} />}
    </div>
  );
}
