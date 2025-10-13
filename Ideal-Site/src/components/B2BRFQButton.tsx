"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Building2,
  Check,
  FileUp,
  Mail,
  MessageCircle,
  ShieldCheck,
  X,
} from "lucide-react";

/**
 * Mobile UX goals:
 * - Bottom sheet on mobile (h-[92dvh]) with internal scrolling
 * - Centered dialog on desktop
 * - Sticky action bar
 * - Large, clear inputs and toggles
 * - Escape/overlay-close; focus initial field
 * - Autoscroll to first error
 */

const PHONE_E164 = "+2547XXXXXXXX";         // your WhatsApp
const RFQ_EMAIL  = "bravored21@gmail.com";  // your ops email

type Form = {
  company: string;
  contact: string;
  phone: string;
  email: string;
  businessType: string;  // Hardware / Retail / E-commerce / CFS / Manufacturer
  weeklyJobs: string;    // 3–5 / 6–10 / 11–20 / 20+
  lanes: string;         // e.g., Changamwe → Nyali; CFS → CBD multi-drop
  payloads: string;      // sofas, appliances, hardware, loose cargo
  needs: string[];       // ["POD photos","eTIMS invoices","GIT cover","Multi-drop"]
  notes: string;
  file?: File | null;
};

const NEEDS = ["POD photos", "eTIMS invoices", "GIT cover", "Multi-drop"];
const JOB_BUCKETS = ["3–5", "6–10", "11–20", "20+"];

function buildWhatsApp(f: Form) {
  const lines = [
    "Trade RFQ (B2B)",
    `Company: ${f.company}`,
    `Contact: ${f.contact}`,
    `Phone: ${f.phone}`,
    `Email: ${f.email}`,
    `Business: ${f.businessType}`,
    `Weekly jobs: ${f.weeklyJobs}`,
    `Lanes: ${f.lanes}`,
    `Typical payloads: ${f.payloads}`,
    `Needs: ${f.needs.join(", ") || "-"}`,
    f.notes ? `Notes: ${f.notes}` : undefined,
    "",
    "(via Ideal Cargo Services • B2B Modal)",
  ]
    .filter(Boolean)
    .join("\n");
  return encodeURIComponent(lines);
}

function mailtoBody(f: Form) {
  const plain = decodeURIComponent(buildWhatsApp(f));
  return encodeURIComponent(plain);
}

export function B2BRFQButton({
  label = "Request trade quote",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>({
    company: "",
    contact: "",
    phone: "",
    email: "",
    businessType: "",
    weeklyJobs: JOB_BUCKETS[0],
    lanes: "",
    payloads: "",
    needs: [],
    notes: "",
    file: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const firstRef = useRef<HTMLInputElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Focus first field when opening
  useEffect(() => {
    if (open) setTimeout(() => firstRef.current?.focus(), 0);
  }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function toggleNeed(n: string) {
    setForm((s) => ({
      ...s,
      needs: s.needs.includes(n) ? s.needs.filter((x) => x !== n) : [...s.needs, n],
    }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.company.trim()) e.company = "Company is required";
    if (!form.contact.trim()) e.contact = "Contact name required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Phone required";
    return e;
  }

  function scrollToFirstError(e: Record<string, string>) {
    const firstKey = Object.keys(e)[0];
    if (!firstKey) return;
    const el = sheetRef.current?.querySelector(`[data-field="${firstKey}"]`);
    if (el && "scrollIntoView" in el) {
      (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function submitWhatsApp() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return scrollToFirstError(e);
    const msg = buildWhatsApp(form);
    const href = `https://wa.me/${PHONE_E164.replace("+", "")}?text=${msg}`;
    // @ts-ignore optional pixel
    window.fbq?.("trackCustom", "B2BRFQSubmit", { channel: "whatsapp" });
    window.open(href, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  function submitEmail() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return scrollToFirstError(e);
    const subject = encodeURIComponent(`Trade RFQ – ${form.company}`);
    const body = mailtoBody(form);
    // @ts-ignore optional pixel
    window.fbq?.("trackCustom", "B2BRFQSubmit", { channel: "email" });
    window.location.href = `mailto:${RFQ_EMAIL}?subject=${subject}&body=${body}`;
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={[
          "inline-flex items-center gap-2 rounded-md bg-coral px-3 py-2 text-sm font-medium text-white shadow-soft hover:opacity-95",
          className,
        ].join(" ")}
      >
        <Building2 className="h-4 w-4" />
        {label}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/30"
          role="dialog"
          aria-modal="true"
          aria-label="Request a trade quote"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          {/* Sheet / Dialog container */}
          <div
            ref={sheetRef}
            className={[
              // mobile: bottom sheet
              "md:hidden",
              "fixed inset-x-0 bottom-0 z-[60] rounded-t-2xl border-t border-ink/10 bg-white shadow-soft",
              "h-[92dvh] overflow-y-auto",
            ].join(" ")}
          >
            <HeaderBar onClose={() => setOpen(false)} />
            <FormContent
              form={form}
              setForm={setForm}
              errors={errors}
              firstRef={firstRef as React.RefObject<HTMLInputElement>}
              onFile={(file) => setForm((s) => ({ ...s, file }))}
            />
            <ActionBar
              onEmail={submitEmail}
              onWhatsApp={submitWhatsApp}
              fileName={form.file?.name}
              mobile
            />
          </div>

          {/* Desktop: centered dialog */}
          <div className="hidden md:flex md:h-full md:items-center md:justify-center">
            <div
              className="z-[60] w-full max-w-2xl overflow-hidden rounded-xl border border-ink/10 bg-white shadow-soft"
              role="document"
            >
              <HeaderBar onClose={() => setOpen(false)} />
              <div className="max-h-[72vh] overflow-y-auto">
                <FormContent
                  form={form}
                  setForm={setForm}
                  errors={errors}
                  firstRef={firstRef as React.RefObject<HTMLInputElement>}
                  onFile={(file) => setForm((s) => ({ ...s, file }))}
                />
              </div>
              <ActionBar
                onEmail={submitEmail}
                onWhatsApp={submitWhatsApp}
                fileName={form.file?.name}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- Subcomponents ---------- */

function HeaderBar({ onClose }: { onClose: () => void }) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-coast/10 text-coast">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-semibold text-ink">Request a trade quote</div>
          <div className="text-[11px] text-ink/60">
            SLA • eTIMS • POD photos • Optional GIT cover
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        aria-label="Close"
        className="rounded-md p-1 text-ink/60 hover:bg-sand"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

function FormContent({
  form,
  setForm,
  errors,
  firstRef,
  onFile,
}: {
  form: Form;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
  errors: Record<string, string>;
  firstRef: React.RefObject<HTMLInputElement>;
  onFile: (f: File | null) => void;
}) {
  return (
    <div className="px-4 pb-28 pt-4 md:pb-6">
      {/* Company & Contact */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field
          label="Company"
          dataField="company"
          error={errors.company}
          input={
            <input
              ref={firstRef}
              className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast"
              value={form.company}
              onChange={(e) => setForm((s) => ({ ...s, company: e.target.value }))}
              placeholder="Legal or trading name"
            />
          }
        />
        <Field
          label="Contact person"
          dataField="contact"
          error={errors.contact}
          input={
            <input
              className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast"
              value={form.contact}
              onChange={(e) => setForm((s) => ({ ...s, contact: e.target.value }))}
              placeholder="Name"
            />
          }
        />
        <Field
          label="Email"
          dataField="email"
          error={errors.email}
          input={
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              placeholder="name@company.ke"
            />
          }
        />
        <Field
          label="Phone"
          dataField="phone"
          error={errors.phone}
          input={
            <input
              inputMode="tel"
              autoComplete="tel"
              className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast"
              value={form.phone}
              onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
              placeholder="07XXXXXXXX / +2547XXXXXXXX"
            />
          }
        />
      </div>

      {/* Business profile */}
      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field
          label="Business type"
          dataField="businessType"
          hint="Hardware / Retail / E-commerce / CFS / Manufacturer"
          input={
            <input
              className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast"
              value={form.businessType}
              onChange={(e) => setForm((s) => ({ ...s, businessType: e.target.value }))}
              placeholder="E-commerce retailer"
            />
          }
        />
        <RadioPillGroup
          label="Weekly jobs"
          options={JOB_BUCKETS}
          value={form.weeklyJobs}
          onChange={(v) => setForm((s) => ({ ...s, weeklyJobs: v }))}
        />
      </div>

      {/* Ops details */}
      <div className="mt-5 grid grid-cols-1 gap-3">
        <Field
          label="Typical lanes"
          dataField="lanes"
          hint="e.g., Changamwe → Nyali; CFS → CBD multi-drop"
          input={
            <input
              className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast"
              value={form.lanes}
              onChange={(e) => setForm((s) => ({ ...s, lanes: e.target.value }))}
              placeholder="Changamwe → Nyali; CFS → CBD"
            />
          }
        />
        <Field
          label="Typical payloads"
          dataField="payloads"
          hint="Appliances, sofas, tiles, cement, loose cargo…"
          input={
            <input
              className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast"
              value={form.payloads}
              onChange={(e) => setForm((s) => ({ ...s, payloads: e.target.value }))}
              placeholder="Appliances, hardware, furniture"
            />
          }
        />

        <CheckboxPillGroup
          label="Operational needs"
          options={NEEDS}
          value={form.needs}
          onToggle={(n) =>
            setForm((s) => ({
              ...s,
              needs: s.needs.includes(n)
                ? s.needs.filter((x) => x !== n)
                : [...s.needs, n],
            }))
          }
        />

        <Field
          label="Notes"
          dataField="notes"
          input={
            <textarea
              rows={3}
              className="w-full resize-none rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast"
              value={form.notes}
              onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
              placeholder="Gate passes, site induction, time windows, LPO process…"
            />
          }
        />

        {/* Optional file */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink/80 hover:bg-sand">
            <FileUp className="h-4 w-4" />
            Attach LPO/spec (optional)
            <input
              type="file"
              className="hidden"
              onChange={(e) => onFile(e.currentTarget.files?.[0] || null)}
            />
          </label>
          {form.file && (
            <span className="text-xs text-ink/60 truncate">{form.file.name}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionBar({
  onWhatsApp,
  onEmail,
  fileName,
  mobile = false,
}: {
  onWhatsApp: () => void;
  onEmail: () => void;
  fileName?: string;
  mobile?: boolean;
}) {
  return (
    <div
      className={[
        "sticky bottom-0 z-10 border-t border-ink/10 bg-white",
        mobile ? "px-4 pb-[env(safe-area-inset-bottom)]" : "px-4",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-2xl flex-col items-stretch gap-2 py-3 sm:flex-row sm:justify-end">
        <button
          onClick={onEmail}
          className="inline-flex items-center justify-center rounded-md border border-ink/15 bg-white px-4 py-2 text-sm text-ink/80 hover:bg-sand"
        >
          <Mail className="mr-2 h-4 w-4" /> Email RFQ
        </button>
        <button
          onClick={onWhatsApp}
          className="inline-flex items-center justify-center rounded-md bg-coral px-5 py-2 text-sm font-medium text-white shadow-soft hover:opacity-95"
        >
          <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp RFQ
        </button>
      </div>
      {fileName && (
        <div className="pb-3 text-center text-[11px] text-ink/60">
          Attached: {fileName}
        </div>
      )}
    </div>
  );
}

/* ---------- UI helpers ---------- */

function Field({
  label,
  input,
  hint,
  error,
  dataField,
}: {
  label: string;
  input: React.ReactNode;
  hint?: string;
  error?: string;
  dataField: string;
}) {
  return (
    <label className="block" data-field={dataField}>
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      {input}
      {hint && <span className="mt-1 block text-[11px] text-ink/60">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-coral">{error}</span>}
    </label>
  );
}

function RadioPillGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={[
              "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs transition",
              value === opt
                ? "border-coast bg-coast/10 text-coast"
                : "border-ink/15 bg-white text-ink/80 hover:bg-sand",
            ].join(" ")}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function CheckboxPillGroup({
  label,
  options,
  value,
  onToggle,
}: {
  label: string;
  options: string[];
  value: string[];
  onToggle: (opt: string) => void;
}) {
  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={[
                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition",
                active
                  ? "border-coast bg-coast/10 text-coast"
                  : "border-ink/15 bg-white text-ink/80 hover:bg-sand",
              ].join(" ")}
              aria-pressed={active}
            >
              <Check className={active ? "h-4 w-4" : "h-4 w-4 opacity-0"} />
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
