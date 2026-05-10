import { useState } from 'react';
import api from '../api/axios';
import { AlertCircle, CheckCircle, PlusCircle, ShoppingCart, Trash2, Save, ListPlus } from 'lucide-react';

const MEAL_TYPES = ['lunch', 'dinner', 'other'];

export default function ExpenseEntry() {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ date: today, itemName: '', price: '', mealType: 'lunch', notes: '' });
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const addToList = (e) => {
    e.preventDefault();
    if (!form.date || !form.itemName || !form.price || !form.mealType) {
      setError('Date, item name, price and meal type are required'); return;
    }
    setError('');
    setPendingExpenses([...pendingExpenses, { ...form, id: Date.now() }]);
    setForm({ ...form, itemName: '', price: '', notes: '' }); // keep date and mealType
  };

  const removeFromList = (id) => {
    setPendingExpenses(pendingExpenses.filter(ex => ex.id !== id));
  };

  const handleSaveAll = async () => {
    if (pendingExpenses.length === 0) return;
    setLoading(true); setError(''); setSuccess('');
    try {
      await api.post('/expense/batch', { expenses: pendingExpenses });
      setSuccess(`✅ Successfully added ${pendingExpenses.length} expenses!`);
      setPendingExpenses([]);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save expenses');
    } finally {
      setLoading(false);
    }
  };

  const totalPending = pendingExpenses.reduce((s, e) => s + Number(e.price), 0);
  const isBackdated = form.date && form.date < today;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShoppingCart size={28} color="var(--accent)" /> Expense Entry
        </h1>
        <p>Log daily mess expenses — build your list and save all at once</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))', gap: '24px', alignItems: 'start' }}>
        {/* Form */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ListPlus size={18} color="var(--accent)" /> Add Item to List
          </h3>

          {error && <div className="alert alert-error"><AlertCircle size={15} />{error}</div>}
          {success && <div className="alert alert-success"><CheckCircle size={15} />{success}</div>}

          {isBackdated && (
            <div className="alert" style={{ background: 'var(--warning-bg)', color: 'var(--warning)', border: '1px solid rgba(245,158,11,0.3)', marginBottom: '12px' }}>
              ⚠️ Backdated entry — a notification will be sent
            </div>
          )}

          <form onSubmit={addToList}>
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

            <button type="submit" className="btn btn-secondary btn-full">
              + Add to Shopping List
            </button>
          </form>
        </div>

        {/* Pending List */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={18} color="var(--accent)" /> Pending List ({pendingExpenses.length})
            </h3>
            {pendingExpenses.length > 0 && (
              <span className="badge badge-success">Subtotal: ₹{totalPending.toFixed(2)}</span>
            )}
          </div>

          {pendingExpenses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              Your list is empty. Add items from the left.
            </div>
          ) : (
            <>
              <div className="table-wrapper mb-24" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table>
                  <thead>
                    <tr><th>Item</th><th>Price</th><th>Type</th><th></th></tr>
                  </thead>
                  <tbody>
                    {pendingExpenses.map((ex) => (
                      <tr key={ex.id}>
                        <td style={{ fontWeight: 600 }}>{ex.itemName}</td>
                        <td className="amount-positive">₹{Number(ex.price).toFixed(2)}</td>
                        <td><span className="badge badge-info" style={{fontSize: '0.7rem'}}>{ex.mealType}</span></td>
                        <td>
                          <button className="btn btn-sm" style={{ color: 'var(--danger)', padding: '4px' }} onClick={() => removeFromList(ex.id)}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button 
                onClick={handleSaveAll} 
                className="btn btn-primary btn-full" 
                disabled={loading}
                style={{ height: '52px', fontSize: '1rem' }}
              >
                {loading ? 'Saving list...' : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Save size={18} /> Save All {pendingExpenses.length} Expenses
                  </span>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
