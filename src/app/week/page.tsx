"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/components/Providers";
import { CalendarLegend } from "@/components/CalendarLegend";
import { calendarTone, calendarToneClass, calendarToneLabel } from "@/lib/calendar";
import { t } from "@/lib/i18n";
import { RoleHomeCards } from "@/components/RoleHomeCards";
import { PersonTypeBadge } from "@/components/PersonTypeBadge";

type Ev = {
  id: string;
  titleBg: string;
  titleEn: string;
  when: string;
  kind: string;
  href?: string;
  room?: string | null;
};

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function mondayOf(d: Date) {
  const start = startOfDay(d);
  const day = start.getDay();
  start.setDate(start.getDate() + (day === 0 ? -6 : 1 - day));
  return start;
}

function WeekInner() {
  const { lang, user, ready } = useApp();
  const router = useRouter();
  const params = useSearchParams();
  const highlight = params.get("highlight") || "";
  const refParam = params.get("ref");

  const [events, setEvents] = useState<Ev[]>([]);
  const [weekStart, setWeekStart] = useState(() => {
    if (refParam) {
      const d = new Date(refParam);
      if (!Number.isNaN(d.getTime())) return mondayOf(d);
    }
    return mondayOf(new Date());
  });

  useEffect(() => {
    if (refParam) {
      const d = new Date(refParam);
      if (!Number.isNaN(d.getTime())) setWeekStart(mondayOf(d));
    }
  }, [refParam]);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    const q = new URLSearchParams({ view: "week", ref: weekStart.toISOString() });
    fetch(`/api/week?${q}`)
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []));
  }, [ready, user, router, weekStart]);

  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return d;
      }),
    [weekStart]
  );

  const byDay = useMemo(() => {
    const map = new Map<string, Ev[]>();
    for (const ev of events) {
      const key = startOfDay(new Date(ev.when)).toISOString();
      const list = map.get(key) || [];
      list.push(ev);
      map.set(key, list);
    }
    return map;
  }, [events]);

  if (!ready || !user) {
    return <div className="mx-auto max-w-6xl px-4 py-12 text-ink/50">…</div>;
  }

  const locale = lang === "bg" ? "bg-BG" : "en-GB";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("weekTitle", lang)}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-ink/60">
            <span>
              {user.name}
              {user.department ? ` · ${user.department}` : ""}
              {user.year ? ` · ${lang === "bg" ? "курс" : "year"} ${user.year}` : ""}
            </span>
            <PersonTypeBadge
              role={user.role}
              studentCycle={user.studentCycle}
              formOfStudy={user.formOfStudy}
              lecturerKind={user.lecturerKind}
              lang={lang}
            />
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-secondary !px-2.5 !py-1.5 text-xs"
            onClick={() => {
              const n = new Date(weekStart);
              n.setDate(n.getDate() - 7);
              setWeekStart(n);
            }}
          >
            ←
          </button>
          <button
            type="button"
            className="btn-secondary !px-2.5 !py-1.5 text-xs"
            onClick={() => setWeekStart(mondayOf(new Date()))}
          >
            {lang === "bg" ? "Днес" : "Today"}
          </button>
          <button
            type="button"
            className="btn-secondary !px-2.5 !py-1.5 text-xs"
            onClick={() => {
              const n = new Date(weekStart);
              n.setDate(n.getDate() + 7);
              setWeekStart(n);
            }}
          >
            →
          </button>
          <Link href="/inbox" className="btn-secondary text-sm">
            {t("navInbox", lang)}
          </Link>
        </div>
      </div>

      {highlight && (
        <p className="mt-4 rounded-lg border border-burgundy/25 bg-burgundy/5 px-3 py-2 text-xs text-burgundy">
          {lang === "bg"
            ? "Маркирано събитие от справочника / календара ФКНФ."
            : "Highlighted event from the handbook / FCML calendar."}
        </p>
      )}

      <RoleHomeCards user={user} lang={lang} />

      <div className="mt-6">
        <CalendarLegend lang={lang} />
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-7">
        {days.map((d) => {
          const key = startOfDay(d).toISOString();
          const dayEvents = byDay.get(key) || [];
          const today = startOfDay(d).getTime() === startOfDay(new Date()).getTime();
          return (
            <div key={key} className={`paper-card min-h-[12rem] p-3 ${today ? "ring-2 ring-gold/40" : ""}`}>
              <div className={`text-[11px] font-semibold uppercase tracking-wide ${today ? "text-burgundy" : "text-ink/45"}`}>
                {d.toLocaleDateString(locale, { weekday: "short", day: "numeric" })}
              </div>
              <ul className="mt-2 space-y-1.5">
                {dayEvents.map((ev) => {
                  const tone = calendarTone(ev.kind);
                  const isHi = highlight && ev.id === highlight;
                  const inner = (
                    <div
                      className={`rounded-lg border px-2 py-1.5 ${calendarToneClass(tone)} ${
                        isHi ? "ring-2 ring-offset-1 ring-gold ring-offset-cream dark:ring-offset-night" : ""
                      }`}
                    >
                      <div className="text-[10px] opacity-80">
                        {tone === "holiday"
                          ? calendarToneLabel(tone, lang)
                          : new Date(ev.when).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
                        {ev.room ? ` · ${ev.room}` : ""}
                      </div>
                      <div className="text-[12px] font-medium leading-snug">{lang === "bg" ? ev.titleBg : ev.titleEn}</div>
                    </div>
                  );
                  return (
                    <li key={ev.id} id={ev.id}>
                      {ev.href ? (
                        <Link href={ev.href} className="block hover:opacity-90">
                          {inner}
                        </Link>
                      ) : (
                        inner
                      )}
                    </li>
                  );
                })}
                {dayEvents.length === 0 && <li className="text-[11px] text-ink/35">—</li>}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function WeekPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-12 text-ink/50">…</div>}>
      <WeekInner />
    </Suspense>
  );
}
