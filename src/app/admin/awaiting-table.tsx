"use client";

import { useState, useMemo } from "react";
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

export interface AwaitingRow {
  id: string;
  name: string;
  /** How many people this household line covers. */
  people: number;
  /** Hand-set read on them: no idea yet, coming, probably not, or not. */
  status: "unknown" | "yes" | "likely_no" | "no";
  email: string;
  phone: string;
  address: string;
  submittedAt: string;
}

const STATUS_LABELS: Record<AwaitingRow["status"], string | null> = {
  unknown: null,
  yes: "Coming",
  likely_no: "Probably no",
  no: "Not coming",
};

export function AwaitingTable({
  rows,
  note,
  showStatus = false,
}: {
  rows: AwaitingRow[];
  note: string;
  /** Show a per-row badge — used where a list mixes statuses. */
  showStatus?: boolean;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.name, r.email, r.phone, r.address].some((f) =>
        f.toLowerCase().includes(q)
      )
    );
  }, [rows, search]);

  return (
    <div className="space-y-3">
      <Input
        placeholder="Search name, email, phone, address..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <p className="text-xs text-muted-foreground">{note}</p>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {rows.length === 0 ? "Nobody in this list." : "No matches."}
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Household</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Address given</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="text-sm">
                  {row.name}
                  {showStatus && STATUS_LABELS[row.status] && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {STATUS_LABELS[row.status]}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5 text-xs text-muted-foreground">
                    {row.email && <span className="block">{row.email}</span>}
                    {row.phone && <span className="block">{row.phone}</span>}
                  </div>
                </TableCell>
                <TableCell className="text-xs whitespace-pre-line text-muted-foreground">
                  {row.address.trim() ? (
                    row.address
                  ) : (
                    <span className="text-muted-foreground/60 italic">
                      no address yet
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                  {row.submittedAt}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
