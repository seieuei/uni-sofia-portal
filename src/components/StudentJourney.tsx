"use client";

import { useState } from "react";
import { STUDENT_JOURNEY } from "@/lib/journey";
import type { Lang } from "@/lib/types";

export function StudentJourney({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState<string>(STUDENT_JOURNEY[0].id);

  return (
    <div>
      <ol className="grid gap-3 md:grid-cols-5">
        {STUDENT_JOURNEY.map((step, i) => {
          const active = open === step.id;
          return (
            <li key={step.id} className="relative">
              {i < STUDENT_JOURNEY.length - 1 && (
                <span
                  className="pointer-events-none absolute left-[calc(50%+22px)] top-7 hidden h-px w-[calc(100%-44px)] bg-gold/50 md:block"
                  aria-hidden
                />
              )}
              <button
                type="button"
                onClick={() => setOpen(step.id)}
                className={`paper-card w-full p-4 text-left transition ${
                  active ? "ring-2 ring-gold/50" : "hover:bg-ink/[0.03]"
                }`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-burgundy text-sm font-bold text-ivory">
                  {i + 1}
                </span>
                <h3 className="font-display mt-3 text-base font-semibold leading-snug">
                  {step.titleBg}
                  {lang === "en" && (
                    <span className="mt-0.5 block text-sm font-normal text-ink/55">{step.titleEn}</span>
                  )}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink/65">
                  {lang === "bg" ? step.summaryBg : step.summaryEn}
                </p>
              </button>
            </li>
          );
        })}
      </ol>

      {STUDENT_JOURNEY.map((step) =>
        open === step.id ? (
          <div key={step.id} className="paper-card mt-6 p-6">
            <h4 className="font-display text-lg font-semibold">
              {lang === "bg" ? step.titleBg : `${step.titleBg} · ${step.titleEn}`}
            </h4>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink/75">
              {(lang === "bg" ? step.detailsBg : step.detailsEn).map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        ) : null
      )}
    </div>
  );
}
