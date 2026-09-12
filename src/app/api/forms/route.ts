import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const role = req.nextUrl.searchParams.get("role");
  const forms = await prisma.formTemplate.findMany({ orderBy: { titleBg: "asc" } });
  const filtered = role
    ? forms.filter((f) =>
        f.roles
          .split(",")
          .map((r) => r.trim())
          .includes(role)
      )
    : forms;
  return NextResponse.json({ forms: filtered });
}
