import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ExitIntent } from "@/components/ExitIntent";
import { FloatingQuickQuote } from "@/components/FloatingQuickQuote";

export const metadata: Metadata = {
  title: "Ideal Cargo Services — Reliable Local Deliveries in Mombasa",
  description:
    "Fast, reliable deliveries. Quick WhatsApp quotes and on-time arrivals.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Ideal Cargo Services — Reliable Local Deliveries in Mombasa",
    description: "Fast, reliable deliveries. Quick WhatsApp quotes and on-time arrivals.",
    url: "https://example.com",
    siteName: "Mombasa Light Transport",
    images: [{ url: "/truck-hero.jpg", width: 1200, height: 630 }],
    locale: "en_KE",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Header />
        {children}
        <Footer />
        <ExitIntent
          waLink="https://wa.me/254769848996?text=Hi!%20I%20need%20a%20quick%20quote.%0APickup%20pin%3A%20%0ADrop%20pin(s)%3A%20%0AItems%3A%20%0ADate%2Ftime%3A%20%0ANeed%20helper%3F%20(Y%2FN)%3A"
          headline="Get a quick quote before you go?"
          blurb="Share pickup & drop pins — we’ll reply on WhatsApp in 3–5 minutes with a fixed quote."
          cooldownDays={7}
          armAfterMs={3000}
        />
      
      </body>
    </html>
  );
}
