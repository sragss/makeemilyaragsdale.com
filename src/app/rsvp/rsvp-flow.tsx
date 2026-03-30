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
import { BotanicalConfetti } from "@/components/botanicals";
import { NoiseBackground } from "@/components/ui/noise-background";
import { lookupInvite, submitRsvp, type InviteData } from "./actions";
import { trackView, trackEvent } from "./track";

export function RsvpFlow({ initialCode }: { initialCode?: string }) {
  const [step, setStep] = useState<"code" | "form" | "done">(
    initialCode ? "code" : "code"
  );
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [code, setCode] = useState(initialCode ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [anyAttending, setAnyAttending] = useState(false);

  useEffect(() => {
    if (initialCode) {
      handleLookup(initialCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // Track the view
    trackView(c);
    // Update URL so refresh persists the code
    const normalized = c.trim().toUpperCase();
    window.history.replaceState(null, "", `/rsvp/${normalized}`);
  }

  if (step === "done") {
    return (
      <>
        {anyAttending && <BotanicalConfetti />}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-6 py-12"
        >
          <p className="font-serif text-3xl font-light">
            {anyAttending ? "See you there" : "We'll miss you"}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {anyAttending
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
        setAnyAttending(attending);
        setStep("done");
      }}
    />
  );
}

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
] as const;

function parseDietary(value: string): { tags: string[]; custom: string } {
  if (!value) return { tags: [], custom: "" };
  const parts = value.split(",").map((s) => s.trim()).filter(Boolean);
  const tags: string[] = [];
  const custom: string[] = [];
  for (const p of parts) {
    if (DIETARY_OPTIONS.includes(p as (typeof DIETARY_OPTIONS)[number])) {
      tags.push(p);
    } else {
      custom.push(p);
    }
  }
  return { tags, custom: custom.join(", ") };
}

function serializeDietary(tags: string[], custom: string): string {
  const parts = [...tags];
  if (custom.trim()) parts.push(custom.trim());
  return parts.join(", ");
}

function DietaryPicker({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  id: string;
}) {
  const { tags, custom } = parseDietary(value);
  const [showCustom, setShowCustom] = useState(custom.length > 0);

  function toggleTag(tag: string) {
    const next = tags.includes(tag)
      ? tags.filter((t) => t !== tag)
      : [...tags, tag];
    onChange(serializeDietary(next, custom));
  }

  function updateCustom(v: string) {
    onChange(serializeDietary(tags, v));
  }

  const allOptions = [...DIETARY_OPTIONS, "Other" as const];

  return (
    <div className="space-y-2">
      <Label>Dietary needs</Label>
      <div className="relative rounded-sm overflow-hidden">
        {/* Shared noise background behind everything */}
        <NoiseBackground
          containerClassName="absolute inset-0"
          gradientColors={[
            "rgb(180, 140, 100)",
            "rgb(160, 120, 80)",
            "rgb(200, 160, 110)",
          ]}
          noiseIntensity={0.1}
          speed={0.03}
        >
          <div className="absolute inset-0 shadow-[inset_0_1px_4px_rgba(0,0,0,0.1),inset_0_0_8px_rgba(0,0,0,0.04)] pointer-events-none" />
        </NoiseBackground>

        {/* Pills + Other input with page-colored dividers */}
        <div className="relative z-10 flex flex-col gap-[3px] bg-background p-[3px]">
          <div className="flex flex-wrap gap-[3px]">
            {allOptions.map((opt) => {
              const isOther = opt === "Other";
              const selected = isOther ? showCustom : tags.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => isOther ? setShowCustom(!showCustom) : toggleTag(opt)}
                  className="relative px-3 py-1.5 text-xs cursor-pointer bg-transparent"
                >
                  <AnimatePresence>
                    {selected && (
                      <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 28 }}
                        className="absolute inset-0 bg-primary rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]"
                      />
                    )}
                  </AnimatePresence>
                  <span className={`relative z-10 ${selected ? "text-primary-foreground font-medium" : "text-foreground/70 hover:text-foreground"} transition-colors`}>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
          <AnimatePresence initial={false}>
            {showCustom && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <Input
                  id={id}
                  placeholder="e.g. can only eat goose meat"
                  value={custom}
                  onChange={(e) => updateCustom(e.target.value)}
                  className="bg-transparent border-0 shadow-none focus-visible:ring-0 placeholder:text-foreground/25"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function NoiseInput(props: React.ComponentProps<typeof Input>) {
  return (
    <NoiseBackground
      containerClassName="rounded-sm"
      gradientColors={[
        "rgb(180, 140, 100)",
        "rgb(160, 120, 80)",
        "rgb(200, 160, 110)",
      ]}
      noiseIntensity={0.1}
      speed={0.03}
    >
      <div className="absolute inset-0 z-[5] shadow-[inset_0_1px_4px_rgba(0,0,0,0.1),inset_0_0_8px_rgba(0,0,0,0.04)] pointer-events-none rounded-sm" />
      <Input
        {...props}
        className="relative z-10 bg-transparent border-0 shadow-none focus-visible:ring-0 placeholder:text-foreground/25"
      />
    </NoiseBackground>
  );
}

function AttendToggle({
  attending,
  onChange,
}: {
  attending: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <NoiseBackground
      containerClassName="rounded-sm cursor-pointer transition-shadow duration-200 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)]"
      gradientColors={[
        "rgb(180, 140, 100)",
        "rgb(160, 120, 80)",
        "rgb(200, 160, 110)",
      ]}
      noiseIntensity={0.15}
      speed={0.04}
    >
      {/* Inset shadow */}
      <div className="absolute inset-0 z-[5] shadow-[inset_0_2px_6px_rgba(0,0,0,0.15),inset_0_0_12px_rgba(0,0,0,0.06)] pointer-events-none rounded-sm" />

      {/* Sliding indicator — inset by the padding so noise peeks around edges */}
      <motion.div
        className="absolute top-1 bottom-1 w-[calc(50%-8px)] bg-primary rounded-[2px] z-[6] shadow-[0_2px_8px_rgba(0,0,0,0.25),0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]"
        animate={{ x: attending ? 4 : "calc(100% + 12px)" }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 28,
          mass: 0.8,
        }}
      />

      {/* Labels */}
      <div className="relative z-[11] flex">
        <button
          type="button"
          onClick={() => onChange(true)}
          className="flex-1 py-3 text-center cursor-pointer group/btn"
        >
          <motion.span
            animate={{ color: attending ? "var(--primary-foreground)" : "var(--foreground)" }}
            transition={{ duration: 0.2 }}
            className={`font-serif text-base font-semibold transition-opacity duration-150 ${!attending ? "group-hover/btn:opacity-70" : ""}`}
          >
            Joyfully accept
          </motion.span>
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className="flex-1 py-3 text-center cursor-pointer group/btn"
        >
          <motion.span
            animate={{ color: !attending ? "var(--primary-foreground)" : "var(--foreground)" }}
            transition={{ duration: 0.2 }}
            className={`font-serif text-base font-semibold transition-opacity duration-150 ${attending ? "group-hover/btn:opacity-70" : ""}`}
          >
            Regretfully decline
          </motion.span>
        </button>
      </div>
    </NoiseBackground>
  );
}

function RsvpForm({
  invite,
  onComplete,
}: {
  invite: InviteData;
  onComplete: (anyAttending: boolean) => void;
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

  function updateGuest(
    index: number,
    field: string,
    value: string | boolean
  ) {
    setGuestData((prev) =>
      prev.map((g, i) => (i === index ? { ...g, [field]: value } : g))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
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
    setSubmitting(false);
    onComplete(guestData.some((g) => g.coming));
  }

  return (
    <>
    {showHotelConfetti && <BotanicalConfetti duration={3500} />}
    <form onSubmit={handleSubmit} className="space-y-10">
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
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Which events?</Label>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`sat-${i}`}
                          checked={guest.attendingSaturday}
                          onCheckedChange={(v) =>
                            updateGuest(i, "attendingSaturday", v === true)
                          }
                        />
                        <Label htmlFor={`sat-${i}`} className="font-normal">
                          Saturday Wedding &mdash; Feb 27
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`fri-${i}`}
                          checked={guest.attendingFriday}
                          onCheckedChange={(v) =>
                            updateGuest(i, "attendingFriday", v === true)
                          }
                        />
                        <Label htmlFor={`fri-${i}`} className="font-normal">
                          Friday Pool Party &mdash; Feb 26, 3&ndash;8 PM
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-0">
                    <Label htmlFor={`email-${i}`}>Email</Label>
                    <Label htmlFor={`phone-${i}`} className="hidden sm:block">Phone</Label>
                  </div>
                  <div className="relative rounded-sm overflow-hidden -mt-2">
                    <NoiseBackground
                      containerClassName="absolute inset-0"
                      gradientColors={[
                        "rgb(180, 140, 100)",
                        "rgb(160, 120, 80)",
                        "rgb(200, 160, 110)",
                      ]}
                      noiseIntensity={0.1}
                      speed={0.03}
                    >
                      <div className="absolute inset-0 shadow-[inset_0_1px_4px_rgba(0,0,0,0.1),inset_0_0_8px_rgba(0,0,0,0.04)] pointer-events-none" />
                    </NoiseBackground>
                    <div className="relative z-10 flex flex-col sm:flex-row gap-[3px] bg-background p-[3px]">
                      <div className="flex-1 space-y-2 sm:space-y-0">
                        <Label htmlFor={`phone-${i}`} className="sm:hidden">Phone</Label>
                        <Input
                          id={`email-${i}`}
                          type="email"
                          placeholder="james@bond.com"
                          value={guest.email}
                          onChange={(e) =>
                            updateGuest(i, "email", e.target.value)
                          }
                          className="bg-transparent border-0 shadow-none focus-visible:ring-0 placeholder:text-foreground/25"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          id={`phone-${i}`}
                          type="tel"
                          placeholder="+1 555 123 4567"
                          value={guest.phone}
                          onChange={(e) =>
                            updateGuest(i, "phone", e.target.value)
                          }
                          className="bg-transparent border-0 shadow-none focus-visible:ring-0 placeholder:text-foreground/25"
                        />
                      </div>
                    </div>
                  </div>

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
        <>
          <Separator />
          <div className="space-y-4">
            <div className="space-y-3">
              <p className="font-serif text-xl font-light">
                Belmond Casa de Sierra Nevada
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You&apos;re invited to book a room at the Belmond with the
                wedding party. The block is for 3 nights: Thursday Feb 25,
                Friday Feb 26, and Saturday Feb 27. No pressure &mdash; we
                know it&apos;s pricey.
              </p>
              <a
                href="https://www.belmond.com/hotels/north-america/mexico/belmond-casa-de-sierra-nevada"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm underline underline-offset-4 decoration-muted-foreground/50 hover:decoration-foreground transition-colors"
                onClick={() => trackEvent(invite.id, "belmond_click")}
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
                onValueChange={(v) => {
                  const yes = v === "yes";
                  setHotelWillBook(yes);
                  if (yes) setShowHotelConfetti(true);
                }}
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
                      onCheckedChange={(v) =>
                        setHotelAcknowledged(v === true)
                      }
                    />
                    <Label
                      htmlFor="hotel-ack"
                      className="text-sm font-normal leading-relaxed"
                    >
                      I understand that booking promptly helps Sam & Emily
                      and am consenting to being pestered about it.
                    </Label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      <Button type="submit" disabled={submitting || !canSubmit} className="w-full">
        {submitting ? "Submitting..." : "Submit RSVP"}
      </Button>
    </form>
    </>
  );
}
