import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { academicPeriodOf, offeringInclude, serializeOffering } from "@/lib/academic";

export const dynamic = "force-dynamic";

async function loadWindow() {
  const { academicYear, term } = academicPeriodOf();
  return prisma.electiveWindow.findFirst({
    where: { academicYear, term },
    include: {
      version: { include: { program: true } },
    },
    orderBy: { opensAt: "desc" },
  });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "student") {
    return NextResponse.json({ error: "Students only" }, { status: 403 });
  }

  const window = await loadWindow();
  if (!window) {
    return NextResponse.json({ window: null, options: [], chosen: [], selectedEcts: 0 });
  }

  const options = await prisma.courseOffering.findMany({
    where: {
      versionId: window.versionId,
      academicYear: window.academicYear,
      term: window.term,
      course: { type: { in: ["E", "O"] }, semester: window.semester },
    },
    include: offeringInclude,
    orderBy: { slug: "asc" },
  });

  const choices = await prisma.electiveChoice.findMany({
    where: { windowId: window.id, studentId: user.id },
  });
  const chosenIds = new Set(choices.map((c) => c.offeringId));
  const selectedEcts = options
    .filter((o) => chosenIds.has(o.id))
    .reduce((s, o) => s + o.course.ects, 0);

  const now = Date.now();
  const open = now >= window.opensAt.getTime() && now <= window.closesAt.getTime();

  return NextResponse.json({
    window: {
      id: window.id,
      titleBg: window.titleBg,
      titleEn: window.titleEn,
      semester: window.semester,
      academicYear: window.academicYear,
      term: window.term,
      opensAt: window.opensAt.toISOString(),
      closesAt: window.closesAt.toISOString(),
      minEcts: window.minEcts,
      maxEcts: window.maxEcts,
      open,
    },
    options: options.map((o) => serializeOffering(o)),
    chosen: Array.from(chosenIds),
    selectedEcts,
  });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "student") {
    return NextResponse.json({ error: "Students only" }, { status: 403 });
  }

  let body: { offeringId?: string; action?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const offeringId = body.offeringId;
  const action = body.action === "drop" ? "drop" : "pick";
  if (!offeringId) return NextResponse.json({ error: "offeringId required" }, { status: 400 });

  const window = await loadWindow();
  if (!window) return NextResponse.json({ error: "No elective window" }, { status: 400 });

  const now = Date.now();
  if (now < window.opensAt.getTime() || now > window.closesAt.getTime()) {
    return NextResponse.json({ error: "Window closed" }, { status: 400 });
  }

  const offering = await prisma.courseOffering.findUnique({
    where: { id: offeringId },
    include: { course: true },
  });
  if (!offering || offering.versionId !== window.versionId) {
    return NextResponse.json({ error: "Unknown offering" }, { status: 404 });
  }
  if (!["E", "O"].includes(offering.course.type) || offering.course.semester !== window.semester) {
    return NextResponse.json({ error: "Not an elective for this window" }, { status: 400 });
  }

  if (action === "drop") {
    await prisma.electiveChoice.deleteMany({
      where: { windowId: window.id, studentId: user.id, offeringId },
    });
    await prisma.enrollment.deleteMany({
      where: { offeringId, studentId: user.id, source: "elective" },
    });
    return NextResponse.json({ ok: true, action: "drop" });
  }

  const existing = await prisma.electiveChoice.findMany({
    where: { windowId: window.id, studentId: user.id },
    include: { offering: { include: { course: true } } },
  });
  const already = existing.some((c) => c.offeringId === offeringId);
  if (!already) {
    const nextEcts = existing.reduce((s, c) => s + c.offering.course.ects, 0) + offering.course.ects;
    if (nextEcts > window.maxEcts) {
      return NextResponse.json(
        { error: `ECTS limit ${window.maxEcts}`, selectedEcts: nextEcts - offering.course.ects },
        { status: 400 }
      );
    }
    await prisma.electiveChoice.create({
      data: { windowId: window.id, studentId: user.id, offeringId },
    });
  }
  await prisma.enrollment.upsert({
    where: { offeringId_studentId: { offeringId, studentId: user.id } },
    update: { status: "enrolled", source: "elective" },
    create: { offeringId, studentId: user.id, status: "enrolled", source: "elective" },
  });

  return NextResponse.json({ ok: true, action: "pick" });
}
