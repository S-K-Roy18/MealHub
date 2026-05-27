import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Download, Plus, Flame, TrendingUp, X, Trash2, Utensils, Coins, Wallet, CreditCard, BarChart3, ChefHat, User, Package, Scale } from 'lucide-react';

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

  const [gasCylinders, setGasCylinders] = useState([]);
  const [gasForm, setGasForm] = useState({ show: false, price: '', isPaid: true, buyingDate: now.toISOString().split('T')[0] });

  const [riceBags, setRiceBags] = useState([]);
  const [riceForm, setRiceForm] = useState({ show: false, price: '', weight: '', buyingDate: now.toISOString().split('T')[0], isPaid: true });

  const [chefCostInput, setChefCostInput] = useState('0');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [dashRes, messRes] = await Promise.all([
        api.get(`/dashboard?month=${month}&year=${year}`),
        api.get('/mess'),
      ]);
      setData(dashRes.data);
      setGasCylinders(dashRes.data.gas || []);
      setRiceBags(dashRes.data.rice || []);
      setMessInfo(messRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Sync chefCostInput when data is loaded
  useEffect(() => {
    if (messInfo?.mess?.monthlyManagers) {
      const selectedMonthlyData = messInfo.mess.monthlyManagers.find(
        m => m.month === month && m.year === year
      );
      setChefCostInput(selectedMonthlyData?.chefCost?.toString() || '0');
    }
  }, [messInfo]);

  const handleAddGas = async (e) => {
    e.preventDefault();
    try {
      await api.post('/gas', { 
        buyingDate: gasForm.buyingDate, 
        price: Number(gasForm.price), 
        isPaid: gasForm.isPaid 
      });
      setGasForm({ ...gasForm, show: false, price: '' });
      fetchData();
    } catch {}
  };

  const markGasPaid = async (id) => {
    try {
      await api.put(`/gas/${id}/pay`);
      fetchData();
    } catch {}
  };

  const deleteGas = async (id) => {
    console.log('Delete gas requested for ID:', id);
    if (!id) return;
    if (!confirm('do you want to delete this gas entry?')) return;
    try {
      await api.delete(`/gas/${id.toString()}`);
      fetchData();
    } catch (err) {
      console.error('Delete gas failed:', err);
      alert(err.response?.data?.message || 'Failed to delete gas entry');
    }
  };

  const handleAddRice = async (e) => {
    e.preventDefault();
    try {
      await api.post('/rice', { 
        buyingDate: riceForm.buyingDate, 
        price: Number(riceForm.price), 
        weight: riceForm.weight,
        isPaid: riceForm.isPaid 
      });
      setRiceForm({ ...riceForm, show: false, price: '', weight: '' });
      fetchData();
    } catch {}
  };

  const markRicePaid = async (id) => {
    try {
      await api.put(`/rice/${id}/pay`);
      fetchData();
    } catch {}
  };

  const deleteRice = async (id) => {
    if (!id) return;
    if (!confirm('do you want to delete this rice entry?')) return;
    try {
      await api.delete(`/rice/${id.toString()}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete rice entry');
    }
  };

  const handleSaveChefCost = async () => {
    const val = Number(chefCostInput) || 0;
    try {
      const res = await api.put('/mess/chef-cost', {
        month,
        year,
        chefCost: val
      });
      if (res.data.mess) {
        setMessInfo(prev => ({
          ...prev,
          mess: res.data.mess
        }));
      }
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update chef cost');
    }
  };

  const handlePDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const drawDivider = (yCoord) => {
        pdf.setDrawColor(226, 232, 240);
        pdf.setLineWidth(0.2);
        pdf.line(15, yCoord, pageWidth - 15, yCoord);
      };

      const drawTableHeader = (yCoord) => {
        pdf.setFillColor(15, 23, 42); // Dark Navy / Slate (#0f172a)
        pdf.rect(15, yCoord - 5, pageWidth - 30, 8.5, 'F');
        
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(255, 255, 255);
        pdf.text("Member Name", 18, yCoord);
        pdf.text("Meals", 62, yCoord, { align: 'center' });
        pdf.text("Meal Cost", 88, yCoord, { align: 'right' });
        pdf.text("Chef Cost", 115, yCoord, { align: 'right' });
        pdf.text("Given / Dep.", 145, yCoord, { align: 'right' });
        pdf.text("Due / Extra", 188, yCoord, { align: 'right' });
      };

      let currentY = 15;

      // 1. Top Modern Header Banner
      pdf.setFillColor(30, 41, 59); // Deep Slate (#1e293b)
      pdf.rect(15, currentY, pageWidth - 30, 26, 'F');
      
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(255, 255, 255);
      pdf.text(messInfo?.mess?.name || 'MealHub Mess', 20, currentY + 10);
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.setTextColor(203, 213, 225); // Light slate (#cbd5e1)
      pdf.text("MONTHLY MESS STATEMENT", 20, currentY + 16);
      
      // Billing period right aligned in banner
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(255, 255, 255);
      const dateText = `${MONTHS[month - 1]} ${year}`;
      pdf.text(dateText.toUpperCase(), pageWidth - 20, currentY + 12, { align: 'right' });
      
      currentY += 26;

      // 2. Manager and date detail strip
      currentY += 7;
      pdf.setFont("helvetica", "medium");
      pdf.setFontSize(8.5);
      pdf.setTextColor(71, 85, 105); // Gray slate (#475569)
      const managerName = currentManager?.username || 'N/A';
      pdf.text(`Issued By (Manager): ${managerName}`, 15, currentY);
      pdf.text(`Report Date: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 15, currentY, { align: 'right' });

      currentY += 4;
      drawDivider(currentY);

      // 3. Grid Summary Stats Blocks (3 Columns)
      currentY += 7;
      const boxWidth = 56;
      const boxHeight = 16;
      
      // Background and border for cards
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.25);
      
      // Draw 3 boxes
      pdf.rect(15, currentY, boxWidth, boxHeight, 'FD');
      pdf.rect(77, currentY, boxWidth, boxHeight, 'FD');
      pdf.rect(139, currentY, boxWidth, boxHeight, 'FD');
      
      // Text inside boxes
      pdf.setFontSize(7.5);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(100, 116, 139); // Slate-500
      pdf.text("TOTAL BAZAAR SPENT", 19, currentY + 5);
      pdf.text("TOTAL MEALS", 81, currentY + 5);
      pdf.text("PER MEAL COST", 143, currentY + 5);
      
      pdf.setFontSize(11.5);
      pdf.setTextColor(220, 38, 38); // Red
      pdf.text(`₹${(totalSpent || 0).toLocaleString('en-IN')}`, 19, currentY + 11.5);
      
      pdf.setTextColor(15, 23, 42); // Black slate
      pdf.text(`${totalMessMeals}`, 81, currentY + 11.5);
      
      pdf.setTextColor(79, 70, 229); // Indigo
      pdf.text(`₹${(perMealCost || 0).toFixed(2)}`, 143, currentY + 11.5);

      currentY += boxHeight;

      // 4. Horizontal strip for Collected, Chef Cost, and Mess Balance
      currentY += 4;
      pdf.setFillColor(241, 245, 249); // Slate-100
      pdf.rect(15, currentY, pageWidth - 30, 8, 'F');
      
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      
      pdf.setTextColor(22, 101, 52); // Green-800
      pdf.text(`Collected: ₹${(totalCollected || 0).toLocaleString('en-IN')}`, 18, currentY + 5.5);
      
      pdf.setTextColor(71, 85, 105); // Slate-600
      pdf.text(`Flat Chef Cost: ₹${(chefCost || 0).toFixed(2)}`, 78, currentY + 5.5);
      
      const overallDue = totalCollected - (totalSpent + (chefCost * memberTotals.length));
      if (overallDue > 0) {
        pdf.setTextColor(22, 101, 52);
        pdf.text(`Overall Mess Balance: +₹${overallDue.toFixed(2)}`, 138, currentY + 5.5);
      } else if (overallDue < 0) {
        pdf.setTextColor(185, 28, 28); // Red-700
        pdf.text(`Overall Mess Balance: -₹${Math.abs(overallDue).toFixed(2)}`, 138, currentY + 5.5);
      } else {
        pdf.setTextColor(71, 85, 105);
        pdf.text(`Overall Mess Balance: ₹0.00`, 138, currentY + 5.5);
      }

      currentY += 8;

      // 5. Table Title
      currentY += 9;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10.5);
      pdf.setTextColor(15, 23, 42);
      pdf.text("INDIVIDUAL BREAKDOWN STATEMENT", 15, currentY);

      currentY += 7;
      drawTableHeader(currentY);
      currentY += 6.5;

      // 6. Table Rows
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.setTextColor(51, 65, 85); // Slate-700

      let calculatedTotalChefCost = 0;

      memberTotals.forEach((m, idx) => {
        if (currentY > pageHeight - 25) {
          pdf.addPage();
          currentY = 20;
          drawTableHeader(currentY);
          currentY += 6.5;
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(8.5);
          pdf.setTextColor(51, 65, 85);
        }

        const name = m.memberId?.username || 'Unknown';
        const id = m.memberId?._id?.toString() || m.memberId?.toString();
        const mealCost = m.total * perMealCost;
        const totalMemberCost = mealCost + chefCost;
        const given = moneyByMember[id] || 0;
        const due = given - totalMemberCost;

        calculatedTotalChefCost += chefCost;

        // Alternate row colors
        if (idx % 2 === 1) {
          pdf.setFillColor(248, 250, 252);
          pdf.rect(15, currentY - 4, pageWidth - 30, 6, 'F');
        }

        // Draw Row line
        pdf.setDrawColor(241, 245, 249);
        pdf.setLineWidth(0.15);
        pdf.line(15, currentY + 2, pageWidth - 15, currentY + 2);

        pdf.text(name, 18, currentY);
        pdf.text(`${m.total} (${m.lunch || 0}L+${m.dinner || 0}D)`, 62, currentY, { align: 'center' });
        pdf.text(`₹${mealCost.toFixed(2)}`, 88, currentY, { align: 'right' });
        pdf.text(`₹${chefCost.toFixed(2)}`, 115, currentY, { align: 'right' });
        pdf.text(`₹${given.toLocaleString('en-IN')}`, 145, currentY, { align: 'right' });

        if (due > 0) {
          pdf.setTextColor(22, 101, 52); // Darker Green
          pdf.text(`+₹${due.toFixed(2)}`, 188, currentY, { align: 'right' });
        } else if (due < 0) {
          pdf.setTextColor(185, 28, 28); // Darker Red
          pdf.text(`-₹${Math.abs(due).toFixed(2)}`, 188, currentY, { align: 'right' });
        } else {
          pdf.setTextColor(100, 116, 139);
          pdf.text(`₹0.00`, 188, currentY, { align: 'right' });
        }
        pdf.setTextColor(51, 65, 85); // Reset

        currentY += 6;
      });

      // 7. Table Total Footer Row
      if (currentY > pageHeight - 20) {
        pdf.addPage();
        currentY = 20;
      }
      
      pdf.setFillColor(241, 245, 249);
      pdf.rect(15, currentY - 4.5, pageWidth - 30, 7.5, 'F');
      
      // Top & Bottom border for total row
      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(0.3);
      pdf.line(15, currentY - 4.5, pageWidth - 15, currentY - 4.5);
      pdf.line(15, currentY + 3, pageWidth - 15, currentY + 3);

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(15, 23, 42);
      
      pdf.text("Total", 18, currentY);
      pdf.text(`${totalMessMeals} meals`, 62, currentY, { align: 'center' });
      pdf.text(`₹${totalSpent.toLocaleString('en-IN')}`, 88, currentY, { align: 'right' });
      pdf.text(`₹${calculatedTotalChefCost.toLocaleString('en-IN')}`, 115, currentY, { align: 'right' });
      pdf.text(`₹${totalCollected.toLocaleString('en-IN')}`, 145, currentY, { align: 'right' });
      
      if (overallDue > 0) {
        pdf.setTextColor(22, 101, 52);
        pdf.text(`+₹${overallDue.toFixed(2)}`, 188, currentY, { align: 'right' });
      } else if (overallDue < 0) {
        pdf.setTextColor(185, 28, 28);
        pdf.text(`-₹${Math.abs(overallDue).toFixed(2)}`, 188, currentY, { align: 'right' });
      } else {
        pdf.setTextColor(100, 116, 139);
        pdf.text(`₹0.00`, 188, currentY, { align: 'right' });
      }

      // 8. Invoice Footer
      currentY += 20;
      if (currentY > pageHeight - 20) {
        pdf.addPage();
        currentY = 25;
      }
      
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(7.5);
      pdf.setTextColor(148, 163, 184); // Slate-400
      pdf.text("Thank you for choosing MealHub Mess Management System.", pageWidth / 2, currentY, { align: 'center' });
      pdf.text("This receipt is dynamically generated and legally valid for mess accounts auditing.", pageWidth / 2, currentY + 4, { align: 'center' });

      pdf.save(`${messInfo?.mess?.name || 'MealHub'}-${MONTHS[month - 1]}-${year}-bill.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  const totalCollected = data?.totalCollected || 0;
  const totalSpent = data?.totalSpent || 0;
  const balance = data?.balance || 0;
  const totalMessMeals = data?.totalMessMeals || 0;
  const perMealCost = data?.perMealCost || 0;
  const memberTotals = data?.memberTotals || [];

  // Current manager name
  const currentManagerId = messInfo?.currentManagerId?.toString();
  const currentManager = messInfo?.mess?.members?.find(m => m._id?.toString() === currentManagerId);

  // Build per-member money map
  const moneyByMember = data?.moneyByMember || {};

  const selectedMonthlyData = messInfo?.mess?.monthlyManagers?.find(
    m => m.month === month && m.year === year
  );
  const chefCost = selectedMonthlyData?.chefCost || 0;
  const selectedManagerId = selectedMonthlyData?.managerId?._id || selectedMonthlyData?.managerId;
  const isSelectedMonthManager = user && selectedManagerId && user._id.toString() === selectedManagerId.toString();
  const canEditChefCost = !!(user && isSelectedMonthManager);

  const statCards = [
    { icon: <Coins size={24} />, label: 'Total Collected', value: `₹${(totalCollected || 0).toLocaleString('en-IN')}`, color: '#22c55e' },
    { icon: <CreditCard size={24} />, label: 'Total Spent', value: `₹${(totalSpent || 0).toLocaleString('en-IN')}`, color: '#ef4444' },
    { icon: <Wallet size={24} />, label: 'Balance', value: `₹${(balance || 0).toLocaleString('en-IN')}`, color: balance >= 0 ? '#22c55e' : '#ef4444' },
    { icon: <Utensils size={24} />, label: 'Total Meals', value: totalMessMeals || 0, color: '#f59e0b' },
    { icon: <BarChart3 size={24} />, label: 'Per Meal Cost', value: `₹${(perMealCost || 0).toFixed(2)}`, color: '#7c6bff' },
    { icon: <Flame size={24} />, label: 'Gas Cylinders', value: gasCylinders.length || 0, color: '#ff6b9d' },
    { icon: <Package size={24} />, label: 'Rice Bags', value: riceBags.length || 0, color: '#7c6bff' },
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
                <span className="badge badge-accent" style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChefHat size={12} /> Manager: {currentManager.username}
                </span>
              </>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handlePDF} id="download-pdf-btn">
            <Download size={15} /> PDF
          </button>
        </div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Flame size={20} color="#ff6b9d" />
            <h3 style={{ margin: 0 }}>Gas Cylinders</h3>
            <span className="badge badge-accent">{gasCylinders.length} this month</span>
          </div>
          {isManager && (
            <button
              id="add-gas-toggle-btn"
              className="btn btn-primary btn-sm"
              onClick={() => setGasForm(f => ({ ...f, show: !f.show }))}
            >
              {gasForm.show ? <X size={14} /> : <Plus size={14} />} {gasForm.show ? 'Cancel' : 'Add Cylinder'}
            </button>
          )}
        </div>

        {/* Add Gas Form */}
        {gasForm.show && (
          <div className="card mb-16 fade-in" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent)' }}>
            <form onSubmit={handleAddGas} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', alignItems: 'flex-end' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Buying Date</label>
                <input type="date" className="form-input" style={{ padding: '6px 10px' }} 
                  value={gasForm.buyingDate} onChange={e => setGasForm(f => ({ ...f, buyingDate: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Price (₹)</label>
                <input type="number" className="form-input" style={{ padding: '6px 10px' }} placeholder="Price"
                  value={gasForm.price} onChange={e => setGasForm(f => ({ ...f, price: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Status</label>
                <select className="form-input" style={{ padding: '6px 10px' }} 
                  value={gasForm.isPaid ? 'paid' : 'due'} onChange={e => setGasForm(f => ({ ...f, isPaid: e.target.value === 'paid' }))}>
                  <option value="paid">Paid</option>
                  <option value="due">Due</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ height: '38px' }}>Save</button>
            </form>
          </div>
        )}

        {gasCylinders.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '20px 0' }}>
            🔥 No gas cylinders recorded this month
            {isManager && <><br /><span style={{ fontSize: '0.8rem' }}>Click + Add Cylinder above to record one</span></>}
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {gasCylinders.map((g, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px',
                    background: g.isPaid ? 'var(--success-bg)' : 'var(--warning-bg)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: g.isPaid ? 'var(--success)' : 'var(--warning)',
                  }}>
                    <Flame size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      ₹{g.price} 
                      <span className={`badge ${g.isPaid ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                        {g.isPaid ? 'Paid' : 'Due'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span>📅 Bought: {formatDate(g.buyingDate) || formatDate(g.date) || 'N/A'}</span>
                      {g.isPaid && (g.paymentDate || g.date) && (
                        <span>💸 Paid: {formatDate(g.paymentDate || g.date) || 'N/A'}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  {isManager && !g.isPaid && (
                    <button 
                      className="btn btn-secondary btn-sm" 
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      onClick={() => markGasPaid(g._id)}
                    >
                      Mark Paid
                    </button>
                  )}
                  {isManager && (
                    <button 
                      id={`delete-gas-${g._id}`}
                      className="btn btn-sm" 
                      style={{ padding: '4px 6px', color: '#ff4444', border: '1px solid #ff444422', position: 'relative', zIndex: 10, cursor: 'pointer' }}
                      onClick={(e) => {
                        console.log('Gas Delete button clicked for ID:', g._id);
                        deleteGas(g._id);
                      }}
                    >
                      <Trash2 size={14} style={{ pointerEvents: 'none' }} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rice Bags Section */}
      <div className="card mb-24">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Package size={20} color="#7c6bff" />
            <h3 style={{ margin: 0 }}>Rice Bags</h3>
            <span className="badge badge-accent">{riceBags.length} this month</span>
          </div>
          {isManager && (
            <button
              id="add-rice-toggle-btn"
              className="btn btn-primary btn-sm"
              onClick={() => setRiceForm(f => ({ ...f, show: !f.show }))}
            >
              {riceForm.show ? <X size={14} /> : <Plus size={14} />} {riceForm.show ? 'Cancel' : 'Add Rice Bag'}
            </button>
          )}
        </div>

        {/* Add Rice Form */}
        {riceForm.show && (
          <div className="card mb-16 fade-in" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent)' }}>
            <form onSubmit={handleAddRice} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', alignItems: 'flex-end' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Buying Date</label>
                <input type="date" className="form-input" style={{ padding: '6px 10px' }} 
                  value={riceForm.buyingDate} onChange={e => setRiceForm(f => ({ ...f, buyingDate: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Price (₹)</label>
                <input type="number" className="form-input" style={{ padding: '6px 10px' }} placeholder="Price"
                  value={riceForm.price} onChange={e => setRiceForm(f => ({ ...f, price: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Weight (e.g. 25kg)</label>
                <input type="text" className="form-input" style={{ padding: '6px 10px' }} placeholder="Weight"
                  value={riceForm.weight} onChange={e => setRiceForm(f => ({ ...f, weight: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Status</label>
                <select className="form-input" style={{ padding: '6px 10px' }} 
                  value={riceForm.isPaid ? 'paid' : 'due'} onChange={e => setRiceForm(f => ({ ...f, isPaid: e.target.value === 'paid' }))}>
                  <option value="paid">Paid</option>
                  <option value="due">Due</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ height: '38px' }}>Save</button>
            </form>
          </div>
        )}

        {riceBags.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '20px 0' }}>
            📦 No rice bags recorded this month
            {isManager && <><br /><span style={{ fontSize: '0.8rem' }}>Click + Add Rice Bag above to record one</span></>}
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {riceBags.map((r, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px',
                    background: r.isPaid ? 'var(--success-bg)' : 'var(--warning-bg)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: r.isPaid ? 'var(--success)' : 'var(--warning)',
                  }}>
                    <Package size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      ₹{r.price} 
                      {r.weight && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>({r.weight})</span>}
                      <span className={`badge ${r.isPaid ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                        {r.isPaid ? 'Paid' : 'Due'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span>📅 Bought: {formatDate(r.buyingDate) || 'N/A'}</span>
                      {r.isPaid && r.paymentDate && (
                        <span>💸 Paid: {formatDate(r.paymentDate) || 'N/A'}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  {isManager && !r.isPaid && (
                    <button 
                      className="btn btn-secondary btn-sm" 
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      onClick={() => markRicePaid(r._id)}
                    >
                      Mark Paid
                    </button>
                  )}
                  {isManager && (
                    <button 
                      id={`delete-rice-${r._id}`}
                      className="btn btn-sm" 
                      style={{ padding: '4px 6px', color: '#ff4444', border: '1px solid #ff444422', position: 'relative', zIndex: 10, cursor: 'pointer' }}
                      onClick={() => deleteRice(r._id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Individual Meal Cost Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <User size={18} color="var(--accent)" /> Individual Meal Cost — {MONTHS[month - 1]} {year}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {perMealCost > 0 && (
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Per meal: <strong style={{ color: 'var(--accent)' }}>₹{perMealCost.toFixed(2)}</strong>
              </span>
            )}
            {canEditChefCost ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Chef Cost (₹):</span>
                <input 
                  type="number" 
                  className="form-input" 
                  style={{ width: '80px', padding: '4px 8px', fontSize: '0.85rem', height: '28px', margin: 0 }}
                  placeholder="0"
                  value={chefCostInput}
                  onChange={e => setChefCostInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveChefCost()}
                />
                <button 
                  onClick={handleSaveChefCost}
                  className="btn btn-primary"
                  style={{ 
                    padding: '2px 8px', 
                    fontSize: '0.75rem', 
                    height: '24px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  Save
                </button>
              </div>
            ) : (
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Chef Cost: <strong style={{ color: 'var(--accent)' }}>₹{chefCost}</strong>
              </span>
            )}
          </div>
        </div>

        {memberTotals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <div style={{ marginBottom: '12px', opacity: 0.5 }}>
              <Utensils size={48} />
            </div>
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
                  <th style={{ textAlign: 'right' }}>Chef Cost</th>
                  <th style={{ textAlign: 'right' }}>Given</th>
                  <th style={{ textAlign: 'right' }}>Due / Extra</th>
                </tr>
              </thead>
              <tbody>
                {memberTotals.map((m, i) => {
                  const name = m.memberId?.username || 'Unknown';
                  const id = m.memberId?._id?.toString() || m.memberId?.toString();
                  const mealCost = m.total * perMealCost;
                  const totalMemberCost = mealCost + chefCost;
                  const given = moneyByMember[id] || 0;
                  const due = given - totalMemberCost;
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
                      <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)' }}>₹{chefCost.toFixed(2)}</td>
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
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{(chefCost * memberTotals.length).toLocaleString('en-IN')}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{totalCollected.toLocaleString('en-IN')}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>
                    <span className={(totalCollected - (totalSpent + chefCost * memberTotals.length)) >= 0 ? 'amount-positive' : 'amount-negative'}>
                      {(totalCollected - (totalSpent + chefCost * memberTotals.length)) >= 0 ? '+' : ''}₹{Math.abs(totalCollected - (totalSpent + chefCost * memberTotals.length)).toFixed(2)}
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
