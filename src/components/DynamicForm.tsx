"use client";

import type { CatalogField } from "@/lib/catalog";
import { ACTIVITY_KEYS, LOAD_ACTIVITY_RATES } from "@/lib/rates";

type Line = { lecturerName: string; activity: string; hours: string; rateEur: string };

function groupFields(fields: CatalogField[]): { key: string; titleBg: string; titleEn: string; fields: CatalogField[] }[] {
  const groups: { key: string; titleBg: string; titleEn: string; fields: CatalogField[] }[] = [];
  const map = new Map<string, number>();
  for (const f of fields) {
    const key = f.section || "_default";
    if (!map.has(key)) {
      map.set(key, groups.length);
      groups.push({
        key,
        titleBg: f.sectionBg || "Данни",
        titleEn: f.sectionEn || "Details",
        fields: [],
      });
    }
    groups[map.get(key)!].fields.push(f);
  }
  return groups;
}

function FieldControl({
  f,
  values,
  onChange,
  lang,
  invalid,
}: {
  f: CatalogField;
  values: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
  lang: "bg" | "en";
  invalid?: boolean;
}) {
  const label = lang === "bg" ? f.labelBg : f.labelEn;
  const hint = lang === "bg" ? f.hintBg : f.hintEn;
  const val = values[f.name];
  const ring = invalid ? "ring-2 ring-cal-deadline/70 border-cal-deadline/40" : "";

  if (f.type === "loadLines") {
    const lines = (Array.isArray(val) ? val : []) as Line[];
    return (
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="label mb-0">
            {label}
            {f.required ? " *" : ""}
          </label>
          <button
            type="button"
            className="text-xs font-semibold text-burgundy hover:underline"
            onClick={() =>
              onChange(f.name, [
                ...lines,
                { lecturerName: "", activity: "lectures", hours: "0", rateEur: "25" },
              ])
            }
          >
            + {lang === "bg" ? "ред" : "row"}
          </button>
        </div>
        <div className="space-y-2">
          {lines.map((line, i) => (
            <div key={i} className="grid gap-2 rounded-xl border border-ink/10 bg-cream/40 p-3 dark:bg-night/40 sm:grid-cols-4">
              <input
                className="field"
                placeholder={lang === "bg" ? "Име" : "Name"}
                value={line.lecturerName}
                onChange={(e) => {
                  const next = [...lines];
                  next[i] = { ...next[i], lecturerName: e.target.value };
                  onChange(f.name, next);
                }}
              />
              <select
                className="field"
                value={line.activity}
                onChange={(e) => {
                  const next = [...lines];
                  next[i] = {
                    ...next[i],
                    activity: e.target.value,
                    rateEur: String(LOAD_ACTIVITY_RATES[e.target.value]?.rateEur ?? next[i].rateEur),
                  };
                  onChange(f.name, next);
                }}
              >
                {ACTIVITY_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {lang === "bg" ? LOAD_ACTIVITY_RATES[k].labelBg : LOAD_ACTIVITY_RATES[k].labelEn}
                  </option>
                ))}
              </select>
              <input
                className="field"
                type="number"
                placeholder={lang === "bg" ? "Часове" : "Hours"}
                value={line.hours}
                onChange={(e) => {
                  const next = [...lines];
                  next[i] = { ...next[i], hours: e.target.value };
                  onChange(f.name, next);
                }}
              />
              <input
                className="field"
                type="number"
                placeholder="EUR"
                value={line.rateEur}
                onChange={(e) => {
                  const next = [...lines];
                  next[i] = { ...next[i], rateEur: e.target.value };
                  onChange(f.name, next);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (f.type === "checkbox") {
    return (
      <label className={`flex items-start gap-3 rounded-xl border border-ink/10 bg-surface/60 px-3 py-2.5 text-sm dark:border-gold/15 ${invalid ? "border-cal-deadline/50" : ""}`}>
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 accent-burgundy"
          checked={Boolean(val)}
          onChange={(e) => onChange(f.name, e.target.checked)}
        />
        <span>
          <span className="font-medium text-ink/85">
            {label}
            {f.required ? " *" : ""}
          </span>
          {hint && <span className="mt-0.5 block text-xs text-ink/50">{hint}</span>}
        </span>
      </label>
    );
  }

  if (f.type === "textarea") {
    return (
      <div>
        <label className="label">
          {label}
          {f.required ? " *" : ""}
        </label>
        {hint && <p className="mb-1.5 text-xs text-ink/45">{hint}</p>}
        <textarea
          className={`field min-h-[120px] ${ring}`}
          required={f.required}
          value={String(val ?? "")}
          onChange={(e) => onChange(f.name, e.target.value)}
          aria-invalid={invalid || undefined}
        />
      </div>
    );
  }

  if (f.type === "select") {
    return (
      <div>
        <label className="label">
          {label}
          {f.required ? " *" : ""}
        </label>
        {hint && <p className="mb-1.5 text-xs text-ink/45">{hint}</p>}
        <select
          className={`field ${ring}`}
          required={f.required}
          value={String(val ?? "")}
          onChange={(e) => onChange(f.name, e.target.value)}
          aria-invalid={invalid || undefined}
        >
          <option value="">{lang === "bg" ? "— избери —" : "— choose —"}</option>
          {(f.options || []).map((o) => (
            <option key={o.value} value={o.value}>
              {lang === "bg" ? o.labelBg : o.labelEn}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <label className="label">
        {label}
        {f.required ? " *" : ""}
      </label>
      {hint && <p className="mb-1.5 text-xs text-ink/45">{hint}</p>}
      <input
        className={`field ${ring}`}
        type={f.type === "iban" ? "text" : f.type}
        required={f.required}
        value={String(val ?? "")}
        onChange={(e) => onChange(f.name, e.target.value)}
        aria-invalid={invalid || undefined}
      />
    </div>
  );
}

export function DynamicForm({
  fields,
  values,
  onChange,
  lang,
  invalidNames = [],
}: {
  fields: CatalogField[];
  values: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
  lang: "bg" | "en";
  invalidNames?: string[];
}) {
  const groups = groupFields(fields);
  const invalid = new Set(invalidNames);

  return (
    <div className="space-y-5">
      {groups.map((g) => (
        <section key={g.key} className="rounded-2xl border border-ink/10 bg-cream/30 p-4 dark:border-gold/15 dark:bg-night/30 sm:p-5">
          {g.key !== "_default" && (
            <h3 className="mb-3 font-display text-base font-semibold text-burgundy dark:text-gold">
              {lang === "bg" ? g.titleBg : g.titleEn}
            </h3>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {g.fields.map((f) => {
              const wide = f.type === "textarea" || f.type === "loadLines" || f.type === "checkbox";
              return (
                <div key={f.name} className={wide ? "sm:col-span-2" : undefined}>
                  <FieldControl f={f} values={values} onChange={onChange} lang={lang} invalid={invalid.has(f.name)} />
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

/** Client-side required-field check for DynamicForm. */
export function missingRequiredFields(fields: CatalogField[], values: Record<string, unknown>): string[] {
  const missing: string[] = [];
  for (const f of fields) {
    if (!f.required) continue;
    const v = values[f.name];
    if (f.type === "checkbox") {
      if (!v) missing.push(f.name);
      continue;
    }
    if (f.type === "loadLines") continue;
    if (v == null || String(v).trim() === "") missing.push(f.name);
  }
  return missing;
}
