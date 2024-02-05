-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "cashBack" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "slip" TEXT;
