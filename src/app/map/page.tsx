"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/components/Providers";
import { FloorSchematic } from "@/components/map/FloorSchematic";
import { ContactCard } from "@/components/ContactCard";
import {
  FLOOR_ORDER,
  RECTORATE_ROOMS,
  floorLabel,
  searchRooms,
  wingLabel,
  type FloorId,
  type RectorateRoom,
} from "@/content/rooms/rectorate";
import { t } from "@/lib/i18n";

function MapInner() {
  const { lang } = useApp();
  const params = useSearchParams();
  const initialQ = params.get("q") || params.get("room") || "";
  const [query, setQuery] = useState(initialQ);
  const [floor, setFloor] = useState<FloorId>("parter");
  const [selected, setSelected] = useState<RectorateRoom | null>(null);

  const matches = useMemo(() => searchRooms(query), [query]);

  useEffect(() => {
    if (initialQ) {
      const found = searchRooms(initialQ);
      if (found[0]) {
        setSelected(found[0]);
        setFloor(found[0].floor);
      }
    }
  }, [initialQ]);

  function pick(room: RectorateRoom) {
    setSelected(room);
    setFloor(room.floor);
    setQuery(room.number);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="rounded-xl border border-amber-500/40 bg-amber-50/80 px-4 py-3 text-sm text-amber-950 dark:border-gold/40 dark:bg-gold/10 dark:text-ivory">
        {lang === "bg"
          ? "Демо схема — истински етажни планове предстоят"
          : "Demo schematic — real floor plans coming later"}
      </div>

      <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-burgundy/70">
        {lang === "bg" ? "Ректорат" : "Rectorate"}
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold">
        {lang === "bg" ? "Намери стая" : "Find a room"}
      </h1>
      <p className="mt-3 max-w-2xl text-ink/70">
        {lang === "bg"
          ? "Търсене по номер или име (напр. 232, 65, Заседателна зала 1). Стаите са свързани с контакти и календарни зали от пилота."
          : "Search by number or name (e.g. 232, 65, Meeting hall 1). Rooms link to contacts and calendar halls from the pilot."}
      </p>

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link href="/contacts" className="rounded-full bg-burgundy/10 px-3 py-1 text-burgundy hover:bg-burgundy/15">
          {t("navContacts", lang)}
        </Link>
        <Link href="/handbook" className="rounded-full bg-burgundy/10 px-3 py-1 text-burgundy hover:bg-burgundy/15">
          {t("navHandbook", lang)}
        </Link>
        <Link href="/structure" className="rounded-full bg-ink/5 px-3 py-1 text-ink/70 hover:bg-ink/10">
          {t("navStructure", lang)}
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-ink/45">
            {lang === "bg" ? "Търсене" : "Search"}
          </label>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              const v = e.target.value;
              setQuery(v);
              const found = searchRooms(v);
              if (found.length === 1) {
                setSelected(found[0]);
                setFloor(found[0].floor);
              } else if (!v.trim()) {
                setSelected(null);
              }
            }}
            placeholder={lang === "bg" ? "232, ауд. 65, Заседателна зала 1…" : "232, aud. 65, Meeting hall 1…"}
            className="mt-1 w-full rounded-xl border border-ink/15 bg-surface px-3 py-2.5 text-sm outline-none ring-burgundy/30 focus:ring-2 dark:border-gold/20"
          />

          <div className="mt-4 flex flex-wrap gap-1.5">
            {FLOOR_ORDER.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFloor(f)}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  floor === f ? "bg-burgundy text-cream" : "bg-ink/5 text-ink/70 hover:bg-ink/10"
                }`}
              >
                {floorLabel(f, lang)}
              </button>
            ))}
          </div>

          <ul className="mt-4 max-h-80 space-y-1.5 overflow-y-auto text-sm">
            {(query.trim() ? matches : RECTORATE_ROOMS.filter((r) => r.floor === floor)).map((r) => {
              const active = selected?.id === r.id;
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => pick(r)}
                    className={`flex w-full items-start justify-between gap-2 rounded-xl border px-3 py-2 text-left transition ${
                      active
                        ? "border-burgundy/40 bg-burgundy/10"
                        : "border-ink/10 bg-surface hover:border-burgundy/25 dark:border-gold/15"
                    }`}
                  >
                    <span>
                      <span className="font-semibold text-burgundy">{r.number}</span>{" "}
                      <span className="text-ink/80">{lang === "bg" ? r.nameBg : r.nameEn}</span>
                      <span className="mt-0.5 block text-[11px] text-ink/45">
                        {floorLabel(r.floor, lang)} · {wingLabel(r.wing, lang)}
                      </span>
                    </span>
                    {r.contacts && r.contacts.length > 0 && (
                      <span className="shrink-0 rounded-full bg-ink/5 px-2 py-0.5 text-[10px] text-ink/55">
                        {r.contacts.length} {lang === "bg" ? "конт." : "contacts"}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
            {query.trim() && matches.length === 0 && (
              <li className="rounded-xl border border-dashed border-ink/15 px-3 py-4 text-center text-ink/45">
                {lang === "bg" ? "Няма съвпадение в демо схемата." : "No match in the demo schematic."}
              </li>
            )}
          </ul>
        </div>

        <div className="space-y-4">
          <FloorSchematic floor={floor} lang={lang} activeId={selected?.id} onSelect={pick} />

          {selected && (
            <aside className="paper-card border-burgundy/20 p-5">
              <p className="text-[11px] uppercase tracking-wide text-burgundy/70">
                {floorLabel(selected.floor, lang)} · {wingLabel(selected.wing, lang)}
              </p>
              <h2 className="mt-1 font-display text-xl font-semibold">
                {selected.number} — {lang === "bg" ? selected.nameBg : selected.nameEn}
              </h2>
              {(selected.noteBg || selected.noteEn) && (
                <p className="mt-2 text-sm text-ink/65">{lang === "bg" ? selected.noteBg : selected.noteEn}</p>
              )}
              {selected.contactHref && (
                <Link href={selected.contactHref} className="mt-3 inline-block text-sm font-medium text-burgundy hover:underline">
                  {lang === "bg" ? "Към контактите →" : "Go to contacts →"}
                </Link>
              )}
              {selected.contacts && selected.contacts.length > 0 && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {selected.contacts.slice(0, 6).map((c) => (
                    <ContactCard key={c.roleBg + c.name} person={c} lang={lang} />
                  ))}
                </div>
              )}
            </aside>
          )}
        </div>
      </div>

      <p className="mt-8 text-xs text-ink/40">
        {lang === "bg"
          ? `${RECTORATE_ROOMS.length} стаи в демо набора (контакти + календарни зали + учебни зали от пилота).`
          : `${RECTORATE_ROOMS.length} rooms in the demo set (contacts + calendar halls + pilot teaching rooms).`}
      </p>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-12 text-ink/50">…</div>}>
      <MapInner />
    </Suspense>
  );
}
