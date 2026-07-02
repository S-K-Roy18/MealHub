import { usePeriod } from '../context/PeriodContext';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function PeriodSelector() {
  const { filterValue, setFilterValue, periods } = usePeriod();

  const generateAvailableMonths = () => {
    const monthsList = [];
    const startYear = 2024;
    const now = new Date();
    const currentYear = now.getFullYear();
    for (let y = currentYear; y >= startYear; y--) {
      for (let m = 11; m >= 0; m--) {
        if (y === currentYear && m > now.getMonth()) continue;
        monthsList.push({
          value: `month:${m + 1}-${y}`,
          label: `🗓 ${MONTHS[m]} ${y}`
        });
      }
    }
    return monthsList;
  };

  return (
    <select 
      className="form-input" 
      style={{ width: '260px', padding: '4px 8px', fontSize: '0.875rem', height: '32px', margin: 0, cursor: 'pointer' }}
      value={filterValue}
      onChange={e => setFilterValue(e.target.value)}
    >
      <option value="active">📅 Current Period</option>
      
      {periods.length > 0 && (
        <optgroup label="Previous Periods">
          {periods.map(p => (
            <option key={p._id} value={`period:${p._id}`}>
              {new Date(p.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - {new Date(p.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              {p.isActive ? ' (Active)' : ''}
            </option>
          ))}
        </optgroup>
      )}

      <optgroup label="Monthly History">
        {generateAvailableMonths().map(m => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </optgroup>
    </select>
  );
}
