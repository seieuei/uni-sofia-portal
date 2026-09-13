import Link from "next/link";
import { PersonTypeBadge } from "./PersonTypeBadge";
import type { SessionUser, Lang } from "@/lib/types";

function cardsFor(user: SessionUser, lang: Lang): { href: string; title: string; hint: string }[] {
  const cycle = user.studentCycle || "ba";
  const form = user.formOfStudy || "full-time";
  const lecturer = user.lecturerKind || "staff";

  if (user.role === "student") {
    const common = [
      { href: "/courses", title: lang === "bg" ? "Курсове" : "Courses", hint: lang === "bg" ? "Записани занятия" : "Enrolled offerings" },
      { href: "/curriculum", title: lang === "bg" ? "Учебен план" : "Curriculum", hint: lang === "bg" ? "УчПлан на програмата" : "Programme UchPlan" },
      { href: "/faculties/fcml", title: lang === "bg" ? "Хъб на факултета" : "Faculty hub", hint: user.facultyCode === "FFIL" ? "PHLS" : "ФКНФ / FCML" },
    ];
    if (cycle === "ba" && form === "part-time") {
      return [
        { href: "/week", title: lang === "bg" ? "Сесии задочно" : "Part-time sessions", hint: lang === "bg" ? "Задочното следва друг ритъм — следи деканата." : "Part-time follows another rhythm — watch the dean's office." },
        ...common,
        { href: "/electives", title: lang === "bg" ? "Избираеми" : "Electives", hint: lang === "bg" ? "Прозорец за избор" : "Choice window" },
      ];
    }
    if (cycle === "ma") {
      return [
        { href: "/admissions/masters", title: lang === "bg" ? "Магистърски правила" : "Master's rules", hint: lang === "bg" ? "Отделен прием и процедури" : "Separate admissions and procedures" },
        ...common,
        { href: "/faculties/phls/admissions", title: lang === "bg" ? "МП на ФФ" : "PHLS MA", hint: lang === "bg" ? "Ако си във Философски" : "If you are at Philosophy" },
      ];
    }
    if (cycle === "phd") {
      return [
        { href: "/faculties/fcml/doctoral", title: lang === "bg" ? "Докторантски процедури" : "Doctoral procedures", hint: lang === "bg" ? "Срокове и бланки" : "Deadlines and blanks" },
        { href: "/cases/new", title: lang === "bg" ? "Докторантура — каталог" : "Doctoral catalogue", hint: lang === "bg" ? "Хъб 4.x" : "Hub 4.x" },
        ...common,
      ];
    }
    return [
      ...common,
      { href: "/electives", title: lang === "bg" ? "Избираеми" : "Electives", hint: lang === "bg" ? "Прозорец за избор" : "Choice window" },
      { href: "/journey", title: lang === "bg" ? "Пътека" : "Journey", hint: lang === "bg" ? "Как се става студент" : "Becoming a student" },
    ];
  }

  if (user.role === "lecturer") {
    const base = [
      { href: "/courses", title: lang === "bg" ? "Моите занятия" : "My offerings", hint: lang === "bg" ? "Титуляр / асистент" : "Titular / assistant" },
      { href: "/report", title: lang === "bg" ? "Отчет" : "Report", hint: lang === "bg" ? "Индивидуален отчет" : "Individual report" },
      { href: "/inbox", title: lang === "bg" ? "Потвърждения" : "Confirmations", hint: lang === "bg" ? "Часове и преписки" : "Hours and cases" },
    ];
    if (lecturer === "honorary") {
      return [
        { href: "/cases/new/load-pay-5-2", title: lang === "bg" ? "Натовареност 5.2" : "Load 5.2", hint: lang === "bg" ? "Хонорари — потвърди часовете" : "Honoraria — confirm hours" },
        ...base,
      ];
    }
    return [
      { href: "/curriculum", title: lang === "bg" ? "УчПлан" : "UchPlan", hint: lang === "bg" ? "Програмен план" : "Programme plan" },
      ...base,
    ];
  }

  return [
    { href: "/cases/new", title: lang === "bg" ? "Нова преписка" : "New case", hint: lang === "bg" ? "Каталог процеси" : "Process catalogue" },
    { href: "/handbook", title: lang === "bg" ? "Справочник" : "Handbook", hint: lang === "bg" ? "Не-форми" : "Non-forms" },
    { href: "/structure", title: lang === "bg" ? "Структура" : "Structure", hint: lang === "bg" ? "Интерактивна карта" : "Interactive map" },
  ];
}

export function RoleHomeCards({ user, lang }: { user: SessionUser; lang: Lang }) {
  const items = cardsFor(user, lang);
  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-display text-xl font-semibold">{lang === "bg" ? "За твоя профил" : "For your profile"}</h2>
        <PersonTypeBadge
          role={user.role}
          studentCycle={user.studentCycle}
          formOfStudy={user.formOfStudy}
          lecturerKind={user.lecturerKind}
          lang={lang}
        />
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <li key={c.href + c.title}>
            <Link href={c.href} className="paper-card block p-4 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="font-medium">{c.title}</div>
              <p className="mt-1 text-sm text-ink/60">{c.hint}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
