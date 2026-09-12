/** EUR rates used for Obrazec 5.2 honorary load/pay (demo constants). */
export const LOAD_ACTIVITY_RATES: Record<
  string,
  { labelBg: string; labelEn: string; rateEur: number }
> = {
  lectures: { labelBg: "Лекции", labelEn: "Lectures", rateEur: 25 },
  exercises: { labelBg: "Упражнения / семинари", labelEn: "Exercises / seminars", rateEur: 18 },
  exams: { labelBg: "Изпити", labelEn: "Exams", rateEur: 15 },
  consultations: { labelBg: "Консултации", labelEn: "Consultations", rateEur: 12 },
  other: { labelBg: "Друго", labelEn: "Other", rateEur: 10 },
};

export const ACTIVITY_KEYS = Object.keys(LOAD_ACTIVITY_RATES);
