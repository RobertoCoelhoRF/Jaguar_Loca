-- CreateTable
CREATE TABLE "Veiculo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cadeiras" INTEGER NOT NULL,
    "acessorios" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Veiculo_pkey" PRIMARY KEY ("id")
);
