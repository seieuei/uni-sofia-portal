import { prisma } from "./prisma";

export function makeCaseNumber() {
  const n = Math.floor(Math.random() * 90000) + 10000;
  const d = new Date();
  const y = d.getFullYear().toString().slice(2);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `ПР-${y}${m}-${n}`;
}

export function makeArhimedNumber() {
  const n = Math.floor(Math.random() * 900000) + 100000;
  return `АРХ-${new Date().getFullYear()}-${n}`;
}

export async function addCaseEvent(
  caseId: string,
  actorId: string | null,
  type: string,
  messageBg: string,
  messageEn: string,
  meta: Record<string, unknown> = {}
) {
  return prisma.caseEvent.create({
    data: {
      caseId,
      actorId,
      type,
      messageBg,
      messageEn,
      metaJson: JSON.stringify(meta),
    },
  });
}
