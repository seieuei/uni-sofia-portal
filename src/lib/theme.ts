export type ResolvedTheme = "light" | "dark";

export const THEME_COOKIE = "usp_theme";

export function parseTheme(v?: string | null): ResolvedTheme | null {
  return v === "light" || v === "dark" ? v : null;
}

/** Runs before paint so the first frame matches localStorage, cookie, or system preference. */
export const THEME_INIT_SCRIPT = `(function(){try{var k=${JSON.stringify(
  THEME_COOKIE
)};var t=null;try{t=localStorage.getItem(k);}catch(e){}if(t!=="light"&&t!=="dark"){var m=document.cookie.match(new RegExp("(?:^|; )"+k+"=([^;]+)"));t=m?decodeURIComponent(m[1]):"";}if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}var r=document.documentElement;r.classList.toggle("dark",t==="dark");r.style.colorScheme=t;}catch(e){}})();`;

export function applyTheme(theme: ResolvedTheme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function readSavedTheme(): ResolvedTheme | null {
  if (typeof window === "undefined") return null;
  try {
    const ls = parseTheme(localStorage.getItem(THEME_COOKIE));
    if (ls) return ls;
  } catch {
    /* private mode */
  }
  const m = document.cookie.match(new RegExp(`(?:^|; )${THEME_COOKIE}=([^;]+)`));
  return parseTheme(m ? decodeURIComponent(m[1]) : null);
}

export function readResolvedTheme(): ResolvedTheme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function systemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function persistTheme(theme: ResolvedTheme) {
  try {
    localStorage.setItem(THEME_COOKIE, theme);
  } catch {
    /* private mode */
  }
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}
