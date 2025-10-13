import { Container } from "./Container";
import { Building2, FileText, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function B2BStrip() {
  return (
    <section className="border-y border-ink/10 bg-white">
      <Container className="flex flex-col items-start justify-between gap-3 py-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-coast/10 text-coast">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-ink">Business deliveries?</div>
            <p className="text-xs text-ink/70">
              Retainers • Multi-drop • eTIMS invoices • POD photos • Optional GIT
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/b2b"
            className="inline-flex items-center gap-2 rounded-md bg-coral px-3 py-2 text-sm font-medium text-white shadow-soft hover:opacity-95"
          >
            <FileText className="h-4 w-4" /> Request a trade quote
          </Link>
          <Link
            href="/b2b#sla"
            className="inline-flex items-center gap-2 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink/80 hover:bg-sand"
          >
            <ShieldCheck className="h-4 w-4" /> See SLA & coverage
          </Link>
        </div>
      </Container>
    </section>
  );
}
