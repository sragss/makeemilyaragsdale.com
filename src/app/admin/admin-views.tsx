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
  const declinedByHand = awaiting.filter((r) => r.status === "no");
  const unknown = awaiting.filter((r) => r.status === "unknown");

  // A decline that came through the form belongs with the other regrets, not
  // in the RSVPs tab — that tab is for people we are counting on. A group
  // where somebody is still coming stays put.
  const declinedRsvps = invites.filter(
    (inv) =>
      inv.guests.length > 0 &&
      inv.guests.every(
        (g) => g.attendingFriday === false && g.attendingSaturday === false
      )
  );
  const declinedIds = new Set(declinedRsvps.map((inv) => inv.id));
  const activeRsvps = invites.filter((inv) => !declinedIds.has(inv.id));

  // Counts are people, not groups — a single RSVP or address line can cover a
  // couple or a whole family.
  const people = (rows: AwaitingRow[]) =>
    rows.reduce((n, row) => n + row.people, 0);
  const guestsIn = (rows: InviteRow[]) =>
    rows.reduce((n, inv) => n + inv.guests.length, 0);
  const rsvpPeople = guestsIn(activeRsvps);
  const declinedPeople = guestsIn(declinedRsvps) + people(declinedByHand);

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
        {tab("declined", "Regretfully declined", declinedPeople)}
        {tab("awaiting", "Awaiting RSVP", people(unknown))}
        {tab(
          "followUp",
          "Follow up",
          followUps.filter((f) => !f.resolved).length
        )}
      </div>

      {view === "rsvps" && <AdminTable invites={activeRsvps} />}
      {view === "expected" && (
        <AwaitingTable rows={expected} note={EXPECTED_NOTE} />
      )}
      {view === "expectedNo" && (
        <AwaitingTable rows={expectedNo} note={EXPECTED_NO_NOTE} />
      )}
      {view === "declined" && (
        <div className="space-y-8">
          <p className="text-xs text-muted-foreground">{DECLINED_NOTE}</p>

          {declinedRsvps.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Declined through the RSVP form
              </h3>
              <AdminTable invites={declinedRsvps} />
            </section>
          )}

          {declinedByHand.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Told us another way
              </h3>
              <AwaitingTable rows={declinedByHand} note="" />
            </section>
          )}

          {declinedRsvps.length === 0 && declinedByHand.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Nobody in this list.
            </p>
          )}
        </div>
      )}
      {view === "awaiting" && (
        <AwaitingTable rows={unknown} note={AWAITING_NOTE} />
      )}
      {view === "followUp" && <FollowUpTable rows={followUps} />}
    </div>
  );
}
