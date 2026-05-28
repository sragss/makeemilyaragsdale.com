"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, PlusIcon, XIcon } from "lucide-react";
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
  { id: "details", label: "Details", eyebrow: "", title: "", subtitle: "" },
  {
    id: "rsvp",
    label: "RSVP",
    eyebrow: "",
    title: "RSVP",
    subtitle: "",
  },
  { id: "meal", label: "Meal", eyebrow: "", title: "Meal", subtitle: "" },
  { id: "stay", label: "Stay", eyebrow: "", title: "Belmond", subtitle: "" },
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
            {completedAttending ? (
              <>
                <p className="font-edict text-[11px] uppercase tracking-[0.38em] text-garden-cream/70 sm:text-[10px] sm:tracking-[0.45em]">
                  Reply received
                </p>
                <h2 className="mt-4 font-eros text-[3.35rem] font-normal uppercase leading-none text-garden-cream sm:text-6xl">
                  See you there
                </h2>
                <p className="mx-auto mt-6 max-w-sm font-serif text-xl italic leading-snug text-garden-cream/88 sm:text-lg">
                  We can't wait to celebrate with you in San Miguel.
                </p>
              </>
            ) : (
              <h2 className="font-eros text-[3.35rem] font-normal uppercase leading-none text-garden-cream sm:text-6xl">
                You'll be missed
              </h2>
            )}
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
  const [currentStep, setCurrentStep] = useState<RsvpStep>("details");
  const [stepDirection, setStepDirection] = useState(1);
  const [guestData, setGuestData] = useState<GuestFormData[]>([
    createGuest(1),
  ]);
  const [attendingFriday, setAttendingFriday] = useState(true);
  const [attendingSaturday, setAttendingSaturday] = useState(true);
  const [hotelWillBook, setHotelWillBook] = useState<boolean | undefined>();
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
  const hasAcceptedGuests = acceptedGuests.length > 0;
  const rsvpComplete =
    namedGuests.length > 0 && (!hasAcceptedGuests || !missingEventSelection);
  const mealComplete = !hasAcceptedGuests || !missingMainCourse;
  const stayComplete = !hasAcceptedGuests || !missingHotel;
  const stepComplete: Record<RsvpStep, boolean> = {
    details: true,
    rsvp: rsvpComplete,
    meal: mealComplete,
    stay: stayComplete,
  };
  const currentStepIndex = RSVP_STEPS.findIndex(
    (step) => step.id === currentStep
  );
  const furthestStepIndex = getFurthestStepIndex({
    hasAcceptedGuests,
    rsvpComplete,
    mealComplete,
  });
  const currentStepIsFinal =
    currentStep === "stay" ||
    (currentStep === "rsvp" && namedGuests.length > 0 && !hasAcceptedGuests);
  const currentStepHint = getStepHint({
    currentStep,
    namedGuestCount: namedGuests.length,
    hasAcceptedGuests,
    missingEventSelection,
    missingHotel,
  });
  const canSubmit =
    namedGuests.length > 0 &&
    !missingEventSelection &&
    !missingMainCourse &&
    !missingHotel &&
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
      });
      onComplete(acceptedGuests.length > 0);
    } catch {
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
          colors={["#d2cf53"]}
          onComplete={() => setShowHotelConfetti(false)}
        />
      )}
      <InvitationCard>
        <form onSubmit={handleSubmit} className="space-y-7 sm:space-y-8">
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

              {currentStep === "rsvp" && (
                <StepPanel
                  key="rsvp"
                  step="rsvp"
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
                    onWillBookChange={(value) => {
                      setHotelWillBook(value);
                      if (value) {
                        setShowHotelConfetti(true);
                      }
                    }}
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
  rsvpComplete,
  mealComplete,
}: {
  hasAcceptedGuests: boolean;
  rsvpComplete: boolean;
  mealComplete: boolean;
}) {
  if (!rsvpComplete) return 1;
  if (!hasAcceptedGuests) return 1;
  if (!mealComplete) return 2;
  return 3;
}

function getStepHint({
  currentStep,
  namedGuestCount,
  hasAcceptedGuests,
  missingEventSelection,
  missingHotel,
}: {
  currentStep: RsvpStep;
  namedGuestCount: number;
  hasAcceptedGuests: boolean;
  missingEventSelection: boolean;
  missingHotel: boolean;
}) {
  if (currentStep === "details") {
    return "";
  }

  if (currentStep === "rsvp") {
    if (namedGuestCount === 0) return "Add at least one guest name.";
    if (hasAcceptedGuests && missingEventSelection) {
      return "Choose at least one weekend event, or mark each guest as declining.";
    }
  }

  if (currentStep === "stay") {
    if (missingHotel) return "Choose whether you would like room-block details.";
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
        className="pointer-events-none absolute inset-2 border-2 border-garden-cream/45 sm:inset-3 sm:border-[3px]"
      />
      <div className="relative px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
        <div className="mb-8 flex justify-center">
          <SAndELogo className="h-16 w-auto text-[#d2cf53] sm:h-20" />
        </div>
        {children}
      </div>
    </div>
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
      {stepDetails.title ? (
        <SectionHeading
          eyebrow={stepDetails.eyebrow}
          title={stepDetails.title}
          subtitle={stepDetails.subtitle}
        />
      ) : null}
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
          className="min-h-14 border border-[#d2cf53] bg-[#d2cf53] px-5 py-3 font-edict text-[13px] font-medium uppercase tracking-[0.24em] text-[#3f3e19] transition-colors hover:bg-transparent hover:text-[#d2cf53] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#d2cf53] disabled:hover:text-[#3f3e19] sm:text-[12px]"
        >
          {currentStepIsFinal
            ? submitting
              ? "Submitting"
              : "Send reply"
            : currentStep === "details"
              ? "RSVP"
              : "Continue"}
        </button>
      </div>
    </div>
  );
}

function WeekendDetails() {
  return (
    <div className="py-6 text-center sm:py-10">
      <h2 className="font-eros font-normal uppercase leading-[0.85] text-garden-cream">
        <span className="block text-[3.25rem] sm:text-[4.5rem]">Kindly</span>
        <span className="mt-1 block text-[5.75rem] sm:text-[8rem]">Reply</span>
      </h2>
      <p className="mt-8 text-garden-cream sm:mt-10">
        <span className="font-edict text-[1.35rem] italic sm:text-[1.55rem]">
          by
        </span>
        <span className="ml-3 font-edict text-[1.35rem] uppercase tracking-[0.12em] sm:ml-4 sm:text-[1.55rem]">
          January 15, 2027
        </span>
      </p>
    </div>
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
          label="Guest name"
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
      <p className="font-edict text-[1.65rem] italic leading-tight text-garden-cream sm:text-[1.85rem]">
        {guest.name.trim()}
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

function HotelSection({
  hotelWillBook,
  onWillBookChange,
}: {
  hotelWillBook: boolean | undefined;
  onWillBookChange: (value: boolean) => void;
}) {
  return (
    <section className="-mt-5 space-y-5">
      <p className="text-center font-edict text-[1.55rem] italic font-light leading-tight text-garden-cream sm:text-[1.9rem]">
        Casa de Sierra Nevada
      </p>
      <p className="mx-auto max-w-sm text-center font-serif text-[1.125rem] leading-snug text-garden-cream/85 sm:text-[1.215rem]">
        We have reserved the Belmond as our home base for the weekend, and we
        would love for as many of you to stay with us as possible. Please book
        early to secure a spot!
      </p>

      <hr className="border-t border-garden-cream/30" />

      <div className="space-y-3">
        <FieldLabel required>Planning to stay at the Belmond</FieldLabel>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <ChoiceButton
            selected={hotelWillBook === true}
            onClick={() => onWillBookChange(true)}
          >
            Yes
          </ChoiceButton>
          <ChoiceButton
            selected={hotelWillBook === false}
            onClick={() => onWillBookChange(false)}
          >
            No, I&apos;ll stay elsewhere
          </ChoiceButton>
        </div>
      </div>

      <a
        href="https://reservation.belmond.com/select-room?productCode=CSN&specialCodeType=groupCode&specialCodeValue=5686768&startDate=2027-02-25&endDate=2027-02-28&"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block aspect-[16/9] w-full overflow-hidden border border-garden-cream/35"
        aria-label="Belmond booking link - opens in a new tab"
      >
        <Image
          src="/images/Belmond 1 upscale.jpg"
          alt="Belmond Casa de Sierra Nevada"
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 640px"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <span className="font-inter inline-block border border-garden-cream/85 bg-black/15 px-8 py-3.5 text-[11px] uppercase tracking-[0.28em] text-garden-cream backdrop-blur-sm transition-colors group-hover:bg-garden-cream group-hover:text-[#493932]">
            Booking Link
          </span>
        </div>
      </a>

    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="space-y-2 text-center">
      {eyebrow ? (
        <p className="font-edict text-[11px] uppercase tracking-[0.34em] text-[#d2cf53] sm:text-[12px] sm:tracking-[0.42em]">
          {eyebrow}
        </p>
      ) : null}
      <h3 className="font-eros text-[3.25rem] font-normal uppercase leading-none text-garden-cream sm:text-[4rem]">
        {title}
      </h3>
      {subtitle ? (
        <p className="font-serif text-[1.05rem] italic leading-snug text-garden-cream/85 sm:text-[1.15rem]">
          {subtitle}
        </p>
      ) : null}
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
          ? "border-garden-moss bg-garden-moss text-garden-cream"
          : "border-garden-cream bg-garden-cream text-garden-moss hover:bg-garden-cream/90"
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
      className={`flex min-h-[4.5rem] w-full items-start gap-3 border bg-garden-cream px-4 py-3.5 text-left text-garden-moss transition-colors sm:min-h-16 sm:px-3.5 sm:py-3 ${
        selected
          ? "border-garden-moss"
          : "border-garden-cream hover:bg-garden-cream/90"
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
