"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "./Providers";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import { t } from "@/lib/i18n";
import { academicNav } from "@/lib/academicUi";
import { ROLES } from "@/lib/types";

export function Header() {
  const { lang, setLang, user, logout, ready, visitor } = useApp();
  const path = usePathname();
  const router = useRouter();

  const publicLinks = [
    { href: "/", label: t("navHome", lang) },
    { href: "/admissions", label: t("navAdmissions", lang) },
    { href: "/contacts", label: t("navContacts", lang) },
    { href: "/map", label: t("navMap", lang) },
    { href: "/handbook", label: t("navHandbook", lang) },
    { href: "/how-it-works", label: t("navHow", lang) },
    { href: "/disclaimer", label: t("navDisclaimer", lang) },
  ];

  const visitorLinks = [
    { href: "/", label: t("navHome", lang) },
    { href: "/about", label: t("navAbout", lang) },
    { href: "/admissions", label: t("navAdmissions", lang) },
    { href: "/faculties", label: t("navFaculties", lang) },
    { href: "/structure", label: t("navStructure", lang) },
    { href: "/contacts", label: t("navContacts", lang) },
    { href: "/map", label: t("navMap", lang) },
    { href: "/handbook", label: t("navHandbook", lang) },
    { href: "/journey", label: t("navJourney", lang) },
    { href: "/how-it-works", label: t("navHow", lang) },
    { href: "/manifesto", label: t("navManifesto", lang) },
    { href: "/disclaimer", label: t("navDisclaimer", lang) },
  ];

  const authLinks = user
    ? academicNav(user.role, {
        week: t("navWeek", lang),
        inbox: t("navInbox", lang),
        courses: t("navCourses", lang),
        electives: t("navElectives", lang),
        curriculum: t("navCurriculum", lang),
        report: t("navReport", lang),
        newCase: t("navNewCase", lang),
        cases: t("navCases", lang),
        reports: t("navReports", lang),
        handbook: t("navHandbook", lang),
        journey: t("navJourney", lang),
        structure: t("navStructure", lang),
        admissions: t("navAdmissions", lang),
        faculties: t("navFaculties", lang),
        map: t("navMap", lang),
        contacts: t("navContacts", lang),
      })
    : [];

  const links = user ? authLinks : visitor ? visitorLinks : publicLinks;

  const roleLabel = user
    ? ROLES.find((r) => r.id === user.role)?.[lang === "bg" ? "labelBg" : "labelEn"]
    : visitor
      ? t("visitorBadge", lang)
      : null;

  async function onLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur-md dark:border-gold/15">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href={user ? "/week" : "/"} className="group flex items-center gap-2">
          <Logo lang={lang} />
          <div className="leading-tight">
            <div className="font-display text-base font-semibold text-ink group-hover:text-burgundy">
              {t("siteName", lang)}
            </div>
            <div className="text-[11px] text-ink/55">{t("notOfficial", lang)}</div>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {links.map((l) => {
            const active = path === l.href || (l.href !== "/" && path.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-2.5 py-1.5 transition ${
                  active ? "bg-burgundy/10 font-medium text-burgundy" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {ready && roleLabel && (
            <span className="hidden rounded-full border border-ink/10 bg-surface px-2.5 py-1 text-xs text-ink/70 dark:border-gold/20 sm:inline">
              {roleLabel}
              {user?.facultyCode ? ` · ${user.facultyCode}` : ""}
              {user?.role === "student" && user.formOfStudy === "part-time"
                ? lang === "bg"
                  ? " · задочна"
                  : " · part-time"
                : ""}
              {user?.role === "student" && user.studentCycle && user.studentCycle !== "ba"
                ? ` · ${user.studentCycle.toUpperCase()}`
                : ""}
              {user?.role === "lecturer" && user.lecturerKind
                ? user.lecturerKind === "honorary"
                  ? lang === "bg"
                    ? " · хоноруван"
                    : " · honorary"
                  : lang === "bg"
                    ? " · щатен"
                    : " · staff"
                : ""}
            </span>
          )}
          {ready && user ? (
            <button type="button" onClick={onLogout} className="btn-secondary !px-2.5 !py-1.5 text-xs">
              {t("navLogout", lang)}
            </button>
          ) : ready ? (
            <Link href="/login" className="btn-primary !px-2.5 !py-1.5 text-xs">
              {t("navLogin", lang)}
            </Link>
          ) : null}
          <ThemeToggle />
          <div className="flex overflow-hidden rounded-lg border border-ink/15 bg-surface text-xs font-medium dark:border-gold/20">
            <button
              type="button"
              onClick={() => setLang("bg")}
              className={`px-2.5 py-1.5 ${lang === "bg" ? "bg-burgundy text-ivory" : "text-ink/60 hover:bg-ink/5"}`}
            >
              БГ
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-2.5 py-1.5 ${lang === "en" ? "bg-burgundy text-ivory" : "text-ink/60 hover:bg-ink/5"}`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
