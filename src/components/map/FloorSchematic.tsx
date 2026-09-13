"use client";

import type { FloorId, RectorateRoom } from "@/content/rooms/rectorate";
import { floorLabel, roomsOnFloor } from "@/content/rooms/rectorate";
import type { Lang } from "@/lib/types";

function kindFill(kind: RectorateRoom["kind"], active: boolean) {
  if (active) return "fill-burgundy stroke-burgundy";
  switch (kind) {
    case "hall":
      return "fill-cal-faculty/25 stroke-cal-faculty/50 dark:fill-cal-faculty/30";
    case "aula":
      return "fill-gold/30 stroke-gold/60";
    case "service":
      return "fill-ink/8 stroke-ink/25 dark:fill-ivory/10";
    default:
      return "fill-surface stroke-ink/30 dark:fill-night/40 dark:stroke-gold/30";
  }
}

export function FloorSchematic({
  floor,
  lang,
  activeId,
  onSelect,
}: {
  floor: FloorId;
  lang: Lang;
  activeId?: string | null;
  onSelect: (room: RectorateRoom) => void;
}) {
  const rooms = roomsOnFloor(floor);

  return (
    <div className="paper-card overflow-hidden p-3 sm:p-4">
      <div className="mb-2 flex items-center justify-between text-xs text-ink/50">
        <span className="font-medium text-ink/70">{floorLabel(floor, lang)}</span>
        <span>{lang === "bg" ? "Демо схема · не е етажен план" : "Demo schematic · not a floor plan"}</span>
      </div>
      <svg viewBox="0 0 100 100" className="h-auto w-full max-h-[28rem]" role="img" aria-label={floorLabel(floor, lang)}>
        <rect x="4" y="4" width="92" height="92" rx="2" className="fill-cream stroke-ink/20 dark:fill-night/60 dark:stroke-gold/20" strokeWidth="0.6" />
        <line x1="33" y1="6" x2="33" y2="96" className="stroke-ink/10 dark:stroke-gold/15" strokeWidth="0.4" strokeDasharray="2 1.5" />
        <line x1="67" y1="6" x2="67" y2="96" className="stroke-ink/10 dark:stroke-gold/15" strokeWidth="0.4" strokeDasharray="2 1.5" />
        <rect x="6" y="46" width="88" height="8" className="fill-ink/5 dark:fill-ivory/5" />
        <text x="50" y="51.5" textAnchor="middle" className="fill-ink/35" style={{ fontSize: 2.4 }}>
          {lang === "bg" ? "коридор" : "corridor"}
        </text>
        <text x="18" y="9" textAnchor="middle" className="fill-ink/30" style={{ fontSize: 2.2 }}>
          {lang === "bg" ? "З" : "W"}
        </text>
        <text x="50" y="9" textAnchor="middle" className="fill-ink/30" style={{ fontSize: 2.2 }}>
          {lang === "bg" ? "Ц" : "C"}
        </text>
        <text x="82" y="9" textAnchor="middle" className="fill-ink/30" style={{ fontSize: 2.2 }}>
          {lang === "bg" ? "И" : "E"}
        </text>

        {rooms.map((r) => {
          const w = r.w ?? 10;
          const h = r.h ?? 9;
          const x = r.x - w / 2;
          const y = r.y - h / 2;
          const active = activeId === r.id;
          return (
            <g
              key={r.id}
              className="cursor-pointer"
              onClick={() => onSelect(r)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect(r);
              }}
            >
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx="1.2"
                className={`${kindFill(r.kind, active)} transition-opacity hover:opacity-90`}
                strokeWidth={active ? 0.9 : 0.45}
              />
              <text
                x={r.x}
                y={r.y + 0.6}
                textAnchor="middle"
                className={active ? "fill-cream font-semibold" : "fill-ink dark:fill-ivory"}
                style={{ fontSize: Math.min(3.2, w * 0.35) }}
              >
                {r.number}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
