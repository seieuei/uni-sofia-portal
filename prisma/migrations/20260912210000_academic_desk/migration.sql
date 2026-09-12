-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleBg" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "professionalFieldBg" TEXT,
    "professionalFieldEn" TEXT,
    "facultyId" TEXT NOT NULL,
    "formOfStudy" TEXT NOT NULL DEFAULT 'full-time',
    "semesters" INTEGER NOT NULL DEFAULT 8,
    "noteBg" TEXT,
    "noteEn" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Program_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CurriculumVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "programId" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "labelBg" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CurriculumVersion_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CurriculumCourse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "versionId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "titleBg" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "ects" REAL NOT NULL,
    "hoursTotal" INTEGER NOT NULL,
    "hoursLectures" INTEGER NOT NULL DEFAULT 0,
    "hoursSeminars" INTEGER NOT NULL DEFAULT 0,
    "hoursPractice" INTEGER NOT NULL DEFAULT 0,
    "weeklyLoad" TEXT NOT NULL,
    "grading" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'bg',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CurriculumCourse_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "CurriculumVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CourseOffering" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "lecturerId" TEXT,
    "assistantId" TEXT,
    "room" TEXT,
    "language" TEXT NOT NULL DEFAULT 'bg',
    "assessmentForm" TEXT,
    "studentCount" INTEGER NOT NULL DEFAULT 0,
    "kind" TEXT NOT NULL DEFAULT 'regular',
    "yearOfStudy" INTEGER,
    "formOfStudy" TEXT NOT NULL DEFAULT 'full-time',
    "examined" INTEGER NOT NULL DEFAULT 0,
    "currentAssessed" INTEGER NOT NULL DEFAULT 0,
    "courseworks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CourseOffering_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "CurriculumCourse" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CourseOffering_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "CurriculumVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CourseOffering_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CourseOffering_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ScheduleSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "offeringId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "startMinutes" INTEGER NOT NULL,
    "endMinutes" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "room" TEXT,
    CONSTRAINT "ScheduleSlot_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "CourseOffering" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Syllabus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "offeringId" TEXT NOT NULL,
    "annotationBg" TEXT NOT NULL,
    "annotationEn" TEXT NOT NULL,
    "prerequisitesBg" TEXT,
    "prerequisitesEn" TEXT,
    "outcomesBg" TEXT,
    "outcomesEn" TEXT,
    "gradingJson" TEXT NOT NULL,
    "loadJson" TEXT NOT NULL,
    "topicsJson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Syllabus_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "CourseOffering" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "offeringId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'enrolled',
    "source" TEXT NOT NULL DEFAULT 'compulsory',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Enrollment_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "CourseOffering" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ElectiveWindow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "academicYear" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "opensAt" DATETIME NOT NULL,
    "closesAt" DATETIME NOT NULL,
    "minEcts" REAL NOT NULL DEFAULT 0,
    "maxEcts" REAL NOT NULL DEFAULT 6,
    "titleBg" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ElectiveWindow_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "CurriculumVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ElectiveChoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "windowId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "offeringId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ElectiveChoice_windowId_fkey" FOREIGN KEY ("windowId") REFERENCES "ElectiveWindow" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ElectiveChoice_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ElectiveChoice_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "CourseOffering" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Program_code_key" ON "Program"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Program_slug_key" ON "Program"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumVersion_programId_academicYear_key" ON "CurriculumVersion"("programId", "academicYear");

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumCourse_versionId_code_semester_key" ON "CurriculumCourse"("versionId", "code", "semester");

-- CreateIndex
CREATE UNIQUE INDEX "CourseOffering_slug_key" ON "CourseOffering"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Syllabus_offeringId_key" ON "Syllabus"("offeringId");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_offeringId_studentId_key" ON "Enrollment"("offeringId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "ElectiveWindow_slug_key" ON "ElectiveWindow"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ElectiveChoice_windowId_studentId_offeringId_key" ON "ElectiveChoice"("windowId", "studentId", "offeringId");
