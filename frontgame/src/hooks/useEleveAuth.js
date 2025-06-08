import { useState, useCallback } from 'react';
import { eleveApi } from '../services/eleveApi';

export const useEleveAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (cne, dateNaissance) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eleveApi.login(cne, dateNaissance);
      setUser(response.eleve);
      localStorage.setItem('eleveData', JSON.stringify(response.eleve));
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    localStorage.removeItem('eleveData');
  }, []);

  const checkAuthStatus = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('eleveData');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Erreur lors de la vérification de l\'authentification:', err);
      localStorage.removeItem('eleveData');
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
    checkAuthStatus,
    clearError,
    isAuthenticated: !!user
  };
};