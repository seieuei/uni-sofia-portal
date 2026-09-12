import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { offeringsForUser, serializeOffering } from "@/lib/academic";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const offerings = await offeringsForUser(prisma, user);
  return NextResponse.json({
    offerings: offerings.map((o) => serializeOffering(o)),
  });
}
