import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';
import { User, Smartphone, Mail, Sun, Moon, CheckCircle, AlertCircle, Shield, Save, Settings } from 'lucide-react';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState(user?.username || '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await api.put('/auth/profile', { username });
      await refreshUser();
      setSuccess('Profile updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <User size={28} color="var(--accent)" /> Profile
        </h1>
        <p>Manage your account settings</p>
      </div>

      <div style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Avatar Card */}
        <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
          <div style={{
            width: '80px', height: '80px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: '#fff', fontSize: '2rem',
            margin: '0 auto 16px',
            boxShadow: '0 0 30px var(--accent-glow)',
          }}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <h2 style={{ marginBottom: '4px' }}>{user?.username}</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
            {user?.isAdmin && <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Shield size={12} /> Admin</span>}
            <span className="badge badge-info">Mess Member</span>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Edit Profile</h3>

          {error && <div className="alert alert-error"><AlertCircle size={15} />{error}</div>}
          {success && <div className="alert alert-success"><CheckCircle size={15} />{success}</div>}

          <form onSubmit={handleSave}>
            <div className="form-group mb-16">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="profile-username"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '34px' }}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group mb-16">
              <label className="form-label">Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <Smartphone size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="tel"
                  className="form-input"
                  style={{ paddingLeft: '34px', opacity: 0.6 }}
                  value={user?.mobile || ''}
                  readOnly
                />
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px' }}>Mobile cannot be changed (used for login)</p>
            </div>

            <div className="form-group mb-24">
              <label className="form-label">Gmail</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '34px', opacity: 0.6 }}
                  value={user?.gmail || ''}
                  readOnly
                />
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px' }}>Gmail cannot be changed (used for login)</p>
            </div>

            <button id="profile-save-btn" type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
            </button>
          </form>
        </div>

        {/* Theme Toggle */}
        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={18} color="var(--accent)" /> Preferences
          </h3>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 16px',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-sm)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {theme === 'dark' ? <Moon size={18} color="var(--accent)" /> : <Sun size={18} color="var(--warning)" />}
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {theme === 'dark' ? 'Currently using dark theme' : 'Currently using light theme'}
                </div>
              </div>
            </div>
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              style={{
                width: '52px', height: '28px',
                borderRadius: '14px',
                background: theme === 'dark' ? 'var(--accent)' : 'var(--border)',
                border: 'none',
                position: 'relative',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              <span style={{
                position: 'absolute',
                top: '3px',
                left: theme === 'dark' ? '26px' : '3px',
                width: '22px', height: '22px',
                borderRadius: '50%',
                background: '#fff',
                transition: 'var(--transition)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
              }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
