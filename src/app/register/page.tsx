"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";
import { ROLES } from "@/lib/types";

type Faculty = { code: string; nameBg: string; nameEn: string };

export default function RegisterPage() {
  const { lang, refreshUser } = useApp();
  const router = useRouter();
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    facultyCode: "FCML",
    department: "Африканистика",
    year: "1",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/faculties")
      .then((r) => r.json())
      .then((d) => setFaculties(d.faculties || []));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          year: form.role === "student" ? Number(form.year) : null,
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || "Registration failed");
        return;
      }
      await refreshUser();
      router.push("/week");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="font-display text-3xl font-bold">{t("registerTitle", lang)}</h1>
      <p className="callout mt-2 px-3 py-2 text-sm">
        {lang === "bg"
          ? "Отворена регистрация само за демо. Не създава истински университетски акаунт."
          : "Open registration for demo only. Does not create a real university account."}
      </p>
      <form onSubmit={onSubmit} className="paper-card mt-8 space-y-4 p-6">
        <div>
          <label className="label">{t("nameLabel", lang)}</label>
          <input
            className="field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">{t("emailLabel", lang)}</label>
          <input
            className="field"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">{t("passwordLabel", lang)}</label>
          <input
            className="field"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
          />
        </div>
        <div>
          <label className="label">{t("roleLabel", lang)}</label>
          <select
            className="field"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {lang === "bg" ? r.labelBg : r.labelEn}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">{t("facultyLabel", lang)}</label>
          <select
            className="field"
            value={form.facultyCode}
            onChange={(e) => setForm({ ...form, facultyCode: e.target.value })}
          >
            {faculties.map((f) => (
              <option key={f.code} value={f.code}>
                {lang === "bg" ? f.nameBg : f.nameEn}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">{t("departmentLabel", lang)}</label>
          <input
            className="field"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />
        </div>
        {form.role === "student" && (
          <div>
            <label className="label">{t("yearLabel", lang)}</label>
            <input
              className="field"
              type="number"
              min={1}
              max={6}
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
          </div>
        )}
        {error && <p className="text-sm text-burgundy">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "…" : t("navRegister", lang)}
        </button>
      </form>
      <p className="mt-4 text-sm">
        <Link href="/login" className="text-burgundy hover:underline">
          {t("navLogin", lang)} →
        </Link>
      </p>
    </div>
  );
}
