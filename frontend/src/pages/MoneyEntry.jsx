import { useState, useEffect } from 'react';
import api from '../api/axios';
import { AlertCircle, CheckCircle, PlusCircle } from 'lucide-react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function MoneyEntry() {
  const [members, setMembers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ memberId: '', amount: '', date: new Date().toISOString().split('T')[0] });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  useEffect(() => {
    fetchData();
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const res = await api.get('/mess');
    setMembers(res.data.mess.members || []);
  };

  const fetchData = async () => {
    const res = await api.get(`/money?month=${month}&year=${year}`);
    setEntries(res.data.entries || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.memberId || !form.amount || !form.date) { setError('All fields required'); return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      await api.post('/money', form);
      setSuccess('Money entry added!');
      setForm(f => ({ ...f, memberId: '', amount: '' }));
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add entry');
    } finally {
      setLoading(false);
    }
  };

  const total = entries.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>💰 Money Entry</h1>
        <p>Record money collected from members — {MONTHS[month-1]} {year}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Form */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={18} color="var(--accent)" /> Add Entry
          </h3>

          {error && <div className="alert alert-error"><AlertCircle size={15} />{error}</div>}
          {success && <div className="alert alert-success"><CheckCircle size={15} />{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-16">
              <label className="form-label">Select Member</label>
              <select id="money-member-select" className="form-input" value={form.memberId}
                onChange={e => setForm(f => ({ ...f, memberId: e.target.value }))} required>
                <option value="">-- Select Member --</option>
                {members.map(m => (
                  <option key={m._id} value={m._id}>{m.username}</option>
                ))}
              </select>
            </div>

            <div className="form-group mb-16">
              <label className="form-label">Amount (₹)</label>
              <input id="money-amount" type="number" min="1" className="form-input" placeholder="Enter amount"
                value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
            </div>

            <div className="form-group mb-24">
              <label className="form-label">Date</label>
              <input id="money-date" type="date" className="form-input"
                value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
            </div>

            <button id="money-submit-btn" type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Adding...' : '+ Add Money Entry'}
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3>Recent Entries</h3>
            <span className="badge badge-success">Total: ₹{total.toLocaleString()}</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Member</th><th>Amount</th><th>Date</th></tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr><td colSpan={3} className="table-empty">No entries this month</td></tr>
                ) : entries.map((e, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{e.memberId?.username}</td>
                    <td><span className="amount-positive">₹{e.amount.toLocaleString()}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
