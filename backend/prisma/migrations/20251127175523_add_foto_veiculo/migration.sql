/*
  Warnings:

  - You are about to drop the column `image` on the `Veiculo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Veiculo" DROP COLUMN "image",
ADD COLUMN     "foto" TEXT;
