import React from 'react';
import { EleveAuthProvider } from './contexts/EleveAuthContext.js';
import { ProfAuthProvider } from './contexts/ProfAuthContext.js';
import { EleveTexteProvider } from './contexts/EleveTexteContext';
import MainApp from './components/MainApp';
import './App.css';

function App() {
  return (
    <EleveAuthProvider>
      <ProfAuthProvider>
        <EleveTexteProvider>
          <MainApp />
        </EleveTexteProvider>
      </ProfAuthProvider>
    </EleveAuthProvider>
  );
}

export default App;