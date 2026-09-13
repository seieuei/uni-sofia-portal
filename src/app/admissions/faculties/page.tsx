"use client";

import Link from "next/link";
import { useApp } from "@/components/Providers";
import { specialtiesByFaculty } from "@/content/admissions/specialties";
import { hubByFacultyCode } from "@/content/faculties/hubs";
import { SU_FACULTIES } from "@/lib/structure";

export default function AdmissionsFacultiesPage() {
  const { lang } = useApp();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">
        {lang === "bg" ? "Специалности по факултет" : "Programmes by faculty"}
      </h1>
      <p className="mt-3 max-w-2xl text-ink/70">
        {lang === "bg"
          ? "ФКНФ и Философски факултет са попълнени. Останалите са индекс от Приложение №2."
          : "FCML and the Faculty of Philosophy are filled in. The rest are an Appendix 2 index."}
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {SU_FACULTIES.map((f) => {
          const n = specialtiesByFaculty(f.id).length;
          const hub = hubByFacultyCode(f.id);
          const rich = f.id === "FCML" || f.id === "FFIL";
          return (
            <li key={f.id}>
              <Link
                href={`/admissions/faculties/${f.id}`}
                className={`paper-card block p-4 transition hover:-translate-y-0.5 ${rich ? "ring-1 ring-gold/40" : ""}`}
              >
                <div className="text-[10px] uppercase tracking-wide text-ink/40">{f.id}</div>
                <div className="mt-1 font-medium">{lang === "bg" ? f.labelBg : f.labelEn}</div>
                <div className="mt-2 text-xs text-ink/55">
                  {n} {lang === "bg" ? "записа" : "entries"}
                  {hub ? ` · ${lang === "bg" ? "има факултетен хъб" : "faculty hub"}` : ""}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
