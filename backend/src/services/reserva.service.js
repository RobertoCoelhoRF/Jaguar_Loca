const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function createReserva({ usuarioId, veiculoId, dataRetirada, horaRetirada, dataDevolucao, valorTotal, observacoes }) {
  if (!usuarioId) throw new Error('Usuário não autenticado')
  if (!veiculoId) throw new Error('Veículo inválido')

  // Quick check: ensure Prisma client includes the `reserva` model
  if (!prisma.reserva) throw new Error("Prisma client não possui o modelo 'Reserva' (prisma.reserva é undefined). Execute: npx prisma generate --schema=backend/prisma/schema.prisma e npx prisma migrate dev (ou npx prisma db push)")

  const veiculo = await prisma.veiculo.findUnique({ where: { id: Number(veiculoId) } })
  if (!veiculo) throw new Error('Veículo não encontrado')
  if (veiculo.reservado) throw new Error('Veículo já reservado')

  // validate dataDevolucao and valorTotal
  if (!dataDevolucao) throw new Error('Data de devolução é obrigatória')
  if (!valorTotal && valorTotal !== 0) throw new Error('Valor total é obrigatório')
  
  const valTotal = Number(valorTotal)
  if (isNaN(valTotal) || valTotal < 0) throw new Error('Valor total deve ser um número válido')
  if (valTotal === 0) throw new Error('Valor total deve ser maior que zero')

  // combine date and time into Date objects using the same pickup time for return
  const dt = new Date(`${dataRetirada}T${horaRetirada}`)
  const dtDev = new Date(`${dataDevolucao}T${horaRetirada}`)

  const reserva = await prisma.reserva.create({ data: { usuarioId: Number(usuarioId), veiculoId: Number(veiculoId), dataRetirada: dt, horaRetirada: horaRetirada, dataDevolucao: dtDev, valorTotal: valTotal, observacoes } })

  // mark vehicle as reserved
  await prisma.veiculo.update({ where: { id: Number(veiculoId) }, data: { reservado: true } })

  return reserva
}

async function listMine(usuarioId) {
  return await prisma.reserva.findMany({ where: { usuarioId: Number(usuarioId) }, include: { veiculo: true }, orderBy: { createdAt: 'desc' } })
}

async function deleteReserva(reservaId, usuarioId) {
  if (!reservaId) throw new Error('ID da reserva inválido')
  if (!usuarioId) throw new Error('Usuário não autenticado')

  const reserva = await prisma.reserva.findUnique({ where: { id: Number(reservaId) } })
  if (!reserva) throw new Error('Reserva não encontrada')
  if (reserva.usuarioId !== Number(usuarioId)) throw new Error('Não autorizado a deletar esta reserva')

  // Mark vehicle as not reserved
  await prisma.veiculo.update({ where: { id: reserva.veiculoId }, data: { reservado: false } })

  // Delete the reservation
  return await prisma.reserva.delete({ where: { id: Number(reservaId) } })
}

async function listAll() {
  return await prisma.reserva.findMany({ 
    include: { 
      veiculo: true,
      usuario: { select: { id: true, nome: true, email: true } }
    }, 
    orderBy: { createdAt: 'desc' } 
  })
}

async function deleteReservaAdmin(reservaId) {
  if (!reservaId) throw new Error('ID da reserva inválido')

  const reserva = await prisma.reserva.findUnique({ where: { id: Number(reservaId) } })
  if (!reserva) throw new Error('Reserva não encontrada')

  // Mark vehicle as not reserved
  await prisma.veiculo.update({ where: { id: reserva.veiculoId }, data: { reservado: false } })

  // Delete the reservation
  return await prisma.reserva.delete({ where: { id: Number(reservaId) } })
}

module.exports = { createReserva, listMine, deleteReserva, listAll, deleteReservaAdmin }
