"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";

export default function ReportsPage() {
  const { lang, user, ready } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!ready || !user) return <div className="mx-auto max-w-6xl px-4 py-12">…</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">{t("reportsTitle", lang)}</h1>
      <p className="mt-2 text-ink/60">
        {lang === "bg"
          ? "Справки — Phase A обвивка. Пълни отчети идват в следваща фаза."
          : "Reports — Phase A shell. Full reporting comes in a later phase."}
      </p>
      <div className="paper-card mt-8 space-y-3 p-6 text-sm">
        <p>
          {lang === "bg"
            ? "Засега: прегледай делата си и сваляй генерираните DOCX от преписка 5.2."
            : "For now: browse your cases and download generated DOCX from 5.2 cases."}
        </p>
        <Link href="/cases" className="btn-primary inline-flex text-sm">
          {t("navCases", lang)}
        </Link>
      </div>
    </div>
  );
}
