export type Holiday = {
  date: string; // YYYY-MM-DD
  titleBg: string;
  titleEn: string;
};

/** Official BG public holidays (plus movable Orthodox Easter cluster) for nearby years. */
const FIXED: { md: string; titleBg: string; titleEn: string }[] = [
  { md: "01-01", titleBg: "Нова година", titleEn: "New Year's Day" },
  { md: "03-03", titleBg: "Ден на Освобождението", titleEn: "Liberation Day" },
  { md: "05-01", titleBg: "Ден на труда", titleEn: "Labour Day" },
  { md: "05-06", titleBg: "Гергьовден / Ден на храбростта", titleEn: "St George's Day / Army Day" },
  { md: "05-24", titleBg: "Ден на българската просвета и култура", titleEn: "Day of Bulgarian Education and Culture" },
  { md: "09-06", titleBg: "Ден на Съединението", titleEn: "Unification Day" },
  { md: "09-22", titleBg: "Ден на Независимостта", titleEn: "Independence Day" },
  { md: "12-24", titleBg: "Бъдни вечер", titleEn: "Christmas Eve" },
  { md: "12-25", titleBg: "Рождество Христово", titleEn: "Christmas Day" },
  { md: "12-26", titleBg: "Втори ден на Коледа", titleEn: "Second day of Christmas" },
];

/** Orthodox Easter Sunday (YYYY-MM-DD) */
const ORTHODOX_EASTER: Record<number, string> = {
  2025: "2025-04-20",
  2026: "2026-04-12",
  2027: "2027-05-02",
  2028: "2028-04-16",
};

function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function holidaysForYear(year: number): Holiday[] {
  const fixed = FIXED.map((h) => ({
    date: `${year}-${h.md}`,
    titleBg: h.titleBg,
    titleEn: h.titleEn,
  }));
  const easter = ORTHODOX_EASTER[year];
  if (!easter) return fixed;
  const movable: Holiday[] = [
    { date: addDays(easter, -2), titleBg: "Велики петък", titleEn: "Orthodox Good Friday" },
    { date: addDays(easter, -1), titleBg: "Велика събота", titleEn: "Holy Saturday" },
    { date: easter, titleBg: "Великден", titleEn: "Orthodox Easter" },
    { date: addDays(easter, 1), titleBg: "Велики понеделник", titleEn: "Easter Monday" },
  ];
  return [...fixed, ...movable].sort((a, b) => a.date.localeCompare(b.date));
}

export function holidaysInRange(start: Date, end: Date): Holiday[] {
  const years = Array.from(new Set<number>([start.getFullYear(), end.getFullYear()]));
  const out: Holiday[] = [];
  for (const y of years) {
    for (const h of holidaysForYear(y)) {
      const d = new Date(`${h.date}T12:00:00`);
      if (d >= start && d <= end) out.push(h);
    }
  }
  return out;
}
