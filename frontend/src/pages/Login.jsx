import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Smartphone, Mail, ArrowRight, Info } from 'lucide-react';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [gmail, setGmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false); // shows hint before redirect
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotFound(false);
    setLoading(true);
    try {
      const data = await login(mobile, gmail);
      // ✅ Match found
      if (!data.user.messId) {
        // Logged in but no mess yet → create mess
        navigate('/create-mess');
      } else {
        // Has a mess → go to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 400) {
        // ❌ No match → show brief message then redirect to signup
        setNotFound(true);
        setTimeout(() => {
          // Pre-fill signup form via URL params
          navigate(`/signup?mobile=${encodeURIComponent(mobile)}&gmail=${encodeURIComponent(gmail)}`);
        }, 1800);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(ellipse at top, rgba(124,107,255,0.12) 0%, transparent 60%)',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem', margin: '0 auto 16px',
          }}>🍽</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Login to your MealHub account</p>
        </div>

        <div className="card fade-in" style={{ padding: '28px' }}>

          {/* Not found → redirecting hint */}
          {notFound && (
            <div style={{
              padding: '14px 16px',
              background: 'var(--info-bg)',
              border: '1px solid rgba(56,189,248,0.25)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '20px',
              display: 'flex', alignItems: 'flex-start', gap: '10px',
            }}>
              <Info size={16} color="var(--info)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--info)', fontSize: '0.875rem' }}>
                  Account not found
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                  Redirecting you to Sign Up…
                </div>
              </div>
              {/* Spinner */}
              <div style={{
                marginLeft: 'auto', flexShrink: 0,
                width: '18px', height: '18px',
                border: '2px solid var(--info-bg)',
                borderTopColor: 'var(--info)',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
              }} />
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-16">
              <label className="form-label">Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <Smartphone size={16} style={{
                  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }} />
                <input
                  id="login-mobile"
                  type="tel"
                  className="form-input"
                  style={{ paddingLeft: '36px' }}
                  placeholder="Enter your mobile number"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  required
                  disabled={notFound}
                />
              </div>
            </div>

            <div className="form-group mb-24">
              <label className="form-label">Gmail Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{
                  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }} />
                <input
                  id="login-gmail"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '36px' }}
                  placeholder="Enter your Gmail"
                  value={gmail}
                  onChange={e => setGmail(e.target.value)}
                  required
                  disabled={notFound}
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Both must match your registered account
              </p>
            </div>

            <button
              id="login-btn"
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading || notFound}
            >
              {loading ? 'Checking…' : (<>Login <ArrowRight size={18} /></>)}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            New here?{' '}
            <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 600 }}>Create account</Link>
          </p>
        </div>

        {/* Flow diagram hint */}
        <div style={{
          marginTop: '20px',
          padding: '14px 16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>ℹ️ How it works</div>
          <div>✅ <strong>Match found</strong> → Straight to your dashboard</div>
          <div>❌ <strong>No match</strong> → Redirected to Sign Up automatically</div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
