export type Role = "student" | "lecturer" | "admin_staff" | "applicant";
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

export const ROLES: { id: Role; labelBg: string; labelEn: string; emoji: string }[] = [
  { id: "student", labelBg: "Студент", labelEn: "Student", emoji: "🎓" },
  { id: "lecturer", labelBg: "Преподавател", labelEn: "Lecturer", emoji: "📚" },
  { id: "admin_staff", labelBg: "Административен служител", labelEn: "Admin staff", emoji: "🗂️" },
  { id: "applicant", labelBg: "Кандидат-студент", labelEn: "Applicant", emoji: "📝" },
];

export const PERSONA_COOKIE = "usp_persona";
export const LANG_COOKIE = "usp_lang";
