import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canStartProcess, getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const all = await prisma.processDefinition.findMany({
    where: { active: true },
    orderBy: [{ hub: "asc" }, { catalogCode: "asc" }, { slug: "asc" }],
  });
  const processes = all
    .filter((p) => canStartProcess(user.role, p.rolesAllowed))
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      titleBg: p.titleBg,
      titleEn: p.titleEn,
      descriptionBg: p.descriptionBg,
      descriptionEn: p.descriptionEn,
      catalogCode: p.catalogCode,
      hub: p.hub,
      family: p.family,
      wizardKind: p.wizardKind,
      rolesAllowed: p.rolesAllowed,
      nomenclatura: p.nomenclatura,
      templatePath: p.templatePath,
    }));
  return NextResponse.json({ processes, role: user.role });
}
