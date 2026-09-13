"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";
import { formatSlots, formOfStudyLabel, typeLabel, type OfferingDTO } from "@/lib/academicUi";
import { PersonTypeBadge } from "@/components/PersonTypeBadge";

export default function CoursesPage() {
  const { lang, user, ready } = useApp();
  const router = useRouter();
  const [offerings, setOfferings] = useState<OfferingDTO[]>([]);
  const [formFilter, setFormFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    fetch("/api/academic/courses")
      .then((r) => r.json())
      .then((d) => setOfferings(d.offerings || []));
  }, [ready, user, router]);

  if (!ready || !user) return <div className="mx-auto max-w-6xl px-4 py-12 text-ink/50">…</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">{t("navCourses", lang)}</h1>
      <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink/55">
        <span>
          {user.role === "student"
            ? lang === "bg"
              ? "Записани занятия за текущия семестър. Отвори учебната програма."
              : "Enrolled offerings this term. Open the syllabus."
            : lang === "bg"
              ? "Занятия, към които си титуляр или асистент."
              : "Offerings where you are titular or assistant."}
        </span>
        <PersonTypeBadge
          role={user.role}
          studentCycle={user.studentCycle}
          formOfStudy={user.formOfStudy}
          lecturerKind={user.lecturerKind}
          lang={lang}
        />
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {["all", "full-time", "part-time"].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFormFilter(f)}
            className={`rounded-full px-3 py-1 text-xs ${
              formFilter === f ? "bg-burgundy text-ivory" : "bg-ink/5 text-ink/70"
            }`}
          >
            {f === "all" ? (lang === "bg" ? "Всички форми" : "All forms") : formOfStudyLabel(f, lang)}
          </button>
        ))}
        {["all", "C", "E", "O"].map((ty) => (
          <button
            key={ty}
            type="button"
            onClick={() => setTypeFilter(ty)}
            className={`rounded-full px-3 py-1 text-xs ${
              typeFilter === ty ? "bg-plum/15 text-burgundy" : "bg-ink/5 text-ink/70"
            }`}
          >
            {ty === "all" ? (lang === "bg" ? "З / И / Ф" : "C / E / O") : typeLabel(ty, lang)}
          </button>
        ))}
      </div>

      <ul className="mt-8 space-y-3">
        {offerings
          .filter((o) => (formFilter === "all" ? true : o.formOfStudy === formFilter))
          .filter((o) => (typeFilter === "all" ? true : o.course.type === typeFilter))
          .map((o) => (
          <li key={o.id}>
            <Link href={`/courses/${o.id}`} className="paper-card block px-5 py-4 transition hover:bg-cream/40">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="font-mono text-sm font-bold text-burgundy">{o.course.code}</div>
                <span className="rounded-full bg-sage/10 px-2 py-0.5 text-[11px] font-medium text-sage">
                  {typeLabel(o.course.type, lang)} · {o.course.ects} ECTS
                </span>
              </div>
              <div className="mt-1 font-medium">{lang === "bg" ? o.course.titleBg : o.course.titleEn}</div>
              <div className="mt-1 text-xs text-ink/55">
                {o.lecturer?.name || "—"}
                {o.assistant ? ` · ${o.assistant.name}` : ""}
                {" · "}
                {formatSlots(o.slots, lang)}
              </div>
            </Link>
          </li>
        ))}
        {offerings.length === 0 && (
          <li className="paper-card p-8 text-center text-ink/55">
            {lang === "bg" ? "Няма записани курсове." : "No enrolled courses."}
          </li>
        )}
      </ul>
    </div>
  );
}
