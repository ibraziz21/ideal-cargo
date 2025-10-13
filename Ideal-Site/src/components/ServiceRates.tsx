import { Container } from "./Container";
import { QuickQuoteButton } from "@/components/QuickQuote";

export function ServicesRates() {
    return (
        <section id="services" className="bg-white py-12 md:py-16">
            <Container>
                <div className="max-w-2xl">
                    <h2 className="font-display text-2xl font-bold text-ink">What We Do</h2>
                    <p className="mt-3 text-ink/80">
                        We move goods, materials, and essentials for homes and businesses across Mombasa County.
                        Tell us what you need moved and where — we’ll send a fixed quote in minutes.
                    </p>
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-sand p-5 shadow-soft">
                        <div className="text-lg font-semibold text-coast">Business Deliveries</div>
                        <p className="mt-1 text-ink/80">Daily dispatches for hardware, retail & e-commerce. Single or multi-drop.</p>
                    </div>

                    <div className="rounded-lg bg-sand p-5 shadow-soft">
                        <div className="text-lg font-semibold text-coast">House & Office Moves</div>
                        <p className="mt-1 text-ink/80">Fast, careful relocations for apartments, bedsits, and small offices.</p>
                    </div>

                    <div className="rounded-lg bg-sand p-5 shadow-soft">
                        <div className="text-lg font-semibold text-coast">Port & CFS Runs</div>
                        <p className="mt-1 text-ink/80">Last-mile for loose cargo and pallets. Experienced with gate passes.</p>
                    </div>

                    <div className="rounded-lg bg-sand p-5 shadow-soft">
                        <div className="text-lg font-semibold text-coast">Events & Rentals</div>
                        <p className="mt-1 text-ink/80">Furniture, appliances, tents, staging — delivered when it matters.</p>
                    </div>
                </div>

                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <QuickQuoteButton source="Why Section" label="Get my quote on WhatsApp" />
                    <a href="#quote" className="text-sm text-ink/80 underline-offset-2 hover:underline">
                        Prefer a callback?
                    </a>
                </div>
            </Container>
        </section>
    );
}
