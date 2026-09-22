"use client";

import { useState } from "react";
import { AdminTable, type InviteRow } from "./admin-table";
import { AwaitingTable, type AwaitingRow } from "./awaiting-table";
import { FollowUpTable, type FollowUpRow } from "./follow-up-table";

type View =
  | "rsvps"
  | "expected"
  | "expectedNo"
  | "declined"
  | "awaiting"
  | "followUp";

const EXPECTED_NOTE =
  "Believed to be coming, but they have not formally RSVP'd. These people count toward the projected headcount.";

const EXPECTED_NO_NOTE =
  "Probably not coming, but they have not confirmed either way — worth one more ask before writing them off. Not counted in the projected headcount.";

const DECLINED_NOTE =
  "Told us they cannot make it. Nothing left to chase here. Not counted in the projected headcount.";

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
  // Two separate reads on a no: "probably not" still deserves a nudge,
  // a regretful decline is settled.
  const expectedNo = awaiting.filter((r) => r.status === "likely_no");
  const declined = awaiting.filter((r) => r.status === "no");
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
        {tab("expectedNo", "Expected no", people(expectedNo))}
        {tab("declined", "Regretfully declined", people(declined))}
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
      {view === "expectedNo" && (
        <AwaitingTable rows={expectedNo} note={EXPECTED_NO_NOTE} />
      )}
      {view === "declined" && (
        <AwaitingTable rows={declined} note={DECLINED_NOTE} />
      )}
      {view === "awaiting" && (
        <AwaitingTable rows={unknown} note={AWAITING_NOTE} />
      )}
      {view === "followUp" && <FollowUpTable rows={followUps} />}
    </div>
  );
}
