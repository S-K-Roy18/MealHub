import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Download, Plus, Flame, TrendingUp } from 'lucide-react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Dashboard() {
  const { user, mess, isManager } = useAuth();
  const [data, setData] = useState(null);
  const [messInfo, setMessInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const dashRef = useRef();

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [moneyRes, expenseRes, mealRes, gasRes, messRes] = await Promise.all([
        api.get(`/money?month=${month}&year=${year}`),
        api.get(`/expense?month=${month}&year=${year}`),
        api.get(`/meal?month=${month}&year=${year}`),
        api.get(`/gas?month=${month}&year=${year}`),
        api.get('/mess'),
      ]);
      setData({
        money: moneyRes.data,
        expense: expenseRes.data,
        meal: mealRes.data,
        gas: gasRes.data,
      });
      setMessInfo(messRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addGas = async (remark) => {
    try {
      await api.post('/gas', { date: new Date().toISOString(), remark });
      fetchData();
    } catch {}
  };

  const handlePDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(dashRef.current, {
        scale: 2,
        backgroundColor: '#0d0f1a',
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width / 2, canvas.height / 2] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`${mess?.name || 'MealHub'}-${MONTHS[month - 1]}-${year}.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  const totalCollected = data?.money?.totalCollected || 0;
  const totalSpent = data?.expense?.totalSpent || 0;
  const balance = totalCollected - totalSpent;
  const totalMessMeals = data?.meal?.totalMessMeals || 0;
  const perMealCost = totalMessMeals > 0 ? (totalSpent / totalMessMeals) : 0;
  const gasCylinders = data?.gas?.cylinders || [];
  const memberTotals = data?.meal?.memberTotals || [];

  // Current manager name
  const currentManagerId = messInfo?.currentManagerId?.toString();
  const currentManager = messInfo?.mess?.members?.find(m => m._id?.toString() === currentManagerId);

  // Build per-member money map
  const moneyByMember = {};
  (data?.money?.entries || []).forEach(e => {
    const id = e.memberId?._id?.toString() || e.memberId?.toString();
    if (id) moneyByMember[id] = (moneyByMember[id] || 0) + e.amount;
  });

  const statCards = [
    { icon: '💰', label: 'Total Collected', value: `₹${totalCollected.toLocaleString('en-IN')}`, color: '#22c55e' },
    { icon: '💸', label: 'Total Spent', value: `₹${totalSpent.toLocaleString('en-IN')}`, color: '#ef4444' },
    { icon: '🪙', label: 'Balance', value: `₹${balance.toLocaleString('en-IN')}`, color: balance >= 0 ? '#22c55e' : '#ef4444' },
    { icon: '🍽', label: 'Total Meals', value: totalMessMeals, color: '#f59e0b' },
    { icon: '📊', label: 'Per Meal Cost', value: `₹${perMealCost.toFixed(2)}`, color: '#7c6bff' },
    { icon: '🔥', label: 'Gas Cylinders', value: gasCylinders.length, color: '#ff6b9d' },
  ];

  return (
    <div className="fade-in" ref={dashRef}>
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '4px' }}>
            Welcome, {user?.username} 👋
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              🏠 {mess?.name}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>·</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {MONTHS[month - 1]} {year}
            </span>
            {currentManager && (
              <>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>·</span>
                <span className="badge badge-accent" style={{ fontSize: '0.72rem' }}>
                  🍽 Manager: {currentManager.username}
                </span>
              </>
            )}
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handlePDF} id="download-pdf-btn">
          <Download size={15} /> PDF
        </button>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        {statCards.map((c, i) => (
          <div key={i} className="stat-card" style={{ '--card-accent': c.color }}>
            <div className="stat-card-icon">{c.icon}</div>
            <div className="stat-card-value" style={{ color: c.color }}>{c.value}</div>
            <div className="stat-card-label">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Balance visual bar */}
      {totalCollected > 0 && (
        <div className="card mb-24" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={13} /> Budget Usage
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              ₹{totalSpent.toLocaleString('en-IN')} / ₹{totalCollected.toLocaleString('en-IN')}
            </span>
          </div>
          <div style={{ height: '8px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min((totalSpent / totalCollected) * 100, 100)}%`,
              background: totalSpent / totalCollected > 0.9
                ? 'var(--danger)'
                : totalSpent / totalCollected > 0.7
                  ? 'var(--warning)'
                  : 'var(--success)',
              borderRadius: '99px',
              transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            {totalCollected > 0 ? `${((totalSpent / totalCollected) * 100).toFixed(1)}% of collected money spent` : 'No money collected yet'}
          </div>
        </div>
      )}

      {/* Gas Section */}
      <div className="card mb-24">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={18} color="#ff6b9d" />
            <h3>Gas Cylinders</h3>
            <span className="badge badge-accent">{gasCylinders.length} this month</span>
          </div>
          {isManager && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                id="gas-paid-btn"
                className="btn btn-sm"
                style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)' }}
                onClick={() => addGas('paid')}
              >
                <Plus size={14} /> Paid
              </button>
              <button
                id="gas-due-btn"
                className="btn btn-sm"
                style={{ background: 'var(--warning-bg)', color: 'var(--warning)', border: '1px solid rgba(245,158,11,0.3)' }}
                onClick={() => addGas('due')}
              >
                <Plus size={14} /> Due
              </button>
            </div>
          )}
        </div>

        {gasCylinders.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '20px 0' }}>
            🔥 No gas cylinders recorded this month
            {isManager && <><br /><span style={{ fontSize: '0.8rem' }}>Click + Paid or + Due above to add one</span></>}
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {gasCylinders.map((g, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🔥</span>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Cylinder #{gasCylinders.length - i}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(g.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      {g.addedBy?.username && ` · by ${g.addedBy.username}`}
                    </div>
                  </div>
                </div>
                <span className={`badge ${g.remark === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                  {g.remark === 'paid' ? '✓ Paid' : '⏳ Due'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Individual Meal Cost Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <h3>👤 Individual Meal Cost — {MONTHS[month - 1]} {year}</h3>
          {perMealCost > 0 && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Per meal: <strong style={{ color: 'var(--accent)' }}>₹{perMealCost.toFixed(2)}</strong>
            </span>
          )}
        </div>

        {memberTotals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🍽</div>
            No meal entries this month yet
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th style={{ textAlign: 'center' }}>Meals</th>
                  <th style={{ textAlign: 'right' }}>Meal Cost</th>
                  <th style={{ textAlign: 'right' }}>Given</th>
                  <th style={{ textAlign: 'right' }}>Due / Extra</th>
                </tr>
              </thead>
              <tbody>
                {memberTotals.map((m, i) => {
                  const name = m.memberId?.username || 'Unknown';
                  const id = m.memberId?._id?.toString() || m.memberId?.toString();
                  const mealCost = m.total * perMealCost;
                  const given = moneyByMember[id] || 0;
                  const due = given - mealCost;
                  return (
                    <tr key={i}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '28px', height: '28px',
                            background: `hsl(${(name.charCodeAt(0) || 65) * 5}, 65%, 55%)`,
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, color: '#fff', fontSize: '0.75rem', flexShrink: 0
                          }}>
                            {name[0]?.toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600 }}>{name}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ fontWeight: 600 }}>{m.total}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                          ({m.lunch || 0}L + {m.dinner || 0}D)
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{mealCost.toFixed(2)}</td>
                      <td style={{ textAlign: 'right', color: 'var(--success)', fontWeight: 600 }}>₹{given.toLocaleString('en-IN')}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span
                          className={due > 0 ? 'amount-positive' : due < 0 ? 'amount-negative' : 'amount-neutral'}
                          style={{ fontSize: '1rem' }}
                        >
                          {due > 0 ? '+' : ''}₹{Math.abs(due).toFixed(2)}
                        </span>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {due > 0 ? 'Extra paid' : due < 0 ? 'Owes money' : 'Settled'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  <td style={{ fontWeight: 700 }}>Total</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{totalMessMeals} meals</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{totalSpent.toLocaleString('en-IN')}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{totalCollected.toLocaleString('en-IN')}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>
                    <span className={balance >= 0 ? 'amount-positive' : 'amount-negative'}>
                      {balance >= 0 ? '+' : ''}₹{Math.abs(balance).toFixed(2)}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
