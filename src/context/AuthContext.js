import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const login    = (u, p) => { if (!u||!p) throw new Error('Fill in both fields'); setUser(u==='admin'&&p==='admin123' ? { username:'admin', role:'admin' } : { username:u, role:'user' }); };
  const register = (u, p) => { if (!u||!p) throw new Error('Fill in both fields'); setUser({ username:u, role:'user' }); };
  const logout   = ()     => setUser(null);
  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
