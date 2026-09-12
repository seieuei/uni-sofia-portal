"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";
import type { IndividualReportData, ReportRow } from "@/lib/reportTypes";

function TermTable({ title, rows, lang }: { title: string; rows: ReportRow[]; lang: "bg" | "en" }) {
  const lect = rows.reduce((s, r) => s + r.lectureHours, 0);
  const ex = rows.reduce((s, r) => s + r.exerciseHours, 0);
  return (
    <section className="paper-card mt-6 overflow-x-auto p-4">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <table className="mt-3 w-full min-w-[860px] text-left text-xs">
        <thead className="uppercase tracking-wide text-ink/45">
          <tr>
            {(lang === "bg"
              ? ["Дисциплина", "Спец.", "Фак.", "Вид", "Курс", "Форма", "Студ.", "Лекц.", "Упр.", "Език", "Оценяване", "Титуляр", "Асист.", "Изп.", "Тек.", "Курс."]
              : ["Course", "Prog.", "Fac.", "Kind", "Year", "Form", "Stud.", "Lect.", "Ex.", "Lang", "Assess.", "Titular", "Asst.", "Exm.", "CA", "CW"]
            ).map((h) => (
              <th key={h} className="pb-2 pr-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={16} className="py-4 text-ink/45">
                {lang === "bg" ? "Няма занятия този семестър." : "No offerings this semester."}
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.discipline} className="border-t border-ink/10">
                <td className="py-2 pr-2 font-medium">{r.discipline}</td>
                <td className="py-2 pr-2">{r.specialty}</td>
                <td className="py-2 pr-2">{r.faculty}</td>
                <td className="py-2 pr-2">{r.kind}</td>
                <td className="py-2 pr-2">{r.year}</td>
                <td className="py-2 pr-2">{r.form}</td>
                <td className="py-2 pr-2">{r.studentCount}</td>
                <td className="py-2 pr-2">{r.lectureHours}</td>
                <td className="py-2 pr-2">{r.exerciseHours}</td>
                <td className="py-2 pr-2">{r.language}</td>
                <td className="py-2 pr-2">{r.assessment}</td>
                <td className="py-2 pr-2">{r.titular}</td>
                <td className="py-2 pr-2">{r.assistant || "—"}</td>
                <td className="py-2 pr-2">{r.examined}</td>
                <td className="py-2 pr-2">{r.currentAssessed}</td>
                <td className="py-2">{r.courseworks}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-ink/50">
        {lang === "bg" ? "Общо часове" : "Total hours"}: {lang === "bg" ? "лекции" : "lectures"} {lect} ·{" "}
        {lang === "bg" ? "упражнения" : "exercises"} {ex} · {lect + ex}
      </p>
    </section>
  );
}

export default function ReportPage() {
  const { lang, user, ready } = useApp();
  const router = useRouter();
  const [report, setReport] = useState<IndividualReportData | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "lecturer" && user.role !== "program_admin" && user.role !== "faculty_admin") {
      router.replace("/courses");
      return;
    }
    fetch("/api/academic/report")
      .then((r) => r.json())
      .then((d) => setReport(d.report || null));
  }, [ready, user, router]);

  if (!ready || !user) return <div className="mx-auto max-w-6xl px-4 py-12">…</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("navReport", lang)}</h1>
          <p className="mt-2 text-sm text-ink/60">
            {lang === "bg"
              ? "Индивидуален отчет — попълнен от обявените занятия, не от празен имейл формуляр."
              : "Personal teaching report — filled from known offerings, not a blank email form."}
          </p>
        </div>
        <a href="/api/academic/report/docx" className="btn-primary text-sm">
          {lang === "bg" ? "Свали DOCX" : "Download DOCX"}
        </a>
      </div>

      {report ? (
        <>
          <div className="paper-card mt-8 space-y-1 p-5 text-sm">
            <div>
              <span className="text-ink/45">{lang === "bg" ? "Преподавател" : "Lecturer"}: </span>
              {report.lecturerName}
            </div>
            <div>
              <span className="text-ink/45">{lang === "bg" ? "Учебна година" : "Academic year"}: </span>
              {report.academicYear}
            </div>
            <div>
              <span className="text-ink/45">{lang === "bg" ? "Катедра" : "Department"}: </span>
              {report.department} · {report.faculty}
            </div>
          </div>
          <TermTable
            title={lang === "bg" ? "Зимен семестър" : "Winter semester"}
            rows={report.winter}
            lang={lang}
          />
          <TermTable
            title={lang === "bg" ? "Летен семестър" : "Summer semester"}
            rows={report.summer}
            lang={lang}
          />
          <p className="mt-4 text-xs italic text-ink/50">{report.note}</p>
        </>
      ) : (
        <p className="mt-8 text-ink/50">…</p>
      )}
    </div>
  );
}
