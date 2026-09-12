import { CATALOG, routeFor, copyPackFor } from "../src/lib/catalog";

const expected: Record<string, string[]> = {
  "2.9": ["ЛСТО", "Факултет", "Лицето", "Каса"],
  "2.10": ["ЛСТО", "Факултет", "Лицето", "Каса"],
  "2.11": ["ЛСТО", "Факултет", "Лицето", "Каса"],
  "2.2": ["Факултет", "ЛСТО"],
  "2.5": ["Факултет", "ЛСТО"],
  "2.6": ["Факултет", "ЛСТО"],
  "3.2": ["Образователни дейности (записване)"],
  "3.3": ["Образователни дейности", "Факултет — Студенти"],
  "3.5": ["Образователни дейности", "Факултет — Студенти"],
  "4.1": ["Факултет", "Докторанти", "Финансова политика", "Докторант"],
  "4.3A": ["Факултет", "Членове на журито", "Докторанти"],
  "4.6": ["Инициатор", "Докторанти", "Финансова политика", "Каса"],
  "4.4A": ["Инициатор (за себе си)", "Инициатор (за контрагента)", "Финансова политика", "Каса (след приемо-предавателен протокол)"],
  "5.1": ["Инициатор (за себе си)", "Инициатор (за контрагента)", "Финансова политика", "Каса (след приемо-предавателен протокол)"],
  "5.2": ["Каса"],
  "5.5": ["Факултет", "Образователни дейности", "Финансова политика", "Главен счетоводител"],
  "5.6": ["Факултет", "Образователни дейности", "Каса"],
  "5.4A": ["Инициатор", "Финансова политика", "Каса"],
};

let failed = 0;
for (const p of CATALOG) {
  const route = routeFor(p);
  const copies = route.find((s) => s.phase === "copies" || s.key === "copies");
  const pack = copyPackFor(p);
  if (!copies || !copies.recipients?.length) {
    console.error(`NO COPIES STEP: ${p.catalogCode} ${p.slug}`);
    failed += 1;
    continue;
  }
  if (copies.recipients.join("|") !== pack.join("|")) {
    console.error(`STEP/PACK MISMATCH: ${p.catalogCode}`, copies.recipients, pack);
    failed += 1;
  }
  if (p.catalogCode === "5.2") {
    const keys = route.map((s) => s.key);
    if (keys.includes("legal")) {
      console.error("5.2 must not include Legal");
      failed += 1;
    }
    if (!keys.includes("dean") || !keys.includes("pfc") || !keys.includes("rector")) {
      console.error("5.2 missing Dean / PFC / Rector", keys);
      failed += 1;
    }
  }
  const afterSign = ["izvejdane", "archive", "copies"].some((k) =>
    p.catalogCode === "9.4" ? route.some((s) => s.key === "copies") : route.some((s) => s.key === k)
  );
  if (!afterSign) {
    console.error(`NO POST-SIGN: ${p.catalogCode} ${p.slug}`);
    failed += 1;
  }
}

for (const [code, want] of Object.entries(expected)) {
  const p = CATALOG.find((x) => x.catalogCode === code);
  if (!p) {
    console.error(`MISSING PROCESS ${code}`);
    failed += 1;
    continue;
  }
  const got = copyPackFor(p);
  if (got.join("|") !== want.join("|")) {
    console.error(`${code} expected ${want.join(" · ")} got ${got.join(" · ")}`);
    failed += 1;
  }
}

const empty = CATALOG.filter((p) => copyPackFor(p).length === 0);
if (empty.length) {
  console.error("Empty packs:", empty.map((p) => p.catalogCode));
  failed += empty.length;
}

console.log(
  `Checked ${CATALOG.length} processes, ${Object.keys(expected).length} exact packs. ${failed ? "FAILED " + failed : "OK"}`
);
if (failed) process.exit(1);
