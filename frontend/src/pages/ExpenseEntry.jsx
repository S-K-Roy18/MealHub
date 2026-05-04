import { useState } from 'react';
import api from '../api/axios';
import { AlertCircle, CheckCircle, PlusCircle, ShoppingCart } from 'lucide-react';

const MEAL_TYPES = ['lunch', 'dinner', 'other'];

export default function ExpenseEntry() {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ date: today, itemName: '', price: '', mealType: 'lunch', notes: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.itemName || !form.price || !form.mealType) {
      setError('Date, item name, price and meal type are required'); return;
    }
    setLoading(true); setError(''); setSuccess('');
    try {
      await api.post('/expense', form);
      const isBackdated = new Date(form.date) < new Date(today);
      setSuccess(isBackdated ? '⚠️ Backdated expense added (notification sent)' : '✅ Expense added successfully!');
      setForm(f => ({ ...f, itemName: '', price: '', notes: '', date: today }));
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const isBackdated = form.date && form.date < today;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShoppingCart size={28} color="var(--accent)" /> Expense Entry
        </h1>
        <p>Log daily mess expenses</p>
      </div>

      <div style={{ maxWidth: '520px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={18} color="var(--accent)" /> Add Expense
          </h3>

          {error && <div className="alert alert-error"><AlertCircle size={15} />{error}</div>}
          {success && <div className="alert alert-success"><CheckCircle size={15} />{success}</div>}

          {isBackdated && (
            <div className="alert" style={{ background: 'var(--warning-bg)', color: 'var(--warning)', border: '1px solid rgba(245,158,11,0.3)', marginBottom: '12px' }}>
              ⚠️ Backdated entry — a notification will be sent to all members
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid mb-16">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input id="exp-date" type="date" className="form-input"
                  value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Meal Type</label>
                <select id="exp-meal-type" className="form-input"
                  value={form.mealType} onChange={e => setForm(f => ({ ...f, mealType: e.target.value }))}>
                  {MEAL_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group mb-16">
              <label className="form-label">Item Name</label>
              <input id="exp-item" type="text" className="form-input" placeholder="e.g., Rice, Fish, Vegetables..."
                value={form.itemName} onChange={e => setForm(f => ({ ...f, itemName: e.target.value }))} required />
            </div>

            <div className="form-group mb-16">
              <label className="form-label">Price (₹)</label>
              <input id="exp-price" type="number" min="0" step="0.01" className="form-input" placeholder="Amount spent"
                value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
            </div>

            <div className="form-group mb-24">
              <label className="form-label">Notes (Optional)</label>
              <input id="exp-notes" type="text" className="form-input" placeholder="Any extra details..."
                value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>

            <button id="exp-submit-btn" type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Submitting...' : '+ Add Expense'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
