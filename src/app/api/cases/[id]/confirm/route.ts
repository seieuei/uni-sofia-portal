import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { addCaseEvent } from "@/lib/cases";
import { LOAD_ACTIVITY_RATES } from "@/lib/rates";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const edits: { id: string; hours?: number; activity?: string; note?: string }[] = Array.isArray(
      body.lines
    )
      ? body.lines
      : [];

    const c = await prisma.case.findUnique({
      where: { id: params.id },
      include: {
        loadReport: { include: { lines: true } },
        steps: true,
      },
    });
    if (!c || !c.loadReport) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const myStep = c.steps.find(
      (s) => s.key === "confirm_hours" && s.assigneeId === user.id && s.status === "waiting"
    );
    if (!myStep && user.role !== "lecturer") {
      return NextResponse.json({ error: "No confirm step assigned to you" }, { status: 403 });
    }

    for (const edit of edits) {
      const line = c.loadReport.lines.find((l) => l.id === edit.id);
      if (!line) continue;
      // Lecturer may only edit their own lines
      if (
        line.lecturerEmail &&
        line.lecturerEmail.toLowerCase() !== user.email.toLowerCase() &&
        user.role === "lecturer"
      ) {
        continue;
      }
      const hours = edit.hours != null ? Number(edit.hours) : line.hours;
      const activity = edit.activity || line.activity;
      const rateEur = LOAD_ACTIVITY_RATES[activity]?.rateEur ?? line.rateEur;
      await prisma.loadLine.update({
        where: { id: line.id },
        data: {
          hours,
          activity,
          rateEur,
          amountEur: Math.round(hours * rateEur * 100) / 100,
          note: edit.note ?? line.note,
          confirmed: true,
        },
      });
    }

    // Mark all of this lecturer's lines confirmed
    await prisma.loadLine.updateMany({
      where: {
        reportId: c.loadReport.id,
        OR: [{ lecturerEmail: user.email }, { lecturerName: user.name }],
      },
      data: { confirmed: true },
    });

    if (myStep) {
      await prisma.caseStep.update({
        where: { id: myStep.id },
        data: { status: "done" },
      });
    }

    // If all confirm_hours steps done → awaiting_admin_review
    const remaining = await prisma.caseStep.count({
      where: {
        caseId: c.id,
        key: "confirm_hours",
        status: { in: ["waiting", "pending"] },
      },
    });

    if (remaining === 0) {
      await prisma.case.update({
        where: { id: c.id },
        data: { status: "awaiting_admin_review" },
      });
      await prisma.caseStep.updateMany({
        where: { caseId: c.id, key: "admin_review" },
        data: { status: "waiting" },
      });
      await addCaseEvent(
        c.id,
        user.id,
        "lecturer_confirmed",
        "Преподавателят потвърди часовете. Очаква се админ преглед.",
        "Lecturer confirmed hours. Awaiting admin review."
      );
    } else {
      await addCaseEvent(
        c.id,
        user.id,
        "lecturer_confirmed_partial",
        "Преподавателят потвърди своите часове.",
        "Lecturer confirmed their hours."
      );
    }

    const updated = await prisma.case.findUnique({
      where: { id: c.id },
      include: {
        loadReport: { include: { lines: true } },
        steps: true,
        events: { orderBy: { createdAt: "asc" } },
      },
    });

    return NextResponse.json({ case: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
