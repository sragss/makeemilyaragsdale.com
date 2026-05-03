"use client";

import Image from "next/image";
import { useState } from "react";
import { submitAddressEntry } from "./actions";

interface FormState {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

type FormField = keyof FormState;

function createEmptyForm(): FormState {
  return {
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    region: "",
    postalCode: "",
    country: "United States",
  };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isFormComplete(form: FormState) {
  return Boolean(
    form.name.trim() &&
      form.email.trim() &&
      EMAIL_REGEX.test(form.email.trim()) &&
      form.phone.trim() &&
      form.addressLine1.trim() &&
      form.city.trim() &&
      form.region.trim() &&
      form.postalCode.trim() &&
      form.country.trim()
  );
}

export function AddressFlow() {
  const [form, setForm] = useState<FormState>(createEmptyForm);
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  function updateField(field: FormField, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isFormComplete(form)) return;

    setSaving(true);
    setSubmitError("");

    try {
      await submitAddressEntry(form);
      setDone(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  const canSubmit = isFormComplete(form);

  return (
    <InvitationCard>
      {done ? (
        <div className="space-y-5 py-12 text-center">
          <p className="font-serif text-3xl font-light leading-tight text-garden-cream">
            With gratitude
          </p>
          <p className="text-sm leading-relaxed text-garden-cream/75">
            We&apos;ll be in touch with details for the wedding weekend.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-7">
          <FieldGroup label="Name">
            <InvitationInput
              id="contact-name"
              autoComplete="name"
              value={form.name}
              onChange={(v) => updateField("name", v)}
              placeholder="Jane Doe"
            />
          </FieldGroup>

          <FieldGroup label="Email">
            <InvitationInput
              id="contact-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(v) => updateField("email", v)}
              placeholder="jane@example.com"
            />
          </FieldGroup>

          <FieldGroup label="Phone">
            <InvitationInput
              id="contact-phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(v) => updateField("phone", v)}
              placeholder="+1 555 123 4567"
            />
          </FieldGroup>

          <FieldGroup label="Address">
            <div className="space-y-4">
              <InvitationInput
                id="address-line-1"
                autoComplete="address-line1"
                value={form.addressLine1}
                onChange={(v) => updateField("addressLine1", v)}
                placeholder="Street address"
              />
              <InvitationInput
                id="address-line-2"
                autoComplete="address-line2"
                value={form.addressLine2}
                onChange={(v) => updateField("addressLine2", v)}
                placeholder="Apt, suite (optional)"
              />
              <div className="grid grid-cols-[1fr_3rem_4rem] gap-3 sm:gap-4">
                <InvitationInput
                  id="address-city"
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={(v) => updateField("city", v)}
                  placeholder="City"
                />
                <InvitationInput
                  id="address-region"
                  autoComplete="address-level1"
                  value={form.region}
                  onChange={(v) => updateField("region", v)}
                  placeholder="State"
                />
                <InvitationInput
                  id="address-postal"
                  autoComplete="postal-code"
                  value={form.postalCode}
                  onChange={(v) => updateField("postalCode", v)}
                  placeholder="ZIP"
                />
              </div>
              <InvitationInput
                id="address-country"
                autoComplete="country-name"
                value={form.country}
                onChange={(v) => updateField("country", v)}
                placeholder="Country"
              />
            </div>
          </FieldGroup>

          {submitError && (
            <p className="text-center text-sm text-garden-cream/90">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={saving || !canSubmit}
            className="mt-2 w-full border border-garden-cream/80 bg-garden-cream py-6 font-serif text-sm font-semibold uppercase tracking-[0.45em] text-garden-olive transition-opacity disabled:opacity-40"
          >
            {saving ? "Sending" : "Share"}
          </button>
        </form>
      )}
    </InvitationCard>
  );
}

function InvitationCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden rounded-sm bg-garden-olive shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage: "url(/images/noise.webp)",
          backgroundSize: "200px 200px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 rounded-sm border border-garden-cream/25"
      />
      <div className="relative px-7 py-12 sm:px-12 sm:py-14">
        <div className="mb-10 flex flex-col items-center">
          <Image
            src="/images/se-logo.png"
            alt="S & E"
            width={88}
            height={120}
            priority
            className="h-auto w-[68px] sm:w-[78px]"
          />
        </div>
        {children}
      </div>
    </div>
  );
}

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <p className="font-serif text-[11px] font-medium uppercase tracking-[0.42em] text-garden-cream">
        {label}
      </p>
      {children}
    </div>
  );
}

function InvitationInput({
  id,
  value,
  onChange,
  placeholder,
  type,
  autoComplete,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <input
      id={id}
      type={type ?? "text"}
      autoComplete={autoComplete}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="w-full border-b border-garden-cream/40 bg-transparent py-2 font-serif text-base text-garden-cream placeholder:text-garden-cream/35 focus:border-garden-cream focus:outline-none"
    />
  );
}
