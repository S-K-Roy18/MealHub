import { useState, useEffect } from 'react';
import api from '../api/axios';
import { FileText, Coins } from 'lucide-react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function MoneyCollected() {
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  useEffect(() => {
    api.get(`/money?month=${month}&year=${year}`)
      .then(res => {
        setEntries(res.data.entries || []);
        setTotal(res.data.totalCollected || 0);
      })
      .finally(() => setLoading(false));
  }, []);

  // Group by member
  const grouped = {};
  entries.forEach(e => {
    const id = e.memberId?._id || e.memberId;
    const name = e.memberId?.username || 'Unknown';
    if (!grouped[id]) grouped[id] = { name, entries: [] };
    grouped[id].entries.push(e);
  });

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText size={28} color="var(--accent)" /> Money Collected
        </h1>
        <p>All payment history — {MONTHS[month-1]} {year}</p>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Member</th><th>Payments</th><th>Total</th></tr>
            </thead>
            <tbody>
              {Object.values(grouped).length === 0 ? (
                <tr><td colSpan={3} className="table-empty">No money entries this month</td></tr>
              ) : Object.values(grouped).map((g, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{g.name}</td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {g.entries.map((e, j) => (
                        <span key={j} className="badge badge-success" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          ₹{e.amount.toLocaleString()} 
                          <span style={{ opacity: 0.8, fontSize: '0.65rem', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '4px' }}>
                            {e.paymentMode || 'Cash'}
                          </span>
                          <span style={{ opacity: 0.6, fontSize: '0.6rem' }}>
                            {new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </span>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--success)' }}>
                    ₹{g.entries.reduce((s, e) => s + e.amount, 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          marginTop: '16px', padding: '14px 16px',
          background: 'var(--success-bg)', borderRadius: 'var(--radius-sm)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          border: '1px solid rgba(34, 197, 94, 0.2)',
        }}>
          <span style={{ fontWeight: 600, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Coins size={18} /> Total Money Collected
          </span>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--success)' }}>₹{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
