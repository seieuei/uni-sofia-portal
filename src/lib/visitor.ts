export const VISITOR_COOKIE = "usp_visitor";

/** Informative pages a visitor may use. No cases, forms, workflows, or internal desk. */
export const VISITOR_ALLOWED_PREFIXES = [
  "/",
  "/about",
  "/faculties",
  "/admissions",
  "/programs",
  "/structure",
  "/contacts",
  "/journey",
  "/how-it-works",
  "/manifesto",
  "/disclaimer",
  "/login",
  "/register",
];

export const INTERNAL_PREFIXES = [
  "/week",
  "/inbox",
  "/cases",
  "/courses",
  "/electives",
  "/curriculum",
  "/report",
  "/handbook",
  "/reports",
  "/forms",
  "/onboarding",
  "/dashboard",
];

export function pathAllowedForVisitor(path: string): boolean {
  if (INTERNAL_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))) return false;
  return VISITOR_ALLOWED_PREFIXES.some((p) => path === p || (p !== "/" && path.startsWith(`${p}/`)));
}

export function isInternalPath(path: string): boolean {
  return INTERNAL_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

export function readVisitorCookie(): boolean {
  if (typeof document === "undefined") return false;
  return /(?:^|; )usp_visitor=1(?:;|$)/.test(document.cookie);
}

export function persistVisitor(on: boolean) {
  if (typeof document === "undefined") return;
  document.cookie = `${VISITOR_COOKIE}=${on ? "1" : ""}; path=/; max-age=${on ? 60 * 60 * 24 * 30 : 0}; SameSite=Lax`;
}
