import React, { useState, useEffect, useLayoutEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import QuoteView from './src/pages/QuoteView';
import WelcomeView from './src/pages/WelcomeView';
import IntroView from './src/pages/IntroView';
import ConfirmationView from './src/pages/ConfirmationView';
import AdminDashboard from './src/pages/AdminDashboard';
import Loading from './src/components/ui/Loading';
import Logo from './src/components/ui/Logo';
import BackgroundFilmStrips from './src/components/ui/BackgroundFilmStrips';
import { ClientData, QuoteData, QuoteState, ViewState } from './src/types';
import { mockQuote } from './src/data/mock';
import { delay } from './src/lib/utils';
import { AppConfig } from './src/config/AppConfig';

const App: React.FC = () => {
  // Splash inicia true
  const [showSplash, setShowSplash] = useState(true);
  
  // View inicia em 'confirmation', mas só aparece após o splash sair
  const [view, setView] = useState<ViewState>('confirmation');
  
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<QuoteData>(mockQuote);
  const [isQuoteSuccess, setIsQuoteSuccess] = useState(false);
  const [isQuickMode, setIsQuickMode] = useState(false);

  const [clientData, setClientData] = useState<ClientData | null>(() => {
    const saved = localStorage.getItem('earec_client_data');
    return saved ? JSON.parse(saved) : null;
  });

  const [quoteState, setQuoteState] = useState<QuoteState>({
    category: null, 
    serviceId: 'wedding_base',
    hours: 2,
    qty: 10,
    videoQty: 1, 
    addDrone: false,
    addRealTime: false,
    selectionMode: 'duration'
  });

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-color', AppConfig.BRAND.COLORS.PRIMARY);
    root.style.setProperty('--brand-glow', `${AppConfig.BRAND.COLORS.PRIMARY}80`);
  }, []);

  useEffect(() => {
    if (clientData) {
      localStorage.setItem('earec_client_data', JSON.stringify(clientData));
    }
  }, [clientData]);

  // Controle do Splash Screen
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    
    // Aumentado levemente para 2.5s para garantir leitura
    const timer = setTimeout(() => setShowSplash(false), 2500); 
    return () => clearTimeout(timer);
  }, []);

  const handleStart = async (data: ClientData) => {
    setClientData(data);
    setIsLoading(true);
    setIsQuoteSuccess(false);
    setQuoteState(prev => ({ ...prev, category: null }));
    await delay(2000); 
    setIsLoading(false);
    setView('quote');
    window.scrollTo(0, 0);
  };

  const handleQuickStart = async () => {
    setClientData({
        name: '', 
        location: '', 
        date: '', 
        contact: ''
    });
    setQuoteState(prev => ({ ...prev, category: null }));
    setIsQuickMode(true);
    setIsLoading(true);
    setIsQuoteSuccess(false);
    await delay(800);
    setIsLoading(false);
    setView('quote');
    window.scrollTo(0, 0);
  };

  const handleAdminUpdate = (newConfig: QuoteData) => {
    setConfig(newConfig);
  };

  const handleRequestForm = () => {
    setView('welcome');
    window.scrollTo(0, 0);
  };

  return (
    <main className="w-full min-h-screen bg-black text-neutral-100 selection:bg-brand-DEFAULT selection:text-white overflow-x-hidden font-sans relative">
      {(view !== 'quote' || isQuoteSuccess) && <BackgroundFilmStrips />}

      {/* SPLASH SCREEN (Prioridade Máxima Z-Index 100) */}
      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div 
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
          >
             <div className="flex flex-col items-center justify-center w-full h-full p-4">
               <motion.div
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ duration: 0.8, ease: "easeOut" }}
                 className="mb-4"
               >
                  <Logo className="w-64 md:w-96" animate={true} />
               </motion.div>

               <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="flex flex-col items-center"
               >
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-brand-DEFAULT to-transparent mb-4 opacity-50" />
                  <p className="text-neutral-500 font-sans font-medium text-sm md:text-base tracking-[0.4em] uppercase">
                    Orçamento Facilitado
                  </p>
               </motion.div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoading && <Loading key="loader" />}
      </AnimatePresence>

      <div className="relative z-10">
        {/* Renderiza o conteúdo apenas quando o Splash sai */}
        {!showSplash && !isLoading && (
            <>
            {/* 1. TELA DE CONFIRMAÇÃO */}
            {view === 'confirmation' && (
                <ConfirmationView 
                    onContinue={() => setView('intro')}
                />
            )}

            {/* 2. MENU PRINCIPAL (INTRO) */}
            {view === 'intro' && (
                <IntroView 
                    onContinue={() => {
                        setIsQuickMode(false);
                        setView('welcome');
                    }}
                    onQuickStart={handleQuickStart}
                />
            )}

            {/* 3. WIZARD (WELCOME) */}
            {view === 'welcome' && (
                <WelcomeView 
                  onStart={handleStart} 
                  onAdminClick={() => setView('admin')}
                  onBack={() => setView(isQuickMode ? 'quote' : 'intro')} 
                />
            )}

            {/* 4. CONFIGURADOR (QUOTE) */}
            {view === 'quote' && clientData && (
                <QuoteView 
                  clientData={clientData} 
                  onUpdateClientData={setClientData}
                  config={config}
                  onBack={() => setView(isQuickMode ? 'intro' : 'welcome')}
                  quoteState={quoteState}
                  setQuoteState={setQuoteState}
                  onSuccess={() => setIsQuoteSuccess(true)}
                  isQuickMode={isQuickMode}
                  onRequestForm={handleRequestForm}
                />
            )}

            {/* 5. ADMIN */}
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