"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "./Button";
import { Container } from "./Container";
import {
  CalendarDays,
  Check,
  Loader2,
  MapPin,
  Package,
  Phone,
  Plus,
  Trash2,
  Upload,
  User,
} from "lucide-react";

/** ----------------------------
 * Types & helpers
 * ---------------------------- */
type Step = 1 | 2 | 3;

type FormState = {
  pickup: string;
  drops: string[];         // supports multi-stop
  items: string;
  weight: string;
  helper: boolean;
  notes: string;
  date: string;            // YYYY-MM-DD
  timeWindow: string;      // e.g., "ASAP", "8–10am"
  name: string;
  phone: string;           // will normalize to +2547...
  photos: File[];
};

const TIME_WINDOWS = ["ASAP", "8–10am", "10–12pm", "12–2pm", "2–4pm", "4–6pm"];
type PhoneOk = { ok: true; e164: string; display: string };
type PhoneBad = { ok: false };

function normalizeKenyaPhone(input: string): PhoneOk | PhoneBad {
  const digits = input.replace(/[^\d+]/g, "");
  let e164 = "";
  if (/^\+2547\d{8}$/.test(digits)) e164 = digits;
  else if (/^2547\d{8}$/.test(digits)) e164 = `+${digits}`;
  else if (/^07\d{8}$/.test(digits)) e164 = `+254${digits.slice(1)}`;
  else if (/^7\d{8}$/.test(digits)) e164 = `+254${digits}`;
  else return { ok: false };

  return { ok: true, e164, display: e164.replace("+254", "07") };
}


function buildWhatsAppMessage(form: FormState) {
  const drops = form.drops.filter(Boolean).join(" → ");
  const when = form.timeWindow ? `${form.date || ""} ${form.timeWindow}`.trim() : form.date;
  const lines = [
    "Hi! I need a quick delivery quote.",
    `Pickup: ${form.pickup}`,
    `Drop(s): ${drops || "-"}`,
    `Items: ${form.items}`,
    form.weight ? `Weight (approx): ${form.weight} kg` : undefined,
    `Helper: ${form.helper ? "Yes" : "No"}`,
    when ? `When: ${when}` : undefined,
    form.notes ? `Notes: ${form.notes}` : undefined,
    `Name: ${form.name}`,
    `Phone: ${form.phone}`,
  ].filter(Boolean);

  return encodeURIComponent(lines.join("\n"));
}

function classNames(...a: (string | boolean | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

/** ----------------------------
 * UI atoms
 * ---------------------------- */
function Chip({
  selected,
  children,
  onClick,
}: {
  selected?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "rounded-full border px-3 py-1 text-xs transition",
        selected
          ? "border-coast bg-coast/10 text-coast"
          : "border-ink/15 bg-white text-ink/80 hover:bg-sand"
      )}
    >
      {children}
    </button>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={classNames(
        "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition",
        checked ? "border-coast bg-coast/10 text-coast" : "border-ink/15 bg-white text-ink/80 hover:bg-sand"
      )}
      aria-pressed={checked}
    >
      <Check className={classNames("h-4 w-4", checked ? "opacity-100" : "opacity-0")} />
      {label}
    </button>
  );
}

/** ----------------------------
 * Main component
 * ---------------------------- */
export function QuoteForm() {
  const [step, setStep] = useState<Step>(1);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<FormState>({
    pickup: "",
    drops: [""],
    items: "",
    weight: "",
    helper: false,
    notes: "",
    date: "",
    timeWindow: "ASAP",
    name: "",
    phone: "",
    photos: [],
  });

  const validated = useMemo(() => {
    const errs: Record<string, string> = {};
    if (!form.pickup.trim()) errs.pickup = "Pickup location is required.";
    if (!form.drops.some((d) => d.trim())) errs.drop = "At least one drop location is required.";
    if (!form.items.trim()) errs.items = "What are we moving?";
    if (!form.name.trim()) errs.name = "Your name is required.";
    const phone = normalizeKenyaPhone(form.phone);
    if (!phone.ok) errs.phone = "Enter a valid Kenyan mobile number.";
    return errs;
  }, [form]);

  const canSubmit = Object.keys(validated).length === 0;

  const summary = useMemo(() => {
    const phone = normalizeKenyaPhone(form.phone);
    return {
      pickup: form.pickup || "—",
      drops: form.drops.filter(Boolean),
      items: form.items || "—",
      helper: form.helper ? "Yes" : "No",
      when: [form.date, form.timeWindow].filter(Boolean).join(" "),
      name: form.name || "—",
      phone: phone.ok ? phone.display : form.phone || "—",
      photos: form.photos,
    };
  }, [form]);

  function addDrop() {
    setForm((s) => ({ ...s, drops: [...s.drops, ""] }));
  }
  function removeDrop(i: number) {
    setForm((s) => {
      const next = [...s.drops];
      next.splice(i, 1);
      return { ...s, drops: next.length ? next : [""] };
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors(validated);
    if (!canSubmit) return;

    setSending(true);
    try {
      const phone = normalizeKenyaPhone(form.phone);
      const waBase = "https://wa.me/";
      const waTo = ((phone.ok ? phone.e164 : "+2547XXXXXXXX") ?? "+2547XXXXXXXX").replace("+", "");
      const msg = buildWhatsAppMessage(form);

      // attempt: open WhatsApp in a new tab
      const href = `${waBase}${waTo}?text=${msg}`;
      window.open(href, "_blank", "noopener,noreferrer");

      // optional: Meta Pixel event
      // @ts-ignore
      window.fbq?.("trackCustom", "LeadFormWhatsAppClick");
    } finally {
      setSending(false);
    }
  }

  // Photo previews (local only)
  function onFilesChange(files: FileList | null) {
    if (!files) return;
    const list = Array.from(files).slice(0, 4); // cap to 4
    setForm((s) => ({ ...s, photos: list }));
  }

  return (
    <section id="quote" className="bg-white py-12 md:py-16">
      <Container>
        {/* Header */}
        <div className="mb-6 flex flex-col items-start justify-between gap-2 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">Get a Quick Quote</h2>
            <p className="mt-1 text-ink/70">
              Share where we’re picking up from and where we’re headed. We’ll confirm availability and reply on WhatsApp in 3–5 minutes.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-ink/60">
            <span className={classNames("rounded-full px-2 py-1", step === 1 && "bg-sand")}>1. Locations</span>
            <span className={classNames("rounded-full px-2 py-1", step === 2 && "bg-sand")}>2. Details</span>
            <span className={classNames("rounded-full px-2 py-1", step === 3 && "bg-sand")}>3. Schedule & Contact</span>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          {/* FORM CARD */}
          <form onSubmit={onSubmit} className="rounded-lg border border-ink/10 bg-sand p-5 shadow-soft">
            {/* Step 1: Locations */}
            {step === 1 && (
              <div className="grid gap-4">
                <label className="block">
                  <span className="mb-1 flex items-center gap-2 text-sm font-medium text-ink">
                    <MapPin className="h-4 w-4" /> Pickup location (pin/estate/road)
                  </span>
                  <input
                    className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast"
                    placeholder="e.g., Kengeleni, Nyali — shared pin"
                    value={form.pickup}
                    onChange={(e) => setForm((s) => ({ ...s, pickup: e.target.value }))}
                  />
                  {errors.pickup && <span className="mt-1 block text-xs text-coral">{errors.pickup}</span>}
                </label>

                <div className="grid gap-3">
                  <span className="text-sm font-medium text-ink">Drop location(s)</span>
                  {form.drops.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast"
                        placeholder={i === 0 ? "e.g., City Mall, Nyali — loading bay" : "Additional stop"}
                        value={d}
                        onChange={(e) =>
                          setForm((s) => {
                            const next = [...s.drops];
                            next[i] = e.target.value;
                            return { ...s, drops: next };
                          })
                        }
                      />
                      {form.drops.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDrop(i)}
                          className="rounded-md border border-ink/15 bg-white p-2 text-ink/70 hover:bg-white"
                          aria-label="Remove stop"
                          title="Remove stop"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addDrop}
                    className="inline-flex items-center gap-2 text-sm text-coast hover:underline"
                  >
                    <Plus className="h-4 w-4" /> Add another stop
                  </button>
                  {errors.drop && <span className="mt-1 block text-xs text-coral">{errors.drop}</span>}
                </div>

                <div className="flex items-center justify-between">
                  <div />
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 rounded-md bg-coast px-4 py-2 text-sm font-medium text-white"
                  >
                    Continue <Arrow />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="grid gap-4">
                <label className="block">
                  <span className="mb-1 flex items-center gap-2 text-sm font-medium text-ink">
                    <Package className="h-4 w-4" /> What are we moving?
                  </span>
                  <input
                    className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast"
                    placeholder="e.g., 3-seater sofa & fridge / 30 boxes / 15 bags of cement"
                    value={form.items}
                    onChange={(e) => setForm((s) => ({ ...s, items: e.target.value }))}
                  />
                  {errors.items && <span className="mt-1 block text-xs text-coral">{errors.items}</span>}
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-ink">Estimated weight (kg)</span>
                    <input
                      className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast"
                      placeholder="optional"
                      value={form.weight}
                      onChange={(e) => setForm((s) => ({ ...s, weight: e.target.value }))}
                    />
                  </label>
                  <div className="block">
                    <span className="mb-1 block text-sm font-medium text-ink">Extras</span>
                    <Toggle
                      checked={form.helper}
                      onChange={(v) => setForm((s) => ({ ...s, helper: v }))}
                      label="I’ll need a helper"
                    />
                  </div>
                </div>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-ink">Notes (stairs, fragile, gate pass, etc.)</span>
                  <textarea
                    rows={3}
                    className="w-full resize-none rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast"
                    placeholder="Any details we should know before dispatch?"
                    value={form.notes}
                    onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
                  />
                </label>

                {/* Photo upload */}
                <div className="grid gap-2">
                  <span className="text-sm font-medium text-ink">Optional photos (up to 4)</span>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink/80 hover:bg-sand"
                    >
                      <Upload className="h-4 w-4" /> Add photos
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => onFilesChange(e.currentTarget.files)}
                    />
                    {form.photos.length > 0 && (
                      <span className="text-xs text-ink/60">{form.photos.length} selected</span>
                    )}
                  </div>

                  {form.photos.length > 0 && (
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {form.photos.map((f, i) => {
                        const url = URL.createObjectURL(f);
                        return (
                          <div key={i} className="relative aspect-square overflow-hidden rounded-md border border-ink/10 bg-white">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`upload ${i + 1}`} className="h-full w-full object-cover" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-md border border-ink/15 bg-white px-4 py-2 text-sm text-ink/80"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-2 rounded-md bg-coast px-4 py-2 text-sm font-medium text-white"
                  >
                    Continue <Arrow />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Schedule & Contact */}
            {step === 3 && (
              <div className="grid gap-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 flex items-center gap-2 text-sm font-medium text-ink">
                      <CalendarDays className="h-4 w-4" /> Date
                    </span>
                    <input
                      type="date"
                      className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast"
                      value={form.date}
                      onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
                    />
                  </label>
                  <div className="block">
                    <span className="mb-1 block text-sm font-medium text-ink">Preferred time</span>
                    <div className="flex flex-wrap gap-2">
                      {TIME_WINDOWS.map((t) => (
                        <Chip
                          key={t}
                          selected={form.timeWindow === t}
                          onClick={() => setForm((s) => ({ ...s, timeWindow: t }))}
                        >
                          {t}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 flex items-center gap-2 text-sm font-medium text-ink">
                      <User className="h-4 w-4" /> Your name
                    </span>
                    <input
                      className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast"
                      placeholder="Full name"
                      value={form.name}
                      onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                    />
                    {errors.name && <span className="mt-1 block text-xs text-coral">{errors.name}</span>}
                  </label>

                  <label className="block">
                    <span className="mb-1 flex items-center gap-2 text-sm font-medium text-ink">
                      <Phone className="h-4 w-4" /> Mobile (Kenya)
                    </span>
                    <input
                      className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast"
                      placeholder="07XXXXXXXX"
                      value={form.phone}
                      onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                    />
                    {errors.phone && <span className="mt-1 block text-xs text-coral">{errors.phone}</span>}
                  </label>
                </div>

                <div className="flex flex-col-reverse items-center justify-between gap-3 md:flex-row">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full rounded-md border border-ink/15 bg-white px-4 py-2 text-sm text-ink/80 md:w-auto"
                  >
                    Back
                  </button>

                  <div className="flex w-full flex-col items-stretch gap-2 md:w-auto md:flex-row">
                    <Button
                      as="button"
                      className={classNames(
                        "inline-flex items-center justify-center",
                        !canSubmit && "opacity-60"
                      )}
                    >
                      {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <WhatsAppIcon />}
                      <span className="ml-2">Send via WhatsApp</span>
                    </Button>

                    {/* Secondary action: callback for people who don’t use WA */}
                    <a
                      href={`tel:+2547XXXXXXXX`}
                      className="inline-flex items-center justify-center rounded-md border border-ink/15 bg-white px-4 py-2 text-sm text-ink/80 hover:bg-sand"
                    >
                      <Phone className="mr-2 h-4 w-4" /> Request a callback
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Hidden submit (triggered by primary Button) */}
            <input type="submit" hidden onClick={onSubmit} />
          </form>

          {/* SUMMARY CARD */}
          <aside className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
            <h3 className="font-display text-sm font-semibold text-ink">Quote summary</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="grid grid-cols-[96px_1fr] gap-2">
                <dt className="text-ink/60">Pickup</dt>
                <dd className="text-ink">{summary.pickup}</dd>
              </div>
              <div className="grid grid-cols-[96px_1fr] gap-2">
                <dt className="text-ink/60">Drop(s)</dt>
                <dd className="text-ink">
                  {summary.drops.length ? summary.drops.join(" → ") : "—"}
                </dd>
              </div>
              <div className="grid grid-cols-[96px_1fr] gap-2">
                <dt className="text-ink/60">Items</dt>
                <dd className="text-ink">{summary.items}</dd>
              </div>
              <div className="grid grid-cols-[96px_1fr] gap-2">
                <dt className="text-ink/60">Helper</dt>
                <dd className="text-ink">{summary.helper}</dd>
              </div>
              <div className="grid grid-cols-[96px_1fr] gap-2">
                <dt className="text-ink/60">When</dt>
                <dd className="text-ink">{summary.when || "—"}</dd>
              </div>
              <div className="grid grid-cols-[96px_1fr] gap-2">
                <dt className="text-ink/60">Contact</dt>
                <dd className="text-ink">
                  {summary.name} · {summary.phone}
                </dd>
              </div>
              {summary.photos.length > 0 && (
                <div className="grid grid-cols-[96px_1fr] gap-2">
                  <dt className="text-ink/60">Photos</dt>
                  <dd className="text-ink">{summary.photos.length} attached</dd>
                </div>
              )}
            </dl>
            <p className="mt-4 text-xs text-ink/60">
              You’ll receive a fixed quote on WhatsApp. We’ll confirm availability and share updates during delivery.
            </p>
          </aside>
        </div>
      </Container>
    </section>
  );
}

/** Tiny arrow icon for CTAs (keeps bundle slim) */
function Arrow() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
      <path fill="currentColor" d="M12.293 4.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 11-1.414-1.414L14.586 10H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"/>
    </svg>
  );
}

/** WhatsApp glyph (no external icons) */
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-4 w-4" aria-hidden="true">
      <path fill="currentColor" d="M19.1 17.2c-.3-.1-1-.5-1.1-.5s-.2-.1-.3.1-.4.5-.5.6c-.1.2-.2.2-.4.1-1.1-.5-2-1.1-2.8-2-.2-.2-.5-.6-.6-.9-.1-.2 0-.3.1-.4l.4-.5c.1-.1.1-.2.1-.3s-.1-.2-.1-.3c0-.1-.3-.8-.4-1.1-.1-.3-.2-.3-.4-.3h-.3c-.1 0-.3 0-.4.2-.5.5-.8 1.1-.8 1.8 0 .2 0 .5.1.7.3 1 .9 1.8 1.7 2.6.8.7 1.8 1.3 2.8 1.6.3.1.6.1.9.1.6 0 1.1-.2 1.5-.6.2-.2.3-.4.4-.7.1-.2.1-.4 0-.5-.1-.2-.2-.2-.3-.3zM16 28c-2.1 0-4.1-.6-5.8-1.8L6 27l.8-4.1C5.6 21 5 19 5 17c0-6.1 4.9-11 11-11s11 4.9 11 11-4.9 11-11 11zm0-20C10.5 8 6 12.5 6 18c0 1.9.5 3.7 1.5 5.3l-.9 4.7 4.8-1.3c1.5.8 3.1 1.2 4.6 1.2 5.5 0 10-4.5 10-10S21.5 8 16 8z"/>
    </svg>
  );
}
