import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import type { Role } from "@/lib/types";

export const dynamic = "force-dynamic";

const ALLOWED: Role[] = [
  "student",
  "lecturer",
  "program_admin",
  "faculty_admin",
  "admin_staff",
  "applicant",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const name = String(body.name || "").trim();
    const role = String(body.role || "student") as Role;
    const facultyCode = String(body.facultyCode || "FCML");
    const department = body.department ? String(body.department) : null;
    const year = body.year != null && body.year !== "" ? Number(body.year) : null;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email and password required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password min 6 chars" }, { status: 400 });
    }
    if (!ALLOWED.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const faculty = await prisma.faculty.findUnique({ where: { code: facultyCode } });
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        profile: {
          create: {
            role,
            facultyId: faculty?.id ?? null,
            department,
            year: role === "student" ? year : null,
            studentCycle: role === "student" ? String(body.studentCycle || "ba") : null,
            formOfStudy: role === "student" ? String(body.formOfStudy || "full-time") : null,
            lecturerKind: role === "lecturer" ? String(body.lecturerKind || "staff") : null,
          },
        },
      },
      include: { profile: { include: { faculty: true } } },
    });

    await setSessionCookie(user.id);
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.profile?.role,
        facultyCode: user.profile?.faculty?.code ?? null,
        department: user.profile?.department ?? null,
        year: user.profile?.year ?? null,
      },
      disclaimer: "Demo registration only. Not an official Sofia University account.",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
