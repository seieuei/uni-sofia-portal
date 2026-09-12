"use client";

import type { Persona, Role } from "./types";
import { PERSONA_COOKIE } from "./types";

const STORAGE_KEY = "usp_persona_v1";

export function readPersona(): Persona | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || getCookie(PERSONA_COOKIE);
    if (!raw) return null;
    const p = JSON.parse(decodeURIComponent(raw)) as Persona;
    if (!p.role || !p.facultyCode) return null;
    return p;
  } catch {
    return null;
  }
}

export function writePersona(p: Persona) {
  const raw = encodeURIComponent(JSON.stringify(p));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  document.cookie = `${PERSONA_COOKIE}=${raw}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export function clearPersona() {
  localStorage.removeItem(STORAGE_KEY);
  document.cookie = `${PERSONA_COOKIE}=; path=/; max-age=0`;
}

function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? m[2] : null;
}

export function isStaff(role: Role) {
  return role === "lecturer" || role === "admin_staff";
}
