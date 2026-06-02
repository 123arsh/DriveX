import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AdminAuthContext = createContext({
  token: null,
  admin: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('drivex-admin-token') || '');
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('drivex-admin-user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('drivex-admin-token', token);
    } else {
      localStorage.removeItem('drivex-admin-token');
    }
  }, [token]);

  useEffect(() => {
    if (admin) {
      localStorage.setItem('drivex-admin-user', JSON.stringify(admin));
    } else {
      localStorage.removeItem('drivex-admin-user');
    }
  }, [admin]);

  const login = async ({ token: newToken, admin: adminData }) => {
    setToken(newToken);
    setAdmin(adminData);
    return { token: newToken, admin: adminData };
  };

  const logout = () => {
    setToken('');
    setAdmin(null);
  };

  const value = useMemo(
    () => ({ token, admin, isAuthenticated: Boolean(token), login, logout }),
    [token, admin]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

export default AdminAuthContext;
