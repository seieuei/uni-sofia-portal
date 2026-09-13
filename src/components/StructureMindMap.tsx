"use client";

import { useMemo, useState } from "react";
import { pathToHighlighted, UNIVERSITY_STRUCTURE, type StructureNode } from "@/lib/structure";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

function collectIds(node: StructureNode, acc: string[] = []): string[] {
  acc.push(node.id);
  for (const c of node.children ?? []) collectIds(c, acc);
  return acc;
}

function subtreeIds(node: StructureNode): string[] {
  return collectIds(node, []);
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

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(["university", ...highlightPath]));
  const [selected, setSelected] = useState<string>(facultyCode === "FCML" || !facultyCode ? "FCML" : facultyCode);
  const [zoom, setZoom] = useState(1);

  const selectedNode = useMemo(() => {
    const stack: StructureNode[] = [UNIVERSITY_STRUCTURE];
    while (stack.length) {
      const n = stack.pop()!;
      if (n.id === selected) return n;
      stack.push(...(n.children ?? []));
    }
    return UNIVERSITY_STRUCTURE;
  }, [selected]);

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setSelected(id);
  }

  function expandFcml() {
    const fcml = UNIVERSITY_STRUCTURE.children
      ?.find((c) => c.id === "faculties")
      ?.children?.find((c) => c.id === "FCML");
    const ids = new Set(["university", "faculties", "FCML", ...(fcml ? subtreeIds(fcml) : [])]);
    setExpanded(ids);
    setSelected("FCML");
  }

  function collapse() {
    setExpanded(new Set(["university"]));
    setSelected("university");
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button type="button" className="btn-secondary !px-3 !py-1.5 text-xs" onClick={expandFcml}>
          {t("expandAll", lang)}
        </button>
        <button type="button" className="btn-secondary !px-3 !py-1.5 text-xs" onClick={collapse}>
          {t("collapseAll", lang)}
        </button>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            className="btn-secondary !px-2.5 !py-1.5 text-xs"
            onClick={() => setZoom((z) => Math.max(0.7, +(z - 0.1).toFixed(2)))}
            aria-label={t("zoomOut", lang)}
          >
            −
          </button>
          <span className="w-10 text-center text-xs text-ink/50">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            className="btn-secondary !px-2.5 !py-1.5 text-xs"
            onClick={() => setZoom((z) => Math.min(1.4, +(z + 0.1).toFixed(2)))}
            aria-label={t("zoomIn", lang)}
          >
            +
          </button>
        </div>
      </div>

      <div className="overflow-auto rounded-2xl border border-ink/10 bg-paper/70 p-4 dark:border-gold/20">
        <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }} className="min-w-[36rem] pb-4">
          <MindNode
            node={UNIVERSITY_STRUCTURE}
            lang={lang}
            depth={0}
            expanded={expanded}
            selected={selected}
            highlightPath={highlightPath}
            onToggle={toggle}
          />
        </div>
      </div>

      <aside className="paper-card mt-4 p-5">
        <div className="text-[10px] uppercase tracking-wide text-ink/40">
          {selectedNode.highlight ? t("yourFaculty", lang) : selectedNode.id}
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
      </aside>
    </div>
  );
}

function MindNode({
  node,
  lang,
  depth,
  expanded,
  selected,
  highlightPath,
  onToggle,
}: {
  node: StructureNode;
  lang: Lang;
  depth: number;
  expanded: Set<string>;
  selected: string;
  highlightPath: string[];
  onToggle: (id: string) => void;
}) {
  const hasKids = !!node.children?.length;
  const isOpen = expanded.has(node.id);
  const isSel = selected === node.id;
  const isHi = !!node.highlight || highlightPath.includes(node.id);

  return (
    <div className={depth === 0 ? "" : "ml-5 border-l border-gold/30 pl-4 dark:border-gold/20"}>
      <button
        type="button"
        onClick={() => onToggle(node.id)}
        className={`my-1 flex w-full items-start gap-2 rounded-xl border px-3 py-2 text-left text-sm transition ${
          node.highlight
            ? "border-gold bg-gold/15 shadow-sm dark:border-gold/50 dark:bg-gold/10"
            : isSel
              ? "border-plum/40 bg-plum/10 dark:border-gold/30 dark:bg-plum/15"
              : isHi
                ? "border-plum/25 bg-plum/[0.06] dark:border-plum/30"
                : "border-ink/10 bg-surface hover:bg-ink/[0.03] dark:border-ink/10"
        }`}
      >
        <span className="mt-0.5 w-4 shrink-0 font-mono text-xs text-ink/40">{hasKids ? (isOpen ? "▾" : "▸") : "·"}</span>
        <span>
          <span className="font-medium leading-snug">{lang === "bg" ? node.labelBg : node.labelEn}</span>
          {node.highlight && (
            <span className="ml-2 rounded-full bg-burgundy px-1.5 py-0.5 text-[10px] font-bold uppercase text-ivory">
              ФКНФ
            </span>
          )}
        </span>
      </button>
      {hasKids && isOpen && (
        <div>
          {node.children!.map((child) => (
            <MindNode
              key={child.id}
              node={child}
              lang={lang}
              depth={depth + 1}
              expanded={expanded}
              selected={selected}
              highlightPath={highlightPath}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
