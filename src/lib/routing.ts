import { prisma } from "./prisma";

export async function resolveOffice(formId: string, facultyCode: string, role: string) {
  const faculty = await prisma.faculty.findUnique({ where: { code: facultyCode } });

  const rules = await prisma.routingRule.findMany({
    where: {
      formId,
      OR: [{ role }, { role: "*" }],
    },
    include: { office: true, faculty: true },
    orderBy: { priority: "desc" },
  });

  // Prefer faculty-specific match, then general
  const facultyMatch = rules.find((r) => r.facultyId && faculty && r.facultyId === faculty.id);
  if (facultyMatch) return facultyMatch;

  const anyFaculty = rules.find((r) => !r.facultyId);
  return anyFaculty ?? rules[0] ?? null;
}

export function makeTicketId() {
  const n = Math.floor(Math.random() * 900000) + 100000;
  const d = new Date();
  const y = d.getFullYear().toString().slice(2);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `СУ-${y}${m}-${n}`;
}
