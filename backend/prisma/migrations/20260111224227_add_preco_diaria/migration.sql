/*
  Warnings:

  - Added the required column `precoDiaria` to the `Veiculo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Veiculo" ADD COLUMN     "precoDiaria" DOUBLE PRECISION NOT NULL;
