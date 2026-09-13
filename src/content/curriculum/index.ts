import africanStudiesBa from "./african-studies-ba.json";

export type UchPlanCourse = {
  code: string;
  titleBg: string;
  titleEn: string;
  type: "C" | "E" | "O" | string;
  semester: number;
  ects: number;
  hoursLectures: number;
  hoursSeminars: number;
  hoursPractice: number;
  weeklyLoad: string;
  grading: string;
  language: string;
  sortOrder: number;
};

export type UchPlan = {
  program: {
    code: string;
    slug: string;
    titleBg: string;
    titleEn: string;
    degree: string;
    professionalFieldBg: string;
    professionalFieldEn: string;
    facultyCode: string;
    formOfStudy: string;
    semesters: number;
    noteBg: string;
    noteEn: string;
  };
  courses: UchPlanCourse[];
};

export const UCH_PLANS: Record<string, UchPlan> = {
  "african-studies-ba": africanStudiesBa as UchPlan,
};

export function getUchPlan(slug: string): UchPlan | null {
  return UCH_PLANS[slug] ?? null;
}

export function uchPlanHours(c: UchPlanCourse): number {
  return (c.hoursLectures || 0) + (c.hoursSeminars || 0) + (c.hoursPractice || 0);
}
