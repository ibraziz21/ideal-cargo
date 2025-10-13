import { Hero } from "@/components/Hero";
import { ServicesRates } from "@/components/ServiceRates";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Reviews } from "@/components/Reviews";
import { QuoteForm } from "@/components/QuoteForm";
import { TrustStrip } from "@/components/TrustStrip";
import { B2BStrip } from "@/components/B2BStrip";

export default function Page() {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <B2BStrip />
      <ServicesRates />
      <WhyChooseUs />
      <Reviews />
    </main>
  );
}
