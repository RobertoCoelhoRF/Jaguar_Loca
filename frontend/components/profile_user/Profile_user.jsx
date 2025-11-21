import React from 'react';
import './Profile_user.css';

/**
 * Profile_user component
 * Props:
 * - user: { name, email, photo }
 * - onLogout: function
 *
 * Usage example:
 * <Profile_user user={{name: 'Roberto', email: 'r@example.com', photo: null}} onLogout={() => signOut()} />
 */
export default function Profile_user({ user = {}, onLogout = () => {} }) {
  const { name = 'Usuário', email = 'email@exemplo.com', photo } = user;
  const initial = name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="profile-user">
      <div className="profile-card" role="dialog" aria-label="Profile menu">
        <div className="profile-avatar">
          {photo ? (
            <img src={photo} alt={`${name} avatar`} />
          ) : (
            <div className="avatar-fallback" aria-hidden="true">{initial}</div>
          )}
        </div>

        <div className="profile-info">
          <div className="profile-name">{name}</div>
          <div className="profile-email">{email}</div>
        </div>

        <button type="button" className="profile-logout" onClick={onLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}
