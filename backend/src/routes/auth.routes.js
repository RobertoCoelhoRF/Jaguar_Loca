const express = require('express')
const router = express.Router()
const { registrarUsuario, logarUsuario, alterarEmail, alterarSenha, deletarConta } = require('../controllers/auth.controller')

// POST /auth/registro
router.post('/registro', registrarUsuario)

// POST /auth/login
router.post('/login', logarUsuario)

// PUT /auth/email - alterar email (precisa de autenticação)
router.put('/email', alterarEmail)

// PUT /auth/password - alterar senha (precisa de autenticação)
router.put('/password', alterarSenha)

// DELETE /auth/account - deletar conta (precisa de autenticação)
router.delete('/account', deletarConta)

module.exports = router
