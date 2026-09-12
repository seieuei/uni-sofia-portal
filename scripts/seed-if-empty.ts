import { PrismaClient } from "@prisma/client";
import { spawnSync } from "child_process";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.formTemplate.count();
  if (count > 0) {
    console.log(`DB already has ${count} form(s) — skipping seed.`);
    return;
  }

  console.log("No forms found — running seed…");
  await prisma.$disconnect();

  const result = spawnSync("npx", ["tsx", "prisma/seed.ts"], {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
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
