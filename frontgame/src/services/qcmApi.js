// Ajoutez cette section à votre fichier eleveApi.js existant

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Ajouter ces nouvelles méthodes à votre objet eleveApi existant
export const qcmApi = {
  // Récupérer les questions QCM pour un texte
  getQCMByTexte: async (idTexte) => {
    try {
      const response = await fetch(`${API_BASE_URL}/qcm/${idTexte}`, {
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

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
      }
      throw error;
    }
  },

  // Enregistrer une réponse QCM
  enregistrerReponse: async (idQCM, idHys, reponseEtudiant) => {
    try {
      const response = await fetch(`${API_BASE_URL}/repence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          idQCM,
          idHys,
          reponseEtudiant
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erreur || data.error || `Erreur ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
      }
      throw error;
    }
  }
};