"use client";

import { useEffect, useState } from "react";
import { useApp } from "./Providers";
import { t } from "@/lib/i18n";

export function ThemeToggle() {
  const { lang, theme, toggleTheme } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toDark = theme !== "dark";
  const label = toDark ? t("themeToDark", lang) : t("themeToLight", lang);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-ink/15 bg-surface text-ink/70 transition hover:bg-ink/5 hover:text-ink"
      aria-label={label}
      title={label}
    >
      {mounted && theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 14.3A8.5 8.5 0 1 1 9.7 3 6.6 6.6 0 0 0 21 14.3Z"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 3v1.6M12 19.4V21M4.6 4.6l1.1 1.1M18.3 18.3l1.1 1.1M3 12h1.6M19.4 12H21M4.6 19.4l1.1-1.1M18.3 5.7l1.1-1.1" />
    </svg>
  );
}
