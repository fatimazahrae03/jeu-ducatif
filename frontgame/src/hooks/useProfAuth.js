import { useState, useCallback } from 'react';
import { profApi } from '../services/profApi';

export const useProfAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await profApi.login(email, password);
      setUser(response.professeur);
      localStorage.setItem('profData', JSON.stringify(response.professeur));
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
    localStorage.removeItem('profData');
  }, []);

  const checkAuthStatus = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('profData');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Erreur lors de la vérification de l\'authentification prof:', err);
      localStorage.removeItem('profData');
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