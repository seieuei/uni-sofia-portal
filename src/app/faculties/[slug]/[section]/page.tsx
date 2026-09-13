"use client";

import { useParams } from "next/navigation";
import { useApp } from "@/components/Providers";
import { FacultyHubView } from "@/components/FacultyHubView";
import { getHub, getHubSection } from "@/content/faculties/hubs";

export default function FacultySectionPage() {
  const { lang } = useApp();
  const params = useParams();
  const hub = getHub(String(params.slug || ""));
  const section = hub ? getHubSection(hub, String(params.section || "")) : undefined;

  if (!hub || !section) {
    return <p className="mx-auto max-w-3xl px-4 py-12 text-ink/60">{lang === "bg" ? "Разделът не е намерен." : "Section not found."}</p>;
  }

  return <FacultyHubView hub={hub} section={section} />;
}
