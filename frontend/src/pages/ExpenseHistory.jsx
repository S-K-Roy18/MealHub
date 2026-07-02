import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Calendar, BarChart3, CreditCard } from 'lucide-react';
import { usePeriod } from '../context/PeriodContext';
import PeriodSelector from '../components/PeriodSelector';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MEAL_BADGE = { lunch: 'badge-warning', dinner: 'badge-info', other: 'badge-accent' };

export default function ExpenseHistory() {
  const { filterValue, getQueryParams } = usePeriod();
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [filterValue]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const queryParams = getQueryParams();
      if (search) queryParams.search = search;
      if (dateFilter) queryParams.date = dateFilter;
      const params = new URLSearchParams(queryParams);
      const res = await api.get(`/expense?${params}`);
      setExpenses(res.data.expenses || []);
      setTotalSpent(res.data.totalSpent || 0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => { e.preventDefault(); fetchData(); };

  const getSafeDateString = (dateVal) => {
    if (!dateVal) return new Date().toISOString().split('T')[0];
    try {
      const dObj = new Date(dateVal);
      if (!isNaN(dObj.getTime())) {
        return dObj.toISOString().split('T')[0];
      }
    } catch (err) {}
    return new Date().toISOString().split('T')[0];
  };

  const filtered = expenses.filter(e =>
    (!search || e.itemName.toLowerCase().includes(search.toLowerCase())) &&
    (!dateFilter || getSafeDateString(e.date) === dateFilter)
  );
  const displayTotal = filtered.reduce((s, e) => s + e.price, 0);

  const grouped = [];
  const groups = {};
  filtered.forEach(e => {
    const dStr = getSafeDateString(e.date);
    const key = `${dStr}_${e.mealType || 'other'}`;
    if (!groups[key]) {
      groups[key] = {
        date: e.date,
        mealType: e.mealType || 'other',
        items: [],
        totalPrice: 0,
        addedBy: e.addedBy?.username || 'System',
        isBackdated: e.isBackdated,
        isEdited: e.isEdited,
        notes: []
      };
      grouped.push(groups[key]);
    }
    groups[key].items.push({ name: e.itemName, price: e.price });
    groups[key].totalPrice += e.price;
    if (e.notes) groups[key].notes.push(e.notes);
  });

    return (
      <div className="fade-in">
        <div className="page-header">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={28} color="var(--accent)" /> Expense History
          </h1>
          <p>All recorded expenses — grouped by date & meal</p>
        </div>

        {/* Filters */}
        <div className="card mb-16">
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '260px' }}>
              <label className="form-label">Period</label>
              <PeriodSelector />
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
                    <tr><th>Date</th><th>Meal</th><th>Items & Prices</th><th>Total</th><th>Notes</th><th>Added By</th></tr>
                  </thead>
                  <tbody>
                    {grouped.length === 0 ? (
                      <tr><td colSpan={6} className="table-empty">No expenses found</td></tr>
                    ) : grouped.map((g, i) => (
                      <tr key={i}>
                        <td style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                          {(() => {
                            if (!g.date) return 'N/A';
                            const dObj = new Date(g.date);
                            return isNaN(dObj.getTime()) ? 'N/A' : dObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                          })()}
                          {g.isBackdated && <span className="badge badge-danger" style={{ marginLeft: '6px', fontSize: '0.65rem' }}>Backdated</span>}
                          {g.isEdited && <span className="badge badge-warning" style={{ marginLeft: '4px', fontSize: '0.65rem' }}>Edited</span>}
                        </td>
                        <td><span className={`badge ${MEAL_BADGE[g.mealType] || 'badge-accent'}`}>{g.mealType}</span></td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {g.items.map((item, idx) => (
                              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', fontSize: '0.9rem' }}>
                                <span style={{ fontWeight: 500 }}>{item.name}</span>
                                <span style={{ color: 'var(--text-secondary)' }}>₹{item.price.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td style={{ fontWeight: 800, color: 'var(--danger)' }}>₹{g.totalPrice.toLocaleString()}</td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          {g.notes.length > 0 ? g.notes.join(', ') : '—'}
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{g.addedBy}</td>
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
