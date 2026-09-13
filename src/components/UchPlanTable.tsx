import { uchPlanHours, type UchPlan } from "@/content/curriculum";
import { formOfStudyLabel, gradingLabel, typeLabel } from "@/lib/academicUi";
import type { Lang } from "@/lib/types";

export function UchPlanTable({ plan, lang }: { plan: UchPlan; lang: Lang }) {
  const semesters = Array.from(new Set(plan.courses.map((c) => c.semester))).sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            k: lang === "bg" ? "Професионално направление" : "Professional field",
            v: lang === "bg" ? plan.program.professionalFieldBg : plan.program.professionalFieldEn,
          },
          { k: lang === "bg" ? "ОКС" : "Degree", v: plan.program.degree },
          { k: lang === "bg" ? "Код" : "Code", v: plan.program.code },
          { k: lang === "bg" ? "Форма" : "Form", v: formOfStudyLabel(plan.program.formOfStudy, lang) },
        ].map((box) => (
          <div key={box.k} className="paper-card px-4 py-3">
            <div className="text-[10px] uppercase tracking-wide text-ink/40">{box.k}</div>
            <div className="mt-1 text-sm font-medium">{box.v}</div>
          </div>
        ))}
      </div>
      {(lang === "bg" ? plan.program.noteBg : plan.program.noteEn) && (
        <p className="text-sm text-ink/65">{lang === "bg" ? plan.program.noteBg : plan.program.noteEn}</p>
      )}
      {semesters.map((sem) => {
        const rows = plan.courses.filter((c) => c.semester === sem).sort((a, b) => a.sortOrder - b.sortOrder);
        const ects = rows.reduce((s, c) => s + c.ects, 0);
        return (
          <section key={sem}>
            <h3 className="font-display text-lg font-semibold">
              {lang === "bg" ? `Семестър ${sem}` : `Semester ${sem}`}
              <span className="ml-2 text-sm font-normal text-ink/50">{ects} ECTS</span>
            </h3>
            <div className="mt-2 overflow-x-auto rounded-xl border border-ink/10 dark:border-gold/20">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-ink/[0.04] text-[11px] uppercase tracking-wide text-ink/50">
                  <tr>
                    <th className="px-3 py-2">{lang === "bg" ? "Код" : "Code"}</th>
                    <th className="px-3 py-2">{lang === "bg" ? "Дисциплина" : "Course"}</th>
                    <th className="px-3 py-2">{lang === "bg" ? "Вид" : "Type"}</th>
                    <th className="px-3 py-2">{lang === "bg" ? "Часове" : "Hours"}</th>
                    <th className="px-3 py-2">ECTS</th>
                    <th className="px-3 py-2">{lang === "bg" ? "Оценка" : "Grading"}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr key={`${c.code}-${c.semester}`} className="border-t border-ink/8 dark:border-gold/10">
                      <td className="px-3 py-2 font-mono text-xs font-semibold text-burgundy">{c.code}</td>
                      <td className="px-3 py-2">{lang === "bg" ? c.titleBg : c.titleEn}</td>
                      <td className="px-3 py-2 text-ink/70">{typeLabel(c.type, lang)}</td>
                      <td className="px-3 py-2 text-ink/70">
                        {uchPlanHours(c)}
                        <span className="ml-1 text-[11px] text-ink/40">{c.weeklyLoad}</span>
                      </td>
                      <td className="px-3 py-2">{c.ects}</td>
                      <td className="px-3 py-2 text-ink/70">{gradingLabel(c.grading, lang)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
      <p className="text-xs text-ink/45">
        {lang === "bg"
          ? "З — задължителна · И — избираема · Ф — факултативна. Пилотен внос от учебен план (JSON)."
          : "C — compulsory · E — elective · O — optional. Pilot import from a curriculum sheet (JSON)."}
      </p>
    </div>
  );
}
