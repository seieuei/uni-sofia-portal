"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";

/** Legacy dashboard → My week */
export default function DashboardRedirect() {
  const { ready, user } = useApp();
  const router = useRouter();
  useEffect(() => {
    if (!ready) return;
    router.replace(user ? "/week" : "/login");
  }, [ready, user, router]);
  return <div className="mx-auto max-w-6xl px-4 py-12">…</div>;
}
