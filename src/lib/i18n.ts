import type { Lang } from "./types";

const dict = {
  siteName: { bg: "УниСофия Портал*", en: "UniSofia Portal*" },
  tagline: {
    bg: "Пилот за Африканистика / ФКНФ — работен портал до бланките",
    en: "African Studies / FCML pilot — work portal that fills the blanks",
  },
  notOfficial: {
    bg: "Не е официален сайт на СУ. Демо / пилот.",
    en: "Not an official Sofia University site. Demo / pilot.",
  },
  navHome: { bg: "Начало", en: "Home" },
  navWeek: { bg: "Моята седмица", en: "My week" },
  navInbox: { bg: "Входящи", en: "Inbox" },
  navNewCase: { bg: "Нова преписка", en: "New case" },
  navCases: { bg: "Моите дела", en: "My cases" },
  navReports: { bg: "Справки", en: "Reports" },
  navHandbook: { bg: "Справочник", en: "Handbook" },
  navLogin: { bg: "Вход", en: "Login" },
  navLogout: { bg: "Изход", en: "Logout" },
  navRegister: { bg: "Регистрация", en: "Register" },
  navHow: { bg: "Как работи", en: "How it works" },
  navOnboarding: { bg: "Кой съм аз?", en: "Who am I?" },
  navDashboard: { bg: "Табло", en: "Dashboard" },
  navForms: { bg: "Форми", en: "Forms" },
  navManifesto: { bg: "Манифест", en: "Manifesto" },
  navDisclaimer: { bg: "Дисклеймър", en: "Disclaimer" },
  ctaStart: { bg: "Вход в портала", en: "Sign in" },
  ctaDashboard: { bg: "Към седмицата", en: "Go to my week" },
  ctaForms: { bg: "Каталог форми", en: "Forms catalog" },
  ctaHow: { bg: "Как работи", en: "How it works" },
  landingHero: {
    bg: "Работен портал за преписки — без имейл пинг-понг",
    en: "A work portal for cases — without email ping-pong",
  },
  landingSub: {
    bg: "Пилот за Африканистика / ФКНФ. Попълваме официалните бланки през уеб UI. Допълваме СУСИ / elearn / Архимед — не ги заместваме.",
    en: "Pilot for African Studies / FCML. We fill official blanks via web UI. Complements SUSI / elearn / Arhimed — does not replace them.",
  },
  landingWitty: {
    bg: "Бланката остава свещена. Порталът само я попълва.",
    en: "The blank stays sacred. The portal just fills it in.",
  },
  painTitle: { bg: "Защо пилотът съществува", en: "Why this pilot exists" },
  pain1t: { bg: "Бланки по имейл", en: "Blank forms by email" },
  pain1d: {
    bg: "Официалните образци остават. Уебът ги попълва и връща готов DOCX.",
    en: "Official templates stay. The web fills them and returns a DOCX.",
  },
  pain2t: { bg: "Няма собственик", en: "No clear owner" },
  pain2d: {
    bg: "Всяка преписка има стъпки, отговорник и времева линия.",
    en: "Every case has steps, an owner, and a timeline.",
  },
  pain3t: { bg: "Факултетен контекст", en: "Faculty context" },
  pain3d: {
    bg: "Стартираме с Африканистика / ФКНФ — роля + програма + процес.",
    en: "Starting with African Studies / FCML — role + program + process.",
  },
  pain4t: { bg: "Входящи вместо CC", en: "Inbox instead of CC" },
  pain4d: {
    bg: "Задачите чакат при теб — не в ничия входяща кутия.",
    en: "Tasks wait on you — not in nobody’s mailbox.",
  },
  howTitle: { bg: "Как работи Phase A", en: "How Phase A works" },
  how1: { bg: "Влез с демо акаунт (роля + факултет)", en: "Sign in with a demo account (role + faculty)" },
  how2: { bg: "Стартирай процес 5.2 (натовареност / хонорари)", en: "Start process 5.2 (load / honorary pay)" },
  how3: { bg: "Преподавателят потвърждава часовете", en: "Lecturer confirms hours" },
  how4: { bg: "Админът изчислява и сваля DOCX", en: "Admin calculates and downloads DOCX" },
  onboardingTitle: { bg: "Профил", en: "Profile" },
  onboardingHint: {
    bg: "Профилът идва от акаунта. Регистрацията е отворена за демо с дисклеймър.",
    en: "Profile comes from your account. Registration is open for the demo with a disclaimer.",
  },
  roleLabel: { bg: "Роля", en: "Role" },
  facultyLabel: { bg: "Факултет", en: "Faculty" },
  nameLabel: { bg: "Име", en: "Name" },
  emailLabel: { bg: "Имейл", en: "Email" },
  passwordLabel: { bg: "Парола", en: "Password" },
  departmentLabel: { bg: "Катедра / програма", en: "Department / program" },
  yearLabel: { bg: "Курс (студенти)", en: "Year (students)" },
  savePersona: { bg: "Запази и продължи", en: "Save & continue" },
  changePersona: { bg: "Смени профила", en: "Change profile" },
  dashboardTitle: { bg: "Твоето табло", en: "Your dashboard" },
  dashboardHello: { bg: "Здравей", en: "Hello" },
  relevantForms: { bg: "Релевантни форми", en: "Relevant forms" },
  quickLinks: { bg: "Бързи връзки", en: "Quick links" },
  noPersona: {
    bg: "Не си влязъл. Моля, влез или се регистрирай.",
    en: "You are not signed in. Please log in or register.",
  },
  formsTitle: { bg: "Каталог цифрови форми", en: "Digital forms catalog" },
  formsFilter: { bg: "Филтрирани за твоята роля", en: "Filtered for your role" },
  fillForm: { bg: "Попълни", en: "Fill out" },
  submitForm: { bg: "Изпрати (симулация)", en: "Submit (simulated)" },
  submitting: { bg: "Изпращане…", en: "Submitting…" },
  ticketCreated: { bg: "Билетът е създаден!", en: "Ticket created!" },
  routedTo: { bg: "Насочено към", en: "Routed to" },
  confirmation: { bg: "Потвърждение", en: "Confirmation" },
  backForms: { bg: "Обратно към формите", en: "Back to forms" },
  inboxTitle: { bg: "Входящи", en: "Inbox" },
  inboxEmpty: {
    bg: "Няма задачи, които те чакат.",
    en: "No tasks waiting on you.",
  },
  inboxStaffOnly: {
    bg: "Влез, за да видиш входящите си задачи.",
    en: "Sign in to see your inbox tasks.",
  },
  ticket: { bg: "Билет", en: "Ticket" },
  status: { bg: "Статус", en: "Status" },
  submittedAt: { bg: "Подадено", en: "Submitted" },
  fromRole: { bg: "От роля", en: "From role" },
  manifestoTitle: { bg: "Манифест", en: "Manifesto" },
  disclaimerTitle: { bg: "Дисклеймър", en: "Disclaimer" },
  satireBadge: { bg: "Пилот", en: "Pilot" },
  category: { bg: "Категория", en: "Category" },
  viewInbox: { bg: "Отвори входящи", en: "Open inbox" },
  officialLink: { bg: "Официален сайт на СУ", en: "Official SU website" },
  status_received: { bg: "Получено", en: "Received" },
  status_in_review: { bg: "В обработка", en: "In review" },
  status_ping_pong: { bg: "Имейл пинг-понг", en: "Email ping-pong" },
  status_done: { bg: "Готово", en: "Done" },
  status_draft: { bg: "Чернова", en: "Draft" },
  status_awaiting_lecturer: { bg: "Чака преподавател", en: "Awaiting lecturer" },
  status_awaiting_admin_review: { bg: "Чака админ преглед", en: "Awaiting admin review" },
  status_awaiting_approvals: { bg: "Чака одобрения", en: "Awaiting approvals" },
  status_ready_for_rector: { bg: "Готово за ректор", en: "Ready for rector" },
  status_archived: { bg: "Архивирано", en: "Archived" },
  routeCopies: { bg: "Копия след извеждане", en: "Copies after outgoing register" },
  routeRegister: { bg: "Извеждане", en: "Outgoing register" },
  routeApprove: { bg: "Съгласуване", en: "Approval" },
  signed: { bg: "Подписано", en: "Signed" },
  required: { bg: "задължително", en: "required" },
  allFaculties: { bg: "Всички факултети", en: "All faculties" },
  weekTitle: { bg: "Моята седмица", en: "My week" },
  casesTitle: { bg: "Моите дела", en: "My cases" },
  newCaseTitle: { bg: "Нова преписка", en: "New case" },
  reportsTitle: { bg: "Справки", en: "Reports" },
  handbookTitle: { bg: "Справочник", en: "Handbook" },
  loginTitle: { bg: "Вход", en: "Sign in" },
  registerTitle: { bg: "Регистрация (демо)", en: "Register (demo)" },
  demoCreds: { bg: "Демо акаунти", en: "Demo accounts" },
  themeToDark: { bg: "Тъмна тема", en: "Dark theme" },
  themeToLight: { bg: "Светла тема", en: "Light theme" },
  footerNote: {
    bg: "* Пилот · не е официален СУ · допълва СУСИ/elearn/Архимед · без истински SSO",
    en: "* Pilot · not official SU · complements SUSI/elearn/Arhimed · no real SSO",
  },
} as const;

export type DictKey = keyof typeof dict;

export function t(key: DictKey, lang: Lang): string {
  return dict[key][lang];
}

export function pickLang(v?: string | null): Lang {
  return v === "en" ? "en" : "bg";
}

export function statusLabel(status: string, lang: Lang): string {
  const key = `status_${status}` as DictKey;
  if (key in dict) return t(key, lang);
  return status;
}
