import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import headerBar from '../../assets/header-bar.png'
import './Header.css'

export default function Header(){
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('email') || localStorage.getItem('userEmail')
    if (token && email) {
      setUser({ token, email })
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('loginType')
    localStorage.removeItem('email')
    localStorage.removeItem('userEmail')
    setUser(null)
    setDropdownOpen(false)
    navigate('/')
  }

  const handleChangePassword = () => {
    const newPassword = prompt('Digite a nova senha:')
    if (newPassword && newPassword.length >= 6) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
      fetch(`${backendUrl}/auth/password`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ newPassword })
      })
        .then(res => res.json())
        .then(data => {
          if (data.ok) {
            alert('Senha alterada com sucesso!')
            setDropdownOpen(false)
          } else {
            alert(data.error || 'Erro ao alterar senha')
          }
        })
        .catch(err => alert('Erro ao conectar: ' + err.message))
    } else if (newPassword) {
      alert('Senha deve ter pelo menos 6 caracteres')
    }
  }

  const handleChangeEmail = () => {
    const newEmail = prompt('Digite o novo e-mail:')
    if (newEmail && newEmail.includes('@')) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
      fetch(`${backendUrl}/auth/email`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ newEmail })
      })
        .then(res => res.json())
        .then(data => {
          if (data.ok) {
            localStorage.setItem('userEmail', newEmail)
            setUser({ ...user, email: newEmail })
            alert('E-mail alterado com sucesso!')
            setDropdownOpen(false)
          } else {
            alert(data.error || 'Erro ao alterar e-mail')
          }
        })
        .catch(err => alert('Erro ao conectar: ' + err.message))
    } else if (newEmail) {
      alert('E-mail inválido')
    }
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.')) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
      fetch(`${backendUrl}/auth/account`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.ok) {
            alert('Conta deletada com sucesso')
            handleLogout()
          } else {
            alert(data.error || 'Erro ao deletar conta')
          }
        })
        .catch(err => alert('Erro ao conectar: ' + err.message))
    }
  }

  return (
    <header className="header">
      <Link className="logo-link" to="/" aria-label="Voltar para a página inicial"></Link>
      <img src={headerBar} alt="JaguarLoca" className="header-image" />
      <div className="header-buttons">
        {user ? (
          <div className="profile-dropdown">
            <button 
              className="btn-profile" 
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              👤 {user.email}
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={handleChangeEmail} className="dropdown-item">
                  📧 Trocar E-mail
                </button>
                <button onClick={handleChangePassword} className="dropdown-item">
                  🔐 Trocar Senha
                </button>
                <button onClick={handleDeleteAccount} className="dropdown-item delete">
                  🗑️ Apagar Conta
                </button>
                <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid rgba(255,255,255,0.2)' }} />
                <button onClick={handleLogout} className="dropdown-item logout">
                  🚪 Sair
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link className="btn-login" to="/login">Login</Link>
            <Link className="btn-register" to="/register">Cadastrar-se</Link>
          </>
        )}
      </div>
    </header>
  )
}
