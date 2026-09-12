"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "./Providers";
import type { CalendarEvent } from "@/lib/academicUi";

type View = "week" | "month";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function mondayOf(d: Date) {
  const start = startOfDay(d);
  const day = start.getDay();
  start.setDate(start.getDate() + (day === 0 ? -6 : 1 - day));
  return start;
}

export function SideCalendar() {
  const { lang } = useApp();
  const [view, setView] = useState<View>("week");
  const [ref, setRef] = useState(() => new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const q = new URLSearchParams({ view, ref: ref.toISOString() });
    fetch(`/api/week?${q}`)
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []))
      .catch(() => setEvents([]));
  }, [view, ref]);

  const locale = lang === "bg" ? "bg-BG" : "en-GB";

  function shift(dir: number) {
    const next = new Date(ref);
    if (view === "month") next.setMonth(next.getMonth() + dir);
    else next.setDate(next.getDate() + dir * 7);
    setRef(next);
  }

  const monthCells = useMemo(() => {
    const first = new Date(ref.getFullYear(), ref.getMonth(), 1);
    const gridStart = mondayOf(first);
    const cells: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      cells.push(d);
    }
    return cells;
  }, [ref]);

  const weekDays = useMemo(() => {
    const mon = mondayOf(ref);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(mon);
      d.setDate(mon.getDate() + i);
      return d;
    });
  }, [ref]);

  const byDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const key = startOfDay(new Date(ev.when)).toISOString();
      const list = map.get(key) || [];
      list.push(ev);
      map.set(key, list);
    }
    return map;
  }, [events]);

  const heading =
    view === "month"
      ? ref.toLocaleDateString(locale, { month: "long", year: "numeric" })
      : `${weekDays[0].toLocaleDateString(locale, { day: "numeric", month: "short" })} – ${weekDays[6].toLocaleDateString(locale, { day: "numeric", month: "short" })}`;

  return (
    <section className="paper-card p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-sm font-semibold">
          {lang === "bg" ? "Календар" : "Calendar"}
        </h2>
        <div className="flex overflow-hidden rounded-lg border border-ink/15 text-[11px] font-medium">
          <button
            type="button"
            onClick={() => setView("week")}
            className={`px-2 py-1 ${view === "week" ? "bg-burgundy text-cream" : "text-ink/60 hover:bg-ink/5"}`}
          >
            {lang === "bg" ? "Седм." : "Week"}
          </button>
          <button
            type="button"
            onClick={() => setView("month")}
            className={`px-2 py-1 ${view === "month" ? "bg-burgundy text-cream" : "text-ink/60 hover:bg-ink/5"}`}
          >
            {lang === "bg" ? "Мес." : "Month"}
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <button type="button" className="rounded-md px-1.5 py-0.5 hover:bg-ink/5" onClick={() => shift(-1)}>
          ←
        </button>
        <div className="font-medium capitalize text-ink/80">{heading}</div>
        <button type="button" className="rounded-md px-1.5 py-0.5 hover:bg-ink/5" onClick={() => shift(1)}>
          →
        </button>
      </div>

      {view === "month" ? (
        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px]">
          {(lang === "bg" ? ["п", "в", "с", "ч", "п", "с", "н"] : ["M", "T", "W", "T", "F", "S", "S"]).map((d, i) => (
            <div key={`${d}-${i}`} className="text-ink/40">
              {d}
            </div>
          ))}
          {monthCells.map((d) => {
            const key = startOfDay(d).toISOString();
            const dayEvents = byDay.get(key) || [];
            const inMonth = d.getMonth() === ref.getMonth();
            const today = sameDay(d, new Date());
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setRef(d);
                  setView("week");
                }}
                className={`min-h-[2rem] rounded-md px-0.5 py-0.5 ${
                  today ? "bg-burgundy/15 text-burgundy" : inMonth ? "text-ink/80" : "text-ink/30"
                }`}
              >
                <div>{d.getDate()}</div>
                {dayEvents.length > 0 && (
                  <div className="mx-auto mt-0.5 h-1 w-1 rounded-full bg-burgundy" />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <ul className="mt-3 space-y-2">
          {weekDays.map((d) => {
            const key = startOfDay(d).toISOString();
            const dayEvents = byDay.get(key) || [];
            const today = sameDay(d, new Date());
            return (
              <li key={key}>
                <div className={`text-[10px] uppercase tracking-wide ${today ? "text-burgundy" : "text-ink/40"}`}>
                  {d.toLocaleDateString(locale, { weekday: "short", day: "numeric" })}
                </div>
                {dayEvents.length === 0 ? (
                  <div className="text-[11px] text-ink/35">—</div>
                ) : (
                  <ul className="mt-0.5 space-y-1">
                    {dayEvents.map((ev) => {
                      const inner = (
                        <div className="rounded-lg bg-ink/5 px-2 py-1">
                          <div className="text-[10px] text-ink/45">
                            {new Date(ev.when).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
                            {ev.room ? ` · ${ev.room}` : ""}
                          </div>
                          <div className="text-[12px] leading-snug">{lang === "bg" ? ev.titleBg : ev.titleEn}</div>
                        </div>
                      );
                      return (
                        <li key={ev.id}>
                          {ev.href ? (
                            <Link href={ev.href} className="block hover:opacity-80">
                              {inner}
                            </Link>
                          ) : (
                            inner
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <Link href="/week" className="mt-3 block text-center text-[11px] text-burgundy hover:underline">
        {lang === "bg" ? "Цялата седмица →" : "Full week →"}
      </Link>
    </section>
  );
}
