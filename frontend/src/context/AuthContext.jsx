import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAuthToken, clearAuthToken } from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore the session from the stored token if valid.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    setAuthToken(token);
    api
      .get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('token');
        clearAuthToken();
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (name, email, password) => {
    const { data } = await api.post('/auth/signup', { name, email, password });
    localStorage.setItem('token', data.token);
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    clearAuthToken();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, signup, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);