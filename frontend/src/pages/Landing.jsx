import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Users, ChefHat, BarChart2, Smartphone, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

const features = [
  { icon: TrendingUp, title: 'Track Expenses', desc: 'Log daily expenses with item-level detail. Filter by date, meal type, and more.' },
  { icon: ChefHat, title: 'Manage Meals', desc: 'Record lunch and dinner for each member. Auto-calculate per-meal costs.' },
  { icon: BarChart2, title: 'Smart Calculation', desc: 'Auto-compute money due/extra per member based on meals eaten.' },
  { icon: Shield, title: 'Security First', desc: 'Enterprise-grade encryption and role-based access for your mess data.' },
  { icon: Users, title: 'Team Management', desc: 'Add members, assign monthly managers, view full mess history.' },
  { icon: Smartphone, title: 'Mobile First', desc: 'Beautiful responsive design that works perfectly on any device.' },
];

export default function Landing() {
  return (
    <div className="mesh-bg" style={{ minHeight: '100vh', overflowX: 'hidden', color: 'var(--text-primary)' }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 5vw',
        zIndex: 100,
        background: 'rgba(13, 15, 26, 0.7)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 0 20px var(--accent-glow)',
          }}>
            <img src="/favicon.png" alt="MealHub" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{
            fontSize: '1.4rem', fontWeight: 900, fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
          }} className="text-gradient">MealHub</span>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link to="/login" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Login</Link>
          <Link to="/signup" className="btn btn-primary" style={{ borderRadius: '12px', padding: '10px 24px' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '160px 5vw 80px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '60px',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <div className="fade-in">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px',
            background: 'rgba(124, 107, 255, 0.08)',
            border: '1px solid rgba(124, 107, 255, 0.2)',
            borderRadius: '999px',
            fontSize: '0.85rem',
            color: 'var(--accent)',
            fontWeight: 700,
            marginBottom: '32px',
          }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent)' }} />
            The Future of Mess Management
          </div>

          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            marginBottom: '24px',
          }} className="text-gradient">
            Eat Together,<br />Manage Smarter.
          </h1>

          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            color: 'var(--text-secondary)',
            maxWidth: '540px',
            lineHeight: 1.6,
            marginBottom: '40px',
          }}>
            The #1 platform for shared kitchen tracking. Built for modern shared living. Track meals, manage expenses, and simplify mess operations effortlessly.
          </p>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn btn-primary btn-lg" style={{ borderRadius: '16px', padding: '16px 32px' }}>
              Start for Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg" style={{ borderRadius: '16px', padding: '16px 32px', border: '1px solid var(--border)' }}>
              Login to Mess
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '24px', marginTop: '48px' }}>
            {['1,000+ Users', '99.9% Uptime', '24/7 Support'].map(text => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                <CheckCircle2 size={16} color="var(--accent)" /> {text}
              </div>
            ))}
          </div>
        </div>

        <div className="fade-in animate-float" style={{ animationDelay: '0.2s', position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: '-20px',
            background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
            zIndex: -1,
          }} />
          <div style={{
            borderRadius: '32px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)',
          }}>
            <img src="/mealhub_hero_image.png" alt="MealHub Dashboard" style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section style={{
        padding: '60px 5vw',
        background: 'rgba(255, 255, 255, 0.02)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '8vw', flexWrap: 'wrap',
          maxWidth: '1200px', margin: '0 auto',
        }}>
          {[
            ['150k+', 'Meals Tracked'],
            ['₹2.5M+', 'Expenses Split'],
            ['12k+', 'Active Members'],
            ['4.9/5', 'User Rating'],
          ].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#fff' }}>{val}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '120px 5vw', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            marginBottom: '16px',
          }} className="text-gradient">Powering Your Mess Experience</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Stop wasting time with spreadsheets and manual notes. MealHub does the heavy lifting for you.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
          {features.map((f, i) => (
            <div key={i} className="glass-card" style={{
              padding: '40px',
              borderRadius: '24px',
              transition: 'all 0.3s ease',
              cursor: 'default',
            }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{
                width: '56px', height: '56px',
                background: 'linear-gradient(135deg, rgba(124, 107, 255, 0.1), rgba(255, 107, 157, 0.1))',
                borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '24px',
                color: 'var(--accent)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <f.icon size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '100px 5vw 140px' }}>
        <div className="glass-card" style={{
          maxWidth: '1000px', margin: '0 auto',
          padding: '80px 40px',
          borderRadius: '40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'radial-gradient(circle at top right, rgba(124, 107, 255, 0.1), transparent 70%)',
        }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            marginBottom: '24px',
          }} className="text-gradient">Ready to automate your mess?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Join thousands of students and office mates who already use MealHub.
          </p>
          <Link to="/signup" className="btn btn-primary btn-lg" style={{ borderRadius: '16px', padding: '18px 48px', fontSize: '1.2rem' }}>
            Get Started Now — It's Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '60px 5vw',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src="/favicon.png" alt="MealHub" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>MealHub</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          © {new Date().getFullYear()} MealHub Mess Management System. Built for shared living. By SURYA.
        </p>
      </footer>
    </div>
  );
}
