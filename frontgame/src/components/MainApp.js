import React, { useState } from 'react';
import { useEleveAuthContext } from '../contexts/EleveAuthContext.js';
import { useProfAuthContext } from '../contexts/ProfAuthContext.js';
import HomePage from './HomePage';
import LoginForm from './auth/LoginForm';
import ProfLoginForm from './auth/ProfLoginForm';
import EleveDashboard from './dashboard/EleveDashboard';
import ProfDashboard from './dashboard/ProfDashboard';

const MainApp = () => {
  const { isAuthenticated: isEleveAuth, loading: eleveLoading } = useEleveAuthContext();
  const { isAuthenticated: isProfAuth, loading: profLoading } = useProfAuthContext();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleBackToHome = () => {
    setSelectedRole(null);
  };

  if (eleveLoading || profLoading) {
    return (
      <div className="app-loading">
        <p>Chargement...</p>
      </div>
    );
  }

  // Si l'utilisateur est authentifié en tant qu'élève
  if (isEleveAuth && selectedRole === 'eleve') {
    return <EleveDashboard />;
  }

  // Si l'utilisateur est authentifié en tant que professeur
  if (isProfAuth && selectedRole === 'prof') {
    return <ProfDashboard />;
  }

  // Si aucun rôle n'est sélectionné, afficher la page d'accueil
  if (!selectedRole) {
    return <HomePage onRoleSelect={handleRoleSelect} />;
  }

  // Gestion des différents rôles
  switch (selectedRole) {
    case 'eleve':
      return (
        <div className="app">
          <div className="back-button-container">
            <button 
              className="back-button"
              onClick={handleBackToHome}
            >
              ← Retour à l'accueil
            </button>
          </div>
          <LoginForm />
        </div>
      );
    
    case 'prof':
      return (
        <div className="app">
          <div className="back-button-container">
            <button 
              className="back-button"
              onClick={handleBackToHome}
            >
              ← Retour à l'accueil
            </button>
          </div>
          <ProfLoginForm />
        </div>
      );
    
    case 'admin':
      return (
        <div className="app">
          <div className="back-button-container">
            <button 
              className="back-button"
              onClick={handleBackToHome}
            >
              ← Retour à l'accueil
            </button>
          </div>
          <div className="coming-soon">
            <h2>Connexion Administrateur</h2>
            <p>Cette section sera bientôt disponible</p>
          </div>
        </div>
      );
    
    default:
      return <HomePage onRoleSelect={handleRoleSelect} />;
  }
};

export default MainApp;