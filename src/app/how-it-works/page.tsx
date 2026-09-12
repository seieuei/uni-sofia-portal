"use client";

import Link from "next/link";
import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";

export default function HowItWorksPage() {
  const { lang } = useApp();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-3xl font-bold">{t("howTitle", lang)}</h1>
      <ol className="mt-8 space-y-4">
        {(["how1", "how2", "how3", "how4"] as const).map((k, i) => (
          <li key={k} className="paper-card flex gap-4 p-5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-burgundy text-sm font-bold text-ivory">
              {i + 1}
            </span>
            <span>{t(k, lang)}</span>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/login" className="btn-primary">
          {t("ctaStart", lang)}
        </Link>
        <Link href="/" className="btn-secondary">
          {t("navHome", lang)}
        </Link>
      </div>
    </div>
  );
}
