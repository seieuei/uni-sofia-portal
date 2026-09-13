"use client";

import Link from "next/link";
import { useApp } from "./Providers";
import { t } from "@/lib/i18n";

export function Footer() {
  const { lang } = useApp();
  return (
    <footer className="mt-auto border-t border-ivory/10 bg-night text-ivory/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>{t("footerNote", lang)}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/admissions" className="underline decoration-ivory/30 underline-offset-4 hover:text-ivory">
            {t("navAdmissions", lang)}
          </Link>
          <Link href="/faculties" className="underline decoration-ivory/30 underline-offset-4 hover:text-ivory">
            {t("navFaculties", lang)}
          </Link>
          <Link href="/structure" className="underline decoration-ivory/30 underline-offset-4 hover:text-ivory">
            {t("navStructure", lang)}
          </Link>
          <Link href="/contacts" className="underline decoration-ivory/30 underline-offset-4 hover:text-ivory">
            {t("navContacts", lang)}
          </Link>
          <Link href="/map" className="underline decoration-ivory/30 underline-offset-4 hover:text-ivory">
            {t("navMap", lang)}
          </Link>
          <Link href="/handbook" className="underline decoration-ivory/30 underline-offset-4 hover:text-ivory">
            {t("navHandbook", lang)}
          </Link>
          <a
            href="https://www.uni-sofia.bg"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-ivory/30 underline-offset-4 hover:text-ivory"
          >
            {t("officialLink", lang)} ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
