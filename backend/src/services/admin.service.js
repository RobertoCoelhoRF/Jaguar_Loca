const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function createVeiculo({ nome, cadeiras, acessorios }) {
  if (!nome) throw new Error('Nome é obrigatório')
  const veiculo = await prisma.veiculo.create({ data: { nome, cadeiras: cadeiras || 0, acessorios } })
  return veiculo
}

async function listUsers() {
  return await prisma.usuario.findMany({ select: { id: true, nome: true, email: true, cpf: true } })
}

async function deleteUser(id) {
  await prisma.usuario.delete({ where: { id } })
}

module.exports = { createVeiculo, listUsers, deleteUser }
