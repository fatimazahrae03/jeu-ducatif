const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const profApi = {
  // Authentification professeur
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/loginprof`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erreur ${response.status}`);
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