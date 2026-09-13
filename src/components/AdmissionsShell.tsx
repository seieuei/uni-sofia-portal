"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useApp } from "./Providers";
import { ADMISSIONS_NAV } from "@/content/admissions/guide";
import { SPECIALTIES, searchSpecialties } from "@/content/admissions/specialties";
import { SU_FACULTIES } from "@/lib/structure";
import { t } from "@/lib/i18n";

export function AdmissionsShell({ children }: { children: React.ReactNode }) {
  const { lang } = useApp();
  const path = usePathname();
  const [q, setQ] = useState("");
  const hits = useMemo(() => (q.trim() ? searchSpecialties(q).slice(0, 8) : []), [q]);

  const crumbs = useMemo(() => {
    const items: { href: string; label: string }[] = [{ href: "/admissions", label: t("navAdmissions", lang) }];
    const nav = ADMISSIONS_NAV.find((n) => n.href !== "/admissions" && (path === n.href || path.startsWith(`${n.href}/`)));
    if (nav) items.push({ href: nav.href, label: lang === "bg" ? nav.titleBg : nav.titleEn });
    if (path.startsWith("/admissions/specialties/")) {
      const slug = path.split("/").pop() || "";
      const spec = SPECIALTIES.find((s) => s.slug === slug);
      if (spec) items.push({ href: path, label: lang === "bg" ? spec.titleBg : spec.titleEn });
    }
    if (path.startsWith("/admissions/faculties/") && path !== "/admissions/faculties") {
      const code = path.split("/").pop() || "";
      const f = SU_FACULTIES.find((x) => x.id === code);
      if (f) items.push({ href: path, label: lang === "bg" ? f.labelBg : f.labelEn });
    }
    return items;
  }, [path, lang]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-xs text-ink/50">
        {crumbs.map((c, i) => (
          <span key={c.href} className="flex items-center gap-1">
            {i > 0 && <span>/</span>}
            <Link href={c.href} className={i === crumbs.length - 1 ? "font-medium text-ink" : "hover:text-burgundy"}>
              {c.label}
            </Link>
          </span>
        ))}
      </nav>

      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-[11px] font-bold uppercase tracking-wide text-ink/40">{t("admissionsToc", lang)}</h2>
          <ul className="mt-3 space-y-1">
            {ADMISSIONS_NAV.map((n) => {
              const active = path === n.href || (n.href !== "/admissions" && path.startsWith(n.href));
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className={`block rounded-lg px-3 py-2 text-sm ${
                      active ? "bg-burgundy/10 font-medium text-burgundy" : "text-ink/70 hover:bg-ink/5"
                    }`}
                  >
                    {lang === "bg" ? n.titleBg : n.titleEn}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6">
            <label className="label" htmlFor="adm-search">
              {t("admissionsSearch", lang)}
            </label>
            <input
              id="adm-search"
              className="field"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={lang === "bg" ? "Африканистика, психология…" : "African Studies, psychology…"}
            />
            {hits.length > 0 && (
              <ul className="mt-2 space-y-1">
                {hits.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/admissions/specialties/${s.slug}`} className="block rounded-lg px-2 py-1.5 text-sm hover:bg-ink/5">
                      {lang === "bg" ? s.titleBg : s.titleEn}
                      <span className="ml-1 text-[11px] text-ink/40">{s.facultyCode}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6">
            <div className="text-[11px] font-bold uppercase tracking-wide text-ink/40">{t("facultyChips", lang)}</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SU_FACULTIES.map((f) => (
                <Link
                  key={f.id}
                  href={`/admissions/faculties/${f.id}`}
                  className={`rounded-full border px-2.5 py-1 text-[11px] ${
                    f.highlight || f.id === "FFIL"
                      ? "border-gold/50 bg-gold/10 text-burgundy"
                      : "border-ink/15 text-ink/70 hover:border-plum/30"
                  }`}
                >
                  {f.id === "FFIL" ? (lang === "bg" ? "ФФ" : "PHLS") : f.id === "FCML" ? (lang === "bg" ? "ФКНФ" : "FCML") : f.id}
                </Link>
              ))}
            </div>
          </div>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
