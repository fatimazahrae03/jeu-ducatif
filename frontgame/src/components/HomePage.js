import React from 'react';
import './HomePage.css';

const HomePage = ({ onRoleSelect }) => {
  return (
    <div className="homepage">
      <div className="homepage-container">
        <h1 className="homepage-title">Bienvenue</h1>
        <p className="homepage-subtitle">Choisissez votre profil pour continuer</p>
        
        <div className="role-buttons">
          <button 
            className="role-button eleve-button"
            onClick={() => onRoleSelect('eleve')}
          >
            <div className="button-content">
              <span className="button-icon">🎓</span>
              <span className="button-text">Élève</span>
            </div>
          </button>
          
          <button 
            className="role-button prof-button"
            onClick={() => onRoleSelect('prof')}
          >
            <div className="button-content">
              <span className="button-icon">👨‍🏫</span>
              <span className="button-text">Professeur</span>
            </div>
          </button>
          
          <button 
            className="role-button admin-button"
            onClick={() => onRoleSelect('admin')}
          >
            <div className="button-content">
              <span className="button-icon">⚙️</span>
              <span className="button-text">Administrateur</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;