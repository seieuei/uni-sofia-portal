import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const steps = await prisma.caseStep.findMany({
    where: {
      assigneeId: user.id,
      status: { in: ["waiting", "pending"] },
    },
    include: {
      case: {
        include: {
          process: true,
          owner: { select: { name: true, email: true } },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({
    items: steps.map((s) => ({
      stepId: s.id,
      key: s.key,
      titleBg: s.titleBg,
      titleEn: s.titleEn,
      status: s.status,
      dueAt: s.dueAt,
      caseId: s.caseId,
      caseNumber: s.case.number,
      caseTitle: s.case.title,
      caseStatus: s.case.status,
      processSlug: s.case.process.slug,
      processTitleBg: s.case.process.titleBg,
      processTitleEn: s.case.process.titleEn,
      ownerName: s.case.owner.name,
    })),
  });
}
