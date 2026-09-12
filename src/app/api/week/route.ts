import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { mondayOf, offeringsForUser, slotDate, slotKindLabel } from "@/lib/academic";

export const dynamic = "force-dynamic";

export type WeekEvent = {
  id: string;
  titleBg: string;
  titleEn: string;
  when: string;
  end?: string;
  kind: string;
  href?: string;
  room?: string | null;
};

function rangeFor(view: string, ref: Date): { start: Date; end: Date; weekStart: Date } {
  const weekStart = mondayOf(ref);
  if (view === "month") {
    const start = new Date(ref.getFullYear(), ref.getMonth(), 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(ref.getFullYear(), ref.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end, weekStart };
  }
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 7);
  end.setMilliseconds(-1);
  return { start: weekStart, end, weekStart };
}

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const view = url.searchParams.get("view") === "month" ? "month" : "week";
  const refRaw = url.searchParams.get("ref");
  const ref = refRaw ? new Date(refRaw) : new Date();
  if (Number.isNaN(ref.getTime())) {
    return NextResponse.json({ error: "Invalid ref" }, { status: 400 });
  }

  const { start, end, weekStart } = rangeFor(view, ref);
  const events: WeekEvent[] = [];

  if (["lecturer", "program_admin", "faculty_admin", "admin_staff"].includes(user.role)) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 2);
    d.setHours(14, 0, 0, 0);
    if (d >= start && d <= end) {
      events.push({
        id: "assembly",
        titleBg: "Факултетно събрание (ФКНФ)",
        titleEn: "Faculty assembly (FCML)",
        when: d.toISOString(),
        kind: "assembly",
      });
    }
  }

  const steps = await prisma.caseStep.findMany({
    where: {
      OR: [{ assigneeId: user.id }, { case: { ownerId: user.id } }],
      status: { in: ["waiting", "pending"] },
    },
    include: { case: true },
    take: 20,
  });

  for (const s of steps) {
    const d = s.dueAt || new Date(weekStart.getTime() + 4 * 86400000);
    if (d >= start && d <= end) {
      events.push({
        id: `step-${s.id}`,
        titleBg: `${s.titleBg} · ${s.case.number}`,
        titleEn: `${s.titleEn} · ${s.case.number}`,
        when: d.toISOString(),
        kind: "deadline",
        href: `/cases/${s.caseId}`,
      });
    }
  }

  if (user.role === "lecturer" || user.role === "student" || user.role === "program_admin" || user.role === "faculty_admin") {
    const offerings = await offeringsForUser(prisma, user);
    const cursor = mondayOf(start);
    const last = mondayOf(end);
    for (let week = new Date(cursor); week <= last; week.setDate(week.getDate() + 7)) {
      const weekCopy = new Date(week);
      for (const o of offerings) {
        for (const slot of o.slots) {
          const when = slotDate(weekCopy, slot.weekday, slot.startMinutes);
          const until = slotDate(weekCopy, slot.weekday, slot.endMinutes);
          if (when < start || when > end) continue;
          const kindBg = slotKindLabel(slot.kind, "bg");
          const kindEn = slotKindLabel(slot.kind, "en");
          const room = slot.room || o.room;
          events.push({
            id: `slot-${slot.id}-${when.toISOString()}`,
            titleBg: `${kindBg} — ${o.course.code} ${o.course.titleBg}`,
            titleEn: `${kindEn} — ${o.course.code} ${o.course.titleEn}`,
            when: when.toISOString(),
            end: until.toISOString(),
            kind: slot.kind === "seminar" ? "seminar" : "lecture",
            href: `/courses/${o.id}`,
            room,
          });
        }
      }
    }
  }

  events.sort((a, b) => a.when.localeCompare(b.when));
  return NextResponse.json({
    events,
    weekStart: weekStart.toISOString(),
    rangeStart: start.toISOString(),
    rangeEnd: end.toISOString(),
    view,
  });
}
