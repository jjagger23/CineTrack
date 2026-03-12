import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Mock credentials — swap these out when the real backend is ready
// admin / admin123  →  gets the admin panel
// any other username/password  →  logs in as a standard user
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    if (!username || !password) throw new Error('Fill in both fields');
    if (username === 'admin' && password === 'admin123') {
      setUser({ username: 'admin', role: 'admin' });
    } else {
      setUser({ username, role: 'user' });
    }
  };

  const register = (username, password) => {
    if (!username || !password) throw new Error('Fill in both fields');
    setUser({ username, role: 'user' });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
