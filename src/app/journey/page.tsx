"use client";

import { useApp } from "@/components/Providers";
import { StudentJourney } from "@/components/StudentJourney";
import { t } from "@/lib/i18n";

export default function JourneyPage() {
  const { lang } = useApp();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">{t("journeyTitle", lang)}</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink/70">{t("journeyLead", lang)}</p>
      <div className="mt-8">
        <StudentJourney lang={lang} />
      </div>
    </div>
  );
}
