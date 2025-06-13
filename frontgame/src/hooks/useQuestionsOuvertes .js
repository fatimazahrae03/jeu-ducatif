import { useState, useCallback } from 'react';

export const useQuestionsOuvertes = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Récupérer les questions ouvertes pour un texte
  const fetchQuestionsOuvertes = useCallback(async (idTexte) => {
    if (!idTexte) {
      setError('ID du texte requis');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/questionouvert/${idTexte}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.erreur || `Erreur ${response.status}`);
      }

      setQuestions(data || []);
      return data;
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des questions');
      console.error('Erreur lors de la récupération des questions ouvertes:', err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // Enregistrer une réponse et obtenir l'évaluation IA
  const submitAnswer = useCallback(async (idQO, reponseEtudiant) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/evaluations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          idQO,
          reponseEtudiant
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erreur || data.error || `Erreur ${response.status}`);
      }

      return data;
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de la réponse:', err);
      throw err;
    }
  }, [API_BASE_URL]);

  // Réinitialiser les données
  const clearQuestions = useCallback(() => {
    setQuestions([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    questions,
    loading,
    error,
    fetchQuestionsOuvertes,
    submitAnswer,
    clearQuestions,
    clearError
  };
};