export type Role =
  | "student"
  | "lecturer"
  | "program_admin"
  | "faculty_admin"
  | "admin_staff"
  | "applicant";

export type Lang = "bg" | "en";

export type Persona = {
  role: Role;
  facultyCode: string;
  name?: string;
  email?: string;
};

export type FormField = {
  name: string;
  labelBg: string;
  labelEn: string;
  type: string;
  required?: boolean;
  options?: { value: string; labelBg: string; labelEn: string }[];
};

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  facultyCode: string | null;
  facultyId: string | null;
  department: string | null;
  year: number | null;
};

export const ROLES: { id: Role; labelBg: string; labelEn: string; emoji: string }[] = [
  { id: "student", labelBg: "Студент", labelEn: "Student", emoji: "🎓" },
  { id: "lecturer", labelBg: "Преподавател", labelEn: "Lecturer", emoji: "📚" },
  { id: "program_admin", labelBg: "Администратор на програма", labelEn: "Program admin", emoji: "🗂️" },
  { id: "faculty_admin", labelBg: "Факултетен администратор", labelEn: "Faculty admin", emoji: "🏛️" },
  { id: "admin_staff", labelBg: "Административен служител", labelEn: "Admin staff", emoji: "📋" },
  { id: "applicant", labelBg: "Кандидат-студент", labelEn: "Applicant", emoji: "📝" },
];

export const CASE_STATUSES = [
  "draft",
  "awaiting_lecturer",
  "awaiting_admin_review",
  "awaiting_approvals",
  "ready_for_rector",
  "archived",
] as const;

export type CaseStatus = (typeof CASE_STATUSES)[number];

export const PERSONA_COOKIE = "usp_persona";
export const LANG_COOKIE = "usp_lang";
export const SESSION_COOKIE = "usp_session";
