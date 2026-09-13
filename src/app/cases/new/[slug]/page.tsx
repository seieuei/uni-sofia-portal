"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { DynamicForm, missingRequiredFields } from "@/components/DynamicForm";
import { RouteTimeline } from "@/components/RouteTimeline";
import type { CatalogField, RouteStepDef } from "@/lib/catalog";
import { ACTIVITY_KEYS, LOAD_ACTIVITY_RATES } from "@/lib/rates";

type Process = {
  slug: string;
  titleBg: string;
  titleEn: string;
  descriptionBg: string;
  descriptionEn: string;
  catalogCode: string | null;
  hub: string;
  wizardKind: string;
  nomenclatura: string | null;
  templatePath: string | null;
  fields: CatalogField[];
  route: RouteStepDef[];
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

export default function NewProcessPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang, user, ready } = useApp();
  const router = useRouter();
  const [process, setProcess] = useState<Process | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [error, setError] = useState("");
  const [invalidNames, setInvalidNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [period, setPeriod] = useState("Зимен семестър 2025/26");
  const [program, setProgram] = useState("Африканистика");
  const [funding, setFunding] = useState("Факултетен бюджет / хонорари");
  const [lines, setLines] = useState<Line[]>([emptyLine()]);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    fetch(`/api/processes/${slug}`)
      .then(async (r) => {
        if (r.status === 403) {
          setForbidden(true);
          return;
        }
        const d = await r.json();
        if (d.process) {
          setProcess(d.process);
          const init: Record<string, unknown> = {
            fullName: user.name,
            faculty: user.facultyCode || "FCML",
            department: user.department || "Африканистика",
          };
          for (const f of d.process.fields as CatalogField[]) {
            if (f.type === "loadLines") init[f.name] = [];
            else if (f.type === "checkbox") init[f.name] = false;
            else if (init[f.name] === undefined) init[f.name] = "";
          }
          setValues(init);
        }
      });
  }, [ready, user, router, slug]);

  const filledCount = useMemo(() => {
    if (!process) return 0;
    return process.fields.filter((f) => {
      if (!f.required) return false;
      const v = values[f.name];
      if (f.type === "checkbox") return Boolean(v);
      return v != null && String(v).trim() !== "";
    }).length;
  }, [process, values]);

  const requiredCount = useMemo(
    () => (process ? process.fields.filter((f) => f.required && f.type !== "loadLines").length : 0),
    [process]
  );

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

  async function submitLoad(sendToLecturers: boolean) {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          processSlug: slug,
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

  async function submitGeneric(draft: boolean) {
    setLoading(true);
    setError("");
    setInvalidNames([]);
    if (!draft && process) {
      const missing = missingRequiredFields(process.fields, values);
      if (process.catalogCode === "3.5") {
        const anyGround = ["groundIllness", "groundChildbirth", "groundExams", "groundAbroad", "groundOther"].some(
          (k) => Boolean(values[k])
        );
        if (!anyGround) missing.push("groundIllness");
      }
      if (missing.length) {
        setInvalidNames(missing);
        setError(
          lang === "bg"
            ? "Попълни задължителните полета (маркирани)."
            : "Please fill the required fields (highlighted)."
        );
        setLoading(false);
        return;
      }
    }
    try {
      const r = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ processSlug: slug, fields: values, draft }),
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

  if (!ready || !user) return <div className="mx-auto max-w-6xl px-4 py-12">…</div>;
  if (forbidden) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p>{lang === "bg" ? "Тази роля не може да стартира процеса." : "Your role cannot start this process."}</p>
        <Link href="/cases/new" className="mt-4 inline-block text-burgundy underline">
          ← {tSafe(lang)}
        </Link>
      </div>
    );
  }
  if (!process) return <div className="mx-auto max-w-6xl px-4 py-12">…</div>;

  const title = lang === "bg" ? process.titleBg : process.titleEn;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/cases/new" className="text-sm font-medium text-burgundy hover:underline">
        ← {lang === "bg" ? "Каталог процеси" : "Process catalog"}
      </Link>

      <header className="paper-card mt-4 overflow-hidden">
        <div className="bg-burgundy px-5 py-6 text-ivory sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            {process.catalogCode && (
              <span className="rounded-md bg-ivory/15 px-2 py-0.5 font-mono text-xs font-bold text-gold">
                {process.catalogCode}
              </span>
            )}
            {process.nomenclatura && <span className="text-xs text-ivory/60">{process.nomenclatura}</span>}
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-ivory/75">
            {lang === "bg" ? process.descriptionBg : process.descriptionEn}
          </p>
        </div>
        {process.wizardKind !== "load-5-2" && requiredCount > 0 && (
          <div className="flex items-center justify-between gap-3 border-t border-ink/5 bg-cream/40 px-5 py-2.5 text-xs text-ink/55 dark:bg-night/40">
            <span>
              {lang === "bg" ? "Задължителни полета" : "Required fields"}: {filledCount}/{requiredCount}
            </span>
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-burgundy transition-all dark:bg-gold"
                style={{ width: `${requiredCount ? Math.min(100, (filledCount / requiredCount) * 100) : 0}%` }}
              />
            </div>
          </div>
        )}
      </header>

      {process.route.length > 0 && (
        <section className="paper-card mt-6 p-5">
          <h2 className="font-display text-base font-semibold">
            {lang === "bg" ? "Официален маршрут" : "Official route"}
          </h2>
          <p className="mt-1 text-xs text-ink/50">
            {lang === "bg"
              ? "Ред на съгласуване по Приложение №1, след това извеждане и копия."
              : "Approval order from Annex 1, then outgoing register and copies."}
          </p>
          <div className="mt-3">
            <RouteTimeline steps={process.route} lang={lang} />
          </div>
        </section>
      )}

      {process.wizardKind === "load-5-2" ? (
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            submitLoad(true);
          }}
          className="paper-card mt-8 space-y-5 p-6"
        >
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
              <button type="button" className="text-xs font-semibold text-burgundy" onClick={() => setLines((prev) => [...prev, emptyLine()])}>
                + {lang === "bg" ? "ред" : "row"}
              </button>
            </div>
            <div className="space-y-3">
              {lines.map((line, i) => (
                <div key={i} className="rounded-xl border border-ink/10 bg-cream/40 p-3 dark:bg-night/40">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input className="field" placeholder={lang === "bg" ? "Име" : "Name"} value={line.lecturerName} onChange={(e) => updateLine(i, { lecturerName: e.target.value })} required />
                    <input className="field" placeholder="email" type="email" value={line.lecturerEmail} onChange={(e) => updateLine(i, { lecturerEmail: e.target.value })} />
                    <select className="field" value={line.activity} onChange={(e) => updateLine(i, { activity: e.target.value })}>
                      {ACTIVITY_KEYS.map((k) => (
                        <option key={k} value={k}>
                          {lang === "bg" ? LOAD_ACTIVITY_RATES[k].labelBg : LOAD_ACTIVITY_RATES[k].labelEn}
                        </option>
                      ))}
                    </select>
                    <div className="grid grid-cols-2 gap-2">
                      <input className="field" type="number" step="0.5" min="0" value={line.hours} onChange={(e) => updateLine(i, { hours: e.target.value })} required />
                      <input className="field" type="number" step="0.01" min="0" value={line.rateEur} onChange={(e) => updateLine(i, { rateEur: e.target.value })} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {error && <p className="rounded-xl border border-cal-deadline/30 bg-cal-deadline/10 px-3 py-2 text-sm text-cal-deadline">{error}</p>}
          <div className="flex flex-wrap gap-3 border-t border-ink/10 pt-4">
            <button type="submit" className="btn-primary min-w-[10rem]" disabled={loading}>
              {loading ? "…" : lang === "bg" ? "Изпрати към преподавател" : "Send to lecturer"}
            </button>
            <button type="button" className="btn-secondary" disabled={loading} onClick={() => submitLoad(false)}>
              {lang === "bg" ? "Запази чернова" : "Save draft"}
            </button>
          </div>
        </form>
      ) : (
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            submitGeneric(false);
          }}
          className="paper-card mt-8 space-y-5 p-6"
        >
          <DynamicForm
            fields={process.fields}
            values={values}
            lang={lang}
            invalidNames={invalidNames}
            onChange={(name, value) => {
              setValues((prev) => ({ ...prev, [name]: value }));
              setInvalidNames((prev) => prev.filter((n) => n !== name));
            }}
          />
          {error && <p className="rounded-xl border border-cal-deadline/30 bg-cal-deadline/10 px-3 py-2 text-sm text-cal-deadline">{error}</p>}
          <div className="flex flex-wrap items-center gap-3 border-t border-ink/10 pt-4">
            <button type="submit" className="btn-primary min-w-[10rem]" disabled={loading}>
              {loading ? "…" : lang === "bg" ? "Подай преписка" : "Submit case"}
            </button>
            <button type="button" className="btn-secondary" disabled={loading} onClick={() => submitGeneric(true)}>
              {lang === "bg" ? "Запази чернова" : "Save draft"}
            </button>
          </div>
          <p className="text-xs text-ink/45">
            {lang === "bg"
              ? "Генерира се DOCX: копие на официалния бланк + секция „Данни от портала“, или портален пакет ако бланкът още не е картографиран по отметки."
              : "Produces a DOCX: official blank copy plus a “Portal data” section, or a portal pack if bookmark mapping is not ready."}
          </p>
        </form>
      )}
    </div>
  );
}

function tSafe(lang: "bg" | "en") {
  return lang === "bg" ? "Назад към каталога" : "Back to catalog";
}
