import React from 'react';
import { useProfAuthContext } from '../../contexts/ProfAuthContext';
import './ProfDashboard.css';

const ProfDashboard = () => {
  const { user, logout } = useProfAuthContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="prof-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard Professeur</h1>
          <div className="user-info">
            <span>Bienvenue, {user?.nom} {user?.prenom}</span>
            <button onClick={handleLogout} className="logout-button">
              Déconnexion
            </button>
          </div>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="welcome-section">
            <h2>Bienvenue dans votre espace professeur</h2>
            <p>Voici votre tableau de bord où vous pouvez gérer vos cours et étudiants.</p>
          </div>
          
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Mes Classes</h3>
              <p>Gérer vos classes et étudiants</p>
              <button className="card-button">Voir les classes</button>
            </div>
            
            <div className="dashboard-card">
              <h3>Textes</h3>
              <p>Gérer les textes et exercices</p>
              <button className="card-button">Gérer les textes</button>
            </div>
            
            <div className="dashboard-card">
              <h3>Évaluations</h3>
              <p>Suivre les performances</p>
              <button className="card-button">Voir les résultats</button>
            </div>
            
            <div className="dashboard-card">
              <h3>Profil</h3>
              <p>Modifier vos informations</p>
              <button className="card-button">Modifier le profil</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfDashboard;