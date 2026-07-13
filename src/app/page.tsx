import LandingHero from "@/components/landing/LandingHero";
import MechanicsSection from "@/components/landing/MechanicsSection";
import DemoSection from "@/components/landing/DemoSection";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <LandingHero />
      <MechanicsSection />
      <DemoSection />
    </main>
  );
}
