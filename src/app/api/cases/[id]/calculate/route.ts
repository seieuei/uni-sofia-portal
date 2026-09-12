import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isAdminRole } from "@/lib/auth";
import { addCaseEvent } from "@/lib/cases";
import { ensureGeneratedDir, generateLoadPayDocx } from "@/lib/docx";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdminRole(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const c = await prisma.case.findUnique({
      where: { id: params.id },
      include: {
        loadReport: { include: { lines: true } },
        faculty: true,
        process: true,
      },
    });
    if (!c || !c.loadReport) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (c.ownerId !== user.id && !isAdminRole(user.role)) {
      return NextResponse.json({ error: "Only case owner/admin can calculate" }, { status: 403 });
    }

    const total = c.loadReport.lines.reduce((s, l) => s + l.amountEur, 0);
    const dir = ensureGeneratedDir();
    const filename = `5.2-${c.number.replace(/[^a-zA-Z0-9-_]/g, "_")}.docx`;
    const docPath = path.join(dir, filename);

    const buf = generateLoadPayDocx({
      faculty: c.faculty ? c.faculty.nameBg : "ФКНФ",
      program: c.loadReport.programName,
      period: c.loadReport.periodLabel,
      funding: c.loadReport.fundingSource,
      caseNumber: c.number,
      preparedBy: user.name,
      status: c.status,
      total,
      lines: c.loadReport.lines.map((l) => ({
        lecturerName: l.lecturerName,
        activity: l.activity,
        hours: l.hours,
        rateEur: l.rateEur,
        amountEur: l.amountEur,
      })),
    });
    fs.writeFileSync(docPath, buf);

    await prisma.loadReport.update({
      where: { id: c.loadReport.id },
      data: { totalAmount: Math.round(total * 100) / 100, docPath: `generated/${filename}` },
    });

    await prisma.caseStep.updateMany({
      where: { caseId: c.id, key: "admin_review" },
      data: { status: "done" },
    });

    // Move to awaiting_approvals if coming from admin review
    if (c.status === "awaiting_admin_review" || c.status === "draft") {
      await prisma.case.update({
        where: { id: c.id },
        data: { status: "awaiting_approvals" },
      });
      await prisma.caseStep.updateMany({
        where: { caseId: c.id, key: { in: ["legal", "pfc"] } },
        data: { status: "waiting" },
      });
    }

    await addCaseEvent(
      c.id,
      user.id,
      "calculated",
      `Изчислена обща сума ${total.toFixed(2)} EUR. Генериран DOCX.`,
      `Calculated total ${total.toFixed(2)} EUR. DOCX generated.`,
      { total, docPath: `generated/${filename}` }
    );

    const updated = await prisma.case.findUnique({
      where: { id: c.id },
      include: {
        loadReport: { include: { lines: true } },
        steps: true,
        events: { orderBy: { createdAt: "asc" } },
      },
    });

    return NextResponse.json({ case: updated, downloadUrl: `/api/cases/${c.id}/document` });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
