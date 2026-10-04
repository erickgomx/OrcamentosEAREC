import React, { useState, useEffect, useLayoutEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const QuoteView = lazy(() => import('./pages/QuoteView'));
const WelcomeView = lazy(() => import('./pages/WelcomeView'));
const IntroView = lazy(() => import('./pages/IntroView'));
const ConfirmationView = lazy(() => import('./pages/ConfirmationView'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const PortfolioView = lazy(() => import('./pages/PortfolioView'));

import Loading from './components/ui/Loading';
import Logo from './components/ui/Logo';
import BackgroundFilmStrips from './components/ui/BackgroundFilmStrips';
import { ClientData, QuoteData, QuoteState } from './types';
import { mockQuote } from './data/mock';
import { delay, generateOrderCode } from './lib/utils';
import { AppConfig } from './config/AppConfig';
import { useRouter } from './hooks/useRouter';
import { pageSlideVariants } from './lib/animations';

const App: React.FC = () => {
  // Roteamento SPA nativo (suporta /inicio, /orcamento e /admin)
  const router = useRouter();

  // Splash Screen inteligente: exibe apenas na primeira abertura da sessão
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('earec_splash_shown');
    }
    return true;
  });

  // Sub-etapa interna da rota /orcamento ('quote' configurador ou 'welcome' formulário)
  const [quoteSubView, setQuoteSubView] = useState<'quote' | 'welcome'>('quote');
  
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<QuoteData>(() => ({
    ...mockQuote,
    id: generateOrderCode()
  }));
  const [isQuoteSuccess, setIsQuoteSuccess] = useState(false);
  const [isQuickMode, setIsQuickMode] = useState(false);

  const [clientData, setClientData] = useState<ClientData>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('earec_client_data') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {}
    return { name: '', location: '', date: '', contact: '' };
  });

  const [quoteState, setQuoteState] = useState<QuoteState>({
    category: null, 
    serviceId: 'wedding_base',
    hours: 2,
    qty: 8,
    videoQty: 0, 
    addDrone: false,
    droneQty: 0,
    addRealTime: false,
    selectionMode: 'duration',
    projectType: 'personal',
    videoDevice: 'mobile'
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
    
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        try {
          sessionStorage.setItem('earec_splash_shown', 'true');
        } catch {}
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  // Normalização de URL na barra de endereços (garante URLs limpas para todas as rotas)
  useEffect(() => {
    const p = router.currentPath;
    if (p === '/' || p === '/home') {
      router.navigate('/inicio', true);
    } else if (router.activeRoute === 'inicio' && p !== '/inicio') {
      router.navigate('/inicio', true);
    } else if (router.activeRoute === 'orcamento' && p !== '/orcamento') {
      router.navigate('/orcamento', true);
    } else if (router.activeRoute === 'resumo' && p !== '/resumo') {
      router.navigate('/resumo', true);
    } else if (router.activeRoute === 'sucesso' && p !== '/sucesso') {
      router.navigate('/sucesso', true);
    } else if (router.activeRoute === 'portfolio' && p !== '/portfolio') {
      router.navigate('/portfolio', true);
    } else if (router.activeRoute === 'admin' && p !== '/admin') {
      router.navigate('/admin', true);
    }
  }, [router.currentPath, router.activeRoute, router.navigate]);

  const handleStart = async (data: ClientData) => {
    setClientData(data);
    setConfig(prev => ({ ...prev, id: generateOrderCode() }));
    setIsLoading(true);
    setIsQuoteSuccess(false);
    setQuoteState(prev => ({ ...prev, category: null }));
    await delay(1000); 
    setIsLoading(false);
    setQuoteSubView('quote');
    window.scrollTo(0, 0);
  };

  const handleQuickStart = () => {
    if (!clientData.name) {
      setClientData({
        name: '', 
        location: '', 
        date: '', 
        contact: ''
      });
    }
    setConfig(prev => ({ ...prev, id: generateOrderCode() }));
    setQuoteState(prev => ({ ...prev, category: null }));
    setIsQuickMode(true);
    setIsQuoteSuccess(false);
    setQuoteSubView('quote');
    router.navigate('/orcamento');
    window.scrollTo(0, 0);
  };

  const handleAdminUpdate = (newConfig: QuoteData) => {
    setConfig(newConfig);
  };

  const handleRequestForm = () => {
    setQuoteSubView('welcome');
    window.scrollTo(0, 0);
  };

  const handleResetQuote = () => {
    setConfig(prev => ({ ...prev, id: generateOrderCode() }));
    setQuoteState({
      category: null, 
      serviceId: 'wedding_base',
      hours: 2,
      qty: 10,
      videoQty: 0, 
      addDrone: false,
      droneQty: 0,
      addRealTime: false,
      selectionMode: 'duration',
      projectType: 'personal',
      videoDevice: 'mobile'
    });
    setIsQuoteSuccess(false);
    setQuoteSubView('quote');
    router.navigate('/orcamento');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Garante dados de cliente válidos ao abrir /orcamento diretamente
  const activeClientData: ClientData = clientData || {
    name: '',
    location: '',
    date: '',
    contact: ''
  };

  // Direção fluida da transição entre rotas (1 avança, -1 retorna)
  const [routeDirection, setRouteDirection] = useState(1);
  const prevRouteRef = React.useRef(router.activeRoute);

  useEffect(() => {
    const prev = prevRouteRef.current;
    const curr = router.activeRoute;
    if (prev !== curr) {
      if (prev === 'inicio' && (curr === 'orcamento' || curr === 'portfolio' || curr === 'admin')) {
        setRouteDirection(1);
      } else if (prev === 'portfolio' && curr === 'orcamento') {
        setRouteDirection(1);
      } else if (curr === 'inicio') {
        setRouteDirection(-1);
      } else if (prev === 'orcamento' && curr === 'portfolio') {
        setRouteDirection(-1);
      } else if (curr === 'admin') {
        setRouteDirection(1);
      } else {
        setRouteDirection(1);
      }
      prevRouteRef.current = curr;
    }
  }, [router.activeRoute]);

  return (
    <main className="w-full min-h-screen bg-[#0a0a0a] text-neutral-100 selection:bg-brand-DEFAULT selection:text-white overflow-x-hidden font-sans relative">
      <BackgroundFilmStrips />

      {/* SPLASH SCREEN */}
      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div 
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a]"
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
        {!showSplash && !isLoading && (
          <Suspense fallback={<Loading text="Carregando..." />}>
            <AnimatePresence mode="wait" custom={routeDirection}>
              {/* 1. ROTA /INICIO */}
              {router.activeRoute === 'inicio' && (
                <motion.div
                  key="route-inicio"
                  custom={routeDirection}
                  variants={pageSlideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full"
                >
                  <IntroView 
                    onContinue={() => {
                      setIsQuickMode(false);
                      router.navigate('/orcamento');
                    }}
                    onQuickStart={handleQuickStart}
                    onOpenPortfolio={() => router.navigate('/portfolio')}
                  />
                </motion.div>
              )}

              {/* 2. ROTA /ORCAMENTO, /RESUMO, /SUCESSO */}
              {(router.activeRoute === 'orcamento' || router.activeRoute === 'resumo' || router.activeRoute === 'sucesso') && (
                <motion.div
                  key="route-orcamento"
                  custom={routeDirection}
                  variants={pageSlideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full"
                >
                  {quoteSubView === 'welcome' ? (
                    <WelcomeView 
                      onStart={handleStart} 
                      onAdminClick={() => router.navigate('/admin')}
                      onBack={() => setQuoteSubView('quote')} 
                    />
                  ) : (
                    <QuoteView 
                      clientData={activeClientData} 
                      onUpdateClientData={setClientData}
                      config={config}
                      onBack={() => router.navigate('/inicio')}
                      onNavigateHome={() => router.navigate('/inicio')}
                      quoteState={quoteState}
                      setQuoteState={setQuoteState}
                      onSuccess={() => setIsQuoteSuccess(true)}
                      isQuickMode={isQuickMode}
                      onRequestForm={handleRequestForm}
                      onResetQuote={handleResetQuote}
                    />
                  )}
                </motion.div>
              )}

              {/* 3. ROTA /PORTFOLIO */}
              {router.activeRoute === 'portfolio' && (
                <motion.div
                  key="route-portfolio"
                  custom={routeDirection}
                  variants={pageSlideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full"
                >
                  <PortfolioView 
                    onNavigateHome={() => router.navigate('/inicio')}
                    onStartQuote={() => router.navigate('/orcamento')}
                  />
                </motion.div>
              )}

              {/* 4. ROTA /ADMIN */}
              {router.activeRoute === 'admin' && (
                <motion.div
                  key="route-admin"
                  custom={routeDirection}
                  variants={pageSlideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full"
                >
                  <AdminDashboard 
                    currentConfig={config}
                    onUpdateConfig={handleAdminUpdate}
                    onExit={() => router.navigate('/orcamento')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Suspense>
        )}
      </div>
    </main>
  );
};

export default App;
