"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, PlusIcon, XIcon } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import { BotanicalConfetti } from "@/components/botanicals";
import { SAndELogo } from "@/components/logos";
import { submitRsvp } from "./actions";
import { AttendToggle } from "./attend-toggle";
import { DietaryPicker } from "./dietary-picker";
import { MainCoursePicker } from "./main-course-picker";

interface GuestFormData {
  clientId: string;
  name: string;
  coming: boolean;
  email: string;
  phone: string;
  mainCoursePreference: string;
  dietaryRestrictions: string;
}

function createGuest(index: number): GuestFormData {
  return {
    clientId: `guest-${index}`,
    name: "",
    coming: true,
    email: "",
    phone: "",
    mainCoursePreference: "",
    dietaryRestrictions: "",
  };
}

export function RsvpFlow() {
  const [step, setStep] = useState<"form" | "done">("form");
  const [completedAttending, setCompletedAttending] = useState(false);

  if (step === "done") {
    return (
      <>
        {completedAttending && <BotanicalConfetti />}
        <InvitationCard>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="py-8 text-center"
          >
            <p className="font-edict text-[10px] uppercase tracking-[0.45em] text-garden-cream/70">
              Reply received
            </p>
            <h2 className="mt-4 font-eros text-5xl font-normal uppercase leading-none text-garden-cream sm:text-6xl">
              {completedAttending ? "See you there" : "We'll miss you"}
            </h2>
            <p className="mx-auto mt-6 max-w-sm font-serif text-lg italic leading-snug text-garden-cream/88">
              {completedAttending
                ? "We can't wait to celebrate with you in San Miguel."
                : "Thanks for letting us know. We'll be thinking of you."}
            </p>
          </motion.div>
        </InvitationCard>
      </>
    );
  }

  return (
    <RsvpForm
      onComplete={(attending) => {
        setCompletedAttending(attending);
        setStep("done");
      }}
    />
  );
}

function RsvpForm({ onComplete }: { onComplete: (attending: boolean) => void }) {
  const haptics = useWebHaptics();
  const [guestData, setGuestData] = useState<GuestFormData[]>([
    createGuest(1),
  ]);
  const [attendingFriday, setAttendingFriday] = useState(true);
  const [attendingSaturday, setAttendingSaturday] = useState(true);
  const [hotelWillBook, setHotelWillBook] = useState<boolean | undefined>();
  const [hotelAcknowledged, setHotelAcknowledged] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showHotelConfetti, setShowHotelConfetti] = useState(false);

  const namedGuests = guestData.filter((guest) => guest.name.trim());
  const acceptedGuests = namedGuests.filter((guest) => guest.coming);
  const acceptedGuestEntries = guestData
    .map((guest, index) => ({ guest, index }))
    .filter(({ guest }) => guest.name.trim() && guest.coming);
  const missingContact = acceptedGuests.some(
    (guest) => !guest.email.trim() || !guest.phone.trim()
  );
  const missingEventSelection =
    acceptedGuests.length > 0 && !attendingFriday && !attendingSaturday;
  const missingMainCourse = acceptedGuests.some(
    (guest) => !guest.mainCoursePreference.trim()
  );
  const missingHotel = acceptedGuests.length > 0 && hotelWillBook === undefined;
  const missingHotelAcknowledgement =
    acceptedGuests.length > 0 && hotelWillBook === true && !hotelAcknowledged;
  const canSubmit =
    namedGuests.length > 0 &&
    !missingContact &&
    !missingEventSelection &&
    !missingMainCourse &&
    !missingHotel &&
    !missingHotelAcknowledgement &&
    !submitting;

  function updateGuest(
    index: number,
    field: keyof GuestFormData,
    value: string | boolean
  ) {
    setGuestData((prev) =>
      prev.map((guest, i) =>
        i === index ? { ...guest, [field]: value } : guest
      )
    );
  }

  function addGuest() {
    setGuestData((prev) => [
      ...prev,
      createGuest(prev.length + 1 + Math.floor(Math.random() * 100000)),
    ]);
  }

  function removeGuest(index: number) {
    setGuestData((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      const guests = namedGuests.map((guest) => ({
        name: guest.name,
        attendingFriday: guest.coming ? attendingFriday : false,
        attendingSaturday: guest.coming ? attendingSaturday : false,
        email: guest.email,
        phone: guest.phone,
        mainCoursePreference: guest.mainCoursePreference,
        dietaryRestrictions: guest.dietaryRestrictions,
      }));

      await submitRsvp({
        guests,
        hotelWillBook:
          acceptedGuests.length > 0 ? hotelWillBook : undefined,
        hotelAcknowledged:
          acceptedGuests.length > 0 ? hotelAcknowledged : undefined,
      });
      void haptics.trigger("success");
      onComplete(acceptedGuests.length > 0);
    } catch {
      void haptics.trigger("error");
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {showHotelConfetti && (
        <BotanicalConfetti
          duration={3500}
          onComplete={() => setShowHotelConfetti(false)}
        />
      )}
      <InvitationCard>
        <header className="mb-9 text-center">
          <p className="font-edict text-[10px] uppercase tracking-[0.45em] text-garden-cream/70">
            Emily & Sam
          </p>
          <h2 className="mt-3 font-eros text-4xl font-normal uppercase leading-none text-garden-cream sm:text-6xl">
            RSVP
          </h2>
          <p className="mx-auto mt-4 max-w-sm font-serif text-base italic leading-snug text-garden-cream/82">
            San Miguel de Allende
            <br />
            February 26-27, 2027
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-9"
        >
          <EventSummary />

          <section className="space-y-6">
            <SectionHeading eyebrow="Your party" title="Who's coming?" />

            {guestData.map((guest, index) => (
              <GuestAttendance
                key={guest.clientId}
                guest={guest}
                index={index}
                canRemove={guestData.length > 1}
                onRemove={() => removeGuest(index)}
                onUpdate={updateGuest}
              />
            ))}

            <button
              type="button"
              onClick={addGuest}
              className="flex min-h-14 w-full items-center justify-center gap-2 border border-dashed border-garden-cream/45 px-4 py-4 font-edict text-[12px] uppercase tracking-[0.24em] text-garden-cream transition-colors hover:border-garden-cream hover:bg-garden-cream/10"
            >
              <PlusIcon aria-hidden className="size-4" />
              Add another guest
            </button>
          </section>

          {acceptedGuestEntries.length > 0 && (
            <section className="space-y-6 border-t border-garden-cream/25 pt-8">
              <SectionHeading eyebrow="Details" title="Meal & contact" />
              {acceptedGuestEntries.map(({ guest, index }) => (
                <GuestDetails
                  key={guest.clientId}
                  guest={guest}
                  index={index}
                  onUpdate={updateGuest}
                />
              ))}
            </section>
          )}

          {acceptedGuests.length > 0 && (
            <section className="border-t border-garden-cream/25 pt-8">
              <EventCheckboxes
                attendingFriday={attendingFriday}
                attendingSaturday={attendingSaturday}
                showError={missingEventSelection}
                onFridayChange={setAttendingFriday}
                onSaturdayChange={setAttendingSaturday}
              />
            </section>
          )}

          {acceptedGuests.length > 0 && (
            <HotelSection
              hotelWillBook={hotelWillBook}
              hotelAcknowledged={hotelAcknowledged}
              onWillBookChange={(value) => {
                setHotelWillBook(value);
                if (value) {
                  setShowHotelConfetti(true);
                } else {
                  setHotelAcknowledged(false);
                }
              }}
              onAcknowledgedChange={setHotelAcknowledged}
            />
          )}

          {submitError && (
            <p className="text-center font-serif text-sm italic text-[#ffe0d6]">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full border border-garden-cream bg-garden-cream px-6 py-3.5 font-edict text-[12px] font-medium uppercase tracking-[0.28em] text-garden-olive transition-colors hover:bg-transparent hover:text-garden-cream disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-garden-cream disabled:hover:text-garden-olive sm:px-8 sm:tracking-[0.34em]"
          >
            {submitting ? "Submitting" : "Send reply"}
          </button>
        </form>
      </InvitationCard>
    </>
  );
}

function InvitationCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden bg-garden-olive text-garden-cream shadow-[0_2px_6px_rgba(0,0,0,0.12),0_34px_80px_-22px_rgba(28,17,9,0.55)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage: "url(/images/noise.webp)",
          backgroundSize: "200px 200px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-2 border-[4px] border-double border-garden-cream/45 sm:inset-3 sm:border-[5px]"
      />
      <div className="relative px-5 py-9 sm:px-10 sm:py-12 lg:px-12">
        <div className="mb-7 flex justify-center sm:mb-8">
          <SAndELogo className="h-14 w-auto text-garden-cream sm:h-20" />
        </div>
        {children}
      </div>
    </div>
  );
}

function EventSummary() {
  const rows = [
    ["Welcome party", "Friday, February 26, 3-8 PM"],
    ["Ceremony & reception", "Saturday, February 27, 2027"],
    ["Venue", "Luna Escondida"],
    ["Location", "San Miguel de Allende, MX"],
    ["Dress", "Enchanted Garden"],
  ] as const;

  return (
    <dl className="border-y border-garden-cream/35 py-2">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="grid grid-cols-1 gap-1 border-b border-garden-cream/15 py-3 last:border-b-0 sm:grid-cols-[11rem_1fr] sm:gap-4"
        >
          <dt className="font-edict text-[10px] uppercase tracking-[0.34em] text-garden-cream/58">
            {label}
          </dt>
          <dd className="font-serif text-base leading-snug text-garden-cream">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function GuestAttendance({
  guest,
  index,
  canRemove,
  onRemove,
  onUpdate,
}: {
  guest: GuestFormData;
  index: number;
  canRemove: boolean;
  onRemove: () => void;
  onUpdate: (
    index: number,
    field: keyof GuestFormData,
    value: string | boolean
  ) => void;
}) {
  const name = guest.name.trim();

  return (
    <section className="space-y-4 border-t border-garden-cream/22 pt-6 first:border-t-0 first:pt-0">
      <div className="grid grid-cols-[1fr_auto] items-end gap-3">
        <FieldGroup
          htmlFor={`name-${guest.clientId}`}
          label="Invited guest name"
          required
        >
          <InvitationInput
            id={`name-${guest.clientId}`}
            placeholder="Full name"
            value={guest.name}
            onChange={(event) =>
              onUpdate(index, "name", event.target.value)
            }
          />
        </FieldGroup>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${name || "guest"}`}
            className="mb-1 flex size-9 shrink-0 items-center justify-center border border-garden-cream/35 text-garden-cream/75 transition-colors hover:border-garden-cream hover:bg-garden-cream hover:text-garden-olive focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-garden-cream"
          >
            <XIcon aria-hidden className="size-4" />
          </button>
        )}
      </div>

      <AttendToggle
        attending={guest.coming}
        onChange={(value) => onUpdate(index, "coming", value)}
      />
    </section>
  );
}

function GuestDetails({
  guest,
  index,
  onUpdate,
}: {
  guest: GuestFormData;
  index: number;
  onUpdate: (
    index: number,
    field: keyof GuestFormData,
    value: string | boolean
  ) => void;
}) {
  return (
    <section className="space-y-5 border-l border-garden-cream/25 pl-4 sm:pl-5">
      <p className="font-edict text-[10px] uppercase tracking-[0.32em] text-garden-cream/58">
        For {guest.name.trim()}
      </p>
      <MainCoursePicker
        value={guest.mainCoursePreference}
        onChange={(value) => onUpdate(index, "mainCoursePreference", value)}
        id={`main-course-${guest.clientId}`}
      />
      <DietaryPicker
        value={guest.dietaryRestrictions}
        onChange={(value) => onUpdate(index, "dietaryRestrictions", value)}
        id={`dietary-${guest.clientId}`}
      />
      <ContactFields
        guestId={guest.clientId}
        email={guest.email}
        phone={guest.phone}
        required={guest.coming}
        onEmailChange={(value) => onUpdate(index, "email", value)}
        onPhoneChange={(value) => onUpdate(index, "phone", value)}
      />
    </section>
  );
}

function EventCheckboxes({
  attendingFriday,
  attendingSaturday,
  showError,
  onFridayChange,
  onSaturdayChange,
}: {
  attendingFriday: boolean;
  attendingSaturday: boolean;
  showError: boolean;
  onFridayChange: (value: boolean) => void;
  onSaturdayChange: (value: boolean) => void;
}) {
  return (
    <div className="space-y-3">
      <FieldLabel>Events</FieldLabel>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <ChecklistChoice
          selected={attendingFriday}
          onClick={() => onFridayChange(!attendingFriday)}
          title="Friday pool party"
          detail="Friday, Feb 26, 3-8 PM"
        />
        <ChecklistChoice
          selected={attendingSaturday}
          onClick={() => onSaturdayChange(!attendingSaturday)}
          title="Saturday wedding"
          detail="Saturday, Feb 27"
        />
      </div>
      {showError && (
        <p className="font-serif text-sm italic leading-snug text-[#ffe0d6]">
          Choose at least one event, or mark each invited guest as declining.
        </p>
      )}
    </div>
  );
}

function ContactFields({
  guestId,
  email,
  phone,
  required,
  onEmailChange,
  onPhoneChange,
}: {
  guestId: string;
  email: string;
  phone: string;
  required: boolean;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <FieldGroup
        htmlFor={`email-${guestId}`}
        label="Email"
        required={required}
        optional={!required}
      >
        <InvitationInput
          id={`email-${guestId}`}
          type="email"
          placeholder="jane@example.com"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
        />
      </FieldGroup>
      <FieldGroup
        htmlFor={`phone-${guestId}`}
        label="Phone"
        required={required}
        optional={!required}
      >
        <InvitationInput
          id={`phone-${guestId}`}
          type="tel"
          placeholder="+1 555 123 4567"
          value={phone}
          onChange={(event) => onPhoneChange(event.target.value)}
        />
      </FieldGroup>
    </div>
  );
}

function HotelSection({
  hotelWillBook,
  hotelAcknowledged,
  onWillBookChange,
  onAcknowledgedChange,
}: {
  hotelWillBook: boolean | undefined;
  hotelAcknowledged: boolean;
  onWillBookChange: (value: boolean) => void;
  onAcknowledgedChange: (value: boolean) => void;
}) {
  return (
    <section className="space-y-5 border-t border-garden-cream/25 pt-8">
      <SectionHeading eyebrow="Stay" title="Belmond Casa de Sierra Nevada" />
      <p className="font-serif text-base leading-relaxed text-garden-cream/82">
        Planning to stay at the Belmond? We can send room-block details.
      </p>

      <div className="grid grid-cols-2 overflow-hidden border border-garden-cream/35">
        <div className="relative aspect-[9/6]">
          <Image
            src="/images/belmond-aerial.jpg"
            alt="Belmond Casa de Sierra Nevada aerial view"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 45vw, 220px"
          />
        </div>
        <div className="relative aspect-[9/6] border-l border-garden-cream/35">
          <Image
            src="/images/belmond-dining.jpg"
            alt="Belmond Casa de Sierra Nevada dining"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 45vw, 220px"
          />
        </div>
      </div>

      <a
        href="https://www.belmond.com/hotels/north-america/mexico/san-miguel-de-allende/belmond-casa-de-sierra-nevada/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block border border-garden-cream/55 px-4 py-2 font-edict text-[10px] uppercase tracking-[0.28em] text-garden-cream transition-colors hover:bg-garden-cream hover:text-garden-olive"
      >
        View the Belmond
      </a>

      <div className="space-y-3">
        <FieldLabel required>Room block</FieldLabel>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <ChoiceButton
            selected={hotelWillBook === true}
            onClick={() => onWillBookChange(true)}
          >
            Yes, send details
          </ChoiceButton>
          <ChoiceButton
            selected={hotelWillBook === false}
            onClick={() => onWillBookChange(false)}
          >
            No, I&apos;ll stay elsewhere
          </ChoiceButton>
        </div>
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
            <label
              className={`flex w-full cursor-pointer items-start gap-3 border px-4 py-3 text-left transition-colors ${
                hotelAcknowledged
                  ? "border-garden-cream bg-garden-cream/10"
                  : "border-garden-cream/30 hover:border-garden-cream/60"
              }`}
            >
              <input
                type="checkbox"
                checked={hotelAcknowledged}
                onChange={(event) => onAcknowledgedChange(event.target.checked)}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center border border-garden-cream/60 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-garden-cream/55 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-garden-olive ${
                  hotelAcknowledged
                    ? "bg-garden-cream text-garden-olive"
                    : "text-transparent"
                }`}
              >
                <CheckIcon aria-hidden className="size-3.5" />
              </span>
              <span className="space-y-1">
                <span className="block font-edict text-[10px] uppercase tracking-[0.28em] text-garden-cream">
                  Follow-up okay
                  <span className="ml-1 text-garden-cream/70">*</span>
                </span>
                <span className="block font-serif text-sm leading-relaxed text-garden-cream/82">
                  I understand the room block is limited.
                </span>
              </span>
            </label>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="space-y-1">
      <p className="font-edict text-[10px] uppercase tracking-[0.42em] text-garden-cream/55">
        {eyebrow}
      </p>
      <h3 className="font-serif text-[1.65rem] font-light leading-tight text-garden-cream sm:text-2xl">
        {title}
      </h3>
    </div>
  );
}

function FieldGroup({
  htmlFor,
  label,
  required = false,
  optional = false,
  children,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <FieldLabel htmlFor={htmlFor} required={required} optional={optional}>
        {label}
      </FieldLabel>
      {children}
    </div>
  );
}

function FieldLabel({
  htmlFor,
  required = false,
  optional = false,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  const className =
    "font-edict text-[10px] font-medium uppercase tracking-[0.36em] text-garden-cream";

  if (htmlFor) {
    return (
      <label htmlFor={htmlFor} className={className}>
        {children}
        {required && <span className="ml-1 text-garden-cream/70">*</span>}
        {optional && (
          <span className="ml-2 text-[0.75em] tracking-[0.18em] text-garden-cream/45">
            optional
          </span>
        )}
      </label>
    );
  }

  return (
    <p className={className}>
      {children}
      {required && <span className="ml-1 text-garden-cream/70">*</span>}
      {optional && (
        <span className="ml-2 text-[0.75em] tracking-[0.18em] text-garden-cream/45">
          optional
        </span>
      )}
    </p>
  );
}

function InvitationInput({
  className = "",
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={`w-full border-b border-garden-cream/40 bg-transparent py-2 font-serif text-base text-garden-cream placeholder:text-garden-cream/35 focus:border-garden-cream focus:outline-none ${className}`}
    />
  );
}

function ChoiceButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex min-h-14 items-center gap-3 border px-4 py-3 text-left font-serif text-base leading-snug transition-colors ${
        selected
          ? "border-garden-cream bg-garden-cream text-garden-olive"
          : "border-garden-cream/35 text-garden-cream hover:border-garden-cream/70 hover:bg-garden-cream/10"
      }`}
    >
      <span
        aria-hidden
        className="flex size-4 shrink-0 items-center justify-center rounded-full border border-current/70"
      >
        {selected && <span className="size-2 rounded-full bg-current" />}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </button>
  );
}

function ChecklistChoice({
  selected,
  onClick,
  title,
  detail,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  detail: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${selected ? "Remove" : "Add"} ${title}`}
      onClick={onClick}
      className={`flex min-h-16 w-full items-start gap-3 border px-3.5 py-3 text-left transition-colors ${
        selected
          ? "border-garden-cream bg-garden-cream text-garden-olive"
          : "border-garden-cream/35 text-garden-cream hover:border-garden-cream/70 hover:bg-garden-cream/10"
      }`}
    >
      <span
        aria-hidden
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center border border-current/70 ${
          selected ? "bg-current/10" : ""
        }`}
      >
        {selected && <CheckIcon className="size-3.5" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-edict text-[11px] uppercase leading-snug tracking-[0.22em]">
          {title}
        </span>
        <span className="mt-1 block font-serif text-sm italic leading-snug opacity-80">
          {detail}
        </span>
      </span>
    </button>
  );
}
