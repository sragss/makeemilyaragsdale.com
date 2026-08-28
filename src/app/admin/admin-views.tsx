"use client";

import { useState } from "react";
import { AdminTable, type InviteRow } from "./admin-table";
import { AwaitingTable, type AwaitingRow } from "./awaiting-table";
import { FollowUpTable, type FollowUpRow } from "./follow-up-table";

type View = "rsvps" | "expected" | "awaiting" | "followUp";

const AWAITING_NOTE =
  "Gave a mailing address at /address but has no matching RSVP. Matched on name, so nicknames or spelling changes can put someone here by mistake — worth a glance before you chase anyone.";

const EXPECTED_NOTE =
  "Flagged by hand as believed to be coming, but they still have not RSVP'd. Everyone here also appears under Awaiting RSVP.";

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

  const expected = awaiting.filter((row) => row.expected);

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
      <div className="inline-flex gap-1 rounded-lg border border-input bg-muted/40 p-1">
        {tab("rsvps", "RSVPs", rsvpPeople)}
        {tab("expected", "Expected", people(expected))}
        {tab("awaiting", "Awaiting RSVP", people(awaiting))}
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
      {view === "awaiting" && (
        <AwaitingTable rows={awaiting} note={AWAITING_NOTE} />
      )}
      {view === "followUp" && <FollowUpTable rows={followUps} />}
    </div>
  );
}
