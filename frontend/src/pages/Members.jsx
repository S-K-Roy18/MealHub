import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { UserPlus, X, AlertCircle, CheckCircle, Edit2, Trash2, Save, RotateCcw } from 'lucide-react';

export default function Members() {
  const { user, isManager } = useAuth();
  const [members, setMembers] = useState([]);
  const [currentManagerId, setCurrentManagerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ username: '', mobile: '', gmail: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [adding, setAdding] = useState(false);

  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', mobile: '', gmail: '' });
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/mess');
      setMembers(res.data.mess.members || []);
      setCurrentManagerId(res.data.currentManagerId?.toString() || null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!form.username || !form.mobile || !form.gmail) { setError('All fields required'); return; }
    setAdding(true); setError(''); setSuccess('');
    try {
      await api.post('/mess/add-member', form);
      setSuccess(`✅ ${form.username} added to the mess!`);
      setForm({ username: '', mobile: '', gmail: '' });
      setShowAddForm(false);
      fetchData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setAdding(false);
    }
  };

  const startEditing = (member) => {
    setEditingId(member._id);
    setEditForm({ username: member.username, mobile: member.mobile, gmail: member.gmail });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ username: '', mobile: '', gmail: '' });
  };

  const handleUpdate = async (id) => {
    if (!editForm.username || !editForm.mobile || !editForm.gmail) { setError('All fields required'); return; }
    setUpdating(true); setError(''); setSuccess('');
    try {
      await api.put(`/mess/update-member/${id}`, editForm);
      setSuccess('✅ Member info updated');
      setEditingId(null);
      fetchData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from the mess?`)) return;
    try {
      await api.delete(`/mess/remove-member/${id}`);
      setSuccess(`🗑️ ${name} removed from mess`);
      fetchData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const getRole = (member) => {
    const roles = [];
    const id = member._id?.toString();
    if (member.isAdmin) roles.push({ label: '👑 Admin', cls: 'badge-warning' });
    if (currentManagerId && id === currentManagerId) roles.push({ label: '🍽 Manager', cls: 'badge-accent' });
    if (!member.isAdmin && !(currentManagerId && id === currentManagerId)) {
      roles.push({ label: '👤 Member', cls: 'badge-info' });
    }
    return roles;
  };

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1>👥 Members</h1>
          <p>{members.length} member{members.length !== 1 ? 's' : ''} in this mess</p>
        </div>
        {user?.isAdmin && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(v => !v)} id="add-member-toggle-btn">
            {showAddForm ? <><X size={15} /> Cancel</> : <><UserPlus size={15} /> Add Member</>}
          </button>
        )}
      </div>

      {/* Success alert */}
      {success && <div className="alert alert-success mb-16"><CheckCircle size={15} />{success}</div>}
      {error && <div className="alert alert-error mb-16"><AlertCircle size={15} />{error}</div>}

      {/* Add Member Form (Admin only) */}
      {showAddForm && user?.isAdmin && (
        <div className="card mb-20 fade-in" style={{ borderColor: 'var(--accent)', borderWidth: '1px' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={18} color="var(--accent)" /> Add New Member
          </h3>
          <form onSubmit={handleAddMember}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input id="new-member-name" type="text" className="form-input" placeholder="Member's name"
                  value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile</label>
                <input id="new-member-mobile" type="tel" className="form-input" placeholder="Mobile number"
                  value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Gmail</label>
                <input id="new-member-gmail" type="email" className="form-input" placeholder="Gmail address"
                  value={form.gmail} onChange={e => setForm(f => ({ ...f, gmail: e.target.value }))} required />
              </div>
            </div>
            <button id="add-member-submit-btn" type="submit" className="btn btn-primary" disabled={adding}>
              {adding ? 'Adding...' : <><UserPlus size={15} /> Add to Mess</>}
            </button>
          </form>
        </div>
      )}

      {/* Members Table */}
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Member</th>
                <th>Mobile</th>
                <th>Role (This Month)</th>
                {user?.isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => {
                const roles = getRole(m);
                const isMe = m._id?.toString() === user?._id?.toString();
                const isEditing = editingId === m._id;

                return (
                  <tr key={m._id || i}>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{i + 1}</td>
                    <td>
                      {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <input 
                            className="form-input" 
                            style={{ padding: '4px 8px', fontSize: '0.875rem' }} 
                            value={editForm.username} 
                            onChange={e => setEditForm(f => ({...f, username: e.target.value}))}
                            placeholder="Name"
                          />
                          <input 
                            className="form-input" 
                            style={{ padding: '4px 8px', fontSize: '0.72rem' }} 
                            value={editForm.gmail} 
                            onChange={e => setEditForm(f => ({...f, gmail: e.target.value}))}
                            placeholder="Gmail"
                          />
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px', height: '36px',
                            background: `hsl(${(m.username?.charCodeAt(0) || 65) * 5}, 65%, 55%)`,
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, color: '#fff', fontSize: '0.875rem', flexShrink: 0
                          }}>
                            {m.username?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {m.username}
                              {isMe && <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>You</span>}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.gmail}</div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      {isEditing ? (
                        <input 
                          className="form-input" 
                          style={{ padding: '4px 8px', fontSize: '0.875rem' }} 
                          value={editForm.mobile} 
                          onChange={e => setEditForm(f => ({...f, mobile: e.target.value}))}
                          placeholder="Mobile"
                        />
                      ) : m.mobile}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {roles.map((r, ri) => (
                          <span key={ri} className={`badge ${r.cls}`}>{r.label}</span>
                        ))}
                      </div>
                    </td>
                    {user?.isAdmin && (
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {isEditing ? (
                            <>
                              <button 
                                className="btn btn-primary btn-sm" 
                                style={{ padding: '4px 8px' }}
                                onClick={() => handleUpdate(m._id)}
                                disabled={updating}
                              >
                                {updating ? '...' : <Save size={14} />}
                              </button>
                              <button 
                                className="btn btn-secondary btn-sm" 
                                style={{ padding: '4px 8px' }}
                                onClick={cancelEditing}
                              >
                                <RotateCcw size={14} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                className="btn btn-secondary btn-sm" 
                                style={{ padding: '4px 8px' }}
                                onClick={() => startEditing(m)}
                              >
                                <Edit2 size={14} />
                              </button>
                              {!isMe && (
                                <button 
                                  className="btn btn-sm" 
                                  style={{ padding: '4px 8px', color: '#ff4444', border: '1px solid #ff444422' }}
                                  onClick={() => handleRemove(m._id, m.username)}
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
