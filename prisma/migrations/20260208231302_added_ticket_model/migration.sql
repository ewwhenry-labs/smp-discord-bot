-- CreateEnum
CREATE TYPE "Category" AS ENUM ('DUDA', 'REPORTE_USUARIO', 'REPORTE_STAFF', 'REPORTE_BUG', 'CREADOR', 'RECUPERACION_CUENTA', 'APELANCION_BAN', 'SOS', 'COMPRA_EXCLUSIVA', 'COMPRA_DROIDS');

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "humanId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "openerId" TEXT NOT NULL,
    "responsableId" TEXT NOT NULL,
    "solved" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_humanId_key" ON "Ticket"("humanId");
