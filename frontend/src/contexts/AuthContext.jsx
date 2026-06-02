import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginApi, signup as signupApi } from '../services/authService';

const AuthContext = createContext({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('drivex-access-token') || '');

  useEffect(() => {
    const storedUser = localStorage.getItem('drivex-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('drivex-access-token', accessToken);
    } else {
      localStorage.removeItem('drivex-access-token');
    }
  }, [accessToken]);

  const login = async (credentials) => {
    const payload = await loginApi(credentials);
    setUser(payload.user);
    setAccessToken(payload.accessToken);
    localStorage.setItem('drivex-user', JSON.stringify(payload.user));
    return payload;
  };

  const signup = async (payload) => {
    const result = await signupApi(payload);
    setUser(result.user);
    setAccessToken(result.accessToken);
    localStorage.setItem('drivex-user', JSON.stringify(result.user));
    return result;
  };

  const logout = () => {
    setUser(null);
    setAccessToken('');
    localStorage.removeItem('drivex-user');
    localStorage.removeItem('drivex-access-token');
  };

  const value = useMemo(
    () => ({ user, accessToken, isAuthenticated: Boolean(accessToken), login, signup, logout }),
    [user, accessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
