import type { Lang, Role } from "./types";

export type CalendarEvent = {
  id: string;
  titleBg: string;
  titleEn: string;
  when: string;
  end?: string;
  kind: string;
  href?: string;
  room?: string | null;
};

export type OfferingDTO = {
  id: string;
  slug: string;
  academicYear: string;
  term: string;
  room: string | null;
  language: string;
  assessmentForm: string | null;
  studentCount: number;
  yearOfStudy: number | null;
  formOfStudy: string;
  enrollmentSource: string | null;
  lecturer: { id: string; name: string; email: string } | null;
  assistant: { id: string; name: string; email: string } | null;
  slots: { id: string; weekday: number; start: string; end: string; kind: string; room: string | null }[];
  course: {
    code: string;
    titleBg: string;
    titleEn: string;
    type: string;
    semester: number;
    ects: number;
    hoursTotal: number;
    hoursLectures: number;
    hoursSeminars: number;
    hoursPractice: number;
    weeklyLoad: string;
    grading: string;
    language: string;
  };
  program: {
    code: string;
    titleBg: string;
    titleEn: string;
    degree: string;
    faculty: { code: string; shortBg: string; nameBg: string; nameEn: string };
  };
  syllabus: {
    id: string;
    annotationBg: string;
    annotationEn: string;
    prerequisitesBg: string | null;
    prerequisitesEn: string | null;
    outcomesBg: string | null;
    outcomesEn: string | null;
    load: { kind: string; hours: number; ects: number; labelBg: string; labelEn: string }[];
    grading: { labelBg: string; labelEn: string; percent: number }[];
    topics: { week: number; titleBg: string; titleEn: string; hours: number }[];
  } | null;
};

export function typeLabel(type: string, lang: Lang): string {
  const map: Record<string, { bg: string; en: string }> = {
    C: { bg: "Задължителна", en: "Compulsory" },
    E: { bg: "Избираема", en: "Elective" },
    O: { bg: "Факултативна", en: "Optional" },
  };
  return map[type]?.[lang] ?? type;
}

export function gradingLabel(code: string, lang: Lang): string {
  const map: Record<string, { bg: string; en: string }> = {
    e: { bg: "изпит", en: "exam" },
    ca: { bg: "текуща оценка", en: "current assessment" },
    mixed: { bg: "смесена", en: "mixed" },
  };
  return map[code]?.[lang] ?? code;
}

export function formOfStudyLabel(form: string, lang: Lang): string {
  if (form === "part-time") return lang === "bg" ? "задочно" : "part-time";
  return lang === "bg" ? "редовно" : "full-time";
}

export function weekdayLabel(weekday: number, lang: Lang, short = false): string {
  const bg = ["", "понеделник", "вторник", "сряда", "четвъртък", "петък", "събота", "неделя"];
  const bgS = ["", "пон", "вт", "ср", "чет", "пет", "съб", "нед"];
  const en = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const enS = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  if (lang === "bg") return (short ? bgS : bg)[weekday] || "";
  return (short ? enS : en)[weekday] || "";
}

export function formatSlots(
  slots: OfferingDTO["slots"],
  lang: Lang
): string {
  if (!slots.length) return "—";
  return slots
    .map((s) => {
      const room = s.room ? ` · ${s.room}` : "";
      return `${weekdayLabel(s.weekday, lang, true)} ${s.start}–${s.end}${room}`;
    })
    .join("; ");
}

export function academicNav(role: Role, labels: Record<string, string>) {
  const week = { href: "/week", label: labels.week };
  const inbox = { href: "/inbox", label: labels.inbox };
  const courses = { href: "/courses", label: labels.courses };
  const electives = { href: "/electives", label: labels.electives };
  const curriculum = { href: "/curriculum", label: labels.curriculum };
  const report = { href: "/report", label: labels.report };
  const newCase = { href: "/cases/new", label: labels.newCase };
  const cases = { href: "/cases", label: labels.cases };
  const reports = { href: "/reports", label: labels.reports };
  const handbook = { href: "/handbook", label: labels.handbook };
  const journey = { href: "/journey", label: labels.journey };
  const structure = { href: "/structure", label: labels.structure };
  const admissions = { href: "/admissions", label: labels.admissions };
  const faculties = { href: "/faculties", label: labels.faculties };

  if (role === "student") {
    return [week, inbox, courses, electives, curriculum, cases, journey, admissions, structure];
  }
  if (role === "lecturer") {
    return [week, inbox, courses, curriculum, report, cases, structure];
  }
  if (role === "applicant") {
    return [week, inbox, newCase, cases, journey, admissions, faculties, structure];
  }
  return [week, inbox, newCase, cases, curriculum, reports, handbook, structure];
}

export const APP_CALENDAR_PREFIXES = [
  "/week",
  "/inbox",
  "/cases",
  "/courses",
  "/electives",
  "/curriculum",
  "/report",
  "/handbook",
  "/reports",
  "/forms",
  "/onboarding",
  "/journey",
  "/structure",
];
