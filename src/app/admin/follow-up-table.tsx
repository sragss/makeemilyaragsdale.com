"use client";

import { useState, useTransition } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  addFollowUp,
  deleteFollowUp,
  setFollowUpResolved,
} from "./follow-up-actions";

export interface FollowUpRow {
  id: string;
  name: string;
  note: string | null;
  resolved: boolean;
}

export function FollowUpTable({ rows }: { rows: FollowUpRow[] }) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [showResolved, setShowResolved] = useState(false);
  const [pending, startTransition] = useTransition();

  const visible = showResolved ? rows : rows.filter((r) => !r.resolved);

  function handleAdd() {
    if (!name.trim()) return;
    startTransition(async () => {
      await addFollowUp(name, note);
      setName("");
      setNote("");
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        People whose status needs chasing — replied but probably can&apos;t
        come, or never appeared in the RSVP or address lists at all. Kept
        separately, so nothing here counts toward the projected headcount.
      </p>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="w-56"
        />
        <Input
          placeholder="What needs following up?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1 min-w-48"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={pending || !name.trim()}
          className="shrink-0 rounded-lg border border-input px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50 cursor-pointer"
        >
          Add
        </button>
      </div>

      <Separator />

      {visible.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Nothing to follow up on.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Needs following up</TableHead>
              <TableHead className="w-40 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="text-sm align-top">
                  {row.name}
                  {row.resolved && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Resolved
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {row.note}
                </TableCell>
                <TableCell className="text-right align-top whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() =>
                      startTransition(async () => {
                        await setFollowUpResolved(row.id, !row.resolved);
                      })
                    }
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {row.resolved ? "Reopen" : "Mark resolved"}
                  </button>
                  <span className="mx-2 text-muted-foreground/40">·</span>
                  <button
                    type="button"
                    onClick={() =>
                      startTransition(async () => {
                        await deleteFollowUp(row.id);
                      })
                    }
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {rows.some((r) => r.resolved) && (
        <button
          type="button"
          onClick={() => setShowResolved((v) => !v)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          {showResolved ? "Hide resolved" : "Show resolved"}
        </button>
      )}
    </div>
  );
}
