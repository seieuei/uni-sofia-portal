export type JourneyStep = {
  id: string;
  titleBg: string;
  titleEn: string;
  summaryBg: string;
  summaryEn: string;
  detailsBg: string[];
  detailsEn: string[];
};

export const STUDENT_JOURNEY: JourneyStep[] = [
  {
    id: "program",
    titleBg: "Избери програма",
    titleEn: "Choose a programme",
    summaryBg: "Разгледай факултетите и специалностите. Пилотът тръгва от Африканистика / ФКНФ.",
    summaryEn: "Browse faculties and programmes. This pilot starts with African Studies / FCML.",
    detailsBg: [
      "16 факултета на СУ „Св. Климент Охридски“.",
      "ФКНФ предлага бакалавърски филологии, вкл. Африканистика.",
      "Сравни учебния план, езиците и формата на обучение (редовно / задочно).",
    ],
    detailsEn: [
      "Sofia University has 16 faculties.",
      "FCML offers philology bachelor programmes, including African Studies.",
      "Compare the curriculum, languages, and form of study (full-time / part-time).",
    ],
  },
  {
    id: "apply",
    titleBg: "Кандидатствай",
    titleEn: "Apply",
    summaryBg: "Подай документи в кандидатстудентската кампания — срокове, балообразуване, такси.",
    summaryEn: "Submit documents in the admissions campaign — deadlines, ranking formula, fees.",
    detailsBg: [
      "Следвай официалния график на приемната кампания на СУ.",
      "Подготви диплома за средно образование и езикови сертификати (ако се изискват).",
      "Отвори навигатора „Кандидатстване“ за бал, класирания и каталог по факултет.",
      "Този портал не замества официалната система за прием.",
    ],
    detailsEn: [
      "Follow the official SU admissions calendar.",
      "Prepare a secondary-school diploma and language certificates if required.",
      "Open the Admissions navigator for scores, rankings and the faculty catalogue.",
      "This portal does not replace the official admissions system.",
    ],
  },
  {
    id: "exams",
    titleBg: "Изпити и дати",
    titleEn: "Exams and dates",
    summaryBg: "Държиш приемен изпит или се класираш по оценки — според специалността.",
    summaryEn: "Sit an entrance exam or rank by grades — depending on the programme.",
    detailsBg: [
      "За много филологии има приемен изпит по език или тест.",
      "Следи датите за изпит, консултации и класиране.",
      "Резултатите и класирането се обявяват по официалния канал на СУ.",
    ],
    detailsEn: [
      "Many philology programmes require a language exam or test.",
      "Watch exam, consultation, and ranking dates.",
      "Results are published through official SU channels.",
    ],
  },
  {
    id: "enrol",
    titleBg: "Записване и документи",
    titleEn: "Enrol and sign documents",
    summaryBg: "При класиране се записваш: договор, декларации, студентска книжка, такса.",
    summaryEn: "If admitted, you enrol: contract, declarations, student book, tuition.",
    detailsBg: [
      "Подпиши документите в указания срок в деканата / отдел „Студенти“.",
      "Получаваш факултетен номер и достъп до СУСИ / elearn.",
      "Порталът показва пътя — официалните бланки остават при администрацията.",
    ],
    detailsEn: [
      "Sign papers on time at the dean's office / Student Affairs.",
      "You receive a faculty number and access to SUSI / elearn.",
      "The portal shows the path — official blanks stay with the administration.",
    ],
  },
  {
    id: "semester",
    titleBg: "Ключови семестриални дати",
    titleEn: "Key semester dates",
    summaryBg: "Зимен/летен семестър, избираеми, сесия, ваканции и национални празници.",
    summaryEn: "Winter/summer term, electives, exam session, breaks, and national holidays.",
    detailsBg: [
      "Учебната година обикновено започва през септември.",
      "Избираемите имат прозорец за записване — следи календара.",
      "Празниците са в бяло в седмичния календар; лекциите — в зелено.",
    ],
    detailsEn: [
      "The academic year usually starts in September.",
      "Electives have an enrolment window — watch the calendar.",
      "Holidays are white in the week calendar; lectures are green.",
    ],
  },
];
