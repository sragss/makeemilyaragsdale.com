import Image from "next/image";
import { HomeCard } from "./home-card";

export default function Home() {
  return (
    <section className="relative -mt-12 h-screen w-full overflow-hidden md:-mt-10">
      <Image
        src="/images/Home.png"
        alt="Emily & Sam — San Miguel de Allende"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 flex items-center justify-center px-6 py-12 [perspective:1400px]">
        <HomeCard />
      </div>
    </section>
  );
}
