"use client";

import { calendarDotClass, calendarToneLabel, CALENDAR_LEGEND } from "@/lib/calendar";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export function CalendarLegend({ lang, compact = false }: { lang: Lang; compact?: boolean }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${compact ? "text-[10px]" : "text-xs"}`}>
      <span className="font-medium text-ink/50">{t("calendarLegend", lang)}</span>
      {CALENDAR_LEGEND.map((tone) => (
        <span key={tone} className="inline-flex items-center gap-1.5 text-ink/70">
          <span className={`h-2 w-2 rounded-full ${calendarDotClass(tone)}`} />
          {calendarToneLabel(tone, lang)}
        </span>
      ))}
    </div>
  );
}
