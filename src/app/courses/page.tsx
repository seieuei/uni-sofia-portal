"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";
import { formatSlots, typeLabel, type OfferingDTO } from "@/lib/academicUi";

export default function CoursesPage() {
  const { lang, user, ready } = useApp();
  const router = useRouter();
  const [offerings, setOfferings] = useState<OfferingDTO[]>([]);

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
      <p className="mt-2 text-sm text-ink/55">
        {user.role === "student"
          ? lang === "bg"
            ? "Записани занятия за текущия семестър. Отвори учебната програма."
            : "Enrolled offerings this term. Open the syllabus."
          : lang === "bg"
            ? "Занятия, към които си титуляр или асистент."
            : "Offerings where you are titular or assistant."}
      </p>

      <ul className="mt-8 space-y-3">
        {offerings.map((o) => (
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
