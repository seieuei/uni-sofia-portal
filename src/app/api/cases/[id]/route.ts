import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isAdminRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function loadCase(id: string) {
  return prisma.case.findUnique({
    where: { id },
    include: {
      process: true,
      owner: { select: { id: true, name: true, email: true } },
      faculty: true,
      loadReport: { include: { lines: { orderBy: { sortOrder: "asc" } } } },
      steps: { include: { assignee: { select: { id: true, name: true, email: true } } }, orderBy: { sortOrder: "asc" } },
      events: {
        include: { actor: { select: { name: true, email: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

function canView(
  user: { id: string; role: string },
  c: { ownerId: string; steps: { assigneeId: string | null }[] }
) {
  if (c.ownerId === user.id) return true;
  if (c.steps.some((s) => s.assigneeId === user.id)) return true;
  if (isAdminRole(user.role as never)) return true;
  return false;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const c = await loadCase(params.id);
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!canView(user, c)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json({ case: c });
}
