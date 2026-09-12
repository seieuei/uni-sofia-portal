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
              Съдържанието е <strong>сатирично / мем</strong> и образователно демо на студентски портал. Не
              събираме университетски акаунти, няма реален SSO, няма изпращане на истински имейли и няма
              достъп до реални студентски данни.
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
              Content is <strong>satirical / meme</strong> plus an educational demo of a student portal. We do not
              collect university credentials, there is no real SSO, no real email delivery, and no access to real
              student data.
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
