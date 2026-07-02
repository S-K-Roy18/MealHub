import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const PeriodContext = createContext(null);

export function PeriodProvider({ children }) {
  const { user } = useAuth();
  const [filterValue, setFilterValue] = useState(() => localStorage.getItem('mealhub_period_filter') || 'active');
  const [periods, setPeriods] = useState([]);

  useEffect(() => {
    if (user) {
      fetchPeriods();
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('mealhub_period_filter', filterValue);
  }, [filterValue]);

  const fetchPeriods = async () => {
    try {
      const res = await api.get('/period');
      setPeriods(res.data.periods || []);
    } catch (err) {
      console.error('Failed to fetch periods', err);
    }
  };

  const getQueryParams = () => {
    if (filterValue === 'active') {
      return {};
    } else if (filterValue.startsWith('period:')) {
      return { periodId: filterValue.split(':')[1] };
    } else if (filterValue.startsWith('month:')) {
      const parts = filterValue.split(':')[1].split('-');
      return { month: parts[0], year: parts[1] };
    }
    return {};
  };

  return (
    <PeriodContext.Provider value={{ filterValue, setFilterValue, periods, fetchPeriods, getQueryParams }}>
      {children}
    </PeriodContext.Provider>
  );
}

export const usePeriod = () => useContext(PeriodContext);
