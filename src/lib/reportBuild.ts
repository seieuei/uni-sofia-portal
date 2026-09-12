import { prisma } from "./prisma";
import { academicPeriodOf, formOfStudyLabel, languageLabel, typeLabel } from "./academic";
import { assessmentLabel, type IndividualReportData, type ReportRow } from "./individualReport";

function toRow(
  o: {
    studentCount: number;
    yearOfStudy: number | null;
    formOfStudy: string;
    language: string;
    assessmentForm: string | null;
    examined: number;
    currentAssessed: number;
    courseworks: number;
    lecturer: { name: string } | null;
    assistant: { name: string } | null;
    course: {
      code: string;
      titleBg: string;
      type: string;
      hoursLectures: number;
      hoursSeminars: number;
      hoursPractice: number;
      grading: string;
    };
    version: {
      program: { titleBg: string; faculty: { shortBg: string; nameBg: string } };
    };
  },
  lang: "bg" | "en"
): ReportRow {
  return {
    discipline: `${o.course.code} ${o.course.titleBg}`,
    specialty: o.version.program.titleBg,
    faculty: o.version.program.faculty.shortBg,
    kind: typeLabel(o.course.type, lang),
    year: o.yearOfStudy ? String(o.yearOfStudy) : "—",
    form: formOfStudyLabel(o.formOfStudy, lang),
    studentCount: o.studentCount,
    lectureHours: o.course.hoursLectures,
    exerciseHours: o.course.hoursSeminars + o.course.hoursPractice,
    language: languageLabel(o.language, lang),
    assessment: assessmentLabel(o.assessmentForm, o.course.grading, lang),
    titular: o.lecturer?.name || "—",
    assistant: o.assistant?.name || "",
    examined: o.examined,
    currentAssessed: o.currentAssessed,
    courseworks: o.courseworks,
  };
}

export async function buildReport(userId: string, lang: "bg" | "en" = "bg"): Promise<IndividualReportData | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: { include: { faculty: true } } },
  });
  if (!user) return null;

  const { academicYear } = academicPeriodOf();
  const offerings = await prisma.courseOffering.findMany({
    where: {
      academicYear,
      OR: [{ lecturerId: userId }, { assistantId: userId }],
    },
    include: {
      course: true,
      lecturer: true,
      assistant: true,
      version: { include: { program: { include: { faculty: true } } } },
    },
    orderBy: { slug: "asc" },
  });

  const winter = offerings.filter((o) => o.term === "winter").map((o) => toRow(o, lang));
  const summer = offerings.filter((o) => o.term === "summer").map((o) => toRow(o, lang));

  return {
    lecturerName: user.name,
    lecturerEmail: user.email,
    faculty: user.profile?.faculty?.nameBg || "ФКНФ",
    department: user.profile?.department || "Африканистика",
    academicYear,
    generatedAt: new Date().toLocaleString("bg-BG"),
    note:
      "Данните са извлечени от обявените занятия в портала (вместо празен формуляр по имейл). Полетата са редактируеми в следваща фаза; пълна синхронизация със СУСИ не е цел на този пилот.",
    winter,
    summer,
  };
}
