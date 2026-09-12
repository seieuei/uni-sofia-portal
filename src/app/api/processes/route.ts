import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canStartProcess, getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const all = await prisma.processDefinition.findMany({ where: { active: true }, orderBy: { slug: "asc" } });
  const processes = all.filter((p) => canStartProcess(user.role, p.rolesAllowed));
  return NextResponse.json({ processes });
}
