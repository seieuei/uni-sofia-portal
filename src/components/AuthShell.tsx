"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "./Providers";
import { SideCalendar } from "./SideCalendar";
import { APP_CALENDAR_PREFIXES } from "@/lib/academicUi";
import { isInternalPath } from "@/lib/visitor";

export function AuthShell({ children }: { children: React.ReactNode }) {
  const { user, ready, visitor } = useApp();
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!ready || user) return;
    if (isInternalPath(path)) {
      router.replace(visitor ? "/about" : "/login");
    }
  }, [ready, user, visitor, path, router]);

  const showCalendar =
    ready &&
    !!user &&
    APP_CALENDAR_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));

  if (!showCalendar) return <>{children}</>;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1">{children}</div>
      <aside className="border-t border-ink/10 px-4 py-6 dark:border-gold/15 lg:sticky lg:top-20 lg:w-80 lg:shrink-0 lg:border-l lg:border-t-0 lg:px-4 lg:py-12">
        <SideCalendar />
      </aside>
    </div>
  );
}
