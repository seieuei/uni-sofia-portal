"use client";

import { recipientLabel, type RoutePhase, type RouteStepDef } from "@/lib/processRoute";
import type { Lang } from "@/lib/types";

export type TimelineStep = {
  id?: string;
  key: string;
  titleBg: string;
  titleEn: string;
  phase?: RoutePhase;
  recipients?: string[];
  noteBg?: string;
  noteEn?: string;
  status?: string;
  assignee?: { name: string } | null;
  virtual?: boolean;
};

const PHASE_LABEL: Record<RoutePhase, { bg: string; en: string }> = {
  approve: { bg: "Съгласуване", en: "Approval" },
  register: { bg: "Извеждане", en: "Outgoing register" },
  copies: { bg: "Копия след извеждане", en: "Copies after outgoing register" },
};

const STATUS_LABEL: Record<string, { bg: string; en: string }> = {
  done: { bg: "Готово", en: "Done" },
  waiting: { bg: "Чака", en: "Waiting" },
  pending: { bg: "Предстои", en: "Pending" },
  skipped: { bg: "Пропуснато", en: "Skipped" },
};

function phaseOf(s: TimelineStep): RoutePhase {
  return s.phase || (s.key === "copies" ? "copies" : s.key === "archive" || s.key === "izvejdane" ? "register" : "approve");
}

function statusTone(status?: string) {
  if (status === "done") return "bg-sage text-cream";
  if (status === "waiting") return "bg-burgundy text-cream";
  return "bg-ink/15 text-ink/70";
}

export function RouteTimeline({
  steps,
  lang,
  showStatus = false,
}: {
  steps: TimelineStep[] | RouteStepDef[];
  lang: Lang;
  showStatus?: boolean;
}) {
  let lastPhase: RoutePhase | "" = "";

  return (
    <ol className="space-y-3">
      {steps.map((raw, i) => {
        const s = raw as TimelineStep;
        const phase = phaseOf(s);
        const showHeader = phase !== lastPhase;
        lastPhase = phase;
        const title = lang === "bg" ? s.titleBg : s.titleEn;
        const note = lang === "bg" ? s.noteBg : s.noteEn;
        const recipients = s.recipients || [];
        const isCopies = phase === "copies";
        const isSign = s.key === "rector" || s.key === "vice_rector";
        const signed = isSign && s.status === "done";

        return (
          <li key={s.id || `${s.key}-${i}`}>
            {showHeader && (
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-ink/40">
                {PHASE_LABEL[phase][lang]}
              </div>
            )}
            <div
              className={
                isCopies
                  ? "rounded-xl border border-burgundy/20 bg-burgundy/[0.04] px-3 py-3"
                  : "rounded-lg bg-cream/60 px-3 py-2"
              }
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-medium">{title}</span>
                    {signed && (
                      <span className="stamp !rotate-0">{lang === "bg" ? "Подписано" : "Signed"}</span>
                    )}
                  </div>
                  {s.assignee?.name ? (
                    <div className="mt-0.5 text-xs text-ink/45">{s.assignee.name}</div>
                  ) : null}
                  {note ? <p className="mt-1 text-xs leading-relaxed text-ink/55">{note}</p> : null}
                </div>
                {showStatus && s.status ? (
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusTone(s.status)}`}>
                    {STATUS_LABEL[s.status]?.[lang] || s.status}
                  </span>
                ) : (
                  <span className="shrink-0 text-[10px] text-ink/35">{i + 1}</span>
                )}
              </div>
              {isCopies && recipients.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {recipients.map((r) => (
                    <li
                      key={r}
                      className="rounded-full border border-burgundy/20 bg-paper px-2.5 py-1 text-xs font-medium text-burgundy"
                    >
                      {recipientLabel(r, lang)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
