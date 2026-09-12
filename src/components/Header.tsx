"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "./Providers";
import { ThemeToggle } from "./ThemeToggle";
import { t } from "@/lib/i18n";
import { ROLES } from "@/lib/types";

export function Header() {
  const { lang, setLang, user, logout, ready } = useApp();
  const path = usePathname();
  const router = useRouter();

  const publicLinks = [
    { href: "/", label: t("navHome", lang) },
    { href: "/how-it-works", label: t("navHow", lang) },
    { href: "/disclaimer", label: t("navDisclaimer", lang) },
  ];

  const authLinks = [
    { href: "/week", label: t("navWeek", lang) },
    { href: "/inbox", label: t("navInbox", lang) },
    { href: "/cases/new", label: t("navNewCase", lang) },
    { href: "/cases", label: t("navCases", lang) },
    { href: "/reports", label: t("navReports", lang) },
    { href: "/handbook", label: t("navHandbook", lang) },
  ];

  const links = user ? authLinks : publicLinks;

  const roleLabel = user
    ? ROLES.find((r) => r.id === user.role)?.[lang === "bg" ? "labelBg" : "labelEn"]
    : null;

  async function onLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href={user ? "/week" : "/"} className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-burgundy text-sm font-bold text-ivory shadow-sm">
            СУ*
          </span>
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
            <span className="hidden rounded-full border border-ink/10 bg-surface px-2.5 py-1 text-xs text-ink/70 sm:inline">
              {roleLabel}
              {user?.facultyCode ? ` · ${user.facultyCode}` : ""}
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
          <div className="flex overflow-hidden rounded-lg border border-ink/15 bg-surface text-xs font-medium">
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
