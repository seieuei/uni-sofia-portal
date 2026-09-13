import { personTypeLabel } from "@/lib/personTypes";
import type { Role } from "@/lib/types";
import type { Lang } from "@/lib/types";

export function PersonTypeBadge({
  role,
  studentCycle,
  formOfStudy,
  lecturerKind,
  lang,
  className = "",
}: {
  role: Role;
  studentCycle?: string | null;
  formOfStudy?: string | null;
  lecturerKind?: string | null;
  lang: Lang;
  className?: string;
}) {
  const label = personTypeLabel(role, { studentCycle, formOfStudy, lecturerKind }, lang);
  if (!label) return null;
  return (
    <span
      className={`inline-flex rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-[11px] font-semibold text-burgundy dark:border-gold/30 dark:text-gold ${className}`}
    >
      {label}
    </span>
  );
}
