import { Link } from 'react-router-dom';
import { Utensils, Home, MoveLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px', textAlign: 'center',
      background: 'radial-gradient(ellipse at center, rgba(124,107,255,0.1) 0%, transparent 60%)',
    }}>
      <div style={{ marginBottom: '24px', opacity: 0.5 }}>
        <Utensils size={80} color="var(--accent)" />
      </div>
      <h1 style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--accent)', marginBottom: '8px' }}>404</h1>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '360px', marginBottom: '28px' }}>
        Oops! This page seems to have left the mess. Let's get you back to familiar ground.
      </p>
      <Link to="/dashboard" className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Home size={18} /> Back to Dashboard
      </Link>
      <p style={{ marginTop: '16px' }}>
        <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <MoveLeft size={14} /> Go to home
        </Link>
      </p>
    </div>
  );
}
