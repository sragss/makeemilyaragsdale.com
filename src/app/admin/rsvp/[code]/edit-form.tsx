"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { updateGuest, updateInvite, updateHotelBooking } from "./actions";
import { useRouter } from "next/navigation";

interface GuestData {
  id: string;
  name: string;
  attending: boolean | null;
  email: string | null;
  phone: string | null;
  dietaryRestrictions: string | null;
  plusOneName: string | null;
}

interface HotelData {
  willBook: boolean | null;
  acknowledgedPolicy: boolean;
  bookingComplete: boolean;
  bookingValue: string | null;
}

interface InviteData {
  id: string;
  code: string;
  hotelEligible: boolean;
  maxGuests: number;
  notes: string | null;
  address: string | null;
  guests: GuestData[];
  hotelBooking: HotelData | null;
}

export function EditForm({ invite }: { invite: InviteData }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [guestForms, setGuestForms] = useState(
    invite.guests.map((g) => ({ ...g }))
  );
  const [inviteForm, setInviteForm] = useState({
    hotelEligible: invite.hotelEligible,
    maxGuests: invite.maxGuests,
    notes: invite.notes ?? "",
    address: invite.address ?? "",
  });
  const [hotelForm, setHotelForm] = useState({
    willBook: invite.hotelBooking?.willBook ?? null,
    bookingComplete: invite.hotelBooking?.bookingComplete ?? false,
    bookingValue: invite.hotelBooking?.bookingValue ?? "",
  });

  function updateGuestField(
    index: number,
    field: string,
    value: string | boolean | null
  ) {
    setGuestForms((prev) =>
      prev.map((g, i) => (i === index ? { ...g, [field]: value } : g))
    );
  }

  async function handleSave() {
    setSaving(true);

    await updateInvite(invite.id, {
      hotelEligible: inviteForm.hotelEligible,
      maxGuests: inviteForm.maxGuests,
      notes: inviteForm.notes || null,
      address: inviteForm.address || null,
    });

    for (const g of guestForms) {
      await updateGuest(g.id, {
        name: g.name,
        attending: g.attending,
        email: g.email || null,
        phone: g.phone || null,
        dietaryRestrictions: g.dietaryRestrictions || null,
        plusOneName: g.plusOneName || null,
      });
    }

    if (inviteForm.hotelEligible) {
      await updateHotelBooking(invite.id, {
        willBook: hotelForm.willBook,
        bookingComplete: hotelForm.bookingComplete,
        bookingValue: hotelForm.bookingValue || null,
      });
    }

    setSaving(false);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {/* Invite settings */}
      <section className="space-y-4">
        <h2 className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
          Invite Settings
        </h2>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Max Guests</Label>
            <Input
              type="number"
              value={inviteForm.maxGuests}
              onChange={(e) =>
                setInviteForm((f) => ({
                  ...f,
                  maxGuests: parseInt(e.target.value) || 1,
                }))
              }
            />
          </div>
          <div className="space-y-2 flex items-end gap-2">
            <div className="flex items-center gap-2 pb-2">
              <Checkbox
                id="hotel-eligible"
                checked={inviteForm.hotelEligible}
                onCheckedChange={(v) =>
                  setInviteForm((f) => ({
                    ...f,
                    hotelEligible: v === true,
                  }))
                }
              />
              <Label htmlFor="hotel-eligible">Hotel eligible</Label>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Mailing Address</Label>
          <Input
            value={inviteForm.address}
            onChange={(e) =>
              setInviteForm((f) => ({ ...f, address: e.target.value }))
            }
            placeholder="123 Main St, City, State ZIP"
          />
        </div>
        <div className="space-y-2">
          <Label>Notes (internal)</Label>
          <Input
            value={inviteForm.notes}
            onChange={(e) =>
              setInviteForm((f) => ({ ...f, notes: e.target.value }))
            }
            placeholder="Internal notes..."
          />
        </div>
      </section>

      {/* Guests */}
      {guestForms.map((guest, i) => (
        <section key={guest.id} className="space-y-4">
          <h2 className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Guest {i + 1}
          </h2>
          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={guest.name}
                onChange={(e) => updateGuestField(i, "name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Attending</Label>
              <select
                value={
                  guest.attending === null
                    ? "pending"
                    : guest.attending
                      ? "yes"
                      : "no"
                }
                onChange={(e) => {
                  const v = e.target.value;
                  updateGuestField(
                    i,
                    "attending",
                    v === "pending" ? null : v === "yes"
                  );
                }}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={guest.email ?? ""}
                onChange={(e) => updateGuestField(i, "email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={guest.phone ?? ""}
                onChange={(e) => updateGuestField(i, "phone", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dietary</Label>
              <Input
                value={guest.dietaryRestrictions ?? ""}
                onChange={(e) =>
                  updateGuestField(i, "dietaryRestrictions", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>+1 Name</Label>
              <Input
                value={guest.plusOneName ?? ""}
                onChange={(e) =>
                  updateGuestField(i, "plusOneName", e.target.value)
                }
              />
            </div>
          </div>
        </section>
      ))}

      {/* Hotel Booking */}
      {inviteForm.hotelEligible && (
        <section className="space-y-4">
          <h2 className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Hotel Booking
          </h2>
          <Separator />

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Will Book</Label>
              <select
                value={
                  hotelForm.willBook === null
                    ? "pending"
                    : hotelForm.willBook
                      ? "yes"
                      : "no"
                }
                onChange={(e) => {
                  const v = e.target.value;
                  setHotelForm((f) => ({
                    ...f,
                    willBook: v === "pending" ? null : v === "yes",
                  }));
                }}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Booking Value ($)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={hotelForm.bookingValue}
                onChange={(e) =>
                  setHotelForm((f) => ({
                    ...f,
                    bookingValue: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex items-end pb-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="booking-complete"
                  checked={hotelForm.bookingComplete}
                  onCheckedChange={(v) =>
                    setHotelForm((f) => ({
                      ...f,
                      bookingComplete: v === true,
                    }))
                  }
                />
                <Label htmlFor="booking-complete">Booking complete</Label>
              </div>
            </div>
          </div>
        </section>
      )}

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
