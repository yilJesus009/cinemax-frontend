import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getMe, loginUser, registerUser } from '../api/auth.js';
import { clearSession, getStoredUser, getToken, saveSession } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(getStoredUser());
  const [loading, setLoading] = useState(Boolean(getToken()));

  useEffect(() => {
    const hydrate = async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getMe();
        setUsuario(currentUser);
        saveSession({ token: getToken(), usuario: currentUser });
      } catch {
        clearSession();
        setUsuario(null);
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, []);

  const login = async (payload) => {
    const session = await loginUser(payload);
    saveSession(session);
    setUsuario(session.usuario);
    return session.usuario;
  };

  const register = async (payload) => {
    const session = await registerUser(payload);
    saveSession(session);
    setUsuario(session.usuario);
    return session.usuario;
  };

  const logout = () => {
    clearSession();
    setUsuario(null);
  };

  const value = useMemo(() => {
    const role = usuario?.role || usuario?.rol;
    return {
      usuario,
      loading,
      role,
      isAuthenticated: Boolean(usuario),
      isCliente: role === 'cliente',
      isAdmin: role === 'admin',
      login,
      register,
      logout
    };
  }, [usuario, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
