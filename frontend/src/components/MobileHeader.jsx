import { NavLink } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MobileHeader({ onMenuOpen }) {
  const { mess, user } = useAuth();

  return (
    <header style={{
      display: 'none',
      position: 'sticky',
      top: 0,
      left: 0,
      right: 0,
      height: '56px',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      zIndex: 50,
      backdropFilter: 'blur(10px)',
    }} id="mobile-header">
      {/* Hamburger */}
      <button
        id="mobile-menu-btn"
        onClick={onMenuOpen}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          padding: '6px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Menu size={22} />
      </button>

      {/* Center — Mess name */}
      <div style={{ textAlign: 'center', flex: 1, padding: '0 8px' }}>
        <div style={{
          fontWeight: 800,
          fontSize: '0.95rem',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          🍽 {mess?.name || 'MealHub'}
        </div>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '-1px' }}>
          {user?.username}
        </div>
      </div>

      {/* Notifications bell */}
      <NavLink
        to="/notifications"
        id="mobile-notif-btn"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          padding: '6px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Bell size={20} />
      </NavLink>
    </header>
  );
}
