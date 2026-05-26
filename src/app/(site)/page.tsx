import Image from "next/image";
import { HomeCard } from "./home-card";

export default function Home() {
  return (
    <section className="relative w-full flex-1 overflow-hidden min-h-[calc(100svh-2.5rem)] sm:-mt-12 sm:h-screen sm:min-h-screen sm:flex-none md:-mt-10">
      <Image
        src="/images/Home.png"
        alt="Emily & Sam — San Miguel de Allende"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 flex items-center justify-center px-3 py-4 [perspective:1400px] sm:py-12">
        <HomeCard />
      </div>
    </section>
  );
}
