"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useApp } from "@/components/Providers";
import { getSpecialty, facultyLabel, maxScore } from "@/content/admissions/specialties";
import { formOfStudyLabel } from "@/lib/academicUi";
import { hubByFacultyCode } from "@/content/faculties/hubs";

const SOURCE: Record<string, { bg: string; en: string }> = {
  exam: { bg: "Конкурсен изпит", en: "Entrance exam" },
  dzi: { bg: "ДЗИ", en: "ДЗИ" },
  either: { bg: "Изпит или ДЗИ", en: "Exam or ДЗИ" },
  diploma: { bg: "Диплома", en: "Diploma" },
};

export default function SpecialtyPage() {
  const { lang } = useApp();
  const params = useParams();
  const spec = getSpecialty(String(params.slug || ""));

  if (!spec) {
    return <p className="text-ink/60">{lang === "bg" ? "Специалността не е намерена." : "Programme not found."}</p>;
  }

  const hub = hubByFacultyCode(spec.facultyCode);
  const uchHref = spec.slug === "afrikanistika" ? "/programs/african-studies-ba" : null;

  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-ink/40">{spec.facultyCode}</p>
      <h1 className="font-display text-3xl font-bold">{lang === "bg" ? spec.titleBg : spec.titleEn}</h1>
      <p className="mt-2 text-sm text-ink/60">{lang === "bg" ? spec.professionalFieldBg : spec.professionalFieldEn}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/admissions/faculties/${spec.facultyCode}`} className="btn-secondary !px-3 !py-1.5 text-xs">
          {facultyLabel(spec.facultyCode, lang)}
        </Link>
        {hub && (
          <Link href={`/faculties/${hub.slug}`} className="btn-secondary !px-3 !py-1.5 text-xs">
            {lang === "bg" ? "Факултетен хъб" : "Faculty hub"}
          </Link>
        )}
        {uchHref && (
          <Link href={uchHref} className="btn-primary !px-3 !py-1.5 text-xs">
            {lang === "bg" ? "Учебен план (УчПлан)" : "Curriculum (UchPlan)"}
          </Link>
        )}
      </div>

      {spec.detail === "stub" && (
        <p className="callout mt-6 px-4 py-3 text-sm">
          {lang === "bg"
            ? "Заготовка по заглавие от Приложение №2. Коефициентите са ориентировъчни."
            : "Stub from an Appendix 2 header. Coefficients are indicative."}
        </p>
      )}

      {spec.forms.map((offer) => (
        <section key={offer.form} className="paper-card mt-6 p-5">
          <h2 className="font-display text-lg font-semibold capitalize">{formOfStudyLabel(offer.form, lang)}</h2>
          <p className="mt-1 text-xs text-ink/50">
            {lang === "bg" ? "Максимален бал" : "Maximum score"}: {maxScore(offer).toFixed(0)}
          </p>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-ink/40">
                <th className="py-1">{lang === "bg" ? "Източник" : "Source"}</th>
                <th className="py-1">{lang === "bg" ? "Предмет" : "Subject"}</th>
                <th className="py-1">{lang === "bg" ? "Коеф." : "Coeff."}</th>
              </tr>
            </thead>
            <tbody>
              {offer.components.map((c) => (
                <tr key={c.subjectBg + c.source} className="border-t border-ink/10 dark:border-gold/15">
                  <td className="py-2 text-ink/60">{SOURCE[c.source]?.[lang] ?? c.source}</td>
                  <td className="py-2">
                    {lang === "bg" ? c.subjectBg : c.subjectEn}
                    {(lang === "bg" ? c.alternativesBg : c.alternativesEn) && (
                      <div className="text-[11px] text-ink/45">{lang === "bg" ? c.alternativesBg : c.alternativesEn}</div>
                    )}
                  </td>
                  <td className="py-2 font-mono font-semibold text-burgundy">× {c.coefficient}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {offer.noteBg && <p className="mt-3 text-xs text-ink/55">{lang === "bg" ? offer.noteBg : offer.noteEn}</p>}
        </section>
      ))}
    </div>
  );
}
