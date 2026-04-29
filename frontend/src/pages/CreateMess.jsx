import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Plus, Trash2, Users, Building2, AlertCircle, CheckCircle } from 'lucide-react';

export default function CreateMess() {
  const [messName, setMessName] = useState('');
  const [members, setMembers] = useState([{ username: '', mobile: '', gmail: '' }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const addMember = () => setMembers(m => [...m, { username: '', mobile: '', gmail: '' }]);
  const removeMember = (i) => setMembers(m => m.filter((_, idx) => idx !== i));
  const updateMember = (i, field, value) => {
    setMembers(m => m.map((mem, idx) => idx === i ? { ...mem, [field]: value } : mem));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!messName.trim()) { setError('Mess name is required'); return; }
    setError('');
    setLoading(true);
    try {
      // Filter out empty members
      const validMembers = members.filter(m => m.username && m.mobile && m.gmail);
      await api.post('/mess/create', { name: messName, members: validMembers });
      await refreshUser();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create mess');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px 24px',
      background: 'radial-gradient(ellipse at top left, rgba(124,107,255,0.1) 0%, transparent 50%)',
    }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-3))',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', margin: '0 auto 16px',
          }}>🏠</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create Your Mess</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            Set up your mess and add your members. You'll become the Admin.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error mb-16">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Mess Info */}
          <div className="card mb-16 fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Building2 size={18} color="var(--accent)" />
              <h3>Mess Information</h3>
            </div>
            <div className="form-group">
              <label className="form-label">Mess Name</label>
              <input
                id="mess-name-input"
                type="text"
                className="form-input"
                placeholder="e.g., Roy Mess, Sunrise Hostel..."
                value={messName}
                onChange={e => setMessName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Members */}
          <div className="card mb-24 fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={18} color="var(--accent)" />
                <h3>Add Members</h3>
              </div>
              <button type="button" className="btn btn-secondary btn-sm" onClick={addMember} id="add-member-btn">
                <Plus size={15} /> Add Member
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              💡 Members will get credentials to log in later. Leave blank rows to skip.
            </p>

            {members.map((member, i) => (
              <div key={i} style={{
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                marginBottom: '12px',
                border: '1px solid var(--border-light)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Member {i + 1}
                  </span>
                  {members.length > 1 && (
                    <button type="button" className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => removeMember(i)}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Name</label>
                    <input type="text" className="form-input" placeholder="Full name"
                      value={member.username} onChange={e => updateMember(i, 'username', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile</label>
                    <input type="tel" className="form-input" placeholder="Mobile number"
                      value={member.mobile} onChange={e => updateMember(i, 'mobile', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gmail</label>
                    <input type="email" className="form-input" placeholder="Gmail address"
                      value={member.gmail} onChange={e => updateMember(i, 'gmail', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Preview */}
          {messName && (
            <div className="card mb-24" style={{ background: 'var(--accent-glow)', border: '1px solid rgba(124,107,255,0.3)' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle size={18} color="var(--accent)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '4px' }}>{messName}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {1 + members.filter(m => m.username && m.mobile && m.gmail).length} member(s) · You as Admin 👑
                  </div>
                </div>
              </div>
            </div>
          )}

          <button id="create-mess-btn" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Creating mess...' : '🏠 Create Mess'}
          </button>
        </form>
      </div>
    </div>
  );
}
