import type { Lang } from "./types";

const dict = {
  siteName: { bg: "УниСофия Портал*", en: "UniSofia Portal*" },
  tagline: {
    bg: "Сатиричен демо-портал за студенти, които са уморени от имейл пинг-понг",
    en: "A satirical demo portal for anyone tired of email ping-pong",
  },
  notOfficial: {
    bg: "Не е официален сайт на СУ. Само мем и демонстрация.",
    en: "Not an official Sofia University site. Meme + demo only.",
  },
  navHome: { bg: "Начало", en: "Home" },
  navOnboarding: { bg: "Кой съм аз?", en: "Who am I?" },
  navDashboard: { bg: "Табло", en: "Dashboard" },
  navForms: { bg: "Форми", en: "Forms" },
  navInbox: { bg: "Входящи", en: "Inbox" },
  navManifesto: { bg: "Манифест", en: "Manifesto" },
  navDisclaimer: { bg: "Дисклеймър", en: "Disclaimer" },
  ctaStart: { bg: "Избери роля и факултет", en: "Pick role & faculty" },
  ctaDashboard: { bg: "Към таблото", en: "Go to dashboard" },
  ctaForms: { bg: "Каталог форми", en: "Forms catalog" },
  landingHero: {
    bg: "Добре дошли в портала, който бихме искали да съществува",
    en: "Welcome to the portal we wish existed",
  },
  landingSub: {
    bg: "Софийският университет е прекрасен. Бюрокрацията му — също легендарна. Този сайт е любезен roast + работещо демо за студентски/админ портал.",
    en: "Sofia University is wonderful. Its bureaucracy is also legendary. This site is an affectionate roast + a working student/admin portal demo.",
  },
  painTitle: { bg: "Болките, които познаваме", en: "Pains we know too well" },
  pain1t: { bg: "Бланки по имейл", en: "Blank forms by email" },
  pain1d: {
    bg: "„Пратих ти бланката.“ „Коя?“ „Тази в прикачения файл от 2014.“",
    en: "„I sent you the form.“ „Which one?“ „The 2014 attachment.“",
  },
  pain2t: { bg: "Няма собственик", en: "No owner" },
  pain2d: {
    bg: "Всеки казва „не при нас“. Процесът е сирак с три печата.",
    en: "Everyone says „not us“. The process is an orphan with three stamps.",
  },
  pain3t: { bg: "Всеки факултет — свой свят", en: "Every faculty is its own planet" },
  pain3d: {
    bg: "16+ сайта, 16+ истини, една обща папка „важно_финал_FINAL2.doc“.",
    en: "16+ sites, 16+ truths, one shared folder called important_FINAL2.doc.",
  },
  pain4t: { bg: "Имейл пинг-понг", en: "Email ping-pong" },
  pain4d: {
    bg: "CC: всички. Reply-all: още повече. Решението: „елте на гише“.",
    en: "CC: everyone. Reply-all: more everyone. Resolution: „come to the desk“.",
  },
  howTitle: { bg: "Как работи демото", en: "How the demo works" },
  how1: { bg: "Избери роля и факултет", en: "Pick a role and faculty" },
  how2: { bg: "Виж само релевантни форми и връзки", en: "See only relevant forms & links" },
  how3: { bg: "Попълни и „изпрати“ — генерира се билет", en: "Fill & „submit“ — get a ticket" },
  how4: { bg: "Служителите виждат входящата кутия", en: "Staff see an inbox of submissions" },
  onboardingTitle: { bg: "Кажи ни кой си (за демото)", en: "Tell us who you are (for the demo)" },
  onboardingHint: {
    bg: "Записваме ролята и факултета в cookie/localStorage. Без истински вход в СУ.",
    en: "We store role & faculty in cookie/localStorage. No real university login.",
  },
  roleLabel: { bg: "Роля", en: "Role" },
  facultyLabel: { bg: "Факултет", en: "Faculty" },
  nameLabel: { bg: "Име (по желание)", en: "Name (optional)" },
  emailLabel: { bg: "Имейл (симулиран)", en: "Email (simulated)" },
  savePersona: { bg: "Запази и продължи", en: "Save & continue" },
  changePersona: { bg: "Смени ролята", en: "Change persona" },
  dashboardTitle: { bg: "Твоето табло", en: "Your dashboard" },
  dashboardHello: { bg: "Здравей", en: "Hello" },
  relevantForms: { bg: "Релевантни форми", en: "Relevant forms" },
  quickLinks: { bg: "Бързи връзки (демо)", en: "Quick links (demo)" },
  noPersona: {
    bg: "Още не си избрал роля. Започни от онбординга.",
    en: "You haven’t picked a role yet. Start with onboarding.",
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
  inboxTitle: { bg: "Входяща кутия (персонал)", en: "Staff inbox" },
  inboxEmpty: { bg: "Няма подадени форми още. Бъди първият бюрократ на бъдещето.", en: "No submissions yet. Be the first bureaucrat of the future." },
  inboxStaffOnly: {
    bg: "Входящата кутия е за преподаватели и админ персонал. Смени ролята, ако искаш да разгледаш.",
    en: "Inbox is for lecturers and admin staff. Change persona to peek.",
  },
  ticket: { bg: "Билет", en: "Ticket" },
  status: { bg: "Статус", en: "Status" },
  submittedAt: { bg: "Подадено", en: "Submitted" },
  fromRole: { bg: "От роля", en: "From role" },
  manifestoTitle: { bg: "Манифест", en: "Manifesto" },
  disclaimerTitle: { bg: "Дисклеймър", en: "Disclaimer" },
  satireBadge: { bg: "Сатира", en: "Satire" },
  category: { bg: "Категория", en: "Category" },
  viewInbox: { bg: "Отвори входящи", en: "Open inbox" },
  officialLink: { bg: "Официален сайт на СУ", en: "Official SU website" },
  status_received: { bg: "Получено", en: "Received" },
  status_in_review: { bg: "В обработка", en: "In review" },
  status_ping_pong: { bg: "Имейл пинг-понг", en: "Email ping-pong" },
  status_done: { bg: "Готово (легенда)", en: "Done (legendary)" },
  required: { bg: "задължително", en: "required" },
  allFaculties: { bg: "Всички факултети", en: "All faculties" },
  footerNote: {
    bg: "* Любезен roast · демо · без истински SSO · без истински имейли",
    en: "* Affectionate roast · demo · no real SSO · no real emails",
  },
} as const;

export type DictKey = keyof typeof dict;

export function t(key: DictKey, lang: Lang): string {
  return dict[key][lang];
}

export function pickLang(v?: string | null): Lang {
  return v === "en" ? "en" : "bg";
}
