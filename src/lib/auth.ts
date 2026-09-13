import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import type { Role, SessionUser } from "./types";
import { SESSION_COOKIE } from "./types";

const encoder = new TextEncoder();

function secretKey() {
  const s = process.env.SESSION_SECRET || "uni-sofia-portal-dev-secret-change-me";
  return encoder.encode(s);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(userId: string) {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(secretKey());
}

export async function setSessionCookie(userId: string) {
  const token = await createSessionToken(userId);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearSessionCookie() {
  cookies().set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionUserId(): Promise<string | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: { include: { faculty: true } } },
  });
  if (!user || !user.profile) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.profile.role as Role,
    facultyCode: user.profile.faculty?.code ?? null,
    facultyId: user.profile.facultyId,
    department: user.profile.department,
    year: user.profile.year,
    studentCycle: user.profile.studentCycle,
    formOfStudy: user.profile.formOfStudy,
    lecturerKind: user.profile.lecturerKind,
  };
}

export function canStartProcess(role: Role, rolesAllowed: string) {
  const allowed = rolesAllowed.split(",").map((r) => r.trim()).filter(Boolean);
  return allowed.includes(role) || allowed.includes("*");
}

export function isAdminRole(role: Role) {
  return role === "program_admin" || role === "faculty_admin" || role === "admin_staff";
}

export function isStaffRole(role: Role) {
  return isAdminRole(role) || role === "lecturer";
}
