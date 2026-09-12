export type ReportRow = {
  discipline: string;
  specialty: string;
  faculty: string;
  kind: string;
  year: string;
  form: string;
  studentCount: number;
  lectureHours: number;
  exerciseHours: number;
  language: string;
  assessment: string;
  titular: string;
  assistant: string;
  examined: number;
  currentAssessed: number;
  courseworks: number;
};

export type IndividualReportData = {
  lecturerName: string;
  lecturerEmail: string;
  faculty: string;
  department: string;
  academicYear: string;
  generatedAt: string;
  note: string;
  winter: ReportRow[];
  summer: ReportRow[];
};
