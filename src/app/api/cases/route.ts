import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canStartProcess, getCurrentUser } from "@/lib/auth";
import { addCaseEvent, makeCaseNumber } from "@/lib/cases";
import { LOAD_ACTIVITY_RATES } from "@/lib/rates";
import { generateCaseDocument, writeGenerated } from "@/lib/portalDocx";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cases = await prisma.case.findMany({
    where: {
      OR: [{ ownerId: user.id }, { steps: { some: { assigneeId: user.id } } }],
    },
    include: {
      process: true,
      owner: { select: { name: true, email: true } },
      faculty: true,
      loadReport: { include: { lines: true } },
      _count: { select: { steps: true, events: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ cases });
}

type LineInput = {
  lecturerName: string;
  lecturerEmail?: string;
  activity: string;
  hours: number;
  rateEur?: number;
};

type RouteStep = { key: string; titleBg: string; titleEn: string };

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const processSlug = String(body.processSlug || "");
    const process = await prisma.processDefinition.findUnique({ where: { slug: processSlug } });
    if (!process || !process.active) {
      return NextResponse.json({ error: "Unknown process" }, { status: 404 });
    }
    if (!canStartProcess(user.role, process.rolesAllowed)) {
      return NextResponse.json({ error: "Not allowed to start this process" }, { status: 403 });
    }

    if (process.wizardKind === "load-5-2" || (processSlug === "load-pay-5-2" && Array.isArray(body.lines))) {
      return createLoadCase(user, process, body);
    }
    return createGenericCase(user, process, body);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

async function createGenericCase(
  user: { id: string; name: string; facultyId: string | null },
  process: {
    id: string;
    slug: string;
    titleBg: string;
    catalogCode: string | null;
    templatePath: string | null;
    fieldsJson: string;
    routeJson: string;
  },
  body: Record<string, unknown>
) {
  const fields = (body.fields && typeof body.fields === "object" ? body.fields : {}) as Record<string, unknown>;
  const draft = Boolean(body.draft);
  let schema: { name: string; labelBg: string; required?: boolean }[] = [];
  try {
    schema = JSON.parse(process.fieldsJson || "[]");
  } catch {
    schema = [];
  }
  for (const f of schema) {
    if (f.required && f.name !== "loadLines") {
      const v = fields[f.name];
      if (v === undefined || v === null || String(v).trim() === "" || v === false) {
        return NextResponse.json({ error: `Missing field: ${f.name}` }, { status: 400 });
      }
    }
  }

  let route: RouteStep[] = [];
  try {
    route = JSON.parse(process.routeJson || "[]");
  } catch {
    route = [];
  }
  if (route.length === 0) {
    route = [
      { key: "initiator", titleBg: "Инициатор", titleEn: "Initiator" },
      { key: "rector", titleBg: "Ректор", titleEn: "Rector" },
      { key: "archive", titleBg: "Архив", titleEn: "Archive" },
    ];
  }

  const number = makeCaseNumber();
  const person = String(fields.fullName || user.name);
  const title = `${process.catalogCode ? process.catalogCode + " — " : ""}${process.titleBg} — ${person}`;
  const status = draft ? "draft" : "awaiting_approvals";

  const fieldRows = schema.map((f) => ({
    name: f.name,
    label: f.labelBg,
    value:
      f.name === "loadLines"
        ? JSON.stringify(fields.loadLines ?? [])
        : String(fields[f.name] ?? ""),
  }));

  const gen = generateCaseDocument({
    process: {
      slug: process.slug,
      titleBg: process.titleBg,
      catalogCode: process.catalogCode,
      templatePath: process.templatePath,
    },
    caseNumber: number,
    preparedBy: user.name,
    faculty: String(fields.faculty || ""),
    fields: fieldRows,
    fieldMap: fields,
  });
  const written = writeGenerated(gen.filename, gen.buffer);

  const created = await prisma.case.create({
    data: {
      number,
      title,
      status,
      processId: process.id,
      ownerId: user.id,
      facultyId: user.facultyId,
      metaJson: JSON.stringify({ fields, docMethod: gen.method }),
      docPath: written.rel,
      steps: {
        create: route.map((s, i) => ({
          key: s.key,
          titleBg: s.titleBg,
          titleEn: s.titleEn,
          status: i === 0 ? "done" : i === 1 && !draft ? "waiting" : "pending",
          assigneeId: i === 0 ? user.id : null,
          sortOrder: i + 1,
        })),
      },
    },
    include: {
      process: true,
      steps: true,
    },
  });

  await addCaseEvent(created.id, user.id, "created", "Преписката е създадена.", "Case created.", { number });
  if (!draft) {
    await addCaseEvent(
      created.id,
      user.id,
      "submitted",
      "Подадено по маршрута. Генериран е документ.",
      "Submitted along the route. Document generated."
    );
  }

  return NextResponse.json({ case: created, downloadUrl: `/api/cases/${created.id}/document` });
}

async function createLoadCase(
  user: { id: string; name: string; facultyId: string | null },
  process: { id: string; titleBg: string },
  body: Record<string, unknown>
) {
  const period = String(body.period || "").trim();
  const program = String(body.program || "").trim();
  const funding = String(body.funding || "").trim();
  const lines: LineInput[] = Array.isArray(body.lines) ? (body.lines as LineInput[]) : [];
  const sendToLecturers = Boolean(body.sendToLecturers);

  if (!period || !program || !funding) {
    return NextResponse.json({ error: "period, program, funding required" }, { status: 400 });
  }
  if (lines.length === 0) {
    return NextResponse.json({ error: "At least one load line required" }, { status: 400 });
  }

  const prepared = lines.map((l, i) => {
    const activity = String(l.activity || "other");
    const hours = Number(l.hours) || 0;
    const rateEur =
      l.rateEur != null && l.rateEur !== ("" as unknown as number)
        ? Number(l.rateEur)
        : LOAD_ACTIVITY_RATES[activity]?.rateEur ?? 10;
    return {
      lecturerName: String(l.lecturerName || "").trim(),
      lecturerEmail: l.lecturerEmail ? String(l.lecturerEmail).trim().toLowerCase() : null,
      activity,
      hours,
      rateEur,
      amountEur: Math.round(hours * rateEur * 100) / 100,
      confirmed: false,
      sortOrder: i,
    };
  });

  if (prepared.some((l) => !l.lecturerName || l.hours <= 0)) {
    return NextResponse.json({ error: "Each line needs lecturer name and hours > 0" }, { status: 400 });
  }

  const lecturerEmails = Array.from(
    new Set(prepared.map((l) => l.lecturerEmail).filter(Boolean) as string[])
  );
  const lecturerUsers = lecturerEmails.length
    ? await prisma.user.findMany({
        where: { email: { in: lecturerEmails } },
        include: { profile: true },
      })
    : [];
  const lecturerByEmail = Object.fromEntries(lecturerUsers.map((u) => [u.email, u]));

  const status = sendToLecturers ? "awaiting_lecturer" : "draft";
  const number = makeCaseNumber();

  const created = await prisma.case.create({
    data: {
      number,
      title: `${process.titleBg} — ${program} — ${period}`,
      status,
      processId: process.id,
      ownerId: user.id,
      facultyId: user.facultyId,
      metaJson: JSON.stringify({ period, program, funding }),
      loadReport: {
        create: {
          periodLabel: period,
          programName: program,
          fundingSource: funding,
          currency: "EUR",
          totalAmount: 0,
          lines: { create: prepared },
        },
      },
      steps: {
        create: [
          ...lecturerEmails.map((email, idx) => {
            const lu = lecturerByEmail[email];
            return {
              key: "confirm_hours",
              titleBg: "Потвърдете часовете си",
              titleEn: "Confirm your hours",
              status: sendToLecturers ? "waiting" : "pending",
              assigneeId: lu?.id ?? null,
              sortOrder: idx + 1,
              payloadJson: JSON.stringify({ lecturerEmail: email }),
            };
          }),
          {
            key: "admin_review",
            titleBg: "Админ преглед и изчисление",
            titleEn: "Admin review & calculate",
            status: "pending",
            assigneeId: user.id,
            sortOrder: 50,
          },
          {
            key: "legal",
            titleBg: "Правен отдел (stub)",
            titleEn: "Legal (stub)",
            status: "pending",
            sortOrder: 60,
          },
          {
            key: "pfc",
            titleBg: "ПФЦ / финанси (stub)",
            titleEn: "PFC / finance (stub)",
            status: "pending",
            sortOrder: 70,
          },
          {
            key: "rector",
            titleBg: "Готово за ректор",
            titleEn: "Ready for rector",
            status: "pending",
            sortOrder: 80,
          },
        ],
      },
    },
    include: {
      process: true,
      loadReport: { include: { lines: true } },
      steps: true,
    },
  });

  await addCaseEvent(created.id, user.id, "created", "Преписката е създадена.", "Case created.", { number });
  if (sendToLecturers) {
    await addCaseEvent(
      created.id,
      user.id,
      "sent_to_lecturer",
      "Изпратено към преподавателя/ите за потвърждение на часовете.",
      "Sent to lecturer(s) to confirm hours."
    );
  }

  return NextResponse.json({ case: created });
}
