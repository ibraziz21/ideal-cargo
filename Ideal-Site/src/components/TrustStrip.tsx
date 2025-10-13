"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

/** ----------------------------------------------
 * Types & sample data
 * ---------------------------------------------- */
export type Brand = {
  name: string;
  logoSrc?: string;   // public path, e.g. "/logos/hisense.svg"
  url?: string;       // landing URLs (optional)
};

const DEFAULT_BRANDS: Brand[] = [
  { name: "Hisense", logoSrc: "/logos/hisense.svg", url: "https://www.hisense.co.ke" },
  { name: "LittleCab", logoSrc: "/logos/littlecab.svg", url: "https://little.bz" },
  { name: "Jiji", logoSrc: "/logos/jiji.svg", url: "https://jiji.co.ke" },
  { name: "Airbnb Hosts", logoSrc: "/logos/airbnb-hosts.svg" }, // generic “hosts” badge
  { name: "Local Hardware Yards", logoSrc: "/logos/hardware.svg" },
  { name: "Retail & E-commerce", logoSrc: "/logos/retail.svg" },
];

/** ----------------------------------------------
 * TrustStrip
 * - Mobile: static grid (tap-friendly)
 * - Desktop: marquee carousel (infinite scroll, pauses on hover)
 * - Respects prefers-reduced-motion
 * - Lazy loads images, with fallback “initials” badge if missing
 * ---------------------------------------------- */
export function TrustStrip({
  brands = DEFAULT_BRANDS,
  title = "Trusted by businesses across Mombasa",
  subtitle = "We deliver on time for stores, offices, Airbnb hosts, and local brands.",
  showStars = true,
  duplicateForMarquee = 2, // how many times to repeat the list to simulate infinite scroll
  speed = 28_000, // ms it takes for one full marquee loop
}: {
  brands?: Brand[];
  title?: string;
  subtitle?: string;
  showStars?: boolean;
  duplicateForMarquee?: number;
  speed?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReducedMotion(mq.matches);
    handler();
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  // Duplicate items for marquee effect
  const marqueeItems = useMemo(() => {
    const clean = brands.filter(Boolean);
    const list: Brand[] = [];
    for (let i = 0; i < duplicateForMarquee; i++) list.push(...clean);
    return list;
  }, [brands, duplicateForMarquee]);

  return (
    <section aria-label="Brands that trust our deliveries" className="bg-white">
      {/* Top line: headline + (optional) stars */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="font-display text-base font-semibold text-ink">
            {title}
          </h2>
          <p className="text-xs text-ink/70">{subtitle}</p>
          {showStars && (
            <div className="mt-1 flex items-center gap-0.5" aria-label="Average rating 4.9 out of 5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${i < 5 ? "fill-amber-400" : "fill-ink/20"}`}
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M10 15.27l6.18 3.73-1.64-7.03L19 7.24l-7.19-.61L10 0 8.19 6.63 1 7.24l4.46 4.73L3.82 19z" />
                </svg>
              ))}
              <span className="ml-2 text-xs text-ink/60">4.9/5 (recent jobs)</span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: grid (no motion) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-4 md:hidden">
        <ul className="grid grid-cols-2 gap-3">
          {brands.map((b) => (
            <li key={b.name}>
              <LogoCard brand={b} />
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop: marquee */}
      <div
        ref={containerRef}
        className="relative hidden border-t border-b border-ink/10 bg-white py-4 md:block"
        onMouseEnter={() => {
          if (containerRef.current) containerRef.current.style.setProperty("--_pause", "paused");
        }}
        onMouseLeave={() => {
          if (containerRef.current) containerRef.current.style.setProperty("--_pause", "running");
        }}
      >
        <div className="mx-auto max-w-[100vw] overflow-hidden">
          <ul
            className="flex min-w-full shrink-0 items-center gap-6"
            style={
              reducedMotion
                ? undefined
                : {
                    animation: `marquee var(--_speed, ${speed}ms) linear infinite`,
                    animationPlayState: "var(--_pause, running)",
                  }
            }
          >
            {marqueeItems.map((b, idx) => (
              <li key={`${b.name}-${idx}`} className="shrink-0">
                <LogoCard brand={b} />
              </li>
            ))}
          </ul>
        </div>

        {/* Inline keyframes to avoid Tailwind config changes */}
        <style jsx>{`
          @keyframes marquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
        `}</style>
      </div>
    </section>
  );
}

/** ----------------------------------------------
 * LogoCard
 * - Uses next/image when logoSrc present
 * - Falls back to initials badge if missing
 * - Entire tile clickable when URL provided
 * ---------------------------------------------- */
function LogoCard({ brand }: { brand: Brand }) {
  const { name, logoSrc, url } = brand;
  const initials = getInitials(name);

  const content = (
    <div
      className="flex h-14 w-[160px] items-center justify-center rounded-md border border-ink/10 bg-sand px-4 transition
                 hover:bg-white hover:shadow-soft focus:outline-none"
      aria-label={name}
      role="img"
    >
      {logoSrc ? (
        <Image
          src={logoSrc}
          alt={name}
          width={120}
          height={28}
          className="h-6 w-auto object-contain opacity-80 transition hover:opacity-100"
          loading="lazy"
          sizes="160px"
        />
      ) : (
        <span className="text-sm font-semibold text-ink/80">{initials}</span>
      )}
    </div>
  );

  return url ? (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="block focus-visible:outline-none"
      aria-label={`${name} (opens in new tab)`}
    >
      {content}
    </a>
  ) : (
    content
  );
}

/** Utility: derive initials (fallback) */
function getInitials(full: string) {
  const parts = full.split(/\s+/).filter(Boolean);
  if (!parts.length) return "—";
  const take = (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  return take.toUpperCase();
}
