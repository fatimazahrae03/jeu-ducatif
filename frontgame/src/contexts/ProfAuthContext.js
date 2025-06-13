import React, { createContext, useContext, useEffect } from 'react';
import { useProfAuth } from '../hooks/useProfAuth.js';

const ProfAuthContext = createContext(null);

export const ProfAuthProvider = ({ children }) => {
  const profAuth = useProfAuth();

  useEffect(() => {
    profAuth.checkAuthStatus();
  }, []);

  return (
    <ProfAuthContext.Provider value={profAuth}>
      {children}
    </ProfAuthContext.Provider>
  );
};

export const useProfAuthContext = () => {
  const context = useContext(ProfAuthContext);
  if (!context) {
    throw new Error('useProfAuthContext doit être utilisé dans ProfAuthProvider');
  }
  return context;
};