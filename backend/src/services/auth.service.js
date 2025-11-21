const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')

async function registrarUsuario({ nome, cpf, email, senha }) {
  try {
    // validação mínima
    if (!email || !senha || !nome) throw new Error('Dados incompletos')
    console.log('📝 Registrando usuário:', { nome, cpf, email })
    
    const existsEmail = await prisma.usuario.findUnique({ where: { email } })
    if (existsEmail) throw new Error('Usuário com esse e-mail já existe')
    
    const existsCpf = await prisma.usuario.findUnique({ where: { cpf } })
    if (existsCpf) throw new Error('Usuário com esse CPF já existe')

    const hashed = await bcrypt.hash(senha, 10)
    const user = await prisma.usuario.create({ data: { nome, cpf, email, senha: hashed } })
    console.log('✅ Usuário criado:', { id: user.id, nome: user.nome, email: user.email })
    
    return { id: user.id, nome: user.nome, email: user.email }
  } catch (err) {
    console.error('❌ Erro ao registrar usuário:', err.message)
    throw err
  }
}

async function logarUsuario(email, password) {
  try {
    console.log('🔑 Autenticando usuário:', email)
    const user = await prisma.usuario.findUnique({ where: { email } })
    if (!user) {
      console.log('❌ Usuário não encontrado:', email)
      return null
    }
    
    const ok = await bcrypt.compare(password, user.senha)
    if (!ok) {
      console.log('❌ Senha incorreta para:', email)
      return null
    }
    
    // Gerar token simples (em produção usar JWT)
    const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64')
    console.log('✅ Login bem-sucedido:', email)
    
    return { token, userId: user.id, email: user.email }
  } catch (err) {
    console.error('❌ Erro ao fazer login:', err.message)
    throw err
  }
}

async function alterarEmail(userId, newEmail) {
  try {
    console.log('📧 Alterando e-mail do usuário:', userId, '→', newEmail)
    
    // Verificar se novo e-mail já existe
    const existsEmail = await prisma.usuario.findUnique({ where: { email: newEmail } })
    if (existsEmail && existsEmail.id !== userId) {
      throw new Error('Esse e-mail já está em uso')
    }

    const user = await prisma.usuario.update({
      where: { id: userId },
      data: { email: newEmail }
    })
    console.log('✅ E-mail alterado com sucesso:', newEmail)
    
    return { id: user.id, email: user.email, nome: user.nome }
  } catch (err) {
    console.error('❌ Erro ao alterar e-mail:', err.message)
    throw err
  }
}

async function alterarSenha(userId, newPassword) {
  try {
    console.log('🔐 Alterando senha do usuário:', userId)
    
    if (!newPassword || newPassword.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres')
    }

    const hashed = await bcrypt.hash(newPassword, 10)
    const user = await prisma.usuario.update({
      where: { id: userId },
      data: { senha: hashed }
    })
    console.log('✅ Senha alterada com sucesso')
    
    return { id: user.id, email: user.email, nome: user.nome }
  } catch (err) {
    console.error('❌ Erro ao alterar senha:', err.message)
    throw err
  }
}

async function deletarConta(userId) {
  try {
    console.log('🗑️ Deletando conta do usuário:', userId)
    
    const user = await prisma.usuario.delete({
      where: { id: userId }
    })
    console.log('✅ Conta deletada com sucesso:', user.email)
    
    return { message: 'Conta deletada com sucesso', email: user.email }
  } catch (err) {
    console.error('❌ Erro ao deletar conta:', err.message)
    throw err
  }
}

module.exports = { registrarUsuario, logarUsuario, alterarEmail, alterarSenha, deletarConta }
