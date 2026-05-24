"use client";

import { useState } from "react";

const CONTACTS = [
  {
    name: "Emily",
    digits: [51, 48, 51, 52, 48, 56, 52, 49, 54, 48],
  },
  {
    name: "Sam",
    digits: [57, 49, 52, 56, 49, 57, 50, 56, 51, 49],
  },
] as const;

function decodePhone(digits: readonly number[]) {
  const raw = String.fromCharCode(...digits);
  return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6)}`;
}

export function HiddenContactNumbers() {
  const [revealed, setRevealed] = useState(false);

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={() => setRevealed(true)}
        className="mt-3 border border-garden-moss/35 px-4 py-2 font-edict text-[10px] uppercase tracking-[0.28em] text-garden-moss transition-colors hover:bg-garden-moss hover:text-garden-cream"
      >
        Show phone numbers
      </button>
    );
  }

  return (
    <dl className="mt-4 space-y-2">
      {CONTACTS.map((contact) => {
        const phone = decodePhone(contact.digits);
        return (
          <div key={contact.name} className="flex flex-wrap gap-x-3 gap-y-1">
            <dt className="font-edict text-[11px] uppercase tracking-[0.22em] text-garden-moss">
              {contact.name}
            </dt>
            <dd>
              <a
                href={`tel:+1${phone.replaceAll(".", "")}`}
                className="font-mono text-sm tracking-wider text-muted-foreground underline underline-offset-4 hover:text-garden-moss"
              >
                {phone}
              </a>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
