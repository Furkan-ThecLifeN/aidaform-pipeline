-- CreateTable
CREATE TABLE "SurveyRawSubmission" (
    "id" SERIAL NOT NULL,
    "submissionId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyRawSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SurveyRawSubmission_submissionId_key" ON "SurveyRawSubmission"("submissionId");
