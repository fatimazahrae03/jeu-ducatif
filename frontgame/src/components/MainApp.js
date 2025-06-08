import React from 'react';
import { useEleveAuthContext } from '../contexts/EleveAuthContext.js';
import LoginForm from './auth/LoginForm';
import EleveDashboard from './dashboard/EleveDashboard';

const MainApp = () => {
  const { isAuthenticated, loading } = useEleveAuthContext();

  if (loading) {
    return (
      <div className="app-loading">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {isAuthenticated ? (
        <EleveDashboard />
      ) : (
        <LoginForm />
      )}
    </div>
  );
};

export default MainApp;