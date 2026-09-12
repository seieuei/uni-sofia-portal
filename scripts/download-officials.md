# Downloading official Drive blanks

Account / MCP: `user-Google-drive--african-studies-fcml-uni-sofia-bg`
Root folder: `1oqy9H2eImjpSzWiG7ONDTJayB04S4MEK`
Inventory: `/workspace/su-forms/drive_inventory.csv`

Tool: `download_file_content` → `{ id, title, mimeType, content }` (base64).

Save:

```bash
python3 scripts/save_b64.py templates/official/{folder}/{slug}.docx /tmp/file.b64
touch templates/official/{folder}/{slug}.docx.from-drive
```

Skip huge knowledge PDFs (most-used, Nomenklatura, instructions) — Handbook only.
Convert `.doc` with LibreOffice when available:

```bash
soffice --headless --convert-to docx --outdir templates/official/{folder} file.doc
```

`scripts/build-official-templates.py` will not overwrite a path that has a `.from-drive` marker.
