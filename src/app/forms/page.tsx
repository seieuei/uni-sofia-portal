"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";

type FormRow = {
  slug: string;
  titleBg: string;
  titleEn: string;
  descriptionBg: string;
  descriptionEn: string;
  category: string;
  satireNoteBg?: string | null;
  satireNoteEn?: string | null;
  roles: string;
};

export default function FormsCatalogPage() {
  const { lang, persona, user, ready, visitor } = useApp();
  const router = useRouter();
  const [forms, setForms] = useState<FormRow[]>([]);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace(visitor ? "/about" : "/login");
      return;
    }
    const q = persona ? `?role=${persona.role}` : "";
    fetch(`/api/forms${q}`)
      .then((r) => r.json())
      .then((d) => setForms(d.forms || []));
  }, [persona, ready, user, visitor, router]);

  if (!ready || !user) return <div className="mx-auto max-w-6xl px-4 py-12">…</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">{t("formsTitle", lang)}</h1>
      <p className="mt-2 text-ink/65">
        {persona ? t("formsFilter", lang) : lang === "bg" ? "Всички демо форми. Избери роля за филтър." : "All demo forms. Pick a role to filter."}
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {forms.map((f) => (
          <article key={f.slug} className="paper-card flex flex-col p-5">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-display text-lg font-semibold">{lang === "bg" ? f.titleBg : f.titleEn}</h2>
              <span className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink/50">
                {f.category}
              </span>
            </div>
            <p className="mt-2 flex-1 text-sm text-ink/65">{lang === "bg" ? f.descriptionBg : f.descriptionEn}</p>
            {(f.satireNoteBg || f.satireNoteEn) && (
              <p className="mt-3 rounded-lg border border-dashed border-gold/50 bg-gold/10 px-3 py-2 text-xs text-ink/70">
                {lang === "bg" ? f.satireNoteBg : f.satireNoteEn}
              </p>
            )}
            <Link href={`/forms/${f.slug}`} className="btn-primary mt-4 self-start !py-2 !text-xs">
              {t("fillForm", lang)}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
