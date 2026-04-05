import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(''); // NEW: Track the user
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('userEmail'); // NEW: Get saved email
    
    if (token && savedEmail) {
      setIsAuthenticated(true);
      setUserEmail(savedEmail); // NEW: Put it in state
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('userEmail', email); // NEW: Save it to the browser
    setUserEmail(email); // NEW: Update the state instantly
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail'); // NEW: Clear it on logout
    setUserEmail('');
    setIsAuthenticated(false);
  };

  if (loading) return null;

  // NEW: Pass `userEmail` down to the rest of the app
  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);