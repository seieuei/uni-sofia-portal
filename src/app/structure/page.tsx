"use client";

import Link from "next/link";
import { useApp } from "@/components/Providers";
import { StructureMindMap } from "@/components/StructureMindMap";
import { t } from "@/lib/i18n";

export default function StructurePage() {
  const { lang, user } = useApp();
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">{t("structureTitle", lang)}</h1>
      <p className="mt-3 max-w-2xl text-ink/70">{t("structureLead", lang)}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <Link href="/contacts" className="rounded-full bg-burgundy/10 px-3 py-1 font-medium text-burgundy hover:bg-burgundy/15">
          {lang === "bg" ? "Контакти — централна администрация" : "Contacts — central admin"}
        </Link>
        <Link href="/faculties/fcml/contacts" className="rounded-full bg-ink/5 px-3 py-1 text-ink/70 hover:bg-ink/10">
          {lang === "bg" ? "ФКНФ зам.-декани" : "FCML vice-deans"}
        </Link>
      </div>
      <div className="mt-8">
        <StructureMindMap lang={lang} facultyCode={user?.facultyCode || "FCML"} />
      </div>
    </div>
  );
}
