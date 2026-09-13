import type { CalendarEvent } from "@/lib/academicUi";

/** Faculty / admin / lecture-tone events from FCML opening + academic calendar PDFs. */
export const FKNF_FACULTY_EVENTS: Omit<CalendarEvent, "id">[] = [
  // Opening day — 1 Oct 2026
  {
    titleBg: "Откриване на уч. 2026/27 — всички специалности ФКНФ",
    titleEn: "2026/27 opening — all FCML programmes",
    when: "2026-10-01T13:00:00.000Z",
    end: "2026-10-01T13:45:00.000Z",
    kind: "faculty",
    room: "ауд. 65, Ректорат",
    href: "/week",
  },
  {
    titleBg: "Откриване — Африканистика",
    titleEn: "Opening — African Studies",
    when: "2026-10-01T14:00:00.000Z",
    kind: "faculty",
    room: "Заседателна зала 1, Ректорат",
  },
  {
    titleBg: "Откриване — Английска филология",
    titleEn: "Opening — English Philology",
    when: "2026-10-01T13:45:00.000Z",
    kind: "faculty",
    room: "ауд. 65, Ректорат",
  },
  {
    titleBg: "Откриване — ЦИЕК (източни езици)",
    titleEn: "Opening — Centre for Eastern Languages",
    when: "2026-10-01T14:00:00.000Z",
    kind: "faculty",
    room: "бул. Тодор Александров 79",
  },
  // Academic calendar
  {
    titleBg: "Защити на магистърски дипломни работи",
    titleEn: "Master's thesis defences",
    when: "2026-10-26T09:00:00.000Z",
    end: "2026-10-31T17:00:00.000Z",
    kind: "deadline",
  },
  {
    titleBg: "Общо събрание на ФКНФ",
    titleEn: "FCML General Assembly",
    when: "2026-11-13T10:00:00.000Z",
    kind: "assembly",
  },
  {
    titleBg: "Защити на магистърски дипломни работи",
    titleEn: "Master's thesis defences",
    when: "2027-04-01T09:00:00.000Z",
    end: "2027-04-09T17:00:00.000Z",
    kind: "deadline",
  },
  {
    titleBg: "Промоция — връчване на дипломи",
    titleEn: "Graduation ceremony — diploma award",
    when: "2027-04-02T10:00:00.000Z",
    kind: "faculty",
    room: "Аула на СУ",
  },
  {
    titleBg: "24-та конференция на нехабилитираните преподаватели и докторанти ФКНФ",
    titleEn: "24th FCML conference of non-habilitated staff and doctoral students",
    when: "2027-05-14T09:00:00.000Z",
    kind: "faculty",
  },
  {
    titleBg: "Защити на магистърски дипломни работи",
    titleEn: "Master's thesis defences",
    when: "2027-07-06T09:00:00.000Z",
    end: "2027-07-10T17:00:00.000Z",
    kind: "deadline",
  },
  {
    titleBg: "Писмен държавен изпит (бакалавър) — редовна сесия",
    titleEn: "Written state exam (BA) — regular session",
    when: "2027-07-06T09:00:00.000Z",
    kind: "deadline",
  },
  {
    titleBg: "Устни държавни изпити",
    titleEn: "Oral state exams",
    when: "2027-07-06T09:00:00.000Z",
    end: "2027-07-13T17:00:00.000Z",
    kind: "deadline",
  },
  {
    titleBg: "Прием документи — магистърски програми ФКНФ",
    titleEn: "Document intake — FCML master's programmes",
    when: "2027-08-01T09:00:00.000Z",
    end: "2027-09-14T17:00:00.000Z",
    kind: "deadline",
  },
  {
    titleBg: "Писмен държавен изпит (бакалавър) — поправителна сесия",
    titleEn: "Written state exam (BA) — resit",
    when: "2027-09-08T09:00:00.000Z",
    kind: "deadline",
  },
  {
    titleBg: "Устни държавни изпити — поправителна сесия",
    titleEn: "Oral state exams — resit",
    when: "2027-09-09T09:00:00.000Z",
    end: "2027-09-13T17:00:00.000Z",
    kind: "deadline",
  },
  {
    titleBg: "Интервюта за магистри",
    titleEn: "Master's programme interviews",
    when: "2027-09-15T09:00:00.000Z",
    end: "2027-09-17T17:00:00.000Z",
    kind: "faculty",
  },
  // Fee deadlines from students2.pdf
  {
    titleBg: "Срок такса зимен семестър — задочно (СУСИ/ePay)",
    titleEn: "Winter-term fee deadline — part-time (SUSI/ePay)",
    when: "2026-08-31T23:59:00.000Z",
    kind: "deadline",
    href: "/handbook/student-enrolment-fees",
  },
  {
    titleBg: "Срок такса зимен семестър — редовно (СУСИ/ePay)",
    titleEn: "Winter-term fee deadline — full-time (SUSI/ePay)",
    when: "2026-09-30T23:59:00.000Z",
    kind: "deadline",
    href: "/handbook/student-enrolment-fees",
  },
  {
    titleBg: "Срок такса летен семестър — задочно (СУСИ/ePay)",
    titleEn: "Summer-term fee deadline — part-time (SUSI/ePay)",
    when: "2027-01-17T23:59:00.000Z",
    kind: "deadline",
    href: "/handbook/student-enrolment-fees",
  },
  {
    titleBg: "Срок такса летен семестър — редовно (СУСИ/ePay)",
    titleEn: "Summer-term fee deadline — full-time (SUSI/ePay)",
    when: "2027-02-14T23:59:00.000Z",
    kind: "deadline",
    href: "/handbook/student-enrolment-fees",
  },
];

export function facultyEventId(ev: Omit<CalendarEvent, "id">, index: number): string {
  return `fknf-${index}-${ev.when}`;
}

/** All handbook / FCML faculty events overlapping [start, end] (single source of truth). */
export function facultyEventsInRange(start: Date, end: Date): CalendarEvent[] {
  const s = start.getTime();
  const e = end.getTime();
  return FKNF_FACULTY_EVENTS.map((ev, i) => ({ ...ev, id: facultyEventId(ev, i) })).filter((ev) => {
    const t0 = new Date(ev.when).getTime();
    const t1 = ev.end ? new Date(ev.end).getTime() : t0;
    return t0 <= e && t1 >= s;
  });
}
