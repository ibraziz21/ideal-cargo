"use client";

import Image from "next/image";
import { Container } from "./Container";
import { QuickQuoteButton } from "@/components/QuickQuote";
import { CheckCircle2, Sparkles, ArrowDown, MapPin, MessageSquare } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-sand">
      {/* Decorative orbs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-coast/10 blur-3xl" />
        <div className="absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-coral/10 blur-3xl" />
      </div>

      {/* Availability micro-bar */}
      <div className="border-b border-ink/10 bg-white/70 backdrop-blur">
        <Container className="flex items-center justify-center gap-2 py-2 text-xs text-ink/70">
          <span className="inline-flex items-center gap-1 rounded-full border border-seafoam/30 bg-seafoam/10 px-2 py-0.5 text-coast">
            <CheckCircle2 className="h-3.5 w-3.5" /> Today: <b className="ml-1">2 morning</b>, <b>3 afternoon</b> slots
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Reply on WhatsApp in <b>3–5 minutes</b></span>
        </Container>
      </div>

      <Container className="relative grid gap-10 py-10 md:grid-cols-2 md:gap-12 md:py-16">
        {/* LEFT: Copy + CTAs */}
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-1 text-[11px] text-ink/70">
            <Sparkles className="h-3.5 w-3.5 text-coast" />
            Ideal Cargo Services • Mombasa
          </span>

          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-[-0.02em] text-ink sm:text-5xl">
            Fast, reliable deliveries — <span className="text-coast">book in minutes</span>
          </h1>

          <p className="mt-4 text-ink/80">
            We make moving simple: quick quotes on WhatsApp, clear updates you can share, careful handling,
            and on-time arrivals. For homes and businesses across Mombasa.
          </p>

          {/* Key outcomes */}
          <ul className="mt-5 grid grid-cols-2 gap-2 text-sm text-ink/80 sm:grid-cols-3">
            <li className="inline-flex items-center gap-2">
              <BadgeDot /> Same-day options
            </li>
            <li className="inline-flex items-center gap-2">
              <BadgeDot /> Careful, friendly crew
            </li>
            <li className="inline-flex items-center gap-2">
              <BadgeDot /> Live updates
            </li>
            <li className="inline-flex items-center gap-2">
              <BadgeDot /> POD photos
            </li>
            <li className="inline-flex items-center gap-2">
              <BadgeDot /> eTIMS invoices
            </li>
            <li className="inline-flex items-center gap-2">
              <BadgeDot /> Local & accountable
            </li>
          </ul>

          {/* CTAs */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <QuickQuoteButton source="Hero" label="Get quote on WhatsApp" />
            <a href="#quote" className="text-sm text-ink/80 underline-offset-2 hover:underline">
              Prefer a callback?
            </a>
          </div>

          {/* Trust micro-proof */}
          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-ink/60">
            <span className="inline-flex items-center gap-1">
              ⭐ 4.9/5 recent jobs
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              CBD • Nyali • Bamburi • Changamwe • Likoni
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline inline-flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              We reply in minutes
            </span>
          </div>

          {/* Scroll cue (desktop only) */}
          <div className="mt-8 hidden items-center gap-2 text-xs text-ink/50 md:flex">
            <ArrowDown className="h-4 w-4" />
            Scroll for services & reviews
          </div>
        </div>

        {/* RIGHT: Visual */}
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-soft">
            <Image
              src="/truck-hero.jpg"
              alt="Our team delivering safely and on time in Mombasa"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            {/* subtle overlay gradient for text legibility if you ever stack text here */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-transparent" />
          </div>

          {/* Floating review card */}
          <figure className="absolute -bottom-4 left-4 w-[85%] max-w-xs rounded-lg border border-ink/10 bg-white p-3 shadow-soft sm:left-6">
            <blockquote className="text-sm text-ink">
              “Booked at 8am — materials delivered before noon. Smooth and professional.”
            </blockquote>
            <figcaption className="mt-1 text-xs text-ink/60">— Hassan, Tudor</figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}

function BadgeDot() {
  return <span className="inline-block h-1.5 w-1.5 rounded-full bg-coast" />;
}
