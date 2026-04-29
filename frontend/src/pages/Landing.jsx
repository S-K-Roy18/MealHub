import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Users, ChefHat, BarChart2, Smartphone } from 'lucide-react';

const features = [
  { icon: TrendingUp, title: 'Track Expenses', desc: 'Log daily expenses with item-level detail. Filter by date, meal type, and more.' },
  { icon: ChefHat, title: 'Manage Meals', desc: 'Record lunch and dinner for each member. Auto-calculate per-meal costs.' },
  { icon: BarChart2, title: 'Smart Calculation', desc: 'Auto-compute money due/extra per member based on meals eaten.' },
  { icon: Shield, title: 'Role-Based Access', desc: 'Admin, Manager, and Member roles with fine-grained permissions.' },
  { icon: Users, title: 'Team Management', desc: 'Add members, assign monthly managers, view full mess history.' },
  { icon: Smartphone, title: 'Mobile First', desc: 'Beautiful responsive design that works perfectly on any device.' },
];

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Header */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        background: 'rgba(13, 15, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem',
          }}>🍽</div>
          <span style={{
            fontSize: '1.2rem', fontWeight: 800,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>MealHub</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
          <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '100px 24px 60px',
        position: 'relative',
        textAlign: 'center',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(124,107,255,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '10%',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(255,107,157,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="fade-in">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px',
            background: 'var(--accent-glow)',
            border: '1px solid rgba(124,107,255,0.3)',
            borderRadius: '999px',
            fontSize: '0.8rem',
            color: 'var(--accent)',
            fontWeight: 600,
            marginBottom: '24px',
          }}>
            ✨ Smart Mess Management
          </div>

          <h1 style={{
            fontSize: 'clamp(2.8rem, 7vw, 5rem)',
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #e8e8ff 0%, var(--accent) 60%, var(--accent-2) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            MealHub
          </h1>

          <p style={{
            fontSize: 'clamp(1.1rem, 2.8vw, 1.5rem)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            opacity: 0.85,
            marginBottom: '24px',
            letterSpacing: '-0.01em',
          }}>
            Eat Together, Manage Smarter
          </p>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            margin: '0 auto 36px',
            lineHeight: 1.7,
          }}>
            The complete mess management system. Track meals, split expenses fairly, and manage your shared kitchen effortlessly.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn btn-primary btn-lg">
              Get Started Free →
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Login to Mess
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap',
            marginTop: '48px',
          }}>
            {[['3 Roles', 'Admin • Manager • Member'], ['Auto-Calculate', 'Per meal cost'], ['Monthly', 'Expense tracking']].map(([val, label]) => (
              <div key={val} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent)' }}>{val}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>Everything Your Mess Needs</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Powerful features designed for real mess management</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{
                width: '44px', height: '44px',
                background: 'var(--accent-glow)',
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '14px',
                color: 'var(--accent)',
              }}>
                <f.icon size={22} />
              </div>
              <h3 style={{ marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 24px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(124,107,255,0.1) 0%, rgba(255,107,157,0.05) 100%)',
        borderTop: '1px solid var(--border)',
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>Ready to Start?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>Create your mess in minutes. No credit card required.</p>
        <Link to="/signup" className="btn btn-primary btn-lg">Create Your Mess →</Link>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        borderTop: '1px solid var(--border)',
      }}>
        🍽 MealHub — Eat Together, Manage Smarter · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
