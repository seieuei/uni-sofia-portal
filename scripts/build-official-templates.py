#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate structural official-looking DOCX blanks for every catalog process.

These are NOT the legacy Word files. When a real Drive download lands at the
same path it wins. Placeholders ({fullName}, {faculty}, …) enable docxtemplater
until per-blank bookmark mapping (ROUTES.docx) is done form-by-form.
"""
import json, os, re, zipfile
from io import BytesIO
from pathlib import Path

ROOT = Path("/workspace/uni-sofia-portal")
CATALOG_TS = ROOT / "src/lib/catalog.ts"

CONTENT_TYPES = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>"""

RELS = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>"""


def esc(s: str) -> str:
    return (
        str(s or "")
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def p(text: str, bold=False, center=False, italic=False, size=22) -> str:
    jc = '<w:jc w:val="center"/>' if center else ""
    rpr = f'<w:rPr>{"<w:b/>" if bold else ""}{"<w:i/>" if italic else ""}<w:sz w:val="{size}"/></w:rPr>'
    return f'<w:p><w:pPr>{jc}</w:pPr><w:r>{rpr}<w:t xml:space="preserve">{esc(text)}</w:t></w:r></w:p>'


def parse_catalog():
    text = CATALOG_TS.read_text(encoding="utf-8")
    body = text.split("export const CATALOG")[1].split("export const HANDBOOK")[0]
    items = []
    for m in re.finditer(r"\{\s*slug: \"([^\"]+)\"[\s\S]*?\n  \},", body):
        block = m.group(0)
        def g(key, default=""):
            mm = re.search(rf'{key}: ("(?:\\.|[^"\\])*"|null)', block)
            if not mm:
                return default
            raw = mm.group(1)
            if raw == "null":
                return None
            return json.loads(raw)
        items.append({
            "slug": g("slug"),
            "catalogCode": g("catalogCode"),
            "hub": g("hub"),
            "titleBg": g("titleBg"),
            "titleEn": g("titleEn"),
            "driveFileId": g("driveFileId"),
            "sourceFolder": g("sourceFolder"),
            "originalTitle": g("originalTitle"),
            "templateRel": g("templateRel"),
            "nomenclatura": g("nomenclatura"),
        })
    return items


COMMON_SLOTS = [
    ("fullName", "Име и фамилия"),
    ("egn", "ЕГН / ЛНЧ"),
    ("faculty", "Факултет"),
    ("department", "Катедра / програма"),
    ("position", "Длъжност"),
    ("studentId", "Факултетен номер"),
    ("specialty", "Специалност"),
    ("year", "Курс / година"),
    ("dateFrom", "От дата"),
    ("dateTo", "До дата"),
    ("period", "Период"),
    ("program", "Програма"),
    ("fundingSource", "Източник на средства"),
    ("amount", "Сума"),
    ("iban", "IBAN"),
    ("counterparty", "Контрагент"),
    ("addressee", "Адресат"),
    ("subject", "Относно"),
    ("grounds", "Основание / мотиви"),
    ("body", "Текст"),
]


def make_docx(item) -> bytes:
    code = item["catalogCode"] or "—"
    slots = "\n".join(p(f"{label}: {{{name}}}") for name, label in COMMON_SLOTS)
    xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    {p("СОФИЙСКИ УНИВЕРСИТЕТ „СВ. КЛИМЕНТ ОХРИДСКИ“", bold=True, center=True, size=28)}
    {p(f"Образец {code}", bold=True, center=True, size=24)}
    {p(item["titleBg"] or "", center=True, size=22)}
    {p("")}
    {p(f"Номенклатура: {item.get('nomenclatura') or '—'}  ·  Drive: {item.get('driveFileId') or '—'}", italic=True, size=16)}
    {p(f"Оригинален файл: {item.get('originalTitle') or ''}", italic=True, size=16)}
    {p("")}
    {p("Полета (попълват се от портала)", bold=True, size=24)}
    {slots}
    {p("")}
    {p("Дата: {date}    Изготвил: {preparedBy}    Преписка: {caseNumber}", italic=True, size=18)}
    {p("")}
    {p("Официалният бланк не се променя. Този структурен DOCX носи общите слотове докато ROUTES.docx се картографира бланка по бланка. Ако в templates/official/ лежи изтегленият Drive файл, порталът го копира и добавя секция „Данни от портала“.", italic=True, size=16)}
    <w:sectPr/>
  </w:body>
</w:document>"""
    buf = BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", CONTENT_TYPES)
        z.writestr("_rels/.rels", RELS)
        z.writestr("word/document.xml", xml)
    return buf.getvalue()


def dest_for(item) -> Path:
    rel = item.get("templateRel")
    if not rel:
        folder = (item.get("sourceFolder") or "other").replace(" ", "-")
        return ROOT / "templates" / "official" / folder / f"{item['slug']}.docx"
    p = ROOT / rel
    # always emit a .docx sibling so generation works even for .doc/.pdf/.xlsx
    if p.suffix.lower() != ".docx":
        p = p.with_suffix(".docx")
    return p


def main():
    items = parse_catalog()
    written = 0
    skipped_official = 0
    manifest = []
    for item in items:
        dest = dest_for(item)
        dest.parent.mkdir(parents=True, exist_ok=True)
        official = dest
        # do not overwrite a real Drive download (PK zip that is larger / already present and marked)
        marker = dest.with_suffix(dest.suffix + ".from-drive")
        if dest.exists() and marker.exists():
            skipped_official += 1
            manifest.append({**item, "path": str(dest.relative_to(ROOT)), "source": "drive"})
            continue
        dest.write_bytes(make_docx(item))
        written += 1
        manifest.append({**item, "path": str(dest.relative_to(ROOT)), "source": "structural"})
    man_path = ROOT / "templates" / "official" / "MANIFEST.json"
    man_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {written} structural templates, kept {skipped_official} drive downloads, total {len(items)}")
    print(f"manifest {man_path}")


if __name__ == "__main__":
    main()
