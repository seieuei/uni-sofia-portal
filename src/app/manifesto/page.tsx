"use client";

import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";

export default function ManifestoPage() {
  const { lang } = useApp();

  const points =
    lang === "bg"
      ? [
          "Любим университет заслужава по-малко пинг-понг и повече яснота.",
          "Формите трябва да имат собственик — човек или офис, не легенда.",
          "Всеки факултет може да е уникален, но студентът не трябва да гадае кой сайт е „истинският“.",
          "Дигитално не означава „PDF в Outlook от 2014“.",
          "Сатирата е форма на грижа: смеем се, защото ни пука.",
          "Този портал е демо как може да изглежда по-здравословен поток: роля → форма → маршрут → билет → входящи.",
        ]
      : [
          "A beloved university deserves less ping-pong and more clarity.",
          "Forms need an owner — a person or office, not a legend.",
          "Faculties can be unique without forcing students to guess which site is „real“.",
          "Digital should not mean „a 2014 PDF in Outlook“.",
          "Satire is a form of care: we laugh because we care.",
          "This portal demos a healthier flow: role → form → route → ticket → inbox.",
        ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <span className="stamp">{t("satireBadge", lang)}</span>
      <h1 className="font-display mt-4 text-3xl font-bold">{t("manifestoTitle", lang)}</h1>
      <p className="mt-4 text-lg text-ink/70">
        {lang === "bg"
          ? "За Софийския университет „Св. Климент Охридски“ — с обич и с остроумие."
          : "For Sofia University „St. Kliment Ohridski“ — with affection and wit."}
      </p>
      <ol className="mt-8 space-y-4">
        {points.map((p, i) => (
          <li key={i} className="paper-card flex gap-4 p-5">
            <span className="font-display text-2xl font-bold text-burgundy/40">{i + 1}</span>
            <p className="text-ink/80">{p}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
