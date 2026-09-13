"use client";

import Link from "next/link";
import { useApp } from "@/components/Providers";
import { SU_FACULTIES } from "@/lib/structure";
import { hubByFacultyCode } from "@/content/faculties/hubs";
import { t } from "@/lib/i18n";

export default function FacultiesPage() {
  const { lang, user } = useApp();
  const mine = user?.facultyCode;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">{t("facultiesTitle", lang)}</h1>
      <p className="mt-3 text-ink/70">{t("facultiesLead", lang)}</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {SU_FACULTIES.map((f) => {
          const hi = f.highlight || f.id === mine;
          const hub = hubByFacultyCode(f.id);
          const href = hub ? `/faculties/${hub.slug}` : `/faculties/${f.id.toLowerCase()}`;
          return (
            <li key={f.id}>
              <Link
                href={href}
                className={`paper-card block p-4 transition hover:-translate-y-0.5 ${hi ? "ring-2 ring-gold/50" : ""}`}
              >
                <div className="text-[10px] uppercase tracking-wide text-ink/40">{f.id}</div>
                <div className="mt-1 font-medium">{lang === "bg" ? f.labelBg : f.labelEn}</div>
                {hi && (
                  <div className="mt-2 text-xs font-semibold text-burgundy">
                    {f.highlight ? (lang === "bg" ? "Пилотен факултет" : "Pilot faculty") : t("yourFaculty", lang)}
                  </div>
                )}
                <div className="mt-2 text-xs text-ink/50">
                  {hub
                    ? lang === "bg"
                      ? "Пълен факултетен хъб"
                      : "Full faculty hub"
                    : lang === "bg"
                      ? "Прием + структура"
                      : "Admissions + structure"}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link href="/structure" className="btn-primary mt-8">
        {t("navStructure", lang)}
      </Link>
    </div>
  );
}
