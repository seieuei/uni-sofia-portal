import { NextResponse } from "next/server";
import { getCurrentUser, isAdminRole } from "@/lib/auth";
import { generateIndividualReportDocx } from "@/lib/individualReport";
import { buildReport } from "@/lib/reportBuild";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "lecturer" && !isAdminRole(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const report = await buildReport(user.id, "bg");
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const buf = generateIndividualReportDocx(report);
  const year = report.academicYear.replace("/", "-");
  const filename = `individualen-otchet-${year}.docx`;
  return new NextResponse(Uint8Array.from(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
