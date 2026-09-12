"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";

export default function HandbookPage() {
  const { lang, user, ready } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!ready || !user) return <div className="mx-auto max-w-6xl px-4 py-12">…</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">{t("handbookTitle", lang)}</h1>
      <div className="paper-card mt-8 space-y-4 p-6 text-sm leading-relaxed text-ink/80">
        <p>
          {lang === "bg"
            ? "Този портал допълва СУСИ, elearn и Архимед. Официалните бланки остават непроменени — уеб UI ги попълва."
            : "This portal complements SUSI, elearn and Arhimed. Official blanks stay unchanged — the web UI fills them."}
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>5.2</strong> —{" "}
            {lang === "bg"
              ? "Натовареност / хонорари за хонорувани преподаватели."
              : "Load / honorary pay for honorary lecturers."}
          </li>
          <li>
            {lang === "bg"
              ? "Роли виждат само процеси, за които имат право (default deny)."
              : "Roles only see processes they are allowed to start (default deny)."}
          </li>
          <li>
            <Link href="/forms" className="text-burgundy underline">
              /forms
            </Link>{" "}
            — {lang === "bg" ? "наследени демо форми." : "legacy demo forms."}
          </li>
        </ul>
      </div>
    </div>
  );
}
