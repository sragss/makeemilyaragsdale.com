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
import { Input } from "@/components/ui/input";

export interface AwaitingRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  submittedAt: string;
}

export function AwaitingTable({ rows }: { rows: AwaitingRow[] }) {
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

      <p className="text-xs text-muted-foreground">
        Gave a mailing address at{" "}
        <span className="font-mono">/address</span> but has no matching RSVP.
        Matched on name, so nicknames or spelling changes can put someone here
        by mistake — worth a glance before you chase anyone.
      </p>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {rows.length === 0
            ? "Everyone on the address list has RSVP'd."
            : "No matches."}
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
                <TableCell className="text-sm">{row.name}</TableCell>
                <TableCell>
                  <div className="space-y-0.5 text-xs text-muted-foreground">
                    {row.email && <span className="block">{row.email}</span>}
                    {row.phone && <span className="block">{row.phone}</span>}
                  </div>
                </TableCell>
                <TableCell className="text-xs whitespace-pre-line text-muted-foreground">
                  {row.address}
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
