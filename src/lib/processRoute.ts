/** Official SU post-sign copy packs and route construction (Приложение №1 + деловодна инструкция). */

export type RoutePhase = "approve" | "register" | "copies";

export type RouteStepDef = {
  key: string;
  titleBg: string;
  titleEn: string;
  phase?: RoutePhase;
  recipients?: string[];
  noteBg?: string;
  noteEn?: string;
};

/** Minimal process shape so this module does not import the generated catalog. */
export type RouteableProcess = {
  catalogCode: string | null;
  hub: string;
  family: string;
  hasPayment: boolean;
  hasLegal: boolean;
};

/** Canonical Bulgarian recipient labels from the official catalog. */
export const R = {
  lsto: "ЛСТО",
  faculty: "Факултет",
  person: "Лицето",
  cashier: "Каса",
  od: "Образователни дейности",
  facultyStudents: "Факултет — Студенти",
  odEnrol: "Образователни дейности (записване)",
  phdOffice: "Докторанти",
  finance: "Финансова политика",
  doctoralStudent: "Докторант",
  jury: "Членове на журито",
  initiator: "Инициатор",
  initiatorSelf: "Инициатор (за себе си)",
  initiatorContractor: "Инициатор (за контрагента)",
  cashierAfterProtocol: "Каса (след приемо-предавателен протокол)",
  chiefAccountant: "Главен счетоводител",
  addressee: "Адресат",
  file: "Към дело / архив",
  registry: "Деловодство",
  legal: "Правен отдел",
} as const;

export const RECIPIENT_EN: Record<string, string> = {
  [R.lsto]: "LSTO (HR)",
  [R.faculty]: "Faculty",
  [R.person]: "The person",
  [R.cashier]: "Cash desk",
  [R.od]: "Education department",
  [R.facultyStudents]: "Faculty — Students office",
  [R.odEnrol]: "Education department (enrolment)",
  [R.phdOffice]: "Doctoral office",
  [R.finance]: "Finance policy",
  [R.doctoralStudent]: "Doctoral student",
  [R.jury]: "Jury members",
  [R.initiator]: "Initiator",
  [R.initiatorSelf]: "Initiator (own copy)",
  [R.initiatorContractor]: "Initiator (for the contractor)",
  [R.cashierAfterProtocol]: "Cash desk (after handover protocol)",
  [R.chiefAccountant]: "Chief accountant",
  [R.addressee]: "Addressee",
  [R.file]: "File / archive",
  [R.registry]: "Registry",
  [R.legal]: "Legal office",
};

export function recipientLabel(name: string, lang: "bg" | "en"): string {
  if (lang === "en") return RECIPIENT_EN[name] || name;
  return name;
}

function uniq(items: string[]): string[] {
  return [...new Set(items.filter(Boolean))];
}

function domainOffice(p: RouteableProcess): string {
  switch (p.hub) {
    case "training":
      return R.od;
    case "phd":
      return R.phdOffice;
    case "career":
    case "mywork":
      return R.lsto;
    case "load":
    case "contracts":
      return R.finance;
    case "letters":
      return R.registry;
    default:
      return R.registry;
  }
}

function isCode(code: string | null, ...exact: string[]): boolean {
  return Boolean(code && exact.includes(code));
}

function isCodeFamily(code: string | null, prefix: string): boolean {
  if (!code) return false;
  if (code === prefix) return true;
  if (code.startsWith(`${prefix}.`)) return true;
  return code.startsWith(prefix) && /^[A-Z]/.test(code.slice(prefix.length));
}

function isContestCopyFamily(code: string | null): boolean {
  if (!code) return false;
  if (["2.5.2", "2.5.3", "2.6.3", "2.6.4"].includes(code)) return false;
  if (["2.2", "2.3", "2.4", "2.5", "2.6"].includes(code)) return true;
  if (["2.5.1", "2.6.1", "2.6.2"].includes(code)) return true;
  return false;
}

/** Official post-извеждане recipients for a catalog process. Never empty. */
export function copyPackFor(p: RouteableProcess): string[] {
  const code = p.catalogCode;

  if (isCode(code, "2.9", "2.10", "2.11")) {
    return [R.lsto, R.faculty, R.person, R.cashier];
  }

  if (isContestCopyFamily(code)) {
    return [R.faculty, R.lsto];
  }

  if (isCode(code, "3.3", "3.5", "3.4")) {
    return [R.od, R.facultyStudents];
  }

  if (code === "3.2") {
    return [R.odEnrol];
  }

  if (code === "4.1") {
    return [R.faculty, R.phdOffice, R.finance, R.doctoralStudent];
  }

  if (isCodeFamily(code, "4.3")) {
    return [R.faculty, R.jury, R.phdOffice];
  }

  if (isCode(code, "4.6", "4.7", "4.8")) {
    return [R.initiator, R.phdOffice, R.finance, R.cashier];
  }

  if (isCodeFamily(code, "4.4") || code === "5.1") {
    return [R.initiatorSelf, R.initiatorContractor, R.finance, R.cashierAfterProtocol];
  }

  if (code === "5.2") {
    return [R.cashier];
  }

  if (code === "5.5") {
    return [R.faculty, R.od, R.finance, R.chiefAccountant];
  }

  if (isCode(code, "5.6", "5.6A")) {
    return [R.faculty, R.od, R.cashier];
  }

  if (isCodeFamily(code, "5.4")) {
    return [R.initiator, R.finance, R.cashier];
  }

  if (p.family === "leave") {
    return [R.lsto, R.faculty, R.person, R.cashier];
  }

  if (p.family === "letter") {
    return [R.addressee, R.file];
  }

  if (p.family === "declaration") {
    const pack = [R.initiator, domainOffice(p)];
    if (p.hasPayment) pack.push(R.finance, R.cashier);
    return uniq(pack);
  }

  if (p.family === "hire") {
    return [R.lsto, R.faculty, R.person];
  }

  if (p.family === "contest") {
    return [R.faculty, R.lsto];
  }

  if (p.family === "phd") {
    const pack = [R.faculty, R.phdOffice];
    if (p.hasPayment) pack.push(R.finance, R.cashier);
    return uniq(pack);
  }

  if (p.family === "petition") {
    const pack = [R.od, R.facultyStudents];
    if (p.hasPayment) pack.push(R.finance, R.cashier);
    return uniq(pack);
  }

  // Default for other money / legal acts: initiator · domain · finance · каса as appropriate.
  const pack = [R.initiator, domainOffice(p)];
  if (p.hasPayment || p.family === "pay" || p.family === "contract" || p.family === "load") {
    pack.push(R.finance);
    if (p.hasPayment || p.family === "pay" || p.family === "load") pack.push(R.cashier);
  } else if (p.hasLegal) {
    pack.push(R.legal);
  }
  return uniq(pack);
}

function step(
  key: string,
  titleBg: string,
  titleEn: string,
  phase: RoutePhase = "approve",
  extra: Partial<RouteStepDef> = {}
): RouteStepDef {
  return { key, titleBg, titleEn, phase, ...extra };
}

const IZVEJANE_NOTE_BG =
  "Деловодството регистрира в Архимед, издава изходящ номер и полага печат — само ако актът е подписан от Ректор / упълномощен зам.-ректор / декан (и има печат).";
const IZVEJANE_NOTE_EN =
  "Registry records the act in Arhimed, issues an outgoing number, and stamps it — only if signed by the Rector / an empowered vice-rector / dean (and a stamp applies).";

function postSignSteps(p: RouteableProcess): RouteStepDef[] {
  const recipients = copyPackFor(p);
  return [
    step("izvejdane", "Извеждане — Деловодство", "Outgoing register — Registry", "register", {
      noteBg: IZVEJANE_NOTE_BG,
      noteEn: IZVEJANE_NOTE_EN,
    }),
    step(
      "archive",
      "Архивен екземпляр (Изготвил + Съгласували)",
      "Archive copy (drafted by + approvers)",
      "register",
      {
        noteBg: "В архива остава екземплярът с „Изготвил“ и всички съгласували.",
        noteEn: "The file keeps the copy that bears “Drafted by” and every approver.",
      }
    ),
    step("copies", "Копия след извеждане", "Copies after outgoing register", "copies", { recipients }),
  ];
}

/**
 * Pre-sign route (domain / Legal / PFC / vice-rector / Rector) plus official post-sign
 * извеждане and catalog copy pack. Honorary 5.2 uses Dean → Registry → PFC → Rector (no Legal).
 */
export function routeFor(p: RouteableProcess): RouteStepDef[] {
  if (p.catalogCode === "5.2") {
    return [
      step("initiator", "Инициатор / изготвяне", "Initiator / draft"),
      step("dean", "Декан", "Dean"),
      step("registry", "Деловодство", "Registry"),
      step("pfc", "Предварителен финансов контрол", "Ex-ante financial control (PFC)"),
      step("rector", "Ректор / упълномощен зам.-ректор", "Rector / empowered vice-rector"),
      ...postSignSteps(p),
    ];
  }

  const steps: RouteStepDef[] = [
    step("initiator", "Инициатор / изготвяне", "Initiator / draft"),
    step("registry", "Деловодство (завеждане)", "Registry (intake)"),
  ];

  if (p.hub === "training") {
    steps.push(step("domain", "Инспектор Студенти / Образователни дейности", "Student inspector / Education dept."));
    steps.push(step("dean", "Декан — мнение", "Dean opinion"));
  } else if (p.hub === "phd") {
    steps.push(step("domain", "Сектор Докторанти", "Doctoral office"));
  } else if (p.hub === "career" || p.hub === "mywork") {
    steps.push(step("domain", "ЛСТО / Човешки ресурси", "HR / LSTO"));
  } else if (p.hub === "load" || p.hub === "contracts") {
    steps.push(step("domain", "Финансова политика / програмен админ", "Finance policy / program admin"));
  } else if (p.hub === "letters") {
    if (p.catalogCode === "9.4") {
      steps.push(
        step("archive", "Към дело / архив", "File / archive", "register", {
          noteBg: "Докладната се прилага към делото. Архивен екземпляр = Изготвил + съгласували.",
          noteEn: "The memo is filed. Archive copy = drafted by + approvers.",
        })
      );
      steps.push(
        step("copies", "Копия след извеждане", "Copies after outgoing register", "copies", {
          recipients: copyPackFor(p),
        })
      );
      return steps;
    }
    steps.push(step("vice_rector", "Ресорен зам.-ректор", "Vice-rector"));
  }

  if (p.hasLegal) {
    steps.push(step("legal", "Правен отдел / юрисконсулт", "Legal / counsel"));
  }
  if (p.hasPayment) {
    steps.push(step("pfc", "Предварителен финансов контрол", "Ex-ante financial control (PFC)"));
  }
  if (p.catalogCode !== "4.2") {
    steps.push(step("rector", "Ректор / упълномощен зам.-ректор", "Rector / empowered vice-rector"));
  } else {
    steps.push(step("vice_rector", "Зам.-ректор (без пълен ректорски кръг)", "Vice-rector (no full Rector chain)"));
  }

  steps.push(...postSignSteps(p));
  return steps;
}

export function parseRouteJson(raw: string | null | undefined): RouteStepDef[] {
  try {
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? (parsed as RouteStepDef[]) : [];
  } catch {
    return [];
  }
}

export function routeStepPayload(s: RouteStepDef): string {
  return JSON.stringify({
    phase: s.phase ?? "approve",
    recipients: s.recipients ?? [],
    noteBg: s.noteBg,
    noteEn: s.noteEn,
  });
}

export type CaseStepLike = {
  id?: string;
  key: string;
  titleBg: string;
  titleEn: string;
  status: string;
  assigneeId?: string | null;
  assignee?: { id: string; name: string; email: string } | null;
  payloadJson?: string | null;
  sortOrder?: number;
};

export type DisplayRouteStep = CaseStepLike & {
  phase: RoutePhase;
  recipients: string[];
  noteBg?: string;
  noteEn?: string;
  virtual?: boolean;
};

function parseStepPayload(payloadJson?: string | null): Partial<RouteStepDef> {
  try {
    const p = JSON.parse(payloadJson || "{}") as Partial<RouteStepDef>;
    return p && typeof p === "object" ? p : {};
  } catch {
    return {};
  }
}

export function inferPhase(key: string): RoutePhase {
  if (key === "copies") return "copies";
  if (key === "archive" || key === "izvejdane") return "register";
  return "approve";
}

function toDisplay(def: RouteStepDef, archived: boolean, sortOrder: number): DisplayRouteStep {
  return {
    id: `virtual-${def.key}`,
    key: def.key,
    titleBg: def.titleBg,
    titleEn: def.titleEn,
    status: archived ? "done" : "pending",
    phase: def.phase ?? inferPhase(def.key),
    recipients: def.recipients ?? [],
    noteBg: def.noteBg,
    noteEn: def.noteEn,
    virtual: true,
    sortOrder,
  };
}

/** Merge persisted case steps with the process definition so old cases still show copy packs. */
export function mergeCaseRoute(
  caseSteps: CaseStepLike[],
  route: RouteStepDef[],
  caseStatus?: string
): DisplayRouteStep[] {
  const byKey = new Map(route.map((s) => [s.key, s]));
  const seen = new Set<string>();
  const archived = caseStatus === "archived";

  const out: DisplayRouteStep[] = caseSteps.map((s) => {
    seen.add(s.key);
    const def = byKey.get(s.key);
    const payload = parseStepPayload(s.payloadJson);
    const phase = payload.phase || def?.phase || inferPhase(s.key);
    const recipients = (payload.recipients && payload.recipients.length ? payload.recipients : def?.recipients) || [];
    let status = s.status;
    if (archived && (phase === "register" || phase === "copies" || s.key === "rector" || s.key === "vice_rector")) {
      status = "done";
    }
    return {
      ...s,
      phase,
      recipients,
      noteBg: payload.noteBg || def?.noteBg,
      noteEn: payload.noteEn || def?.noteEn,
      status,
    };
  });

  const extras = route.filter((d) => !seen.has(d.key) && (d.phase === "register" || d.phase === "copies"));
  const registerExtras = extras.filter((d) => d.phase === "register");
  const copyExtras = extras.filter((d) => d.phase === "copies");

  const archiveIdx = out.findIndex((s) => s.key === "archive");
  if (registerExtras.length) {
    const mapped = registerExtras.map((d, i) => toDisplay(d, archived, 800 + i));
    if (archiveIdx >= 0) out.splice(archiveIdx, 0, ...mapped);
    else out.push(...mapped);
  }
  out.push(...copyExtras.map((d, i) => toDisplay(d, archived, 900 + i)));
  return out;
}
