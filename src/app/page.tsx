"use client";

import Link from "next/link";
import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";

const pains = ["pain1", "pain2", "pain3", "pain4"] as const;

export default function LandingPage() {
  const { lang, user } = useApp();

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-center md:py-24">
          <div>
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
            </div>
            <p className="mt-4 text-sm text-ink/50">{t("tagline", lang)}</p>
            <div className="mt-6 rounded-xl border border-amber-700/20 bg-amber-50/80 px-4 py-3 text-sm text-ink/75">
              {lang === "bg" ? (
                <>
                  <strong>Дисклеймър:</strong> Не е официален сайт на СУ. Демо акаунти с парола{" "}
                  <code className="rounded bg-white px-1">demo1234</code>. Допълва СУСИ / elearn /
                  Архимед — не ги замества.
                </>
              ) : (
                <>
                  <strong>Disclaimer:</strong> Not an official SU site. Demo accounts password{" "}
                  <code className="rounded bg-white px-1">demo1234</code>. Complements SUSI / elearn /
                  Arhimed — does not replace them.
                </>
              )}
            </div>
          </div>

          <div className="paper-card relative p-6">
            <div className="absolute -right-2 -top-2 stamp bg-cream">
              {lang === "bg" ? "ФКНФ пилот" : "FCML pilot"}
            </div>
            <h2 className="font-display text-xl font-semibold">
              {lang === "bg" ? "Демо акаунти" : "Demo accounts"}
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                ["program.admin@demo.uni-sofia.local", "program_admin"],
                ["lecturer@demo.uni-sofia.local", "lecturer"],
                ["faculty.admin@demo.uni-sofia.local", "faculty_admin"],
                ["student@demo.uni-sofia.local", "student"],
              ].map(([email, role]) => (
                <li key={email} className="rounded-xl bg-cream/80 px-3 py-2">
                  <div className="font-mono text-xs text-burgundy">{email}</div>
                  <div className="text-ink/60">{role}</div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-ink/50">
              {lang === "bg"
                ? "Парола за всички: demo1234 · Африканистика / ФКНФ"
                : "Password for all: demo1234 · African Studies / FCML"}
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-paper/60 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-2xl font-semibold md:text-3xl">{t("painTitle", lang)}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pains.map((p) => (
              <article key={p} className="paper-card p-5">
                <div className="mb-3 text-2xl">
                  {p === "pain1" ? "📄" : p === "pain2" ? "🧭" : p === "pain3" ? "🏛️" : "📥"}
                </div>
                <h3 className="font-semibold text-ink">{t(`${p}t` as "pain1t", lang)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  {t(`${p}d` as "pain1d", lang)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-2xl font-semibold md:text-3xl">{t("howTitle", lang)}</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {(["how1", "how2", "how3", "how4"] as const).map((k, i) => (
              <li key={k} className="paper-card flex gap-3 p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-burgundy text-sm font-bold text-cream">
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
            <Link href="/forms" className="btn-secondary">
              {t("ctaForms", lang)}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
