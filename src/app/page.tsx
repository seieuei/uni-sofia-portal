"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { Logo } from "@/components/Logo";
import { RoleMark } from "@/components/RoleMark";
import { t } from "@/lib/i18n";

const pains = ["pain1", "pain2", "pain3", "pain4"] as const;

const ROLE_CARDS = [
  {
    id: "student",
    kind: "student" as const,
    title: "roleStudent" as const,
    hint: "roleStudentHint" as const,
    href: "/login?role=student",
    visitor: false,
  },
  {
    id: "admin",
    kind: "admin" as const,
    title: "roleAdmin" as const,
    hint: "roleAdminHint" as const,
    href: "/login?role=program_admin",
    visitor: false,
  },
  {
    id: "faculty",
    kind: "faculty" as const,
    title: "roleFacultyAdmin" as const,
    hint: "roleFacultyAdminHint" as const,
    href: "/login?role=faculty_admin",
    visitor: false,
  },
  {
    id: "lecturer",
    kind: "lecturer" as const,
    title: "roleLecturer" as const,
    hint: "roleLecturerHint" as const,
    href: "/login?role=lecturer",
    visitor: false,
  },
  {
    id: "visitor",
    kind: "visitor" as const,
    title: "roleVisitor" as const,
    hint: "roleVisitorHint" as const,
    href: "/about",
    visitor: true,
  },
];

export default function LandingPage() {
  const { lang, user, enterVisitor } = useApp();
  const router = useRouter();

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <span className="stamp mb-4">{t("satireBadge", lang)} · Phase A</span>
              <h1 className="font-display mt-4 text-4xl font-bold leading-tight text-ink md:text-5xl">
                {t("landingHero", lang)}
              </h1>
              <p className="mt-5 max-w-xl text-lg text-ink/70">{t("landingSub", lang)}</p>
              <p className="mt-3 text-sm italic text-burgundy/80">{t("landingWitty", lang)}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {user ? (
                  <Link href="/week" className="btn-primary">
                    {t("ctaDashboard", lang)}
                  </Link>
                ) : (
                  <Link href="/login" className="btn-primary">
                    {t("ctaStart", lang)}
                  </Link>
                )}
                <Link href="/how-it-works" className="btn-secondary">
                  {t("ctaHow", lang)}
                </Link>
                <Link href="/structure" className="btn-secondary">
                  {t("navStructure", lang)}
                </Link>
              </div>
              <p className="mt-4 text-sm text-ink/50">{t("tagline", lang)}</p>
            </div>
            <Logo lang={lang} variant="wordmark" className="h-24 w-auto max-w-full rounded-xl shadow-md md:h-28" />
          </div>

          <div className="callout mt-8 px-4 py-3 text-sm">
            {lang === "bg" ? (
              <>
                <strong>Дисклеймър:</strong> Не е официален сайт на СУ. Демо акаунти с парола{" "}
                <code className="rounded bg-surface px-1">demo1234</code>. Допълва СУСИ / elearn / Архимед — не ги
                замества.
              </>
            ) : (
              <>
                <strong>Disclaimer:</strong> Not an official SU site. Demo accounts password{" "}
                <code className="rounded bg-surface px-1">demo1234</code>. Complements SUSI / elearn / Arhimed — does
                not replace them.
              </>
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-paper/60 py-14 dark:border-gold/15">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-2xl font-semibold md:text-3xl">{t("enterAs", lang)}</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink/60">{t("visitorOnlyInfo", lang)}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {ROLE_CARDS.map((card) => {
              const inner = (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-burgundy shadow-sm">
                    <RoleMark kind={card.kind} />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{t(card.title, lang)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{t(card.hint, lang)}</p>
                </>
              );
              if (card.visitor) {
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => {
                      enterVisitor();
                      router.push(card.href);
                    }}
                    className="paper-card p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {inner}
                  </button>
                );
              }
              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className="paper-card p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-2xl font-semibold md:text-3xl">{t("painTitle", lang)}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pains.map((p) => (
              <article key={p} className="paper-card p-5">
                <div className="mb-3 text-2xl">
                  {p === "pain1" ? "📄" : p === "pain2" ? "🧭" : p === "pain3" ? "🏛️" : "📥"}
                </div>
                <h3 className="font-semibold text-ink">{t(`${p}t` as "pain1t", lang)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{t(`${p}d` as "pain1d", lang)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-paper/40 py-14 dark:border-gold/15">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-2xl font-semibold md:text-3xl">{t("howTitle", lang)}</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {(["how1", "how2", "how3", "how4"] as const).map((k, i) => (
              <li key={k} className="paper-card flex gap-3 p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-burgundy text-sm font-bold text-ivory">
                  {i + 1}
                </span>
                <span className="text-sm font-medium leading-snug">{t(k, lang)}</span>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/login" className="btn-primary">
              {t("ctaStart", lang)}
            </Link>
            <Link href="/journey" className="btn-secondary">
              {t("navJourney", lang)}
            </Link>
            <Link href="/about" className="btn-secondary">
              {t("navAbout", lang)}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
