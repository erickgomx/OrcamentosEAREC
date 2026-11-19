// ============================================================================
// EAREC AUDIOVISUAL - ENTRY POINT DO REACT (src/main.tsx)
// ============================================================================
// Olá, dev! 👋
// Ponto de entrada oficial da aplicação React 18:
// 1. Obtém o elemento raiz do DOM (`document.getElementById('root')`).
// 2. Envolve a árvore de componentes no `ThemeProvider` para suporte a Dark/Light mode.
// 3. Renderiza o aplicativo dentro do `React.StrictMode`.
// ============================================================================
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
