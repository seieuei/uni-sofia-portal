"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useApp } from "@/components/Providers";
import { specialtiesByFaculty, facultyLabel } from "@/content/admissions/specialties";
import { hubByFacultyCode } from "@/content/faculties/hubs";
import { formOfStudyLabel } from "@/lib/academicUi";

export default function AdmissionsFacultyPage() {
  const { lang } = useApp();
  const params = useParams();
  const code = String(params.code || "");
  const rows = specialtiesByFaculty(code);
  const hub = hubByFacultyCode(code);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">{facultyLabel(code, lang)}</h1>
      <p className="mt-2 text-sm text-ink/60">
        {rows.some((r) => r.detail === "full")
          ? lang === "bg"
            ? "Пълен преглед на форми, изпити и предмети от дипломата."
            : "Full view of forms, exams and diploma subjects."
          : lang === "bg"
            ? "Индекс / заготовка от Приложение №2."
            : "Index / stub from Appendix 2."}
      </p>
      {hub && (
        <Link href={`/faculties/${hub.slug}`} className="btn-secondary mt-4 !px-3 !py-1.5 text-xs">
          {lang === "bg" ? "Факултетен хъб" : "Faculty hub"} →
        </Link>
      )}
      <ul className="mt-8 space-y-3">
        {rows.map((s) => (
          <li key={s.slug}>
            <Link href={`/admissions/specialties/${s.slug}`} className="paper-card block p-4 hover:bg-ink/[0.02]">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="font-medium">{lang === "bg" ? s.titleBg : s.titleEn}</div>
                <div className="text-[11px] text-ink/45">
                  {s.forms.map((f) => formOfStudyLabel(f.form, lang)).join(" · ")}
                </div>
              </div>
              <div className="mt-1 text-xs text-ink/55">
                {lang === "bg" ? s.professionalFieldBg : s.professionalFieldEn}
                {s.detail === "stub" ? (lang === "bg" ? " · заготовка" : " · stub") : ""}
              </div>
            </Link>
          </li>
        ))}
        {rows.length === 0 && <li className="text-ink/50">{lang === "bg" ? "Няма записи." : "No entries."}</li>}
      </ul>
    </div>
  );
}
