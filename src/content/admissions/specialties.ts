import { SU_FACULTIES } from "@/lib/structure";

export type ScoreComponent = {
  source: "exam" | "dzi" | "either" | "diploma";
  subjectBg: string;
  subjectEn: string;
  coefficient: number;
  alternativesBg?: string;
  alternativesEn?: string;
};

export type StudyFormOffer = {
  form: "full-time" | "part-time";
  components: ScoreComponent[];
  noteBg?: string;
  noteEn?: string;
};

export type Specialty = {
  slug: string;
  facultyCode: string;
  titleBg: string;
  titleEn: string;
  degree: "BA";
  professionalFieldBg: string;
  professionalFieldEn: string;
  detail: "full" | "stub";
  forms: StudyFormOffer[];
};

const BEL: ScoreComponent = {
  source: "diploma",
  subjectBg: "Български език и литература",
  subjectEn: "Bulgarian language and literature",
  coefficient: 1,
};

function langExam(subjectBg: string, subjectEn: string, coefficient = 3): ScoreComponent {
  return {
    source: "either",
    subjectBg,
    subjectEn,
    coefficient,
    alternativesBg: "Конкурсен изпит или ДЗИ по същия предмет",
    alternativesEn: "Entrance exam or ДЗИ in the same subject",
  };
}

function diploma(subjectBg: string, subjectEn: string, coefficient = 1, altBg?: string, altEn?: string): ScoreComponent {
  return {
    source: "diploma",
    subjectBg,
    subjectEn,
    coefficient,
    alternativesBg: altBg,
    alternativesEn: altEn,
  };
}

function philology(
  slug: string,
  titleBg: string,
  titleEn: string,
  languageBg: string,
  languageEn: string,
  opts?: { partTime?: boolean; extraDiploma?: ScoreComponent }
): Specialty {
  const components: ScoreComponent[] = [
    langExam(languageBg, languageEn, 3),
    BEL,
    opts?.extraDiploma ??
      diploma("История", "History", 1, "История или география — по-високата оценка", "History or geography — the higher grade"),
  ];
  const forms: StudyFormOffer[] = [{ form: "full-time", components }];
  if (opts?.partTime) {
    forms.push({
      form: "part-time",
      components,
      noteBg: "Същите компоненти на бала; местата и графикът на занятията са отделни.",
      noteEn: "Same score components; places and the teaching timetable are separate.",
    });
  }
  return {
    slug,
    facultyCode: "FCML",
    titleBg,
    titleEn,
    degree: "BA",
    professionalFieldBg: "2.1 Филология",
    professionalFieldEn: "2.1 Philology",
    detail: "full",
    forms,
  };
}

const FCML: Specialty[] = [
  philology("afrikanistika", "Африканистика", "African Studies", "Западен език", "Western language", { partTime: true }),
  philology("afrikanistika-en", "Африканистика (на английски език)", "African Studies (English-taught)", "Английски език", "English"),
  philology("anglicistika", "Англицистика", "English Studies", "Английски език", "English", { partTime: true }),
  philology("amerikanistika", "Американистика", "American Studies", "Английски език", "English"),
  philology("arabistika", "Арабистика", "Arabic Studies", "Арабски език / западен език", "Arabic / Western language"),
  philology("armenistika", "Арменистика и кавказология", "Armenian and Caucasian Studies", "Западен език", "Western language"),
  philology("klasicheska", "Класическа филология", "Classical Philology", "Латински или старогръцки", "Latin or Ancient Greek", {
    extraDiploma: diploma("История", "History", 1),
  }),
  philology("novogratska", "Новогръцка филология", "Modern Greek Philology", "Новогръцки / западен език", "Modern Greek / Western language"),
  philology("romanistika", "Романистика", "Romance Studies", "Френски език", "French", { partTime: true }),
  philology("germanistika", "Германистика", "German Studies", "Немски език", "German", { partTime: true }),
  philology("skandinavistika", "Скандинавистика", "Scandinavian Studies", "Западен език", "Western language"),
  philology("ispanistika", "Испанистика", "Hispanic Studies", "Испански език", "Spanish"),
  philology("portugalistika", "Португалистика", "Portuguese Studies", "Португалски / западен език", "Portuguese / Western language"),
  philology("italianistika", "Италианистика", "Italian Studies", "Италиански език", "Italian"),
  philology("japonistika", "Японистика", "Japanese Studies", "Западен език", "Western language"),
  philology("kitaisistika", "Китаистика", "Chinese Studies", "Западен език", "Western language"),
  philology("koreistika", "Кореистика", "Korean Studies", "Западен език", "Western language"),
  philology("indologiya", "Индология", "Indology", "Западен език", "Western language"),
  philology("iranistika", "Иранистика", "Iranian Studies", "Западен език", "Western language"),
  philology("turkologiya", "Туркология", "Turkic Studies", "Западен език", "Western language"),
  philology("ungaristika", "Унгаристика", "Hungarian Studies", "Западен език", "Western language"),
  philology("rumanistika", "Румънистика", "Romanian Studies", "Западен език", "Western language"),
  philology("hebraistika", "Хебраистика", "Hebrew Studies", "Западен език", "Western language"),
];

function phls(
  slug: string,
  titleBg: string,
  titleEn: string,
  fieldBg: string,
  fieldEn: string,
  components: ScoreComponent[],
  partTime = false
): Specialty {
  const forms: StudyFormOffer[] = [{ form: "full-time", components }];
  if (partTime) {
    forms.push({ form: "part-time", components, noteBg: "Задочна форма — отделна квота.", noteEn: "Part-time form — separate quota." });
  }
  return {
    slug,
    facultyCode: "FFIL",
    titleBg,
    titleEn,
    degree: "BA",
    professionalFieldBg: fieldBg,
    professionalFieldEn: fieldEn,
    detail: "full",
    forms,
  };
}

const PHLS: Specialty[] = [
  phls(
    "filosofiya",
    "Философия",
    "Philosophy",
    "2.3 Философия",
    "2.3 Philosophy",
    [
      langExam("Български език и литература", "Bulgarian language and literature", 3),
      diploma("История", "History", 1),
      BEL,
    ],
    true
  ),
  phls("psihologiya", "Психология", "Psychology", "3.2 Психология", "3.2 Psychology", [
    langExam("Български език и литература", "Bulgarian language and literature", 3),
    {
      source: "either",
      subjectBg: "Биология и здравно образование",
      subjectEn: "Biology and health education",
      coefficient: 2,
      alternativesBg: "ДЗИ по биология или специализиран тест, когато е обявен",
      alternativesEn: "ДЗИ in biology or a specialised test when announced",
    },
    diploma("Биология и здравно образование", "Biology and health education", 1),
  ]),
  phls(
    "sotsiologiya",
    "Социология",
    "Sociology",
    "3.1 Социология, антропология и науки за културата",
    "3.1 Sociology, anthropology and cultural sciences",
    [langExam("Български език и литература", "Bulgarian language and literature", 3), diploma("История", "History", 1), BEL],
    true
  ),
  phls("politologiya", "Политология", "Political Science", "3.3 Политически науки", "3.3 Political sciences", [
    langExam("Български език и литература", "Bulgarian language and literature", 3),
    diploma("История", "History", 1),
    diploma("География и икономика", "Geography and economics", 1),
  ]),
  phls(
    "publicna-administratsiya",
    "Публична администрация",
    "Public Administration",
    "3.3 Политически науки",
    "3.3 Political sciences",
    [langExam("Български език и литература", "Bulgarian language and literature", 3), diploma("История", "History", 1), BEL],
    true
  ),
  phls(
    "kulturologiya",
    "Културология",
    "Cultural Studies",
    "3.1 Социология, антропология и науки за културата",
    "3.1 Sociology, anthropology and cultural sciences",
    [langExam("Български език и литература", "Bulgarian language and literature", 3), diploma("История", "History", 1), BEL]
  ),
  phls("evropeistika", "Европеистика", "European Studies", "3.3 Политически науки", "3.3 Political sciences", [
    langExam("Български език и литература", "Bulgarian language and literature", 3),
    langExam("Западен език", "Western language", 2),
    BEL,
  ]),
  phls(
    "bibliotechni-nauki",
    "Библиотечно-информационни науки",
    "Library and Information Sciences",
    "3.5 Обществени комуникации и информационни науки",
    "3.5 Public communications and information sciences",
    [langExam("Български език и литература", "Bulgarian language and literature", 3), diploma("История", "History", 1), BEL]
  ),
];

const STUB_EXAMPLES: Record<string, { titleBg: string; titleEn: string; fieldBg: string; fieldEn: string }[]> = {
  HF: [{ titleBg: "История", titleEn: "History", fieldBg: "2.2 История и археология", fieldEn: "2.2 History and archaeology" }],
  FSF: [{ titleBg: "Българска филология", titleEn: "Bulgarian Philology", fieldBg: "2.1 Филология", fieldEn: "2.1 Philology" }],
  LF: [{ titleBg: "Право", titleEn: "Law", fieldBg: "3.6 Право", fieldEn: "3.6 Law" }],
  FP: [{ titleBg: "Педагогика", titleEn: "Education", fieldBg: "1.2 Педагогика", fieldEn: "1.2 Education" }],
  FNOI: [{ titleBg: "Предучилищна и начална училищна педагогика", titleEn: "Pre-school and primary education", fieldBg: "1.2 Педагогика", fieldEn: "1.2 Education" }],
  FJMC: [{ titleBg: "Журналистика", titleEn: "Journalism", fieldBg: "3.5 Обществени комуникации", fieldEn: "3.5 Public communications" }],
  TF: [{ titleBg: "Теология", titleEn: "Theology", fieldBg: "2.4 Религия и теология", fieldEn: "2.4 Religion and theology" }],
  SF: [{ titleBg: "Икономика", titleEn: "Economics", fieldBg: "3.8 Икономика", fieldEn: "3.8 Economics" }],
  FMI: [
    { titleBg: "Информатика", titleEn: "Informatics", fieldBg: "4.6 Информатика и компютърни науки", fieldEn: "4.6 Informatics and computer sciences" },
    { titleBg: "Математика", titleEn: "Mathematics", fieldBg: "4.5 Математика", fieldEn: "4.5 Mathematics" },
  ],
  FFIZ: [{ titleBg: "Физика", titleEn: "Physics", fieldBg: "4.1 Физически науки", fieldEn: "4.1 Physical sciences" }],
  FHF: [{ titleBg: "Химия", titleEn: "Chemistry", fieldBg: "4.2 Химически науки", fieldEn: "4.2 Chemical sciences" }],
  BF: [{ titleBg: "Биология", titleEn: "Biology", fieldBg: "4.3 Биологически науки", fieldEn: "4.3 Biological sciences" }],
  GGF: [{ titleBg: "География", titleEn: "Geography", fieldBg: "4.4 Науки за Земята", fieldEn: "4.4 Earth sciences" }],
  MF: [{ titleBg: "Медицина", titleEn: "Medicine", fieldBg: "7.1 Медицина", fieldEn: "7.1 Medicine" }],
};

function stubs(): Specialty[] {
  const out: Specialty[] = [];
  for (const f of SU_FACULTIES) {
    if (f.id === "FCML" || f.id === "FFIL") continue;
    const examples = STUB_EXAMPLES[f.id] ?? [{ titleBg: "Специалности по Приложение №2", titleEn: "Programmes in Appendix 2", fieldBg: "—", fieldEn: "—" }];
    examples.forEach((ex, i) => {
      out.push({
        slug: `${f.id.toLowerCase()}-${i + 1}`,
        facultyCode: f.id,
        titleBg: ex.titleBg,
        titleEn: ex.titleEn,
        degree: "BA",
        professionalFieldBg: ex.fieldBg,
        professionalFieldEn: ex.fieldEn,
        detail: "stub",
        forms: [
          {
            form: "full-time",
            components: [langExam("Предмет по Приложение №2", "Subject per Appendix 2", 3), BEL],
            noteBg: "Индекс от заглавията на приложението. Пълните коефициенти ще се допълнят.",
            noteEn: "Index from appendix headers. Full coefficients will be filled in.",
          },
        ],
      });
    });
  }
  return out;
}

export const SPECIALTIES: Specialty[] = [...FCML, ...PHLS, ...stubs()];

export function specialtiesByFaculty(code: string): Specialty[] {
  return SPECIALTIES.filter((s) => s.facultyCode === code);
}

export function getSpecialty(slug: string): Specialty | undefined {
  return SPECIALTIES.find((s) => s.slug === slug);
}

export function searchSpecialties(q: string): Specialty[] {
  const n = q.trim().toLowerCase();
  if (!n) return SPECIALTIES;
  return SPECIALTIES.filter((s) =>
    [s.titleBg, s.titleEn, s.slug, s.facultyCode, s.professionalFieldBg, s.professionalFieldEn]
      .join(" ")
      .toLowerCase()
      .includes(n)
  );
}

export function maxScore(offer: StudyFormOffer): number {
  return offer.components.reduce((sum, c) => sum + 6 * c.coefficient, 0);
}

export function facultyLabel(code: string, lang: "bg" | "en"): string {
  const f = SU_FACULTIES.find((x) => x.id === code);
  if (!f) return code;
  return lang === "bg" ? f.labelBg : f.labelEn;
}
