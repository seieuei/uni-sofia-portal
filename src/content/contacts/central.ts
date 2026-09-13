export type ContactPerson = {
  roleBg: string;
  roleEn: string;
  name: string;
  room?: string;
  phones?: string[];
  email?: string;
  hoursBg?: string;
  hoursEn?: string;
};

/** Central university administration — from uni-sofia.bg / central-admin.pdf snapshot. */
export const CENTRAL_ADMIN_CONTACTS: ContactPerson[] = [
  {
    roleBg: "Главен мениджър",
    roleEn: "Chief manager",
    name: "инж. Георги Божанин",
    room: "13",
    phones: ["9308 345"],
    email: "georgi_bojanin@admin.uni-sofia.bg",
  },
  {
    roleBg: "Главен секретар",
    roleEn: "Chief secretary",
    name: "Детелина Илиева",
    room: "6",
    phones: ["987 39 12", "9308 336"],
    email: "deti@admin.uni-sofia.bg",
  },
  {
    roleBg: "Главен финансист",
    roleEn: "Chief finance officer",
    name: "Елена Петрова",
    room: "8",
    phones: ["946 34 89"],
    email: "petrovae@admin.uni-sofia.bg",
  },
  {
    roleBg: "Главен счетоводител",
    roleEn: "Chief accountant",
    name: "Дари Иванов",
    room: "113",
    phones: ["8463 489", "9308 455"],
    email: "divanov@admin.uni-sofia.bg",
  },
  {
    roleBg: "Главен юрисконсулт",
    roleEn: "Chief legal counsel",
    name: "Таня Павлова",
    room: "15",
    phones: ["944 12 29", "9308 443"],
    email: "tpavlova@admin.uni-sofia.bg",
  },
  {
    roleBg: "Началник отдел „Образователни дейности“",
    roleEn: "Head of Educational activities",
    name: "Албена Григорова",
    room: "227",
    phones: ["9308 444"],
    email: "agrigorova@admin.uni-sofia.bg",
  },
  {
    roleBg: "Ръководител сектор „Докторанти“",
    roleEn: "Head of Doctoral sector",
    name: "Деяна Андонова",
    room: "214",
    phones: ["9462 185", "9308 445"],
    email: "doctoranti@admin.uni-sofia.bg",
  },
  {
    roleBg: "Ръководител сектор „СДК и продължаващо образование“",
    roleEn: "Head of Continuing education sector",
    name: "Цветанка Панова",
    room: "214",
    phones: ["8463 546", "9308 548"],
    email: "tspanova@admin.uni-sofia.bg",
  },
  {
    roleBg: "Ръководител сектор „Предварителен финансов контрол“",
    roleEn: "Head of Ex-ante financial control",
    name: "Анна Шикова",
    room: "19",
    phones: ["9308 567"],
    email: "annashikova@admin.uni-sofia.bg",
  },
  {
    roleBg: "Отдел „Вътрешен финансово-административен контрол“",
    roleEn: "Internal financial-administrative control",
    name: "Божидара Дончева",
    email: "bozhidara.doncheva@uni-sofia.bg",
  },
  {
    roleBg: "Началник отдел „Човешки ресурси“",
    roleEn: "Head of Human resources",
    name: "Александра Алексиева",
    room: "117",
    phones: ["9308 489"],
    email: "anikolovaa@admin.uni-sofia.bg",
  },
  {
    roleBg: "Началник отдел „Научна дейност“",
    roleEn: "Head of Research department",
    name: "Кристина Фердинандова",
    phones: ["9308 514"],
    email: "science@admin.uni-sofia.bg",
  },
  {
    roleBg: "Началник отдел „Проектна дейност“",
    roleEn: "Head of Projects department",
    name: "Миляна Алексиева",
    phones: ["9308 514"],
    email: "projects@admin.uni-sofia.bg",
  },
  {
    roleBg: "Сектор „Кариерно развитие“",
    roleEn: "Career development sector",
    name: "Надя Стоянова",
    phones: ["02/9871045"],
    email: "n.stoyanova@admin.uni-sofia.bg",
  },
  {
    roleBg: "Началник отдел „Международно сътрудничество“",
    roleEn: "Head of International cooperation",
    name: "Ирена Атанасова",
    room: "5",
    phones: ["9308 220", "944 64 23"],
    email: "i.atanasova@admin.uni-sofia.bg",
  },
  {
    roleBg: "Началник отдел „Информация и връзки с обществеността“",
    roleEn: "Head of Information and PR",
    name: "Боряна Коларова",
    phones: ["9443 517", "9308 436"],
    email: "bkolarova@admin.uni-sofia.bg",
  },
  {
    roleBg: "Началник отдел „Обществени поръчки“",
    roleEn: "Head of Public procurement",
    name: "Петър Станулов",
    room: "20",
    phones: ["02/9308 259"],
    email: "pstanulov@admin.uni-sofia.bg",
  },
  {
    roleBg: "Началник отдел „Имоти“",
    roleEn: "Head of Property department",
    name: "юрисконсулт Изабела Маринова",
    room: "13",
    phones: ["9308 345"],
    email: "imarinova@admin.uni-sofia.bg",
  },
  {
    roleBg: "Началник отдел „Ремонти и снабдяване“",
    roleEn: "Head of Maintenance and supply",
    name: "Симеон Христов",
    room: "116",
    phones: ["9308 555"],
    email: "simeonhh@uni-sofia.bg",
  },
  {
    roleBg: "Началник отдел „Университетски архив“",
    roleEn: "Head of University archive",
    name: "Илонка Колева",
    room: "284",
    phones: ["9308 468"],
    email: "ikoleva_archives@admin.uni-sofia.bg",
  },
  {
    roleBg: "Началник отдел „Акредитиране и рейтинги“",
    roleEn: "Head of Accreditation and rankings",
    name: "Десислава Чочева",
    room: "17",
    email: "d.chocheva@admin.uni-sofia.bg",
  },
];

/** FCML vice-deans — from fknf-vice-deans.pdf snapshot. */
export const FCML_VICE_DEANS: ContactPerson[] = [
  {
    roleBg: "Заместник-декан по учебната дейност (ОКС бакалавър, магистър, ОНС доктор)",
    roleEn: "Vice-dean for education (BA, MA, PhD)",
    name: "Доц. д-р Галина Евстатиева",
    room: "232",
    email: "g.evstatieva@uni-sofia.bg",
    hoursBg: "сряда 12:30–14:00",
    hoursEn: "Wednesday 12:30–14:00",
  },
  {
    roleBg: "Заместник-декан по научноизследователската дейност и академичното израстване",
    roleEn: "Vice-dean for research and academic development",
    name: "Доц. д-р Лиляна Лесничкова",
    room: "232",
    email: "l.lesnichkova@uni-sofia.bg",
    hoursBg: "четвъртък 14:30–16:00",
    hoursEn: "Thursday 14:30–16:00",
  },
  {
    roleBg: "Заместник-декан по проектната дейност",
    roleEn: "Vice-dean for projects",
    name: "Проф. д-р Милена Йорданова",
    room: "232",
    email: "m.yordanova@uni-sofia.bg",
    hoursBg: "петък 14:30–16:00",
    hoursEn: "Friday 14:30–16:00",
  },
  {
    roleBg: "Заместник-декан по международната дейност и Еразъм",
    roleEn: "Vice-dean for international affairs and Erasmus",
    name: "Проф. д-р Петър Моллов",
    room: "232",
    email: "p.mollov@uni-sofia.bg",
    hoursBg: "понеделник 13:00–14:30",
    hoursEn: "Monday 13:00–14:30",
  },
  {
    roleBg: "Помощник по информационните въпроси, МТО и връзка със студентите",
    roleEn: "Assistant for information, facilities and student liaison",
    name: "Гл. ас. д-р Симеон Хинковски",
    room: "232",
    hoursBg: "четвъртък 10:00–11:30",
    hoursEn: "Thursday 10:00–11:30",
  },
];

export const FCML_DEAN: ContactPerson = {
  roleBg: "Декан",
  roleEn: "Dean",
  name: "Проф. д-р Гергана Петкова",
  room: "232",
  email: "dekanat@fcml.uni-sofia.bg",
};
