import {
  CENTRAL_ADMIN_CONTACTS,
  FCML_DEAN,
  FCML_VICE_DEANS,
  type ContactPerson,
} from "@/content/contacts/central";
import { FKNF_FACULTY_EVENTS } from "@/content/calendar/fknf-2026-27";

export type FloorId = "parter" | "1" | "2" | "3";

export type WingId = "west" | "center" | "east" | "aula";

export type RectorateRoom = {
  id: string;
  number: string;
  nameBg: string;
  nameEn: string;
  floor: FloorId;
  wing: WingId;
  x: number;
  y: number;
  w?: number;
  h?: number;
  kind: "office" | "hall" | "aula" | "service";
  contactHref?: string;
  contacts?: ContactPerson[];
  noteBg?: string;
  noteEn?: string;
};

const FLOOR_LABELS: Record<FloorId, { bg: string; en: string }> = {
  parter: { bg: "Партер", en: "Ground floor" },
  "1": { bg: "Етаж 1", en: "Floor 1" },
  "2": { bg: "Етаж 2", en: "Floor 2" },
  "3": { bg: "Етаж 3", en: "Floor 3" },
};

const WING_LABELS: Record<WingId, { bg: string; en: string }> = {
  west: { bg: "Западно крило", en: "West wing" },
  center: { bg: "Централно крило", en: "Central wing" },
  east: { bg: "Източно крило", en: "East wing" },
  aula: { bg: "Аула / фоайе", en: "Aula / foyer" },
};

export function floorLabel(floor: FloorId, lang: "bg" | "en") {
  return FLOOR_LABELS[floor][lang];
}

export function wingLabel(wing: WingId, lang: "bg" | "en") {
  return WING_LABELS[wing][lang];
}

function contactsForRoom(roomNum: string): ContactPerson[] {
  const all = [...CENTRAL_ADMIN_CONTACTS, FCML_DEAN, ...FCML_VICE_DEANS];
  return all.filter((c) => c.room === roomNum);
}

/** Seeded demo rooms — contacts + calendar halls + plausible neighbours. Schematic only. */
export const RECTORATE_ROOMS: RectorateRoom[] = [
  {
    id: "r-5",
    number: "5",
    nameBg: "Международно сътрудничество",
    nameEn: "International cooperation",
    floor: "parter",
    wing: "west",
    x: 12,
    y: 28,
    kind: "office",
    contactHref: "/contacts#central",
    contacts: contactsForRoom("5"),
  },
  {
    id: "r-6",
    number: "6",
    nameBg: "Главен секретар",
    nameEn: "Chief secretary",
    floor: "parter",
    wing: "center",
    x: 42,
    y: 22,
    kind: "office",
    contactHref: "/contacts#central",
    contacts: contactsForRoom("6"),
  },
  {
    id: "r-8",
    number: "8",
    nameBg: "Главен финансист",
    nameEn: "Chief finance officer",
    floor: "parter",
    wing: "center",
    x: 58,
    y: 22,
    kind: "office",
    contactHref: "/contacts#central",
    contacts: contactsForRoom("8"),
  },
  {
    id: "r-13",
    number: "13",
    nameBg: "Главен мениджър / Имоти",
    nameEn: "Chief manager / Property",
    floor: "parter",
    wing: "east",
    x: 78,
    y: 30,
    kind: "office",
    contactHref: "/contacts#central",
    contacts: contactsForRoom("13"),
  },
  {
    id: "r-15",
    number: "15",
    nameBg: "Главен юрисконсулт",
    nameEn: "Chief legal counsel",
    floor: "parter",
    wing: "east",
    x: 88,
    y: 48,
    kind: "office",
    contactHref: "/contacts#central",
    contacts: contactsForRoom("15"),
  },
  {
    id: "r-17",
    number: "17",
    nameBg: "Акредитиране и рейтинги",
    nameEn: "Accreditation and rankings",
    floor: "parter",
    wing: "east",
    x: 82,
    y: 68,
    kind: "office",
    contactHref: "/contacts#central",
    contacts: contactsForRoom("17"),
  },
  {
    id: "r-19",
    number: "19",
    nameBg: "Предварителен финансов контрол",
    nameEn: "Ex-ante financial control",
    floor: "parter",
    wing: "west",
    x: 18,
    y: 62,
    kind: "office",
    contactHref: "/contacts#central",
    contacts: contactsForRoom("19"),
  },
  {
    id: "r-20",
    number: "20",
    nameBg: "Обществени поръчки",
    nameEn: "Public procurement",
    floor: "parter",
    wing: "west",
    x: 28,
    y: 78,
    kind: "office",
    contactHref: "/contacts#central",
    contacts: contactsForRoom("20"),
  },
  {
    id: "r-65",
    number: "65",
    nameBg: "Аудитория 65",
    nameEn: "Auditorium 65",
    floor: "parter",
    wing: "center",
    x: 48,
    y: 55,
    w: 18,
    h: 16,
    kind: "hall",
    noteBg: "Откриване на уч. година — ФКНФ",
    noteEn: "Academic year opening — FCML",
  },
  {
    id: "r-z1",
    number: "ЗЗ1",
    nameBg: "Заседателна зала 1",
    nameEn: "Meeting hall 1",
    floor: "parter",
    wing: "west",
    x: 22,
    y: 42,
    w: 14,
    h: 12,
    kind: "hall",
    noteBg: "Откриване — Африканистика и др.",
    noteEn: "Opening — African Studies and others",
  },
  {
    id: "r-aula",
    number: "Аула",
    nameBg: "Аула на СУ",
    nameEn: "Sofia University Aula",
    floor: "parter",
    wing: "aula",
    x: 50,
    y: 82,
    w: 22,
    h: 12,
    kind: "aula",
    noteBg: "Промоции / тържества",
    noteEn: "Graduation / ceremonies",
  },
  {
    id: "r-info",
    number: "Инфо",
    nameBg: "Информационен пункт",
    nameEn: "Information desk",
    floor: "parter",
    wing: "center",
    x: 50,
    y: 12,
    w: 12,
    h: 8,
    kind: "service",
  },
  {
    id: "r-104",
    number: "104",
    nameBg: "Учебна зала 104",
    nameEn: "Teaching room 104",
    floor: "1",
    wing: "west",
    x: 18,
    y: 35,
    kind: "hall",
    noteBg: "От учебния разпис (пилот)",
    noteEn: "From pilot timetable",
  },
  {
    id: "r-113",
    number: "113",
    nameBg: "Главен счетоводител",
    nameEn: "Chief accountant",
    floor: "1",
    wing: "center",
    x: 45,
    y: 28,
    kind: "office",
    contactHref: "/contacts#central",
    contacts: contactsForRoom("113"),
  },
  {
    id: "r-116",
    number: "116",
    nameBg: "Ремонти и снабдяване",
    nameEn: "Maintenance and supply",
    floor: "1",
    wing: "east",
    x: 72,
    y: 30,
    kind: "office",
    contactHref: "/contacts#central",
    contacts: contactsForRoom("116"),
  },
  {
    id: "r-117",
    number: "117",
    nameBg: "Човешки ресурси",
    nameEn: "Human resources",
    floor: "1",
    wing: "east",
    x: 84,
    y: 42,
    kind: "office",
    contactHref: "/contacts#central",
    contacts: contactsForRoom("117"),
  },
  {
    id: "r-118",
    number: "118",
    nameBg: "Учебна зала 118",
    nameEn: "Teaching room 118",
    floor: "1",
    wing: "east",
    x: 78,
    y: 62,
    kind: "hall",
    noteBg: "От учебния разпис (пилот)",
    noteEn: "From pilot timetable",
  },
  {
    id: "r-121",
    number: "121",
    nameBg: "Секретариат — централно",
    nameEn: "Central secretariat",
    floor: "1",
    wing: "center",
    x: 50,
    y: 55,
    kind: "office",
  },
  {
    id: "r-130",
    number: "130",
    nameBg: "Коридор / фоайе І ет.",
    nameEn: "Corridor / foyer 1F",
    floor: "1",
    wing: "center",
    x: 50,
    y: 78,
    w: 16,
    h: 8,
    kind: "service",
  },
  {
    id: "r-214",
    number: "214",
    nameBg: "Докторанти / СДК",
    nameEn: "Doctoral / continuing education",
    floor: "2",
    wing: "west",
    x: 16,
    y: 32,
    kind: "office",
    contactHref: "/contacts#central",
    contacts: contactsForRoom("214"),
  },
  {
    id: "r-215",
    number: "215",
    nameBg: "Учебна зала 215",
    nameEn: "Teaching room 215",
    floor: "2",
    wing: "west",
    x: 28,
    y: 48,
    kind: "hall",
    noteBg: "От учебния разпис (пилот)",
    noteEn: "From pilot timetable",
  },
  {
    id: "r-227",
    number: "227",
    nameBg: "Образователни дейности",
    nameEn: "Educational activities",
    floor: "2",
    wing: "east",
    x: 78,
    y: 28,
    kind: "office",
    contactHref: "/contacts#central",
    contacts: contactsForRoom("227"),
  },
  {
    id: "r-231",
    number: "231",
    nameBg: "Деканат ФКНФ",
    nameEn: "FCML dean's office",
    floor: "2",
    wing: "center",
    x: 42,
    y: 40,
    kind: "office",
    contactHref: "/contacts#fcml",
    noteBg: "Централно крило — деканат",
    noteEn: "Central wing — dean's office",
  },
  {
    id: "r-232",
    number: "232",
    nameBg: "Декан и зам.-декани ФКНФ",
    nameEn: "FCML dean and vice-deans",
    floor: "2",
    wing: "center",
    x: 58,
    y: 40,
    w: 14,
    h: 12,
    kind: "office",
    contactHref: "/contacts#fcml",
    contacts: [FCML_DEAN, ...FCML_VICE_DEANS],
    noteBg: "Каб. 232 — приемно време по дни",
    noteEn: "Room 232 — office hours by day",
  },
  {
    id: "r-241",
    number: "241",
    nameBg: "Учебна зала 241",
    nameEn: "Teaching room 241",
    floor: "2",
    wing: "east",
    x: 82,
    y: 58,
    kind: "hall",
    noteBg: "От учебния разпис (пилот)",
    noteEn: "From pilot timetable",
  },
  {
    id: "r-245",
    number: "245",
    nameBg: "Съвещателна — ФКНФ",
    nameEn: "FCML meeting room",
    floor: "2",
    wing: "east",
    x: 70,
    y: 72,
    kind: "hall",
  },
  {
    id: "r-284",
    number: "284",
    nameBg: "Университетски архив",
    nameEn: "University archive",
    floor: "3",
    wing: "east",
    x: 76,
    y: 35,
    kind: "office",
    contactHref: "/contacts#central",
    contacts: contactsForRoom("284"),
  },
  {
    id: "r-270",
    number: "270",
    nameBg: "Архив — читалня",
    nameEn: "Archive reading room",
    floor: "3",
    wing: "east",
    x: 88,
    y: 50,
    kind: "hall",
  },
  {
    id: "r-255",
    number: "255",
    nameBg: "Технически / ИТ",
    nameEn: "Technical / IT",
    floor: "3",
    wing: "west",
    x: 18,
    y: 40,
    kind: "service",
  },
  {
    id: "r-260",
    number: "260",
    nameBg: "Зала за защити",
    nameEn: "Defence hall",
    floor: "3",
    wing: "center",
    x: 48,
    y: 45,
    w: 16,
    h: 14,
    kind: "hall",
    noteBg: "Дипломни / магистърски защити (схематично)",
    noteEn: "Thesis defences (schematic)",
  },
  {
    id: "r-302",
    number: "302",
    nameBg: "Учебна зала 302",
    nameEn: "Teaching room 302",
    floor: "3",
    wing: "west",
    x: 28,
    y: 68,
    kind: "hall",
    noteBg: "От учебния разпис (пилот)",
    noteEn: "From pilot timetable",
  },
  {
    id: "r-310",
    number: "310",
    nameBg: "Коридор ІІІ ет.",
    nameEn: "Corridor 3F",
    floor: "3",
    wing: "center",
    x: 50,
    y: 78,
    w: 14,
    h: 8,
    kind: "service",
  },
];

const CALENDAR_ROOM_ALIASES: { pattern: RegExp; roomId: string }[] = [
  { pattern: /ауд\.?\s*65|aud\.?\s*65|\b65\b/i, roomId: "r-65" },
  { pattern: /заседателна\s*зала\s*1|meeting\s*hall\s*1|зз1/i, roomId: "r-z1" },
  { pattern: /аула/i, roomId: "r-aula" },
  { pattern: /\b232\b/, roomId: "r-232" },
  { pattern: /\b231\b/, roomId: "r-231" },
];

export function searchRooms(query: string): RectorateRoom[] {
  const q = query.trim().toLowerCase();
  if (!q) return RECTORATE_ROOMS;
  const direct = RECTORATE_ROOMS.filter((r) => {
    const hay = [r.number, r.nameBg, r.nameEn, r.noteBg, r.noteEn, ...(r.contacts?.map((c) => c.name) || [])]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(q) || r.number.toLowerCase() === q;
  });
  if (direct.length) return direct;
  const aliasHits = new Set<string>();
  for (const a of CALENDAR_ROOM_ALIASES) {
    if (a.pattern.test(q)) aliasHits.add(a.roomId);
  }
  if (aliasHits.size) return RECTORATE_ROOMS.filter((r) => aliasHits.has(r.id));
  return [];
}

export function roomById(id: string) {
  return RECTORATE_ROOMS.find((r) => r.id === id);
}

export function roomsOnFloor(floor: FloorId) {
  return RECTORATE_ROOMS.filter((r) => r.floor === floor);
}

export function calendarRoomsReferenced(): string[] {
  const out = new Set<string>();
  for (const ev of FKNF_FACULTY_EVENTS) {
    if (!ev.room) continue;
    for (const a of CALENDAR_ROOM_ALIASES) {
      if (a.pattern.test(ev.room)) {
        const r = roomById(a.roomId);
        if (r) out.add(r.number);
      }
    }
  }
  return Array.from(out);
}

export const FLOOR_ORDER: FloorId[] = ["parter", "1", "2", "3"];
