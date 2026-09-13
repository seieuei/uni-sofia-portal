"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { pathToHighlighted, UNIVERSITY_STRUCTURE, type StructureNode } from "@/lib/structure";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { getUchPlan } from "@/content/curriculum";
import { UchPlanTable } from "./UchPlanTable";

type Laid = { node: StructureNode; x: number; y: number; parent?: Laid };
type DragState = { x: number; y: number; px: number; py: number };
type NodeKind = NonNullable<StructureNode["kind"]>;
type IdSet = Set<string>;

function hash01(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
}

function collectIds(node: StructureNode, acc: string[] = []): string[] {
  acc.push(node.id);
  for (const c of node.children ?? []) collectIds(c, acc);
  return acc;
}

function layoutRadial(root: StructureNode, expanded: Set<string>, cx: number, cy: number): Laid[] {
  const out: Laid[] = [];

  function walk(node: StructureNode, depth: number, a0: number, a1: number, parent?: Laid) {
    const mid = (a0 + a1) / 2;
    const wobble = (hash01(node.id) - 0.5) * 0.22;
    const r = depth === 0 ? 0 : 70 + depth * (depth > 3 ? 118 : 132) + hash01(node.id + "r") * 18;
    const laid: Laid = {
      node,
      x: cx + Math.cos(mid + wobble) * r,
      y: cy + Math.sin(mid + wobble) * r,
      parent,
    };
    out.push(laid);
    if (!expanded.has(node.id) || !node.children?.length) return;
    const kids = node.children;
    const pad = 0.04;
    const span = a1 - a0;
    kids.forEach((child, i) => {
      const t0 = a0 + pad + (span - pad * 2) * (i / kids.length);
      const t1 = a0 + pad + (span - pad * 2) * ((i + 1) / kids.length);
      walk(child, depth + 1, t0, t1, laid);
    });
  }

  walk(root, 0, -Math.PI / 2, (Math.PI * 3) / 2);
  return out;
}

function inferKind(node: StructureNode): NodeKind {
  if (node.kind) return node.kind;
  if (node.id === "university") return "root";
  if (node.programSlug || node.degree) return "program";
  if (node.href?.startsWith("/faculties") || node.facultyCode) return "faculty";
  return "branch";
}

export function StructureMindMap({
  lang,
  facultyCode,
}: {
  lang: Lang;
  facultyCode?: string | null;
}) {
  const highlightPath = useMemo(() => {
    const path = pathToHighlighted();
    if (facultyCode && facultyCode !== "FCML") {
      return ["university", "faculties", facultyCode];
    }
    return path.length ? path : ["university", "faculties", "FCML"];
  }, [facultyCode]);

  const [expanded, setExpanded] = useState<IdSet>(
    () => new Set(["university", "faculties", "FCML", "fcml-ba", "FFIL", ...highlightPath])
  );
  const [selected, setSelected] = useState(facultyCode === "FFIL" ? "FFIL" : "FCML");
  const [pan, setPan] = useState({ x: 40, y: 20, k: 0.85 });
  const drag = useRef(null as DragState | null);

  const W = 1600;
  const H = 1200;
  const laid = useMemo(() => layoutRadial(UNIVERSITY_STRUCTURE, expanded, W / 2, H / 2), [expanded]);
  const byId = useMemo(() => new Map(laid.map((n) => [n.node.id, n])), [laid]);
  const selectedLaid = byId.get(selected);
  const selectedNode = selectedLaid?.node ?? UNIVERSITY_STRUCTURE;
  const plan = selectedNode.programSlug ? getUchPlan(selectedNode.programSlug) : null;

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setSelected(id);
  }

  function expandPilot() {
    const fcml = UNIVERSITY_STRUCTURE.children?.find((c) => c.id === "faculties")?.children?.find((c) => c.id === "FCML");
    setExpanded(new Set(["university", "faculties", "FCML", "fcml-ba", "fcml-ma", ...(fcml ? collectIds(fcml) : [])]));
    setSelected("FCML");
  }

  function collapse() {
    setExpanded(new Set(["university"]));
    setSelected("university");
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button type="button" className="btn-secondary !px-3 !py-1.5 text-xs" onClick={expandPilot}>
          {t("expandAll", lang)}
        </button>
        <button type="button" className="btn-secondary !px-3 !py-1.5 text-xs" onClick={collapse}>
          {t("collapseAll", lang)}
        </button>
        <button type="button" className="btn-secondary !px-3 !py-1.5 text-xs" onClick={() => setPan({ x: 40, y: 20, k: 0.85 })}>
          {lang === "bg" ? "Нулирай изгледа" : "Reset view"}
        </button>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            className="btn-secondary !px-2.5 !py-1.5 text-xs"
            onClick={() => setPan((p) => ({ ...p, k: Math.max(0.45, +(p.k - 0.1).toFixed(2)) }))}
            aria-label={t("zoomOut", lang)}
          >
            −
          </button>
          <span className="w-10 text-center text-xs text-ink/50">{Math.round(pan.k * 100)}%</span>
          <button
            type="button"
            className="btn-secondary !px-2.5 !py-1.5 text-xs"
            onClick={() => setPan((p) => ({ ...p, k: Math.min(1.6, +(p.k + 0.1).toFixed(2)) }))}
            aria-label={t("zoomIn", lang)}
          >
            +
          </button>
        </div>
      </div>

      <div
        className="relative h-[36rem] overflow-hidden rounded-2xl border border-ink/10 bg-paper/80 dark:border-gold/20"
        onWheel={(e) => {
          e.preventDefault();
          const dir = e.deltaY > 0 ? -0.08 : 0.08;
          setPan((p) => ({ ...p, k: Math.min(1.6, Math.max(0.45, +(p.k + dir).toFixed(2))) }));
        }}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          drag.current = { x: pan.x, y: pan.y, px: e.clientX, py: e.clientY };
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          setPan({
            x: drag.current.x + (e.clientX - drag.current.px),
            y: drag.current.y + (e.clientY - drag.current.py),
            k: pan.k,
          });
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full cursor-grab active:cursor-grabbing" aria-label={t("structureTitle", lang)}>
          <g transform={`translate(${pan.x} ${pan.y}) scale(${pan.k})`}>
            {laid.map((n) => {
              if (!n.parent) return null;
              const mx = (n.parent.x + n.x) / 2;
              const my = (n.parent.y + n.y) / 2;
              const dx = n.y - n.parent.y;
              const dy = n.parent.x - n.x;
              const len = Math.hypot(dx, dy) || 1;
              const cpx = mx + (dx / len) * 36;
              const cpy = my + (dy / len) * 36;
              const hi = highlightPath.includes(n.node.id) || n.node.highlight;
              return (
                <path
                  key={`l-${n.node.id}`}
                  d={`M ${n.parent.x} ${n.parent.y} Q ${cpx} ${cpy} ${n.x} ${n.y}`}
                  fill="none"
                  stroke={hi ? "rgb(196,163,90)" : "rgb(92,0,56)"}
                  strokeOpacity={hi ? 0.65 : 0.22}
                  strokeWidth={hi ? 2.2 : 1.3}
                />
              );
            })}
            {laid.map((n) => {
              const kind = inferKind(n.node);
              const isSel = selected === n.node.id;
              const isHi = !!n.node.highlight || highlightPath.includes(n.node.id);
              const hasKids = !!n.node.children?.length;
              const label = lang === "bg" ? n.node.labelBg : n.node.labelEn;
              const short = label.length > 34 ? `${label.slice(0, 32)}…` : label;
              const w = Math.min(220, Math.max(88, short.length * 7.2 + 28));
              const fill =
                kind === "program"
                  ? isSel
                    ? "rgb(61,90,76)"
                    : "rgba(61,90,76,0.14)"
                  : n.node.highlight || kind === "faculty"
                    ? isSel
                      ? "rgb(92,0,56)"
                      : "rgba(196,163,90,0.22)"
                    : isSel
                      ? "rgb(92,0,56)"
                      : isHi
                        ? "rgba(92,0,56,0.1)"
                        : "rgb(255,253,248)";
              const color =
                (kind === "program" && isSel) || isSel && kind !== "program" && !(n.node.highlight || kind === "faculty")
                  ? "white"
                  : isSel
                    ? "white"
                    : "rgb(28,20,16)";
              return (
                <g key={n.node.id} transform={`translate(${n.x - w / 2} ${n.y - 16})`}>
                  <rect
                    width={w}
                    height={32}
                    rx={16}
                    fill={fill}
                    stroke={isSel ? "rgb(196,163,90)" : "rgba(28,20,16,0.12)"}
                    strokeWidth={isSel ? 2 : 1}
                  />
                  <text
                    x={w / 2}
                    y={20}
                    textAnchor="middle"
                    fontSize={11}
                    fill={isSel || (kind === "program" && isSel) ? "#fff7e8" : color}
                    style={{ fontFamily: "ui-sans-serif, system-ui", pointerEvents: "none" }}
                  >
                    {hasKids ? (expanded.has(n.node.id) ? "▾ " : "▸ ") : "· "}
                    {short}
                  </text>
                  <rect
                    width={w}
                    height={32}
                    rx={16}
                    fill="transparent"
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(n.node.id);
                    }}
                  />
                </g>
              );
            })}
          </g>
        </svg>
        <p className="pointer-events-none absolute bottom-2 left-3 text-[10px] text-ink/40">
          {lang === "bg" ? "Влачи за преместване · колелце за мащаб · клик разгъва клон" : "Drag to pan · wheel to zoom · click expands a branch"}
        </p>
      </div>

      <aside className="paper-card mt-4 p-5">
        <div className="text-[10px] uppercase tracking-wide text-ink/40">
          {selectedNode.highlight ? t("yourFaculty", lang) : inferKind(selectedNode)}
        </div>
        <h3 className="font-display mt-1 text-lg font-semibold">
          {lang === "bg" ? selectedNode.labelBg : selectedNode.labelEn}
        </h3>
        {(selectedNode.hintBg || selectedNode.hintEn) && (
          <p className="mt-2 text-sm text-ink/70">{lang === "bg" ? selectedNode.hintBg : selectedNode.hintEn}</p>
        )}
        {selectedNode.children && selectedNode.children.length > 0 && (
          <p className="mt-3 text-xs text-ink/45">
            {lang === "bg"
              ? `${selectedNode.children.length} поделемента — кликни възела, за да разгънеш.`
              : `${selectedNode.children.length} children — click the node to expand.`}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedNode.href && (
            <Link href={selectedNode.href} className="btn-primary !px-3 !py-1.5 text-xs">
              {selectedNode.programSlug
                ? lang === "bg"
                  ? "Отвори учебния план"
                  : "Open curriculum"
                : lang === "bg"
                  ? "Отвори"
                  : "Open"}
            </Link>
          )}
          {selectedNode.facultyCode && (
            <Link href={`/admissions/faculties/${selectedNode.facultyCode}`} className="btn-secondary !px-3 !py-1.5 text-xs">
              {lang === "bg" ? "Прием" : "Admissions"}
            </Link>
          )}
        </div>
        {plan && (
          <div className="mt-6 border-t border-ink/10 pt-4 dark:border-gold/15">
            <h4 className="font-display text-base font-semibold">{lang === "bg" ? "УчПлан — преглед" : "UchPlan preview"}</h4>
            <p className="mb-4 text-xs text-ink/50">
              {plan.courses.length} {lang === "bg" ? "дисциплини" : "courses"} · {plan.program.semesters}{" "}
              {lang === "bg" ? "семестри" : "semesters"}
            </p>
            <UchPlanTable plan={plan} lang={lang} />
          </div>
        )}
      </aside>
    </div>
  );
}
