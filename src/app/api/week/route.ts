import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const day = start.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + mondayOffset);

  const events: {
    id: string;
    titleBg: string;
    titleEn: string;
    when: string;
    kind: string;
    href?: string;
  }[] = [];

  // Faculty assembly — staff / admins
  if (["lecturer", "program_admin", "faculty_admin", "admin_staff"].includes(user.role)) {
    const d = new Date(start);
    d.setDate(d.getDate() + 2);
    d.setHours(14, 0, 0, 0);
    events.push({
      id: "assembly",
      titleBg: "Факултетно събрание (ФКНФ)",
      titleEn: "Faculty assembly (FCML)",
      when: d.toISOString(),
      kind: "assembly",
    });
  }

  // Process deadlines from assigned steps
  const steps = await prisma.caseStep.findMany({
    where: {
      OR: [{ assigneeId: user.id }, { case: { ownerId: user.id } }],
      status: { in: ["waiting", "pending"] },
    },
    include: { case: true },
    take: 10,
  });

  for (const s of steps) {
    const d = s.dueAt || new Date(start.getTime() + 4 * 86400000);
    events.push({
      id: `step-${s.id}`,
      titleBg: `${s.titleBg} · ${s.case.number}`,
      titleEn: `${s.titleEn} · ${s.case.number}`,
      when: d.toISOString(),
      kind: "deadline",
      href: `/cases/${s.caseId}`,
    });
  }

  // Lecture placeholder for lecturers / students
  if (user.role === "lecturer" || user.role === "student") {
    const d = new Date(start);
    d.setDate(d.getDate() + 1);
    d.setHours(10, 15, 0, 0);
    events.push({
      id: "lecture",
      titleBg:
        user.role === "lecturer"
          ? "Лекция — Африканистика (placeholder)"
          : "Лекция — Африканистика (placeholder)",
      titleEn: "Lecture — African Studies (placeholder)",
      when: d.toISOString(),
      kind: "lecture",
    });
  }

  events.sort((a, b) => a.when.localeCompare(b.when));
  return NextResponse.json({ events, weekStart: start.toISOString() });
}
