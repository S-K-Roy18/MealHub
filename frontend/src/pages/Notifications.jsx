import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Bell, RefreshCw, Flame, Trash2, AlertCircle, CheckCircle, Info, XCircle, UserMinus } from 'lucide-react';

const TYPE_CONFIG = {
  expense_added: { icon: <CheckCircle size={12} />, color: 'var(--success)' },
  expense_backdated: { icon: <AlertCircle size={12} />, color: 'var(--danger)' },
  expense_edited: { icon: <AlertCircle size={12} />, color: 'var(--danger)' },
  meal_added: { icon: <CheckCircle size={12} />, color: 'var(--success)' },
  money_added: { icon: <CheckCircle size={12} />, color: 'var(--success)' },
  gas_added: { icon: <Flame size={12} />, color: '#ff6b9d' },
  gas_paid: { icon: <CheckCircle size={12} />, color: 'var(--success)' },
  gas_deleted: { icon: <Trash2 size={12} />, color: 'var(--danger)' },
  manager_changed: { icon: <RefreshCw size={12} />, color: 'var(--accent)' },
  member_removed: { icon: <UserMinus size={12} />, color: 'var(--danger)' },
};

const TYPE_LABELS = {
  expense_added: 'Expense Added',
  expense_backdated: 'Backdated Expense',
  expense_edited: 'Expense Edited',
  meal_added: 'Meal Entry',
  money_added: 'Money Added',
  gas_added: 'Gas Added',
  gas_paid: 'Gas Paid',
  gas_deleted: 'Gas Entry Deleted',
  manager_changed: 'Manager Changed',
  member_removed: 'Member Removed',
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications')
      .then(res => setNotifications(res.data.notifications || []))
      .finally(() => setLoading(false));
  }, []);

  const isGreen = (n) => !n.isBackdated && !n.isEdited;

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bell size={28} color="var(--accent)" /> Notifications
        </h1>
        <p>Activity log for your mess</p>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block', boxShadow: '0 0 6px var(--success)' }} />
          Same-day entry
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--danger)', display: 'inline-block', boxShadow: '0 0 6px var(--danger)' }} />
          Backdated or edited
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
          No notifications yet
        </div>
      ) : (
        <div>
          {notifications.map((n, i) => {
            const green = isGreen(n);
            const timeAgo = getTimeAgo(n.createdAt);
            return (
              <div key={i} className="notif-item">
                <div className={`notif-dot ${green ? 'green' : 'red'}`} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className={`badge ${green ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {TYPE_CONFIG[n.type]?.icon} {TYPE_LABELS[n.type] || n.type}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                        {n.message}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        by {n.addedBy?.username || 'System'}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {timeAgo}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getTimeAgo(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
