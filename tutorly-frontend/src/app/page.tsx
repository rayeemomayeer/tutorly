import { CtaStrip } from "@/components/home/Cta-Stripe";
import { FeaturedTutors } from "@/components/home/FeaturedTutors";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { StatsBar } from "@/components/home/StatsBar";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <main className="space-y-12 sm:space-y-16">
        <Hero />
        <StatsBar />
        <FeaturedTutors />
        <HowItWorks />
        <CtaStrip />
      </main>
      <Footer />
    </div>
  );
}