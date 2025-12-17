
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import QuoteView from './src/pages/QuoteView';
import WelcomeView from './src/pages/WelcomeView';
import IntroView from './src/pages/IntroView';
import LandingView from './src/pages/LandingView';
import AdminDashboard from './src/pages/AdminDashboard';
import Loading from './src/components/ui/Loading';
import Logo from './src/components/ui/Logo';
import BackgroundFilmStrips from './src/components/ui/BackgroundFilmStrips'; // Importação do novo componente
import { ClientData, QuoteData } from './src/types';
import { mockQuote } from './src/data/mock';
import { delay } from './src/lib/utils';

// Definição dos estados possíveis da aplicação
type ViewState = 'landing' | 'intro' | 'welcome' | 'quote' | 'admin';

const App: React.FC = () => {
  // --- GERENCIAMENTO DE ESTADO GLOBAL ---

  // Controla a Splash Screen Inicial
  const [showSplash, setShowSplash] = useState(true);

  // Controla qual "Página" está visível para o usuário
  const [view, setView] = useState<ViewState>('landing');
  
  // Armazena os dados do cliente capturados na WelcomeView
  const [clientData, setClientData] = useState<ClientData | null>(null);
  
  // Controla a exibição da tela de carregamento "cinematográfica"
  const [isLoading, setIsLoading] = useState(false);
  
  // Configuração global de preços e regras.
  const [config, setConfig] = useState<QuoteData>(mockQuote);

  // Efeito para remover a Splash Screen após alguns segundos
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    
    // Tempo de exibição da tela inicial (3.5 segundos)
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500); 
    return () => clearTimeout(timer);
  }, []);

  /**
   * Handler: Início do Processo
   */
  const handleStart = async (data: ClientData) => {
    setClientData(data);
    setIsLoading(true);
    await delay(2000); 
    setIsLoading(false);
    setView('quote');
    window.scrollTo(0, 0);
  };

  /**
   * Handler: Atualização Administrativa
   */
  const handleAdminUpdate = (newConfig: QuoteData) => {
    setConfig(newConfig);
  };

  return (
    <main className="w-full min-h-screen bg-neutral-950 text-neutral-100 selection:bg-brand-DEFAULT selection:text-white overflow-x-hidden font-sans relative">
      
      {/* 
         BACKGROUND PERSISTENTE GLOBAL 
         Fica atrás de todas as views (z-0).
      */}
      <BackgroundFilmStrips />

      {/* 
        SPLASH SCREEN (Abertura)
      */}
      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div 
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
          >
             <div className="flex flex-col items-center justify-center w-full h-full p-4">
               <motion.div
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ duration: 1.2, ease: "easeOut" }}
                 className="mb-8"
               >
                  <Logo className="w-64 md:w-96" animate={true} />
               </motion.div>

               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="flex flex-col items-center"
               >
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-brand-DEFAULT to-transparent mb-4 opacity-50" />
                  <p className="text-neutral-400 font-serif italic text-xl md:text-2xl tracking-widest">Orçamento Facilitado</p>
               </motion.div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        Loading Overlay
      */}
      <AnimatePresence>
        {isLoading && <Loading key="loader" />}
      </AnimatePresence>

      {/* RENDERIZAÇÃO CONDICIONAL DAS VIEWS */}
      {/* Wrapper relativo com z-10 para ficar acima do background */}
      <div className="relative z-10">
        {!showSplash && !isLoading && (
            <>
            {/* 1. View: Landing (Tela Inicial com Botão Continuar) */}
            {view === 'landing' && (
                <LandingView onNext={() => setView('intro')} />
            )}

            {/* 2. View: Intro (Escolha: Conhecer EAREC ou Orçamento) */}
            {view === 'intro' && (
                <IntroView onContinue={() => setView('welcome')} />
            )}

            {/* 3. View: Welcome (Formulário de Dados) */}
            {view === 'welcome' && (
                <WelcomeView 
                onStart={handleStart} 
                onAdminClick={() => setView('admin')} 
                />
            )}

            {/* 4. View: Quote (Configurador Principal) */}
            {view === 'quote' && clientData && (
                <QuoteView 
                clientData={clientData} 
                onUpdateClientData={setClientData}
                config={config} 
                />
            )}

            {/* 5. View: Admin (Painel Protegido) */}
            {view === 'admin' && (
                <AdminDashboard 
                currentConfig={config}
                onUpdateConfig={handleAdminUpdate}
                onExit={() => setView('welcome')}
                />
            )}
            </>
        )}
      </div>
    </main>
  );
};

export default App;
