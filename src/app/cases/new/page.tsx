"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";
import { ACTIVITY_KEYS, LOAD_ACTIVITY_RATES } from "@/lib/rates";

type Process = {
  id: string;
  slug: string;
  titleBg: string;
  titleEn: string;
  descriptionBg: string;
  descriptionEn: string;
};

type Line = {
  lecturerName: string;
  lecturerEmail: string;
  activity: string;
  hours: string;
  rateEur: string;
};

const emptyLine = (): Line => ({
  lecturerName: "д-р Иван Хонораров",
  lecturerEmail: "lecturer@demo.uni-sofia.local",
  activity: "lectures",
  hours: "30",
  rateEur: String(LOAD_ACTIVITY_RATES.lectures.rateEur),
});

export default function NewCasePage() {
  const { lang, user, ready } = useApp();
  const router = useRouter();
  const [processes, setProcesses] = useState<Process[]>([]);
  const [processSlug, setProcessSlug] = useState("load-pay-5-2");
  const [period, setPeriod] = useState("Зимен семестър 2025/26");
  const [program, setProgram] = useState("Африканистика");
  const [funding, setFunding] = useState("Факултетен бюджет / хонорари");
  const [lines, setLines] = useState<Line[]>([emptyLine()]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    fetch("/api/processes")
      .then((r) => r.json())
      .then((d) => {
        const list = d.processes || [];
        setProcesses(list);
        if (list[0]) setProcessSlug(list[0].slug);
      });
  }, [ready, user, router]);

  function updateLine(i: number, patch: Partial<Line>) {
    setLines((prev) => {
      const next = [...prev];
      const merged = { ...next[i], ...patch };
      if (patch.activity && !patch.rateEur) {
        merged.rateEur = String(LOAD_ACTIVITY_RATES[patch.activity]?.rateEur ?? merged.rateEur);
      }
      next[i] = merged;
      return next;
    });
  }

  async function submit(sendToLecturers: boolean) {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          processSlug,
          period,
          program,
          funding,
          sendToLecturers,
          lines: lines.map((l) => ({
            lecturerName: l.lecturerName,
            lecturerEmail: l.lecturerEmail,
            activity: l.activity,
            hours: Number(l.hours),
            rateEur: Number(l.rateEur),
          })),
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || "Failed");
        return;
      }
      router.push(`/cases/${d.case.id}`);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await submit(true);
  }

  if (!ready || !user) return <div className="mx-auto max-w-6xl px-4 py-12">…</div>;

  if (processes.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold">{t("newCaseTitle", lang)}</h1>
        <p className="mt-4 text-ink/65">
          {lang === "bg"
            ? "Няма процеси, които твоята роля може да стартира (default deny)."
            : "No processes your role may start (default deny)."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">{t("newCaseTitle", lang)}</h1>
      <p className="mt-2 text-sm text-ink/60">
        {lang === "bg"
          ? "Магьосник за образец 5.2 — натовареност / хонорари."
          : "Wizard for form 5.2 — load / honorary pay."}
      </p>

      <form onSubmit={onSubmit} className="paper-card mt-8 space-y-5 p-6">
        <div>
          <label className="label">{lang === "bg" ? "Процес" : "Process"}</label>
          <select className="field" value={processSlug} onChange={(e) => setProcessSlug(e.target.value)}>
            {processes.map((p) => (
              <option key={p.slug} value={p.slug}>
                {lang === "bg" ? p.titleBg : p.titleEn}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">{lang === "bg" ? "Период" : "Period"}</label>
            <input className="field" value={period} onChange={(e) => setPeriod(e.target.value)} required />
          </div>
          <div>
            <label className="label">{lang === "bg" ? "Програма" : "Program"}</label>
            <input className="field" value={program} onChange={(e) => setProgram(e.target.value)} required />
          </div>
        </div>
        <div>
          <label className="label">{lang === "bg" ? "Източник на финансиране" : "Funding source"}</label>
          <input className="field" value={funding} onChange={(e) => setFunding(e.target.value)} required />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="label mb-0">{lang === "bg" ? "Преподаватели / дейности" : "Lecturers / activities"}</label>
            <button
              type="button"
              className="text-xs font-medium text-burgundy"
              onClick={() => setLines((prev) => [...prev, emptyLine()])}
            >
              + {lang === "bg" ? "ред" : "row"}
            </button>
          </div>
          <div className="space-y-3">
            {lines.map((line, i) => (
              <div key={i} className="rounded-xl border border-ink/10 bg-cream/40 p-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    className="field"
                    placeholder={lang === "bg" ? "Име" : "Name"}
                    value={line.lecturerName}
                    onChange={(e) => updateLine(i, { lecturerName: e.target.value })}
                    required
                  />
                  <input
                    className="field"
                    placeholder="email"
                    type="email"
                    value={line.lecturerEmail}
                    onChange={(e) => updateLine(i, { lecturerEmail: e.target.value })}
                  />
                  <select
                    className="field"
                    value={line.activity}
                    onChange={(e) => updateLine(i, { activity: e.target.value })}
                  >
                    {ACTIVITY_KEYS.map((k) => (
                      <option key={k} value={k}>
                        {lang === "bg" ? LOAD_ACTIVITY_RATES[k].labelBg : LOAD_ACTIVITY_RATES[k].labelEn}
                      </option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="field"
                      type="number"
                      step="0.5"
                      min="0"
                      placeholder={lang === "bg" ? "Часове" : "Hours"}
                      value={line.hours}
                      onChange={(e) => updateLine(i, { hours: e.target.value })}
                      required
                    />
                    <input
                      className="field"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="EUR"
                      value={line.rateEur}
                      onChange={(e) => updateLine(i, { rateEur: e.target.value })}
                    />
                  </div>
                </div>
                {lines.length > 1 && (
                  <button
                    type="button"
                    className="mt-2 text-xs text-ink/50 hover:text-burgundy"
                    onClick={() => setLines((prev) => prev.filter((_, j) => j !== i))}
                  >
                    {lang === "bg" ? "Премахни" : "Remove"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-burgundy">{error}</p>}

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading
              ? "…"
              : lang === "bg"
                ? "Изпрати към преподавател"
                : "Send to lecturer"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            disabled={loading}
            onClick={() => submit(false)}
          >
            {lang === "bg" ? "Запази чернова" : "Save draft"}
          </button>
        </div>
      </form>
    </div>
  );
}
