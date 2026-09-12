import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const faculties = await prisma.faculty.findMany({ orderBy: { nameBg: "asc" } });
  return NextResponse.json({ faculties });
}
