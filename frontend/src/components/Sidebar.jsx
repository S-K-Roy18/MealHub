import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, Wallet, FileText, ShoppingCart, BarChart2,
  UtensilsCrossed, ClipboardList, RefreshCw, Users, Bell, User,
  Sun, Moon, LogOut
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    label: 'Main',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['all'] },
    ]
  },
  {
    label: 'Money',
    items: [
      { to: '/money-entry', icon: Wallet, label: 'Money Entry', roles: ['manager'] },
      { to: '/money-collected', icon: FileText, label: 'Money Collected', roles: ['all'] },
    ]
  },
  {
    label: 'Expense',
    items: [
      { to: '/expense-entry', icon: ShoppingCart, label: 'Expense Entry', roles: ['manager'] },
      { to: '/expense-history', icon: BarChart2, label: 'Expense History', roles: ['all'] },
    ]
  },
  {
    label: 'Meal',
    items: [
      { to: '/meal-entry', icon: UtensilsCrossed, label: 'Meal Entry', roles: ['manager'] },
      { to: '/meal-tracking', icon: ClipboardList, label: 'Meal Tracking', roles: ['all'] },
    ]
  },
  {
    label: 'Management',
    items: [
      { to: '/manager-change', icon: RefreshCw, label: 'Manager Change', roles: ['admin'] },
      { to: '/members', icon: Users, label: 'Members', roles: ['all'] },
    ]
  },
];

export default function Sidebar() {
  const { user, isManager, mess, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const canSee = (roles) => {
    if (roles.includes('all')) return true;
    if (roles.includes('admin') && user?.isAdmin) return true;
    if (roles.includes('manager') && isManager) return true;
    return false;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      {/* Logo + Mess Name */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🍽</div>
        <div style={{ overflow: 'hidden' }}>
          <div className="sidebar-logo-text">MealHub</div>
          {mess && (
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {mess.name}
            </div>
          )}
        </div>
      </div>

      {/* User info */}
      {user && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, color: '#fff', fontSize: '0.9rem', flexShrink: 0
            }}>
              {user.username?.[0]?.toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.username}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {user.isAdmin ? '👑 Admin' : isManager ? '🍽 Manager' : '👤 Member'}
                {user.isAdmin && isManager ? ' · Manager' : ''}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_SECTIONS.map(section => {
          const visibleItems = section.items.filter(item => canSee(item.roles));
          if (visibleItems.length === 0) return null;
          return (
            <div key={section.label}>
              <div className="sidebar-section-label">{section.label}</div>
              {visibleItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={17} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          );
        })}

        <div style={{ marginTop: '8px' }}>
          <div className="sidebar-section-label">Account</div>
          <NavLink to="/notifications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Bell size={17} /> Notifications
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <User size={17} /> Profile
          </NavLink>
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="sidebar-link w-full" style={{ background: 'none', border: 'none', marginBottom: '4px' }} onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button className="sidebar-link w-full" style={{ background: 'none', border: 'none', color: 'var(--danger)' }} onClick={handleLogout}>
          <LogOut size={17} /> Logout
        </button>
      </div>
    </aside>
  );
}
