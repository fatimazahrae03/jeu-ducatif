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
      
      // Restructurer les données selon le format de votre API
      let normalizedTexte;
      
      if (response.idTexte && response.texte) {
        // Format de votre API: { idTexte: 8, texte: "contenu..." }
        normalizedTexte = {
          idTexte: response.idTexte,
          id: response.idTexte, // Ajouter id pour compatibilité
          contenu: response.texte, // Le contenu du texte
          titre: response.titre || null, // Si il y a un titre
          dateCreation: response.dateCreation || null
        };
      } else if (response.texte) {
        // Ancienne logique de fallback
        normalizedTexte = response.texte;
      } else {
        normalizedTexte = response;
      }

      console.log('Texte normalisé:', normalizedTexte); // Pour debug
      setTexte(normalizedTexte);
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