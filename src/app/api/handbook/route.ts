import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HANDBOOK } from "@/lib/catalog";

export const dynamic = "force-dynamic";

/** Handbook is informative — readable without login (cases/forms stay gated). */
export async function GET() {
  try {
    const entries = await prisma.handbookEntry.findMany({ orderBy: { sortOrder: "asc" } });
    if (entries.length) return NextResponse.json({ entries });
  } catch {
    /* fall through to static catalog */
  }
  const entries = HANDBOOK.map((h, i) => ({
    slug: h.slug,
    titleBg: h.titleBg,
    titleEn: h.titleEn,
    summaryBg: h.summaryBg,
    summaryEn: h.summaryEn,
    kind: h.kind,
    driveFileId: h.driveFileId ?? null,
    path: null,
    sortOrder: i,
  }));
  return NextResponse.json({ entries });
}
