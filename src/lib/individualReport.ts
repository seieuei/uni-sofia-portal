import PizZip from "pizzip";
import type { IndividualReportData, ReportRow } from "./reportTypes";

export type { IndividualReportData, ReportRow } from "./reportTypes";

function esc(s: string) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function p(text: string, opts: { bold?: boolean; center?: boolean; italic?: boolean; size?: number } = {}) {
  const sz = opts.size ?? 22;
  const jc = opts.center ? '<w:jc w:val="center"/>' : "";
  const rpr = `<w:rPr>${opts.bold ? "<w:b/>" : ""}${opts.italic ? "<w:i/>" : ""}<w:sz w:val="${sz}"/></w:rPr>`;
  return `<w:p><w:pPr>${jc}</w:pPr><w:r>${rpr}<w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p>`;
}

function tc(text: string, opts: { bold?: boolean; width?: number } = {}) {
  const w = opts.width ? `<w:tcW w:w="${opts.width}" w:type="dxa"/>` : "";
  const rpr = opts.bold ? "<w:rPr><w:b/><w:sz w:val=\"16\"/></w:rPr>" : '<w:rPr><w:sz w:val="16"/></w:rPr>';
  return `<w:tc><w:tcPr>${w}</w:tcPr><w:p><w:r>${rpr}<w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p></w:tc>`;
}

const HEADERS = [
  "Дисциплина",
  "Специалност",
  "Факултет",
  "Вид",
  "Курс",
  "Форма",
  "Студенти",
  "Лекции",
  "Упражнения",
  "Език",
  "Оценяване",
  "Титуляр",
  "Асистент",
  "Изпитани",
  "Текущо",
  "Курсови",
];

function table(rows: ReportRow[]) {
  const header = `<w:tr>${HEADERS.map((h) => tc(h, { bold: true })).join("")}</w:tr>`;
  const body =
    rows.length === 0
      ? `<w:tr>${HEADERS.map(() => tc("—")).join("")}</w:tr>`
      : rows
          .map(
            (r) => `<w:tr>${[
              r.discipline,
              r.specialty,
              r.faculty,
              r.kind,
              r.year,
              r.form,
              String(r.studentCount),
              String(r.lectureHours),
              String(r.exerciseHours),
              r.language,
              r.assessment,
              r.titular,
              r.assistant || "—",
              String(r.examined),
              String(r.currentAssessed),
              String(r.courseworks),
            ]
              .map((c) => tc(c))
              .join("")}</w:tr>`
          )
          .join("");

  return `<w:tbl>
    <w:tblPr>
      <w:tblW w:w="15000" w:type="dxa"/>
      <w:tblBorders>
        <w:top w:val="single" w:sz="4" w:space="0" w:color="000000"/>
        <w:left w:val="single" w:sz="4" w:space="0" w:color="000000"/>
        <w:bottom w:val="single" w:sz="4" w:space="0" w:color="000000"/>
        <w:right w:val="single" w:sz="4" w:space="0" w:color="000000"/>
        <w:insideH w:val="single" w:sz="4" w:space="0" w:color="000000"/>
        <w:insideV w:val="single" w:sz="4" w:space="0" w:color="000000"/>
      </w:tblBorders>
    </w:tblPr>
    ${header}${body}
  </w:tbl>`;
}

function totals(rows: ReportRow[]) {
  const lect = rows.reduce((s, r) => s + r.lectureHours, 0);
  const ex = rows.reduce((s, r) => s + r.exerciseHours, 0);
  return { lect, ex, all: lect + ex };
}

export function generateIndividualReportDocx(data: IndividualReportData): Buffer {
  const w = totals(data.winter);
  const s = totals(data.summer);

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

  const landscape = `<w:sectPr>
    <w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/>
    <w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720"/>
  </w:sectPr>`;

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${p("СОФИЙСКИ УНИВЕРСИТЕТ „СВ. КЛИМЕНТ ОХРИДСКИ“", { bold: true, center: true, size: 28 })}
    ${p("Факултет по класически и нови филологии", { center: true, size: 22 })}
    ${p("ИНДИВИДУАЛЕН ОТЧЕТ", { bold: true, center: true, size: 32 })}
    ${p(`за учебната ${data.academicYear} година`, { center: true, size: 24 })}
    ${p("")}
    ${p(`Преподавател: ${data.lecturerName}`)}
    ${p(`Имейл: ${data.lecturerEmail}`)}
    ${p(`Факултет: ${data.faculty}`)}
    ${p(`Катедра / програма: ${data.department}`)}
    ${p(`Генерирано: ${data.generatedAt}`)}
    ${p("")}
    ${p("Зимен семестър", { bold: true, size: 24 })}
    ${table(data.winter)}
    ${p(`Общо часове зимен: лекции ${w.lect} · упражнения ${w.ex} · всичко ${w.all}`)}
    ${p("")}
    ${p("Летен семестър", { bold: true, size: 24 })}
    ${table(data.summer)}
    ${p(`Общо часове летен: лекции ${s.lect} · упражнения ${s.ex} · всичко ${s.all}`)}
    ${p("")}
    ${p(data.note, { italic: true, size: 18 })}
    ${landscape}
  </w:body>
</w:document>`;

  const zip = new PizZip();
  zip.file("[Content_Types].xml", contentTypes);
  zip.file("_rels/.rels", rels);
  zip.file("word/document.xml", documentXml);
  return zip.generate({ type: "nodebuffer" });
}

export function assessmentLabel(form: string | null | undefined, grading: string, lang: "bg" | "en"): string {
  const key = form || grading;
  const map: Record<string, { bg: string; en: string }> = {
    exam: { bg: "изпит", en: "exam" },
    e: { bg: "изпит", en: "exam" },
    current: { bg: "текуща оценка", en: "current assessment" },
    ca: { bg: "текуща оценка", en: "current assessment" },
    mixed: { bg: "смесена (дискусии / тест / изпит)", en: "mixed (discussions / test / exam)" },
  };
  return map[key]?.[lang] ?? key;
}
