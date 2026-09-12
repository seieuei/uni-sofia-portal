import fs from "fs";
import path from "path";
import type { PrismaClient } from "@prisma/client";
import { CATALOG, HANDBOOK, fieldsFor, routeFor } from "../src/lib/catalog";

function templateExists(rel: string | null): string | null {
  if (!rel) return null;
  const abs = path.join(process.cwd(), rel);
  if (fs.existsSync(abs)) return rel;
  // structural / converted sibling: .doc/.pdf/.xlsx → .docx
  const sibling = rel.replace(/\.(doc|pdf|xlsx|xls)$/i, ".docx");
  if (sibling !== rel && fs.existsSync(path.join(process.cwd(), sibling))) return sibling;
  if (rel.endsWith(".doc")) {
    const docx = rel + "x";
    if (fs.existsSync(path.join(process.cwd(), docx))) return docx;
  }
  return rel; // keep pointer even if not downloaded yet
}

export async function seedProcesses(prisma: PrismaClient) {
  let created = 0;
  for (const p of CATALOG) {
    let templatePath = templateExists(p.templateRel);
    if (p.slug === "load-pay-5-2") {
      const wizard = "templates/official/5.2-honorary.docx";
      if (fs.existsSync(path.join(process.cwd(), wizard))) templatePath = wizard;
    }
    await prisma.processDefinition.create({
      data: {
        slug: p.slug,
        titleBg: p.titleBg,
        titleEn: p.titleEn,
        descriptionBg: p.descriptionBg,
        descriptionEn: p.descriptionEn,
        rolesAllowed: p.rolesAllowed,
        templatePath,
        catalogCode: p.catalogCode,
        hub: p.hub,
        family: p.family,
        wizardKind: p.wizardKind,
        fieldsJson: JSON.stringify(fieldsFor(p)),
        routeJson: JSON.stringify(routeFor(p)),
        driveFileId: p.driveFileId,
        sourceFolder: p.sourceFolder,
        nomenclatura: p.nomenclatura,
        active: true,
      },
    });
    created += 1;
  }

  let hb = 0;
  for (let i = 0; i < HANDBOOK.length; i++) {
    const h = HANDBOOK[i];
    const rel = `templates/official/handbook/${h.slug}`;
    const candidates = [rel, `${rel}.pdf`, `${rel}.docx`, `${rel}.xlsx`];
    const found = candidates.find((c) => fs.existsSync(path.join(process.cwd(), c))) ?? null;
    await prisma.handbookEntry.create({
      data: {
        slug: h.slug,
        titleBg: h.titleBg,
        titleEn: h.titleEn,
        summaryBg: h.summaryBg,
        summaryEn: h.summaryEn,
        kind: h.kind,
        driveFileId: h.driveFileId,
        path: found,
        sortOrder: i,
      },
    });
    hb += 1;
  }

  const withTpl = CATALOG.filter((p) => {
    const rel = p.slug === "load-pay-5-2" ? "templates/official/5.2-honorary.docx" : p.templateRel;
    return Boolean(templateExists(rel) && fs.existsSync(path.join(process.cwd(), templateExists(rel)!)));
  }).length;

  console.log(`Seeded ${created} process definitions, ${hb} handbook entries (${withTpl} templates on disk).`);
  return { created, handbook: hb, withTpl };
}
