"use client";

import Link from "next/link";
import { useApp } from "@/components/Providers";
import { ContactCard } from "@/components/ContactCard";
import { CENTRAL_ADMIN_CONTACTS, FCML_DEAN, FCML_VICE_DEANS } from "@/content/contacts/central";
import { t } from "@/lib/i18n";

export default function ContactsPage() {
  const { lang } = useApp();
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-[11px] uppercase tracking-[0.18em] text-burgundy/70">{lang === "bg" ? "Контакти" : "Contacts"}</p>
      <h1 className="mt-2 font-display text-3xl font-bold">{t("contactsTitle", lang)}</h1>
      <p className="mt-3 max-w-2xl text-ink/70">{t("contactsLead", lang)}</p>

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <a href="#central" className="rounded-full bg-burgundy/10 px-3 py-1 text-burgundy hover:bg-burgundy/15">
          {lang === "bg" ? "Централна администрация" : "Central administration"}
        </a>
        <a href="#fcml" className="rounded-full bg-burgundy/10 px-3 py-1 text-burgundy hover:bg-burgundy/15">
          {lang === "bg" ? "ФКНФ — деканат" : "FCML — dean's office"}
        </a>
        <Link href="/faculties/fcml/contacts" className="rounded-full bg-ink/5 px-3 py-1 text-ink/70 hover:bg-ink/10">
          {lang === "bg" ? "Хъб ФКНФ →" : "FCML hub →"}
        </Link>
        <Link href="/structure" className="rounded-full bg-ink/5 px-3 py-1 text-ink/70 hover:bg-ink/10">
          {lang === "bg" ? "Структура →" : "Structure →"}
        </Link>
      </div>

      <section id="central" className="mt-10 scroll-mt-24">
        <h2 className="font-display text-xl font-semibold">
          {lang === "bg" ? "Централна университетска администрация" : "Central university administration"}
        </h2>
        <p className="mt-1 text-xs text-ink/45">
          {lang === "bg"
            ? "Снимка от официалната страница / central-admin.pdf. Пилот — не замества uni-sofia.bg."
            : "Snapshot from the official page / central-admin.pdf. Pilot — does not replace uni-sofia.bg."}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {CENTRAL_ADMIN_CONTACTS.map((c) => (
            <ContactCard key={c.roleBg + c.name} person={c} lang={lang} />
          ))}
        </div>
      </section>

      <section id="fcml" className="mt-12 scroll-mt-24">
        <h2 className="font-display text-xl font-semibold">
          {lang === "bg" ? "ФКНФ — декан и заместник-декани" : "FCML — dean and vice-deans"}
        </h2>
        <p className="mt-1 text-xs text-ink/45">
          {lang === "bg"
            ? "От fknf-vice-deans.pdf. Каб. 232, Ректорат."
            : "From fknf-vice-deans.pdf. Room 232, Rectorate."}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <ContactCard person={FCML_DEAN} lang={lang} highlight />
          {FCML_VICE_DEANS.map((c) => (
            <ContactCard key={c.roleBg} person={c} lang={lang} />
          ))}
        </div>
      </section>
    </div>
  );
}
