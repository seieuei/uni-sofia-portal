import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isAdminRole } from "@/lib/auth";
import { generateLoadPayDocx, ensureGeneratedDir } from "@/lib/docx";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const c = await prisma.case.findUnique({
    where: { id: params.id },
    include: {
      loadReport: { include: { lines: true } },
      faculty: true,
      steps: true,
    },
  });
  if (!c || !c.loadReport) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const allowed =
    c.ownerId === user.id ||
    c.steps.some((s) => s.assigneeId === user.id) ||
    isAdminRole(user.role);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let filePath = c.loadReport.docPath
    ? path.join(process.cwd(), c.loadReport.docPath)
    : null;

  if (!filePath || !fs.existsSync(filePath)) {
    const total = c.loadReport.lines.reduce((s, l) => s + l.amountEur, 0);
    const dir = ensureGeneratedDir();
    const filename = `5.2-${c.number.replace(/[^a-zA-Z0-9-_]/g, "_")}.docx`;
    filePath = path.join(dir, filename);
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
    fs.writeFileSync(filePath, buf);
    await prisma.loadReport.update({
      where: { id: c.loadReport.id },
      data: {
        totalAmount: Math.round(total * 100) / 100,
        docPath: `generated/${filename}`,
      },
    });
  }

  const data = fs.readFileSync(filePath);
  return new NextResponse(data, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${path.basename(filePath)}"`,
    },
  });
}
