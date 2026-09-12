"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";
import type { FormField } from "@/lib/types";

type FormDetail = {
  slug: string;
  titleBg: string;
  titleEn: string;
  descriptionBg: string;
  descriptionEn: string;
  satireNoteBg?: string | null;
  satireNoteEn?: string | null;
  fields: FormField[];
  roles: string;
};

type Result = {
  ticketId: string;
  office: { nameBg: string; nameEn: string; emailSim: string };
  statusNoteBg?: string;
  statusNoteEn?: string;
};

export default function FormFillPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang, persona } = useApp();
  const [form, setForm] = useState<FormDetail | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    fetch(`/api/forms/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else {
          setForm(d.form);
          const init: Record<string, string> = {};
          if (persona?.name) init.fullName = persona.name;
          if (persona?.email) init.email = persona.email;
          setValues(init);
        }
      })
      .catch(() => setError("Failed to load form"));
  }, [slug, persona]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!persona) {
      setError(lang === "bg" ? "Първо избери роля в онбординга." : "Pick a role in onboarding first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formSlug: slug,
          role: persona.role,
          facultyCode: persona.facultyCode,
          submitterName: persona.name || values.fullName || "Анонимен / Anonymous",
          submitterEmail: persona.email || values.email || "demo@local",
          data: values,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submit failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  if (error && !form) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-burgundy">{error}</p>
        <Link href="/forms" className="btn-secondary mt-4 inline-flex">
          {t("backForms", lang)}
        </Link>
      </div>
    );
  }

  if (!form) return <div className="mx-auto max-w-2xl px-4 py-12 text-ink/50">…</div>;

  if (result) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <div className="paper-card p-8 text-center">
          <div className="stamp mx-auto mb-4">{t("confirmation", lang)}</div>
          <h1 className="font-display text-2xl font-bold text-sage">{t("ticketCreated", lang)}</h1>
          <p className="mt-4 font-mono text-2xl font-bold tracking-wide text-burgundy">{result.ticketId}</p>
          <p className="mt-4 text-sm text-ink/70">
            {t("routedTo", lang)}:{" "}
            <strong>{lang === "bg" ? result.office.nameBg : result.office.nameEn}</strong>
            <br />
            <span className="text-xs text-ink/45">{result.office.emailSim}</span>
          </p>
          {(result.statusNoteBg || result.statusNoteEn) && (
            <p className="mt-4 rounded-lg bg-cream px-3 py-2 text-xs text-ink/65">
              {lang === "bg" ? result.statusNoteBg : result.statusNoteEn}
            </p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/forms" className="btn-secondary">
              {t("backForms", lang)}
            </Link>
            <Link href="/dashboard" className="btn-primary">
              {t("ctaDashboard", lang)}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/forms" className="text-sm text-burgundy hover:underline">
        ← {t("backForms", lang)}
      </Link>
      <h1 className="font-display mt-3 text-3xl font-bold">{lang === "bg" ? form.titleBg : form.titleEn}</h1>
      <p className="mt-2 text-ink/65">{lang === "bg" ? form.descriptionBg : form.descriptionEn}</p>
      {(form.satireNoteBg || form.satireNoteEn) && (
        <p className="mt-3 rounded-lg border border-dashed border-gold/50 bg-gold/10 px-3 py-2 text-xs">
          {lang === "bg" ? form.satireNoteBg : form.satireNoteEn}
        </p>
      )}

      {!persona && (
        <p className="mt-4 rounded-xl border border-burgundy/30 bg-burgundy/5 px-4 py-3 text-sm">
          {t("noPersona", lang)}{" "}
          <Link href="/onboarding" className="font-semibold text-burgundy underline">
            {t("ctaStart", lang)}
          </Link>
        </p>
      )}

      <form onSubmit={onSubmit} className="paper-card mt-6 space-y-4 p-6">
        {form.fields.map((field) => (
          <div key={field.name}>
            <label className="label" htmlFor={field.name}>
              {lang === "bg" ? field.labelBg : field.labelEn}
              {field.required !== false && <span className="text-burgundy"> *</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={field.name}
                className="field min-h-[100px]"
                required={field.required !== false}
                value={values[field.name] || ""}
                onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
              />
            ) : field.type === "select" ? (
              <select
                id={field.name}
                className="field"
                required={field.required !== false}
                value={values[field.name] || ""}
                onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
              >
                <option value="">—</option>
                {(field.options || []).map((o) => (
                  <option key={o.value} value={o.value}>
                    {lang === "bg" ? o.labelBg : o.labelEn}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.name}
                type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "email" ? "email" : "text"}
                className="field"
                required={field.required !== false}
                value={values[field.name] || ""}
                onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
              />
            )}
          </div>
        ))}

        {error && <p className="text-sm text-burgundy">{error}</p>}

        <button type="submit" className="btn-primary" disabled={loading || !persona}>
          {loading ? t("submitting", lang) : t("submitForm", lang)}
        </button>
      </form>
    </div>
  );
}
