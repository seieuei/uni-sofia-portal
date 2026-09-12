"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { statusLabel, t } from "@/lib/i18n";

type Item = {
  stepId: string;
  key: string;
  titleBg: string;
  titleEn: string;
  status: string;
  caseId: string;
  caseNumber: string;
  caseTitle: string;
  caseStatus: string;
  processTitleBg: string;
  processTitleEn: string;
  ownerName: string;
};

export default function InboxPage() {
  const { lang, user, ready } = useApp();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [legacy, setLegacy] = useState(0);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    fetch("/api/inbox")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []));
    fetch("/api/submissions")
      .then((r) => r.json())
      .then((d) => setLegacy((d.submissions || []).length));
  }, [ready, user, router]);

  if (!ready || !user) {
    return <div className="mx-auto max-w-6xl px-4 py-12">…</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">{t("inboxTitle", lang)}</h1>
      <p className="mt-2 text-sm text-ink/55">
        {lang === "bg"
          ? "Задачи, назначени на теб (CaseStep)."
          : "Tasks assigned to you (CaseStep)."}
      </p>

      {items.length === 0 ? (
        <p className="paper-card mt-8 p-8 text-center text-ink/60">{t("inboxEmpty", lang)}</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {items.map((it) => (
            <li key={it.stepId}>
              <Link
                href={`/cases/${it.caseId}`}
                className="paper-card flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition hover:bg-cream/40"
              >
                <div>
                  <div className="font-mono text-sm font-bold text-burgundy">{it.caseNumber}</div>
                  <div className="font-medium">{lang === "bg" ? it.titleBg : it.titleEn}</div>
                  <div className="text-xs text-ink/50">
                    {lang === "bg" ? it.processTitleBg : it.processTitleEn} · {it.ownerName}
                  </div>
                </div>
                <span className="rounded-full bg-sage/10 px-2 py-1 text-xs font-medium text-sage">
                  {statusLabel(it.caseStatus, lang)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {legacy > 0 && (
        <p className="mt-8 text-xs text-ink/45">
          {lang === "bg"
            ? `Също: ${legacy} стари симулирани подавания във /forms.`
            : `Also: ${legacy} legacy simulated submissions under /forms.`}{" "}
          <Link href="/forms" className="underline">
            /forms
          </Link>
        </p>
      )}
    </div>
  );
}
