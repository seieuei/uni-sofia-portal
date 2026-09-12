"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";
import { isStaff } from "@/lib/persona";

type Sub = {
  ticketId: string;
  status: string;
  role: string;
  facultyCode: string;
  submitterName: string;
  submitterEmail: string;
  createdAt: string;
  dataJson: string;
  form: { titleBg: string; titleEn: string; slug: string };
  office: { nameBg: string; nameEn: string; emailSim: string };
};

export default function InboxPage() {
  const { lang, persona, ready } = useApp();
  const [items, setItems] = useState<Sub[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!persona || !isStaff(persona.role)) return;
    fetch("/api/submissions")
      .then((r) => r.json())
      .then((d) => setItems(d.submissions || []));
  }, [persona]);

  if (!ready) return <div className="mx-auto max-w-6xl px-4 py-12">…</div>;

  if (!persona || !isStaff(persona.role)) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-ink/70">{t("inboxStaffOnly", lang)}</p>
        <Link href="/onboarding" className="btn-primary mt-6 inline-flex">
          {t("changePersona", lang)}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">{t("inboxTitle", lang)}</h1>
      <p className="mt-2 text-sm text-ink/55">
        {lang === "bg"
          ? "Симулирани подавания. Без истински имейли."
          : "Simulated submissions. No real emails."}
      </p>

      {items.length === 0 ? (
        <p className="paper-card mt-8 p-8 text-center text-ink/60">{t("inboxEmpty", lang)}</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {items.map((s) => {
            const expanded = open === s.ticketId;
            let data: Record<string, string> = {};
            try {
              data = JSON.parse(s.dataJson);
            } catch {
              /* ignore */
            }
            const statusKey = `status_${s.status}` as "status_received";
            return (
              <li key={s.ticketId} className="paper-card overflow-hidden">
                <button
                  type="button"
                  className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left hover:bg-cream/50"
                  onClick={() => setOpen(expanded ? null : s.ticketId)}
                >
                  <div>
                    <div className="font-mono text-sm font-bold text-burgundy">{s.ticketId}</div>
                    <div className="font-medium">{lang === "bg" ? s.form.titleBg : s.form.titleEn}</div>
                    <div className="text-xs text-ink/50">
                      {s.submitterName} · {s.facultyCode} · {s.role}
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="rounded-full bg-sage/10 px-2 py-1 font-medium text-sage">
                      {t(statusKey, lang)}
                    </span>
                    <div className="mt-1 text-ink/45">{new Date(s.createdAt).toLocaleString(lang === "bg" ? "bg-BG" : "en-GB")}</div>
                  </div>
                </button>
                {expanded && (
                  <div className="border-t border-ink/10 bg-cream/40 px-5 py-4 text-sm">
                    <p>
                      <strong>{t("routedTo", lang)}:</strong> {lang === "bg" ? s.office.nameBg : s.office.nameEn}{" "}
                      <span className="text-ink/45">({s.office.emailSim})</span>
                    </p>
                    <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                      {Object.entries(data).map(([k, v]) => (
                        <div key={k} className="rounded-lg bg-white px-3 py-2">
                          <dt className="text-[10px] uppercase tracking-wide text-ink/40">{k}</dt>
                          <dd className="whitespace-pre-wrap">{String(v)}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
