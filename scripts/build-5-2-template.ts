/**
 * Builds a structural Obrazec 5.2 DOCX with docxtemplater placeholders.
 * Not pixel-identical to the official Drive blank (12PFiP5OBClZNDKxqG_GHHgsbGUcYlZi8).
 */
import fs from "fs";
import path from "path";
import PizZip from "pizzip";

const out = path.join(__dirname, "..", "templates", "official", "5.2-honorary.docx");

const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:t>СОФИЙСКИ УНИВЕРСИТЕТ „СВ. КЛИМЕНТ ОХРИДСКИ“</w:t></w:r></w:p>
    <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>Образец 5.2 — Натовареност / хонорари (хонорувани преподаватели)</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:t>Факултет: {faculty}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Програма / специалност: {program}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Период: {period}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Източник на финансиране: {funding}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Номер на преписка: {caseNumber}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Дата: {date}</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Таблица натовареност</w:t></w:r></w:p>
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
      <w:tr>
        <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Преподавател</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Дейност</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Часове</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Ставка EUR</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Сума EUR</w:t></w:r></w:p></w:tc>
      </w:tr>
      {#lines}
      <w:tr>
        <w:tc><w:p><w:r><w:t>{lecturerName}</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>{activity}</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>{hours}</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>{rateEur}</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>{amountEur}</w:t></w:r></w:p></w:tc>
      </w:tr>
      {/lines}
    </w:tbl>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Общо: {total} EUR</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:t>Изготвил: {preparedBy}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Статус: {status}</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:i/><w:sz w:val="18"/></w:rPr><w:t>Структурен демо шаблон (Phase A). Не претендира за пикселова идентичност с официалния бланк.</w:t></w:r></w:p>
    <w:sectPr/>
  </w:body>
</w:document>`;

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

const zip = new PizZip();
zip.file("[Content_Types].xml", contentTypes);
zip.file("_rels/.rels", rels);
zip.file("word/document.xml", documentXml);

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, zip.generate({ type: "nodebuffer" }));
console.log("Wrote", out);
