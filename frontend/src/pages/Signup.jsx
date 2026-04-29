import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Smartphone, Mail, ArrowRight } from 'lucide-react';

export default function Signup() {
  const [searchParams] = useSearchParams();

  // Pre-fill from login redirect (if mobile/gmail were typed on login page)
  const [form, setForm] = useState({
    username: '',
    mobile: searchParams.get('mobile') || '',
    gmail: searchParams.get('gmail') || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const comingFromLogin = !!(searchParams.get('mobile') || searchParams.get('gmail'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(form.username, form.mobile, form.gmail);
      // After signup → always go to create-mess (new user has no mess)
      navigate('/create-mess');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(ellipse at top, rgba(255,107,157,0.1) 0%, transparent 60%)',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg, var(--accent-2), var(--accent))',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem', margin: '0 auto 16px',
          }}>🍽</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create Account</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
            Join MealHub and manage your mess
          </p>
        </div>

        {/* "Redirected from login" hint */}
        {comingFromLogin && (
          <div style={{
            padding: '12px 16px',
            background: 'var(--accent-glow)',
            border: '1px solid rgba(124,107,255,0.3)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '20px',
            fontSize: '0.82rem',
            color: 'var(--accent)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            ✨ Your mobile &amp; Gmail are pre-filled — just enter your name!
          </div>
        )}

        <div className="card fade-in" style={{ padding: '28px' }}>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '16px' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-16">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="signup-username"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '36px' }}
                  placeholder="Your full name"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  autoFocus={comingFromLogin}
                  required
                />
              </div>
            </div>

            <div className="form-group mb-16">
              <label className="form-label">Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <Smartphone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="signup-mobile"
                  type="tel"
                  className="form-input"
                  style={{ paddingLeft: '36px' }}
                  placeholder="Your mobile number"
                  value={form.mobile}
                  onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="form-group mb-24">
              <label className="form-label">Gmail Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="signup-gmail"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '36px' }}
                  placeholder="yourname@gmail.com"
                  value={form.gmail}
                  onChange={e => setForm(f => ({ ...f, gmail: e.target.value }))}
                  required
                />
              </div>
            </div>

            <button
              id="signup-btn"
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
            >
              {loading ? 'Creating account…' : (<>Create Account <ArrowRight size={18} /></>)}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Login</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
