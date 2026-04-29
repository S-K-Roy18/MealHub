import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import MobileHeader from './MobileHeader';
import MobileDrawer from './MobileDrawer';

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile full-screen drawer */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile top header (hidden on desktop via CSS) */}
        <MobileHeader onMenuOpen={() => setDrawerOpen(true)} />

        <main className="main-content">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav (hidden on desktop via CSS) */}
      <BottomNav onMoreClick={() => setDrawerOpen(true)} />
    </div>
  );
}
