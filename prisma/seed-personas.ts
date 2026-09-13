import bcrypt from "bcryptjs";
import type { PrismaClient } from "@prisma/client";

type Extra = {
  email: string;
  name: string;
  role: string;
  department: string;
  year?: number | null;
  facultyCode: string;
  studentCycle?: string | null;
  formOfStudy?: string | null;
  lecturerKind?: string | null;
};

const EXTRAS: Extra[] = [
  {
    email: "student.part@demo.uni-sofia.local",
    name: "Георги Задочнов",
    role: "student",
    department: "Африканистика",
    year: 2,
    facultyCode: "FCML",
    studentCycle: "ba",
    formOfStudy: "part-time",
  },
  {
    email: "student.ma@demo.uni-sofia.local",
    name: "Аня Магистрова",
    role: "student",
    department: "Африканистика",
    year: 1,
    facultyCode: "FCML",
    studentCycle: "ma",
    formOfStudy: "full-time",
  },
  {
    email: "student.phd@demo.uni-sofia.local",
    name: "Кирил Докторантов",
    role: "student",
    department: "Африканистика",
    year: 2,
    facultyCode: "FCML",
    studentCycle: "phd",
    formOfStudy: "full-time",
  },
  {
    email: "lecturer.staff@demo.uni-sofia.local",
    name: "доц. д-р Рада Щатна",
    role: "lecturer",
    department: "Африканистика",
    facultyCode: "FCML",
    lecturerKind: "staff",
  },
  {
    email: "student.phls@demo.uni-sofia.local",
    name: "София Философова",
    role: "student",
    department: "Философия",
    year: 1,
    facultyCode: "FFIL",
    studentCycle: "ba",
    formOfStudy: "full-time",
  },
];

/** Additive upsert of person-type demo users. Never deletes existing rows. */
export async function seedPersonas(prisma: PrismaClient) {
  const passwordHash = await bcrypt.hash("demo1234", 10);

  await prisma.faculty.upsert({
    where: { code: "FFIL" },
    update: {
      nameBg: "Философски факултет",
      nameEn: "Faculty of Philosophy",
      shortBg: "ФФ",
      shortEn: "PHLS",
    },
    create: {
      code: "FFIL",
      nameBg: "Философски факултет",
      nameEn: "Faculty of Philosophy",
      shortBg: "ФФ",
      shortEn: "PHLS",
    },
  });

  const faculties = await prisma.faculty.findMany();
  const byCode = Object.fromEntries(faculties.map((f) => [f.code, f]));

  async function patchEmail(
    email: string,
    data: { studentCycle?: string | null; formOfStudy?: string | null; lecturerKind?: string | null }
  ) {
    const user = await prisma.user.findUnique({ where: { email }, include: { profile: true } });
    if (!user?.profile) return;
    await prisma.profile.update({
      where: { id: user.profile.id },
      data,
    });
  }

  await patchEmail("student@demo.uni-sofia.local", { studentCycle: "ba", formOfStudy: "full-time" });
  await patchEmail("lecturer@demo.uni-sofia.local", { lecturerKind: "honorary" });
  await patchEmail("assistant@demo.uni-sofia.local", { lecturerKind: "staff" });

  let created = 0;
  let updated = 0;
  for (const u of EXTRAS) {
    const faculty = byCode[u.facultyCode];
    const existing = await prisma.user.findUnique({ where: { email: u.email }, include: { profile: true } });
    if (existing) {
      if (existing.profile) {
        await prisma.profile.update({
          where: { id: existing.profile.id },
          data: {
            role: u.role,
            facultyId: faculty?.id ?? existing.profile.facultyId,
            department: u.department,
            year: u.year ?? existing.profile.year,
            studentCycle: u.studentCycle ?? null,
            formOfStudy: u.formOfStudy ?? null,
            lecturerKind: u.lecturerKind ?? null,
          },
        });
      }
      updated += 1;
      continue;
    }
    await prisma.user.create({
      data: {
        email: u.email,
        passwordHash,
        name: u.name,
        profile: {
          create: {
            role: u.role,
            facultyId: faculty?.id ?? null,
            department: u.department,
            year: u.year ?? null,
            studentCycle: u.studentCycle ?? null,
            formOfStudy: u.formOfStudy ?? null,
            lecturerKind: u.lecturerKind ?? null,
          },
        },
      },
    });
    created += 1;
  }

  console.log(`Person types seed: +${created} users / ~${updated} updated (password demo1234).`);
  return { created, updated };
}
