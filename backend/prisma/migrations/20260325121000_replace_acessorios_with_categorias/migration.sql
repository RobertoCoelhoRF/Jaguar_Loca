-- CreateEnum
CREATE TYPE "CambioTipo" AS ENUM ('MANUAL', 'AUTOMATICO');

-- CreateEnum
CREATE TYPE "PortaMalasTamanho" AS ENUM ('PEQUENO', 'MEDIO', 'GRANDE');

-- AlterTable
ALTER TABLE "Veiculo"
ADD COLUMN     "vidroEletrico" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "arCondicionado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cambio" "CambioTipo" NOT NULL DEFAULT 'MANUAL',
ADD COLUMN     "travaEletrica" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "direcaoHidraulica" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "portaMalas" "PortaMalasTamanho" NOT NULL DEFAULT 'MEDIO';

-- Drop old free-text accessories field
ALTER TABLE "Veiculo" DROP COLUMN "acessorios";
