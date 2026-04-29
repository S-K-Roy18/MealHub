import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { X, FileText, ShoppingCart, BarChart2, ClipboardList, RefreshCw, Users, Sun, Moon, LogOut } from 'lucide-react';

export default function MobileDrawer({ open, onClose }) {
  const { user, isManager, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  if (!open) return null;

  return (
    <>
      <div className="drawer-overlay visible" onClick={onClose} />
      <div className="sidebar mobile-open" style={{ zIndex: 200 }}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🍽</div>
          <span className="sidebar-logo-text">MealHub</span>
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={onClose}><X size={18} /></button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Money</div>
          <NavLink to="/money-collected" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <FileText size={17} /> Money Collected
          </NavLink>
          {isManager && (
            <NavLink to="/expense-entry" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <ShoppingCart size={17} /> Expense Entry
            </NavLink>
          )}
          <NavLink to="/expense-history" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <BarChart2 size={17} /> Expense History
          </NavLink>
          <div className="sidebar-section-label">Meal</div>
          <NavLink to="/meal-tracking" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <ClipboardList size={17} /> Meal Tracking
          </NavLink>
          <div className="sidebar-section-label">Management</div>
          {user?.isAdmin && (
            <NavLink to="/manager-change" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <RefreshCw size={17} /> Manager Change
            </NavLink>
          )}
          <NavLink to="/members" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <Users size={17} /> Members
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', marginBottom: '4px' }} onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', color: 'var(--danger)' }} onClick={handleLogout}>
            <LogOut size={17} /> Logout
          </button>
        </div>
      </div>
    </>
  );
}
