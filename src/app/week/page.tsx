"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";

type Ev = {
  id: string;
  titleBg: string;
  titleEn: string;
  when: string;
  kind: string;
  href?: string;
};

export default function WeekPage() {
  const { lang, user, ready } = useApp();
  const router = useRouter();
  const [events, setEvents] = useState<Ev[]>([]);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    fetch("/api/week")
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []));
  }, [ready, user, router]);

  if (!ready || !user) {
    return <div className="mx-auto max-w-6xl px-4 py-12 text-ink/50">…</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("weekTitle", lang)}</h1>
          <p className="mt-1 text-ink/60">
            {user.name}
            {user.department ? ` · ${user.department}` : ""}
            {user.year ? ` · ${lang === "bg" ? "курс" : "year"} ${user.year}` : ""}
          </p>
        </div>
        <Link href="/inbox" className="btn-secondary text-sm">
          {t("navInbox", lang)}
        </Link>
      </div>

      <ul className="mt-8 space-y-3">
        {events.map((ev) => {
          const inner = (
            <div className="paper-card flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-ink/45">{ev.kind}</div>
                <div className="font-medium">{lang === "bg" ? ev.titleBg : ev.titleEn}</div>
              </div>
              <div className="text-sm text-ink/60">
                {new Date(ev.when).toLocaleString(lang === "bg" ? "bg-BG" : "en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
          return (
            <li key={ev.id}>
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
        {events.length === 0 && (
          <li className="paper-card p-8 text-center text-ink/55">
            {lang === "bg" ? "Няма събития тази седмица." : "No events this week."}
          </li>
        )}
      </ul>
    </div>
  );
}
