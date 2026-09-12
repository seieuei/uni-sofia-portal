import bcrypt from "bcryptjs";
import type { PrismaClient } from "@prisma/client";
import { academicPeriodOf, parseMinutes } from "../src/lib/academic";

const PROGRAM_CODE = "KHA240423";
const PROGRAM_SLUG = "african-studies-ba";

type SlotSeed = { weekday: number; start: string; end: string; kind: string; room?: string };

function slotsData(offeringId: string, slots: SlotSeed[], fallbackRoom?: string) {
  return slots.map((s) => ({
    offeringId,
    weekday: s.weekday,
    startMinutes: parseMinutes(s.start),
    endMinutes: parseMinutes(s.end),
    kind: s.kind,
    room: s.room ?? fallbackRoom ?? null,
  }));
}

export async function seedAcademic(prisma: PrismaClient) {
  const faculty = await prisma.faculty.findUnique({ where: { code: "FCML" } });
  if (!faculty) {
    console.warn("Academic seed skipped — FCML faculty missing.");
    return { skipped: true };
  }

  const { academicYear, term } = academicPeriodOf();
  const yearSlug = academicYear.replace("/", "-");

  const lecturer = await prisma.user.findUnique({
    where: { email: "lecturer@demo.uni-sofia.local" },
  });
  const student = await prisma.user.findUnique({
    where: { email: "student@demo.uni-sofia.local" },
  });

  let assistant = await prisma.user.findUnique({
    where: { email: "assistant@demo.uni-sofia.local" },
  });
  if (!assistant) {
    const passwordHash = await bcrypt.hash("demo1234", 10);
    assistant = await prisma.user.create({
      data: {
        email: "assistant@demo.uni-sofia.local",
        passwordHash,
        name: "ас. Нина Семинарова",
        profile: {
          create: {
            role: "lecturer",
            facultyId: faculty.id,
            department: "Африканистика",
          },
        },
      },
    });
  }

  const program = await prisma.program.upsert({
    where: { code: PROGRAM_CODE },
    update: {
      slug: PROGRAM_SLUG,
      titleBg: "Африканистика",
      titleEn: "African Studies",
      degree: "BA",
      professionalFieldBg: "2.1 Филология",
      professionalFieldEn: "2.1 Philology",
      facultyId: faculty.id,
      formOfStudy: "full-time",
      semesters: 8,
      noteBg:
        "Съотношение аудиторна / самостоятелна заетост 1:1. Код на специалността KHA240423 (пилот ФКНФ).",
      noteEn:
        "Contact / independent study ratio 1:1. Programme code KHA240423 (FCML pilot).",
    },
    create: {
      code: PROGRAM_CODE,
      slug: PROGRAM_SLUG,
      titleBg: "Африканистика",
      titleEn: "African Studies",
      degree: "BA",
      professionalFieldBg: "2.1 Филология",
      professionalFieldEn: "2.1 Philology",
      facultyId: faculty.id,
      formOfStudy: "full-time",
      semesters: 8,
      noteBg:
        "Съотношение аудиторна / самостоятелна заетост 1:1. Код на специалността KHA240423 (пилот ФКНФ).",
      noteEn:
        "Contact / independent study ratio 1:1. Programme code KHA240423 (FCML pilot).",
    },
  });

  const version = await prisma.curriculumVersion.upsert({
    where: { programId_academicYear: { programId: program.id, academicYear } },
    update: {
      labelBg: `Учебен план ${academicYear}`,
      labelEn: `Curriculum ${academicYear}`,
      active: true,
    },
    create: {
      programId: program.id,
      academicYear,
      labelBg: `Учебен план ${academicYear}`,
      labelEn: `Curriculum ${academicYear}`,
      active: true,
    },
  });

  const courseRows: {
    code: string;
    titleBg: string;
    titleEn: string;
    type: "C" | "E" | "O";
    semester: number;
    ects: number;
    hoursLectures: number;
    hoursSeminars: number;
    hoursPractice: number;
    weeklyLoad: string;
    grading: string;
    language: string;
    sortOrder: number;
  }[] = [
    {
      code: "Z010",
      titleBg: "Увод в социологията",
      titleEn: "Introduction to Sociology",
      type: "C",
      semester: 1,
      ects: 3,
      hoursLectures: 30,
      hoursSeminars: 0,
      hoursPractice: 0,
      weeklyLoad: "2+0",
      grading: "e",
      language: "bg",
      sortOrder: 10,
    },
    {
      code: "Z030",
      titleBg: "Социолингвистика",
      titleEn: "Sociolinguistics",
      type: "C",
      semester: 1,
      ects: 4,
      hoursLectures: 45,
      hoursSeminars: 15,
      hoursPractice: 0,
      weeklyLoad: "3+1",
      grading: "mixed",
      language: "bg",
      sortOrder: 20,
    },
    {
      code: "Z040",
      titleBg: "Чужд език (суахили)",
      titleEn: "Foreign language (Swahili)",
      type: "C",
      semester: 1,
      ects: 4,
      hoursLectures: 0,
      hoursSeminars: 60,
      hoursPractice: 0,
      weeklyLoad: "0+4",
      grading: "ca",
      language: "sw",
      sortOrder: 30,
    },
    {
      code: "E110",
      titleBg: "Африкански литератури",
      titleEn: "African Literatures",
      type: "E",
      semester: 1,
      ects: 3,
      hoursLectures: 30,
      hoursSeminars: 0,
      hoursPractice: 0,
      weeklyLoad: "2+0",
      grading: "ca",
      language: "bg",
      sortOrder: 40,
    },
    {
      code: "E120",
      titleBg: "Увод в суахили",
      titleEn: "Introduction to Swahili",
      type: "E",
      semester: 1,
      ects: 3,
      hoursLectures: 0,
      hoursSeminars: 30,
      hoursPractice: 0,
      weeklyLoad: "0+2",
      grading: "ca",
      language: "sw",
      sortOrder: 50,
    },
    {
      code: "E130",
      titleBg: "Колониална история на Африка",
      titleEn: "Colonial History of Africa",
      type: "E",
      semester: 1,
      ects: 4,
      hoursLectures: 30,
      hoursSeminars: 15,
      hoursPractice: 0,
      weeklyLoad: "2+1",
      grading: "e",
      language: "bg",
      sortOrder: 60,
    },
    {
      code: "O210",
      titleBg: "Академично писане",
      titleEn: "Academic Writing",
      type: "O",
      semester: 1,
      ects: 2,
      hoursLectures: 0,
      hoursSeminars: 30,
      hoursPractice: 0,
      weeklyLoad: "0+2",
      grading: "ca",
      language: "bg",
      sortOrder: 70,
    },
  ];

  const courses: Record<string, { id: string; type: string; ects: number; semester: number }> = {};
  for (const row of courseRows) {
    const hoursTotal = row.hoursLectures + row.hoursSeminars + row.hoursPractice;
    const saved = await prisma.curriculumCourse.upsert({
      where: {
        versionId_code_semester: {
          versionId: version.id,
          code: row.code,
          semester: row.semester,
        },
      },
      update: {
        titleBg: row.titleBg,
        titleEn: row.titleEn,
        type: row.type,
        ects: row.ects,
        hoursTotal,
        hoursLectures: row.hoursLectures,
        hoursSeminars: row.hoursSeminars,
        hoursPractice: row.hoursPractice,
        weeklyLoad: row.weeklyLoad,
        grading: row.grading,
        language: row.language,
        sortOrder: row.sortOrder,
      },
      create: {
        versionId: version.id,
        code: row.code,
        titleBg: row.titleBg,
        titleEn: row.titleEn,
        type: row.type,
        semester: row.semester,
        ects: row.ects,
        hoursTotal,
        hoursLectures: row.hoursLectures,
        hoursSeminars: row.hoursSeminars,
        hoursPractice: row.hoursPractice,
        weeklyLoad: row.weeklyLoad,
        grading: row.grading,
        language: row.language,
        sortOrder: row.sortOrder,
      },
    });
    courses[row.code] = { id: saved.id, type: row.type, ects: row.ects, semester: row.semester };
  }

  const offeringSeeds: {
    code: string;
    slug: string;
    room: string;
    lecturerId: string | null;
    assistantId: string | null;
    assessmentForm: string;
    studentCount: number;
    yearOfStudy: number;
    examined: number;
    currentAssessed: number;
    courseworks: number;
    slots: SlotSeed[];
  }[] = [
    {
      code: "Z010",
      slug: `${yearSlug}-${term}-z010`,
      room: "зал 215",
      lecturerId: lecturer?.id ?? null,
      assistantId: null,
      assessmentForm: "exam",
      studentCount: 22,
      yearOfStudy: 1,
      examined: 0,
      currentAssessed: 0,
      courseworks: 0,
      slots: [{ weekday: 2, start: "09:00", end: "10:30", kind: "lecture" }],
    },
    {
      code: "Z030",
      slug: `${yearSlug}-${term}-z030`,
      room: "зал 241",
      lecturerId: lecturer?.id ?? null,
      assistantId: assistant.id,
      assessmentForm: "mixed",
      studentCount: 18,
      yearOfStudy: 3,
      examined: 0,
      currentAssessed: 12,
      courseworks: 18,
      slots: [
        { weekday: 1, start: "10:15", end: "11:45", kind: "lecture" },
        { weekday: 3, start: "12:00", end: "13:00", kind: "seminar" },
      ],
    },
    {
      code: "Z040",
      slug: `${yearSlug}-${term}-z040`,
      room: "зал 118",
      lecturerId: assistant.id,
      assistantId: null,
      assessmentForm: "current",
      studentCount: 16,
      yearOfStudy: 1,
      examined: 0,
      currentAssessed: 0,
      courseworks: 0,
      slots: [{ weekday: 4, start: "14:00", end: "15:30", kind: "seminar" }],
    },
    {
      code: "E110",
      slug: `${yearSlug}-${term}-e110`,
      room: "зал 302",
      lecturerId: lecturer?.id ?? null,
      assistantId: null,
      assessmentForm: "current",
      studentCount: 12,
      yearOfStudy: 3,
      examined: 0,
      currentAssessed: 0,
      courseworks: 0,
      slots: [{ weekday: 2, start: "13:15", end: "14:45", kind: "lecture" }],
    },
    {
      code: "E120",
      slug: `${yearSlug}-${term}-e120`,
      room: "зал 118",
      lecturerId: assistant.id,
      assistantId: null,
      assessmentForm: "current",
      studentCount: 10,
      yearOfStudy: 3,
      examined: 0,
      currentAssessed: 0,
      courseworks: 0,
      slots: [{ weekday: 5, start: "10:15", end: "11:45", kind: "seminar" }],
    },
    {
      code: "E130",
      slug: `${yearSlug}-${term}-e130`,
      room: "зал 241",
      lecturerId: lecturer?.id ?? null,
      assistantId: assistant.id,
      assessmentForm: "exam",
      studentCount: 14,
      yearOfStudy: 3,
      examined: 0,
      currentAssessed: 0,
      courseworks: 0,
      slots: [
        { weekday: 4, start: "10:15", end: "11:45", kind: "lecture" },
        { weekday: 5, start: "12:00", end: "13:00", kind: "seminar" },
      ],
    },
    {
      code: "O210",
      slug: `${yearSlug}-${term}-o210`,
      room: "зал 104",
      lecturerId: assistant.id,
      assistantId: null,
      assessmentForm: "current",
      studentCount: 8,
      yearOfStudy: 3,
      examined: 0,
      currentAssessed: 0,
      courseworks: 0,
      slots: [{ weekday: 3, start: "15:00", end: "16:30", kind: "seminar" }],
    },
  ];

  const offerings: Record<string, string> = {};
  for (const o of offeringSeeds) {
    const course = courses[o.code];
    if (!course) continue;
    const saved = await prisma.courseOffering.upsert({
      where: { slug: o.slug },
      update: {
        courseId: course.id,
        versionId: version.id,
        academicYear,
        term,
        lecturerId: o.lecturerId,
        assistantId: o.assistantId,
        room: o.room,
        language: courseRows.find((c) => c.code === o.code)?.language ?? "bg",
        assessmentForm: o.assessmentForm,
        studentCount: o.studentCount,
        kind: "regular",
        yearOfStudy: o.yearOfStudy,
        formOfStudy: "full-time",
        examined: o.examined,
        currentAssessed: o.currentAssessed,
        courseworks: o.courseworks,
      },
      create: {
        slug: o.slug,
        courseId: course.id,
        versionId: version.id,
        academicYear,
        term,
        lecturerId: o.lecturerId,
        assistantId: o.assistantId,
        room: o.room,
        language: courseRows.find((c) => c.code === o.code)?.language ?? "bg",
        assessmentForm: o.assessmentForm,
        studentCount: o.studentCount,
        kind: "regular",
        yearOfStudy: o.yearOfStudy,
        formOfStudy: "full-time",
        examined: o.examined,
        currentAssessed: o.currentAssessed,
        courseworks: o.courseworks,
      },
    });
    offerings[o.code] = saved.id;
    await prisma.scheduleSlot.deleteMany({ where: { offeringId: saved.id } });
    await prisma.scheduleSlot.createMany({ data: slotsData(saved.id, o.slots, o.room) });
  }

  const z030Id = offerings.Z030;
  if (z030Id) {
    const loadJson = JSON.stringify([
      { kind: "lectures", hours: 45, ects: 1.5, labelBg: "Лекции", labelEn: "Lectures" },
      { kind: "seminars", hours: 15, ects: 0.5, labelBg: "Семинари", labelEn: "Seminars" },
      { kind: "essay", hours: 30, ects: 1, labelBg: "Есе / самостоятелна работа", labelEn: "Essay / independent work" },
      { kind: "library", hours: 30, ects: 1, labelBg: "Библиотечна работа", labelEn: "Library work" },
    ]);
    const gradingJson = JSON.stringify([
      { labelBg: "Дискусии", labelEn: "Discussions", percent: 25 },
      { labelBg: "Тест", labelEn: "Test", percent: 25 },
      { labelBg: "Изпит", labelEn: "Exam", percent: 50 },
    ]);
    const topicsJson = JSON.stringify([
      { week: 1, hours: 4, titleBg: "Увод: език, общество, власт", titleEn: "Introduction: language, society, power" },
      { week: 2, hours: 4, titleBg: "Езикови общности и репертоари", titleEn: "Speech communities and repertoires" },
      { week: 3, hours: 4, titleBg: "Диглосия и многоезичие в Африка", titleEn: "Diglossia and multilingualism in Africa" },
      { week: 4, hours: 4, titleBg: "Код-смяна и стилистична вариация", titleEn: "Code-switching and stylistic variation" },
      { week: 5, hours: 4, titleBg: "Езикова политика и стандартизация", titleEn: "Language policy and standardization" },
      { week: 6, hours: 4, titleBg: "Колониални езици и постколониални практики", titleEn: "Colonial languages and postcolonial practices" },
      { week: 7, hours: 4, titleBg: "Пол, статус и учтивост", titleEn: "Gender, status and politeness" },
      { week: 8, hours: 4, titleBg: "Етнография на комуникацията", titleEn: "Ethnography of communication" },
      { week: 9, hours: 4, titleBg: "Писменост, медиа и публичен дискурс", titleEn: "Literacy, media and public discourse" },
      { week: 10, hours: 4, titleBg: "Теренни методи — наблюдения и интервю", titleEn: "Field methods — observation and interview" },
      { week: 11, hours: 4, titleBg: "Семинар: анализ на корпус / запис", titleEn: "Seminar: corpus / recording analysis" },
      { week: 12, hours: 4, titleBg: "Есе и обобщение; подготовка за изпит", titleEn: "Essay wrap-up and exam preparation" },
    ]);

    await prisma.syllabus.upsert({
      where: { offeringId: z030Id },
      update: {
        annotationBg:
          "Курсът въвежда социолингвистиката като изследване на езика в социален контекст, с акцент върху многоезични африкански общности, езикова политика и всекидневни практики.",
        annotationEn:
          "The course introduces sociolinguistics as the study of language in social context, with emphasis on multilingual African communities, language policy, and everyday practice.",
        prerequisitesBg: "Увод в социологията (Z010) или еквивалент; базов интерес към езикознание.",
        prerequisitesEn: "Introduction to Sociology (Z010) or equivalent; basic interest in linguistics.",
        outcomesBg:
          "Студентът разпознава ключови понятия (репертоар, диглосия, код-смяна); анализира езикова политика; прилага базов теренен метод; аргументира писмено върху африкански казус.",
        outcomesEn:
          "The student recognises core concepts (repertoire, diglossia, code-switching); analyses language policy; applies a basic field method; writes an argument on an African case.",
        gradingJson,
        loadJson,
        topicsJson,
      },
      create: {
        offeringId: z030Id,
        annotationBg:
          "Курсът въвежда социолингвистиката като изследване на езика в социален контекст, с акцент върху многоезични африкански общности, езикова политика и всекидневни практики.",
        annotationEn:
          "The course introduces sociolinguistics as the study of language in social context, with emphasis on multilingual African communities, language policy, and everyday practice.",
        prerequisitesBg: "Увод в социологията (Z010) или еквивалент; базов интерес към езикознание.",
        prerequisitesEn: "Introduction to Sociology (Z010) or equivalent; basic interest in linguistics.",
        outcomesBg:
          "Студентът разпознава ключови понятия (репертоар, диглосия, код-смяна); анализира езикова политика; прилага базов теренен метод; аргументира писмено върху африкански казус.",
        outcomesEn:
          "The student recognises core concepts (repertoire, diglossia, code-switching); analyses language policy; applies a basic field method; writes an argument on an African case.",
        gradingJson,
        loadJson,
        topicsJson,
      },
    });
  }

  if (student) {
    for (const code of ["Z010", "Z030", "Z040"] as const) {
      const offeringId = offerings[code];
      if (!offeringId) continue;
      await prisma.enrollment.upsert({
        where: { offeringId_studentId: { offeringId, studentId: student.id } },
        update: { status: "enrolled", source: "compulsory" },
        create: { offeringId, studentId: student.id, status: "enrolled", source: "compulsory" },
      });
    }
  }

  const windowSlug = `${yearSlug}-${term}-s1`;
  const now = new Date();
  const opensAt = new Date(now);
  opensAt.setDate(opensAt.getDate() - 7);
  opensAt.setHours(8, 0, 0, 0);
  const closesAt = new Date(now);
  closesAt.setDate(closesAt.getDate() + 28);
  closesAt.setHours(23, 59, 0, 0);

  await prisma.electiveWindow.upsert({
    where: { slug: windowSlug },
    update: {
      versionId: version.id,
      semester: 1,
      academicYear,
      term,
      opensAt,
      closesAt,
      minEcts: 3,
      maxEcts: 6,
      titleBg: `Избираеми — зимен семестър ${academicYear}`,
      titleEn: `Electives — winter semester ${academicYear}`,
    },
    create: {
      slug: windowSlug,
      versionId: version.id,
      semester: 1,
      academicYear,
      term,
      opensAt,
      closesAt,
      minEcts: 3,
      maxEcts: 6,
      titleBg: `Избираеми — зимен семестър ${academicYear}`,
      titleEn: `Electives — winter semester ${academicYear}`,
    },
  });

  console.log(
    `Academic desk upserted: ${PROGRAM_CODE} Африканистика, ${courseRows.length} curriculum rows, ${offeringSeeds.length} offerings, Z030 syllabus, elective window ${windowSlug}.`
  );
  return {
    skipped: false,
    programCode: PROGRAM_CODE,
    academicYear,
    courses: courseRows.length,
    offerings: offeringSeeds.length,
  };
}
