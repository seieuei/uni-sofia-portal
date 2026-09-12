import type { Prisma, PrismaClient } from "@prisma/client";
import type { Role } from "./types";

export type CourseType = "C" | "E" | "O";
export type Term = "winter" | "summer";

export type SyllabusLoadItem = {
  kind: string;
  hours: number;
  ects: number;
  labelBg: string;
  labelEn: string;
};

export type SyllabusGradeItem = {
  labelBg: string;
  labelEn: string;
  percent: number;
};

export type SyllabusTopic = {
  week: number;
  titleBg: string;
  titleEn: string;
  hours: number;
};

export const offeringInclude = {
  course: true,
  lecturer: { select: { id: true, name: true, email: true } },
  assistant: { select: { id: true, name: true, email: true } },
  slots: true,
  syllabus: true,
  version: { include: { program: { include: { faculty: true } } } },
};

export function academicPeriodOf(d = new Date()): { academicYear: string; term: Term } {
  const y = d.getFullYear();
  const m = d.getMonth();
  if (m >= 8) {
    return { academicYear: `${y}/${String(y + 1).slice(2)}`, term: "winter" };
  }
  if (m === 0) {
    return { academicYear: `${y - 1}/${String(y).slice(2)}`, term: "winter" };
  }
  return { academicYear: `${y - 1}/${String(y).slice(2)}`, term: "summer" };
}

export function mondayOf(d: Date): Date {
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  const day = start.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + mondayOffset);
  return start;
}

export function parseMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
  return (h || 0) * 60 + (m || 0);
}

export function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function slotDate(weekStart: Date, weekday: number, minutes: number): Date {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + (weekday - 1));
  d.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return d;
}

export function typeLabel(type: string, lang: "bg" | "en"): string {
  const map: Record<string, { bg: string; en: string }> = {
    C: { bg: "Задължителна", en: "Compulsory" },
    E: { bg: "Избираема", en: "Elective" },
    O: { bg: "Факултативна", en: "Optional" },
  };
  return map[type]?.[lang] ?? type;
}

export function gradingLabel(code: string, lang: "bg" | "en"): string {
  const map: Record<string, { bg: string; en: string }> = {
    e: { bg: "изпит", en: "exam" },
    ca: { bg: "текуща оценка", en: "current assessment" },
    mixed: { bg: "смесена", en: "mixed" },
  };
  return map[code]?.[lang] ?? code;
}

export function termLabel(term: string, lang: "bg" | "en"): string {
  if (term === "summer") return lang === "bg" ? "Летен семестър" : "Summer semester";
  return lang === "bg" ? "Зимен семестър" : "Winter semester";
}

export function weekdayLabel(weekday: number, lang: "bg" | "en", short = false): string {
  const bg = ["", "понеделник", "вторник", "сряда", "четвъртък", "петък", "събота", "неделя"];
  const bgS = ["", "пон", "вт", "ср", "чет", "пет", "съб", "нед"];
  const en = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const enS = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  if (lang === "bg") return (short ? bgS : bg)[weekday] || "";
  return (short ? enS : en)[weekday] || "";
}

export function formOfStudyLabel(form: string, lang: "bg" | "en"): string {
  if (form === "part-time") return lang === "bg" ? "задочно" : "part-time";
  return lang === "bg" ? "редовно" : "full-time";
}

export function slotKindLabel(kind: string, lang: "bg" | "en"): string {
  if (kind === "seminar") return lang === "bg" ? "семинар" : "seminar";
  if (kind === "practice") return lang === "bg" ? "практика" : "practice";
  return lang === "bg" ? "лекция" : "lecture";
}

export function languageLabel(code: string, lang: "bg" | "en"): string {
  if (code === "en") return lang === "bg" ? "английски" : "English";
  if (code === "sw") return lang === "bg" ? "суахили" : "Swahili";
  return lang === "bg" ? "български" : "Bulgarian";
}

export function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function canSeeAllOfferings(role: Role) {
  return role === "program_admin" || role === "faculty_admin" || role === "admin_staff";
}

export type OfferingWithRelations = Prisma.CourseOfferingGetPayload<{
  include: typeof offeringInclude;
}> & { enrollmentSource?: string };

export function serializeOffering(o: OfferingWithRelations) {
  return {
    id: o.id,
    slug: o.slug,
    academicYear: o.academicYear,
    term: o.term,
    room: o.room,
    language: o.language,
    assessmentForm: o.assessmentForm,
    studentCount: o.studentCount,
    yearOfStudy: o.yearOfStudy,
    formOfStudy: o.formOfStudy,
    examined: o.examined,
    currentAssessed: o.currentAssessed,
    courseworks: o.courseworks,
    enrollmentSource: o.enrollmentSource ?? null,
    lecturer: o.lecturer,
    assistant: o.assistant,
    slots: [...o.slots]
      .sort((a, b) => a.weekday - b.weekday || a.startMinutes - b.startMinutes)
      .map((s) => ({
        id: s.id,
        weekday: s.weekday,
        start: formatMinutes(s.startMinutes),
        end: formatMinutes(s.endMinutes),
        kind: s.kind,
        room: s.room,
      })),
    course: o.course,
    program: o.version.program,
    syllabus: o.syllabus
      ? {
          id: o.syllabus.id,
          annotationBg: o.syllabus.annotationBg,
          annotationEn: o.syllabus.annotationEn,
          prerequisitesBg: o.syllabus.prerequisitesBg,
          prerequisitesEn: o.syllabus.prerequisitesEn,
          outcomesBg: o.syllabus.outcomesBg,
          outcomesEn: o.syllabus.outcomesEn,
          load: parseJson<SyllabusLoadItem[]>(o.syllabus.loadJson, []),
          grading: parseJson<SyllabusGradeItem[]>(o.syllabus.gradingJson, []),
          topics: parseJson<SyllabusTopic[]>(o.syllabus.topicsJson, []),
        }
      : null,
  };
}

export async function offeringsForUser(
  prisma: PrismaClient,
  user: { id: string; role: Role; facultyId: string | null }
) {
  if (user.role === "student") {
    const rows = await prisma.enrollment.findMany({
      where: { studentId: user.id, status: "enrolled" },
      include: { offering: { include: offeringInclude } },
      orderBy: { createdAt: "asc" },
    });
    return rows.map((r) => ({ ...r.offering, enrollmentSource: r.source }));
  }

  if (user.role === "lecturer") {
    return prisma.courseOffering.findMany({
      where: { OR: [{ lecturerId: user.id }, { assistantId: user.id }] },
      include: offeringInclude,
      orderBy: { slug: "asc" },
    });
  }

  return prisma.courseOffering.findMany({
    where: user.facultyId ? { version: { program: { facultyId: user.facultyId } } } : undefined,
    include: offeringInclude,
    orderBy: { slug: "asc" },
  });
}
