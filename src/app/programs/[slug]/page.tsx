"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useApp } from "@/components/Providers";
import { UchPlanTable } from "@/components/UchPlanTable";
import { getUchPlan } from "@/content/curriculum";
import { getSpecialty } from "@/content/admissions/specialties";
import { getHub } from "@/content/faculties/hubs";

export default function ProgramPage() {
  const { lang } = useApp();
  const params = useParams();
  const slug = String(params.slug || "");
  const plan = getUchPlan(slug);
  const spec = slug === "african-studies-ba" ? getSpecialty("afrikanistika") : getSpecialty(slug);
  const hub = getHub(plan?.program.facultyCode || spec?.facultyCode || "FCML");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <nav className="mb-6 flex flex-wrap gap-1 text-xs text-ink/50">
        <Link href="/faculties" className="hover:text-burgundy">
          {lang === "bg" ? "Факултети" : "Faculties"}
        </Link>
        {hub && (
          <>
            <span>/</span>
            <Link href={`/faculties/${hub.slug}`} className="hover:text-burgundy">
              {hub.shortBg}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-ink">{plan ? (lang === "bg" ? plan.program.titleBg : plan.program.titleEn) : slug}</span>
      </nav>

      <p className="text-xs uppercase tracking-wide text-ink/45">
        {lang === "bg" ? "Учебен план / COURSE CURRICULUM" : "COURSE CURRICULUM / Учебен план"}
      </p>
      <h1 className="font-display mt-1 text-3xl font-bold">
        {plan ? (lang === "bg" ? plan.program.titleBg : plan.program.titleEn) : slug}
      </h1>
      <p className="mt-2 text-ink/60">
        {lang === "bg" ? "Бакалавърска програма — УчПлан с дисциплини З / И / Ф." : "Bachelor programme — UchPlan with C / E / O courses."}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {spec && (
          <Link href={`/admissions/specialties/${spec.slug}`} className="btn-secondary !px-3 !py-1.5 text-xs">
            {lang === "bg" ? "Балообразуване" : "Score formula"}
          </Link>
        )}
        <Link href="/structure" className="btn-secondary !px-3 !py-1.5 text-xs">
          {lang === "bg" ? "Карта на структурата" : "Structure map"}
        </Link>
      </div>

      {plan ? (
        <div className="mt-8">
          <UchPlanTable plan={plan} lang={lang} />
        </div>
      ) : (
        <p className="callout mt-8 px-4 py-3 text-sm">
          {lang === "bg"
            ? "Пълен УчПлан е внесен за Африканистика. За тази програма още няма импортиран лист."
            : "A full UchPlan is imported for African Studies. This programme does not have a sheet yet."}
        </p>
      )}
    </div>
  );
}
