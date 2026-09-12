"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { RouteTimeline } from "@/components/RouteTimeline";
import { statusLabel, t } from "@/lib/i18n";
import { LOAD_ACTIVITY_RATES } from "@/lib/rates";
import type { RoutePhase } from "@/lib/processRoute";

type Line = {
  id: string;
  lecturerName: string;
  lecturerEmail: string | null;
  activity: string;
  hours: number;
  rateEur: number;
  amountEur: number;
  confirmed: boolean;
  note: string | null;
};

type CaseDetail = {
  id: string;
  number: string;
  title: string;
  status: string;
  arhimedNo: string | null;
  owner: { id: string; name: string; email: string };
  faculty: { nameBg: string; nameEn: string } | null;
  process: {
    slug: string;
    titleBg: string;
    titleEn: string;
    catalogCode?: string | null;
    fieldsJson?: string;
    routeJson?: string;
    route?: { key: string; titleBg: string; titleEn: string; phase?: string; recipients?: string[] }[];
  };
  docPath: string | null;
  metaJson: string;
  loadReport: {
    periodLabel: string;
    programName: string;
    fundingSource: string;
    totalAmount: number;
    docPath: string | null;
    lines: Line[];
  } | null;
  steps: {
    id: string;
    key: string;
    titleBg: string;
    titleEn: string;
    status: string;
    phase?: RoutePhase;
    recipients?: string[];
    noteBg?: string;
    noteEn?: string;
    virtual?: boolean;
    assigneeId: string | null;
    assignee: { id: string; name: string; email: string } | null;
  }[];
  events: {
    id: string;
    type: string;
    messageBg: string;
    messageEn: string;
    createdAt: string;
    actor: { name: string } | null;
  }[];
};

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { lang, user, ready } = useApp();
  const router = useRouter();
  const [c, setC] = useState<CaseDetail | null>(null);
  const [editHours, setEditHours] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(() => {
    return fetch(`/api/cases/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.case) {
          setC(d.case);
          const hours: Record<string, string> = {};
          for (const l of d.case.loadReport?.lines || []) {
            hours[l.id] = String(l.hours);
          }
          setEditHours(hours);
        }
      });
  }, [id]);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    load();
  }, [ready, user, router, load]);

  if (!ready || !user || !c) {
    return <div className="mx-auto max-w-6xl px-4 py-12">…</div>;
  }

  const myConfirmStep = c.steps.find(
    (s) => s.key === "confirm_hours" && s.assigneeId === user.id && s.status === "waiting"
  );
  const isOwner = c.owner.id === user.id;
  const canAdmin =
    isOwner || user.role === "program_admin" || user.role === "faculty_admin";

  async function confirmHours() {
    if (!c?.loadReport) return;
    setBusy("confirm");
    setError("");
    try {
      const myLines = c.loadReport.lines.filter(
        (l) =>
          (l.lecturerEmail && l.lecturerEmail.toLowerCase() === user!.email.toLowerCase()) ||
          l.lecturerName === user!.name
      );
      const r = await fetch(`/api/cases/${c.id}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: myLines.map((l) => ({
            id: l.id,
            hours: Number(editHours[l.id] ?? l.hours),
          })),
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || "Failed");
        return;
      }
      await load();
    } finally {
      setBusy("");
    }
  }

  async function calculate() {
    setBusy("calc");
    setError("");
    try {
      const r = await fetch(`/api/cases/${c!.id}/calculate`, { method: "POST" });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || "Failed");
        return;
      }
      await load();
    } finally {
      setBusy("");
    }
  }

  async function advance(status?: string) {
    setBusy("advance");
    setError("");
    try {
      const r = await fetch(`/api/cases/${c!.id}/advance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(status ? { status } : {}),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || "Failed");
        return;
      }
      await load();
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/cases" className="text-sm text-burgundy hover:underline">
        ← {t("navCases", lang)}
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="font-mono text-sm font-bold text-burgundy">{c.number}</div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">{c.title}</h1>
          <p className="mt-1 text-sm text-ink/60">
            {lang === "bg" ? c.process.titleBg : c.process.titleEn}
            {" · "}
            {c.owner.name}
            {c.arhimedNo ? ` · ${c.arhimedNo}` : ""}
          </p>
        </div>
        <span className="rounded-full bg-sage/10 px-3 py-1.5 text-sm font-medium text-sage">
          {statusLabel(c.status, lang)}
        </span>
      </div>

      {c.loadReport && (
        <section className="paper-card mt-8 p-6">
          <h2 className="font-display text-lg font-semibold">
            {lang === "bg" ? "Натовареност" : "Load report"}
          </h2>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-ink/45">{lang === "bg" ? "Период" : "Period"}</dt>
              <dd>{c.loadReport.periodLabel}</dd>
            </div>
            <div>
              <dt className="text-ink/45">{lang === "bg" ? "Програма" : "Program"}</dt>
              <dd>{c.loadReport.programName}</dd>
            </div>
            <div>
              <dt className="text-ink/45">{lang === "bg" ? "Финансиране" : "Funding"}</dt>
              <dd>{c.loadReport.fundingSource}</dd>
            </div>
          </dl>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-ink/50">
                  <th className="py-2 pr-2">{lang === "bg" ? "Преподавател" : "Lecturer"}</th>
                  <th className="py-2 pr-2">{lang === "bg" ? "Дейност" : "Activity"}</th>
                  <th className="py-2 pr-2">{lang === "bg" ? "Часове" : "Hours"}</th>
                  <th className="py-2 pr-2">EUR</th>
                  <th className="py-2">{lang === "bg" ? "Сума" : "Amount"}</th>
                </tr>
              </thead>
              <tbody>
                {c.loadReport.lines.map((l) => {
                  const editable = Boolean(myConfirmStep) && (
                    (l.lecturerEmail && l.lecturerEmail.toLowerCase() === user.email.toLowerCase()) ||
                    l.lecturerName === user.name
                  );
                  return (
                    <tr key={l.id} className="border-b border-ink/5">
                      <td className="py-2 pr-2">
                        {l.lecturerName}
                        {l.confirmed && <span className="ml-1 text-xs text-sage">✓</span>}
                      </td>
                      <td className="py-2 pr-2">
                        {lang === "bg"
                          ? LOAD_ACTIVITY_RATES[l.activity]?.labelBg || l.activity
                          : LOAD_ACTIVITY_RATES[l.activity]?.labelEn || l.activity}
                      </td>
                      <td className="py-2 pr-2">
                        {editable ? (
                          <input
                            className="field !w-20 !py-1"
                            type="number"
                            step="0.5"
                            value={editHours[l.id] ?? l.hours}
                            onChange={(e) =>
                              setEditHours((prev) => ({ ...prev, [l.id]: e.target.value }))
                            }
                          />
                        ) : (
                          l.hours
                        )}
                      </td>
                      <td className="py-2 pr-2">{l.rateEur.toFixed(2)}</td>
                      <td className="py-2">{l.amountEur.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm font-semibold">
            {lang === "bg" ? "Общо" : "Total"}: {c.loadReport.totalAmount.toFixed(2)} EUR
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {myConfirmStep && (
              <button
                type="button"
                className="btn-primary"
                disabled={busy === "confirm"}
                onClick={confirmHours}
              >
                {busy === "confirm"
                  ? "…"
                  : lang === "bg"
                    ? "Потвърди часовете"
                    : "Confirm hours"}
              </button>
            )}
            {canAdmin && (c.status === "awaiting_admin_review" || c.status === "draft" || c.loadReport.docPath) && (
              <button
                type="button"
                className="btn-primary"
                disabled={busy === "calc"}
                onClick={calculate}
              >
                {busy === "calc"
                  ? "…"
                  : lang === "bg"
                    ? "Изчисли и генерирай DOCX"
                    : "Calculate & generate DOCX"}
              </button>
            )}
            {(c.loadReport.docPath || c.loadReport.totalAmount > 0 || c.status !== "awaiting_lecturer") && (
              <a href={`/api/cases/${c.id}/document`} className="btn-secondary">
                {lang === "bg" ? "Свали DOCX" : "Download DOCX"}
              </a>
            )}
            {canAdmin && c.status === "awaiting_approvals" && (
              <button type="button" className="btn-secondary" onClick={() => advance("ready_for_rector")}>
                {lang === "bg" ? "Одобрения OK → ректор" : "Approvals OK → rector"}
              </button>
            )}
            {canAdmin && c.status === "ready_for_rector" && (
              <button type="button" className="btn-secondary" onClick={() => advance("archived")}>
                {lang === "bg" ? "Архивирай (+ Архимед №)" : "Archive (+ Arhimed #)"}
              </button>
            )}
          </div>
          {error && <p className="mt-3 text-sm text-burgundy">{error}</p>}
        </section>
      )}

      {!c.loadReport && (
        <section className="paper-card mt-8 p-6">
          <h2 className="font-display text-lg font-semibold">
            {lang === "bg" ? "Данни от портала" : "Portal data"}
          </h2>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {Object.entries((() => {
              try {
                const m = JSON.parse(c.metaJson || "{}");
                return (m.fields || m) as Record<string, unknown>;
              } catch {
                return {} as Record<string, unknown>;
              }
            })()).filter(([k]) => k !== "loadLines" && k !== "docMethod").map(([k, v]) => (
              <div key={k}>
                <dt className="text-ink/45">{k}</dt>
                <dd className="break-words">{typeof v === "boolean" ? (v ? "✓" : "—") : String(v ?? "")}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={`/api/cases/${c.id}/document`} className="btn-secondary">
              {lang === "bg" ? "Свали DOCX" : "Download DOCX"}
            </a>
            {canAdmin && c.status === "awaiting_approvals" && (
              <button type="button" className="btn-secondary" onClick={() => advance("ready_for_rector")}>
                {lang === "bg" ? "Одобрения OK → ректор" : "Approvals OK → rector"}
              </button>
            )}
            {canAdmin && c.status === "ready_for_rector" && (
              <button type="button" className="btn-secondary" onClick={() => advance("archived")}>
                {lang === "bg" ? "Архивирай (+ Архимед №)" : "Archive (+ Arhimed #)"}
              </button>
            )}
            {canAdmin && c.status === "draft" && (
              <button type="button" className="btn-secondary" onClick={() => advance("awaiting_approvals")}>
                {lang === "bg" ? "Подай" : "Submit"}
              </button>
            )}
          </div>
          {error && <p className="mt-3 text-sm text-burgundy">{error}</p>}
        </section>
      )}

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="paper-card p-6">
          <h2 className="font-display text-lg font-semibold">
            {lang === "bg" ? "Маршрут" : "Route"}
          </h2>
          <p className="mt-1 text-xs text-ink/45">
            {lang === "bg"
              ? "След подпис — извеждане в Архимед и официалните копия по каталога."
              : "After the last signature — Arhimed outgoing register and the official copy pack."}
          </p>
          <div className="mt-3">
            <RouteTimeline steps={c.steps} lang={lang} showStatus />
          </div>
        </div>
        <div className="paper-card p-6">
          <h2 className="font-display text-lg font-semibold">
            {lang === "bg" ? "Времева линия" : "Timeline"}
          </h2>
          <ol className="mt-3 space-y-3 text-sm">
            {c.events.map((ev) => (
              <li key={ev.id} className="border-l-2 border-burgundy/30 pl-3">
                <div className="text-xs text-ink/45">
                  {new Date(ev.createdAt).toLocaleString(lang === "bg" ? "bg-BG" : "en-GB")}
                  {ev.actor ? ` · ${ev.actor.name}` : ""}
                </div>
                <div>{lang === "bg" ? ev.messageBg : ev.messageEn}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
