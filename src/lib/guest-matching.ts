// Matching address-form submissions against RSVPs.
//
// The two forms collect names very differently: /address takes one household
// line ("Phil, Faith & Wells Budding") while /rsvp takes a row per person
// ("Faith Budding"). No guest rows carry an email, so names are the only
// join key available, and they are entered by hand on both sides — nicknames
// ("Mike" / "Michael"), spelling drift ("Storey" / "Story"), and shortened
// forms ("Jess" / "Jessica") are all common.
//
// So this is deliberately fuzzy: it errs toward calling a household RSVP'd
// when any one member plausibly matches, because a false "still waiting" is
// more annoying than a missed one. Treat the output as a prompt to follow up,
// not as an authoritative list.

const SUFFIXES = new Set(["jr", "sr", "ii", "iii", "iv", "v"]);

export interface Person {
  first: string;
  last: string;
}

function strip(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Split a household line into its people. Splits on the raw string before
 * punctuation is stripped, otherwise "&" and "," vanish and the whole line
 * collapses into one name.
 */
export function splitHousehold(raw: string): string[] {
  return raw
    .split(/\s*(?:&|,|\band\b)\s*/i)
    .map(strip)
    .filter(Boolean);
}

/**
 * Expand a household line into individual people, carrying the trailing
 * surname back to members given by first name only:
 *   "Phil, Faith & Wells Budding" -> phil budding, faith budding, wells budding
 *   "Beth & Jack Waters"          -> beth waters, jack waters
 *   "Hopper Ragsdale & Aidan Mccormick" -> both keep their own surname
 */
export function expandHousehold(raw: string): Person[] {
  const parts = splitHousehold(raw);
  if (parts.length === 0) return [];

  const words = (p: string) =>
    p.split(" ").filter((w) => w && !SUFFIXES.has(w));

  // The shared surname comes from the last part that actually carries one, so
  // "Ryan Sproule & Madeline" still resolves Madeline to Sproule.
  const withSurname = parts.map(words).filter((w) => w.length >= 2);
  const donor = withSurname[withSurname.length - 1] ?? words(parts[parts.length - 1]);
  const surname = donor[donor.length - 1] ?? "";

  return parts
    .map((part) => {
      const w = words(part);
      if (w.length === 0) return null;
      if (w.length === 1) return { first: w[0], last: surname };
      return { first: w[0], last: w[w.length - 1] };
    })
    .filter((p): p is Person => p !== null && Boolean(p.first));
}

/** Levenshtein distance, capped — we only care about "within 1". */
function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 1) return 2;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = curr;
  }
  return prev[b.length];
}

/** Equal, or off by a single character (catches Storey/Story, Michele/Michelle). */
function near(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.length < 3 || b.length < 3) return false;
  return editDistance(a, b) <= 1;
}

/** Given names also match on prefix, so Jess/Jessica and Alex/Alexandra pair up. */
function firstNameMatches(a: string, b: string): boolean {
  if (near(a, b)) return true;
  if (a.length < 3 || b.length < 3) return false;
  return a.startsWith(b) || b.startsWith(a);
}

export function personMatches(a: Person, b: Person): boolean {
  return near(a.last, b.last) && firstNameMatches(a.first, b.first);
}

/**
 * Has anyone from this household RSVP'd? `guestNames` are the individual
 * guest names on active (non-deleted) invites.
 */
export function householdHasRsvped(
  householdName: string,
  guestPeople: Person[]
): boolean {
  const members = expandHousehold(householdName);
  return members.some((m) => guestPeople.some((g) => personMatches(m, g)));
}

/** Flatten guest name rows into people, handling "Kieran and Carol Devery". */
export function guestNamesToPeople(names: string[]): Person[] {
  return names.flatMap((n) => expandHousehold(n));
}
