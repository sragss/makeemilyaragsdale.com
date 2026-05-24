"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createRsvp } from "./create-actions";
import { useRouter } from "next/navigation";

export function CreateRsvpForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [guestNames, setGuestNames] = useState(["", ""]);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<{
    id: string;
    guestNames: string[];
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
    const res = await createRsvp({
      guestNames: names,
      address: address.trim() || null,
      notes: notes.trim() || null,
    });
    setSaving(false);

    if (res.id) {
      setResult({
        id: res.id,
        guestNames: names,
      });
    }
  }

  function handleReset() {
    setGuestNames(["", ""]);
    setAddress("");
    setNotes("");
    setResult(null);
  }

  return (
    <>
      {!open && (
        <Button variant="outline" onClick={() => setOpen(true)}>
          + New RSVP
        </Button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {result ? (
              <div className="space-y-4 border border-border rounded-sm p-4">
                <p className="text-sm">
                  Created RSVP for{" "}
                  <span className="font-medium">
                    {result.guestNames.join(" & ")}
                  </span>
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      router.push(`/admin/rsvp/${result.id}`);
                    }}
                  >
                    Open
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReset()}
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
            ) : (
              <div className="space-y-4 border border-border rounded-sm p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
                    New RSVP
                  </h2>
                  <button
                    onClick={() => {
                      handleReset();
                      setOpen(false);
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
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
                    className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
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
                  {saving ? "Creating..." : "Create RSVP"}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
