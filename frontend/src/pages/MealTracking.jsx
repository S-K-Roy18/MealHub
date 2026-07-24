import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, ClipboardList, BarChart3 } from 'lucide-react';
import { usePeriod } from '../context/PeriodContext';
import PeriodSelector from '../components/PeriodSelector';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function MealTracking() {
  const { filterValue, getQueryParams } = usePeriod();
  const [dateFilter, setDateFilter] = useState('');
  const [meals, setMeals] = useState([]);
  const [memberTotals, setMemberTotals] = useState([]);
  const [totalMessMeals, setTotalMessMeals] = useState(0);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => { fetchData(); }, [filterValue]);

  const fetchMembers = async () => {
    const res = await api.get('/mess');
    setMembers(res.data.mess.members || []);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const queryParams = getQueryParams();
      if (dateFilter) queryParams.date = dateFilter;
      const params = new URLSearchParams(queryParams);
      const res = await api.get(`/meal?${params}`);
      setMeals(res.data.meals || []);
      setMemberTotals(res.data.memberTotals || []);
      setTotalMessMeals(res.data.totalMessMeals || 0);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => { e.preventDefault(); fetchData(); };

  // Filter meals for display
  const displayMeals = dateFilter
    ? meals.filter(m => new Date(m.date).toISOString().split('T')[0] === dateFilter)
    : meals;

  // Build member name map
  const memberMap = {};
  members.forEach(m => { memberMap[m._id] = m.username; });

  // Build member total map for quick lookup
  const totalMap = {};
  memberTotals.forEach(m => {
    const id = m.memberId?._id || m.memberId;
    totalMap[id] = m;
  });

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ClipboardList size={28} color="var(--accent)" /> Meal Tracking
        </h1>
        <p>View all meal entries</p>
      </div>

      {/* Filters */}
      <div className="card mb-16">
        <form onSubmit={handleFilter} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '260px' }}>
            <label className="form-label">Period</label>
            <PeriodSelector />
          </div>
          <div className="form-group" style={{ flex: 1, minWidth: '160px' }}>
            <label className="form-label">Filter by Date</label>
            <input id="meal-track-date" type="date" className="form-input"
              value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">Filter</button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setDateFilter(''); fetchData(); }}>Clear</button>
        </form>
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : (
        <>
          {/* Daily Meal Table */}
          <div className="card mb-24">
            <h3 style={{ marginBottom: '16px' }}>Daily Meal Log</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    {members.map(m => (
                      <th key={m._id} style={{ textAlign: 'center' }}>{m.username}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayMeals.length === 0 ? (
                    <tr><td colSpan={members.length + 1} className="table-empty">No meals recorded</td></tr>
                  ) : displayMeals.map((meal, i) => (
                    <tr key={i}>
                      <td style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {new Date(meal.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </td>
                      {members.map(m => {
                        const entry = meal.entries.find(e => {
                          const id = e.memberId?._id || e.memberId;
                          return id?.toString() === m._id?.toString();
                        });
                        const L = entry?.lunch;
                        const D = entry?.dinner;
                        const E = entry?.extra || 0;
                        return (
                          <td key={m._id} style={{ textAlign: 'center' }}>
                            {(L || D || E > 0) ? (
                              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px' }}>
                                <span>{L ? '☀️L' : '—'}</span>
                                <span style={{ opacity: 0.4 }}>,</span>
                                <span>{D ? '🌙D' : '—'}</span>
                                {E > 0 && (
                                  <>
                                    <span style={{ opacity: 0.4 }}>|</span>
                                    <span style={{ color: 'var(--success)' }}>+{E} Ext</span>
                                  </>
                                )}
                              </div>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Member Totals */}
          <div className="card">
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={20} color="var(--accent)" /> Member Meal Summary
            </h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Member</th><th>Lunches</th><th>Dinners</th><th>Extra</th><th>Total Meals</th></tr>
                </thead>
                <tbody>
                  {members.map(m => {
                    const t = totalMap[m._id] || { lunch: 0, dinner: 0, total: 0 };
                    return (
                      <tr key={m._id}>
                        <td style={{ fontWeight: 600 }}>{m.username}</td>
                        <td><span className="badge badge-warning">{t.lunch || 0}</span></td>
                        <td><span className="badge badge-info">{t.dinner || 0}</span></td>
                        <td><span className="badge badge-success">{t.extra || 0}</span></td>
                        <td><span style={{ fontWeight: 700, color: 'var(--accent)' }}>{t.total || 0}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: 'var(--bg-secondary)' }}>
                    <td style={{ fontWeight: 700 }} colSpan={4}>Total Mess Meals</td>
                    <td><span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent)' }}>{totalMessMeals}</span></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
