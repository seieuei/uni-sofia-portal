"use client";

import Link from "next/link";
import type { ContactPerson } from "@/content/contacts/central";
import type { Lang } from "@/lib/types";

export function ContactCard({
  person,
  lang,
  highlight,
}: {
  person: ContactPerson;
  lang: Lang;
  highlight?: boolean;
}) {
  return (
    <article
      className={`paper-card p-4 ${highlight ? "border-burgundy/30 ring-1 ring-burgundy/20 dark:border-gold/30 dark:ring-gold/20" : ""}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-burgundy/80 dark:text-gold/80">
        {lang === "bg" ? person.roleBg : person.roleEn}
      </p>
      <h3 className="mt-1 font-display text-base font-semibold text-ink">{person.name}</h3>
      <ul className="mt-2 space-y-1 text-sm text-ink/70">
        {person.room && (
          <li>
            {lang === "bg" ? "Стая" : "Room"}{" "}
            <Link href={`/map?q=${encodeURIComponent(person.room)}`} className="text-burgundy hover:underline">
              {person.room}
            </Link>
          </li>
        )}
        {person.phones?.map((ph) => (
          <li key={ph}>
            {lang === "bg" ? "тел." : "tel."} {ph}
          </li>
        ))}
        {person.email && (
          <li>
            <a className="text-burgundy hover:underline" href={`mailto:${person.email}`}>
              {person.email}
            </a>
          </li>
        )}
        {(person.hoursBg || person.hoursEn) && (
          <li className="text-ink/55">
            {lang === "bg" ? "Приемно време:" : "Office hours:"} {lang === "bg" ? person.hoursBg : person.hoursEn}
          </li>
        )}
      </ul>
    </article>
  );
}
