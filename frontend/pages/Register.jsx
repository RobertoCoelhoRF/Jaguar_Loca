import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import { useModalContext } from '../context/ModalContext'

export default function Register() {
  const navigate = useNavigate()
  const modal = useModalContext()
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    password: '',
    confirm: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { name, cpf, email, password, confirm } = formData

    if (name.split(' ').length < 2) {
      modal.alert('Informe nome e sobrenome.', 'warning')
      return
    }
    if (!/\d{3}\.\d{3}\.\d{3}-\d{2}/.test(cpf)) {
      modal.alert('CPF deve estar no formato 000.000.000-00.', 'warning')
      return
    }
    if (!email.includes('@')) {
      modal.alert('Informe um e-mail válido.', 'warning')
      return
    }
    if (password.length < 6) {
      modal.alert('A senha precisa ter pelo menos 6 caracteres.', 'warning')
      return
    }
    if (password !== confirm) {
      modal.alert('As senhas não coincidem.', 'warning')
      return
    }

    // Enviar dados para backend
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    fetch(`${backendUrl}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: name, cpf, email, senha: password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          modal.success('Cadastro realizado com sucesso!', 'Bem-vindo!')
          navigate('/')
        } else {
          modal.error(data.error || 'Erro ao registrar', 'Erro')
        }
      })
      .catch(err => {
        console.error(err)
        modal.error('Erro ao conectar com o servidor', 'Falha na conexão')
      })
  }

  return (
    <>
      <Header />

      <main className="auth-wrapper">
        <section className="auth-card">
          <div className="auth-header">
            <img src="/assets/header-bar.png" alt="" style={{ height: 28, width: 'auto', borderRadius: 6 }} />
            <div className="auth-title">Criar conta</div>
          </div>
          <div className="auth-subtitle">Cadastre-se para reservar veículos rapidamente.</div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label" htmlFor="name">Nome completo</label>
              <input
                className="input"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="label" htmlFor="cpf">CPF</label>
              <input
                className="input"
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="label" htmlFor="email">E-mail</label>
              <input
                className="input"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="voce@email.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="label" htmlFor="password">Senha</label>
              <input
                className="input"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>
            
            <div className="form-group">
              <label className="label" htmlFor="confirm">Confirmar senha</label>
              <input
                className="input"
                type="password"
                id="confirm"
                name="confirm"
                value={formData.confirm}
                onChange={handleChange}
                placeholder="Repita a senha"
                required
                minLength={6}
              />
            </div>
            
            <div className="actions" style={{ justifyContent: 'flex-start', marginTop: 14 }}>
              <button className="btn" type="submit">Criar conta</button>
              <Link className="link" to="/login">Já tem conta? Entrar</Link>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </>
  )
}