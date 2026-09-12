"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { statusLabel, t } from "@/lib/i18n";

type CaseRow = {
  id: string;
  number: string;
  title: string;
  status: string;
  updatedAt: string;
  process: { titleBg: string; titleEn: string; slug: string };
  owner: { name: string };
};

export default function CasesPage() {
  const { lang, user, ready } = useApp();
  const router = useRouter();
  const [cases, setCases] = useState<CaseRow[]>([]);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    fetch("/api/cases")
      .then((r) => r.json())
      .then((d) => setCases(d.cases || []));
  }, [ready, user, router]);

  if (!ready || !user) return <div className="mx-auto max-w-6xl px-4 py-12">…</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">{t("casesTitle", lang)}</h1>
        <Link href="/cases/new" className="btn-primary text-sm">
          {t("navNewCase", lang)}
        </Link>
      </div>
      <ul className="mt-8 space-y-3">
        {cases.map((c) => (
          <li key={c.id}>
            <Link
              href={`/cases/${c.id}`}
              className="paper-card flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-cream/40"
            >
              <div>
                <div className="font-mono text-sm font-bold text-burgundy">{c.number}</div>
                <div className="font-medium">{c.title}</div>
                <div className="text-xs text-ink/50">
                  {lang === "bg" ? c.process.titleBg : c.process.titleEn} · {c.owner.name}
                </div>
              </div>
              <div className="text-right text-xs">
                <span className="rounded-full bg-sage/10 px-2 py-1 font-medium text-sage">
                  {statusLabel(c.status, lang)}
                </span>
                <div className="mt-1 text-ink/45">
                  {new Date(c.updatedAt).toLocaleString(lang === "bg" ? "bg-BG" : "en-GB")}
                </div>
              </div>
            </Link>
          </li>
        ))}
        {cases.length === 0 && (
          <li className="paper-card p-8 text-center text-ink/55">
            {lang === "bg" ? "Няма дела още." : "No cases yet."}
          </li>
        )}
      </ul>
    </div>
  );
}
