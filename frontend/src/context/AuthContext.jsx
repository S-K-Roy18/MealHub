import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [mess, setMess] = useState(null);
  const [isManager, setIsManager] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('mealhub_token');
    if (token) {
      api.get('/auth/me')
        .then(res => {
          setUser(res.data.user);
          setMess(res.data.mess);
          setIsManager(res.data.isManager);
        })
        .catch(() => {
          localStorage.removeItem('mealhub_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (mobile, gmail) => {
    const res = await api.post('/auth/login', { mobile, gmail });
    localStorage.setItem('mealhub_token', res.data.token);
    setUser(res.data.user);
    setMess(res.data.mess);
    setIsManager(res.data.isManager);
    return res.data;
  };

  const signup = async (username, mobile, gmail) => {
    const res = await api.post('/auth/signup', { username, mobile, gmail });
    localStorage.setItem('mealhub_token', res.data.token);
    setUser(res.data.user);
    setMess(null);
    setIsManager(false);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('mealhub_token');
    setUser(null);
    setMess(null);
    setIsManager(false);
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
      setMess(res.data.mess);
      setIsManager(res.data.isManager);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, mess, isManager, loading, login, signup, logout, refreshUser, setMess }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
