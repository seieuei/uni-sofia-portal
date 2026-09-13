export type StructureNode = {
  id: string;
  labelBg: string;
  labelEn: string;
  hintBg?: string;
  hintEn?: string;
  highlight?: boolean;
  children?: StructureNode[];
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
      hintBg: "Роли от централната администрация (пилотна схема).",
      hintEn: "Central administration roles (pilot snapshot).",
      children: [
        { id: "gm", labelBg: "Главен мениджър", labelEn: "Chief manager" },
        { id: "secretary", labelBg: "Секретар", labelEn: "Secretary" },
        { id: "finance", labelBg: "Финансист / финансова политика", labelEn: "Finance / financial policy" },
        { id: "accountant", labelBg: "Счетоводител / главен счетоводител", labelEn: "Accountant / chief accountant" },
        { id: "legal", labelBg: "Юрисконсулт / правен отдел", labelEn: "Legal counsel" },
        { id: "od", labelBg: "Образователни дейности (OD)", labelEn: "Educational activities (OD)" },
        { id: "phd-admin", labelBg: "Докторанти", labelEn: "Doctoral office" },
        { id: "registry", labelBg: "Деловодство / Архимед", labelEn: "Registry / Arhimed" },
        { id: "hr", labelBg: "Човешки ресурси", labelEn: "Human resources" },
        { id: "pfc", labelBg: "Планово-финансова служба (ПФЦ)", labelEn: "Planning and finance (PFC)" },
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
        { id: "FFIL", labelBg: "Философски факултет", labelEn: "Faculty of Philosophy" },
        {
          id: "FCML",
          labelBg: "Факултет по класически и нови филологии (ФКНФ)",
          labelEn: "Faculty of Classical and Modern Philology (FCML)",
          highlight: true,
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
                },
                {
                  id: "vd-nid",
                  labelBg: "Зам.-декан НИД и академично израстване — доц. д-р Лиляна Лесничкова",
                  labelEn: "Vice-dean for research — Assoc. Prof. Lilyana Lesnichkova",
                },
                {
                  id: "vd-projects",
                  labelBg: "Зам.-декан проекти — проф. д-р Милена Йорданова",
                  labelEn: "Vice-dean for projects — Prof. Milena Yordanova",
                },
                {
                  id: "vd-erasmus",
                  labelBg: "Зам.-декан международна дейност и Еразъм — проф. д-р Петър Моллов",
                  labelEn: "Vice-dean for international / Erasmus — Prof. Petar Mollov",
                },
                {
                  id: "vd-info",
                  labelBg: "Помощник информационни въпроси — гл. ас. д-р Симеон Хинковски",
                  labelEn: "Assistant for information — Assist. Prof. Simeon Hinkovski",
                },
              ],
            },
            {
              id: "fcml-ba",
              labelBg: "Бакалавърски програми",
              labelEn: "Bachelor programmes",
              hintBg: "Списък по официалните специалности на ФКНФ (пилотна извадка).",
              hintEn: "FCML bachelor programmes (pilot snapshot).",
              children: [
                { id: "ba-afr", labelBg: "Африканистика", labelEn: "African Studies", highlight: true },
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
