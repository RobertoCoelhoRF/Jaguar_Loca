const authService = require('../services/auth.service')

// Middleware para extrair userId do token
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

async function registrarUsuario(req, res) {
  try {
    const data = req.body
    console.log('📨 POST /auth/registro recebido:', data)
    const user = await authService.registrarUsuario(data)
    console.log('✅ Respondendo com sucesso:', { user })
    res.status(201).json({ user })
  } catch (err) {
    console.error('❌ Erro no controller:', err.message)
    res.status(500).json({ error: err.message || 'Erro ao registrar usuário' })
  }
}

async function logarUsuario(req, res) {
  try {
    const { email, password } = req.body
    const result = await authService.logarUsuario(email, password)
    if (!result) return res.status(401).json({ error: 'Credenciais inválidas' })
    res.json({ ok: true, ...result })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Erro ao autenticar usuário' })
  }
}

async function alterarEmail(req, res) {
  try {
    const userId = extractUserId(req)
    if (!userId) return res.status(401).json({ error: 'Não autenticado' })
    
    const { newEmail } = req.body
    const result = await authService.alterarEmail(userId, newEmail)
    res.json({ ok: true, ...result })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Erro ao alterar e-mail' })
  }
}

async function alterarSenha(req, res) {
  try {
    const userId = extractUserId(req)
    if (!userId) return res.status(401).json({ error: 'Não autenticado' })
    
    const { newPassword } = req.body
    const result = await authService.alterarSenha(userId, newPassword)
    res.json({ ok: true, ...result })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Erro ao alterar senha' })
  }
}

async function deletarConta(req, res) {
  try {
    const userId = extractUserId(req)
    if (!userId) return res.status(401).json({ error: 'Não autenticado' })
    
    await authService.deletarConta(userId)
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Erro ao deletar conta' })
  }
}

module.exports = { registrarUsuario, logarUsuario, alterarEmail, alterarSenha, deletarConta }
