import { useState, useEffect } from 'react';
import api from '../api/axios';
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Utensils, Save } from 'lucide-react';

export default function MealEntry() {
  const [members, setMembers] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [entries, setEntries] = useState({});   // { memberId: { lunch: bool, dinner: bool } }
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => { fetchMembers(); }, []);
  useEffect(() => { if (members.length) loadExisting(); }, [date, members]);

  const fetchMembers = async () => {
    const res = await api.get('/mess');
    const mems = res.data.mess.members || [];
    setMembers(mems);
    const initial = {};
    mems.forEach(m => { initial[m._id] = { lunch: false, dinner: false }; });
    setEntries(initial);
  };

  const loadExisting = async () => {
    setFetching(true);
    try {
      const res = await api.get(`/meal/date/${date}`);
      if (res.data.meal) {
        const map = {};
        res.data.meal.entries.forEach(e => {
          const id = e.memberId?._id || e.memberId;
          map[id] = { lunch: e.lunch, dinner: e.dinner };
        });
        setEntries(prev => {
          const next = {};
          members.forEach(m => { next[m._id] = map[m._id] || { lunch: false, dinner: false }; });
          return next;
        });
      } else {
        const reset = {};
        members.forEach(m => { reset[m._id] = { lunch: false, dinner: false }; });
        setEntries(reset);
      }
    } finally {
      setFetching(false);
    }
  };

  const toggle = (memberId, type) => {
    setEntries(prev => ({
      ...prev,
      [memberId]: { ...prev[memberId], [type]: !prev[memberId][type] }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true); setError(''); setSuccess('');
    try {
      const payload = members.map(m => ({
        memberId: m._id,
        lunch: entries[m._id]?.lunch || false,
        dinner: entries[m._id]?.dinner || false,
      }));
      await api.post('/meal', { date, entries: payload });
      setSuccess('✅ Meal entry saved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const prevDay = () => {
    const d = new Date(date); d.setDate(d.getDate() - 1);
    setDate(d.toISOString().split('T')[0]);
  };
  const nextDay = () => {
    const d = new Date(date); d.setDate(d.getDate() + 1);
    setDate(d.toISOString().split('T')[0]);
  };

  const today = new Date().toISOString().split('T')[0];
  const isBackdated = date < today;

  const totalLunch = Object.values(entries).filter(e => e.lunch).length;
  const totalDinner = Object.values(entries).filter(e => e.dinner).length;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Utensils size={28} color="var(--accent)" /> Meal Entry
        </h1>
        <p>Record daily lunch and dinner for each member</p>
      </div>

      {/* Date Navigator */}
      <div className="card mb-16" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={prevDay}><ChevronLeft size={16} /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
            <input type="date" className="form-input" style={{ width: 'auto' }}
              value={date} onChange={e => setDate(e.target.value)} id="meal-date-input" />
            {isBackdated && (
              <span className="badge badge-warning">⚠️ Backdated</span>
            )}
          </div>
          <button className="btn btn-secondary btn-sm" onClick={nextDay} disabled={date >= today}><ChevronRight size={16} /></button>
          <button className="btn btn-secondary btn-sm" onClick={() => setDate(today)}>Today</button>
        </div>
      </div>

      {error && <div className="alert alert-error mb-16"><AlertCircle size={15} />{error}</div>}
      {success && <div className="alert alert-success mb-16"><CheckCircle size={15} />{success}</div>}

      {/* Meal Table */}
      <div className="card mb-16">
        {fetching ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th style={{ textAlign: 'center' }}>🌅 Lunch</th>
                  <th style={{ textAlign: 'center' }}>🌙 Dinner</th>
                  <th style={{ textAlign: 'center' }}>Meals</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => {
                  const e = entries[m._id] || { lunch: false, dinner: false };
                  const total = (e.lunch ? 1 : 0) + (e.dinner ? 1 : 0);
                  return (
                    <tr key={m._id}>
                      <td style={{ fontWeight: 600 }}>{m.username}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          id={`lunch-${m._id}`}
                          className={`toggle-btn ${e.lunch ? 'active-lunch' : ''}`}
                          onClick={() => toggle(m._id, 'lunch')}
                        >
                          {e.lunch ? '✅' : '☐'} Lunch
                        </button>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          id={`dinner-${m._id}`}
                          className={`toggle-btn ${e.dinner ? 'active-dinner' : ''}`}
                          onClick={() => toggle(m._id, 'dinner')}
                        >
                          {e.dinner ? '✅' : '☐'} Dinner
                        </button>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ fontWeight: 700, color: total > 0 ? 'var(--accent)' : 'var(--text-muted)' }}>
                          {total}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  <td style={{ fontWeight: 700 }}>Total</td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--warning)' }}>{totalLunch} lunches</td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--info)' }}>{totalDinner} dinners</td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--accent)' }}>{totalLunch + totalDinner} meals</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <button id="meal-submit-btn" className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Saving...' : <><Save size={18} /> Save Meal Entry</>}
      </button>
    </div>
  );
}
