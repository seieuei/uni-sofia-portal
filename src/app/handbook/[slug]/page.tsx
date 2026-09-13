"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { STUDENT_ENROLMENT_FEES } from "@/content/handbook/student-fees";
import { CENTRAL_ADMIN_CONTACTS, FCML_VICE_DEANS } from "@/content/contacts/central";
import { ContactCard } from "@/components/ContactCard";
import { FKNF_FACULTY_EVENTS } from "@/content/calendar/fknf-2026-27";
import { calendarTone, calendarToneClass } from "@/lib/calendar";

type Entry = {
  slug: string;
  titleBg: string;
  titleEn: string;
  summaryBg: string;
  summaryEn: string;
  kind: string;
};

export default function HandbookSlugPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang, user, ready } = useApp();
  const router = useRouter();
  const [entry, setEntry] = useState<Entry | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    fetch("/api/handbook")
      .then((r) => r.json())
      .then((d) => {
        const found = (d.entries || []).find((e: Entry) => e.slug === slug);
        setEntry(found || null);
      });
  }, [ready, user, router, slug]);

  if (!ready || !user) return <div className="mx-auto max-w-6xl px-4 py-12">…</div>;

  const title = entry ? (lang === "bg" ? entry.titleBg : entry.titleEn) : slug;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/handbook" className="text-sm font-medium text-burgundy hover:underline">
        ← {lang === "bg" ? "Справочник" : "Handbook"}
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold">{title}</h1>
      {entry && <p className="mt-2 text-sm text-ink/60">{lang === "bg" ? entry.summaryBg : entry.summaryEn}</p>}

      {slug === "student-enrolment-fees" && (
        <div className="mt-8 space-y-4">
          {STUDENT_ENROLMENT_FEES.map((b) => (
            <article key={b.titleBg} className="paper-card p-5">
              <h2 className="font-display text-lg font-semibold">{lang === "bg" ? b.titleBg : b.titleEn}</h2>
              {(lang === "bg" ? b.bodyBg : b.bodyEn).map((p) => (
                <p key={p} className="mt-2 text-sm leading-relaxed text-ink/75">
                  {p}
                </p>
              ))}
            </article>
          ))}
          <div className="paper-card border-burgundy/20 bg-burgundy/5 p-5 dark:bg-gold/5">
            <p className="font-mono text-sm font-semibold tracking-wide">IBAN BG52BNBG96613100174301</p>
            <p className="mt-1 text-xs text-ink/55">BIC BNBGBGSD · {lang === "bg" ? "БНБ — централно управление" : "BNB — head office"}</p>
          </div>
        </div>
      )}

      {slug === "central-admin-contacts" && (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {CENTRAL_ADMIN_CONTACTS.map((c) => (
            <ContactCard key={c.roleBg} person={c} lang={lang} />
          ))}
          <Link href="/contacts" className="sm:col-span-2 text-sm text-burgundy hover:underline">
            {lang === "bg" ? "Пълна страница Контакти →" : "Full Contacts page →"}
          </Link>
        </div>
      )}

      {slug === "fknf-calendar-2026-27" && (
        <ul className="mt-8 space-y-2">
          {FKNF_FACULTY_EVENTS.map((ev, i) => {
            const tone = calendarTone(ev.kind);
            return (
              <li key={i} className={`rounded-xl border px-3 py-2 text-sm ${calendarToneClass(tone)}`}>
                <span className="font-medium">{lang === "bg" ? ev.titleBg : ev.titleEn}</span>
                <span className="mt-0.5 block text-xs opacity-90">
                  {new Date(ev.when).toLocaleString(lang === "bg" ? "bg-BG" : "en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                  {ev.room ? ` · ${ev.room}` : ""}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {!["student-enrolment-fees", "central-admin-contacts", "fknf-calendar-2026-27"].includes(slug) && (
        <div className="paper-card mt-8 p-5 text-sm text-ink/70">
          {lang === "bg"
            ? "Няма разгънат съдържателен изглед за този запис — виж списъка в справочника."
            : "No expanded content view for this entry — see the handbook list."}
          {slug.includes("vice") || slug === "fknf-vice-deans" ? (
            <div className="mt-4 grid gap-3">
              {FCML_VICE_DEANS.map((c) => (
                <ContactCard key={c.roleBg} person={c} lang={lang} />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
