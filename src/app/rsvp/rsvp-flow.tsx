"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { NoiseBackground } from "@/components/ui/noise-background";
import { BotanicalConfetti } from "@/components/botanicals";
import { NOISE_GRADIENT_COLORS } from "@/lib/constants";
import { lookupInvite, submitRsvp, type InviteData } from "./actions";
import { trackView, trackEvent } from "./track";
import { AttendToggle } from "./attend-toggle";
import { DietaryPicker } from "./dietary-picker";
import { NoiseInput } from "./noise-input";

// ── Main flow: code entry → form → done ──

export function RsvpFlow({ initialCode }: { initialCode?: string }) {
  const [step, setStep] = useState<"code" | "form" | "done">("code");
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [code, setCode] = useState(initialCode ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [completedAttending, setCompletedAttending] = useState(false);

  async function handleLookup(lookupCode?: string) {
    const c = lookupCode ?? code;
    if (!c.trim()) return;
    setLoading(true);
    setError("");
    const result = await lookupInvite(c);
    setLoading(false);
    if (!result) {
      setError("We couldn't find that code. Double-check and try again.");
      return;
    }
    setInvite(result);
    setStep("form");
    trackView(c);
    window.history.replaceState(null, "", `/rsvp/${c.trim().toUpperCase()}`);
  }

  // Auto-lookup when arriving via /rsvp/[code]
  // eslint-disable-next-line react-hooks/exhaustive-deps — initialCode is a server prop, stable across renders
  useEffect(() => { if (initialCode) handleLookup(initialCode); }, []);

  if (step === "done") {
    return (
      <>
        {completedAttending && <BotanicalConfetti />}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-6 py-12"
        >
          <p className="font-serif text-3xl font-light">
            {completedAttending ? "See you there" : "We'll miss you"}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {completedAttending
              ? "We can't wait to celebrate with you in San Miguel."
              : "Thanks for letting us know. We\u2019ll be thinking of you."}
          </p>
        </motion.div>
      </>
    );
  }

  if (step === "code" || !invite) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Enter your invite code</Label>
          <Input
            id="code"
            placeholder="e.g. EBR-TOVIK"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLookup()}
            className="text-center tracking-widest uppercase"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          onClick={() => handleLookup()}
          disabled={loading || !code.trim()}
          className="w-full"
        >
          {loading ? "Looking up..." : "Find my invite"}
        </Button>
      </div>
    );
  }

  return (
    <RsvpForm
      invite={invite}
      onComplete={(attending) => {
        setCompletedAttending(attending);
        setStep("done");
      }}
    />
  );
}

// ── RSVP Form ──

function RsvpForm({
  invite,
  onComplete,
}: {
  invite: InviteData;
  onComplete: (attending: boolean) => void;
}) {
  const [guestData, setGuestData] = useState(
    invite.guests.map((g) => ({
      id: g.id,
      name: g.name,
      coming: (g.attendingFriday ?? true) || (g.attendingSaturday ?? true),
      attendingFriday: g.attendingFriday ?? true,
      attendingSaturday: g.attendingSaturday ?? true,
      email: g.email ?? "",
      phone: g.phone ?? "",
      dietaryRestrictions: g.dietaryRestrictions ?? "",
      plusOneName: g.plusOneName ?? "",
    }))
  );
  const [hotelWillBook, setHotelWillBook] = useState<boolean | undefined>(
    invite.hotelBooking?.willBook ?? undefined
  );
  const [hotelAcknowledged, setHotelAcknowledged] = useState(
    invite.hotelBooking?.acknowledgedPolicy ?? false
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showHotelConfetti, setShowHotelConfetti] = useState(false);

  const attendingGuests = guestData.filter((g) => g.coming);
  const missingContact = attendingGuests.some(
    (g) => !g.email.trim() || !g.phone.trim()
  );
  const missingHotel =
    invite.hotelEligible &&
    attendingGuests.length > 0 &&
    hotelWillBook === undefined;
  const canSubmit = !missingContact && !missingHotel;

  function updateGuest(index: number, field: string, value: string | boolean) {
    setGuestData((prev) =>
      prev.map((g, i) => (i === index ? { ...g, [field]: value } : g))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      await submitRsvp({
        inviteId: invite.id,
        guests: guestData.map((g) => ({
          id: g.id,
          attendingFriday: g.coming ? g.attendingFriday : false,
          attendingSaturday: g.coming ? g.attendingSaturday : false,
          email: g.email,
          phone: g.phone,
          dietaryRestrictions: g.dietaryRestrictions,
          plusOneName: g.plusOneName,
        })),
        hotelWillBook: invite.hotelEligible ? hotelWillBook : undefined,
        hotelAcknowledged: invite.hotelEligible ? hotelAcknowledged : undefined,
      });
      onComplete(guestData.some((g) => g.coming));
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {showHotelConfetti && <BotanicalConfetti duration={3500} />}
      <form onSubmit={handleSubmit} className="space-y-10">
        <EventSummary />
        <Separator />

        {guestData.map((guest, i) => (
          <div key={guest.id} className="space-y-4">
            {i > 0 && <Separator />}
            <p className="font-serif text-xl font-light">{guest.name}</p>

            <AttendToggle
              attending={guest.coming}
              onChange={(v) => {
                updateGuest(i, "coming", v);
                if (v) {
                  updateGuest(i, "attendingFriday", true);
                  updateGuest(i, "attendingSaturday", true);
                }
              }}
            />

            <AnimatePresence initial={false}>
              {guest.coming && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 pt-2">
                    <EventCheckboxes
                      guestIndex={i}
                      attendingFriday={guest.attendingFriday}
                      attendingSaturday={guest.attendingSaturday}
                      onUpdate={updateGuest}
                    />
                    <ContactFields
                      guestIndex={i}
                      email={guest.email}
                      phone={guest.phone}
                      onUpdate={updateGuest}
                    />
                    {guestData.length < 2 && (
                      <div className="space-y-2">
                        <Label htmlFor={`plus-one-${i}`}>+1 Name</Label>
                        <NoiseInput
                          id={`plus-one-${i}`}
                          placeholder="Leave blank if no +1"
                          value={guest.plusOneName}
                          onChange={(e) =>
                            updateGuest(i, "plusOneName", e.target.value)
                          }
                        />
                      </div>
                    )}
                    <DietaryPicker
                      value={guest.dietaryRestrictions}
                      onChange={(v) =>
                        updateGuest(i, "dietaryRestrictions", v)
                      }
                      id={`dietary-${i}`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {invite.hotelEligible && guestData.some((g) => g.coming) && (
          <HotelSection
            inviteId={invite.id}
            hotelWillBook={hotelWillBook}
            hotelAcknowledged={hotelAcknowledged}
            onWillBookChange={(v) => {
              setHotelWillBook(v);
              if (v) setShowHotelConfetti(true);
            }}
            onAcknowledgedChange={setHotelAcknowledged}
          />
        )}

        {submitError && (
          <p className="text-sm text-destructive text-center">{submitError}</p>
        )}
        <Button
          type="submit"
          disabled={submitting || !canSubmit}
          className="w-full"
        >
          {submitting ? "Submitting..." : "Submit RSVP"}
        </Button>
      </form>
    </>
  );
}

// ── Sub-components ──

function EventSummary() {
  return (
    <div className="space-y-3 text-sm text-muted-foreground">
      <div className="flex justify-between">
        <span>Ceremony & Reception</span>
        <span className="text-foreground">Saturday, February 27, 2027</span>
      </div>
      <div className="flex justify-between">
        <span>Welcome Party</span>
        <span className="text-foreground">Friday, February 26, 3–8 PM</span>
      </div>
      <div className="flex justify-between">
        <span>Venue</span>
        <span className="text-foreground">Luna Escondida</span>
      </div>
      <div className="flex justify-between">
        <span>Location</span>
        <span className="text-foreground">San Miguel de Allende, MX</span>
      </div>
      <div className="flex justify-between">
        <span>Dress Code</span>
        <span className="text-foreground">James Bond Chic</span>
      </div>
    </div>
  );
}

function EventCheckboxes({
  guestIndex,
  attendingFriday,
  attendingSaturday,
  onUpdate,
}: {
  guestIndex: number;
  attendingFriday: boolean;
  attendingSaturday: boolean;
  onUpdate: (index: number, field: string, value: boolean) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground">Which events?</Label>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id={`sat-${guestIndex}`}
            checked={attendingSaturday}
            onCheckedChange={(v) =>
              onUpdate(guestIndex, "attendingSaturday", v === true)
            }
          />
          <Label htmlFor={`sat-${guestIndex}`} className="font-normal">
            Saturday Wedding &mdash; Feb 27
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id={`fri-${guestIndex}`}
            checked={attendingFriday}
            onCheckedChange={(v) =>
              onUpdate(guestIndex, "attendingFriday", v === true)
            }
          />
          <Label htmlFor={`fri-${guestIndex}`} className="font-normal">
            Friday Pool Party &mdash; Feb 26, 3&ndash;8 PM
          </Label>
        </div>
      </div>
    </div>
  );
}

function ContactFields({
  guestIndex,
  email,
  phone,
  onUpdate,
}: {
  guestIndex: number;
  email: string;
  phone: string;
  onUpdate: (index: number, field: string, value: string) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-0">
        <Label htmlFor={`email-${guestIndex}`}>Email</Label>
        <Label htmlFor={`phone-${guestIndex}`} className="hidden sm:block">
          Phone
        </Label>
      </div>
      <div className="relative rounded-sm overflow-hidden -mt-2">
        <NoiseBackground
          containerClassName="absolute inset-0"
          gradientColors={[...NOISE_GRADIENT_COLORS]}
          noiseIntensity={0.1}
          speed={0.03}
        >
          <div className="absolute inset-0 shadow-[inset_0_1px_4px_rgba(0,0,0,0.1),inset_0_0_8px_rgba(0,0,0,0.04)] pointer-events-none" />
        </NoiseBackground>
        <div className="relative z-10 flex flex-col sm:flex-row gap-[3px] bg-background p-[3px]">
          <div className="flex-1 space-y-2 sm:space-y-0">
            <Label htmlFor={`phone-${guestIndex}`} className="sm:hidden">
              Phone
            </Label>
            <Input
              id={`email-${guestIndex}`}
              type="email"
              placeholder="james@bond.com"
              value={email}
              onChange={(e) => onUpdate(guestIndex, "email", e.target.value)}
              className="bg-transparent border-0 shadow-none focus-visible:ring-0 placeholder:text-foreground/25"
            />
          </div>
          <div className="flex-1">
            <Input
              id={`phone-${guestIndex}`}
              type="tel"
              placeholder="+1 555 123 4567"
              value={phone}
              onChange={(e) => onUpdate(guestIndex, "phone", e.target.value)}
              className="bg-transparent border-0 shadow-none focus-visible:ring-0 placeholder:text-foreground/25"
            />
          </div>
        </div>
      </div>
    </>
  );
}

function HotelSection({
  inviteId,
  hotelWillBook,
  hotelAcknowledged,
  onWillBookChange,
  onAcknowledgedChange,
}: {
  inviteId: string;
  hotelWillBook: boolean | undefined;
  hotelAcknowledged: boolean;
  onWillBookChange: (v: boolean) => void;
  onAcknowledgedChange: (v: boolean) => void;
}) {
  return (
    <>
      <Separator />
      <div className="space-y-4">
        <div className="space-y-3">
          <p className="font-serif text-xl font-light">
            Belmond Casa de Sierra Nevada
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You&apos;re invited to book a room at the Belmond with the wedding
            party. The block is for 3 nights: Thursday Feb 25, Friday Feb 26,
            and Saturday Feb 27. No pressure &mdash; we know it&apos;s pricey.
          </p>
          <a
            href="https://www.belmond.com/hotels/north-america/mexico/belmond-casa-de-sierra-nevada"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm underline underline-offset-4 decoration-muted-foreground/50 hover:decoration-foreground transition-colors"
            onClick={() => trackEvent(inviteId, "belmond_click")}
          >
            View the Belmond
          </a>
          <div className="grid grid-cols-2 overflow-hidden rounded-sm pt-1">
            <div className="relative aspect-[9/6]">
              <Image
                src="/images/belmond-aerial.jpg"
                alt="Belmond Casa de Sierra Nevada aerial view"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 45vw, 220px"
              />
            </div>
            <div className="relative aspect-[9/6]">
              <Image
                src="/images/belmond-dining.jpg"
                alt="Belmond Casa de Sierra Nevada dining"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 45vw, 220px"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Would you like to book?</Label>
          <RadioGroup
            value={
              hotelWillBook === undefined
                ? ""
                : hotelWillBook
                  ? "yes"
                  : "no"
            }
            onValueChange={(v) => onWillBookChange(v === "yes")}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yes" id="hotel-yes" />
              <Label htmlFor="hotel-yes" className="font-normal">
                Yes, I&apos;ll book
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="no" id="hotel-no" />
              <Label htmlFor="hotel-no" className="font-normal">
                No thanks
              </Label>
            </div>
          </RadioGroup>
        </div>

        <AnimatePresence initial={false}>
          {hotelWillBook && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="flex items-start gap-2 pt-1">
                <Checkbox
                  id="hotel-ack"
                  checked={hotelAcknowledged}
                  onCheckedChange={(v) => onAcknowledgedChange(v === true)}
                />
                <Label
                  htmlFor="hotel-ack"
                  className="text-sm font-normal leading-relaxed"
                >
                  I understand that booking promptly helps Sam & Emily and am
                  consenting to being pestered about it.
                </Label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
