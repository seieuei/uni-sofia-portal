import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { canSeeAllOfferings, offeringInclude, serializeOffering } from "@/lib/academic";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const offering = await prisma.courseOffering.findUnique({
    where: { id: params.id },
    include: offeringInclude,
  });
  if (!offering) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const enrolled = await prisma.enrollment.findUnique({
    where: { offeringId_studentId: { offeringId: offering.id, studentId: user.id } },
  });
  const teaches = offering.lecturerId === user.id || offering.assistantId === user.id;
  if (!enrolled && !teaches && !canSeeAllOfferings(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    offering: serializeOffering({
      ...offering,
      enrollmentSource: enrolled?.source,
    }),
  });
}
