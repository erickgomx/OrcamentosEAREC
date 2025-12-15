
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

// Definição dos possíveis estados da tela (Roteamento simples sem biblioteca externa)
type ViewState = 'intro' | 'welcome' | 'quote' | 'admin';

const App: React.FC = () => {
  // 'view' controla qual tela está sendo exibida no momento
  const [view, setView] = useState<ViewState>('intro');
  
  // 'clientData' armazena as informações preenchidas pelo usuário (Nome, Local, etc)
  const [clientData, setClientData] = useState<ClientData | null>(null);
  
  // Estado para controlar a exibição do loading screen
  const [isLoading, setIsLoading] = useState(false);
  
  // 'config' armazena os preços e regras de negócio. Inicia com o mock, mas pode ser alterado no painel Admin.
  const [config, setConfig] = useState<QuoteData>(mockQuote);

  /**
   * Função chamada quando o usuário termina de preencher o formulário na WelcomeView.
   * Ela simula um carregamento e transiciona para a tela de Orçamento (QuoteView).
   */
  const handleStart = async (data: ClientData) => {
    setClientData(data);
    
    // Ativa a tela de loading para dar um feedback visual e criar expectativa ("Cinematic Feel")
    setIsLoading(true);
    await delay(2000); // Aguarda 2 segundos
    setIsLoading(false);
    
    // Troca para a visualização do orçamento e rola para o topo
    setView('quote');
    window.scrollTo(0, 0);
  };

  /**
   * Função para atualizar as configurações vindas do AdminDashboard
   */
  const handleAdminUpdate = (newConfig: QuoteData) => {
    setConfig(newConfig);
  };

  return (
    <main className="w-full min-h-screen bg-neutral-950 text-neutral-100 selection:bg-brand-DEFAULT selection:text-white overflow-x-hidden font-sans">
      
      {/* 
        AnimatePresence permite animar componentes quando eles são removidos da árvore DOM (unmount).
        Usado aqui para fazer o Loading desaparecer suavemente.
      */}
      <AnimatePresence>
        {isLoading && <Loading key="loader" />}
      </AnimatePresence>

      {/* Renderização Condicional das Telas */}
      {!isLoading && (
        <>
          {/* 1. Tela de Introdução (Escolha entre Instagram ou Orçamento) */}
          {view === 'intro' && (
             <IntroView onContinue={() => setView('welcome')} />
          )}

          {/* 2. Tela de Boas-vindas (Formulário) */}
          {view === 'welcome' && (
            <WelcomeView 
              onStart={handleStart} 
              onAdminClick={() => setView('admin')} 
            />
          )}

          {/* 3. Tela Principal de Orçamento (Cálculos e Configuração) */}
          {view === 'quote' && clientData && (
            <QuoteView 
              clientData={clientData} 
              config={config} 
            />
          )}

          {/* 4. Painel Administrativo (Senha protegida) */}
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
