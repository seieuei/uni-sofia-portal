"use client";

import { useParams } from "next/navigation";
import { useApp } from "@/components/Providers";
import { GuideArticle } from "@/components/GuideArticle";
import { getGuidePage } from "@/content/admissions/guide";

export default function AdmissionsGuidePage() {
  const { lang } = useApp();
  const params = useParams();
  const slug = String(params.slug || "");
  const page = getGuidePage(slug);

  if (!page || slug === "overview") {
    return (
      <p className="text-ink/60">
        {lang === "bg" ? "Разделът не е намерен." : "Section not found."}
      </p>
    );
  }

  return <GuideArticle page={page} lang={lang} />;
}
