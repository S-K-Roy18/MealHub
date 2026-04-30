import { useState, useEffect } from 'react';
import api from '../api/axios';
import { CheckCircle, AlertCircle } from 'lucide-react';

const MONTHS = [
  { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
  { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
  { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
  { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' },
];

import { useAuth } from '../context/AuthContext';

export default function ManagerChange() {
  const { refreshUser } = useAuth();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [memberId, setMemberId] = useState('');
  const [members, setMembers] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [messRes, histRes] = await Promise.all([
        api.get('/mess'),
        api.get('/mess/manager-history'),
      ]);
      setMembers(messRes.data.mess.members || []);
      setHistory(histRes.data.managers || []);
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!memberId) { setError('Please select a member'); return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      await api.put('/mess/set-manager', { memberId, month, year });
      await refreshUser();
      setSuccess(`✅ Manager updated for ${MONTHS.find(m => m.value === month)?.label} ${year}`);
      fetchData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update manager');
    } finally {
      setLoading(false);
    }
  };

  // Calculate per meal cost for each historical month
  const getPerMealCost = (m, y) => {
    // This would need expense + meal data per month — return N/A for now unless backend provides it
    return null;
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>🔄 Manager Change</h1>
        <p>Assign monthly managers for the mess</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Form */}
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Set Monthly Manager</h3>

          {error && <div className="alert alert-error"><AlertCircle size={15} />{error}</div>}
          {success && <div className="alert alert-success"><CheckCircle size={15} />{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-16">
              <label className="form-label">Month</label>
              <select id="mgr-month" className="form-input" value={month} onChange={e => setMonth(+e.target.value)}>
                {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>

            <div className="form-group mb-16">
              <label className="form-label">Year</label>
              <input type="number" className="form-input" value={year}
                onChange={e => setYear(+e.target.value)} min="2020" max="2099" />
            </div>

            <div className="form-group mb-24">
              <label className="form-label">Select Manager</label>
              <select id="mgr-member-select" className="form-input" value={memberId}
                onChange={e => setMemberId(e.target.value)} required>
                <option value="">-- Select Member --</option>
                {members.map(m => (
                  <option key={m._id} value={m._id}>{m.username}</option>
                ))}
              </select>
            </div>

            <button id="mgr-save-btn" type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Saving...' : '💾 Save Manager'}
            </button>
          </form>
        </div>

        {/* History Table */}
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Manager History</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Month / Year</th><th>Manager</th></tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr><td colSpan={2} className="table-empty">No history yet</td></tr>
                ) : [...history].reverse().map((h, i) => {
                  const isCurrentMonth = h.month === (now.getMonth() + 1) && h.year === now.getFullYear();
                  return (
                    <tr key={i}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {MONTHS.find(m => m.value === h.month)?.label} {h.year}
                          {isCurrentMonth && <span className="badge badge-accent">Current</span>}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {h.managerId?.username || 'Unknown'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
