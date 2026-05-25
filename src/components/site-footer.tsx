import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="bg-[#f5e9c8] text-[#493932]">
      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-3 items-center gap-4 px-2 py-10 sm:px-3">
        <p className="font-edict text-sm font-medium tracking-[0.12em] justify-self-start">
          02-27-2027
        </p>
        <div className="justify-self-center">
          <Image
            src="/images/sandelogo.svg"
            alt="S & E"
            width={78}
            height={99}
            className="h-12 w-auto"
          />
        </div>
        <Link
          href="/rsvp"
          className="justify-self-end border border-[#493932]/80 px-5 py-2 text-xs uppercase tracking-[0.22em] transition-colors hover:bg-[#493932] hover:text-[#f5e9c8]"
        >
          RSVP
        </Link>
      </div>
    </footer>
  );
}
