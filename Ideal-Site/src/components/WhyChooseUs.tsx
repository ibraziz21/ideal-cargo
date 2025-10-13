import { Container } from "./Container";
import {
    Clock,
    ShieldCheck,
    MapPin,
    MessageSquare,
    Users,
    PackageCheck,
    Sparkles,
    Truck,
} from "lucide-react";
import { QuickQuoteButton } from "./QuickQuote";

const POINTS = [
    {
        title: "On-time, every time",
        desc: "We plan routes to beat traffic and show up when we promise.",
        Icon: Clock,
    },
    {
        title: "Handled with care",
        desc: "Straps, covers, and a friendly crew that treats items like their own.",
        Icon: PackageCheck,
    },
    {
        title: "Live updates",
        desc: "Clear communication you can share with your customer or team.",
        Icon: MessageSquare,
    },
    {
        title: "Trusted locally",
        desc: "Repeat clients across Nyali, Bamburi, Changamwe & Shanzu.",
        Icon: MapPin,
    },
    {
        title: "Business-ready",
        desc: "POD photos, optional insurance, and eTIMS invoices on request.",
        Icon: ShieldCheck,
    },
    {
        title: "Flexible scheduling",
        desc: "Early morning, same-day, or weekend runs — we adapt to you.",
        Icon: Truck,
    },
];

export function WhyChooseUs() {
    return (
        <section id="why" className="relative overflow-hidden bg-sand">
            {/* Decorative background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
            >
                <div className="absolute -top-28 -left-24 h-72 w-72 rounded-full bg-coast/10 blur-3xl" />
                <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-coral/10 blur-3xl" />
            </div>

            <Container className="relative py-12 md:py-16">
                {/* Heading + badges */}
                <div className="mx-auto max-w-2xl text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-1 text-xs text-ink/70">
                        <Sparkles className="h-3.5 w-3.5 text-coast" />
                        Why clients choose <b className="text-ink">&nbsp;Ideal Cargo Services</b>
                    </span>

                    <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink sm:text-4xl">
                        Reliability on wheels — <span className="text-coast">without the hassle</span>
                    </h2>

                    <p className="mt-3 text-ink/75">
                        We protect your time, your goods, and your peace of mind. Simple booking, clear updates, careful handling, and on-time arrivals.
                    </p>

                    {/* KPIs */}
                    <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        <KpiPill label="Avg. response 3–5 mins" />
                        <KpiPill label="4.9★ recent jobs" />
                        <KpiPill label="100+ repeat clients" className="hidden sm:flex" />
                    </div>
                </div>

                {/* Feature cards */}
                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {POINTS.map(({ title, desc, Icon }) => (
                        <article
                            key={title}
                            className="group relative rounded-xl border border-ink/10 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            <div className="absolute -inset-x-0 -top-px h-1 rounded-t-xl bg-gradient-to-r from-coast/20 via-coral/20 to-coast/20 opacity-0 transition group-hover:opacity-100" />
                            <div className="flex items-start gap-3">
                                <div className="grid h-9 w-9 place-items-center rounded-md bg-coast/10 text-coast">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-ink">{title}</h3>
                                    <p className="mt-1 text-sm leading-relaxed text-ink/75">{desc}</p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Pledge banner */}
                <div className="mt-10 rounded-xl border border-seafoam/30 bg-seafoam/10 p-4 text-center text-sm text-coast">
                    ✅ <b>On-time pledge:</b> if we’re late without notice, we discount your next job.
                </div>

                {/* Section CTA */}
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

function KpiPill({ label, className = "" }: { label: string; className?: string }) {
    return (
        <div
            className={[
                "inline-flex items-center justify-center rounded-full border border-ink/10 bg-white px-3 py-1 text-xs text-ink/70",
                className,
            ].join(" ")}
        >
            {label}
        </div>
    );
}
