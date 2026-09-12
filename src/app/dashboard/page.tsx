"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";
import { ROLES } from "@/lib/types";
import { isStaff } from "@/lib/persona";

type FormRow = {
  slug: string;
  titleBg: string;
  titleEn: string;
  descriptionBg: string;
  descriptionEn: string;
  category: string;
};

type Faculty = { code: string; nameBg: string; nameEn: string };

export default function DashboardPage() {
  const { lang, persona, ready } = useApp();
  const [forms, setForms] = useState<FormRow[]>([]);
  const [faculty, setFaculty] = useState<Faculty | null>(null);

  useEffect(() => {
    if (!persona) return;
    fetch(`/api/forms?role=${persona.role}`)
      .then((r) => r.json())
      .then((d) => setForms(d.forms || []));
    fetch("/api/faculties")
      .then((r) => r.json())
      .then((d) => {
        const f = (d.faculties || []).find((x: Faculty) => x.code === persona.facultyCode);
        setFaculty(f || null);
      });
  }, [persona]);

  if (!ready) return <div className="mx-auto max-w-6xl px-4 py-12 text-ink/50">…</div>;

  if (!persona) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-lg text-ink/70">{t("noPersona", lang)}</p>
        <Link href="/onboarding" className="btn-primary mt-6 inline-flex">
          {t("ctaStart", lang)}
        </Link>
      </div>
    );
  }

  const roleMeta = ROLES.find((r) => r.id === persona.role)!;
  const greeting = persona.name || (lang === "bg" ? roleMeta.labelBg : roleMeta.labelEn);

  const quick =
    persona.role === "student"
      ? [
          { href: "/forms/exam-resit", bg: "Поправителен изпит", en: "Exam resit" },
          { href: "/forms/transcript", bg: "Академична справка", en: "Transcript" },
          { href: "/forms/dorm-application", bg: "Общежитие", en: "Dormitory" },
        ]
      : persona.role === "applicant"
        ? [
            { href: "/forms/admission-docs", bg: "Документи за прием", en: "Admission docs" },
            { href: "/forms/transcript", bg: "Справка", en: "Transcript" },
          ]
        : [
            { href: "/forms/room-booking", bg: "Заявка за зала", en: "Room booking" },
            { href: "/forms/equipment-request", bg: "Техника", en: "Equipment" },
            { href: "/inbox", bg: "Входящи", en: "Inbox" },
          ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-ink/50">{t("dashboardTitle", lang)}</p>
          <h1 className="font-display text-3xl font-bold">
            {t("dashboardHello", lang)}, {greeting}
          </h1>
          <p className="mt-2 text-ink/65">
            {roleMeta.emoji} {lang === "bg" ? roleMeta.labelBg : roleMeta.labelEn}
            {" · "}
            {faculty ? (lang === "bg" ? faculty.nameBg : faculty.nameEn) : persona.facultyCode}
          </p>
        </div>
        <Link href="/onboarding" className="btn-secondary text-sm">
          {t("changePersona", lang)}
        </Link>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <section className="paper-card p-6 lg:col-span-2">
          <h2 className="font-display text-xl font-semibold">{t("relevantForms", lang)}</h2>
          <ul className="mt-4 divide-y divide-ink/10">
            {forms.slice(0, 6).map((f) => (
              <li key={f.slug} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <div className="font-medium">{lang === "bg" ? f.titleBg : f.titleEn}</div>
                  <div className="text-xs text-ink/50">{f.category}</div>
                </div>
                <Link href={`/forms/${f.slug}`} className="btn-primary !py-1.5 !text-xs">
                  {t("fillForm", lang)}
                </Link>
              </li>
            ))}
            {forms.length === 0 && (
              <li className="py-4 text-sm text-ink/50">{lang === "bg" ? "Няма форми за тази роля." : "No forms for this role."}</li>
            )}
          </ul>
          <Link href="/forms" className="mt-4 inline-block text-sm font-medium text-burgundy underline-offset-2 hover:underline">
            {t("ctaForms", lang)} →
          </Link>
        </section>

        <section className="space-y-6">
          <div className="paper-card p-6">
            <h2 className="font-display text-lg font-semibold">{t("quickLinks", lang)}</h2>
            <ul className="mt-3 space-y-2">
              {quick.map((q) => (
                <li key={q.href}>
                  <Link href={q.href} className="block rounded-lg bg-cream px-3 py-2 text-sm hover:bg-burgundy/5">
                    {lang === "bg" ? q.bg : q.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {isStaff(persona.role) && (
            <div className="paper-card border-burgundy/20 p-6">
              <h2 className="font-display text-lg font-semibold">{t("inboxTitle", lang)}</h2>
              <p className="mt-2 text-sm text-ink/60">
                {lang === "bg"
                  ? "Виж подадените билети от студенти и кандидати."
                  : "See tickets submitted by students and applicants."}
              </p>
              <Link href="/inbox" className="btn-primary mt-4 !text-xs">
                {t("viewInbox", lang)}
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
