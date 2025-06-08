import React from 'react';
import { EleveAuthProvider } from './contexts/EleveAuthContext.js';
import { EleveTexteProvider } from './contexts/EleveTexteContext';
import MainApp from './components/MainApp';
import './App.css';

function App() {
  return (
    <EleveAuthProvider>
      <EleveTexteProvider>
        <MainApp />
      </EleveTexteProvider>
    </EleveAuthProvider>
  );
}

export default App;