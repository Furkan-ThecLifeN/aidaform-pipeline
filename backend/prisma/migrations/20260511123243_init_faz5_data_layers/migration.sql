/*
  Warnings:

  - You are about to drop the column `createdAt` on the `SurveyRawSubmission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SurveyRawSubmission" DROP COLUMN "createdAt",
ADD COLUMN     "headers" JSONB,
ADD COLUMN     "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "SurveyResponse" (
    "id" SERIAL NOT NULL,
    "submissionId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SurveyResponse_submissionId_key" ON "SurveyResponse"("submissionId");

-- CreateIndex
CREATE INDEX "SurveyResponse_submissionId_idx" ON "SurveyResponse"("submissionId");

-- CreateIndex
CREATE INDEX "SurveyRawSubmission_submissionId_idx" ON "SurveyRawSubmission"("submissionId");
