import React from 'react'
import './Profile_admin.css'
import { Link } from 'react-router-dom'

export default function Profile_admin({ onLogout }) {
  return (
    <div className="profile-admin">
      <div className="admin-avatar">A</div>
      <div className="admin-menu">
        <Link to="/admin" className="admin-link">Painel Admin</Link>
        <button className="admin-logout" onClick={onLogout}>Sair</button>
      </div>
    </div>
  )
}
