const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')
const path = require('path')

const CAMBIO_VALIDO = ['MANUAL', 'AUTOMATICO']
const PORTA_MALAS_VALIDO = ['PEQUENO', 'MEDIO', 'GRANDE']

function parseBoolean(value) {
  return value === true || value === 'true' || value === 1 || value === '1'
}

async function createVeiculo({ nome, cadeiras, vidroEletrico, arCondicionado, cambio, travaEletrica, direcaoHidraulica, portaMalas, foto, precoDiaria }) {
  if (!nome) throw new Error('Nome é obrigatório')
  if (!precoDiaria && precoDiaria !== 0) throw new Error('Preço da diária é obrigatório')
  const preco = Number(precoDiaria)
  if (isNaN(preco) || preco < 0) throw new Error('Preço da diária deve ser um número válido')
  if (preco === 0) throw new Error('Preço da diária deve ser maior que zero')
  const cambioNormalizado = String(cambio || 'MANUAL').toUpperCase()
  const portaMalasNormalizado = String(portaMalas || 'MEDIO').toUpperCase()
  if (!CAMBIO_VALIDO.includes(cambioNormalizado)) throw new Error('Tipo de câmbio inválido')
  if (!PORTA_MALAS_VALIDO.includes(portaMalasNormalizado)) throw new Error('Tamanho do porta-malas inválido')

  const data = {
    nome,
    cadeiras: Number(cadeiras) || 0,
    vidroEletrico: parseBoolean(vidroEletrico),
    arCondicionado: parseBoolean(arCondicionado),
    cambio: cambioNormalizado,
    travaEletrica: parseBoolean(travaEletrica),
    direcaoHidraulica: parseBoolean(direcaoHidraulica),
    portaMalas: portaMalasNormalizado,
    precoDiaria: preco
  }
  // Persist optional foto field (string path like `/uploads/filename`)
  if (foto) data.foto = foto
  const veiculo = await prisma.veiculo.create({ data })
  return veiculo
}

async function listUsers() {
  return await prisma.usuario.findMany({ select: { id: true, nome: true, email: true, cpf: true } })
}

async function deleteUser(id) {
  await prisma.usuario.delete({ where: { id } })
}

async function listVeiculos() {
  return await prisma.veiculo.findMany({ orderBy: { createdAt: 'desc' } })
}

async function deleteVeiculo(id) {
  const veiculo = await prisma.veiculo.findUnique({ where: { id } })
  if (!veiculo) throw new Error('Veículo não encontrado')
  // if there is a foto path (like /uploads/filename), try to remove the file
  if (veiculo.foto) {
    try {
      const filePath = path.resolve(__dirname, '../../', veiculo.foto.replace(/^\//, ''))
      if (fs.existsSync(filePath)) await fs.promises.unlink(filePath)
    } catch (err) {
      // don't block deletion if file removal fails; log to console
      console.error('Erro ao remover arquivo de foto:', err.message)
    }
  }
  await prisma.veiculo.delete({ where: { id } })
}

async function updateVeiculo(id, { nome, cadeiras, vidroEletrico, arCondicionado, cambio, travaEletrica, direcaoHidraulica, portaMalas, foto, precoDiaria }) {
  if (!nome) throw new Error('Nome é obrigatório')
  if (!precoDiaria && precoDiaria !== 0) throw new Error('Preço da diária é obrigatório')
  const preco = Number(precoDiaria)
  if (isNaN(preco) || preco < 0) throw new Error('Preço da diária deve ser um número válido')
  if (preco === 0) throw new Error('Preço da diária deve ser maior que zero')
  const cambioNormalizado = String(cambio || 'MANUAL').toUpperCase()
  const portaMalasNormalizado = String(portaMalas || 'MEDIO').toUpperCase()
  if (!CAMBIO_VALIDO.includes(cambioNormalizado)) throw new Error('Tipo de câmbio inválido')
  if (!PORTA_MALAS_VALIDO.includes(portaMalasNormalizado)) throw new Error('Tamanho do porta-malas inválido')
  
  const veiculo = await prisma.veiculo.findUnique({ where: { id } })
  if (!veiculo) throw new Error('Veículo não encontrado')
  
  // If a new photo is provided, remove the old one
  if (foto && veiculo.foto) {
    try {
      const filePath = path.resolve(__dirname, '../../', veiculo.foto.replace(/^\//, ''))
      if (fs.existsSync(filePath)) await fs.promises.unlink(filePath)
    } catch (err) {
      console.error('Erro ao remover arquivo de foto anterior:', err.message)
    }
  }
  
  const data = {
    nome,
    cadeiras: Number(cadeiras) || 0,
    vidroEletrico: parseBoolean(vidroEletrico),
    arCondicionado: parseBoolean(arCondicionado),
    cambio: cambioNormalizado,
    travaEletrica: parseBoolean(travaEletrica),
    direcaoHidraulica: parseBoolean(direcaoHidraulica),
    portaMalas: portaMalasNormalizado,
    precoDiaria: preco
  }
  // Only update foto if a new one is provided
  if (foto) data.foto = foto
  
  return await prisma.veiculo.update({ where: { id }, data })
}

module.exports = { createVeiculo, listUsers, deleteUser, listVeiculos, deleteVeiculo, updateVeiculo }
