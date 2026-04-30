"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NoiseBackground } from "@/components/ui/noise-background";
import { NOISE_GRADIENT_COLORS } from "@/lib/constants";
import {
  lookupAddressInvite,
  submitAddress,
  type AddressInviteData,
} from "./actions";

interface MailingAddress {
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

type MailingAddressField = keyof MailingAddress;

function createEmptyAddress(): MailingAddress {
  return {
    line1: "",
    line2: "",
    city: "",
    region: "",
    postalCode: "",
    country: "United States",
  };
}

function looksLikeCityRegionPostal(line: string) {
  return /,\s*\S+/.test(line) || /\b[A-Z]{2}\b.*\d/.test(line);
}

function parseCityRegionPostal(line: string) {
  if (!line.trim()) return { city: "", region: "", postalCode: "" };

  if (line.includes(",")) {
    const [city, ...restParts] = line.split(",");
    const rest = restParts.join(",").trim().split(/\s+/).filter(Boolean);
    return {
      city: city.trim(),
      region: rest[0] ?? "",
      postalCode: rest.slice(1).join(" "),
    };
  }

  const parts = line.trim().split(/\s+/);
  if (parts.length < 3) {
    return { city: line.trim(), region: "", postalCode: "" };
  }

  return {
    city: parts.slice(0, -2).join(" "),
    region: parts.at(-2) ?? "",
    postalCode: parts.at(-1) ?? "",
  };
}

function parseAddress(value: string | null): MailingAddress {
  const parsed = createEmptyAddress();
  const lines = (value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return parsed;

  parsed.line1 = lines.shift() ?? "";

  if (lines.length > 1 && !looksLikeCityRegionPostal(lines.at(-1) ?? "")) {
    parsed.country = lines.pop() ?? parsed.country;
  }

  const cityLine = lines.pop() ?? "";
  parsed.line2 = lines.join(", ");

  const cityParts = parseCityRegionPostal(cityLine);
  parsed.city = cityParts.city;
  parsed.region = cityParts.region;
  parsed.postalCode = cityParts.postalCode;

  return parsed;
}

function formatAddress(address: MailingAddress) {
  const cityLine = [
    address.city.trim(),
    [address.region.trim(), address.postalCode.trim()]
      .filter(Boolean)
      .join(" "),
  ]
    .filter(Boolean)
    .join(", ");

  return [
    address.line1.trim(),
    address.line2.trim(),
    cityLine,
    address.country.trim(),
  ]
    .filter(Boolean)
    .join("\n");
}

function isAddressComplete(address: MailingAddress) {
  return Boolean(
    address.line1.trim() &&
      address.city.trim() &&
      address.region.trim() &&
      address.postalCode.trim() &&
      address.country.trim()
  );
}

export function AddressFlow({ initialCode }: { initialCode?: string }) {
  const [step, setStep] = useState<"code" | "form" | "done">("code");
  const [code, setCode] = useState(initialCode ?? "");
  const [invite, setInvite] = useState<AddressInviteData | null>(null);
  const [address, setAddress] = useState<MailingAddress>(createEmptyAddress);
  const [lookupError, setLookupError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadInvite = useCallback(async (nextCode: string) => {
    if (!nextCode.trim()) return;

    setLoading(true);
    setLookupError("");
    const result = await lookupAddressInvite(nextCode);
    setLoading(false);

    if (!result) {
      setLookupError("We couldn't find that code. Double-check and try again.");
      return;
    }

    setInvite(result);
    setAddress(parseAddress(result.address));
    setStep("form");
    window.history.replaceState(null, "", `/address/${result.code}`);
  }, []);

  async function handleLookup(lookupCode?: string) {
    await loadInvite(lookupCode ?? code);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!invite || !isAddressComplete(address)) return;

    setSaving(true);
    setSubmitError("");

    try {
      await submitAddress({
        code: invite.code,
        address: formatAddress(address),
      });
      setStep("done");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!initialCode) return;
    const timer = window.setTimeout(() => {
      void loadInvite(initialCode);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [initialCode, loadInvite]);

  if (step === "done") {
    return (
      <div className="text-center space-y-4 py-10">
        <p className="font-serif text-3xl font-light">Address saved</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We&apos;ll send your invitation there. When it arrives, use the code
          printed on it to RSVP.
        </p>
      </div>
    );
  }

  if (step === "code" || !invite) {
    return (
      <div className="space-y-5">
        <div className="space-y-3 text-center">
          <p className="font-serif text-2xl font-light">
            Find your invitation
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Use the code we sent you.
          </p>
        </div>

        <InviteCodeField
          value={code}
          onChange={setCode}
          onEnter={() => handleLookup()}
        />

        {lookupError && (
          <p className="text-sm text-destructive text-center">{lookupError}</p>
        )}
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

  const household =
    invite.guestNames.length > 0 ? invite.guestNames.join(" & ") : invite.code;
  const canSubmit = isAddressComplete(address);

  function updateAddressField(field: MailingAddressField, value: string) {
    setAddress((current) => ({ ...current, [field]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3 text-center">
        <p className="text-xs tracking-[0.28em] uppercase text-muted-foreground">
          Invitation for
        </p>
        <p className="font-serif text-4xl font-light leading-tight">
          {household}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Where should we send your invitation?
        </p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="address-line-1">Mailing address</Label>
        <AddressFields value={address} onChange={updateAddressField} />
        <p className="text-xs text-muted-foreground">
          Code <span className="font-mono">{invite.code}</span>
        </p>
      </div>

      {submitError && (
        <p className="text-sm text-destructive text-center">{submitError}</p>
      )}

      <Button
        type="submit"
        disabled={saving || !canSubmit}
        className="w-full"
      >
        {saving ? "Saving..." : "Save address"}
      </Button>
    </form>
  );
}

function InviteCodeField({
  value,
  onChange,
  onEnter,
}: {
  value: string;
  onChange: (value: string) => void;
  onEnter: () => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="code">Invitation code</Label>
      <NoiseBackground
        containerClassName="rounded-sm"
        gradientColors={[...NOISE_GRADIENT_COLORS]}
        noiseIntensity={0.1}
        speed={0.03}
      >
        <div className="absolute inset-0 z-[5] shadow-[inset_0_1px_4px_rgba(0,0,0,0.1),inset_0_0_8px_rgba(0,0,0,0.04)] pointer-events-none rounded-sm" />
        <Input
          id="code"
          placeholder="EBR-TOVIK"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && onEnter()}
          className="relative z-10 h-12 border-0 bg-transparent text-center font-mono text-lg tracking-[0.24em] uppercase shadow-none placeholder:text-foreground/25 focus-visible:ring-0"
        />
      </NoiseBackground>
    </div>
  );
}

function AddressFields({
  value,
  onChange,
}: {
  value: MailingAddress;
  onChange: (field: MailingAddressField, value: string) => void;
}) {
  return (
    <NoiseBackground
      containerClassName="rounded-sm"
      gradientColors={[...NOISE_GRADIENT_COLORS]}
      noiseIntensity={0.1}
      speed={0.03}
    >
      <div className="absolute inset-0 z-[5] shadow-[inset_0_1px_4px_rgba(0,0,0,0.1),inset_0_0_8px_rgba(0,0,0,0.04)] pointer-events-none rounded-sm" />
      <div className="relative z-10 grid gap-[3px] bg-background p-[3px]">
        <AddressInput
          id="address-line-1"
          label="Street address"
          placeholder="123 Main St"
          value={value.line1}
          onChange={(nextValue) => onChange("line1", nextValue)}
        />
        <AddressInput
          id="address-line-2"
          label="Apt, suite, etc."
          placeholder="Apartment 4B"
          value={value.line2}
          onChange={(nextValue) => onChange("line2", nextValue)}
        />
        <div className="grid gap-[3px] sm:grid-cols-[1fr_5.5rem_7rem]">
          <AddressInput
            id="address-city"
            label="City"
            placeholder="New York"
            value={value.city}
            onChange={(nextValue) => onChange("city", nextValue)}
          />
          <AddressInput
            id="address-region"
            label="State"
            placeholder="NY"
            value={value.region}
            onChange={(nextValue) => onChange("region", nextValue)}
          />
          <AddressInput
            id="address-postal"
            label="ZIP"
            placeholder="10001"
            value={value.postalCode}
            onChange={(nextValue) => onChange("postalCode", nextValue)}
          />
        </div>
        <AddressInput
          id="address-country"
          label="Country"
          placeholder="United States"
          value={value.country}
          onChange={(nextValue) => onChange("country", nextValue)}
        />
      </div>
    </NoiseBackground>
  );
}

function AddressInput({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
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
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-7 rounded-none border-0 bg-transparent px-0 py-0 shadow-none focus-visible:ring-0 placeholder:text-foreground/25"
      />
    </div>
  );
}
