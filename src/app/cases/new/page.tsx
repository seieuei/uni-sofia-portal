"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { t } from "@/lib/i18n";
import { HUBS, type HubId } from "@/lib/catalog";

type Process = {
  id: string;
  slug: string;
  titleBg: string;
  titleEn: string;
  descriptionBg: string;
  descriptionEn: string;
  catalogCode: string | null;
  hub: HubId | string;
  wizardKind: string;
  nomenclatura: string | null;
};

export default function NewCaseCatalogPage() {
  const { lang, user, ready } = useApp();
  const router = useRouter();
  const [processes, setProcesses] = useState<Process[]>([]);
  const [q, setQ] = useState("");
  const [hub, setHub] = useState<string>("all");

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    fetch("/api/processes")
      .then((r) => r.json())
      .then((d) => setProcesses(d.processes || []));
  }, [ready, user, router]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return processes.filter((p) => {
      if (hub !== "all" && p.hub !== hub) return false;
      if (!query) return true;
      const hay = `${p.catalogCode || ""} ${p.titleBg} ${p.titleEn} ${p.descriptionBg} ${p.slug}`.toLowerCase();
      return hay.includes(query);
    });
  }, [processes, q, hub]);

  const byHub = useMemo(() => {
    const map = new Map<string, Process[]>();
    for (const p of filtered) {
      const list = map.get(p.hub) || [];
      list.push(p);
      map.set(p.hub, list);
    }
    return HUBS.filter((h) => map.has(h.id)).map((h) => ({ hub: h, items: map.get(h.id) || [] }));
  }, [filtered]);

  if (!ready || !user) return <div className="mx-auto max-w-6xl px-4 py-12">…</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">{t("newCaseTitle", lang)}</h1>
      <p className="mt-2 text-sm text-ink/60">
        {lang === "bg"
          ? "Пълен каталог на бланките от Drive. Официалният шаблон не се променя — порталът го попълва."
          : "Full Drive-blank catalog. Official templates stay unchanged — the portal fills them."}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          className="field max-w-sm"
          placeholder={lang === "bg" ? "Търси код, заглавие…" : "Search code, title…"}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="field max-w-xs" value={hub} onChange={(e) => setHub(e.target.value)}>
          <option value="all">{lang === "bg" ? "Всички хъбове" : "All hubs"}</option>
          {HUBS.map((h) => (
            <option key={h.id} value={h.id}>
              {lang === "bg" ? h.titleBg : h.titleEn}
            </option>
          ))}
        </select>
        <span className="text-xs text-ink/50">
          {filtered.length} / {processes.length}
        </span>
      </div>

      {processes.length === 0 && (
        <p className="paper-card mt-8 p-8 text-center text-ink/55">
          {lang === "bg"
            ? "Няма процеси за твоята роля (default deny)."
            : "No processes for your role (default deny)."}
        </p>
      )}

      <div className="mt-8 space-y-10">
        {byHub.map(({ hub: h, items }) => (
          <section key={h.id}>
            <h2 className="font-display text-xl font-semibold">{lang === "bg" ? h.titleBg : h.titleEn}</h2>
            <p className="mt-1 text-sm text-ink/55">{lang === "bg" ? h.blurbBg : h.blurbEn}</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {items.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/cases/new/${p.slug}`}
                    className="paper-card block h-full px-4 py-4 hover:bg-cream/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      {p.catalogCode ? (
                        <span className="rounded-md bg-burgundy/10 px-2 py-0.5 font-mono text-xs font-bold text-burgundy">
                          {p.catalogCode}
                        </span>
                      ) : (
                        <span className="text-xs text-ink/40">—</span>
                      )}
                      {p.wizardKind === "load-5-2" && (
                        <span className="text-[10px] uppercase tracking-wide text-sage">wizard</span>
                      )}
                    </div>
                    <div className="mt-2 font-medium">{lang === "bg" ? p.titleBg : p.titleEn}</div>
                    <div className="mt-1 line-clamp-2 text-xs text-ink/50">
                      {lang === "bg" ? p.descriptionBg : p.descriptionEn}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
