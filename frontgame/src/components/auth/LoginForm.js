import React, { useState } from 'react';
import { useEleveAuthContext } from '../../contexts/EleveAuthContext.js';

const LoginForm = ({ onLoginSuccess }) => {
  const [cne, setCne] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const { login, loading, error, clearError } = useEleveAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    try {
      await login(cne, dateNaissance);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      // L'erreur est déjà gérée dans le hook
    }
  };

  return (
    <div className="login-form">
      <h2>Connexion Élève</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cne">CNE:</label>
          <input
            type="text"
            id="cne"
            value={cne}
            onChange={(e) => setCne(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="dateNaissance">Date de naissance:</label>
          <input
            type="date"
            id="dateNaissance"
            value={dateNaissance}
            onChange={(e) => setDateNaissance(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;