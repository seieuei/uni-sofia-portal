"use client";

import Link from "next/link";
import { useApp } from "@/components/Providers";
import { GuideArticle } from "@/components/GuideArticle";
import { getGuidePage } from "@/content/admissions/guide";
import { specialtiesByFaculty } from "@/content/admissions/specialties";

export default function AdmissionsHomePage() {
  const { lang } = useApp();
  const page = getGuidePage("overview")!;
  const fcml = specialtiesByFaculty("FCML").length;
  const phls = specialtiesByFaculty("FFIL").length;

  return (
    <div>
      <GuideArticle page={page} lang={lang} />
      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        <Link href="/admissions/score" className="paper-card p-4 transition hover:-translate-y-0.5">
          <div className="text-[11px] uppercase tracking-wide text-ink/40">{lang === "bg" ? "Бал" : "Score"}</div>
          <div className="mt-1 font-medium">{lang === "bg" ? "Как се смята балът" : "How the score is calculated"}</div>
        </Link>
        <Link href="/admissions/faculties/FCML" className="paper-card p-4 transition hover:-translate-y-0.5">
          <div className="text-[11px] uppercase tracking-wide text-ink/40">ФКНФ</div>
          <div className="mt-1 font-medium">
            {fcml} {lang === "bg" ? "специалности" : "programmes"}
          </div>
        </Link>
        <Link href="/admissions/faculties/FFIL" className="paper-card p-4 transition hover:-translate-y-0.5">
          <div className="text-[11px] uppercase tracking-wide text-ink/40">{lang === "bg" ? "Философски" : "Philosophy"}</div>
          <div className="mt-1 font-medium">
            {phls} {lang === "bg" ? "специалности" : "programmes"}
          </div>
        </Link>
      </div>
    </div>
  );
}
