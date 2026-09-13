import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { academicPeriodOf } from "@/lib/academic";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  const user = await getCurrentUser();
  if (!slug && !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { academicYear } = academicPeriodOf();
  const program = await prisma.program.findUnique({
    where: { slug: slug || "african-studies-ba" },
    include: {
      faculty: true,
      versions: {
        where: { academicYear },
        include: { courses: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  if (!program) return NextResponse.json({ error: "Program not found" }, { status: 404 });

  const version = program.versions[0] || null;
  return NextResponse.json({
    program: {
      code: program.code,
      slug: program.slug,
      titleBg: program.titleBg,
      titleEn: program.titleEn,
      degree: program.degree,
      professionalFieldBg: program.professionalFieldBg,
      professionalFieldEn: program.professionalFieldEn,
      formOfStudy: program.formOfStudy,
      semesters: program.semesters,
      noteBg: program.noteBg,
      noteEn: program.noteEn,
      faculty: {
        code: program.faculty.code,
        nameBg: program.faculty.nameBg,
        nameEn: program.faculty.nameEn,
        shortBg: program.faculty.shortBg,
      },
    },
    version: version
      ? {
          academicYear: version.academicYear,
          labelBg: version.labelBg,
          labelEn: version.labelEn,
          courses: version.courses,
        }
      : null,
  });
}
