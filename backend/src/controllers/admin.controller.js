const adminService = require('../services/admin.service')

function isAdminToken(req) {
  const header = req.headers.authorization || ''
  if (!header.startsWith('Bearer ')) return false
  const token = header.replace('Bearer ', '')
  return token === 'admin-token'
}

exports.createVeiculo = async (req, res) => {
  try {
    if (!isAdminToken(req)) return res.status(401).json({ error: 'Unauthorized' })
    const { nome, cadeiras, acessorios } = req.body
    // If multer handled a file, build a public URL path
    let foto = null
    if (req.file && req.file.filename) {
      foto = `/uploads/${req.file.filename}`
    }
    const veiculo = await adminService.createVeiculo({ nome, cadeiras, acessorios, foto })
    res.json({ veiculo })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.listUsers = async (req, res) => {
  try {
    if (!isAdminToken(req)) return res.status(401).json({ error: 'Unauthorized' })
    const users = await adminService.listUsers()
    res.json({ users })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.listVeiculos = async (req, res) => {
  try {
    if (!isAdminToken(req)) return res.status(401).json({ error: 'Unauthorized' })
    const veiculos = await adminService.listVeiculos()
    res.json({ veiculos })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    if (!isAdminToken(req)) return res.status(401).json({ error: 'Unauthorized' })
    const id = Number(req.params.id)
    await adminService.deleteUser(id)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.deleteVeiculo = async (req, res) => {
  try {
    if (!isAdminToken(req)) return res.status(401).json({ error: 'Unauthorized' })
    const id = Number(req.params.id)
    await adminService.deleteVeiculo(id)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
