import { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { B2BRFQButton } from "@/components/B2BRFQButton";
import { ShieldCheck, MapPinned, CheckCircle2, Boxes } from "lucide-react";

export const metadata: Metadata = {
  title: "B2B Logistics — Ideal Cargo Services",
  description: "Trade deliveries, multi-drop routes, and retainers with SLA, eTIMS and POD photos.",
};

export default function B2BPage() {
  return (
    <main className="bg-sand">
      {/* Hero */}
      <section className="bg-white">
        <Container className="grid gap-8 py-12 md:grid-cols-2 md:py-16">
          <div className="flex flex-col justify-center">
            <h1 className="font-display text-4xl font-extrabold tracking-[-0.02em] text-ink sm:text-5xl">
              Reliable B2B deliveries — <span className="text-coast">built for operations</span>
            </h1>
            <p className="mt-3 text-ink/80">
              We run same-day and scheduled routes for hardware stores, retail, e-commerce, and CFS.
              Expect on-time dispatch, POD photos, and eTIMS invoices — with optional GIT cover.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <B2BRFQButton label="Request trade quote" />
              <a href="#sla" className="text-sm text-ink/80 underline-offset-2 hover:underline">View SLA</a>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-soft">
            <Image src="/truck-inline.jpg" alt="Business deliveries" fill className="object-cover" priority />
          </div>
        </Container>
      </section>

      {/* Highlights */}
      <section className="bg-sand">
        <Container className="py-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Feature icon={ShieldCheck} title="SLA & Compliance" desc="On-time pledge, safety brief, port/CFS access, PPE." />
            <Feature icon={CheckCircle2} title="POD & eTIMS" desc="Photo proof on delivery, eTIMS-ready invoices." />
            <Feature icon={Boxes} title="Multi-drop Ready" desc="Route planning for outlets & store transfers." />
            <Feature icon={MapPinned} title="Coverage" desc="CBD, Nyali, Bamburi, Shanzu, Changamwe, Likoni." />
          </div>
        </Container>
      </section>

      {/* SLA */}
      <section id="sla" className="bg-white">
        <Container className="py-12">
          <h2 className="font-display text-2xl font-bold text-ink">Service Level & Onboarding</h2>
          <ul className="mt-4 space-y-2 text-ink/80 text-sm leading-relaxed">
            <li>• <b>On-time pledge:</b> if late without notice, next job is discounted.</li>
            <li>• <b>Dispatch windows:</b> Early (6:30–8), Morning (8–12), Afternoon (12–5).</li>
            <li>• <b>POD:</b> photo, receiver name, time stamp; emailed daily if required.</li>
            <li>• <b>Billing:</b> eTIMS PDF; LPO/LR supported; monthly statements available.</li>
            <li>• <b>Safety:</b> PPE, straps/blankets; site inductions accommodated.</li>
          </ul>
          <div className="mt-6">
            <B2BRFQButton label="Open RFQ" />
          </div>
        </Container>
      </section>
    </main>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-coast/10 text-coast">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold text-ink">{title}</div>
          <p className="mt-1 text-sm text-ink/75">{desc}</p>
        </div>
      </div>
    </div>
  );
}
