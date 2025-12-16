
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import QuoteView from './src/pages/QuoteView';
import WelcomeView from './src/pages/WelcomeView';
import IntroView from './src/pages/IntroView';
import AdminDashboard from './src/pages/AdminDashboard';
import Loading from './src/components/ui/Loading';
import { ClientData, QuoteData } from './src/types';
import { mockQuote } from './src/data/mock';
import { delay } from './src/lib/utils';

// Definição dos estados possíveis da aplicação (State Machine simples)
// Isso evita a necessidade de um Router complexo para um app linear.
type ViewState = 'intro' | 'welcome' | 'quote' | 'admin';

const App: React.FC = () => {
  // --- GERENCIAMENTO DE ESTADO GLOBAL ---

  // Controla qual "Página" está visível para o usuário
  const [view, setView] = useState<ViewState>('intro');
  
  // Armazena os dados do cliente capturados na WelcomeView
  // Esses dados são passados para a QuoteView para personalizar a oferta e calcular logística
  const [clientData, setClientData] = useState<ClientData | null>(null);
  
  // Controla a exibição da tela de carregamento "cinematográfica" entre transições
  const [isLoading, setIsLoading] = useState(false);
  
  // Configuração global de preços e regras.
  // Inicia com os dados do arquivo 'mock.ts', mas pode ser atualizado via AdminDashboard em tempo de execução.
  const [config, setConfig] = useState<QuoteData>(mockQuote);

  /**
   * Handler: Início do Processo
   * Acionado quando o usuário termina de preencher o formulário inicial.
   * Realiza uma transição suave com loading artificial para gerar expectativa.
   */
  const handleStart = async (data: ClientData) => {
    setClientData(data);
    
    // Ativa o Loading Overlay
    setIsLoading(true);
    
    // Pequeno delay artificial (UX) para o usuário sentir que algo complexo está sendo processado
    await delay(2000); 
    
    setIsLoading(false);
    
    // Transição de estado: Vai para a tela de Orçamento
    setView('quote');
    
    // Garante que a nova tela comece do topo
    window.scrollTo(0, 0);
  };

  /**
   * Handler: Atualização Administrativa
   * Permite que o painel Admin altere os preços base (ex: preço por Km, preço base)
   * sem precisar recarregar a página ou alterar código.
   */
  const handleAdminUpdate = (newConfig: QuoteData) => {
    setConfig(newConfig);
  };

  return (
    <main className="w-full min-h-screen bg-neutral-950 text-neutral-100 selection:bg-brand-DEFAULT selection:text-white overflow-x-hidden font-sans">
      
      {/* 
        AnimatePresence: Gerencia a saída (unmount) de componentes animados.
        Fundamental para que a tela de Loading faça o fade-out antes de sumir.
      */}
      <AnimatePresence>
        {isLoading && <Loading key="loader" />}
      </AnimatePresence>

      {/* RENDERIZAÇÃO CONDICIONAL DAS VIEWS */}
      {!isLoading && (
        <>
          {/* 1. View: Intro (Escolha de Caminho) */}
          {view === 'intro' && (
             <IntroView onContinue={() => setView('welcome')} />
          )}

          {/* 2. View: Welcome (Formulário de Dados) */}
          {view === 'welcome' && (
            <WelcomeView 
              onStart={handleStart} 
              onAdminClick={() => setView('admin')} 
            />
          )}

          {/* 3. View: Quote (Configurador Principal) */}
          {/* Só renderiza se tivermos os dados do cliente garantidos */}
          {view === 'quote' && clientData && (
            <QuoteView 
              clientData={clientData} 
              onUpdateClientData={setClientData}
              config={config} 
            />
          )}

          {/* 4. View: Admin (Painel Protegido) */}
          {view === 'admin' && (
            <AdminDashboard 
              currentConfig={config}
              onUpdateConfig={handleAdminUpdate}
              onExit={() => setView('welcome')}
            />
          )}
        </>
      )}
    </main>
  );
};

export default App;
