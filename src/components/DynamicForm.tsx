"use client";

import type { CatalogField } from "@/lib/catalog";
import { ACTIVITY_KEYS, LOAD_ACTIVITY_RATES } from "@/lib/rates";

type Line = { lecturerName: string; activity: string; hours: string; rateEur: string };

export function DynamicForm({
  fields,
  values,
  onChange,
  lang,
}: {
  fields: CatalogField[];
  values: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
  lang: "bg" | "en";
}) {
  return (
    <div className="space-y-4">
      {fields.map((f) => {
        const label = lang === "bg" ? f.labelBg : f.labelEn;
        const val = values[f.name];
        if (f.type === "loadLines") {
          const lines = (Array.isArray(val) ? val : []) as Line[];
          return (
            <div key={f.name}>
              <div className="mb-2 flex items-center justify-between">
                <label className="label mb-0">
                  {label}
                  {f.required ? " *" : ""}
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-burgundy"
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
                  <div key={i} className="grid gap-2 rounded-xl border border-ink/10 bg-cream/40 p-3 sm:grid-cols-4">
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
            <label key={f.name} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="accent-burgundy"
                checked={Boolean(val)}
                onChange={(e) => onChange(f.name, e.target.checked)}
              />
              {label}
              {f.required ? " *" : ""}
            </label>
          );
        }
        if (f.type === "textarea") {
          return (
            <div key={f.name}>
              <label className="label">
                {label}
                {f.required ? " *" : ""}
              </label>
              <textarea
                className="field min-h-[120px]"
                required={f.required}
                value={String(val ?? "")}
                onChange={(e) => onChange(f.name, e.target.value)}
              />
            </div>
          );
        }
        if (f.type === "select") {
          return (
            <div key={f.name}>
              <label className="label">
                {label}
                {f.required ? " *" : ""}
              </label>
              <select
                className="field"
                required={f.required}
                value={String(val ?? "")}
                onChange={(e) => onChange(f.name, e.target.value)}
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
          <div key={f.name}>
            <label className="label">
              {label}
              {f.required ? " *" : ""}
            </label>
            <input
              className="field"
              type={f.type === "iban" ? "text" : f.type}
              required={f.required}
              value={String(val ?? "")}
              onChange={(e) => onChange(f.name, e.target.value)}
            />
          </div>
        );
      })}
    </div>
  );
}
