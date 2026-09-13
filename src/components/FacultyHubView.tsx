"use client";

import Link from "next/link";
import { useApp } from "./Providers";
import type { FacultyHub, HubSection } from "@/content/faculties/hubs";
import { HUB_SECTION_ORDER } from "@/content/faculties/hubs";
import { ContactCard } from "@/components/ContactCard";
import { FCML_DEAN, FCML_VICE_DEANS } from "@/content/contacts/central";

export function FacultyHubView({ hub, section }: { hub: FacultyHub; section?: HubSection }) {
  const { lang } = useApp();
  const current = section?.slug || "home";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-xs text-ink/50">
        <Link href="/faculties" className="hover:text-burgundy">
          {lang === "bg" ? "Факултети" : "Faculties"}
        </Link>
        <span>/</span>
        <Link href={`/faculties/${hub.slug}`} className={current === "home" ? "font-medium text-ink" : "hover:text-burgundy"}>
          {hub.shortBg}
        </Link>
        {section && (
          <>
            <span>/</span>
            <span className="font-medium text-ink">{lang === "bg" ? section.titleBg : section.titleEn}</span>
          </>
        )}
      </nav>

      <header className="paper-card overflow-hidden">
        <div className="bg-burgundy px-6 py-8 text-ivory">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold">{hub.shortBg} · {hub.shortEn}</p>
          <h1 className="font-display mt-2 text-3xl font-bold md:text-4xl">
            {lang === "bg" ? hub.titleBg : hub.titleEn}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-ivory/80">{lang === "bg" ? hub.missionBg : hub.missionEn}</p>
        </div>
        <div className="flex flex-wrap gap-2 px-4 py-3">
          <Link
            href={`/faculties/${hub.slug}`}
            className={`rounded-full px-3 py-1 text-xs ${current === "home" ? "bg-burgundy text-ivory" : "bg-ink/5 text-ink/70"}`}
          >
            {lang === "bg" ? "Начало" : "Home"}
          </Link>
          {HUB_SECTION_ORDER.map((slug) => {
            const s = hub.sections.find((x) => x.slug === slug);
            if (!s) return null;
            return (
              <Link
                key={slug}
                href={`/faculties/${hub.slug}/${slug}`}
                className={`rounded-full px-3 py-1 text-xs ${
                  current === slug ? "bg-burgundy text-ivory" : "bg-ink/5 text-ink/70 hover:bg-ink/10"
                }`}
              >
                {lang === "bg" ? s.titleBg : s.titleEn}
              </Link>
            );
          })}
        </div>
      </header>

      {!section ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <section className="paper-card p-5">
              <h2 className="font-display text-xl font-semibold">{lang === "bg" ? "Новини и куки" : "News hooks"}</h2>
              <ul className="mt-3 space-y-2">
                {hub.news.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="text-sm text-burgundy hover:underline">
                      {lang === "bg" ? n.titleBg : n.titleEn} →
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
            <section className="paper-card p-5">
              <h2 className="font-display text-xl font-semibold">{lang === "bg" ? "Програми" : "Programmes"}</h2>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-[11px] uppercase text-ink/40">BA</div>
                  <ul className="mt-2 space-y-1 text-sm">
                    {hub.programsBa.map((p) => (
                      <li key={p.href}>
                        <Link href={p.href} className="hover:text-burgundy">
                          {lang === "bg" ? p.titleBg : p.titleEn}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[11px] uppercase text-ink/40">MA</div>
                  <ul className="mt-2 space-y-1 text-sm">
                    {hub.programsMa.map((p) => (
                      <li key={p.href}>
                        <Link href={p.href} className="hover:text-burgundy">
                          {lang === "bg" ? p.titleBg : p.titleEn}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
          <aside className="space-y-4">
            <section className="paper-card p-5">
              <h2 className="font-display text-lg font-semibold">{lang === "bg" ? "Контакти" : "Contacts"}</h2>
              <ul className="mt-2 space-y-1 text-sm text-ink/70">
                {(lang === "bg" ? hub.addressBg : hub.addressEn).map((a) => (
                  <li key={a}>{a}</li>
                ))}
                {hub.emails.map((e) => (
                  <li key={e.email}>
                    <span className="text-ink/45">{lang === "bg" ? e.labelBg : e.labelEn}: </span>
                    {e.email}
                  </li>
                ))}
              </ul>
              <a href={hub.officialUrl} className="mt-3 inline-block text-sm text-burgundy hover:underline" target="_blank" rel="noreferrer">
                {lang === "bg" ? "Официален сайт" : "Official site"} ↗
              </a>
            </section>
            <section className="paper-card p-5">
              <h2 className="font-display text-lg font-semibold">{lang === "bg" ? "Катедри" : "Departments"}</h2>
              <ul className="mt-2 space-y-1 text-sm text-ink/70">
                {hub.departments.map((d) => (
                  <li key={d.titleBg}>{lang === "bg" ? d.titleBg : d.titleEn}</li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      ) : (
        <article className="paper-card mt-8 p-6">
          <h2 className="font-display text-2xl font-semibold">{lang === "bg" ? section.titleBg : section.titleEn}</h2>
          <p className="mt-2 text-ink/70">{lang === "bg" ? section.leadBg : section.leadEn}</p>
          {(lang === "bg" ? section.bodyBg : section.bodyEn).map((p) => (
            <p key={p} className="mt-3 text-sm leading-relaxed text-ink/75">
              {p}
            </p>
          ))}
          {hub.slug === "fcml" && section.slug === "contacts" && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <ContactCard person={FCML_DEAN} lang={lang} highlight />
              {FCML_VICE_DEANS.map((c) => (
                <ContactCard key={c.roleBg} person={c} lang={lang} />
              ))}
            </div>
          )}
          {section.links && section.links.length > 0 && (
            <ul className="mt-5 space-y-2">
              {section.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-burgundy hover:underline"
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noreferrer" : undefined}
                  >
                    {lang === "bg" ? l.titleBg : l.titleEn} {l.external ? "↗" : "→"}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </article>
      )}
    </div>
  );
}
