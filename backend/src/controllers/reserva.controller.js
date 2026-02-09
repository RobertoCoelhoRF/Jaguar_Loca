const reservaService = require('../services/reserva.service')

function extractUserId(req) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return null
  try {
    const [userId] = Buffer.from(token, 'base64').toString().split(':')
    return parseInt(userId)
  } catch {
    return null
  }
}

exports.createReserva = async (req, res) => {
  try {
    const userId = extractUserId(req)
    if (!userId) return res.status(401).json({ error: 'Não autenticado' })
    const { veiculoId, dataRetirada, horaRetirada, dataDevolucao, valorTotal, observacoes } = req.body
    const reserva = await reservaService.createReserva({ usuarioId: userId, veiculoId, dataRetirada, horaRetirada, dataDevolucao, valorTotal, observacoes })
    res.status(201).json({ reserva })
  } catch (err) {
    console.error('Erro em POST /reservas:', err && err.stack ? err.stack : err)
    res.status(400).json({ error: err.message })
  }
}

exports.listMine = async (req, res) => {
  try {
    const userId = extractUserId(req)
    if (!userId) return res.status(401).json({ error: 'Não autenticado' })
    const reservas = await reservaService.listMine(userId)
    res.json({ reservas })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
exports.deleteReserva = async (req, res) => {
  try {
    const userId = extractUserId(req)
    if (!userId) return res.status(401).json({ error: 'Não autenticado' })
    const { id } = req.params
    await reservaService.deleteReserva(id, userId)
    res.json({ ok: true })
  } catch (err) {
    console.error('Erro em DELETE /reservas/:id:', err && err.stack ? err.stack : err)
    res.status(400).json({ error: err.message })
  }
}