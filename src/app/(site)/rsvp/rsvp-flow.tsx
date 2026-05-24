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

const RSVP_STEPS = [
  {
    id: "details",
    label: "Details",
    eyebrow: "Weekend",
    title: "The weekend",
  },
  { id: "party", label: "Party", eyebrow: "Your party", title: "Who's coming?" },
  { id: "contact", label: "Contact", eyebrow: "Follow-up", title: "Contact" },
  { id: "meal", label: "Meal", eyebrow: "Dinner", title: "Meal preferences" },
  { id: "stay", label: "Stay", eyebrow: "Stay", title: "Belmond" },
] as const;

type RsvpStep = (typeof RSVP_STEPS)[number]["id"];

const panelVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction >= 0 ? 28 : -28,
    filter: "blur(2px)",
  }),
  animate: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction >= 0 ? -28 : 28,
    filter: "blur(2px)",
  }),
};

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
            className="py-9 text-center"
          >
            <p className="font-edict text-[11px] uppercase tracking-[0.38em] text-garden-cream/70 sm:text-[10px] sm:tracking-[0.45em]">
              Reply received
            </p>
            <h2 className="mt-4 font-eros text-[3.35rem] font-normal uppercase leading-none text-garden-cream sm:text-6xl">
              {completedAttending ? "See you there" : "We'll miss you"}
            </h2>
            <p className="mx-auto mt-6 max-w-sm font-serif text-xl italic leading-snug text-garden-cream/88 sm:text-lg">
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
  const [currentStep, setCurrentStep] = useState<RsvpStep>("details");
  const [stepDirection, setStepDirection] = useState(1);
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
  const hasPotentialAcceptedGuests = guestData.some((guest) => guest.coming);
  const acceptedGuestEntries = guestData
    .map((guest, index) => ({ guest, index }))
    .filter(({ guest }) => guest.name.trim() && guest.coming);
  const missingEventSelection =
    acceptedGuests.length > 0 && !attendingFriday && !attendingSaturday;
  const missingMainCourse = acceptedGuests.some(
    (guest) => !guest.mainCoursePreference.trim()
  );
  const missingHotel = acceptedGuests.length > 0 && hotelWillBook === undefined;
  const missingHotelAcknowledgement =
    acceptedGuests.length > 0 && hotelWillBook === true && !hotelAcknowledged;
  const hasAcceptedGuests = acceptedGuests.length > 0;
  const partyComplete =
    namedGuests.length > 0 && (!hasAcceptedGuests || !missingEventSelection);
  const contactComplete = true;
  const mealComplete = !hasAcceptedGuests || !missingMainCourse;
  const stayComplete =
    !hasAcceptedGuests || (!missingHotel && !missingHotelAcknowledgement);
  const stepComplete: Record<RsvpStep, boolean> = {
    details: true,
    party: partyComplete,
    contact: contactComplete,
    meal: mealComplete,
    stay: stayComplete,
  };
  const currentStepIndex = RSVP_STEPS.findIndex(
    (step) => step.id === currentStep
  );
  const furthestStepIndex = getFurthestStepIndex({
    hasAcceptedGuests,
    partyComplete,
    mealComplete,
  });
  const currentStepIsFinal =
    currentStep === "stay" ||
    (currentStep === "party" && namedGuests.length > 0 && !hasAcceptedGuests);
  const currentStepHint = getStepHint({
    currentStep,
    namedGuestCount: namedGuests.length,
    hasAcceptedGuests,
    missingEventSelection,
    missingMainCourse,
    missingHotel,
    missingHotelAcknowledgement,
  });
  const canSubmit =
    namedGuests.length > 0 &&
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

  function goToStep(nextStep: RsvpStep) {
    const nextStepIndex = RSVP_STEPS.findIndex((step) => step.id === nextStep);
    if (nextStepIndex < 0 || nextStepIndex > furthestStepIndex) return;

    setSubmitError("");
    setStepDirection(nextStepIndex >= currentStepIndex ? 1 : -1);
    setCurrentStep(nextStep);
  }

  function goBack() {
    const previousStep = RSVP_STEPS[currentStepIndex - 1];
    if (!previousStep) return;
    goToStep(previousStep.id);
  }

  function goNext() {
    const nextStep = RSVP_STEPS[currentStepIndex + 1];
    if (!nextStep) return;
    goToStep(nextStep.id);
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
        <header className="mb-10 text-center sm:mb-9">
          <p className="font-edict text-[11px] uppercase tracking-[0.38em] text-garden-cream/70 sm:text-[10px] sm:tracking-[0.45em]">
            Emily & Sam
          </p>
          <h2 className="mt-3 font-eros text-5xl font-normal uppercase leading-none text-garden-cream sm:text-6xl">
            RSVP
          </h2>
          <p className="mx-auto mt-4 max-w-sm font-serif text-[1.08rem] italic leading-snug text-garden-cream/82 sm:text-base">
            San Miguel de Allende
            <br />
            February 26-27, 2027
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-7 sm:space-y-8">
          <StepProgress
            currentStep={currentStep}
            furthestStepIndex={furthestStepIndex}
            onStepChange={goToStep}
          />

          <motion.div
            layout
            transition={{ layout: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
            className="overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false} custom={stepDirection}>
              {currentStep === "details" && (
                <StepPanel
                  key="details"
                  step="details"
                  direction={stepDirection}
                >
                  <WeekendDetails />
                </StepPanel>
              )}

              {currentStep === "party" && (
                <StepPanel
                  key="party"
                  step="party"
                  direction={stepDirection}
                >
                  <div className="space-y-6">
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
                      className="flex min-h-14 w-full items-center justify-center gap-2 border border-dashed border-garden-cream/45 px-4 py-4 font-edict text-[13px] uppercase tracking-[0.2em] text-garden-cream transition-colors hover:border-garden-cream hover:bg-garden-cream/10 sm:text-[12px] sm:tracking-[0.24em]"
                    >
                      <PlusIcon aria-hidden className="size-4" />
                      Add another guest
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {hasPotentialAcceptedGuests && (
                      <motion.div
                        key="event-attendance"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-garden-cream/25 pt-6">
                          <EventCheckboxes
                            attendingFriday={attendingFriday}
                            attendingSaturday={attendingSaturday}
                            showError={missingEventSelection}
                            onFridayChange={setAttendingFriday}
                            onSaturdayChange={setAttendingSaturday}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </StepPanel>
              )}

              {currentStep === "contact" && (
                <StepPanel
                  key="contact"
                  step="contact"
                  direction={stepDirection}
                >
                  <div className="space-y-6">
                    {acceptedGuestEntries.map(({ guest, index }) => (
                      <GuestContactDetails
                        key={guest.clientId}
                        guest={guest}
                        index={index}
                        onUpdate={updateGuest}
                      />
                    ))}
                  </div>
                </StepPanel>
              )}

              {currentStep === "meal" && (
                <StepPanel key="meal" step="meal" direction={stepDirection}>
                  <div className="space-y-6">
                    {acceptedGuestEntries.map(({ guest, index }) => (
                      <GuestMealDetails
                        key={guest.clientId}
                        guest={guest}
                        index={index}
                        onUpdate={updateGuest}
                      />
                    ))}
                  </div>
                </StepPanel>
              )}

              {currentStep === "stay" && (
                <StepPanel key="stay" step="stay" direction={stepDirection}>
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
                </StepPanel>
              )}
            </AnimatePresence>
          </motion.div>

          {submitError && (
            <p className="text-center font-serif text-sm italic text-[#ffe0d6]">
              {submitError}
            </p>
          )}

          <StepControls
            currentStep={currentStep}
            currentStepComplete={stepComplete[currentStep]}
            currentStepIsFinal={currentStepIsFinal}
            currentStepHint={currentStepHint}
            canSubmit={canSubmit}
            submitting={submitting}
            onBack={goBack}
            onNext={goNext}
          />
        </form>
      </InvitationCard>
    </>
  );
}

function getFurthestStepIndex({
  hasAcceptedGuests,
  partyComplete,
  mealComplete,
}: {
  hasAcceptedGuests: boolean;
  partyComplete: boolean;
  mealComplete: boolean;
}) {
  if (!partyComplete) return 1;
  if (!hasAcceptedGuests) return 1;
  if (!mealComplete) return 3;
  return 4;
}

function getStepHint({
  currentStep,
  namedGuestCount,
  hasAcceptedGuests,
  missingEventSelection,
  missingMainCourse,
  missingHotel,
  missingHotelAcknowledgement,
}: {
  currentStep: RsvpStep;
  namedGuestCount: number;
  hasAcceptedGuests: boolean;
  missingEventSelection: boolean;
  missingMainCourse: boolean;
  missingHotel: boolean;
  missingHotelAcknowledgement: boolean;
}) {
  if (currentStep === "details") {
    return "";
  }

  if (currentStep === "party") {
    if (namedGuestCount === 0) return "Add at least one guest name.";
    if (hasAcceptedGuests && missingEventSelection) {
      return "Choose at least one weekend event, or mark each guest as declining.";
    }
  }

  if (currentStep === "contact") {
    return "Add an email or phone if direct follow-up would be helpful.";
  }

  if (currentStep === "meal" && missingMainCourse) {
    return "Choose a main course for each attending guest.";
  }

  if (currentStep === "stay") {
    if (missingHotel) return "Choose whether you would like room-block details.";
    if (missingHotelAcknowledgement) return "Confirm that follow-up is okay.";
  }

  return "";
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
      <div className="relative px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
        <div className="mb-8 flex justify-center">
          <SAndELogo className="h-16 w-auto text-garden-cream sm:h-20" />
        </div>
        {children}
      </div>
    </div>
  );
}

function StepProgress({
  currentStep,
  furthestStepIndex,
  onStepChange,
}: {
  currentStep: RsvpStep;
  furthestStepIndex: number;
  onStepChange: (step: RsvpStep) => void;
}) {
  return (
    <ol className="grid grid-cols-5 gap-1 border-y border-garden-cream/25 py-3">
      {RSVP_STEPS.map((step, index) => {
        const active = step.id === currentStep;
        const accessible = index <= furthestStepIndex;

        return (
          <li key={step.id}>
            <button
              type="button"
              aria-current={active ? "step" : undefined}
              disabled={!accessible}
              onClick={() => onStepChange(step.id)}
              className={`flex min-h-12 w-full flex-col items-center justify-center gap-1 px-1 text-center transition-colors disabled:cursor-not-allowed ${
                active
                  ? "text-garden-cream"
                  : accessible
                    ? "text-garden-cream/58 hover:text-garden-cream"
                    : "text-garden-cream/25"
              }`}
            >
              <span
                className={`flex size-6 items-center justify-center border font-inter text-[11px] leading-none ${
                  active
                    ? "border-garden-cream bg-garden-cream text-garden-olive"
                    : accessible
                      ? "border-garden-cream/40"
                      : "border-garden-cream/18"
                }`}
              >
                {index + 1}
              </span>
              <span className="font-edict text-[8px] uppercase tracking-[0.08em] sm:text-[10px] sm:tracking-[0.18em]">
                {step.label}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function StepPanel({
  step,
  direction,
  children,
}: {
  step: RsvpStep;
  direction: number;
  children: React.ReactNode;
}) {
  const stepDetails = RSVP_STEPS.find((item) => item.id === step);

  if (!stepDetails) return null;

  return (
    <motion.section
      custom={direction}
      variants={panelVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <SectionHeading
        eyebrow={stepDetails.eyebrow}
        title={stepDetails.title}
      />
      {children}
    </motion.section>
  );
}

function StepControls({
  currentStep,
  currentStepComplete,
  currentStepIsFinal,
  currentStepHint,
  canSubmit,
  submitting,
  onBack,
  onNext,
}: {
  currentStep: RsvpStep;
  currentStepComplete: boolean;
  currentStepIsFinal: boolean;
  currentStepHint: string;
  canSubmit: boolean;
  submitting: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  const isFirstStep = currentStep === "details";
  const primaryDisabled = currentStepIsFinal
    ? !canSubmit
    : !currentStepComplete;

  return (
    <div className="space-y-3 border-t border-garden-cream/25 pt-6">
      <p
        aria-live="polite"
        className={`min-h-[2.4em] text-center font-serif text-sm italic leading-snug text-garden-cream/68 transition-opacity duration-200 sm:min-h-[1.2em] ${
          currentStepHint ? "opacity-100" : "opacity-0"
        }`}
      >
        {currentStepHint}
      </p>
      <div
        className={`grid gap-2 ${
          isFirstStep ? "grid-cols-1" : "grid-cols-[0.72fr_1fr]"
        }`}
      >
        {!isFirstStep && (
          <button
            type="button"
            onClick={onBack}
            disabled={submitting}
            className="min-h-14 border border-garden-cream/45 px-4 py-3 font-edict text-[12px] uppercase tracking-[0.24em] text-garden-cream transition-colors hover:border-garden-cream hover:bg-garden-cream/10 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Back
          </button>
        )}
        <button
          type={currentStepIsFinal ? "submit" : "button"}
          onClick={currentStepIsFinal ? undefined : onNext}
          disabled={primaryDisabled}
          className="min-h-14 border border-garden-cream bg-garden-cream px-5 py-3 font-edict text-[13px] font-medium uppercase tracking-[0.24em] text-garden-olive transition-colors hover:bg-transparent hover:text-garden-cream disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-garden-cream disabled:hover:text-garden-olive sm:text-[12px]"
        >
          {currentStepIsFinal
            ? submitting
              ? "Submitting"
              : "Send reply"
            : "Continue"}
        </button>
      </div>
    </div>
  );
}

function WeekendDetails() {
  const rows = [
    ["Welcome party", "Friday, February 26, 3-8 PM"],
    ["Ceremony & reception", "Saturday, February 27, 2027"],
    ["Venue", "Luna Escondida"],
    ["Location", "San Miguel de Allende, MX"],
    ["Stay", "Belmond Casa de Sierra Nevada room block available"],
    ["Dress", "Enchanted Garden"],
  ] as const;

  return (
    <dl className="border-y border-garden-cream/35 py-2">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="grid grid-cols-1 gap-1 border-b border-garden-cream/15 py-3 last:border-b-0 sm:grid-cols-[11rem_1fr] sm:gap-4"
        >
          <dt className="font-edict text-[11px] uppercase tracking-[0.28em] text-garden-cream/58 sm:text-[10px] sm:tracking-[0.34em]">
            {label}
          </dt>
          <dd className="font-serif text-[1.08rem] leading-snug text-garden-cream sm:text-base">
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
            className="flex size-11 shrink-0 items-center justify-center border border-garden-cream/35 text-garden-cream/75 transition-colors hover:border-garden-cream hover:bg-garden-cream hover:text-garden-olive focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-garden-cream sm:mb-1 sm:size-9"
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

function GuestContactDetails({
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
    <section className="space-y-5 border-l border-garden-cream/25 pl-5">
      <p className="font-edict text-[11px] uppercase tracking-[0.28em] text-garden-cream/58 sm:text-[10px] sm:tracking-[0.32em]">
        For {guest.name.trim()}
      </p>
      <ContactFields
        guestId={guest.clientId}
        email={guest.email}
        phone={guest.phone}
        onEmailChange={(value) => onUpdate(index, "email", value)}
        onPhoneChange={(value) => onUpdate(index, "phone", value)}
      />
    </section>
  );
}

function GuestMealDetails({
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
    <section className="space-y-5 border-l border-garden-cream/25 pl-5">
      <p className="font-edict text-[11px] uppercase tracking-[0.28em] text-garden-cream/58 sm:text-[10px] sm:tracking-[0.32em]">
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
  required = false,
  onEmailChange,
  onPhoneChange,
}: {
  guestId: string;
  email: string;
  phone: string;
  required?: boolean;
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
    <section className="space-y-5">
      <p className="font-serif text-[1.35rem] font-light leading-tight text-garden-cream sm:text-[1.2rem]">
        Casa de Sierra Nevada
      </p>
      <p className="font-serif text-[1.08rem] leading-relaxed text-garden-cream/82 sm:text-base">
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
        className="inline-flex min-h-11 items-center border border-garden-cream/55 px-4 py-2 font-edict text-[11px] uppercase tracking-[0.24em] text-garden-cream transition-colors hover:bg-garden-cream hover:text-garden-olive sm:text-[10px] sm:tracking-[0.28em]"
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
              className={`flex min-h-14 w-full cursor-pointer items-start gap-3 border px-4 py-4 text-left transition-colors sm:py-3 ${
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
                className={`mt-0.5 flex size-6 shrink-0 items-center justify-center border border-garden-cream/60 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-garden-cream/55 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-garden-olive sm:size-5 ${
                  hotelAcknowledged
                    ? "bg-garden-cream text-garden-olive"
                    : "text-transparent"
                }`}
              >
                <CheckIcon aria-hidden className="size-4 sm:size-3.5" />
              </span>
              <span className="space-y-1">
                <span className="block font-edict text-[11px] uppercase tracking-[0.24em] text-garden-cream sm:text-[10px] sm:tracking-[0.28em]">
                  Follow-up okay
                  <span className="ml-1 text-garden-cream/70">*</span>
                </span>
                <span className="block font-serif text-[15px] leading-relaxed text-garden-cream/82 sm:text-sm">
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
      <p className="font-edict text-[11px] uppercase tracking-[0.34em] text-garden-cream/55 sm:text-[10px] sm:tracking-[0.42em]">
        {eyebrow}
      </p>
      <h3 className="font-serif text-[1.85rem] font-light leading-tight text-garden-cream sm:text-2xl">
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
    "font-edict text-[11px] font-medium uppercase tracking-[0.28em] text-garden-cream sm:text-[10px] sm:tracking-[0.36em]";

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
      className={`w-full border-b border-garden-cream/40 bg-transparent py-3 font-serif text-[17px] text-garden-cream placeholder:text-garden-cream/35 focus:border-garden-cream focus:outline-none sm:py-2 sm:text-base ${className}`}
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
      className={`flex min-h-16 items-center gap-3 border px-4 py-3 text-left font-serif text-[1.08rem] leading-snug transition-colors sm:min-h-14 sm:text-base ${
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
      className={`flex min-h-[4.5rem] w-full items-start gap-3 border px-4 py-3.5 text-left transition-colors sm:min-h-16 sm:px-3.5 sm:py-3 ${
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
        <span className="block font-edict text-[12px] uppercase leading-snug tracking-[0.18em] sm:text-[11px] sm:tracking-[0.22em]">
          {title}
        </span>
        <span className="mt-1 block font-serif text-[15px] italic leading-snug opacity-80 sm:text-sm">
          {detail}
        </span>
      </span>
    </button>
  );
}
