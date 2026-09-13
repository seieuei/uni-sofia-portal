import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { makeTicketId, resolveOffice } from "@/lib/routing";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      form: { select: { titleBg: true, titleEn: true, slug: true } },
      office: { select: { nameBg: true, nameEn: true, emailSim: true } },
    },
    take: 100,
  });
  return NextResponse.json({ submissions });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { formSlug, role, facultyCode, submitterName, submitterEmail, data } = body;
    if (!formSlug || !role || !facultyCode) {
      return NextResponse.json({ error: "Missing formSlug, role, or facultyCode" }, { status: 400 });
    }

    const form = await prisma.formTemplate.findUnique({ where: { slug: formSlug } });
    if (!form) return NextResponse.json({ error: "Unknown form" }, { status: 404 });

    const allowed = form.roles.split(",").map((r) => r.trim());
    if (!allowed.includes(role)) {
      return NextResponse.json({ error: "This form is not available for your role" }, { status: 403 });
    }

    const rule = await resolveOffice(form.id, facultyCode, role);
    if (!rule) {
      return NextResponse.json({ error: "No routing rule found for this form" }, { status: 422 });
    }

    const ticketId = makeTicketId();
    const statusNotes = [
      {
        bg: "Получено. Очаква се човек да отвори симулираната входяща кутия.",
        en: "Received. Awaiting a human to open the simulated inbox.",
      },
      {
        bg: "Автоматично насочено. Истинският имейл пинг-понг е отменен за днес.",
        en: "Auto-routed. Real email ping-pong cancelled for today.",
      },
    ];
    const note = statusNotes[Math.floor(Math.random() * statusNotes.length)];

    const submission = await prisma.submission.create({
      data: {
        ticketId,
        formId: form.id,
        officeId: rule.officeId,
        role,
        facultyCode,
        submitterName: String(submitterName || "Anonymous"),
        submitterEmail: String(submitterEmail || "demo@local"),
        dataJson: JSON.stringify(data || {}),
        status: "received",
        statusNoteBg: rule.noteBg || note.bg,
        statusNoteEn: rule.noteEn || note.en,
      },
      include: { office: true },
    });

    return NextResponse.json({
      ticketId: submission.ticketId,
      office: {
        nameBg: submission.office.nameBg,
        nameEn: submission.office.nameEn,
        emailSim: submission.office.emailSim,
      },
      statusNoteBg: submission.statusNoteBg,
      statusNoteEn: submission.statusNoteEn,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
