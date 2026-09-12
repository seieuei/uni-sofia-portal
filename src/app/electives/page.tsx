"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";
import { formatSlots, typeLabel, type OfferingDTO } from "@/lib/academicUi";

type WindowDTO = {
  id: string;
  titleBg: string;
  titleEn: string;
  opensAt: string;
  closesAt: string;
  minEcts: number;
  maxEcts: number;
  open: boolean;
};

export default function ElectivesPage() {
  const { lang, user, ready } = useApp();
  const router = useRouter();
  const [window, setWindow] = useState<WindowDTO | null>(null);
  const [options, setOptions] = useState<OfferingDTO[]>([]);
  const [chosen, setChosen] = useState<string[]>([]);
  const [selectedEcts, setSelectedEcts] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  function load() {
    return fetch("/api/academic/electives")
      .then((r) => r.json())
      .then((d) => {
        setWindow(d.window);
        setOptions(d.options || []);
        setChosen(d.chosen || []);
        setSelectedEcts(d.selectedEcts || 0);
      });
  }

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "student") {
      router.replace("/courses");
      return;
    }
    load();
  }, [ready, user, router]);

  async function toggle(offeringId: string, picked: boolean) {
    setBusy(offeringId);
    setError("");
    const r = await fetch("/api/academic/electives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ offeringId, action: picked ? "drop" : "pick" }),
    });
    const d = await r.json();
    if (!r.ok) setError(d.error || "Error");
    await load();
    setBusy(null);
  }

  if (!ready || !user) return <div className="mx-auto max-w-6xl px-4 py-12">…</div>;

  const locale = lang === "bg" ? "bg-BG" : "en-GB";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">{t("navElectives", lang)}</h1>
      {window ? (
        <p className="mt-2 text-sm text-ink/60">
          {lang === "bg" ? window.titleBg : window.titleEn}
          {" · "}
          {new Date(window.opensAt).toLocaleDateString(locale)} – {new Date(window.closesAt).toLocaleDateString(locale)}
          {" · "}
          {selectedEcts} / {window.maxEcts} ECTS
          {window.minEcts ? ` (${lang === "bg" ? "мин." : "min."} ${window.minEcts})` : ""}
          {window.open
            ? ""
            : lang === "bg"
              ? " — прозорецът е затворен"
              : " — window closed"}
        </p>
      ) : (
        <p className="mt-2 text-sm text-ink/55">
          {lang === "bg" ? "Няма отворен прозорец за избор." : "No elective window is open."}
        </p>
      )}

      {error && <p className="mt-4 text-sm text-burgundy">{error}</p>}

      <ul className="mt-8 space-y-3">
        {options.map((o) => {
          const picked = chosen.includes(o.id);
          const wouldExceed = !picked && window && selectedEcts + o.course.ects > window.maxEcts;
          return (
            <li key={o.id} className="paper-card flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <div className="font-mono text-sm font-bold text-burgundy">{o.course.code}</div>
                <div className="font-medium">{lang === "bg" ? o.course.titleBg : o.course.titleEn}</div>
                <div className="text-xs text-ink/55">
                  {typeLabel(o.course.type, lang)} · {o.course.ects} ECTS · {o.lecturer?.name || "—"} ·{" "}
                  {formatSlots(o.slots, lang)}
                </div>
              </div>
              <button
                type="button"
                disabled={!window?.open || busy === o.id || Boolean(wouldExceed && !picked)}
                onClick={() => toggle(o.id, picked)}
                className={picked ? "btn-secondary text-sm" : "btn-primary text-sm"}
              >
                {picked
                  ? lang === "bg"
                    ? "Премахни"
                    : "Drop"
                  : lang === "bg"
                    ? "Избери"
                    : "Pick"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
