import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import headerBar from '../../assets/header-bar.png'
import './Header.css'
import Profile_user from '../profile_user/Profile_user'

export default function Header(){
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  // Atualiza o estado do usuário a partir do localStorage
  function updateUserFromStorage() {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('email') || localStorage.getItem('userEmail') || ''
    if (token) setUser({ token, email })
    else setUser(null)
  }

  useEffect(() => {
    updateUserFromStorage()

    // Ouvir eventos de storage (para outras abas) e eventos customizados de auth
    const onStorage = (e) => {
      if (e.key === 'token' || e.key === 'email' || e.key === 'userEmail') updateUserFromStorage()
    }
    const onAuthChanged = () => updateUserFromStorage()

    window.addEventListener('storage', onStorage)
    window.addEventListener('auth-changed', onAuthChanged)

    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('auth-changed', onAuthChanged)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('loginType')
    localStorage.removeItem('email')
    localStorage.removeItem('userEmail')
    setUser(null)
    // notificar outras partes da app
    window.dispatchEvent(new Event('auth-changed'))
    // dropdown removed; just reset user
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
          <Profile_user
            user={{ name: '', email: user.email }}
            onLogout={handleLogout}
            onChangeEmail={handleChangeEmail}
            onChangePassword={handleChangePassword}
            onDeleteAccount={handleDeleteAccount}
          />
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
