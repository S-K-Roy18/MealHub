import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Wallet, UtensilsCrossed, Bell, User, MoreHorizontal } from 'lucide-react';

export default function BottomNav({ onMoreClick }) {
  const { isManager } = useAuth();

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        <NavLink to="/dashboard" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard />
          <span>Home</span>
        </NavLink>

        {isManager ? (
          <NavLink to="/money-entry" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <Wallet />
            <span>Money</span>
          </NavLink>
        ) : (
          <NavLink to="/money-collected" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <Wallet />
            <span>Money</span>
          </NavLink>
        )}

        {isManager ? (
          <NavLink to="/meal-entry" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <UtensilsCrossed />
            <span>Meals</span>
          </NavLink>
        ) : (
          <NavLink to="/meal-tracking" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <UtensilsCrossed />
            <span>Meals</span>
          </NavLink>
        )}

        <NavLink to="/notifications" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <Bell />
          <span>Alerts</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <User />
          <span>Profile</span>
        </NavLink>

        <button className="bottom-nav-item" onClick={onMoreClick} id="bottom-more-btn">
          <MoreHorizontal />
          <span>More</span>
        </button>
      </div>
    </nav>
  );
}
