"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Phone, Menu, X } from "lucide-react";


const PHONE_E164 = "+2547XXXXXXXX"; // set once
const PHONE_LOCAL = "07XX XXX XXX";

const NAV = [
  { href: "#services", label: "Services" },
  { href: "#why", label: "Why Us" },
  { href: "#reviews", label: "Reviews" },
  { href: "#quote", label: "Get Quote" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // smooth-scroll for in-page links
  function onNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  }

  return (
    <header
      ref={headerRef}
      className={[
        "sticky top-0 z-50 transition-colors",
        "border-b border-ink/10",
        scrolled ? "bg-white/90 backdrop-blur-md" : "bg-white/70 backdrop-blur",
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-3 focus:outline-none">
          <div className="relative h-9 w-9 overflow-hidden rounded-md">
            <Image
              src="/ideal-logo.png"
              alt="Ideal Cargo Services"
              fill
              sizes="36px"
              className="object-contain"
              priority
            />
          </div>
          <span className="font-display text-base font-bold text-ink">
            Ideal Cargo <span className="text-ink/80">Services</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => onNavClick(e, item.href)}
              className="text-sm text-ink/80 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs (Quick Quote + Call) */}
        <div className="hidden items-center gap-2 md:flex">
          <a
            href={`tel:${PHONE_E164}`}
            className="inline-flex items-center gap-2 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink/80 hover:bg-sand"
            aria-label={`Call ${PHONE_LOCAL}`}
          >
            <Phone className="h-4 w-4" />
            <span className="hidden lg:inline">{PHONE_LOCAL}</span>
            <span className="lg:hidden">Call</span>
          </a>
          
        </div>

        {/* Mobile menu button */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-ink md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={[
          "md:hidden",
          "overflow-hidden transition-[max-height] duration-300",
          open ? "max-h-[60vh]" : "max-h-0",
        ].join(" ")}
        aria-hidden={!open}
      >
        <div className="space-y-1 border-t border-ink/10 bg-white px-4 pb-4 pt-2">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => onNavClick(e, item.href)}
              className="block rounded-md px-2 py-2 text-sm text-ink/90 hover:bg-sand"
            >
              {item.label}
            </a>
          ))}

          <div className="mt-3 flex items-center gap-2">
            <a
              href={`tel:${PHONE_E164}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink/80"
            >
              <Phone className="h-4 w-4" />
              Call
            </a>

          </div>

          {/* Availability micro-bar */}
          <div className="mt-3 rounded-md border border-seafoam/30 bg-seafoam/10 px-3 py-2 text-xs text-coast">
            ✅ Today’s availability: <b>2 morning</b> & <b>3 afternoon</b> slots left
          </div>
        </div>
      </div>
    </header>
  );
}
