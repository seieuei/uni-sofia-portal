import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { LOAD_ACTIVITY_RATES } from "./rates";

export type DocxLine = {
  lecturerName: string;
  activity: string;
  hours: number;
  rateEur: number;
  amountEur: number;
};

export function generateLoadPayDocx(data: {
  faculty: string;
  program: string;
  period: string;
  funding: string;
  caseNumber: string;
  preparedBy: string;
  status: string;
  total: number;
  lines: DocxLine[];
}): Buffer {
  const templatePath = path.join(process.cwd(), "templates", "official", "5.2-honorary.docx");
  const content = fs.readFileSync(templatePath);
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: { start: "{", end: "}" },
  });

  const lines = data.lines.map((l) => ({
    lecturerName: l.lecturerName,
    activity: LOAD_ACTIVITY_RATES[l.activity]?.labelBg || l.activity,
    hours: String(l.hours),
    rateEur: l.rateEur.toFixed(2),
    amountEur: l.amountEur.toFixed(2),
  }));

  doc.render({
    faculty: data.faculty,
    program: data.program,
    period: data.period,
    funding: data.funding,
    caseNumber: data.caseNumber,
    date: new Date().toLocaleDateString("bg-BG"),
    preparedBy: data.preparedBy,
    status: data.status,
    total: data.total.toFixed(2),
    lines,
  });

  return doc.getZip().generate({ type: "nodebuffer" });
}

export function ensureGeneratedDir() {
  const dir = path.join(process.cwd(), "generated");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
