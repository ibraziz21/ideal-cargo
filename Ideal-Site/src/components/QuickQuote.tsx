"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Package, CalendarDays, Check, X, MessageCircle } from "lucide-react";

type Props = {
  /** where the click came from (e.g., "Header", "WhySection", "Hero") */
  source: string;
  /** button label (e.g., "WhatsApp", "Get my quote on WhatsApp") */
  label?: string;
  /** optional className to match your button styles */
  className?: string;
  /** visual variant: "primary" uses coral background, "outline" uses border */
  variant?: "primary" | "outline";
};

const PHONE_E164 = "+2547XXXXXXXX"; // ← set your WhatsApp number here once (E.164)
const STORAGE_KEY = "ideal_quote_last";

type Form = {
  pickup: string;
  drop: string;
  items: string;
  when: string;     // free text: "ASAP", "8–10am", "Tue 3pm"
  helper: boolean;
};

/* Build a rich WhatsApp message with clear labels + source tag */
function buildMessage(f: Form, source: string) {
  const lines = [
    "Hi — I need a delivery quote.",
    `Pickup: ${f.pickup || "-"}`,
    `Drop: ${f.drop || "-"}`,
    `Items: ${f.items || "-"}`,
    `When: ${f.when || "-"}`,
    `Helper: ${f.helper ? "Yes" : "No"}`,
    "",
    `(via Ideal Cargo Services • ${source})`,
  ].join("\n");
  return encodeURIComponent(lines);
}

/* Very small form validator: require pickup, drop, items */
function validate(f: Form) {
  const e: Partial<Record<keyof Form, string>> = {};
  if (!f.pickup.trim()) e.pickup = "Pickup is required.";
  if (!f.drop.trim()) e.drop = "Drop is required.";
  if (!f.items.trim()) e.items = "What are we moving?";
  return e;
}

export function QuickQuoteButton({ source, label = "WhatsApp", className = "", variant = "primary" }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>({ pickup: "", drop: "", items: "", when: "ASAP", helper: false });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  // hydrate from localStorage for convenience
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const last = JSON.parse(raw) as Form;
        setForm((s) => ({ ...s, ...last }));
      }
    } catch {}
  }, []);

  // lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) setTimeout(() => firstFieldRef.current?.focus(), 0);
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function openModal(e?: React.MouseEvent) {
    e?.preventDefault();
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  function submit() {
    const err = validate(form);
    setErrors(err);
    if (Object.keys(err).length) return;

    // persist for next time
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(form)); } catch {}

    const msg = buildMessage(form, source);
    const href = `https://wa.me/${PHONE_E164.replace("+", "")}?text=${msg}`;
    // Meta Pixel (optional)
    // @ts-ignore
    window.fbq?.("trackCustom", "QuickQuoteWhatsAppClick", { source });

    window.open(href, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  const styles =
    variant === "primary"
      ? "inline-flex items-center justify-center rounded-md bg-coral px-4 py-2 text-sm font-medium text-white shadow-soft hover:opacity-95"
      : "inline-flex items-center justify-center rounded-md border border-ink/15 bg-white px-4 py-2 text-sm text-ink/80 hover:bg-sand";

  return (
    <>
      {/* Trigger */}
      <button onClick={openModal} className={[styles, className].join(" ")} aria-haspopup="dialog">
        <MessageCircle className="mr-2 h-4 w-4" /> {label}
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Quick quote"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold text-ink">Get a quick quote</div>
                <p className="mt-1 text-xs text-ink/70">We’ll reply on WhatsApp in 3–5 minutes.</p>
              </div>
              <button className="rounded-md p-1 text-ink/60 hover:bg-sand" aria-label="Close" onClick={closeModal}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              <label className="block">
                <span className="mb-1 flex items-center gap-2 text-sm font-medium text-ink">
                  <MapPin className="h-4 w-4" /> Pickup (pin/area)
                </span>
                <input
                  ref={firstFieldRef}
                  className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast"
                  placeholder="e.g., Kengeleni, Nyali — pin"
                  value={form.pickup}
                  onChange={(e) => setForm((s) => ({ ...s, pickup: e.target.value }))}
                />
                {errors.pickup && <span className="mt-1 block text-xs text-coral">{errors.pickup}</span>}
              </label>

              <label className="block">
                <span className="mb-1 flex items-center gap-2 text-sm font-medium text-ink">
                  <MapPin className="h-4 w-4" /> Drop (pin/area)
                </span>
                <input
                  className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast"
                  placeholder="e.g., City Mall, Nyali — loading bay"
                  value={form.drop}
                  onChange={(e) => setForm((s) => ({ ...s, drop: e.target.value }))}
                />
                {errors.drop && <span className="mt-1 block text-xs text-coral">{errors.drop}</span>}
              </label>

              <label className="block">
                <span className="mb-1 flex items-center gap-2 text-sm font-medium text-ink">
                  <Package className="h-4 w-4" /> What are we moving?
                </span>
                <input
                  className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast"
                  placeholder="e.g., sofa & fridge / 30 boxes / cement bags"
                  value={form.items}
                  onChange={(e) => setForm((s) => ({ ...s, items: e.target.value }))}
                />
                {errors.items && <span className="mt-1 block text-xs text-coral">{errors.items}</span>}
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 flex items-center gap-2 text-sm font-medium text-ink">
                    <CalendarDays className="h-4 w-4" /> When
                  </span>
                  <input
                    className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast"
                    placeholder="ASAP / 8–10am / Tue 3pm"
                    value={form.when}
                    onChange={(e) => setForm((s) => ({ ...s, when: e.target.value }))}
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-ink">Helper</span>
                  <button
                    type="button"
                    onClick={() => setForm((s) => ({ ...s, helper: !s.helper }))}
                    className={[
                      "inline-flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition",
                      form.helper ? "border-coast bg-coast/10 text-coast" : "border-ink/15 bg-white text-ink/80 hover:bg-sand",
                    ].join(" ")}
                    aria-pressed={form.helper}
                  >
                    <Check className={form.helper ? "h-4 w-4" : "h-4 w-4 opacity-0"} />
                    {form.helper ? "Helper needed" : "No helper"}
                  </button>
                </label>
              </div>
            </div>

            <div className="mt-4 flex flex-col-reverse items-center gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={closeModal}
                className="w-full rounded-md border border-ink/15 bg-white px-4 py-2 text-sm text-ink/80 hover:bg-sand sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                className="w-full rounded-md bg-coral px-5 py-2 text-sm font-medium text-white shadow-soft hover:opacity-95 sm:w-auto"
              >
                Open WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
