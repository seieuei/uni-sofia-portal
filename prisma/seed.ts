import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { seedProcesses } from "./seed-processes";
import { seedAcademic } from "./seed-academic";
import { generateCaseDocument, writeGenerated } from "../src/lib/portalDocx";
import { catalogBySlug, fieldsFor, routeFor } from "../src/lib/catalog";
import { routeStepPayload } from "../src/lib/processRoute";

const prisma = new PrismaClient();

async function ensureTemplate() {
  const tpl = path.join(process.cwd(), "templates", "official", "5.2-honorary.docx");
  if (!fs.existsSync(tpl)) {
    console.log("Building 5.2 DOCX template…");
    const r = spawnSync("npx", ["tsx", "scripts/build-5-2-template.ts"], {
      stdio: "inherit",
      env: process.env,
      shell: process.platform === "win32",
    });
    if (r.status !== 0) throw new Error("Failed to build 5.2 template");
  }
  const officialDir = path.join(process.cwd(), "templates", "official");
  const existingOfficial = fs.existsSync(officialDir)
    ? fs.readdirSync(officialDir).filter((f) => f.endsWith(".docx")).length
    : 0;
  const catalogPy = path.join(process.cwd(), "scripts", "build-official-templates.py");
  if (existingOfficial > 0) {
    console.log(`Official catalog templates already present (${existingOfficial} docx) — skipping python regenerate.`);
  } else if (fs.existsSync(catalogPy)) {
    console.log("Building structural official catalog templates…");
    const r2 = spawnSync("python3", [catalogPy], { stdio: "inherit", env: process.env });
    if (r2.status !== 0) console.warn("Official catalog templates: non-zero exit (continuing)");
  }
}

async function main() {
  await ensureTemplate();

  // Clear Phase A + legacy tables (order matters for FKs)
  await prisma.electiveChoice.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.scheduleSlot.deleteMany();
  await prisma.syllabus.deleteMany();
  await prisma.courseOffering.deleteMany();
  await prisma.electiveWindow.deleteMany();
  await prisma.curriculumCourse.deleteMany();
  await prisma.curriculumVersion.deleteMany();
  await prisma.program.deleteMany();
  await prisma.loadLine.deleteMany();
  await prisma.loadReport.deleteMany();
  await prisma.caseEvent.deleteMany();
  await prisma.caseStep.deleteMany();
  await prisma.case.deleteMany();
  await prisma.processDefinition.deleteMany();
  await prisma.templateAsset.deleteMany();
  await prisma.handbookEntry.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.routingRule.deleteMany();
  await prisma.formTemplate.deleteMany();
  await prisma.office.deleteMany();
  await prisma.faculty.deleteMany();

  const faculties = await Promise.all(
    [
      {
        code: "FCML",
        nameBg: "Факултет по класически и нови филологии",
        nameEn: "Faculty of Classical and Modern Philology",
        shortBg: "ФКНФ",
        shortEn: "FCML",
      },
      {
        code: "FMI",
        nameBg: "Факултет по математика и информатика",
        nameEn: "Faculty of Mathematics and Informatics",
        shortBg: "ФМИ",
        shortEn: "FMI",
      },
      {
        code: "FF",
        nameBg: "Филологически факултет",
        nameEn: "Faculty of Philology",
        shortBg: "Филология",
        shortEn: "Philology",
      },
      {
        code: "FJMC",
        nameBg: "Факултет по журналистика и масова комуникация",
        nameEn: "Faculty of Journalism and Mass Communication",
        shortBg: "ФЖМК",
        shortEn: "FJMC",
      },
      {
        code: "LF",
        nameBg: "Юридически факултет",
        nameEn: "Faculty of Law",
        shortBg: "Право",
        shortEn: "Law",
      },
      {
        code: "EF",
        nameBg: "Икономически факултет",
        nameEn: "Faculty of Economics and Business Administration",
        shortBg: "ИФ",
        shortEn: "Economics",
      },
      {
        code: "HF",
        nameBg: "Исторически факултет",
        nameEn: "Faculty of History",
        shortBg: "История",
        shortEn: "History",
      },
      {
        code: "BF",
        nameBg: "Биологически факултет",
        nameEn: "Faculty of Biology",
        shortBg: "Биология",
        shortEn: "Biology",
      },
    ].map((f) => prisma.faculty.create({ data: f }))
  );

  const byCode = Object.fromEntries(faculties.map((f) => [f.code, f]));
  const fcml = byCode.FCML;

  const offices = await Promise.all(
    [
      {
        code: "student_affairs",
        nameBg: "Студентски отдел",
        nameEn: "Student Affairs Office",
        descriptionBg: "Студентски молби и справки.",
        descriptionEn: "Student petitions and certificates.",
        emailSim: "student.affairs@sim.uni-sofia.local",
      },
      {
        code: "academic_council",
        nameBg: "Учебен отдел",
        nameEn: "Academic Affairs",
        descriptionBg: "Учебни процеси.",
        descriptionEn: "Academic processes.",
        emailSim: "academic@sim.uni-sofia.local",
      },
      {
        code: "dean_office",
        nameBg: "Деканат",
        nameEn: "Dean’s Office",
        descriptionBg: "Декански подписи и преписки.",
        descriptionEn: "Dean signatures and cases.",
        emailSim: "dean@sim.uni-sofia.local",
      },
      {
        code: "finance",
        nameBg: "Финансов отдел / ПФЦ",
        nameEn: "Finance / PFC",
        descriptionBg: "Хонорари и финансиране.",
        descriptionEn: "Honoraria and funding.",
        emailSim: "finance@sim.uni-sofia.local",
      },
      {
        code: "legal",
        nameBg: "Правен отдел",
        nameEn: "Legal Office",
        descriptionBg: "Правни становища (stub).",
        descriptionEn: "Legal opinions (stub).",
        emailSim: "legal@sim.uni-sofia.local",
      },
      {
        code: "dorms",
        nameBg: "Общежития и столове",
        nameEn: "Dormitories & Canteens",
        descriptionBg: "Общежития.",
        descriptionEn: "Housing.",
        emailSim: "dorms@sim.uni-sofia.local",
      },
      {
        code: "admissions",
        nameBg: "Приемна комисия",
        nameEn: "Admissions Committee",
        descriptionBg: "Прием.",
        descriptionEn: "Admissions.",
        emailSim: "admissions@sim.uni-sofia.local",
      },
      {
        code: "hr",
        nameBg: "Човешки ресурси",
        nameEn: "Human Resources",
        descriptionBg: "Преподаватели и служители.",
        descriptionEn: "Lecturers and staff.",
        emailSim: "hr@sim.uni-sofia.local",
      },
      {
        code: "it_helpdesk",
        nameBg: "ИТ поддръжка (симулирана)",
        nameEn: "IT Helpdesk (simulated)",
        descriptionBg: "ИТ заявки.",
        descriptionEn: "IT requests.",
        emailSim: "it@sim.uni-sofia.local",
      },
      {
        code: "library",
        nameBg: "Университетска библиотека",
        nameEn: "University Library",
        descriptionBg: "Библиотека.",
        descriptionEn: "Library.",
        emailSim: "library@sim.uni-sofia.local",
      },
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
      descriptionBg: "Попълване на молба за поправителен изпит.",
      descriptionEn: "Fill a request for an exam resit.",
      category: "academic",
      roles: "student",
      satireNoteBg: null,
      satireNoteEn: null,
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
      descriptionBg: "Заявка за академична справка.",
      descriptionEn: "Request an academic transcript.",
      category: "admin",
      roles: "student,applicant",
      satireNoteBg: null,
      satireNoteEn: null,
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
      descriptionBg: "Кандидатстване за общежитие.",
      descriptionEn: "Apply for dormitory housing.",
      category: "housing",
      roles: "student",
      satireNoteBg: null,
      satireNoteEn: null,
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
      descriptionBg: "Молба за разсрочване на такса.",
      descriptionEn: "Request tuition fee deferral.",
      category: "finance",
      roles: "student",
      satireNoteBg: null,
      satireNoteEn: null,
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
      descriptionBg: "Възражение срещу оценка.",
      descriptionEn: "Appeal a grade.",
      category: "academic",
      roles: "student",
      satireNoteBg: null,
      satireNoteEn: null,
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
      descriptionBg: "Молба за прекъсване.",
      descriptionEn: "Request a leave of absence.",
      category: "admin",
      roles: "student",
      satireNoteBg: null,
      satireNoteEn: null,
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
      descriptionBg: "Подаване на документи за прием.",
      descriptionEn: "Submit admissions documents.",
      category: "admission",
      roles: "applicant",
      satireNoteBg: null,
      satireNoteEn: null,
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
      descriptionBg: "Заявка за зала.",
      descriptionEn: "Book a room.",
      category: "admin",
      roles: "lecturer,program_admin,faculty_admin,admin_staff",
      satireNoteBg: null,
      satireNoteEn: null,
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
      descriptionBg: "Заявка за техника.",
      descriptionEn: "Request equipment.",
      category: "admin",
      roles: "lecturer,program_admin,faculty_admin,admin_staff",
      satireNoteBg: null,
      satireNoteEn: null,
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
      descriptionBg: "Подновяване на библиотечен срок.",
      descriptionEn: "Renew a library loan.",
      category: "academic",
      roles: "student,lecturer",
      satireNoteBg: null,
      satireNoteEn: null,
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
    {
      formSlug: "exam-resit",
      role: "student",
      officeCode: "academic_council",
      noteBg: "Първо учебен отдел.",
      noteEn: "Academic affairs first.",
    },
    {
      formSlug: "exam-resit",
      facultyCode: "FMI",
      role: "student",
      officeCode: "dean_office",
      priority: 10,
      noteBg: "ФМИ често иска печат от деканата.",
      noteEn: "FMI often wants a dean stamp.",
    },
    { formSlug: "transcript", role: "*", officeCode: "student_affairs" },
    { formSlug: "dorm-application", role: "student", officeCode: "dorms" },
    { formSlug: "fee-deferral", role: "student", officeCode: "finance" },
    { formSlug: "grade-appeal", role: "student", officeCode: "dean_office" },
    { formSlug: "leave-of-absence", role: "student", officeCode: "student_affairs" },
    { formSlug: "admission-docs", role: "applicant", officeCode: "admissions" },
    { formSlug: "room-booking", role: "lecturer", officeCode: "dean_office" },
    { formSlug: "room-booking", role: "program_admin", officeCode: "academic_council" },
    { formSlug: "room-booking", role: "faculty_admin", officeCode: "dean_office" },
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

  const passwordHash = await bcrypt.hash("demo1234", 10);

  const demoUsers = [
    {
      email: "student@demo.uni-sofia.local",
      name: "Мария Студентова",
      role: "student",
      department: "Африканистика",
      year: 3,
    },
    {
      email: "lecturer@demo.uni-sofia.local",
      name: "д-р Иван Хонораров",
      role: "lecturer",
      department: "Африканистика",
      year: null as number | null,
    },
    {
      email: "program.admin@demo.uni-sofia.local",
      name: "Елена Програмова",
      role: "program_admin",
      department: "Африканистика",
      year: null,
    },
    {
      email: "faculty.admin@demo.uni-sofia.local",
      name: "проф. Петър Факултетов",
      role: "faculty_admin",
      department: "ФКНФ деканат",
      year: null,
    },
  ];

  const users: Record<string, { id: string; email: string; name: string; role: string }> = {};
  for (const u of demoUsers) {
    const created = await prisma.user.create({
      data: {
        email: u.email,
        passwordHash,
        name: u.name,
        profile: {
          create: {
            role: u.role,
            facultyId: fcml.id,
            department: u.department,
            year: u.year,
          },
        },
      },
    });
    users[u.role] = { id: created.id, email: created.email, name: created.name, role: u.role };
  }

  await seedProcesses(prisma);

  function attachGeneratedDoc(
    c: { id: string; number: string },
    proc: { slug: string; titleBg: string; catalogCode: string | null; templatePath: string | null },
    fields: Record<string, unknown>,
    preparedBy: string
  ) {
    const cat = catalogBySlug(proc.slug);
    const schema = cat ? fieldsFor(cat) : [];
    const fieldRows = schema.map((f) => ({
      name: f.name,
      label: f.labelBg,
      value: f.name === "loadLines" ? JSON.stringify(fields.loadLines ?? []) : String(fields[f.name] ?? ""),
    }));
    const gen = generateCaseDocument({
      process: {
        slug: proc.slug,
        titleBg: proc.titleBg,
        catalogCode: proc.catalogCode,
        templatePath: proc.templatePath,
      },
      caseNumber: c.number,
      preparedBy,
      faculty: String(fields.faculty || ""),
      fields: fieldRows,
      fieldMap: fields,
    });
    const written = writeGenerated(gen.filename, gen.buffer);
    return prisma.case.update({ where: { id: c.id }, data: { docPath: written.rel } });
  }


  const process = await prisma.processDefinition.findUniqueOrThrow({ where: { slug: "load-pay-5-2" } });
  const leaveProc = await prisma.processDefinition.findUnique({ where: { slug: "p-2-9" } });
  const interruptProc = await prisma.processDefinition.findUnique({ where: { slug: "p-3-5" } });
  const memoProc = await prisma.processDefinition.findUnique({ where: { slug: "p-9-4" } });

  await prisma.templateAsset.create({
    data: {
      code: "5.2-honorary",
      titleBg: "Образец 5.2 — Натовареност / хонорари",
      titleEn: "Form 5.2 — Load / honorary pay",
      path: "templates/official/5.2-honorary.docx",
      driveFileId: "12PFiP5OBClZNDKxqG_GHHgsbGUcYlZi8",
      notes:
        "Structural DOCX mirroring blank fields. Official Drive blank not fetched in build; not pixel-identical.",
    },
  });

  // Sample 5.2 case in flight: awaiting lecturer confirmation
  const sampleCase = await prisma.case.create({
    data: {
      number: "ПР-2609-10001",
      title: "Натовареност 5.2 — Африканистика — зимен семестър 2025/26",
      status: "awaiting_lecturer",
      processId: process.id,
      ownerId: users.program_admin.id,
      facultyId: fcml.id,
      metaJson: JSON.stringify({
        period: "Зимен семестър 2025/26",
        program: "Африканистика",
        funding: "Факултетен бюджет / хонорари",
      }),
    },
  });

  const report = await prisma.loadReport.create({
    data: {
      caseId: sampleCase.id,
      periodLabel: "Зимен семестър 2025/26",
      programName: "Африканистика",
      fundingSource: "Факултетен бюджет / хонорари",
      currency: "EUR",
      totalAmount: 0,
      lines: {
        create: [
          {
            lecturerName: users.lecturer.name,
            lecturerEmail: users.lecturer.email,
            activity: "lectures",
            hours: 30,
            rateEur: 25,
            amountEur: 750,
            confirmed: false,
            sortOrder: 0,
          },
          {
            lecturerName: users.lecturer.name,
            lecturerEmail: users.lecturer.email,
            activity: "exercises",
            hours: 15,
            rateEur: 18,
            amountEur: 270,
            confirmed: false,
            sortOrder: 1,
          },
          {
            lecturerName: users.lecturer.name,
            lecturerEmail: users.lecturer.email,
            activity: "exams",
            hours: 8,
            rateEur: 15,
            amountEur: 120,
            confirmed: false,
            sortOrder: 2,
          },
        ],
      },
    },
  });

  const cat52 = catalogBySlug("load-pay-5-2");
  const official52 = cat52 ? routeFor(cat52).filter((s) => s.key !== "initiator") : [];
  await prisma.caseStep.createMany({
    data: [
      {
        caseId: sampleCase.id,
        key: "confirm_hours",
        titleBg: "Потвърдете часовете си",
        titleEn: "Confirm your hours",
        status: "waiting",
        assigneeId: users.lecturer.id,
        sortOrder: 1,
        payloadJson: JSON.stringify({ reportId: report.id, phase: "approve" }),
      },
      {
        caseId: sampleCase.id,
        key: "admin_review",
        titleBg: "Админ преглед и изчисление",
        titleEn: "Admin review & calculate",
        status: "pending",
        assigneeId: users.program_admin.id,
        sortOrder: 2,
        payloadJson: JSON.stringify({ phase: "approve" }),
      },
      ...official52.map((s, i) => ({
        caseId: sampleCase.id,
        key: s.key,
        titleBg: s.titleBg,
        titleEn: s.titleEn,
        status: "pending",
        sortOrder: 3 + i,
        payloadJson: routeStepPayload(s),
      })),
    ],
  });

  await prisma.caseEvent.createMany({
    data: [
      {
        caseId: sampleCase.id,
        actorId: users.program_admin.id,
        type: "created",
        messageBg: "Преписката е създадена (демо сийд).",
        messageEn: "Case created (demo seed).",
      },
      {
        caseId: sampleCase.id,
        actorId: users.program_admin.id,
        type: "sent_to_lecturer",
        messageBg: "Изпратено към преподавателя за потвърждение на часовете.",
        messageEn: "Sent to lecturer to confirm hours.",
      },
    ],
  });

  if (leaveProc) {
    const leaveCase = await prisma.case.create({
      data: {
        number: "ПР-2609-10002",
        title: "Отпуск — д-р Иван Хонораров — 2026",
        status: "awaiting_approvals",
        processId: leaveProc.id,
        ownerId: users.lecturer.id,
        facultyId: fcml.id,
        metaJson: JSON.stringify({
          fields: {
            fullName: users.lecturer.name,
            faculty: "ФКНФ",
            department: "Африканистика",
            leaveType: "paid",
            dateFrom: "2026-10-01",
            dateTo: "2026-10-14",
            grounds: "Платен годишен отпуск (демо).",
          },
        }),
        steps: {
          create: (catalogBySlug("p-2-9") ? routeFor(catalogBySlug("p-2-9")!) : []).map((s, i) => ({
            key: s.key,
            titleBg: s.titleBg,
            titleEn: s.titleEn,
            status: i === 0 ? "done" : i === 1 ? "waiting" : "pending",
            sortOrder: i + 1,
            assigneeId: i === 0 ? users.lecturer.id : null,
            payloadJson: routeStepPayload(s),
          })),
        },
      },
    });
    await prisma.caseEvent.create({
      data: {
        caseId: leaveCase.id,
        actorId: users.lecturer.id,
        type: "created",
        messageBg: "Демо преписка за отпуск.",
        messageEn: "Demo leave case.",
      },
    });
    await attachGeneratedDoc(leaveCase, leaveProc, JSON.parse(leaveCase.metaJson).fields, users.lecturer.name);
  }

  if (interruptProc) {
    const stCase = await prisma.case.create({
      data: {
        number: "ПР-2609-10003",
        title: "Прекъсване — Мария Студентова — 2025/26",
        status: "awaiting_approvals",
        processId: interruptProc.id,
        ownerId: users.student.id,
        facultyId: fcml.id,
        metaJson: JSON.stringify({
          fields: {
            fullName: users.student.name,
            faculty: "ФКНФ",
            department: "Африканистика",
            studentId: "20203-306",
            year: "3",
            specialty: "Африканистика",
            pudGround: "illness",
            grounds: "Демо заявление по чл. 165 ПУД.",
          },
        }),
        steps: {
          create: (catalogBySlug("p-3-5") ? routeFor(catalogBySlug("p-3-5")!) : []).map((s, i) => ({
            key: s.key,
            titleBg: s.titleBg,
            titleEn: s.titleEn,
            status: i === 0 ? "done" : i === 1 ? "waiting" : "pending",
            sortOrder: i + 1,
            assigneeId: i === 0 ? users.student.id : i === 3 ? users.faculty_admin.id : null,
            payloadJson: routeStepPayload(s),
          })),
        },
      },
    });
    await prisma.caseEvent.create({
      data: {
        caseId: stCase.id,
        actorId: users.student.id,
        type: "created",
        messageBg: "Демо студентско заявление 3.5.",
        messageEn: "Demo student petition 3.5.",
      },
    });
    await attachGeneratedDoc(stCase, interruptProc, JSON.parse(stCase.metaJson).fields, users.student.name);
  }

  if (memoProc) {
    const memo = await prisma.case.create({
      data: {
        number: "ПР-2609-10004",
        title: "Докладна — Африканистика — демо",
        status: "draft",
        processId: memoProc.id,
        ownerId: users.faculty_admin.id,
        facultyId: fcml.id,
        metaJson: JSON.stringify({
          fields: {
            fullName: users.faculty_admin.name,
            faculty: "ФКНФ",
            department: "ФКНФ деканат",
            addressee: "Ректора на СУ",
            subject: "Демо докладна записка",
            body: "Моля да се запознаете с приложеното (демо).",
          },
        }),
        steps: {
          create: (catalogBySlug("p-9-4") ? routeFor(catalogBySlug("p-9-4")!) : []).map((s, i) => ({
            key: s.key,
            titleBg: s.titleBg,
            titleEn: s.titleEn,
            status: i === 0 ? "done" : "pending",
            sortOrder: i + 1,
            assigneeId: i === 0 ? users.faculty_admin.id : null,
            payloadJson: routeStepPayload(s),
          })),
        },
      },
    });
    await prisma.caseEvent.create({
      data: {
        caseId: memo.id,
        actorId: users.faculty_admin.id,
        type: "created",
        messageBg: "Демо докладна 9.4.",
        messageEn: "Demo memo 9.4.",
      },
    });
    await attachGeneratedDoc(memo, memoProc, JSON.parse(memo.metaJson).fields, users.faculty_admin.name);
  }

  await seedAcademic(prisma);

  const procCount = await prisma.processDefinition.count();
  console.log(
    `Seeded ${faculties.length} faculties, ${offices.length} offices, ${forms.length} forms, ${Object.keys(users).length} users, ${procCount} processes, sample cases ПР-2609-10001..10004.`
  );
  console.log("Demo password for all users: demo1234");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
