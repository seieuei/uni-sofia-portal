"use client";

import { useApp } from "./Providers";
import { t } from "@/lib/i18n";

export function Footer() {
  const { lang } = useApp();
  return (
    <footer className="mt-auto border-t border-ink/10 bg-ink text-cream/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>{t("footerNote", lang)}</p>
        <a
          href="https://www.uni-sofia.bg"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-cream/30 underline-offset-4 hover:text-cream"
        >
          {t("officialLink", lang)} ↗
        </a>
      </div>
    </footer>
  );
}
