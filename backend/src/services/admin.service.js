const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function createVehicle({ nome, cadeiras, acessorios }) {
  if (!nome) throw new Error('Nome é obrigatório')
  const vehicle = await prisma.veiculo.create({ data: { nome, cadeiras: cadeiras || 0, acessorios } })
  return vehicle
}

async function listVehicles() {
  return await prisma.veiculo.findMany({ orderBy: { createdAt: 'desc' } })
}

async function createVehicleWithImage({ nome, cadeiras, acessorios, imagePath }) {
  if (!nome) throw new Error('Nome é obrigatório')
  const vehicle = await prisma.veiculo.create({ data: { nome, cadeiras: cadeiras || 0, acessorios, image: imagePath } })
  return vehicle
}

async function listUsers() {
  return await prisma.usuario.findMany({ select: { id: true, nome: true, email: true, cpf: true } })
}

async function deleteUser(id) {
  await prisma.usuario.delete({ where: { id } })
}

module.exports = { createVehicle, createVehicleWithImage, listVehicles, listUsers, deleteUser }
