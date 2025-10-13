"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ExitIntent
 * - Opens when the user's cursor moves toward the browser chrome (y < 10px)
 * - Desktop only (>= 768px)
 * - Shows at most once per session, and no more than once every `cooldownDays`
 * - Also supports ESC to close and outside-click to dismiss
 * - Accessible dialog with focus trapping on the primary CTA
 */
export function ExitIntent({
  waLink = "https://wa.me/2547XXXXXXXX?text=Hi!%20I%20need%20a%20quick%20quote.%0APickup%20pin%3A%20%0ADrop%20pin(s)%3A%20%0AItems%3A%20%0ADate%2Ftime%3A%20%0ANeed%20helper%3F%20(Y%2FN)%3A",
  headline = "Get a quick quote before you go?",
  blurb = "Share pickup & drop pins — we’ll reply on WhatsApp in 3–5 minutes with a fixed quote.",
  cooldownDays = 7,
  armAfterMs = 3000, // wait a few seconds after page load before arming
}: {
  waLink?: string;
  headline?: string;
  blurb?: string;
  cooldownDays?: number;
  armAfterMs?: number;
}) {
  const [open, setOpen] = useState(false);
  const [armed, setArmed] = useState(false);
  const shownThisSessionRef = useRef(false);
  const primaryBtnRef = useRef<HTMLAnchorElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Keys for local/session storage
  const COOLDOWN_KEY = "mlt_exit_intent_suppressed_until";
  const SESSION_KEY = "mlt_exit_intent_shown_session";

  // Helpers
  const isDesktop = () => typeof window !== "undefined" && window.innerWidth >= 768;
  const now = () => Date.now();

  const withinCooldown = () => {
    try {
      const untilStr = localStorage.getItem(COOLDOWN_KEY);
      if (!untilStr) return false;
      const until = parseInt(untilStr, 10);
      return now() < until;
    } catch {
      return false;
    }
  };

  const setCooldown = () => {
    try {
      const millis = cooldownDays * 24 * 60 * 60 * 1000;
      localStorage.setItem(COOLDOWN_KEY, String(now() + millis));
    } catch {
      /* ignore */
    }
  };

  const setSessionShown = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
      shownThisSessionRef.current = true;
    } catch {
      /* ignore */
    }
  };

  const alreadyShownThisSession = () => {
    if (shownThisSessionRef.current) return true;
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  };

  useEffect(() => {
    // Arm after short delay (prevents immediate pop on page load)
    const t = setTimeout(() => setArmed(true), armAfterMs);
    return () => clearTimeout(t);
  }, [armAfterMs]);

  useEffect(() => {
    if (!armed || !isDesktop()) return;

    const onMouseMove = (e: MouseEvent) => {
      if (open) return;
      if (alreadyShownThisSession()) return;
      if (withinCooldown()) return;

      // Trigger if cursor goes near the top bar (attempting to close/tab/back)
      if (e.clientY <= 10) {
        setOpen(true);
        setSessionShown();
        setCooldown();
        // Focus CTA after open for accessibility
        setTimeout(() => primaryBtnRef.current?.focus(), 0);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [armed, open]);

  // Close handlers
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onMouseDown={onOverlayClick}
      aria-hidden={false}
      role="dialog"
      aria-modal="true"
      aria-label="Exit offer"
    >
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-soft outline-none">
        <div className="text-lg font-semibold text-ink">{headline}</div>
        <p className="mt-1 text-sm text-ink/80">{blurb}</p>

        <a
          ref={primaryBtnRef}
          href={waLink}
          className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-coral px-4 py-2 text-sm font-medium text-white shadow-soft focus:outline-none"
        >
          WhatsApp a Quote
        </a>

        <button
          onClick={() => setOpen(false)}
          className="mt-2 w-full text-center text-xs text-ink/60 hover:text-ink focus:outline-none"
          aria-label="No thanks"
        >
          No thanks
        </button>
      </div>
    </div>
  );
}
