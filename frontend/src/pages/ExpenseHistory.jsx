import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Calendar, BarChart3, CreditCard } from 'lucide-react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MEAL_BADGE = { lunch: 'badge-warning', dinner: 'badge-info', other: 'badge-accent' };

export default function ExpenseHistory() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [month, year]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ month, year });
      if (search) params.append('search', search);
      if (dateFilter) params.append('date', dateFilter);
      const res = await api.get(`/expense?${params}`);
      setExpenses(res.data.expenses || []);
      setTotalSpent(res.data.totalSpent || 0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => { e.preventDefault(); fetchData(); };

  const filtered = expenses.filter(e =>
    (!search || e.itemName.toLowerCase().includes(search.toLowerCase())) &&
    (!dateFilter || new Date(e.date).toISOString().split('T')[0] === dateFilter)
  );

  const displayTotal = filtered.reduce((s, e) => s + e.price, 0);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BarChart3 size={28} color="var(--accent)" /> Expense History
        </h1>
        <p>All recorded expenses</p>
      </div>

      {/* Filters */}
      <div className="card mb-16">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '140px' }}>
            <label className="form-label">Month</label>
            <select className="form-input" value={month} onChange={e => setMonth(+e.target.value)}>
              {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ width: '100px' }}>
            <label className="form-label">Year</label>
            <input type="number" className="form-input" value={year} onChange={e => setYear(+e.target.value)} min="2020" max="2099" />
          </div>
          <div className="form-group" style={{ flex: 2, minWidth: '180px' }}>
            <label className="form-label">Search Item</label>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input id="exp-search" type="text" className="form-input" style={{ paddingLeft: '32px' }}
                placeholder="Search item name..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="form-group" style={{ flex: 1, minWidth: '160px' }}>
            <label className="form-label">Date Filter</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input id="exp-date-filter" type="date" className="form-input" style={{ paddingLeft: '32px' }}
                value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-sm" id="exp-filter-btn">Filter</button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setDateFilter(''); fetchData(); }}>Clear</button>
        </form>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Date</th><th>Item</th><th>Price</th><th>Meal</th><th>Notes</th><th>Added By</th></tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="table-empty">No expenses found</td></tr>
                  ) : filtered.map((e, i) => (
                    <tr key={i}>
                      <td style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        {e.isBackdated && <span className="badge badge-danger" style={{ marginLeft: '6px', fontSize: '0.65rem' }}>Backdated</span>}
                        {e.isEdited && <span className="badge badge-warning" style={{ marginLeft: '4px', fontSize: '0.65rem' }}>Edited</span>}
                      </td>
                      <td style={{ fontWeight: 600 }}>{e.itemName}</td>
                      <td><span className="amount-negative">₹{e.price.toLocaleString()}</span></td>
                      <td><span className={`badge ${MEAL_BADGE[e.mealType] || 'badge-accent'}`}>{e.mealType}</span></td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{e.notes || '—'}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{e.addedBy?.username}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{
              marginTop: '16px', padding: '14px 16px',
              background: 'var(--danger-bg)', borderRadius: 'var(--radius-sm)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              border: '1px solid rgba(239,68,68,0.2)',
            }}>
              <span style={{ fontWeight: 600, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={18} /> Total Spent
              </span>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--danger)' }}>₹{displayTotal.toLocaleString()}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
