"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NoiseBackground } from "@/components/ui/noise-background";
import { NOISE_GRADIENT_COLORS } from "@/lib/constants";
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

  if (done) {
    return (
      <div className="text-center space-y-4 py-10">
        <p className="font-serif text-3xl font-light">Got it, thank you</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We&apos;ll be in touch with details for the wedding weekend.
        </p>
      </div>
    );
  }

  const canSubmit = isFormComplete(form);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-sm text-muted-foreground leading-relaxed text-center">
        Share your contact details so we can send you further information
        about the wedding weekend.
      </p>

      <ContactSection form={form} onChange={updateField} />
      <AddressSection form={form} onChange={updateField} />

      {submitError && (
        <p className="text-sm text-destructive text-center">{submitError}</p>
      )}

      <Button type="submit" disabled={saving || !canSubmit} className="w-full">
        {saving ? "Sending..." : "Send"}
      </Button>
    </form>
  );
}

function ContactSection({
  form,
  onChange,
}: {
  form: FormState;
  onChange: (field: FormField, value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <Label htmlFor="contact-name">Your details</Label>
      <NoiseBackground
        containerClassName="rounded-sm"
        gradientColors={[...NOISE_GRADIENT_COLORS]}
        noiseIntensity={0.1}
        speed={0.03}
      >
        <div className="absolute inset-0 z-[5] shadow-[inset_0_1px_4px_rgba(0,0,0,0.1),inset_0_0_8px_rgba(0,0,0,0.04)] pointer-events-none rounded-sm" />
        <div className="relative z-10 grid gap-[3px] bg-background p-[3px]">
          <FieldInput
            id="contact-name"
            label="Name"
            placeholder="Jane Doe"
            value={form.name}
            onChange={(v) => onChange("name", v)}
          />
          <FieldInput
            id="contact-email"
            label="Email"
            placeholder="jane@example.com"
            type="email"
            value={form.email}
            onChange={(v) => onChange("email", v)}
          />
          <FieldInput
            id="contact-phone"
            label="Phone"
            placeholder="+1 555 123 4567"
            type="tel"
            value={form.phone}
            onChange={(v) => onChange("phone", v)}
          />
        </div>
      </NoiseBackground>
    </div>
  );
}

function AddressSection({
  form,
  onChange,
}: {
  form: FormState;
  onChange: (field: FormField, value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <Label htmlFor="address-line-1">Mailing address</Label>
      <NoiseBackground
        containerClassName="rounded-sm"
        gradientColors={[...NOISE_GRADIENT_COLORS]}
        noiseIntensity={0.1}
        speed={0.03}
      >
        <div className="absolute inset-0 z-[5] shadow-[inset_0_1px_4px_rgba(0,0,0,0.1),inset_0_0_8px_rgba(0,0,0,0.04)] pointer-events-none rounded-sm" />
        <div className="relative z-10 grid gap-[3px] bg-background p-[3px]">
          <FieldInput
            id="address-line-1"
            label="Street address"
            placeholder="123 Main St"
            value={form.addressLine1}
            onChange={(v) => onChange("addressLine1", v)}
          />
          <FieldInput
            id="address-line-2"
            label="Apt, suite, etc."
            placeholder="Apartment 4B"
            value={form.addressLine2}
            onChange={(v) => onChange("addressLine2", v)}
          />
          <div className="grid gap-[3px] sm:grid-cols-[1fr_5.5rem_7rem]">
            <FieldInput
              id="address-city"
              label="City"
              placeholder="New York"
              value={form.city}
              onChange={(v) => onChange("city", v)}
            />
            <FieldInput
              id="address-region"
              label="State"
              placeholder="NY"
              value={form.region}
              onChange={(v) => onChange("region", v)}
            />
            <FieldInput
              id="address-postal"
              label="ZIP"
              placeholder="10001"
              value={form.postalCode}
              onChange={(v) => onChange("postalCode", v)}
            />
          </div>
          <FieldInput
            id="address-country"
            label="Country"
            placeholder="United States"
            value={form.country}
            onChange={(v) => onChange("country", v)}
          />
        </div>
      </NoiseBackground>
    </div>
  );
}

function FieldInput({
  id,
  label,
  placeholder,
  value,
  type,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1 bg-background/95 px-3 py-2">
      <Label
        htmlFor={id}
        className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
      >
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-7 rounded-none border-0 bg-transparent px-0 py-0 shadow-none focus-visible:ring-0 placeholder:text-foreground/25"
      />
    </div>
  );
}
