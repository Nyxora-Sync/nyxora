-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "verificationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackKey" TEXT NOT NULL,
    "trackName" TEXT NOT NULL,
    "recipientName" TEXT,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_verificationId_key" ON "Certificate"("verificationId");

-- CreateIndex
CREATE INDEX "Certificate_userId_issuedAt_idx" ON "Certificate"("userId", "issuedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_userId_trackKey_key" ON "Certificate"("userId", "trackKey");

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

