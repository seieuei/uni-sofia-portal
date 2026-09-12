"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";
import { ROLES, type Role } from "@/lib/types";

type Faculty = { code: string; nameBg: string; nameEn: string; shortBg: string; shortEn: string };

export default function OnboardingPage() {
  const { lang, setPersona, persona } = useApp();
  const router = useRouter();
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [role, setRole] = useState<Role>(persona?.role ?? "student");
  const [facultyCode, setFacultyCode] = useState(persona?.facultyCode ?? "");
  const [name, setName] = useState(persona?.name ?? "");
  const [email, setEmail] = useState(persona?.email ?? "");

  useEffect(() => {
    fetch("/api/faculties")
      .then((r) => r.json())
      .then((d) => {
        setFaculties(d.faculties || []);
        setFacultyCode((prev) => prev || d.faculties?.[0]?.code || "");
      })
      .catch(() => {});
  }, []);

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!facultyCode) return;
    setPersona({
      role,
      facultyCode,
      name: name || undefined,
      email: email || undefined,
    });
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">{t("onboardingTitle", lang)}</h1>
      <p className="mt-2 text-ink/65">{t("onboardingHint", lang)}</p>

      <form onSubmit={save} className="paper-card mt-8 space-y-6 p-6">
        <fieldset>
          <legend className="label">{t("roleLabel", lang)}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {ROLES.map((r) => (
              <label
                key={r.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm transition ${
                  role === r.id ? "border-burgundy bg-burgundy/5" : "border-ink/10 hover:border-ink/25"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  className="accent-burgundy"
                  checked={role === r.id}
                  onChange={() => setRole(r.id)}
                />
                <span className="text-lg">{r.emoji}</span>
                <span className="font-medium">{lang === "bg" ? r.labelBg : r.labelEn}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="label" htmlFor="faculty">
            {t("facultyLabel", lang)}
          </label>
          <select
            id="faculty"
            className="field"
            value={facultyCode}
            onChange={(e) => setFacultyCode(e.target.value)}
            required
          >
            {faculties.map((f) => (
              <option key={f.code} value={f.code}>
                {lang === "bg" ? f.nameBg : f.nameEn}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">
              {t("nameLabel", lang)}
            </label>
            <input id="name" className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder={lang === "bg" ? "Иван Иванов" : "Ada Lovelace"} />
          </div>
          <div>
            <label className="label" htmlFor="email">
              {t("emailLabel", lang)}
            </label>
            <input
              id="email"
              type="email"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@student.example"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full sm:w-auto">
          {t("savePersona", lang)}
        </button>
      </form>
    </div>
  );
}
