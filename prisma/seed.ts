import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.submission.deleteMany();
  await prisma.routingRule.deleteMany();
  await prisma.formTemplate.deleteMany();
  await prisma.office.deleteMany();
  await prisma.faculty.deleteMany();

  const faculties = await Promise.all(
    [
      { code: "FMI", nameBg: "Факултет по математика и информатика", nameEn: "Faculty of Mathematics and Informatics", shortBg: "ФМИ", shortEn: "FMI" },
      { code: "FF", nameBg: "Филологически факултет", nameEn: "Faculty of Philology", shortBg: "Филология", shortEn: "Philology" },
      { code: "FJMC", nameBg: "Факултет по журналистика и масова комуникация", nameEn: "Faculty of Journalism and Mass Communication", shortBg: "ФЖМК", shortEn: "FJMC" },
      { code: "LF", nameBg: "Юридически факултет", nameEn: "Faculty of Law", shortBg: "Право", shortEn: "Law" },
      { code: "EF", nameBg: "Икономически факултет", nameEn: "Faculty of Economics and Business Administration", shortBg: "ИФ", shortEn: "Economics" },
      { code: "HF", nameBg: "Исторически факултет", nameEn: "Faculty of History", shortBg: "История", shortEn: "History" },
      { code: "BF", nameBg: "Биологически факултет", nameEn: "Faculty of Biology", shortBg: "Биология", shortEn: "Biology" },
      { code: "GF", nameBg: "Геолого-географски факултет", nameEn: "Faculty of Geology and Geography", shortBg: "ГГФ", shortEn: "Geology" },
    ].map((f) => prisma.faculty.create({ data: f }))
  );

  const byCode = Object.fromEntries(faculties.map((f) => [f.code, f]));

  const offices = await Promise.all(
    [
      { code: "student_affairs", nameBg: "Студентски отдел", nameEn: "Student Affairs Office", descriptionBg: "Където молбите ходят да си починат.", descriptionEn: "Where petitions go to rest.", emailSim: "student.affairs@sim.uni-sofia.local" },
      { code: "academic_council", nameBg: "Учебен отдел", nameEn: "Academic Affairs", descriptionBg: "За всичко, което звучи „учебно“.", descriptionEn: "For anything that sounds academic.", emailSim: "academic@sim.uni-sofia.local" },
      { code: "dean_office", nameBg: "Деканат", nameEn: "Dean’s Office", descriptionBg: "Подписът е свят. Печатът — още по-свят.", descriptionEn: "The signature is sacred. The stamp more so.", emailSim: "dean@sim.uni-sofia.local" },
      { code: "finance", nameBg: "Финансов отдел", nameEn: "Finance Office", descriptionBg: "Такси, квитанции и леко напрежение.", descriptionEn: "Fees, receipts, and mild tension.", emailSim: "finance@sim.uni-sofia.local" },
      { code: "dorms", nameBg: "Общежития и столове", nameEn: "Dormitories & Canteens", descriptionBg: "Леглото е мит. Опашката е реалност.", descriptionEn: "A bed is a myth. The queue is real.", emailSim: "dorms@sim.uni-sofia.local" },
      { code: "admissions", nameBg: "Приемна комисия", nameEn: "Admissions Committee", descriptionBg: "Документите обичат да пътуват.", descriptionEn: "Documents love to travel.", emailSim: "admissions@sim.uni-sofia.local" },
      { code: "hr", nameBg: "Човешки ресурси", nameEn: "Human Resources", descriptionBg: "За преподаватели и служители.", descriptionEn: "For lecturers and staff.", emailSim: "hr@sim.uni-sofia.local" },
      { code: "it_helpdesk", nameBg: "ИТ поддръжка (симулирана)", nameEn: "IT Helpdesk (simulated)", descriptionBg: "Паролата е изтекла… преди 7 години.", descriptionEn: "Your password expired… 7 years ago.", emailSim: "it@sim.uni-sofia.local" },
      { code: "library", nameBg: "Университетска библиотека", nameEn: "University Library", descriptionBg: "Книгата е налично, ако знаеш кой склад.", descriptionEn: "The book exists if you know which warehouse.", emailSim: "library@sim.uni-sofia.local" },
    ].map((o) => prisma.office.create({ data: o }))
  );

  const office = Object.fromEntries(offices.map((o) => [o.code, o]));

  const field = (
    name: string,
    labelBg: string,
    labelEn: string,
    type: string,
    required = true,
    options?: { value: string; labelBg: string; labelEn: string }[]
  ) => ({ name, labelBg, labelEn, type, required, options });

  const formsData = [
    {
      slug: "exam-resit",
      titleBg: "Молба за явяване на поправителен изпит",
      titleEn: "Request for exam resit",
      descriptionBg: "Класика. Попълваш, печаташ, носиш, връщат те за печат в цвят „син“.",
      descriptionEn: "A classic. Fill, print, deliver, get sent back for a blue stamp.",
      category: "academic",
      roles: "student",
      satireNoteBg: "Според легендата някой веднъж е получил отговор в същия семестър.",
      satireNoteEn: "Legend says someone once got a reply in the same semester.",
      fieldsJson: JSON.stringify([
        field("fullName", "Име и фамилия", "Full name", "text"),
        field("fn", "Факултетен номер", "Student ID", "text"),
        field("course", "Курс / дисциплина", "Course / subject", "text"),
        field("reason", "Основание", "Reason", "textarea"),
        field("preferredDate", "Предпочитана дата", "Preferred date", "date", false),
      ]),
    },
    {
      slug: "transcript",
      titleBg: "Заявка за академична справка",
      titleEn: "Academic transcript request",
      descriptionBg: "Справката е готова „скоро“. „Скоро“ е гъвкаво понятие.",
      descriptionEn: "Ready „soon“. „Soon“ is a flexible concept.",
      category: "admin",
      roles: "student,applicant",
      satireNoteBg: "Може да се изисква бланка, която съществува само като PDF в нечий Outlook.",
      satireNoteEn: "May require a form that only exists as a PDF in someone’s Outlook.",
      fieldsJson: JSON.stringify([
        field("fullName", "Име и фамилия", "Full name", "text"),
        field("fn", "Факултетен номер / ЕГН", "Student ID / national ID", "text"),
        field("copies", "Брой екземпляри", "Number of copies", "number"),
        field("language", "Език", "Language", "select", true, [
          { value: "bg", labelBg: "Български", labelEn: "Bulgarian" },
          { value: "en", labelBg: "Английски", labelEn: "English" },
        ]),
        field("purpose", "Цел", "Purpose", "textarea"),
      ]),
    },
    {
      slug: "dorm-application",
      titleBg: "Кандидатстване за общежитие",
      titleEn: "Dormitory application",
      descriptionBg: "Точки, критерии и мистериозни списъци на вратата.",
      descriptionEn: "Points, criteria, and mysterious lists on the door.",
      category: "housing",
      roles: "student",
      satireNoteBg: "Ако получиш стая — поздравления. Ако не — също попълваш отново догодина.",
      satireNoteEn: "If you get a room — congrats. If not — you’ll fill this again next year.",
      fieldsJson: JSON.stringify([
        field("fullName", "Име и фамилия", "Full name", "text"),
        field("fn", "Факултетен номер", "Student ID", "text"),
        field("year", "Курс", "Year of study", "number"),
        field("city", "Населено място", "Hometown", "text"),
        field("income", "Доход на домакинство (лв.)", "Household income (BGN)", "number", false),
        field("notes", "Допълнителни обстоятелства", "Additional circumstances", "textarea", false),
      ]),
    },
    {
      slug: "fee-deferral",
      titleBg: "Молба за разсрочване на такса",
      titleEn: "Tuition fee deferral request",
      descriptionBg: "Финансите обичат молби с печат. И още една молба.",
      descriptionEn: "Finance loves stamped petitions. And another petition.",
      category: "finance",
      roles: "student",
      satireNoteBg: "Маршрутът често е: факултет → финанси → обратно → „липсва подпис“.",
      satireNoteEn: "Typical route: faculty → finance → back → „missing signature“.",
      fieldsJson: JSON.stringify([
        field("fullName", "Име и фамилия", "Full name", "text"),
        field("fn", "Факултетен номер", "Student ID", "text"),
        field("amount", "Сума (лв.)", "Amount (BGN)", "number"),
        field("installments", "Брой вноски", "Number of installments", "number"),
        field("reason", "Мотиви", "Motivation", "textarea"),
      ]),
    },
    {
      slug: "grade-appeal",
      titleBg: "Възражение срещу оценка",
      titleEn: "Grade appeal",
      descriptionBg: "Дипломацията е умение. Тази форма те учи на него.",
      descriptionEn: "Diplomacy is a skill. This form teaches it.",
      category: "academic",
      roles: "student",
      satireNoteBg: "Препоръчително е да не пишеш „системата е несправедлива“ в първото изречение.",
      satireNoteEn: "Avoid opening with „the system is unfair“.",
      fieldsJson: JSON.stringify([
        field("fullName", "Име и фамилия", "Full name", "text"),
        field("fn", "Факултетен номер", "Student ID", "text"),
        field("course", "Дисциплина", "Course", "text"),
        field("lecturer", "Преподавател", "Lecturer", "text"),
        field("grade", "Получена оценка", "Received grade", "text"),
        field("argument", "Аргументация", "Argument", "textarea"),
      ]),
    },
    {
      slug: "leave-of-absence",
      titleBg: "Молба за прекъсване на обучението",
      titleEn: "Leave of absence request",
      descriptionBg: "Животът се случва. Бюрокрацията също.",
      descriptionEn: "Life happens. Bureaucracy also happens.",
      category: "admin",
      roles: "student",
      satireNoteBg: "Ще ти кажат „донеси медицинска“ дори когато причината е „съществувам“.",
      satireNoteEn: "They may ask for a medical note even when the reason is „existing“.",
      fieldsJson: JSON.stringify([
        field("fullName", "Име и фамилия", "Full name", "text"),
        field("fn", "Факултетен номер", "Student ID", "text"),
        field("from", "От дата", "From date", "date"),
        field("to", "До дата", "To date", "date"),
        field("reason", "Причина", "Reason", "textarea"),
      ]),
    },
    {
      slug: "admission-docs",
      titleBg: "Подаване на документи за прием",
      titleEn: "Admissions document submission",
      descriptionBg: "Папка, класьор, копие, оригинал, и още едно копие „за всеки случай“.",
      descriptionEn: "Folder, binder, copy, original, and another copy „just in case“.",
      category: "admission",
      roles: "applicant",
      satireNoteBg: "Сайтът на факултета казва едно. Централният — друго. Истината е в коридора.",
      satireNoteEn: "The faculty site says one thing. Central says another. Truth lives in the hallway.",
      fieldsJson: JSON.stringify([
        field("fullName", "Име и фамилия", "Full name", "text"),
        field("email", "Имейл", "Email", "email"),
        field("program", "Специалност", "Program", "text"),
        field("docsList", "Списък на приложените документи", "Attached documents list", "textarea"),
        field("phone", "Телефон", "Phone", "text", false),
      ]),
    },
    {
      slug: "room-booking",
      titleBg: "Заявка за зала / аудитория",
      titleEn: "Room / auditorium booking",
      descriptionBg: "Залата е свободна. Освен ако не е. Никой не знае.",
      descriptionEn: "The room is free. Unless it isn’t. Nobody knows.",
      category: "admin",
      roles: "lecturer,admin_staff",
      satireNoteBg: "Календарът е в Excel. Или в главата на чичо от ключарницата.",
      satireNoteEn: "The calendar is in Excel. Or in the locksmith uncle’s head.",
      fieldsJson: JSON.stringify([
        field("fullName", "Име на заявителя", "Requester name", "text"),
        field("email", "Имейл", "Email", "email"),
        field("room", "Желана зала", "Desired room", "text"),
        field("date", "Дата", "Date", "date"),
        field("timeFrom", "От час", "From time", "text"),
        field("timeTo", "До час", "To time", "text"),
        field("purpose", "Цел", "Purpose", "textarea"),
      ]),
    },
    {
      slug: "equipment-request",
      titleBg: "Заявка за техника / проектор",
      titleEn: "Equipment / projector request",
      descriptionBg: "Проекторът „работил миналата седмица“ е валидно състояние.",
      descriptionEn: "„Worked last week“ is a valid projector state.",
      category: "admin",
      roles: "lecturer,admin_staff",
      satireNoteBg: "Кабелът HDMI е реликва. Носете си собствен — и адаптер за адаптера.",
      satireNoteEn: "The HDMI cable is a relic. Bring your own — and an adapter for the adapter.",
      fieldsJson: JSON.stringify([
        field("fullName", "Име", "Name", "text"),
        field("email", "Имейл", "Email", "email"),
        field("item", "Какво е нужно", "What is needed", "text"),
        field("when", "Кога", "When", "date"),
        field("location", "Къде", "Where", "text"),
        field("notes", "Бележки", "Notes", "textarea", false),
      ]),
    },
    {
      slug: "library-renewal",
      titleBg: "Подновяване на библиотечен срок",
      titleEn: "Library loan renewal",
      descriptionBg: "Книгата е при теб. Срокът — при библиотеката. Имейлът — някъде по пътя.",
      descriptionEn: "You have the book. The library has the due date. Email is somewhere in between.",
      category: "academic",
      roles: "student,lecturer",
      satireNoteBg: "Глобата расте по-бързо от GPA-то.",
      satireNoteEn: "Fines grow faster than your GPA.",
      fieldsJson: JSON.stringify([
        field("fullName", "Име и фамилия", "Full name", "text"),
        field("readerId", "Читателски номер", "Reader ID", "text"),
        field("bookTitle", "Заглавие", "Book title", "text"),
        field("inventoryNo", "Инвентарен №", "Inventory no.", "text", false),
        field("extendUntil", "Поднови до", "Extend until", "date"),
      ]),
    },
  ];

  const forms = [];
  for (const f of formsData) {
    forms.push(await prisma.formTemplate.create({ data: f }));
  }
  const formBySlug = Object.fromEntries(forms.map((f) => [f.slug, f]));

  const rules: {
    formSlug: string;
    facultyCode?: string;
    role: string;
    officeCode: string;
    priority?: number;
    noteBg?: string;
    noteEn?: string;
  }[] = [
    { formSlug: "exam-resit", role: "student", officeCode: "academic_council", noteBg: "Първо учебен отдел, после евентуално деканат.", noteEn: "Academic affairs first, maybe dean later." },
    { formSlug: "exam-resit", facultyCode: "FMI", role: "student", officeCode: "dean_office", priority: 10, noteBg: "ФМИ често иска печат от деканата.", noteEn: "FMI often wants a dean stamp." },
    { formSlug: "transcript", role: "*", officeCode: "student_affairs" },
    { formSlug: "dorm-application", role: "student", officeCode: "dorms" },
    { formSlug: "fee-deferral", role: "student", officeCode: "finance" },
    { formSlug: "grade-appeal", role: "student", officeCode: "dean_office" },
    { formSlug: "leave-of-absence", role: "student", officeCode: "student_affairs" },
    { formSlug: "admission-docs", role: "applicant", officeCode: "admissions" },
    { formSlug: "room-booking", role: "lecturer", officeCode: "dean_office" },
    { formSlug: "room-booking", role: "admin_staff", officeCode: "academic_council" },
    { formSlug: "equipment-request", role: "*", officeCode: "it_helpdesk" },
    { formSlug: "library-renewal", role: "*", officeCode: "library" },
  ];

  for (const r of rules) {
    await prisma.routingRule.create({
      data: {
        formId: formBySlug[r.formSlug].id,
        facultyId: r.facultyCode ? byCode[r.facultyCode].id : null,
        role: r.role,
        officeId: office[r.officeCode].id,
        priority: r.priority ?? 0,
        noteBg: r.noteBg,
        noteEn: r.noteEn,
      },
    });
  }

  console.log(`Seeded ${faculties.length} faculties, ${offices.length} offices, ${forms.length} forms, ${rules.length} routing rules.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
