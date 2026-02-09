/*
  Warnings:

  - You are about to drop the column `description` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `solved` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `state` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "State" AS ENUM ('PENDING', 'OPEN', 'DISCARDED', 'SOLVED');

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "description",
DROP COLUMN "solved",
ADD COLUMN     "state" "State" NOT NULL,
ALTER COLUMN "responsableId" DROP NOT NULL;
