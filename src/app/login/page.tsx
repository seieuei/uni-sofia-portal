"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";

const ROLE_EMAIL: Record<string, string> = {
  student: "student@demo.uni-sofia.local",
  lecturer: "lecturer@demo.uni-sofia.local",
  program_admin: "program.admin@demo.uni-sofia.local",
  faculty_admin: "faculty.admin@demo.uni-sofia.local",
  admin_staff: "program.admin@demo.uni-sofia.local",
  assistant: "assistant@demo.uni-sofia.local",
};

const DEMOS = [
  "program.admin@demo.uni-sofia.local",
  "lecturer@demo.uni-sofia.local",
  "assistant@demo.uni-sofia.local",
  "faculty.admin@demo.uni-sofia.local",
  "student@demo.uni-sofia.local",
];

function LoginForm() {
  const { lang, refreshUser, exitVisitor } = useApp();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState(DEMOS[0]);
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState("");

  useEffect(() => {
    const role = params.get("role") || "";
    const emailParam = params.get("email") || "";
    if (emailParam) {
      setEmail(emailParam);
      setHint(emailParam);
    } else if (role && ROLE_EMAIL[role]) {
      setEmail(ROLE_EMAIL[role]);
      setHint(ROLE_EMAIL[role]);
    }
  }, [params]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || "Login failed");
        return;
      }
      exitVisitor();
      await refreshUser();
      router.push("/week");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl font-bold">{t("loginTitle", lang)}</h1>
      <p className="mt-2 text-sm text-ink/60">
        {lang === "bg" ? "Демо вход. Не е официален СУ акаунт." : "Demo sign-in. Not an official SU account."}
      </p>
      {hint && (
        <p className="callout mt-4 px-3 py-2 text-sm">
          {t("demoHint", lang)}: <code className="font-mono text-xs">{hint}</code> · demo1234
        </p>
      )}
      <form onSubmit={onSubmit} className="paper-card mt-8 space-y-4 p-6">
        <div>
          <label className="label">{t("emailLabel", lang)}</label>
          <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="label">{t("passwordLabel", lang)}</label>
          <input
            className="field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-burgundy">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "…" : t("navLogin", lang)}
        </button>
      </form>
      <div className="mt-6 text-sm">
        <p className="mb-2 font-medium">{t("demoCreds", lang)}</p>
        <ul className="space-y-1 text-xs text-ink/70">
          {DEMOS.map((e) => (
            <li key={e}>
              <button type="button" className="underline-offset-2 hover:underline" onClick={() => setEmail(e)}>
                {e}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          <Link href="/register" className="text-burgundy hover:underline">
            {t("navRegister", lang)} →
          </Link>
        </p>
        <p className="mt-2">
          <Link href="/about" className="text-ink/60 hover:underline">
            {t("continueVisitor", lang)} →
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-16 text-ink/50">…</div>}>
      <LoginForm />
    </Suspense>
  );
}
