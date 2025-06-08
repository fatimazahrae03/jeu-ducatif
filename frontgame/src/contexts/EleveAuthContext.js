
import React, { createContext, useContext, useEffect } from 'react';
import { useEleveAuth } from '../hooks/useEleveAuth';

const EleveAuthContext = createContext(null);

export const EleveAuthProvider = ({ children }) => {
  const eleveAuth = useEleveAuth();

  useEffect(() => {
    eleveAuth.checkAuthStatus();
  }, []);

  return (
    <EleveAuthContext.Provider value={eleveAuth}>
      {children}
    </EleveAuthContext.Provider>
  );
};

export const useEleveAuthContext = () => {
  const context = useContext(EleveAuthContext);
  if (!context) {
    throw new Error('useEleveAuthContext doit être utilisé dans EleveAuthProvider');
  }
  return context;
};