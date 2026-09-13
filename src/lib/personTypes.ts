import type { Lang, Role } from "./types";

export type StudentCycle = "ba" | "ma" | "phd";
export type StudyForm = "full-time" | "part-time";
export type LecturerKind = "staff" | "honorary";

export const STUDENT_CYCLES: { id: StudentCycle; labelBg: string; labelEn: string }[] = [
  { id: "ba", labelBg: "Бакалавър", labelEn: "Bachelor" },
  { id: "ma", labelBg: "Магистър", labelEn: "Master" },
  { id: "phd", labelBg: "Докторант", labelEn: "PhD" },
];

export const STUDY_FORMS: { id: StudyForm; labelBg: string; labelEn: string }[] = [
  { id: "full-time", labelBg: "Редовна", labelEn: "Full-time" },
  { id: "part-time", labelBg: "Задочна", labelEn: "Part-time" },
];

export const LECTURER_KINDS: { id: LecturerKind; labelBg: string; labelEn: string }[] = [
  { id: "staff", labelBg: "Щатен", labelEn: "Full-time staff" },
  { id: "honorary", labelBg: "Хоноруван", labelEn: "Honorary" },
];

export function cycleLabel(cycle: string | null | undefined, lang: Lang): string {
  const row = STUDENT_CYCLES.find((c) => c.id === cycle);
  if (!row) return "";
  return lang === "bg" ? row.labelBg : row.labelEn;
}

export function studyFormLabel(form: string | null | undefined, lang: Lang): string {
  const row = STUDY_FORMS.find((c) => c.id === form);
  if (!row) return form === "part-time" ? (lang === "bg" ? "Задочна" : "Part-time") : lang === "bg" ? "Редовна" : "Full-time";
  return lang === "bg" ? row.labelBg : row.labelEn;
}

export function lecturerKindLabel(kind: string | null | undefined, lang: Lang): string {
  const row = LECTURER_KINDS.find((c) => c.id === kind);
  if (!row) return "";
  return lang === "bg" ? row.labelBg : row.labelEn;
}

export function personTypeLabel(
  role: Role,
  opts: { studentCycle?: string | null; formOfStudy?: string | null; lecturerKind?: string | null },
  lang: Lang
): string {
  if (role === "student") {
    const cycle = cycleLabel(opts.studentCycle || "ba", lang) || (lang === "bg" ? "Студент" : "Student");
    if (opts.studentCycle === "ba" || !opts.studentCycle) {
      const form = studyFormLabel(opts.formOfStudy || "full-time", lang);
      return `${cycle} · ${form}`;
    }
    return cycle;
  }
  if (role === "lecturer") {
    const kind = lecturerKindLabel(opts.lecturerKind, lang);
    return kind
      ? `${lang === "bg" ? "Преподавател" : "Lecturer"} · ${kind}`
      : lang === "bg"
        ? "Преподавател"
        : "Lecturer";
  }
  return "";
}

export function defaultStudentCycle(role: Role): StudentCycle | null {
  return role === "student" ? "ba" : null;
}

export function defaultStudyForm(role: Role): StudyForm | null {
  return role === "student" ? "full-time" : null;
}

export function defaultLecturerKind(role: Role): LecturerKind | null {
  return role === "lecturer" ? "staff" : null;
}
