"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createInvite } from "./create-actions";
import { useRouter } from "next/navigation";

export function CreateInviteForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [guestNames, setGuestNames] = useState(["", ""]);
  const [hotelEligible, setHotelEligible] = useState(false);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<{
    code: string;
    url: string;
  } | null>(null);

  function addGuest() {
    setGuestNames((prev) => [...prev, ""]);
  }

  function removeGuest(index: number) {
    if (guestNames.length <= 1) return;
    setGuestNames((prev) => prev.filter((_, i) => i !== index));
  }

  function updateName(index: number, value: string) {
    setGuestNames((prev) => prev.map((n, i) => (i === index ? value : n)));
  }

  async function handleCreate() {
    const names = guestNames.map((n) => n.trim()).filter(Boolean);
    if (names.length === 0) return;

    setSaving(true);
    const res = await createInvite({
      guestNames: names,
      hotelEligible,
      address: address.trim() || null,
      notes: notes.trim() || null,
    });
    setSaving(false);

    if (res.code) {
      setResult({ code: res.code, url: `/rsvp/${res.code}` });
    }
  }

  function handleReset() {
    setGuestNames(["", ""]);
    setHotelEligible(false);
    setAddress("");
    setNotes("");
    setResult(null);
  }

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        + New Invite
      </Button>
    );
  }

  if (result) {
    return (
      <div className="space-y-4 border border-border rounded-sm p-4">
        <p className="text-sm">
          Created{" "}
          <span className="font-mono font-medium">{result.code}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Share this link:{" "}
          <span className="font-mono">
            makeemilyaragsdale.com{result.url}
          </span>
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(
                `https://makeemilyaragsdale.com${result.url}`
              );
            }}
          >
            Copy link
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              handleReset();
            }}
          >
            Create another
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              handleReset();
              setOpen(false);
              router.refresh();
            }}
          >
            Done
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 border border-border rounded-sm p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
          New Invite
        </h2>
        <button
          onClick={() => {
            handleReset();
            setOpen(false);
          }}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>
      <Separator />

      <div className="space-y-2">
        <Label>Guests</Label>
        {guestNames.map((name, i) => (
          <div key={i} className="flex gap-2">
            <Input
              placeholder={`Guest ${i + 1} name`}
              value={name}
              onChange={(e) => updateName(i, e.target.value)}
            />
            {guestNames.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeGuest(i)}
                className="shrink-0 px-2"
              >
                &times;
              </Button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addGuest}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          + Add guest
        </button>
      </div>

      <div className="space-y-2">
        <Label>Mailing Address (optional)</Label>
        <Input
          placeholder="123 Main St, City, State ZIP"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="new-hotel"
          checked={hotelEligible}
          onCheckedChange={(v) => setHotelEligible(v === true)}
        />
        <Tooltip>
          <TooltipTrigger className="underline decoration-dotted underline-offset-4 decoration-muted-foreground/50 cursor-help text-sm font-medium">
            Hotel eligible
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs text-xs">
            Invite this guest to book at the Belmond (3 nights, Thu-Sat).
            Reserved for close friends and family. Rooms are scarce — we
            need bookings promptly as funds are held until the block fills.
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-2">
        <Label>Notes (optional)</Label>
        <Input
          placeholder="Internal notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <Button
        onClick={handleCreate}
        disabled={saving || guestNames.every((n) => !n.trim())}
        className="w-full"
      >
        {saving ? "Creating..." : "Create Invite"}
      </Button>
    </div>
  );
}
