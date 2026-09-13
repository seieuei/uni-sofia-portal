import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = req.nextUrl.searchParams.get("role") || user.role;
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
