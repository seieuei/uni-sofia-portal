export type HubLink = { href: string; titleBg: string; titleEn: string; external?: boolean };

export type HubSection = {
  slug: string;
  titleBg: string;
  titleEn: string;
  leadBg: string;
  leadEn: string;
  bodyBg: string[];
  bodyEn: string[];
  links?: HubLink[];
};

export type FacultyHub = {
  slug: string;
  facultyCode: string;
  shortBg: string;
  shortEn: string;
  titleBg: string;
  titleEn: string;
  missionBg: string;
  missionEn: string;
  officialUrl: string;
  addressBg: string[];
  addressEn: string[];
  emails: { labelBg: string; labelEn: string; email: string }[];
  news: { titleBg: string; titleEn: string; href: string }[];
  departments: { titleBg: string; titleEn: string }[];
  programsBa: { titleBg: string; titleEn: string; href: string }[];
  programsMa: { titleBg: string; titleEn: string; href: string }[];
  sections: HubSection[];
};

export const HUB_SECTION_ORDER = [
  "about",
  "news",
  "incoming-ba",
  "admissions",
  "schedules",
  "doctoral",
  "graduation",
  "mobility",
  "orgs",
  "libraries",
  "contacts",
  "departments",
] as const;

const FCML_SECTIONS: HubSection[] = [
  {
    slug: "about",
    titleBg: "За факултета",
    titleEn: "About the faculty",
    leadBg: "ФКНФ обучава по класически и съвременни филологии — от латински и старогръцки до африкански, азиатски и европейски езици.",
    leadEn: "FCML teaches classical and modern philologies — from Latin and Ancient Greek to African, Asian and European languages.",
    bodyBg: [
      "Мисията е да поддържа висока езикова, литературна и културологична подготовка и да свързва филологиите с международната мобилност.",
      "Пилотният портал тръгва от програмата Африканистика, без да замества официалния сайт на факултета.",
    ],
    bodyEn: [
      "The mission is high-level language, literature and cultural training, tied to international mobility.",
      "This pilot starts from African Studies and does not replace the official faculty site.",
    ],
  },
  {
    slug: "news",
    titleBg: "Новини и събития",
    titleEn: "News and events",
    leadBg: "Куки към обяви — не е пълна лента на живо.",
    leadEn: "Hooks to notices — not a live feed.",
    bodyBg: [
      "Следвай официалния канал на ФКНФ за конкурси, конференции и срокове.",
      "В портала ключовите дати влизат в седмичния календар (лекции, дедлайни, факултетни събития).",
    ],
    bodyEn: [
      "Follow the official FCML channel for contests, conferences and deadlines.",
      "In the portal, key dates appear on the week calendar (lectures, deadlines, faculty events).",
    ],
    links: [{ href: "https://www.uni-sofia.bg", titleBg: "Новини на СУ", titleEn: "SU news", external: true }],
  },
  {
    slug: "incoming-ba",
    titleBg: "За новоприетите бакалаври",
    titleEn: "For newly admitted BA students",
    leadBg: "Често задавани въпроси преди първия семестър.",
    leadEn: "FAQ before the first semester.",
    bodyBg: [
      "Регистрирай се в СУСИ и elearn, когато деканатът изпрати данните. Факултетният номер идва при записване.",
      "Разписанието се обявява от отдел „Студенти“ / учебна комисия. Избираемите се отварят в прозорец — виж Академичния стол.",
      "При въпрос за такса, общежитие или здравна книжка — гишето в деканата, не работният каталог на портала.",
    ],
    bodyEn: [
      "Register in SUSI and elearn when the dean's office sends credentials. The faculty number comes at enrolment.",
      "The timetable is published by Student Affairs / the study commission. Electives open in a window — see the academic desk.",
      "Fees, dorms and health cards are handled at the dean's office desk, not in the work catalogue.",
    ],
    links: [
      { href: "/admissions", titleBg: "Навигатор кандидатстване", titleEn: "Admissions guide" },
      { href: "/journey", titleBg: "Пътека на студента", titleEn: "Student journey" },
    ],
  },
  {
    slug: "admissions",
    titleBg: "Прием — бакалавър и магистър",
    titleEn: "Admissions — BA and MA",
    leadBg: "Бакалавърският прием следва централния правилник и Приложение №2. Магистърският е по правила на ФКНФ.",
    leadEn: "Bachelor admissions follow the central rules and Appendix 2. Master's follow FCML rules.",
    bodyBg: [
      "Разгледай специалностите на ФКНФ с изпити, ДЗИ и предмети от дипломата.",
      "Магистърските програми имат отделно балообразуване — не ползвай бакалавърския каталог като формула за МП.",
    ],
    bodyEn: [
      "Browse FCML programmes with exams, ДЗИ and diploma subjects.",
      "Master's programmes have their own score rules — do not reuse the bachelor catalogue as an MA formula.",
    ],
    links: [
      { href: "/admissions/faculties/FCML", titleBg: "Бакалавърски специалности ФКНФ", titleEn: "FCML bachelor programmes" },
      { href: "/admissions/masters", titleBg: "За магистърския прием", titleEn: "About Master's admissions" },
    ],
  },
  {
    slug: "schedules",
    titleBg: "Разписания и учебни процедури",
    titleEn: "Schedules and academic procedures",
    leadBg: "За студенти: график, избраеми, прекъсване, молби.",
    leadEn: "For students: timetable, electives, leave, petitions.",
    bodyBg: [
      "Седмичното разписание на пилота Африканистика е в „Моята седмица“ и „Курсове“.",
      "Административни молби (прекъсване, справка, поправителен) са в каталога процеси — не във факултетния хъб.",
    ],
    bodyEn: [
      "The African Studies pilot timetable lives in My week and Courses.",
      "Administrative petitions (leave, transcript, resit) are in the process catalogue — not on this hub.",
    ],
    links: [
      { href: "/week", titleBg: "Моята седмица", titleEn: "My week" },
      { href: "/cases/new", titleBg: "Каталог процеси", titleEn: "Process catalogue" },
    ],
  },
  {
    slug: "doctoral",
    titleBg: "Докторанти",
    titleEn: "Doctoral students",
    leadBg: "Процедури и срокове за ОНС „доктор“ — отделни от бакалавър/магистър.",
    leadEn: "PhD procedures and deadlines — separate from BA/MA.",
    bodyBg: [
      "Докторантските бланки са в хъба „Докторантура“ на каталога.",
      "За конкурси и атестации следи заповедите на факултета и зам.-декана по НИД.",
    ],
    bodyEn: [
      "Doctoral blanks are in the Doctoral hub of the process catalogue.",
      "Contests and attestations follow faculty orders and the vice-dean for research.",
    ],
  },
  {
    slug: "graduation",
    titleBg: "Дипломиране и държавни изпити",
    titleEn: "Graduation and state exams",
    leadBg: "Дати, комисии и процедури по защита / ДИ.",
    leadEn: "Dates, commissions and thesis / state-exam procedures.",
    bodyBg: [
      "Държавният изпит и защитата се обявяват със заповед. Учебният план на Африканистика включва подготовка в VIII семестър.",
      "Процедурите по дипломиране минават през отдел „Студенти“ и учебната комисия.",
    ],
    bodyEn: [
      "The state exam and defence are announced by order. The African Studies plan includes preparation in semester 8.",
      "Graduation procedures go through Student Affairs and the study commission.",
    ],
    links: [{ href: "/programs/african-studies-ba", titleBg: "Учебен план Африканистика", titleEn: "African Studies curriculum" }],
  },
  {
    slug: "mobility",
    titleBg: "Мобилност / Еразъм",
    titleEn: "Mobility / Erasmus",
    leadBg: "Координация при зам.-декана по международна дейност.",
    leadEn: "Coordinated by the vice-dean for international affairs.",
    bodyBg: [
      "Еразъм+ за студенти, докторанти и преподаватели. Двустранни договори по филологии.",
      "Преди кандидатстване провери признаването на кредити с програмата (Африканистика / съответната филология).",
    ],
    bodyEn: [
      "Erasmus+ for students, doctoral researchers and staff. Bilateral agreements by philology.",
      "Before applying, check credit recognition with your programme (African Studies / the relevant philology).",
    ],
  },
  {
    slug: "orgs",
    titleBg: "Студентски организации",
    titleEn: "Student organisations",
    leadBg: "Представителство и клубове към факултета.",
    leadEn: "Representation and faculty clubs.",
    bodyBg: [
      "Студентският съвет има квота във факултетните органи.",
      "Програмните клубове (езици, превод, африканистика) се обявяват в началото на годината.",
    ],
    bodyEn: [
      "The Student Council has a quota in faculty bodies.",
      "Programme clubs (languages, translation, African studies) are announced at the start of the year.",
    ],
  },
  {
    slug: "libraries",
    titleBg: "Библиотеки",
    titleEn: "Libraries",
    leadBg: "Университетска библиотека и филологически фондове.",
    leadEn: "University Library and philology collections.",
    bodyBg: [
      "Централна университетска библиотека „Св. Климент Охридски“ и филиали за филологии.",
      "Подновяване на срок — процес в каталога (библиотечна бланка).",
    ],
    bodyEn: [
      "St. Kliment Ohridski University Library and philology branches.",
      "Loan renewal is a process in the catalogue (library blank).",
    ],
  },
  {
    slug: "contacts",
    titleBg: "Контакти и адреси",
    titleEn: "Contacts and addresses",
    leadBg: "Деканат в Ректората — пълен списък на зам.-деканите с приемно време.",
    leadEn: "Dean's office in the Rectorate — full vice-dean list with office hours.",
    bodyBg: [
      "София, Ректорат, централно крило, каб. 231 (деканат) / 232 (декан и зам.-декани).",
      "Декан — проф. д-р Гергана Петкова, каб. 232 · dekanat@fcml.uni-sofia.bg",
      "Зам.-декан учебна дейност — доц. д-р Галина Евстатиева · g.evstatieva@uni-sofia.bg · прием: сряда 12:30–14:00",
      "Зам.-декан НИД и академично израстване — доц. д-р Лиляна Лесничкова · l.lesnichkova@uni-sofia.bg · прием: четвъртък 14:30–16:00",
      "Зам.-декан проекти — проф. д-р Милена Йорданова · m.yordanova@uni-sofia.bg · прием: петък 14:30–16:00",
      "Зам.-декан международна дейност и Еразъм — проф. д-р Петър Моллов · p.mollov@uni-sofia.bg · прием: понеделник 13:00–14:30",
      "Помощник информационни въпроси — гл. ас. д-р Симеон Хинковски · каб. 232 · прием: четвъртък 10:00–11:30",
    ],
    bodyEn: [
      "Sofia, Rectorate, central wing, rooms 231 (dean's office) / 232 (dean and vice-deans).",
      "Dean — Prof. Gergana Petkova, PhD, room 232 · dekanat@fcml.uni-sofia.bg",
      "Vice-dean for education — Assoc. Prof. Galina Evstatieva · g.evstatieva@uni-sofia.bg · hours: Wed 12:30–14:00",
      "Vice-dean for research — Assoc. Prof. Lilyana Lesnichkova · l.lesnichkova@uni-sofia.bg · hours: Thu 14:30–16:00",
      "Vice-dean for projects — Prof. Milena Yordanova · m.yordanova@uni-sofia.bg · hours: Fri 14:30–16:00",
      "Vice-dean for international / Erasmus — Prof. Petar Mollov · p.mollov@uni-sofia.bg · hours: Mon 13:00–14:30",
      "Assistant for information — Assist. Prof. Simeon Hinkovski · room 232 · hours: Thu 10:00–11:30",
    ],
    links: [
      { href: "/contacts#fcml", titleBg: "Контакти — ФКНФ и централна администрация", titleEn: "Contacts — FCML and central admin" },
      { href: "/contacts#central", titleBg: "Централна администрация", titleEn: "Central administration" },
    ],
  },
  {
    slug: "departments",
    titleBg: "Катедри и програми",
    titleEn: "Departments and programmes",
    leadBg: "Бакалавърските и магистърските програми на ФКНФ.",
    leadEn: "FCML bachelor and master's programmes.",
    bodyBg: [
      "Катедрите покриват класически изток, класическа филология, англицистика и американистика, романистика, германистика, източни филологии и др.",
      "Отвори програма, за да видиш учебен план — пълен УчПлан има за Африканистика.",
    ],
    bodyEn: [
      "Departments cover Classical East, Classical Philology, English and American Studies, Romance, German, Eastern philologies, and more.",
      "Open a programme to see its curriculum — a full UchPlan is available for African Studies.",
    ],
  },
];

const PHLS_SECTIONS: HubSection[] = [
  {
    slug: "about",
    titleBg: "За факултета",
    titleEn: "About the faculty",
    leadBg: "Философският факултет е ядро на хуманитарната и социалната подготовка в СУ.",
    leadEn: "The Faculty of Philosophy is a core of humanities and social-science training at SU.",
    bodyBg: [
      "Мисията на колегията е да изучава и предава човешкия опит в хуманитарната, социалната и политическата сфера.",
      "Факултетът се отличава с академична свобода и граждански ангажимент. Структурата на този хъб следва публичната IA на phls.uni-sofia.bg.",
    ],
    bodyEn: [
      "The community’s mission is to study and transmit human experience in the humanities, social and political spheres.",
      "The faculty is known for academic freedom and civic engagement. This hub follows the public IA of phls.uni-sofia.bg.",
    ],
  },
  {
    slug: "news",
    titleBg: "Новини и събития",
    titleEn: "News and events",
    leadBg: "Събития, конференции, анкети за качество.",
    leadEn: "Events, conferences, quality surveys.",
    bodyBg: [
      "На официалния сайт: анкета за удовлетвореността, събития и конференции, предложения за практики и стажове.",
      "Тук държим куки — не дублираме цялата лента.",
    ],
    bodyEn: [
      "On the official site: satisfaction survey, events and conferences, internship and job offers.",
      "Here we keep hooks — we do not mirror the whole feed.",
    ],
    links: [{ href: "https://phls.uni-sofia.bg", titleBg: "phls.uni-sofia.bg", titleEn: "phls.uni-sofia.bg", external: true }],
  },
  {
    slug: "incoming-ba",
    titleBg: "За новоприетите бакалаври — ЧЗВ",
    titleEn: "Newly admitted BA — FAQ",
    leadBg: "Уважаеми първокурсници — регистрациите са малко преди началото на годината.",
    leadEn: "First-years — complete registrations shortly before the year starts.",
    bodyBg: [
      "Запознай се с отговорите на най-често задаваните въпроси на сайта на ФФ преди да пишеш на администратор.",
      "Контактите и отговорностите на инспекторите са на phls.uni-sofia.bg. Порталът не замества тяхното гише.",
    ],
    bodyEn: [
      "Read the Faculty of Philosophy FAQ on the official site before writing to an administrator.",
      "Inspector contacts and duties are on phls.uni-sofia.bg. This portal does not replace their desk.",
    ],
    links: [{ href: "https://phls.uni-sofia.bg", titleBg: "ЧЗВ на ФФ", titleEn: "PHLS FAQ", external: true }],
  },
  {
    slug: "admissions",
    titleBg: "Прием — бакалавър и магистър",
    titleEn: "Admissions — BA and MA",
    leadBg: "Бакалавър — централна кампания. Магистър — собствен портал на ФФ.",
    leadEn: "Bachelor — central campaign. Master's — PHLS portal.",
    bodyBg: [
      "Бакалавърските специалности на ФФ са попълнени в навигатора (философия, психология, социология, политология и др.).",
      "Допълнителният прием за магистър се обявява отделно — регистрация на магистърския сайт на ФФ (пример: срок до 05 октомври 2026 за кампания 2026/27).",
    ],
    bodyEn: [
      "PHLS bachelor programmes are filled in the navigator (philosophy, psychology, sociology, political science, and more).",
      "The extra Master's intake is announced separately — register on the PHLS MA site (e.g. by 5 October 2026 for 2026/27).",
    ],
    links: [
      { href: "/admissions/faculties/FFIL", titleBg: "Бакалавърски специалности ФФ", titleEn: "PHLS bachelor programmes" },
      { href: "/admissions/masters", titleBg: "Магистър — отделни правила", titleEn: "Master's — separate rules" },
      { href: "https://phls.uni-sofia.bg", titleBg: "Магистърски портал ФФ", titleEn: "PHLS MA portal", external: true },
    ],
  },
  {
    slug: "schedules",
    titleBg: "Графици, разписи и учебни срокове",
    titleEn: "Timetables and academic deadlines",
    leadBg: "Студентски учебни процедури и срокове — както на phls.uni-sofia.bg.",
    leadEn: "Student academic procedures and deadlines — as on phls.uni-sofia.bg.",
    bodyBg: [
      "Графици и разписи, учебни процедури и срокове за студенти се публикуват от факултета.",
      "Електронни ресурси и регистрации — по указанията на инспекторите.",
    ],
    bodyEn: [
      "Timetables and student academic deadlines are published by the faculty.",
      "Electronic resources and registrations follow the inspectors’ instructions.",
    ],
  },
  {
    slug: "doctoral",
    titleBg: "Учебни процедури — докторанти",
    titleEn: "Doctoral academic procedures",
    leadBg: "Отделен ред за докторанти, както е на сайта на ФФ.",
    leadEn: "A separate track for doctoral students, as on the PHLS site.",
    bodyBg: [
      "Срокове за атестация, изпити от индивидуалния план и защити се обявяват факултетно.",
      "Бланките за докторантура са в работния каталог на портала.",
    ],
    bodyEn: [
      "Attestation, individual-plan exams and defences are announced by the faculty.",
      "Doctoral blanks are in the portal’s work catalogue.",
    ],
  },
  {
    slug: "graduation",
    titleBg: "Държавни изпити, защити и дипломиране",
    titleEn: "State exams, defences and graduation",
    leadBg: "Дати на държавни изпити и защити; процедури по дипломиране.",
    leadEn: "State-exam and defence dates; graduation procedures.",
    bodyBg: [
      "Следвай обявените дати на ФФ. Комисиите и документите минават през съответния инспектор.",
    ],
    bodyEn: [
      "Follow the dates published by PHLS. Commissions and papers go through the relevant inspector.",
    ],
  },
  {
    slug: "mobility",
    titleBg: "Мобилност",
    titleEn: "Mobility",
    leadBg: "Еразъм+ за студенти, докторанти и академичен състав; други мобилности.",
    leadEn: "Erasmus+ for students, doctoral researchers and academic staff; other mobilities.",
    bodyBg: ["Координацията е към факултетния Еразъм екип. Признаването на кредити се съгласува с програмата."],
    bodyEn: ["Coordination sits with the faculty Erasmus team. Credit recognition is agreed with the programme."],
  },
  {
    slug: "orgs",
    titleBg: "Студентски организации и клубове",
    titleEn: "Student organisations and clubs",
    leadBg: "Както на официалния сайт на ФФ.",
    leadEn: "As listed on the official PHLS site.",
    bodyBg: [
      "Студентски съвет; Студентски клуб на политолога; Клуб „Публична администрация“; Клуб „Европеистика“; Студентски философски семинар „Разсадника“; Клуб „Психологически колегиум“; Културоложки клуб „Пайдея“.",
    ],
    bodyEn: [
      "Student Council; Political Science club; Public Administration club; European Studies club; philosophy seminar “Razsadnika”; Psychological Collegium; culturology club “Paideia”.",
    ],
  },
  {
    slug: "libraries",
    titleBg: "Библиотеки",
    titleEn: "Libraries",
    leadBg: "Университетска библиотека и филиални библиотеки на ФФ.",
    leadEn: "University Library and PHLS branch libraries.",
    bodyBg: ["Филиалите обслужват философия, психология, социология и сродните програми."],
    bodyEn: ["Branches serve philosophy, psychology, sociology and related programmes."],
  },
  {
    slug: "contacts",
    titleBg: "Контакти и адреси",
    titleEn: "Contacts and addresses",
    leadBg: "Два корпуса — както на phls.uni-sofia.bg.",
    leadEn: "Two sites — as on phls.uni-sofia.bg.",
    bodyBg: [
      "1504 София, бул. „Цар Освободител“ 15.",
      "1113 София, бул. „Цариградско шосе“ 125.",
      "Етична комисия и инспектори — на официалния сайт.",
    ],
    bodyEn: [
      "15 Tsar Osvoboditel Blvd, 1504 Sofia.",
      "125 Tsarigradsko shose Blvd, 1113 Sofia.",
      "Ethics commission and inspectors — on the official site.",
    ],
  },
  {
    slug: "departments",
    titleBg: "Катедри и програми",
    titleEn: "Departments and programmes",
    leadBg: "Философия, психология, социология, политология, ПА, културология, европеистика, БИН.",
    leadEn: "Philosophy, psychology, sociology, political science, PA, cultural studies, European studies, LIS.",
    bodyBg: ["Специалностите предлагат и следдипломна квалификация, проекти и експертна дейност."],
    bodyEn: ["Programmes also offer continuing education, projects and expert work."],
  },
];

export const FACULTY_HUBS: FacultyHub[] = [
  {
    slug: "fcml",
    facultyCode: "FCML",
    shortBg: "ФКНФ",
    shortEn: "FCML",
    titleBg: "Факултет по класически и нови филологии",
    titleEn: "Faculty of Classical and Modern Philology",
    missionBg: "Класически и съвременни филологии; пилотна програма Африканистика.",
    missionEn: "Classical and modern philologies; African Studies pilot programme.",
    officialUrl: "https://www.uni-sofia.bg",
    addressBg: ["Ректорат, централно крило, каб. 231", "София"],
    addressEn: ["Rectorate, central wing, room 231", "Sofia"],
    emails: [
      { labelBg: "Деканат", labelEn: "Dean's office", email: "dekanat@fcml.uni-sofia.bg" },
    ],
    news: [
      { titleBg: "Приемна кампания — балообразуване ФКНФ", titleEn: "Admissions campaign — FCML scores", href: "/admissions/faculties/FCML" },
      { titleBg: "Учебен план Африканистика (УчПлан)", titleEn: "African Studies curriculum (UchPlan)", href: "/programs/african-studies-ba" },
    ],
    departments: [
      { titleBg: "Класическа филология", titleEn: "Classical Philology" },
      { titleBg: "Англицистика и американистика", titleEn: "English and American Studies" },
      { titleBg: "Романистика", titleEn: "Romance Studies" },
      { titleBg: "Германистика и скандинавистика", titleEn: "German and Scandinavian Studies" },
      { titleBg: "Източни филологии / африканистика", titleEn: "Eastern philologies / African Studies" },
    ],
    programsBa: [
      { titleBg: "Африканистика", titleEn: "African Studies", href: "/programs/african-studies-ba" },
      { titleBg: "Англицистика", titleEn: "English Studies", href: "/admissions/specialties/anglicistika" },
      { titleBg: "Класическа филология", titleEn: "Classical Philology", href: "/admissions/specialties/klasicheska" },
    ],
    programsMa: [
      { titleBg: "Език и науки за езика (английски)", titleEn: "Language and language sciences (English)", href: "/admissions/masters" },
      { titleBg: "Конферентен превод", titleEn: "Conference interpreting", href: "/admissions/masters" },
    ],
    sections: FCML_SECTIONS,
  },
  {
    slug: "phls",
    facultyCode: "FFIL",
    shortBg: "ФФ",
    shortEn: "PHLS",
    titleBg: "Философски факултет",
    titleEn: "Faculty of Philosophy",
    missionBg: "Хуманитарна, социална и политическа сфера — по модела на phls.uni-sofia.bg.",
    missionEn: "Humanities, social and political fields — modelled on phls.uni-sofia.bg.",
    officialUrl: "https://phls.uni-sofia.bg",
    addressBg: ["бул. „Цар Освободител“ 15, 1504 София", "бул. „Цариградско шосе“ 125, 1113 София"],
    addressEn: ["15 Tsar Osvoboditel Blvd, 1504 Sofia", "125 Tsarigradsko shose Blvd, 1113 Sofia"],
    emails: [{ labelBg: "Факултет", labelEn: "Faculty", email: "info@phls.uni-sofia.bg" }],
    news: [
      { titleBg: "ЧЗВ за новоприети бакалаври", titleEn: "FAQ for newly admitted BA students", href: "/faculties/phls/incoming-ba" },
      { titleBg: "Допълнителен прием магистър 2026/27", titleEn: "Extra Master's intake 2026/27", href: "/admissions/masters" },
    ],
    departments: [
      { titleBg: "Философия", titleEn: "Philosophy" },
      { titleBg: "Психология", titleEn: "Psychology" },
      { titleBg: "Социология", titleEn: "Sociology" },
      { titleBg: "Политология", titleEn: "Political Science" },
      { titleBg: "Публична администрация", titleEn: "Public Administration" },
      { titleBg: "Културология", titleEn: "Cultural Studies" },
      { titleBg: "Европеистика", titleEn: "European Studies" },
      { titleBg: "Библиотечно-информационни науки", titleEn: "Library and Information Sciences" },
    ],
    programsBa: [
      { titleBg: "Философия", titleEn: "Philosophy", href: "/admissions/specialties/filosofiya" },
      { titleBg: "Психология", titleEn: "Psychology", href: "/admissions/specialties/psihologiya" },
      { titleBg: "Социология", titleEn: "Sociology", href: "/admissions/specialties/sotsiologiya" },
      { titleBg: "Политология", titleEn: "Political Science", href: "/admissions/specialties/politologiya" },
    ],
    programsMa: [{ titleBg: "Магистърски програми на ФФ", titleEn: "PHLS Master's programmes", href: "/admissions/masters" }],
    sections: PHLS_SECTIONS,
  },
];

export function getHub(slug: string): FacultyHub | undefined {
  return FACULTY_HUBS.find((h) => h.slug === slug || h.facultyCode === slug);
}

export function hubByFacultyCode(code: string): FacultyHub | undefined {
  return FACULTY_HUBS.find((h) => h.facultyCode === code);
}

export function getHubSection(hub: FacultyHub, slug: string): HubSection | undefined {
  return hub.sections.find((s) => s.slug === slug);
}
