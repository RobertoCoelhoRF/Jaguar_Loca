import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'

export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
    adminCode: ''
  })
  const [loginType, setLoginType] = useState('user') // 'user' or 'admin'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { email, password } = formData

    if (!email.includes('@')) {
      alert('Informe um e-mail válido.')
      return
    }
    if (password.length < 6) {
      alert('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    if (loginType === 'admin') {
      if (!formData.adminCode || formData.adminCode.trim().length === 0) {
        alert('Informe o código de administrador.')
        return
      }
    }

    // Enviar dados para backend
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    fetch(`${backendUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.token) {
          // Salvar token no localStorage
          localStorage.setItem('token', data.token)
          localStorage.setItem('userId', data.userId)
          localStorage.setItem('loginType', loginType)
          if (formData.remember) {
            localStorage.setItem('email', email)
          }
          // notificar Header e outras partes da aplicação sobre mudança de auth
          window.dispatchEvent(new Event('auth-changed'))
          alert('Login realizado com sucesso!')
          navigate('/')
        } else {
          alert(data.error || 'Erro ao fazer login')
        }
      })
      .catch(err => {
        console.error(err)
        alert('Erro ao conectar com o servidor')
      })
  }

  return (
    <>
      <Header />

      <main className="auth-wrapper">
        <section className="auth-card">
          <div className="auth-header">
            <img src="/assets/header-bar.png" alt="" style={{ height: 28, width: 'auto', borderRadius: 6 }} />
            <div className="auth-title">Entrar</div>
          </div>
          <div style={{display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12}}>
            <button type="button" className={loginType === 'user' ? 'btn btn-ghost active' : 'btn btn-ghost'} onClick={() => setLoginType('user')}>Usuário</button>
            <button type="button" className={loginType === 'admin' ? 'btn btn-ghost active' : 'btn btn-ghost'} onClick={() => setLoginType('admin')}>Administrador</button>
          </div>

          <div className="auth-subtitle" style={{marginTop:12}}>
            {loginType === 'user'
              ? 'Acesse sua conta para reservar veículos e acompanhar suas locações.'
              : 'Área administrativa — insira suas credenciais de administrador.'}
          </div>
          
          <form onSubmit={handleSubmit}>
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
                placeholder="Sua senha"
                required
                minLength={6}
              />
              <div className="help">Mínimo de 6 caracteres.</div>
            </div>

            {loginType === 'admin' && (
              <div className="form-group">
                <label className="label" htmlFor="adminCode">Código de administrador</label>
                <input
                  className="input"
                  type="text"
                  id="adminCode"
                  name="adminCode"
                  value={formData.adminCode}
                  onChange={handleChange}
                  placeholder="Código de admin"
                  required={loginType === 'admin'}
                />
              </div>
            )}
            
            <div className="actions">
              <label className="checkbox">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                Lembrar de mim
              </label>
              <Link className="link" to="/forgot-password">Esqueci minha senha</Link>
            </div>
            
            <div className="actions" style={{ justifyContent: 'flex-start', marginTop: 14 }}>
              <button className="btn" type="submit">Entrar</button>
              {loginType === 'user' && <Link className="link" to="/register">Não tem conta? Cadastre-se</Link>}
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </>
  )
}