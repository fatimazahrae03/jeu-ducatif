import React, { createContext, useContext } from 'react';
import { useEleveTexte } from '../hooks/useEleveTexte';

const EleveTexteContext = createContext(null);

export const EleveTexteProvider = ({ children }) => {
  const eleveTexte = useEleveTexte();

  return (
    <EleveTexteContext.Provider value={eleveTexte}>
      {children}
    </EleveTexteContext.Provider>
  );
};

export const useEleveTexteContext = () => {
  const context = useContext(EleveTexteContext);
  if (!context) {
    throw new Error('useEleveTexteContext doit être utilisé dans EleveTexteProvider');
  }
  return context;
};