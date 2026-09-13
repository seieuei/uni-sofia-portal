import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await prisma.formTemplate.findUnique({ where: { slug: params.slug } });
  if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 });
  let fields = [];
  try {
    fields = JSON.parse(form.fieldsJson);
  } catch {
    fields = [];
  }
  return NextResponse.json({ form: { ...form, fields } });
}
