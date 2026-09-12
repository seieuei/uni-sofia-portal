import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canStartProcess, getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const p = await prisma.processDefinition.findUnique({ where: { slug: params.slug } });
  if (!p || !p.active) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!canStartProcess(user.role, p.rolesAllowed)) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  let fields: unknown[] = [];
  let route: unknown[] = [];
  try {
    fields = JSON.parse(p.fieldsJson || "[]");
  } catch {
    fields = [];
  }
  try {
    route = JSON.parse(p.routeJson || "[]");
  } catch {
    route = [];
  }

  return NextResponse.json({
    process: {
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
      fields,
      route,
    },
  });
}
