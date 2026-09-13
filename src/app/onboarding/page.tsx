"use client";

import Link from "next/link";
import { useApp } from "@/components/Providers";
import { PersonTypeBadge } from "@/components/PersonTypeBadge";
import { RoleHomeCards } from "@/components/RoleHomeCards";
import { t } from "@/lib/i18n";
import { ROLES } from "@/lib/types";

export default function OnboardingPage() {
  const { lang, user, ready } = useApp();

  if (!ready) return <div className="mx-auto max-w-xl px-4 py-16 text-ink/50">…</div>;

  if (!user) {
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

  const roleLabel = ROLES.find((r) => r.id === user.role)?.[lang === "bg" ? "labelBg" : "labelEn"];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">{t("onboardingTitle", lang)}</h1>
      <p className="mt-2 text-ink/65">{t("onboardingHint", lang)}</p>
      <div className="paper-card mt-6 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="font-display text-xl font-semibold">{user.name}</div>
          <PersonTypeBadge
            role={user.role}
            studentCycle={user.studentCycle}
            formOfStudy={user.formOfStudy}
            lecturerKind={user.lecturerKind}
            lang={lang}
          />
        </div>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[11px] uppercase text-ink/40">{t("roleLabel", lang)}</dt>
            <dd>{roleLabel}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase text-ink/40">{t("facultyLabel", lang)}</dt>
            <dd>{user.facultyCode || "—"}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase text-ink/40">{t("departmentLabel", lang)}</dt>
            <dd>{user.department || "—"}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase text-ink/40">{t("emailLabel", lang)}</dt>
            <dd>{user.email}</dd>
          </div>
        </dl>
      </div>
      <RoleHomeCards user={user} lang={lang} />
    </div>
  );
}
