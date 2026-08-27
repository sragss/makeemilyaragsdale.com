"use client";

import { useState } from "react";
import { AdminTable, type InviteRow } from "./admin-table";
import { AwaitingTable, type AwaitingRow } from "./awaiting-table";

type View = "rsvps" | "awaiting";

export function AdminViews({
  invites,
  awaiting,
}: {
  invites: InviteRow[];
  awaiting: AwaitingRow[];
}) {
  const [view, setView] = useState<View>("rsvps");

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
      {label}{" "}
      <span className="text-xs text-muted-foreground">({count})</span>
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="inline-flex gap-1 rounded-lg border border-input bg-muted/40 p-1">
        {tab("rsvps", "RSVPs", invites.length)}
        {tab("awaiting", "Awaiting RSVP", awaiting.length)}
      </div>

      {view === "rsvps" ? (
        <AdminTable invites={invites} />
      ) : (
        <AwaitingTable rows={awaiting} />
      )}
    </div>
  );
}
