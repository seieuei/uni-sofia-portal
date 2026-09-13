export type StructureKind =
  | "root"
  | "branch"
  | "faculty"
  | "office"
  | "commission"
  | "person"
  | "program-group"
  | "program";

export type StructureNode = {
  id: string;
  labelBg: string;
  labelEn: string;
  hintBg?: string;
  hintEn?: string;
  highlight?: boolean;
  children?: StructureNode[];
  kind?: StructureKind;
  facultyCode?: string;
  degree?: "BA" | "MA";
  programSlug?: string;
  href?: string;
};

/** Static organigram seeded from official SU / FCML pages (pilot snapshot). */
export const UNIVERSITY_STRUCTURE: StructureNode = {
  id: "university",
  labelBg: "Софийски университет „Св. Климент Охридски“",
  labelEn: "Sofia University St. Kliment Ohridski",
  hintBg: "Органи на управление, администрации, 16 факултета. Пилот: ФКНФ.",
  hintEn: "Governing bodies, administrations, 16 faculties. Pilot: FCML.",
  children: [
    {
      id: "governance",
      labelBg: "Органи на управление",
      labelEn: "Governing bodies",
      hintBg: "По Правилника за устройството и дейността: ОС, АС, Ректор.",
      hintEn: "By the SU statute: General Assembly, Academic Council, Rector.",
      children: [
        {
          id: "os",
          labelBg: "Общо събрание (ОС)",
          labelEn: "General Assembly",
          hintBg: "Висш орган. Избира Ректор и Академичен съвет за 4 години.",
          hintEn: "Supreme body. Elects the Rector and Academic Council for 4 years.",
        },
        {
          id: "as",
          labelBg: "Академичен съвет (АС)",
          labelEn: "Academic Council",
          hintBg: "45 членове — ректор, декани, преподаватели, студенти, администрация.",
          hintEn: "45 members — rector, deans, faculty, students, administration.",
        },
        {
          id: "rector",
          labelBg: "Ректор",
          labelEn: "Rector",
          hintBg: "Ръководи и представлява университета. Ректорски съвет.",
          hintEn: "Leads and represents the university. Rector's Council.",
          children: [
            {
              id: "vr-nid",
              labelBg: "Зам.-ректор НИД, проекти и информационни дейности",
              labelEn: "Vice-rector for research, projects and IT",
            },
            {
              id: "vr-ba-ma",
              labelBg: "Зам.-ректор учебна дейност (бакалавър и магистър)",
              labelEn: "Vice-rector for BA/MA education",
            },
            {
              id: "vr-phd",
              labelBg: "Зам.-ректор ОНС „доктор“, постдокторанти и ПДО",
              labelEn: "Vice-rector for doctoral and continuing education",
            },
            {
              id: "vr-accr",
              labelBg: "Зам.-ректор акредитация, кариера, алумни и бизнес",
              labelEn: "Vice-rector for accreditation, careers, alumni and business",
            },
            {
              id: "vr-admin",
              labelBg: "Зам.-ректор административна дейност",
              labelEn: "Vice-rector for administration",
            },
            {
              id: "vr-int",
              labelBg: "Зам.-ректор международна дейност",
              labelEn: "Vice-rector for international affairs",
            },
            {
              id: "vr-staff",
              labelBg: "Функционален ректор — академичен състав",
              labelEn: "Functional rector — academic staff",
            },
          ],
        },
        {
          id: "control",
          labelBg: "Контролни органи",
          labelEn: "Control bodies",
          hintBg: "Контролен съвет — надзор върху законосъобразността на актовете.",
          hintEn: "Control board — legality oversight of university acts.",
        },
        {
          id: "trustees",
          labelBg: "Съвет на настоятелите",
          labelEn: "Board of Trustees",
          hintBg: "Обществен орган с мандат; подпомага развитието на университета.",
          hintEn: "Public board with a mandate; supports university development.",
        },
        {
          id: "ss",
          labelBg: "Студентски съвет",
          labelEn: "Student Council",
          hintBg: "Представителство на студентите в органите на управление.",
          hintEn: "Student representation in governing bodies.",
        },
      ],
    },
    {
      id: "administrations",
      labelBg: "Централна администрация",
      labelEn: "Central administration",
      hintBg: "Главен мениджър, секретар, финансист, счетоводител, юрисконсулт, ОД…",
      hintEn: "Chief manager, secretary, finance, accountant, legal, Education dept.…",
      href: "/contacts#central",
      children: [
        { id: "gm", labelBg: "Главен мениджър — инж. Георги Божанин", labelEn: "Chief manager — Eng. Georgi Bozhanin", kind: "person", hintBg: "стая 13 · 9308 345 · georgi_bojanin@admin.uni-sofia.bg", hintEn: "room 13 · 9308 345 · georgi_bojanin@admin.uni-sofia.bg", href: "/contacts#central" },
        { id: "secretary", labelBg: "Главен секретар — Детелина Илиева", labelEn: "Chief secretary — Detelina Ilieva", kind: "person", hintBg: "стая 6 · deti@admin.uni-sofia.bg", hintEn: "room 6 · deti@admin.uni-sofia.bg", href: "/contacts#central" },
        { id: "finance", labelBg: "Главен финансист — Елена Петрова", labelEn: "Chief finance — Elena Petrova", kind: "person", href: "/contacts#central" },
        { id: "accountant", labelBg: "Главен счетоводител — Дари Иванов", labelEn: "Chief accountant — Dari Ivanov", kind: "person", href: "/contacts#central" },
        { id: "legal", labelBg: "Главен юрисконсулт — Таня Павлова", labelEn: "Chief legal counsel — Tanya Pavlova", kind: "person", href: "/contacts#central" },
        { id: "od", labelBg: "Образователни дейности — Албена Григорова", labelEn: "Educational activities — Albena Grigorova", kind: "person", hintBg: "стая 227 · 9308 444", hintEn: "room 227 · 9308 444", href: "/contacts#central" },
        { id: "phd-admin", labelBg: "Сектор Докторанти — Деяна Андонова", labelEn: "Doctoral sector — Deyana Andonova", kind: "person", href: "/contacts#central" },
        { id: "registry", labelBg: "Деловодство / Архимед", labelEn: "Registry / Arhimed" },
        { id: "hr", labelBg: "Човешки ресурси — Александра Алексиева", labelEn: "Human resources — Aleksandra Aleksieva", kind: "person", href: "/contacts#central" },
        { id: "pfc", labelBg: "Предварителен финансов контрол — Анна Шикова", labelEn: "Ex-ante financial control — Anna Shikova", kind: "person", href: "/contacts#central" },
      ],
    },
    {
      id: "faculties",
      labelBg: "Факултети",
      labelEn: "Faculties",
      hintBg: "Всички 16 факултета на СУ. ФКНФ е подчертан — пилотният факултет.",
      hintEn: "All 16 SU faculties. FCML is highlighted — the pilot faculty.",
      children: [
        { id: "HF", labelBg: "Исторически факултет", labelEn: "Faculty of History" },
        {
          id: "FFIL",
          labelBg: "Философски факултет",
          labelEn: "Faculty of Philosophy",
          kind: "faculty",
          facultyCode: "FFIL",
          href: "/faculties/phls",
          hintBg: "Втори примерен хъб — по IA на phls.uni-sofia.bg.",
          hintEn: "Second example hub — PHLS IA.",
          children: [
            {
              id: "ffil-offices",
              labelBg: "Деканат и служби",
              labelEn: "Dean's office and services",
              kind: "office",
              children: [
                { id: "ffil-dekanat", labelBg: "Деканат", labelEn: "Dean's office", kind: "office" },
                { id: "ffil-students", labelBg: "Инспектори / студенти", labelEn: "Inspectors / students", kind: "office" },
              ],
            },
            {
              id: "ffil-deans",
              labelBg: "Ръководство",
              labelEn: "Leadership",
              kind: "person",
              children: [{ id: "ffil-dean", labelBg: "Декан", labelEn: "Dean", kind: "person" }],
            },
            {
              id: "ffil-ba",
              labelBg: "Бакалавърски програми",
              labelEn: "Bachelor programmes",
              kind: "program-group",
              degree: "BA",
              children: [
                { id: "ba-phil", labelBg: "Философия", labelEn: "Philosophy", kind: "program", degree: "BA", href: "/admissions/specialties/filosofiya" },
                { id: "ba-psy", labelBg: "Психология", labelEn: "Psychology", kind: "program", degree: "BA", href: "/admissions/specialties/psihologiya" },
                { id: "ba-soc", labelBg: "Социология", labelEn: "Sociology", kind: "program", degree: "BA", href: "/admissions/specialties/sotsiologiya" },
                { id: "ba-pol", labelBg: "Политология", labelEn: "Political Science", kind: "program", degree: "BA", href: "/admissions/specialties/politologiya" },
                { id: "ba-pa", labelBg: "Публична администрация", labelEn: "Public Administration", kind: "program", degree: "BA", href: "/admissions/specialties/publicna-administratsiya" },
                { id: "ba-kult", labelBg: "Културология", labelEn: "Cultural Studies", kind: "program", degree: "BA", href: "/admissions/specialties/kulturologiya" },
                { id: "ba-eu", labelBg: "Европеистика", labelEn: "European Studies", kind: "program", degree: "BA", href: "/admissions/specialties/evropeistika" },
                { id: "ba-lis", labelBg: "Библиотечно-информационни науки", labelEn: "Library and Information Sciences", kind: "program", degree: "BA", href: "/admissions/specialties/bibliotechni-nauki" },
              ],
            },
            {
              id: "ffil-ma",
              labelBg: "Магистърски програми",
              labelEn: "Master programmes",
              kind: "program-group",
              degree: "MA",
              children: [
                { id: "ma-phls", labelBg: "МП на ФФ (отделен прием)", labelEn: "PHLS MA (separate intake)", kind: "program", degree: "MA", href: "/admissions/masters" },
              ],
            },
          ],
        },
        {
          id: "FCML",
          labelBg: "Факултет по класически и нови филологии (ФКНФ)",
          labelEn: "Faculty of Classical and Modern Philology (FCML)",
          highlight: true,
          kind: "faculty",
          facultyCode: "FCML",
          href: "/faculties/fcml",
          hintBg: "Пилотен факултет. Разгъни за деканат, комисии, ръководство и програми.",
          hintEn: "Pilot faculty. Expand for offices, commissions, leadership and programmes.",
          children: [
            {
              id: "fcml-offices",
              labelBg: "Деканат и служби",
              labelEn: "Dean's office and services",
              children: [
                {
                  id: "dekanat",
                  labelBg: "Деканат",
                  labelEn: "Dean's office",
                  hintBg: "Ректорат, централно крило, каб. 231 · dekanat@fcml.uni-sofia.bg",
                  hintEn: "Rectorate, central wing, room 231 · dekanat@fcml.uni-sofia.bg",
                },
                { id: "students-off", labelBg: "Отдел „Студенти“", labelEn: "Student Affairs" },
                { id: "tech", labelBg: "Техническа поддръжка", labelEn: "Technical support" },
                { id: "pr", labelBg: "Координация и PR", labelEn: "Coordination and PR" },
                { id: "acc", labelBg: "Счетоводство", labelEn: "Accounting" },
                { id: "info", labelBg: "Обща информация", labelEn: "General information" },
              ],
            },
            {
              id: "fcml-commissions",
              labelBg: "Комисии (мандат 2023/2027)",
              labelEn: "Commissions (2023–2027 term)",
              children: [
                { id: "com-mandate", labelBg: "Мандатна комисия", labelEn: "Mandate commission" },
                { id: "com-elections", labelBg: "Комисия по изборите", labelEn: "Elections commission" },
                { id: "com-attest", labelBg: "Атестационна комисия", labelEn: "Attestation commission" },
                {
                  id: "com-nom",
                  labelBg: "Комисия по предложенията за органи на управление",
                  labelEn: "Nominations for governing bodies",
                },
                { id: "com-projects", labelBg: "Проектна комисия", labelEn: "Projects commission" },
                { id: "com-study", labelBg: "Учебна комисия", labelEn: "Study commission" },
                { id: "com-science", labelBg: "Научна комисия", labelEn: "Research commission" },
              ],
            },
            {
              id: "fcml-deans",
              labelBg: "Декан и заместник-декани",
              labelEn: "Dean and vice-deans",
              href: "/faculties/fcml/contacts",
              children: [
                {
                  id: "dean",
                  labelBg: "Декан — проф. д-р Гергана Петкова",
                  labelEn: "Dean — Prof. Gergana Petkova, PhD",
                  hintBg: "Каб. 232, Ректорат",
                  hintEn: "Room 232, Rectorate",
                },
                {
                  id: "vd-study",
                  labelBg: "Зам.-декан учебна дейност — доц. д-р Галина Евстатиева",
                  labelEn: "Vice-dean for education — Assoc. Prof. Galina Evstatieva",
                  kind: "person",
                  hintBg: "каб. 232 · g.evstatieva@uni-sofia.bg · сряда 12:30–14:00",
                  hintEn: "room 232 · g.evstatieva@uni-sofia.bg · Wed 12:30–14:00",
                  href: "/faculties/fcml/contacts",
                },
                {
                  id: "vd-nid",
                  labelBg: "Зам.-декан НИД и академично израстване — доц. д-р Лиляна Лесничкова",
                  labelEn: "Vice-dean for research — Assoc. Prof. Lilyana Lesnichkova",
                  kind: "person",
                  hintBg: "каб. 232 · l.lesnichkova@uni-sofia.bg · четвъртък 14:30–16:00",
                  hintEn: "room 232 · l.lesnichkova@uni-sofia.bg · Thu 14:30–16:00",
                  href: "/faculties/fcml/contacts",
                },
                {
                  id: "vd-projects",
                  labelBg: "Зам.-декан проекти — проф. д-р Милена Йорданова",
                  labelEn: "Vice-dean for projects — Prof. Milena Yordanova",
                  kind: "person",
                  hintBg: "каб. 232 · m.yordanova@uni-sofia.bg · петък 14:30–16:00",
                  hintEn: "room 232 · m.yordanova@uni-sofia.bg · Fri 14:30–16:00",
                  href: "/faculties/fcml/contacts",
                },
                {
                  id: "vd-erasmus",
                  labelBg: "Зам.-декан международна дейност и Еразъм — проф. д-р Петър Моллов",
                  labelEn: "Vice-dean for international / Erasmus — Prof. Petar Mollov",
                  kind: "person",
                  hintBg: "каб. 232 · p.mollov@uni-sofia.bg · понеделник 13:00–14:30",
                  hintEn: "room 232 · p.mollov@uni-sofia.bg · Mon 13:00–14:30",
                  href: "/faculties/fcml/contacts",
                },
                {
                  id: "vd-info",
                  labelBg: "Помощник информационни въпроси — гл. ас. д-р Симеон Хинковски",
                  labelEn: "Assistant for information — Assist. Prof. Simeon Hinkovski",
                  kind: "person",
                  hintBg: "каб. 232 · четвъртък 10:00–11:30",
                  hintEn: "room 232 · Thu 10:00–11:30",
                  href: "/faculties/fcml/contacts",
                },
              ],
            },
            {
              id: "fcml-ba",
              labelBg: "Бакалавърски програми",
              labelEn: "Bachelor programmes",
              kind: "program-group",
              degree: "BA",
              hintBg: "Списък по официалните специалности на ФКНФ (пилотна извадка).",
              hintEn: "FCML bachelor programmes (pilot snapshot).",
              children: [
                {
                  id: "ba-afr",
                  labelBg: "Африканистика",
                  labelEn: "African Studies",
                  highlight: true,
                  kind: "program",
                  degree: "BA",
                  programSlug: "african-studies-ba",
                  href: "/programs/african-studies-ba",
                },
                { id: "ba-afr-en", labelBg: "Африканистика (на английски език)", labelEn: "African Studies (English-taught)" },
                { id: "ba-eng", labelBg: "Англицистика", labelEn: "English Studies" },
                { id: "ba-am", labelBg: "Американистика", labelEn: "American Studies" },
                { id: "ba-ar", labelBg: "Арабистика", labelEn: "Arabic Studies" },
                { id: "ba-arm", labelBg: "Арменистика и кавказология", labelEn: "Armenian and Caucasian Studies" },
                { id: "ba-cl", labelBg: "Класическа филология", labelEn: "Classical Philology" },
                { id: "ba-gr", labelBg: "Новогръцка филология", labelEn: "Modern Greek Philology" },
                { id: "ba-rom", labelBg: "Романистика", labelEn: "Romance Studies" },
                { id: "ba-ger", labelBg: "Германистика", labelEn: "German Studies" },
                { id: "ba-sc", labelBg: "Скандинавистика", labelEn: "Scandinavian Studies" },
                { id: "ba-es", labelBg: "Испанистика", labelEn: "Hispanic Studies" },
                { id: "ba-pt", labelBg: "Португалистика", labelEn: "Portuguese Studies" },
                { id: "ba-it", labelBg: "Италианистика", labelEn: "Italian Studies" },
                { id: "ba-jp", labelBg: "Японистика", labelEn: "Japanese Studies" },
                { id: "ba-zh", labelBg: "Китаистика", labelEn: "Chinese Studies" },
                { id: "ba-kr", labelBg: "Кореистика", labelEn: "Korean Studies" },
                { id: "ba-in", labelBg: "Индология", labelEn: "Indology" },
                { id: "ba-ir", labelBg: "Иранистика", labelEn: "Iranian Studies" },
                { id: "ba-tr", labelBg: "Туркология", labelEn: "Turkic Studies" },
                { id: "ba-hu", labelBg: "Унгаристика", labelEn: "Hungarian Studies" },
                { id: "ba-ro", labelBg: "Румънистика", labelEn: "Romanian Studies" },
                { id: "ba-he", labelBg: "Хебраистика", labelEn: "Hebrew Studies" },
              ],
            },
            {
              id: "fcml-ma",
              labelBg: "Магистърски програми",
              labelEn: "Master programmes",
              kind: "program-group",
              degree: "MA",
              hintBg: "Актуални МП на ФКНФ (пилотна извадка от официалния списък).",
              hintEn: "Current FCML MA programmes (pilot snapshot).",
              children: [
                { id: "ma-lang", labelBg: "Език и науки за езика (английски)", labelEn: "Language and language sciences (English)" },
                { id: "ma-digital", labelBg: "Дигитални компетентности в чуждоезиковото обучение", labelEn: "Digital competences in language teaching" },
                { id: "ma-geo", labelBg: "Културни връзки и геополитика на ЕС", labelEn: "Cultural ties and EU geopolitics" },
                { id: "ma-eurasia", labelBg: "Европа и Азия: културна дипломация", labelEn: "Europe and Asia: cultural diplomacy" },
                { id: "ma-mena", labelBg: "Близкоизточни изследвания с арабски език", labelEn: "Middle Eastern studies with Arabic" },
                { id: "ma-zh-tr", labelBg: "Междукултурна комуникация и превод (китайски)", labelEn: "Intercultural communication and translation (Chinese)" },
                { id: "ma-jp", labelBg: "Японистика", labelEn: "Japanese Studies (MA)" },
                { id: "ma-kr", labelBg: "Общество и култура на Корея", labelEn: "Korean society and culture" },
                { id: "ma-in-ir", labelBg: "Индийско и иранско културознание", labelEn: "Indian and Iranian cultural studies" },
                { id: "ma-asia", labelBg: "Южна, Източна и Югоизточна Азия", labelEn: "South, East and Southeast Asia" },
                { id: "ma-ant", labelBg: "Антична култура и литература", labelEn: "Ancient culture and literature" },
                { id: "ma-conf", labelBg: "Конферентен превод", labelEn: "Conference interpreting" },
                { id: "ma-fr", labelBg: "Превод — френска филология", labelEn: "Translation — French" },
                { id: "ma-de", labelBg: "Език – култура – превод (немски)", labelEn: "Language–culture–translation (German)" },
                { id: "ma-pt", labelBg: "Език, култура, превод (португалски)", labelEn: "Language, culture, translation (Portuguese)" },
              ],
            },
          ],
        },
        { id: "FSF", labelBg: "Факултет по славянски филологии", labelEn: "Faculty of Slavic Studies" },
        { id: "LF", labelBg: "Юридически факултет", labelEn: "Faculty of Law" },
        { id: "FP", labelBg: "Факултет по педагогика", labelEn: "Faculty of Education" },
        { id: "FNOI", labelBg: "Факултет по науки за образованието и изкуствата", labelEn: "Faculty of Educational Studies and the Arts" },
        { id: "FJMC", labelBg: "Факултет по журналистика и масова комуникация", labelEn: "Faculty of Journalism and Mass Communication" },
        { id: "TF", labelBg: "Богословски факултет", labelEn: "Faculty of Theology" },
        { id: "SF", labelBg: "Стопански факултет", labelEn: "Faculty of Economics and Business Administration" },
        { id: "FMI", labelBg: "Факултет по математика и информатика", labelEn: "Faculty of Mathematics and Informatics" },
        { id: "FFIZ", labelBg: "Физически факултет", labelEn: "Faculty of Physics" },
        { id: "FHF", labelBg: "Факултет по химия и фармация", labelEn: "Faculty of Chemistry and Pharmacy" },
        { id: "BF", labelBg: "Биологически факултет", labelEn: "Faculty of Biology" },
        { id: "GGF", labelBg: "Геолого-географски факултет", labelEn: "Faculty of Geology and Geography" },
        { id: "MF", labelBg: "Медицински факултет", labelEn: "Faculty of Medicine" },
      ],
    },
  ],
};

export const SU_FACULTIES = (UNIVERSITY_STRUCTURE.children?.find((n) => n.id === "faculties")?.children ?? []).map(
  (n) => ({
    id: n.id,
    labelBg: n.labelBg,
    labelEn: n.labelEn,
    highlight: !!n.highlight,
  })
);

export function findStructureNode(id: string, node: StructureNode = UNIVERSITY_STRUCTURE): StructureNode | null {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const hit = findStructureNode(id, child);
    if (hit) return hit;
  }
  return null;
}

export function pathToHighlighted(node: StructureNode = UNIVERSITY_STRUCTURE, acc: string[] = []): string[] {
  if (node.highlight) return [...acc, node.id];
  for (const child of node.children ?? []) {
    const hit = pathToHighlighted(child, [...acc, node.id]);
    if (hit.length) return hit;
  }
  return [];
}
