/*
  Warnings:

  - You are about to drop the `SurveyRawSubmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SurveyResponse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "SurveyRawSubmission";

-- DropTable
DROP TABLE "SurveyResponse";

-- CreateTable
CREATE TABLE "SurveySubmission" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "parsedAnswers" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveySubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SurveySubmission_submissionId_key" ON "SurveySubmission"("submissionId");

-- CreateIndex
CREATE INDEX "SurveySubmission_submissionId_idx" ON "SurveySubmission"("submissionId");
