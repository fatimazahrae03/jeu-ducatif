import { useState, useCallback } from 'react';
import { eleveApi } from '../services/eleveApi';

export const useEleveTexte = () => {
  const [texte, setTexte] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTexte = useCallback(async (idEleve) => {
    if (!idEleve) {
      setError('ID élève requis');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await eleveApi.getTexteForEleve(idEleve);
      setTexte(response.texte || response);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors de la récupération du texte:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearTexte = useCallback(() => {
    setTexte(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    texte,
    loading,
    error,
    fetchTexte,
    clearTexte,
    clearError
  };
};