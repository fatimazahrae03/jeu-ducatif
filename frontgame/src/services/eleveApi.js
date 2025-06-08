const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const eleveApi = {
  // Authentification
  login: async (cne, dateNaissance) => {
    try {
      const response = await fetch(`${API_BASE_URL}/eleve/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          cne: cne.trim(),
          dateNaissance: dateNaissance
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
      }
      throw error;
    }
  },

  // Gestion des textes
  getTexteForEleve: async (idEleve) => {
    try {
      const response = await fetch(`${API_BASE_URL}/texteeleve/${idEleve}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
      }
      throw error;
    }
  },

  // Futurs endpoints pour les textes
  createTexte: async (idEleve, texteData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/texteeleve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          idEleve,
          ...texteData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
      }
      throw error;
    }
  },

  updateTexte: async (idTexte, texteData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/texteeleve/${idTexte}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(texteData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}`);
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