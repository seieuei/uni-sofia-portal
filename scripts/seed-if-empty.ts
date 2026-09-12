import { PrismaClient } from "@prisma/client";
import { spawnSync } from "child_process";
import { seedProcesses } from "../prisma/seed-processes";

const prisma = new PrismaClient();

async function main() {
  const [forms, users] = await Promise.all([
    prisma.formTemplate.count(),
    prisma.user.count(),
  ]);
  if (forms > 0 && users > 0) {
    console.log(`DB already has ${forms} form(s) and ${users} user(s) — skipping full seed.`);
  } else {
    console.log("Empty or partial DB — running seed…");
    const result = spawnSync("npx", ["tsx", "prisma/seed.ts"], {
      stdio: "inherit",
      env: process.env,
      shell: process.platform === "win32",
    });

    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
  }

  // Always upsert catalog processes/handbook by slug. Never wipes users or cases.
  console.log("→ sync process catalog (idempotent upsert)");
  const result = await seedProcesses(prisma);
  const total = await prisma.processDefinition.count();
  console.log(`Process definitions in DB: ${total} (this boot: +${result.created} / ~${result.updated})`);
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect().catch(() => undefined);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => undefined);
  });
