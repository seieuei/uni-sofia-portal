"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { FacultyHubView } from "@/components/FacultyHubView";
import { getHub } from "@/content/faculties/hubs";
import { SU_FACULTIES } from "@/lib/structure";

export default function FacultyHubPage() {
  const { lang } = useApp();
  const params = useParams();
  const slug = String(params.slug || "");
  const hub = getHub(slug);

  if (hub) return <FacultyHubView hub={hub} />;

  const fac = SU_FACULTIES.find((f) => f.id.toLowerCase() === slug.toLowerCase() || f.id === slug);
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">
        {fac ? (lang === "bg" ? fac.labelBg : fac.labelEn) : slug}
      </h1>
      <p className="mt-3 text-ink/70">
        {lang === "bg"
          ? "Пълен хъб има за ФКНФ и Философски факултет. Тук са връзките към прием и структура."
          : "Full hubs exist for FCML and Philosophy. Here are links to admissions and structure."}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/admissions/faculties/${fac?.id || slug.toUpperCase()}`} className="btn-primary">
          {lang === "bg" ? "Прием / специалности" : "Admissions / programmes"}
        </Link>
        <Link href="/structure" className="btn-secondary">
          {lang === "bg" ? "Структура" : "Structure"}
        </Link>
      </div>
    </div>
  );
}
