"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";
import { formatSlots, gradingLabel, typeLabel, type OfferingDTO } from "@/lib/academicUi";

export default function SyllabusPage() {
  const { id } = useParams<{ id: string }>();
  const { lang, user, ready } = useApp();
  const router = useRouter();
  const [offering, setOffering] = useState<OfferingDTO | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    fetch(`/api/academic/courses/${id}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) {
          setError(d.error || "Error");
          return;
        }
        setOffering(d.offering);
      });
  }, [ready, user, router, id]);

  if (!ready || !user) return <div className="mx-auto max-w-6xl px-4 py-12">…</div>;

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="paper-card p-6 text-burgundy">{error}</p>
        <Link href="/courses" className="mt-4 inline-block text-sm text-burgundy hover:underline">
          ← {t("navCourses", lang)}
        </Link>
      </div>
    );
  }

  if (!offering) return <div className="mx-auto max-w-6xl px-4 py-12 text-ink/50">…</div>;

  const s = offering.syllabus;
  const title = lang === "bg" ? offering.course.titleBg : offering.course.titleEn;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/courses" className="text-sm text-burgundy hover:underline">
        ← {t("navCourses", lang)}
      </Link>
      <p className="mt-4 font-mono text-sm font-bold text-burgundy">{offering.course.code}</p>
      <h1 className="font-display text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-ink/55">
        {offering.program.titleBg} · {offering.program.code} · {typeLabel(offering.course.type, lang)} ·{" "}
        {offering.course.ects} ECTS · {gradingLabel(offering.course.grading, lang)}
      </p>
      <p className="mt-1 text-sm text-ink/55">
        {lang === "bg" ? "Титуляр" : "Titular"}: {offering.lecturer?.name || "—"}
        {offering.assistant ? ` · ${lang === "bg" ? "асистент" : "assistant"}: ${offering.assistant.name}` : ""}
      </p>
      <p className="mt-1 text-xs text-ink/45">{formatSlots(offering.slots, lang)}</p>

      {s ? (
        <>
          <section className="paper-card mt-8 p-6">
            <h2 className="font-display text-lg font-semibold">
              {lang === "bg" ? "Натовареност" : "Workload"}
            </h2>
            <table className="mt-3 w-full text-sm">
              <thead className="text-left text-ink/50">
                <tr>
                  <th className="pb-2 font-medium">{lang === "bg" ? "Вид" : "Kind"}</th>
                  <th className="pb-2 font-medium">{lang === "bg" ? "Часове" : "Hours"}</th>
                  <th className="pb-2 font-medium">ECTS</th>
                </tr>
              </thead>
              <tbody>
                {s.load.map((row) => (
                  <tr key={row.kind} className="border-t border-ink/10">
                    <td className="py-1.5">{lang === "bg" ? row.labelBg : row.labelEn}</td>
                    <td>{row.hours}</td>
                    <td>{row.ects}</td>
                  </tr>
                ))}
                <tr className="border-t border-ink/20 font-medium">
                  <td className="py-1.5">{lang === "bg" ? "Общо" : "Total"}</td>
                  <td>{s.load.reduce((a, r) => a + r.hours, 0)}</td>
                  <td>{s.load.reduce((a, r) => a + r.ects, 0)}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="paper-card mt-4 p-6">
            <h2 className="font-display text-lg font-semibold">
              {lang === "bg" ? "Оценяване" : "Grading"}
            </h2>
            <ul className="mt-3 space-y-1 text-sm">
              {s.grading.map((g) => (
                <li key={g.labelEn} className="flex justify-between gap-4">
                  <span>{lang === "bg" ? g.labelBg : g.labelEn}</span>
                  <span className="font-medium">{g.percent}%</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="paper-card mt-4 space-y-4 p-6 text-sm leading-relaxed">
            <div>
              <h2 className="font-display text-lg font-semibold">
                {lang === "bg" ? "Анотация" : "Annotation"}
              </h2>
              <p className="mt-2 text-ink/75">{lang === "bg" ? s.annotationBg : s.annotationEn}</p>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">
                {lang === "bg" ? "Предварителни изисквания" : "Prerequisites"}
              </h2>
              <p className="mt-2 text-ink/75">
                {lang === "bg" ? s.prerequisitesBg : s.prerequisitesEn}
              </p>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">
                {lang === "bg" ? "Резултати" : "Outcomes"}
              </h2>
              <p className="mt-2 text-ink/75">{lang === "bg" ? s.outcomesBg : s.outcomesEn}</p>
            </div>
          </section>

          <section className="paper-card mt-4 p-6">
            <h2 className="font-display text-lg font-semibold">
              {lang === "bg" ? "Седмични теми" : "Weekly topics"}
            </h2>
            <ol className="mt-3 space-y-2 text-sm">
              {s.topics.map((topic) => (
                <li key={topic.week} className="flex gap-3 border-t border-ink/10 pt-2 first:border-t-0 first:pt-0">
                  <span className="w-8 shrink-0 font-mono text-ink/40">{topic.week}</span>
                  <span className="flex-1">{lang === "bg" ? topic.titleBg : topic.titleEn}</span>
                  <span className="shrink-0 text-ink/45">{topic.hours}h</span>
                </li>
              ))}
            </ol>
          </section>
        </>
      ) : (
        <p className="paper-card mt-8 p-6 text-sm text-ink/60">
          {lang === "bg"
            ? "Учебна програма още не е въведена за това занятие."
            : "No syllabus has been entered for this offering yet."}
        </p>
      )}
    </div>
  );
}
