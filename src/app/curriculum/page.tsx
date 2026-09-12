"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";
import { formOfStudyLabel, gradingLabel, typeLabel } from "@/lib/academicUi";

type CourseRow = {
  id: string;
  code: string;
  titleBg: string;
  titleEn: string;
  type: string;
  semester: number;
  ects: number;
  hoursTotal: number;
  hoursLectures: number;
  hoursSeminars: number;
  hoursPractice: number;
  weeklyLoad: string;
  grading: string;
};

type Payload = {
  program: {
    code: string;
    titleBg: string;
    titleEn: string;
    degree: string;
    professionalFieldBg: string | null;
    professionalFieldEn: string | null;
    formOfStudy: string;
    semesters: number;
    noteBg: string | null;
    noteEn: string | null;
    faculty: { shortBg: string; nameBg: string; nameEn: string };
  };
  version: { academicYear: string; labelBg: string; labelEn: string; courses: CourseRow[] } | null;
};

export default function CurriculumPage() {
  const { lang, user, ready } = useApp();
  const router = useRouter();
  const [data, setData] = useState<Payload | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    fetch("/api/academic/curriculum")
      .then((r) => r.json())
      .then(setData);
  }, [ready, user, router]);

  if (!ready || !user) return <div className="mx-auto max-w-6xl px-4 py-12">…</div>;
  if (!data?.program) return <div className="mx-auto max-w-6xl px-4 py-12 text-ink/50">…</div>;

  const p = data.program;
  const courses = data.version?.courses || [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-xs uppercase tracking-wide text-ink/45">
        {lang === "bg" ? "Учебен план / COURSE CURRICULUM" : "COURSE CURRICULUM / Учебен план"}
      </p>
      <h1 className="mt-1 font-display text-3xl font-bold">{t("navCurriculum", lang)}</h1>
      <p className="mt-2 text-ink/60">{lang === "bg" ? p.titleBg : p.titleEn}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { k: lang === "bg" ? "Професионално направление" : "Professional field", v: lang === "bg" ? p.professionalFieldBg : p.professionalFieldEn },
          { k: lang === "bg" ? "ОКС" : "Degree", v: p.degree },
          { k: lang === "bg" ? "Код" : "Code", v: p.code },
          { k: lang === "bg" ? "Форма" : "Form", v: formOfStudyLabel(p.formOfStudy, lang) },
        ].map((box) => (
          <div key={box.k} className="paper-card px-4 py-3">
            <div className="text-[10px] uppercase tracking-wide text-ink/40">{box.k}</div>
            <div className="mt-1 font-medium">{box.v || "—"}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-ink/50">
        {p.faculty.shortBg} · {p.semesters} {lang === "bg" ? "семестра" : "semesters"}
        {data.version ? ` · ${data.version.academicYear}` : ""}
      </p>

      <div className="paper-card mt-8 overflow-x-auto p-4">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-[11px] uppercase tracking-wide text-ink/45">
            <tr>
              <th className="pb-2 pr-2">№</th>
              <th className="pb-2 pr-2">{lang === "bg" ? "Код" : "Code"}</th>
              <th className="pb-2 pr-2">{lang === "bg" ? "Дисциплина" : "Course"}</th>
              <th className="pb-2 pr-2">C/E/O</th>
              <th className="pb-2 pr-2">{lang === "bg" ? "Сем." : "Term"}</th>
              <th className="pb-2 pr-2">ECTS</th>
              <th className="pb-2 pr-2">{lang === "bg" ? "Часове" : "Hours"}</th>
              <th className="pb-2 pr-2">{lang === "bg" ? "Седм." : "Weekly"}</th>
              <th className="pb-2">{lang === "bg" ? "Оценяване" : "Grading"}</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c, i) => (
              <tr key={c.id} className="border-t border-ink/10">
                <td className="py-2 pr-2 text-ink/40">{i + 1}</td>
                <td className="py-2 pr-2 font-mono text-burgundy">{c.code}</td>
                <td className="py-2 pr-2">{lang === "bg" ? c.titleBg : c.titleEn}</td>
                <td className="py-2 pr-2" title={typeLabel(c.type, lang)}>
                  {c.type}
                </td>
                <td className="py-2 pr-2">{c.semester}</td>
                <td className="py-2 pr-2">{c.ects}</td>
                <td className="py-2 pr-2 text-xs text-ink/70">
                  {c.hoursTotal} / {c.hoursLectures}/{c.hoursSeminars}/{c.hoursPractice}
                </td>
                <td className="py-2 pr-2">{c.weeklyLoad}</td>
                <td className="py-2">{gradingLabel(c.grading, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {p.noteBg && (
        <p className="mt-4 text-sm text-ink/60">{lang === "bg" ? p.noteBg : p.noteEn}</p>
      )}
    </div>
  );
}
