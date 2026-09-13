"use client";

import { useApp } from "@/components/Providers";
import { StructureMindMap } from "@/components/StructureMindMap";
import { t } from "@/lib/i18n";

export default function StructurePage() {
  const { lang, user } = useApp();
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">{t("structureTitle", lang)}</h1>
      <p className="mt-3 max-w-2xl text-ink/70">{t("structureLead", lang)}</p>
      <div className="mt-8">
        <StructureMindMap lang={lang} facultyCode={user?.facultyCode || "FCML"} />
      </div>
    </div>
  );
}
