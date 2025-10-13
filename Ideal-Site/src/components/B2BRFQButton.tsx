"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, Check, FileUp, X, Mail, MessageCircle } from "lucide-react";

const PHONE_E164 = "+2547XXXXXXXX";     // your WhatsApp
const RFQ_EMAIL  = "ops@idealcargo.co.ke"; // change to your ops email

type Form = {
  company: string;
  contact: string;
  phone: string;
  email: string;
  businessType: string;   // hardware, retail, ecommerce, CFS, etc.
  weeklyJobs: string;     // 3-5, 6-10, 10+
  lanes: string;          // e.g., Changamwe -> Nyali, CFS -> CBD
  payloads: string;       // sofas, appliances, hardware, loose cargo
  needs: string[];        // ["POD photos","eTIMS invoices","GIT cover","Multi-drop"]
  notes: string;
  file?: File | null;     // optional LPO/spec attachment (local only preview)
};

const NEEDS = ["POD photos", "eTIMS invoices", "GIT cover", "Multi-drop"];

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
    "(via Ideal Cargo Services • B2B Modal)"
  ].filter(Boolean).join("\n");
  return encodeURIComponent(lines);
}

function mailtoBody(f: Form) {
  const plain = decodeURIComponent(buildWhatsApp(f));
  return encodeURIComponent(plain);
}

export function B2BRFQButton({
  label = "Request trade quote",
  className = "",
}: { label?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>({
    company: "", contact: "", phone: "", email: "",
    businessType: "", weeklyJobs: "3–5", lanes: "", payloads: "",
    needs: [], notes: "", file: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const firstRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { if (open) setTimeout(() => firstRef.current?.focus(), 0); }, [open]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  function toggleNeed(n: string) {
    setForm(s => ({ ...s, needs: s.needs.includes(n) ? s.needs.filter(x => x !== n) : [...s.needs, n] }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.company.trim()) e.company = "Company is required.";
    if (!form.contact.trim()) e.contact = "Contact name required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email required.";
    if (!form.phone.trim()) e.phone = "Phone required.";
    return e;
  }

  function submitWhatsApp() {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return;
    const msg = buildWhatsApp(form);
    const href = `https://wa.me/${PHONE_E164.replace("+","")}?text=${msg}`;
    window.open(href, "_blank", "noopener,noreferrer");
  }

  function submitEmail() {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return;
    const subject = encodeURIComponent(`Trade RFQ – ${form.company}`);
    const body = mailtoBody(form);
    window.location.href = `mailto:${RFQ_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={["inline-flex items-center gap-2 rounded-md bg-coral px-3 py-2 text-sm font-medium text-white shadow-soft hover:opacity-95", className].join(" ")}
      >
        <Building2 className="h-4 w-4" /> {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-2xl rounded-lg bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold text-ink">Request a trade quote</div>
                <p className="mt-1 text-xs text-ink/70">Tell us about your operations. We’ll reply with rates, SLA, and next-step onboarding.</p>
              </div>
              <button className="rounded-md p-1 text-ink/60 hover:bg-sand" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {/* Left column */}
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-ink">Company</span>
                <input ref={firstRef} className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast" value={form.company} onChange={e=>setForm(s=>({...s, company:e.target.value}))}/>
                {errors.company && <span className="mt-1 block text-xs text-coral">{errors.company}</span>}
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-ink">Contact person</span>
                <input className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast" value={form.contact} onChange={e=>setForm(s=>({...s, contact:e.target.value}))}/>
                {errors.contact && <span className="mt-1 block text-xs text-coral">{errors.contact}</span>}
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-ink">Email</span>
                <input type="email" className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast" value={form.email} onChange={e=>setForm(s=>({...s, email:e.target.value}))}/>
                {errors.email && <span className="mt-1 block text-xs text-coral">{errors.email}</span>}
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-ink">Phone</span>
                <input className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast" value={form.phone} onChange={e=>setForm(s=>({...s, phone:e.target.value}))}/>
                {errors.phone && <span className="mt-1 block text-xs text-coral">{errors.phone}</span>}
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-ink">Business type</span>
                <input placeholder="Hardware / Retail / E-commerce / CFS / Manufacturer" className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast" value={form.businessType} onChange={e=>setForm(s=>({...s, businessType:e.target.value}))}/>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-ink">Weekly jobs</span>
                <select className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast" value={form.weeklyJobs} onChange={e=>setForm(s=>({...s, weeklyJobs:e.target.value}))}>
                  <option>3–5</option><option>6–10</option><option>11–20</option><option>20+</option>
                </select>
              </label>

              <label className="md:col-span-2 block">
                <span className="mb-1 block text-sm font-medium text-ink">Typical lanes</span>
                <input placeholder="e.g., Changamwe → Nyali; CFS → CBD multi-drop" className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast" value={form.lanes} onChange={e=>setForm(s=>({...s, lanes:e.target.value}))}/>
              </label>

              <label className="md:col-span-2 block">
                <span className="mb-1 block text-sm font-medium text-ink">Typical payloads</span>
                <input placeholder="Appliances, sofas, tiles, cement, loose cargo…" className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast" value={form.payloads} onChange={e=>setForm(s=>({...s, payloads:e.target.value}))}/>
              </label>

              <div className="md:col-span-2">
                <span className="mb-1 block text-sm font-medium text-ink">Operational needs</span>
                <div className="flex flex-wrap gap-2">
                  {NEEDS.map(n => (
                    <button
                      type="button"
                      key={n}
                      onClick={()=>toggleNeed(n)}
                      className={["inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition",
                        form.needs.includes(n) ? "border-coast bg-coast/10 text-coast" : "border-ink/15 bg-white text-ink/80 hover:bg-sand"
                      ].join(" ")}
                    >
                      <Check className={form.needs.includes(n) ? "h-4 w-4" : "h-4 w-4 opacity-0"} /> {n}
                    </button>
                  ))}
                </div>
              </div>

              <label className="md:col-span-2 block">
                <span className="mb-1 block text-sm font-medium text-ink">Notes</span>
                <textarea rows={3} className="w-full resize-none rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-coast" placeholder="Gate passes, CFS access, time windows, LPO process, etc." value={form.notes} onChange={e=>setForm(s=>({...s, notes:e.target.value}))}/>
              </label>

              {/* Optional file (local only preview) */}
              <div className="md:col-span-2 flex items-center gap-2">
                <label className="inline-flex items-center gap-2 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink/80 hover:bg-sand cursor-pointer">
                  <FileUp className="h-4 w-4" /> Attach LPO/spec (optional)
                  <input type="file" className="hidden" onChange={e=>setForm(s=>({...s, file: e.target.files?.[0] || null}))}/>
                </label>
                {form.file && <span className="text-xs text-ink/60">{form.file.name}</span>}
              </div>
            </div>

            <div className="mt-4 flex flex-col-reverse items-center gap-2 sm:flex-row sm:justify-end">
              <button className="w-full rounded-md border border-ink/15 bg-white px-4 py-2 text-sm text-ink/80 hover:bg-sand sm:w-auto" onClick={()=>setOpen(false)}>Cancel</button>
              <button onClick={submitEmail} className="w-full rounded-md border border-ink/15 bg-white px-4 py-2 text-sm text-ink/80 hover:bg-sand sm:w-auto">
                <Mail className="mr-2 inline h-4 w-4" /> Email RFQ
              </button>
              <button onClick={submitWhatsApp} className="w-full rounded-md bg-coral px-5 py-2 text-sm font-medium text-white shadow-soft hover:opacity-95 sm:w-auto">
                <MessageCircle className="mr-2 inline h-4 w-4" /> WhatsApp RFQ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
