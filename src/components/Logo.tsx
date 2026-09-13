"use client";

import type { Lang } from "@/lib/types";

type Props = {
  lang: Lang;
  variant?: "mark" | "wordmark";
  className?: string;
};

export function Logo({ lang, variant = "mark", className = "" }: Props) {
  if (variant === "wordmark") {
    const src = lang === "en" ? "/logo-su-en.svg" : "/logo-su-bg.svg";
    const alt = lang === "en" ? "Sofia University St. Kliment Ohridski" : "Софийски университет Св. Климент Охридски";
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={className || "h-16 w-auto"} />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-su-mark.svg"
      alt={lang === "en" ? "Sofia University" : "Софийски университет"}
      className={className || "h-9 w-9 rounded-xl shadow-sm"}
    />
  );
}
