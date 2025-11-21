import React, { useState, useRef, useEffect } from 'react';
import './Profile_user.css';

export default function Profile_user({
  user = {},
  onLogout = () => {},
  onChangeEmail = () => {},
  onChangePassword = () => {},
  onDeleteAccount = () => {}
}) {
  const { name = 'Usuário', email = 'email@exemplo.com', photo } = user;
  const initial = name ? name.charAt(0).toUpperCase() : 'U';

  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    }
    function handleEsc(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  function toggle() {
    setOpen(v => !v);
  }

  return (
    <div className="profile-user dropdown" ref={rootRef}>
      <button
        type="button"
        className="profile-btn"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={toggle}
        aria-label="Abrir menu do usuário"
      >
        {photo ? (
          <img src={photo} alt={`${name} avatar`} className="profile-btn-img" />
        ) : (
          <div className="avatar-fallback small" aria-hidden="true">{initial}</div>
        )}
      </button>

      {open && (
        <div className="dropdown-menu" role="menu" aria-label="Menu de perfil">
          <div className="menu-header">
            <div className="menu-avatar">
              {photo ? <img src={photo} alt="avatar" /> : <div className="avatar-fallback">{initial}</div>}
            </div>
            <div className="menu-user">
              <div className="menu-name">{name}</div>
              <div className="menu-email">{email}</div>
            </div>
          </div>

          <div className="menu-list">
            <button className="menu-item" type="button" onClick={() => { setOpen(false); /* opcional: ir para perfil */ }}>Meu perfil</button>
            <button className="menu-item" type="button" onClick={() => { setOpen(false); onChangeEmail(); }}>Alterar e-mail</button>
            <button className="menu-item" type="button" onClick={() => { setOpen(false); onChangePassword(); }}>Alterar senha</button>
            <button className="menu-item delete" type="button" onClick={() => { setOpen(false); onDeleteAccount(); }}>Deletar conta</button>
            <div className="menu-divider" />
            <button className="menu-item logout" type="button" onClick={() => { setOpen(false); onLogout(); }}>Sair</button>
          </div>
        </div>
      )}
    </div>
  );
}