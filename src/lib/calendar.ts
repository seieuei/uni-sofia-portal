import type { Lang } from "./types";

export type CalendarTone = "lecture" | "deadline" | "faculty" | "holiday" | "other";

export function calendarTone(kind: string): CalendarTone {
  if (kind === "holiday") return "holiday";
  if (kind === "deadline") return "deadline";
  if (kind === "assembly" || kind === "faculty") return "faculty";
  if (kind === "lecture" || kind === "seminar" || kind === "practice") return "lecture";
  return "other";
}

export function calendarToneLabel(tone: CalendarTone, lang: Lang): string {
  const map: Record<CalendarTone, { bg: string; en: string }> = {
    lecture: { bg: "Лекции", en: "Lectures" },
    deadline: { bg: "Админ. срокове", en: "Admin deadlines" },
    faculty: { bg: "Факултетни събития", en: "Faculty events" },
    holiday: { bg: "Национални празници", en: "National holidays" },
    other: { bg: "Други", en: "Other" },
  };
  return map[tone][lang];
}

/** Semantic event colours — not brand outlines. */
export function calendarToneClass(tone: CalendarTone): string {
  switch (tone) {
    case "lecture":
      return "border-cal-lecture/40 bg-cal-lecture text-white dark:border-cal-lecture/50";
    case "deadline":
      return "border-cal-deadline/40 bg-cal-deadline text-white dark:border-cal-deadline/50";
    case "faculty":
      return "border-cal-faculty/40 bg-cal-faculty text-white dark:border-cal-faculty/50";
    case "holiday":
      return "border-ink/25 bg-white text-ink dark:border-gold/40 dark:bg-ivory dark:text-night";
    default:
      return "border-ink/15 bg-ink/10 text-ink";
  }
}

export function calendarDotClass(tone: CalendarTone): string {
  switch (tone) {
    case "lecture":
      return "bg-cal-lecture";
    case "deadline":
      return "bg-cal-deadline";
    case "faculty":
      return "bg-cal-faculty";
    case "holiday":
      return "bg-white ring-1 ring-ink/30 dark:bg-ivory";
    default:
      return "bg-ink/40";
  }
}

export const CALENDAR_LEGEND: CalendarTone[] = ["lecture", "deadline", "faculty", "holiday"];
