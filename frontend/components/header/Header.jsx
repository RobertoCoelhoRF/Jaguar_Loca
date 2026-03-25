import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import headerBar from '../../assets/header-bar.png'
import './Header.css'
import Profile_user from '../profile_user/Profile_user'
import Profile_admin from '../profile_admin/Profile_admin'
import { useModalContext } from '../../context/ModalContext'

export default function Header(){
  const modal = useModalContext()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  // Atualiza o estado do usuário a partir do localStorage
  function updateUserFromStorage() {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('email') || localStorage.getItem('userEmail') || ''
    const loginType = localStorage.getItem('loginType') || ''
    if (token) setUser({ token, email, loginType })
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
    modal.show({
      title: 'Alterar Senha',
      message: 'Digite a nova senha abaixo:',
      type: 'warning',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      inputConfig: { placeholder: 'Nova senha (mínimo 6 caracteres)', type: 'password' },
      onConfirm: (newPassword) => {
        if (!newPassword) return
        if (newPassword.length < 6) {
          modal.alert('Senha deve ter pelo menos 6 caracteres', 'warning')
          return
        }
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
              modal.success('Senha alterada com sucesso!', 'Sucesso!')
            } else {
              modal.error(data.error || 'Erro ao alterar senha', 'Erro')
            }
          })
          .catch(err => modal.error('Erro ao conectar: ' + err.message, 'Falha na conexão'))
      }
    })
  }

  const handleChangeEmail = () => {
    modal.show({
      title: 'Alterar E-mail',
      message: 'Digite o novo endereço de e-mail abaixo:',
      type: 'info',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      inputConfig: { placeholder: 'novo@email.com', type: 'email' },
      onConfirm: (newEmail) => {
        if (!newEmail) return
        if (!newEmail.includes('@')) {
          modal.alert('E-mail inválido', 'warning')
          return
        }
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
              modal.success('E-mail alterado com sucesso!', 'Sucesso!')
            } else {
              modal.error(data.error || 'Erro ao alterar e-mail', 'Erro')
            }
          })
          .catch(err => modal.error('Erro ao conectar: ' + err.message, 'Falha na conexão'))
      }
    })
  }

  const handleDeleteAccount = () => {
    modal.confirm(
      'Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita e todos os seus dados serão permanentemente removidos.',
      () => {
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
              modal.success('Conta deletada com sucesso', 'Sucesso!')
              handleLogout()
            } else {
              modal.error(data.error || 'Erro ao deletar conta', 'Erro')
            }
          })
          .catch(err => modal.error('Erro ao conectar: ' + err.message, 'Falha na conexão'))
      },
      'Deletar Conta',
      'Sim, deletar',
      'Cancelar'
    )
  }

  const goToMyReservations = () => {
    navigate('/minhas-reservas')
  }

  return (
    <header className="header">
      <Link className="logo-link" to="/" aria-label="Voltar para a página inicial"></Link>
      <img src={headerBar} alt="JaguarLoca" className="header-image" />
      <div className="header-buttons">
        {user ? (
          user.loginType === 'admin' ? (
            <Profile_admin onLogout={handleLogout} />
          ) : (
            <Profile_user
              user={{ name: '', email: user.email }}
              onLogout={handleLogout}
              onChangeEmail={handleChangeEmail}
              onChangePassword={handleChangePassword}
              onDeleteAccount={handleDeleteAccount}
              onMyReservations={goToMyReservations}
            />
          )
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
