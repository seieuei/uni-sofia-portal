"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";

/** Legacy onboarding → profile via auth */
export default function OnboardingRedirect() {
  const { lang, user, ready } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    router.replace(user ? "/week" : "/login");
  }, [ready, user, router]);

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-bold">{t("onboardingTitle", lang)}</h1>
      <p className="mt-3 text-ink/65">{t("onboardingHint", lang)}</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/login" className="btn-primary">
          {t("navLogin", lang)}
        </Link>
        <Link href="/register" className="btn-secondary">
          {t("navRegister", lang)}
        </Link>
      </div>
    </div>
  );
}
