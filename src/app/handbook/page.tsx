"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";

type Entry = {
  slug: string;
  titleBg: string;
  titleEn: string;
  summaryBg: string;
  summaryEn: string;
  kind: string;
  driveFileId: string | null;
  path: string | null;
};

export default function HandbookPage() {
  const { lang, user, ready } = useApp();
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    fetch("/api/handbook")
      .then((r) => r.json())
      .then((d) => setEntries(d.entries || []));
  }, [ready, user, router]);

  if (!ready || !user) return <div className="mx-auto max-w-6xl px-4 py-12">…</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">{t("handbookTitle", lang)}</h1>
      <div className="paper-card mt-8 space-y-4 p-6 text-sm leading-relaxed text-ink/80">
        <p>
          {lang === "bg"
            ? "Този портал допълва СУСИ, elearn и Архимед. Официалните бланки остават непроменени — уеб UI ги попълва. Каталозите по-долу не са форми, а справочник."
            : "This portal complements SUSI, elearn and Arhimed. Official blanks stay unchanged — the web UI fills them. The items below are knowledge, not forms."}
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            {lang === "bg"
              ? "Роли виждат само процеси, за които имат право (default deny)."
              : "Roles only see processes they are allowed to start (default deny)."}
          </li>
          <li>
            <Link href="/cases/new" className="text-burgundy underline">
              /cases/new
            </Link>{" "}
            — {lang === "bg" ? "пълен каталог преписки." : "full process catalog."}
          </li>
          <li>
            <Link href="/forms" className="text-burgundy underline">
              /forms
            </Link>{" "}
            — {lang === "bg" ? "наследени демо форми." : "legacy demo forms."}
          </li>
        </ul>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link href="/handbook/student-enrolment-fees" className="paper-card p-4 text-sm hover:border-burgundy/30">
          <div className="text-[10px] uppercase text-ink/40">student</div>
          <div className="mt-1 font-semibold text-burgundy">{lang === "bg" ? "Записване и такси 2026/27" : "Enrolment & fees 2026/27"}</div>
        </Link>
        <Link href="/contacts" className="paper-card p-4 text-sm hover:border-burgundy/30">
          <div className="text-[10px] uppercase text-ink/40">contacts</div>
          <div className="mt-1 font-semibold text-burgundy">{lang === "bg" ? "Контакти" : "Contacts"}</div>
        </Link>
        <Link href="/handbook/fknf-calendar-2026-27" className="paper-card p-4 text-sm hover:border-burgundy/30">
          <div className="text-[10px] uppercase text-ink/40">calendar</div>
          <div className="mt-1 font-semibold text-burgundy">{lang === "bg" ? "Календар ФКНФ" : "FCML calendar"}</div>
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        {entries.map((e) => (
          <article key={e.slug} className="paper-card p-5">
            <div className="text-[10px] uppercase tracking-wide text-ink/40">{e.kind}</div>
            <h2 className="mt-1 font-display text-lg font-semibold">
              <Link href={`/handbook/${e.slug}`} className="hover:text-burgundy">
                {lang === "bg" ? e.titleBg : e.titleEn}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-ink/70">{lang === "bg" ? e.summaryBg : e.summaryEn}</p>
            <Link href={`/handbook/${e.slug}`} className="mt-3 inline-block text-sm font-medium text-burgundy hover:underline">
              {lang === "bg" ? "Отвори →" : "Open →"}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
