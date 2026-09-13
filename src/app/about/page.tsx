"use client";

import Link from "next/link";
import { useApp } from "@/components/Providers";
import { Logo } from "@/components/Logo";
import { t } from "@/lib/i18n";

export default function AboutPage() {
  const { lang } = useApp();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Logo lang={lang} variant="wordmark" className="mb-8 h-20 w-auto rounded-xl shadow-sm" />
      <h1 className="font-display text-3xl font-bold">{t("aboutTitle", lang)}</h1>
      <p className="mt-4 text-lg text-ink/70">{t("aboutLead", lang)}</p>
      <div className="paper-card mt-8 space-y-4 p-6 text-sm leading-relaxed text-ink/80">
        {lang === "bg" ? (
          <>
            <p>
              Университетът се управлява от <strong>Общо събрание</strong>, <strong>Академичен съвет</strong> и{" "}
              <strong>Ректор</strong>. Към тях стоят контролни органи, Съвет на настоятелите и Студентски съвет.
              Заместник-ректорите покриват учебна дейност, наука, администрация и международни връзки.
            </p>
            <p>
              Централната администрация включва главен мениджър, секретар, финансист, счетоводител, юрисконсулт, отдел
              „Образователни дейности“, служба „Докторанти“ и деловодство.
            </p>
            <p>
              Има <strong>16 факултета</strong>. Пилотът на този портал е <strong>ФКНФ</strong> — Факултетът по
              класически и нови филологии, програма Африканистика.
            </p>
          </>
        ) : (
          <>
            <p>
              The university is governed by a <strong>General Assembly</strong>, an <strong>Academic Council</strong>{" "}
              and the <strong>Rector</strong>, plus control bodies, a Board of Trustees and a Student Council.
              Vice-rectors cover teaching, research, administration and international affairs.
            </p>
            <p>
              Central administration includes a chief manager, secretary, finance, accounting, legal counsel,
              Educational Activities, the Doctoral office and the registry.
            </p>
            <p>
              There are <strong>16 faculties</strong>. This portal’s pilot is <strong>FCML</strong> — Classical and
              Modern Philology, African Studies.
            </p>
          </>
        )}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/structure" className="btn-primary">
          {t("navStructure", lang)}
        </Link>
        <Link href="/faculties" className="btn-secondary">
          {t("navFaculties", lang)}
        </Link>
        <Link href="/journey" className="btn-secondary">
          {t("navJourney", lang)}
        </Link>
        <Link href="/manifesto" className="btn-secondary">
          {t("navManifesto", lang)}
        </Link>
      </div>
      <p className="callout mt-8 px-4 py-3 text-sm">{t("visitorOnlyInfo", lang)}</p>
    </div>
  );
}
