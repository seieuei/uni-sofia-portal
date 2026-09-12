import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isAdminRole } from "@/lib/auth";
import { addCaseEvent, makeArhimedNumber } from "@/lib/cases";

export const dynamic = "force-dynamic";

const FLOW = [
  "draft",
  "awaiting_lecturer",
  "awaiting_admin_review",
  "awaiting_approvals",
  "ready_for_rector",
  "archived",
] as const;

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdminRole(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const target = body.status as string | undefined;

    const c = await prisma.case.findUnique({ where: { id: params.id }, include: { steps: true } });
    if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let next = target;
    if (!next) {
      const idx = FLOW.indexOf(c.status as (typeof FLOW)[number]);
      next = idx >= 0 && idx < FLOW.length - 1 ? FLOW[idx + 1] : c.status;
    }
    if (!FLOW.includes(next as (typeof FLOW)[number])) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const data: { status: string; arhimedNo?: string } = { status: next };
    if (next === "archived" && !c.arhimedNo) {
      data.arhimedNo = makeArhimedNumber();
    }

    if (next === "awaiting_approvals") {
      await prisma.caseStep.updateMany({
        where: { caseId: c.id, key: { in: ["legal", "pfc"] } },
        data: { status: "waiting" },
      });
    }
    if (next === "ready_for_rector") {
      await prisma.caseStep.updateMany({
        where: { caseId: c.id, key: { in: ["legal", "pfc"] } },
        data: { status: "done" },
      });
      await prisma.caseStep.updateMany({
        where: { caseId: c.id, key: "rector" },
        data: { status: "waiting" },
      });
    }
    if (next === "archived") {
      await prisma.caseStep.updateMany({
        where: {
          caseId: c.id,
          key: { in: ["rector", "vice_rector", "izvejdane", "archive", "copies"] },
        },
        data: { status: "done" },
      });
    }

    const updated = await prisma.case.update({ where: { id: c.id }, data });

    await addCaseEvent(
      c.id,
      user.id,
      "status_change",
      `Статус: ${c.status} → ${next}${data.arhimedNo ? ` · Архимед ${data.arhimedNo}` : ""}`,
      `Status: ${c.status} → ${next}${data.arhimedNo ? ` · Arhimed ${data.arhimedNo}` : ""}`,
      { from: c.status, to: next, arhimedNo: data.arhimedNo }
    );

    return NextResponse.json({ case: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
