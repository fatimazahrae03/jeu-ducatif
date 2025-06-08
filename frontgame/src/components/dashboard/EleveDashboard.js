import React from 'react';
import { useEleveAuthContext } from '../../contexts/EleveAuthContext.js';
import EleveTexteDisplay from '../texte/EleveTexteDisplay';

const EleveDashboard = () => {
  const { user, logout } = useEleveAuthContext();

  return (
    <div className="eleve-dashboard">
      <header className="dashboard-header">
        <h1>Tableau de bord</h1>
        <div className="user-info">
          <span>Bonjour, {user?.nom} {user?.prenom}</span>
          <button onClick={logout} className="logout-btn">
            Déconnexion
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <EleveTexteDisplay />
      </main>
    </div>
  );
};

export default EleveDashboard;