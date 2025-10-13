"use client";

import { QuickQuoteButton } from "@/components/QuickQuote";

/**
 * Mobile-only floating Quick Quote button
 * - Fixed bottom-right
 * - Hidden on md+ screens
 */
export function FloatingQuickQuote() {
  return (
    <div className="fixed bottom-4 right-4 z-50 md:hidden">
      <QuickQuoteButton
        source="Floating Button"
        label="WhatsApp Us"
        className="rounded-full px-5 py-3 shadow-soft"
      />
    </div>
  );
}
