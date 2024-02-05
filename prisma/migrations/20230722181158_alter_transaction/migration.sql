/*
  Warnings:

  - You are about to drop the column `price` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `transactions` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'participant';

-- DropIndex
DROP INDEX "transaction_files_transactionId_key";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "price",
DROP COLUMN "type",
ADD COLUMN     "deposit" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "withdraw" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- DropEnum
DROP TYPE "TypeTransaction";
