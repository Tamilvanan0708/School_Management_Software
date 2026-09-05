-- CreateIndex
CREATE UNIQUE INDEX "ExamResult_examScheduleId_studentId_key" ON "ExamResult"("examScheduleId", "studentId");
