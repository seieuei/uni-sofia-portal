"use client";

import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";

export default function DisclaimerPage() {
  const { lang } = useApp();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">{t("disclaimerTitle", lang)}</h1>
      <div className="paper-card mt-6 space-y-4 p-6 text-sm leading-relaxed text-ink/75">
        {lang === "bg" ? (
          <>
            <p>
              <strong>Този сайт не е официален</strong> канал на Софийския университет „Св. Климент Охридски“
              и не е свързан с администрацията, факултетите или информационните системи на университета.
            </p>
            <p>
              Това е <strong>демо / пилот (Phase A)</strong> на работен портал за преписки. Демо акаунтите са
              локални (SQLite) и не са университетски. Няма реален SSO към СУСИ / elearn / Архимед — порталът ги
              <em> допълва</em>, не ги замества.
            </p>
            <p>
              Демо парола за seed акаунти: <code className="rounded bg-cream px-1">demo1234</code>
            </p>
            <p>
              Официалният сайт е:{" "}
              <a className="text-burgundy underline" href="https://www.uni-sofia.bg" target="_blank" rel="noopener noreferrer">
                https://www.uni-sofia.bg
              </a>
            </p>
            <p>Дизайнът и текстовете са оригинални — не копираме активи от uni-sofia.bg.</p>
          </>
        ) : (
          <>
            <p>
              <strong>This site is not official</strong> and is not affiliated with Sofia University „St. Kliment
              Ohridski“, its faculties, or IT systems.
            </p>
            <p>
              This is a <strong>demo / pilot (Phase A)</strong> work portal for cases. Demo accounts are local
              (SQLite), not university accounts. There is no real SSO to SUSI / elearn / Arhimed — the portal
              <em> complements</em> them, it does not replace them.
            </p>
            <p>
              Demo password for seed accounts: <code className="rounded bg-cream px-1">demo1234</code>
            </p>
            <p>
              Official site:{" "}
              <a className="text-burgundy underline" href="https://www.uni-sofia.bg" target="_blank" rel="noopener noreferrer">
                https://www.uni-sofia.bg
              </a>
            </p>
            <p>Design and copy are original — we do not copy assets from uni-sofia.bg.</p>
          </>
        )}
      </div>
    </div>
  );
}
