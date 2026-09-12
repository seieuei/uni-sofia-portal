import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { ensureGeneratedDir } from "./docx";

function esc(s: string) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function p(text: string, opts: { bold?: boolean; center?: boolean; italic?: boolean; size?: number } = {}) {
  const sz = opts.size ?? 22;
  const jc = opts.center ? "<w:jc w:val=\"center\"/>" : "";
  const rpr = `<w:rPr>${opts.bold ? "<w:b/>" : ""}${opts.italic ? "<w:i/>" : ""}<w:sz w:val="${sz}"/></w:rPr>`;
  return `<w:p><w:pPr>${jc}</w:pPr><w:r>${rpr}<w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p>`;
}

const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

export type PortalField = { name?: string; label: string; value: string };

export type DocMethod = "placeholders" | "official+append" | "portal-pack";

function flattenValue(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "boolean") return v ? "да" : "не";
  if (Array.isArray(v)) {
    return v
      .map((row) => {
        if (row && typeof row === "object") {
          const o = row as Record<string, unknown>;
          return [o.lecturerName, o.activity, o.hours, o.rateEur].filter((x) => x != null && x !== "").join(" / ");
        }
        return String(row);
      })
      .filter(Boolean)
      .join("; ");
  }
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

export function generatePortalPackDocx(data: {
  catalogCode?: string | null;
  titleBg: string;
  caseNumber: string;
  preparedBy: string;
  faculty?: string;
  fields: PortalField[];
  templateNote?: string;
}): Buffer {
  const rows = data.fields
    .map(
      (f) =>
        `<w:tr>
          <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">${esc(f.label)}</w:t></w:r></w:p></w:tc>
          <w:tc><w:p><w:r><w:t xml:space="preserve">${esc(f.value)}</w:t></w:r></w:p></w:tc>
        </w:tr>`
    )
    .join("");

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${p("СОФИЙСКИ УНИВЕРСИТЕТ „СВ. КЛИМЕНТ ОХРИДСКИ“", { bold: true, center: true, size: 28 })}
    ${p(data.catalogCode ? `Образец ${data.catalogCode}` : "Преписка", { bold: true, center: true, size: 24 })}
    ${p(data.titleBg, { center: true, size: 22 })}
    ${p("")}
    ${p(`Номер на преписка: ${data.caseNumber}`)}
    ${p(`Факултет: ${data.faculty || "—"}`)}
    ${p(`Изготвил: ${data.preparedBy}`)}
    ${p(`Дата: ${new Date().toLocaleDateString("bg-BG")}`)}
    ${p("")}
    ${p("Данни от портала", { bold: true, size: 24 })}
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="9000" w:type="dxa"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="4" w:space="0" w:color="000000"/>
          <w:left w:val="single" w:sz="4" w:space="0" w:color="000000"/>
          <w:bottom w:val="single" w:sz="4" w:space="0" w:color="000000"/>
          <w:right w:val="single" w:sz="4" w:space="0" w:color="000000"/>
          <w:insideH w:val="single" w:sz="4" w:space="0" w:color="000000"/>
          <w:insideV w:val="single" w:sz="4" w:space="0" w:color="000000"/>
        </w:tblBorders>
      </w:tblPr>
      ${rows}
    </w:tbl>
    ${p("")}
    ${p(data.templateNote || "Официалният бланк не се променя. Точното позициониране по Word отметки ще се доуточни бланка по бланка (ROUTES.docx).", { italic: true, size: 18 })}
    <w:sectPr/>
  </w:body>
</w:document>`;

  const zip = new PizZip();
  zip.file("[Content_Types].xml", contentTypes);
  zip.file("_rels/.rels", rels);
  zip.file("word/document.xml", documentXml);
  return zip.generate({ type: "nodebuffer" });
}

/** Copy official DOCX and append a "Данни от портала" block before </w:body>. */
export function appendPortalDataToOfficialDocx(
  templateAbs: string,
  fields: PortalField[],
  header: { caseNumber: string; preparedBy: string }
): Buffer | null {
  try {
    const buf = fs.readFileSync(templateAbs);
    const zip = new PizZip(buf);
    const doc = zip.file("word/document.xml");
    if (!doc) return null;
    let xml = doc.asText();
    const extra = [
      p(""),
      p("—— Данни от портала ——", { bold: true, center: true }),
      p(`Преписка ${header.caseNumber} · ${header.preparedBy} · ${new Date().toLocaleDateString("bg-BG")}`),
      ...fields.map((f) => p(`${f.label}: ${f.value}`)),
      p("Точното позициониране по отметки ще се доуточни бланка по бланка.", { italic: true, size: 18 }),
    ].join("");
    if (!xml.includes("</w:body>")) return null;
    xml = xml.replace("</w:body>", `${extra}</w:body>`);
    zip.file("word/document.xml", xml);
    return zip.generate({ type: "nodebuffer" });
  } catch {
    return null;
  }
}

function hasPlaceholders(xml: string) {
  return /\{[A-Za-z][A-Za-z0-9_]*\}/.test(xml);
}

export function fillTemplatePlaceholders(
  templateAbs: string,
  data: Record<string, string>
): Buffer | null {
  try {
    const buf = fs.readFileSync(templateAbs);
    const zip = new PizZip(buf);
    const xml = zip.file("word/document.xml")?.asText() || "";
    if (!hasPlaceholders(xml)) return null;
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: { start: "{", end: "}" },
    });
    doc.render(data);
    return doc.getZip().generate({ type: "nodebuffer" }) as Buffer;
  } catch {
    return null;
  }
}

export function generateCaseDocument(opts: {
  process: {
    slug: string;
    titleBg: string;
    catalogCode: string | null;
    templatePath: string | null;
  };
  caseNumber: string;
  preparedBy: string;
  faculty?: string;
  fields: PortalField[];
  fieldMap?: Record<string, unknown>;
}): { buffer: Buffer; filename: string; method: DocMethod } {
  const safe = opts.caseNumber.replace(/[^a-zA-Z0-9-_]/g, "_");
  const filename = `${opts.process.slug}-${safe}.docx`;
  const note = opts.process.templatePath
    ? `Официален бланк: ${opts.process.templatePath}. Exact-slot mapping will deepen form-by-form (ROUTES.docx).`
    : "Няма изтеглен официален бланк на диска — генериран е портален пакет.";

  const data: Record<string, string> = {
    date: new Date().toLocaleDateString("bg-BG"),
    preparedBy: opts.preparedBy,
    caseNumber: opts.caseNumber,
    faculty: opts.faculty || flattenValue(opts.fieldMap?.faculty) || "",
    titleBg: opts.process.titleBg,
    catalogCode: opts.process.catalogCode || "",
  };
  if (opts.fieldMap) {
    for (const [k, v] of Object.entries(opts.fieldMap)) {
      data[k] = flattenValue(v);
    }
  }
  for (const f of opts.fields) {
    if (f.name) data[f.name] = f.value;
  }

  if (opts.process.templatePath && opts.process.slug !== "load-pay-5-2") {
    const abs = path.join(process.cwd(), opts.process.templatePath);
    if (fs.existsSync(abs) && abs.endsWith(".docx")) {
      const filled = fillTemplatePlaceholders(abs, data);
      if (filled) return { buffer: filled, filename, method: "placeholders" };
      const appended = appendPortalDataToOfficialDocx(abs, opts.fields, {
        caseNumber: opts.caseNumber,
        preparedBy: opts.preparedBy,
      });
      if (appended) return { buffer: appended, filename, method: "official+append" };
    }
  }

  return {
    buffer: generatePortalPackDocx({
      catalogCode: opts.process.catalogCode,
      titleBg: opts.process.titleBg,
      caseNumber: opts.caseNumber,
      preparedBy: opts.preparedBy,
      faculty: opts.faculty,
      fields: opts.fields,
      templateNote: note,
    }),
    filename,
    method: "portal-pack",
  };
}

export function writeGenerated(filename: string, buffer: Buffer) {
  const dir = ensureGeneratedDir();
  const abs = path.join(dir, filename);
  fs.writeFileSync(abs, buffer);
  return { abs, rel: `generated/${filename}` };
}
