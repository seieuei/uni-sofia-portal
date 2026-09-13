import type { Lang } from "@/lib/types";

export type GuideBlock =
  | { type: "p"; bg: string; en: string }
  | { type: "h2"; bg: string; en: string }
  | { type: "ul"; items: { bg: string; en: string }[] }
  | { type: "callout"; bg: string; en: string }
  | { type: "formula"; bg: string; en: string };

export type GuidePage = {
  slug: string;
  titleBg: string;
  titleEn: string;
  leadBg: string;
  leadEn: string;
  blocks: GuideBlock[];
};

export const ADMISSIONS_NAV: { href: string; titleBg: string; titleEn: string }[] = [
  { href: "/admissions", titleBg: "Преглед и ориентиране", titleEn: "Overview" },
  { href: "/admissions/eligibility", titleBg: "Кой може да кандидатства", titleEn: "Eligibility" },
  { href: "/admissions/score", titleBg: "Как се образува балът", titleEn: "Competitive score" },
  { href: "/admissions/timeline", titleBg: "Етапи и класирания", titleEn: "Timeline & ranking" },
  { href: "/admissions/faculties", titleBg: "По факултет и специалност", titleEn: "Browse faculties" },
  { href: "/admissions/masters", titleBg: "Магистър — отделни правила", titleEn: "Master's — separate rules" },
];

export function guideTitle(page: GuidePage, lang: Lang) {
  return lang === "bg" ? page.titleBg : page.titleEn;
}

export const GUIDE_PAGES: GuidePage[] = [
  {
    slug: "overview",
    titleBg: "Кандидатстване в СУ — пилотен навигатор",
    titleEn: "Applying to SU — pilot navigator",
    leadBg:
      "Структуриран преглед на Правилника за приемане на студенти (бакалавър) и Приложение №2 за балообразуване. Не замества официалния сайт и заповедите за кампанията.",
    leadEn:
      "A structured reading of the bachelor admissions rules and Appendix 2 (score coefficients). Does not replace the official site or campaign orders.",
    blocks: [
      {
        type: "callout",
        bg: "Това е пилотна база знания. Текстовете са перифразирани за навигация — не са правно заверен препис. При противоречие важи официалният акт на СУ.",
        en: "This is a pilot knowledge base. Texts are paraphrased for navigation — not a certified legal transcript. The official SU act prevails.",
      },
      {
        type: "h2",
        bg: "Какво ще намериш тук",
        en: "What you will find here",
      },
      {
        type: "ul",
        items: [
          {
            bg: "Условия за кандидатстване за завършили средно образование в България / ЕС.",
            en: "Eligibility for secondary-school graduates from Bulgaria / the EU.",
          },
          {
            bg: "Ясно обяснение на балообразуването: изпит или ДЗИ × коефициент + оценки от дипломата.",
            en: "How the competitive score is built: exam or ДЗИ × coefficient + diploma grades.",
          },
          {
            bg: "Каталог по факултет → специалност → форма (редовна / задочна) с изпити и предмети от дипломата.",
            en: "Browse faculty → programme → form (full-time / part-time) with exams and diploma subjects.",
          },
          {
            bg: "Етапи на класиране и записване — от подаване до последно класиране.",
            en: "Ranking and enrolment stages — from application to the last ranking.",
          },
          {
            bg: "Отделен раздел за магистър: собствени правила, срокове и портали.",
            en: "A separate Master's note: own rules, dates and portals.",
          },
        ],
      },
      {
        type: "h2",
        bg: "Пълен обхват в пилота",
        en: "Pilot coverage",
      },
      {
        type: "p",
        bg: "ФКНФ и Философският факултет са попълнени достатъчно, за да се обходи целият път. Останалите факултети имат индекс по заглавията на Приложение №2 — детайлите се допълват.",
        en: "FCML and the Faculty of Philosophy are filled enough to walk the whole path. Other faculties have an index from Appendix 2 headers — details come later.",
      },
      {
        type: "p",
        bg: "Официални източници: кандидатстудентски сайт на СУ, правилник за прием, заповед за кампанията, факултетните страници.",
        en: "Official sources: SU admissions site, the admissions rules, the campaign order, faculty pages.",
      },
    ],
  },
  {
    slug: "eligibility",
    titleBg: "Условия за кандидатстване",
    titleEn: "Eligibility",
    leadBg:
      "Правилникът урежда приема на български граждани и граждани на държави от ЕС / ЕИП, завършили средно образование, в ОКС „бакалавър“ и „магистър“ след средно образование.",
    leadEn:
      "The rules cover Bulgarian and EU/EEA citizens who have completed secondary education, applying for a bachelor's (and integrated master's after secondary school).",
    blocks: [
      {
        type: "h2",
        bg: "Кой има право",
        en: "Who may apply",
      },
      {
        type: "ul",
        items: [
          {
            bg: "Лица с диплома за средно образование или равностоен документ, признат в България.",
            en: "Holders of a secondary-school diploma or an equivalent document recognised in Bulgaria.",
          },
          {
            bg: "Български граждани; граждани на държави — членки на ЕС и на ЕИП; лица с постоянно пребиваване при условията на закона.",
            en: "Bulgarian citizens; EU and EEA citizens; persons with permanent residence under the law.",
          },
          {
            bg: "Кандидатът може да участва в класирането за държавна поръчка и/или в платено обучение — според квотите за специалността.",
            en: "Applicants may compete for state-funded places and/or paid tuition, according to the programme quotas.",
          },
        ],
      },
      {
        type: "h2",
        bg: "Документи (типичен пакет)",
        en: "Documents (typical pack)",
      },
      {
        type: "ul",
        items: [
          { bg: "Заявление по образец / електронна регистрация в кампанията.", en: "Application form / electronic registration in the campaign." },
          { bg: "Диплома за средно образование (или служебна бележка до издаването ѝ).", en: "Secondary-school diploma (or a temporary certificate until it is issued)." },
          { bg: "Документ за самоличност; снимки, ако кампанията ги изисква.", en: "ID document; photos if the campaign requires them." },
          { bg: "Документ за платена такса за кандидатстване.", en: "Proof of the application fee." },
          { bg: "Допълнителни сертификати само когато специалността ги иска (език, олимпиада, и т.н.).", en: "Extra certificates only when the programme asks for them (language, olympiad, etc.)." },
        ],
      },
      {
        type: "h2",
        bg: "Квоти и места",
        en: "Quotas and places",
      },
      {
        type: "p",
        bg: "Броят на местата по специалности и форми на обучение се утвърждава ежегодно. Има държавна поръчка и платено обучение; някои специалности имат и задочна форма. Класирането е отделно по форма и по вид финансиране, когато правилникът го предвижда.",
        en: "Places per programme and form of study are approved each year. There are state-funded and paid tracks; some programmes also have a part-time form. Ranking is separate by form and funding type when the rules require it.",
      },
      {
        type: "callout",
        bg: "Кандидат-студенти извън ЕС / с чуждестранна диплома често минават по друг ред (признаване, езиков праг, отделна комисия). Този навигатор покрива предимно пътя BG/ЕС след българско или признато средно образование.",
        en: "Non-EU applicants or holders of a foreign diploma often follow another track (recognition, language threshold, a separate committee). This navigator mainly covers the BG/EU path after a Bulgarian or recognised diploma.",
      },
    ],
  },
  {
    slug: "score",
    titleBg: "Как се образува конкурсният бал",
    titleEn: "How the competitive score is formed",
    leadBg:
      "Балът е сума от оценки (по шестобалната система), всяка умножена по коефициент от Приложение №2. Коефициентът показва тежестта на изпита или предмета — не е „бонус точка“.",
    leadEn:
      "The score is a sum of grades (6-point scale), each multiplied by an Appendix 2 coefficient. The coefficient is a weight — not a bonus point.",
    blocks: [
      {
        type: "h2",
        bg: "Формула",
        en: "Formula",
      },
      {
        type: "formula",
        bg: "бал = Σ (оценка × коефициент)",
        en: "score = Σ (grade × coefficient)",
      },
      {
        type: "p",
        bg: "Оценката е от 2.00 до 6.00. Коефициент 3 означава, че изпитът тежи три пъти повече от предмет с коефициент 1. При тежести 3 + 1 + 1 максимумът е 6×3 + 6×1 + 6×1 = 30.",
        en: "Grades run from 2.00 to 6.00. A coefficient of 3 means that exam weighs three times a subject with coefficient 1. With weights 3 + 1 + 1 the maximum is 6×3 + 6×1 + 6×1 = 30.",
      },
      {
        type: "h2",
        bg: "Откъде идват оценките",
        en: "Where the grades come from",
      },
      {
        type: "ul",
        items: [
          {
            bg: "Конкурсен изпит в СУ — или приравнен ДЗИ (държавен зрелостен изпит) по същия предмет, когато приложението допуска „изпит / ДЗИ“.",
            en: "An SU entrance exam — or the matching ДЗИ (state matriculation exam) when the appendix allows “exam / ДЗИ”.",
          },
          {
            bg: "Оценки от дипломата за средно образование по посочени предмети (често БЕЛ и още един).",
            en: "Diploma grades in the listed subjects (often Bulgarian language and literature plus one more).",
          },
          {
            bg: "Ако има алтернативи (напр. история или география), взима се по-благоприятната оценка, освен ако текстът не казва друго.",
            en: "If alternatives are listed (e.g. history or geography), the more favourable grade is used unless the text says otherwise.",
          },
        ],
      },
      {
        type: "h2",
        bg: "Пример: Африканистика, редовна",
        en: "Example: African Studies, full-time",
      },
      {
        type: "p",
        bg: "Изпит или ДЗИ по западен език × 3; БЕЛ от дипломата × 1; история или география от дипломата × 1. Оценки 5.50 / 5.80 / 5.00 → бал = 5.50×3 + 5.80×1 + 5.00×1 = 16.50 + 5.80 + 5.00 = 27.30 от възможни 30.",
        en: "Exam or ДЗИ in a Western language × 3; diploma Bulgarian × 1; diploma history or geography × 1. Grades 5.50 / 5.80 / 5.00 → score = 5.50×3 + 5.80×1 + 5.00×1 = 16.50 + 5.80 + 5.00 = 27.30 out of 30.",
      },
      {
        type: "callout",
        bg: "Коефициентът не се „добавя“ към оценката (не е 5.50 + 3). Той само умножава. ДЗИ и вътрешният изпит обикновено не се събират — ползва се предвидената в приложението алтернатива.",
        en: "The coefficient is not added to the grade (not 5.50 + 3). It only multiplies. ДЗИ and the internal exam are usually alternatives — not summed.",
      },
    ],
  },
  {
    slug: "timeline",
    titleBg: "Етапи на кампанията и класиране",
    titleEn: "Campaign stages and ranking",
    leadBg:
      "Кампанията върви на вълни. Точните дати се обявяват всяка година със заповед — тук е логиката от правилника, не календарът за конкретна година.",
    leadEn:
      "The campaign runs in waves. Exact dates are published each year by order — this is the logic from the rules, not a calendar for a given year.",
    blocks: [
      {
        type: "h2",
        bg: "Типична последователност",
        en: "Typical sequence",
      },
      {
        type: "ul",
        items: [
          {
            bg: "1. Обявяване на места, такси и график. Публикуване / потвърждение на Приложение №2.",
            en: "1. Places, fees and timetable are announced. Appendix 2 is published or confirmed.",
          },
          {
            bg: "2. Регистрация и подаване на документи (електронно и/или на гише).",
            en: "2. Registration and document submission (online and/or at a desk).",
          },
          {
            bg: "3. Конкурсни изпити за специалностите, които не се класират само по ДЗИ / диплома.",
            en: "3. Entrance exams for programmes that are not ranked only by ДЗИ / diploma.",
          },
          {
            bg: "4. Първо класиране — списъци по бал, отделно по форма и квота, когато е предвидено.",
            en: "4. First ranking — lists by score, split by form and quota when required.",
          },
          {
            bg: "5. Записване на класираните в срок. Незаписаните места се освобождават.",
            en: "5. Enrolment of ranked applicants by the deadline. Unclaimed places are released.",
          },
          {
            bg: "6. Второ и следващи класирания до запълване на местата или до изчерпване на кампанията.",
            en: "6. Second and further rankings until places fill or the campaign ends.",
          },
          {
            bg: "7. Допълнително класиране / платено обучение — ако останат места и правилникът го допуска.",
            en: "7. Additional ranking / paid track — if places remain and the rules allow it.",
          },
        ],
      },
      {
        type: "h2",
        bg: "Какво да следиш при всяко класиране",
        en: "What to watch at each ranking",
      },
      {
        type: "p",
        bg: "Мястото в списъка, вида финансиране, формата (редовна/задочна) и срока за записване. Пропуск на срока обикновено губи мястото — следващото класиране не „пази“ автоматично предишния избор.",
        en: "Your place on the list, funding type, form (full-time/part-time) and the enrolment deadline. Missing the deadline usually forfeits the place — the next ranking does not automatically keep the previous choice.",
      },
      {
        type: "callout",
        bg: "Порталът показва пътя. Записването, договорите и таксите остават при официалната приемна комисия и деканата.",
        en: "The portal shows the path. Enrolment, contracts and fees stay with the official admissions office and the dean's office.",
      },
    ],
  },
  {
    slug: "masters",
    titleBg: "Магистърски прием — отделни правила",
    titleEn: "Master's admissions — separate rules",
    leadBg:
      "Приемът в ОКС „магистър“ след висше образование не следва бакалавърското Приложение №2. Всеки факултет обявява свои програми, изпити, балообразуване и срокове.",
    leadEn:
      "Admission to a Master's after a first degree does not follow the bachelor Appendix 2. Each faculty publishes its own programmes, exams, score rules and dates.",
    blocks: [
      {
        type: "h2",
        bg: "Защо е отделно",
        en: "Why it is separate",
      },
      {
        type: "p",
        bg: "Бакалавърският правилник и приложението за ДЗИ/диплома важат за прием след средно образование. Магистърските кампании имат собствен правилник или факултетни правила, често с събеседване, портфолио или изпит по специалността, плюс успех от дипломата за висше.",
        en: "The bachelor rules and the ДЗИ/diploma appendix apply after secondary school. Master's campaigns have their own regulation or faculty rules, often with an interview, portfolio or subject exam, plus the bachelor diploma GPA.",
      },
      {
        type: "h2",
        bg: "Къде да гледаш",
        en: "Where to look",
      },
      {
        type: "ul",
        items: [
          {
            bg: "Факултетният хъб — секция „Прием магистър“. За ФФ виж и phls.uni-sofia.bg (допълнителен прием, отделен портал).",
            en: "The faculty hub — “Master's admissions”. For PHLS also see phls.uni-sofia.bg (extra intake, separate portal).",
          },
          {
            bg: "Централният кандидатстудентски сайт на СУ за общите срокове, когато има централизиран прозорец.",
            en: "The central SU admissions site for shared deadlines when there is a central window.",
          },
          {
            bg: "Условията на конкретната магистърска програма (предварителна подготовка, език, платена/държавна).",
            en: "The specific MA programme conditions (prior field, language, funded/paid).",
          },
        ],
      },
      {
        type: "callout",
        bg: "Не смесвай бакалавърския бал от Приложение №2 с магистърския конкурс. Ако си вече студент и искаш МП, започни от факултетната страница, не от бакалавърския каталог.",
        en: "Do not mix the bachelor Appendix 2 score with the Master's contest. If you are already a student and want an MA, start from the faculty page, not the bachelor catalogue.",
      },
    ],
  },
];

export function getGuidePage(slug: string): GuidePage | undefined {
  return GUIDE_PAGES.find((p) => p.slug === slug);
}
