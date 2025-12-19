
import React, { useState, useMemo, useEffect } from 'react';
import UpsellList from '../components/quote/UpsellList';
import StickyFooter from '../components/quote/StickyFooter';
import SignatureModal from '../components/quote/SignatureModal';
import LocationMapModal from '../components/ui/LocationMapModal';
import SummaryView from './SummaryView';
import SuccessView from './SuccessView';
import { formatCurrency } from '../lib/utils';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ClientData, QuoteData, ServiceCategory, ServiceId, QuoteState, PricingContext } from '../types';
import { ArrowLeft } from 'lucide-react';
import Logo from '../components/ui/Logo';

// === POO INTEGRATION ===
import { PricingEngine } from '../core/PricingEngine';
import { AppConfig } from '../config/AppConfig';
import { LocationService } from '../services/LocationService';

interface QuoteViewProps {
  clientData: ClientData; 
  onUpdateClientData: (data: ClientData) => void; 
  config: QuoteData;      
  onBack: () => void;
  quoteState: QuoteState;
  setQuoteState: React.Dispatch<React.SetStateAction<QuoteState>>;
  onSuccess: () => void;
  isQuickMode?: boolean;
  onRequestForm?: () => void; // Callback para pedir o formulário completo
}

type ViewState = 'config' | 'summary' | 'success';

// Variantes de Animação para o Wizard (Slide Lateral)
const stepVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
    filter: 'blur(10px)',
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    filter: 'blur(10px)',
    transition: {
        duration: 0.4,
        ease: "easeIn"
    }
  })
};

const QuoteView: React.FC<QuoteViewProps> = ({ 
    clientData, onUpdateClientData, config, onBack, 
    quoteState, setQuoteState, onSuccess, isQuickMode = false, onRequestForm
}) => {
  const [viewState, setViewState] = useState<ViewState>('config');
  
  // === WIZARD STATE ===
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  // Definição das Etapas
  const steps = [
      { id: 'categories', title: 'Qual a ocasião?' },
      { id: 'services', title: 'Escolha o pacote ideal' },
      { id: 'config', title: 'Personalize os detalhes' }
  ];

  const currentStepId = steps[currentStep].id as 'categories' | 'services' | 'config';

  const quoteData: QuoteData = useMemo(() => ({
    ...config,
    client: { ...config.client, ...clientData, projectTitle: `Project: ${clientData.name}` }
  }), [clientData, config]);

  const [paymentMethod, setPaymentMethod] = useState<string>('Pix');
  const [distance, setDistance] = useState<number>(0); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false); 
  const [isApproved, setIsApproved] = useState(false);

  // Destructuring do State
  const { category, serviceId, hours, qty, addDrone, addRealTime, selectionMode } = quoteState;

  // Setters Helpers
  const setCategory = (c: ServiceCategory) => setQuoteState(prev => ({ ...prev, category: c }));
  const setServiceId = (s: ServiceId) => setQuoteState(prev => ({ ...prev, serviceId: s }));
  const setHours = (h: number) => setQuoteState(prev => ({ ...prev, hours: h }));
  const setQty = (q: number) => setQuoteState(prev => ({ ...prev, qty: q }));
  const setAddDrone = (b: boolean) => setQuoteState(prev => ({ ...prev, addDrone: b }));
  const setAddRealTime = (b: boolean) => setQuoteState(prev => ({ ...prev, addRealTime: b }));
  const setSelectionMode = (mode: 'duration' | 'quantity') => setQuoteState(prev => ({ ...prev, selectionMode: mode }));

  // --- LOGIC: LOCATION SERVICE ---
  // CORREÇÃO: Removemos a condicional !isQuickMode. Se tiver local, calcula.
  useEffect(() => {
    let isMounted = true;
    const updateDistance = async () => {
        if (clientData.location && clientData.location.length > 3) {
            const dist = await LocationService.calculateDistance(clientData.location);
            if (isMounted) setDistance(dist);
        } else {
            if (isMounted) setDistance(0);
        }
    };
    
    updateDistance();
    
    return () => { isMounted = false; };
  }, [clientData.location]);

  const handleUpdateLocation = (address: string) => {
      onUpdateClientData({ ...clientData, location: address });
  };

  // --- LOGIC: SELECTION DEFAULTS ---
  useEffect(() => {
    if (category === 'wedding') setSelectionMode('duration');
    if (category === 'commercial') setSelectionMode('quantity');
    if (category === 'studio' && serviceId === 'studio_photo') setSelectionMode('quantity');
    if (category === 'studio' && serviceId === 'studio_video') setSelectionMode('duration');
    if (category === 'social' && serviceId === 'graduation') setSelectionMode('duration');
  }, [category, serviceId]);

  // --- LOGIC: PRICING ENGINE ---
  const { totalPrice, priceBreakdown } = useMemo(() => {
    const context: PricingContext = {
        pricePerKm: config.pricePerKm,
        photoUnitPrice: config.photoUnitPrice,
        videoUnitPrice: config.videoUnitPrice,
        distance: distance,
        isQuickMode: isQuickMode // Flag passada para o motor
    };
    const result = PricingEngine.calculate(quoteState, context);
    return { totalPrice: result.totalPrice, priceBreakdown: result.breakdown };
  }, [quoteState, config, distance, isQuickMode]);

  // --- LOGIC: RESET WHEN CHANGING CATEGORY ---
  useEffect(() => {
      const table = AppConfig.PRICING_TABLE;
      const currentCategoryGroup = table[category as keyof typeof table];
      const isIdValid = currentCategoryGroup && Object.keys(currentCategoryGroup).some(key => key === serviceId);
      
      if (!isIdValid) {
        if (category === 'wedding') setServiceId('wedding_base');
        if (category === 'social') setServiceId('birthday');
        if (category === 'commercial') setServiceId('comm_photo');
        if (category === 'studio') setServiceId('studio_photo');
        if (category === 'video_production') setServiceId('edit_only');
        if (category === 'custom') setServiceId('custom_project');
        
        setHours(2);
        if (category === 'commercial') {
            if (serviceId === 'comm_photo') setQty(20);
            else if (serviceId === 'comm_video') setQty(1);
        } else if (category === 'studio' && serviceId === 'studio_photo') {
            setQty(8);
        } else if (category === 'video_production') {
            setQty(1);
        } else {
            setQty(10);
        }
      }
  }, [category]);

  const handleSignatureSuccess = (signatureData: string) => {
    setIsModalOpen(false);
    setIsApproved(true);
    onSuccess();
    setViewState('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => { window.location.reload(); };

  const handleRemoveAddon = (addonName: string) => {
      const name = addonName.toLowerCase();
      if (name.includes('drone')) setAddDrone(false);
      if (name.includes('tempo real')) setAddRealTime(false);
      if (name.includes('horas extras')) setHours(2); 
  };

  // --- WIZARD NAVIGATION HANDLERS ---
  const handleNextStep = () => {
      if (currentStep < steps.length - 1) {
          setDirection(1);
          setCurrentStep(prev => prev + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
          // Final Step - Lógica de Modo Rápido vs Normal
          
          if (category === 'custom') {
              // SE FOR "OUTROS" (CUSTOM), PULA O RESUMO E VAI DIRETO PARA O FINAL
              onSuccess(); // Notifica App.tsx para esconder background se necessário
              setViewState('success');
              window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
              // Fluxo normal: vai para Resumo
              setViewState('summary');
          }
      }
  };

  const handlePrevStep = () => {
      if (currentStep > 0) {
          setDirection(-1);
          setCurrentStep(prev => prev - 1);
      } else {
          onBack();
      }
  };

  // Label Resolution
  const serviceLabel = AppConfig.getServiceLabel(category, serviceId);
  let metricLabel = '';
  if (selectionMode === 'duration') {
       metricLabel = `${hours}h de Cobertura`;
  } else {
       metricLabel = `${qty} Unidades`;
  }
  if (category === 'wedding' && selectionMode === 'duration' && hours === 2) metricLabel = "Pacote Completo";
  if (category === 'custom') metricLabel = 'Sob medida';

  const activeAddons = [];
  if (addDrone && (category === 'wedding' || category === 'social' || category === 'commercial')) activeAddons.push('Drone (Aéreo)');
  if (addRealTime) activeAddons.push('Fotos em Tempo Real');

  const summaryDetails = {
    serviceName: serviceLabel,
    categoryLabel: category === 'wedding' ? 'Casamento' : category === 'social' ? 'Social' : category === 'commercial' ? 'Comercial' : category === 'studio' ? 'Estúdio' : 'Produção',
    metricLabel,
    addons: activeAddons
  };

  const quoteDetails = {
    occasion: category === 'custom' ? 'custom' : (category as any),
    customOccasionText: serviceLabel,
    location: (category === 'studio' ? 'studio' : 'external'),
    photoQty: selectionMode === 'quantity' ? qty : (category === 'commercial' && serviceId === 'comm_photo' ? qty : 0),
    videoQty: (category === 'video_production' && serviceId === 'edit_only') ? qty : 
              ((category === 'commercial' && (serviceId === 'comm_video' || serviceId === 'comm_combo'))) ? qty : 0,
    distance,
    paymentMethod 
  };

  if (viewState === 'success') {
      return (
        <SuccessView 
            onReset={handleReset} 
            clientData={clientData}
            totalPrice={totalPrice}
            quoteDetails={quoteDetails as any}
        />
      );
  }

  return (
    <div className="relative min-h-screen bg-black/80 flex flex-col">
      
      {/* Background sutil para dar profundidade */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black -z-10" />

      {/* HEADER: PROGRESS & NAV */}
      <div className="pt-8 px-6 pb-4 w-full max-w-5xl mx-auto flex flex-col items-center relative z-20">
          <div className="w-full flex justify-between items-center mb-6">
               <button onClick={handlePrevStep} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors">
                   <ArrowLeft size={20} />
               </button>
               {/* LOGO AUMENTADA E ANIMATION FIX */}
               <Logo className="w-56 opacity-80" />
               <div className="w-10" /> {/* Spacer para centralizar logo */}
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full max-w-xs mb-2">
            {steps.map((_, idx) => (
                <div key={idx} className="h-1 flex-1 rounded-full overflow-hidden bg-white/10">
                    <motion.div 
                        className="h-full bg-brand-DEFAULT"
                        initial={{ width: "0%" }}
                        animate={{ width: idx <= currentStep ? "100%" : "0%" }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            ))}
          </div>
          <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">
                Passo {currentStep + 1}: {steps[currentStep].title}
          </p>
      </div>

      {/* MAIN CONTENT: WIZARD STEP */}
      <div className="flex-1 w-full max-w-5xl mx-auto relative px-4 pb-32 flex flex-col justify-center">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            {viewState === 'config' && (
                <motion.div 
                    key={currentStep}
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="w-full flex justify-center"
                >
                   <UpsellList 
                      viewMode={currentStepId} // Controla o que é renderizado
                      category={category} setCategory={setCategory}
                      serviceId={serviceId} setServiceId={setServiceId}
                      hours={hours} setHours={setHours}
                      qty={qty} setQty={setQty}
                      addDrone={addDrone} setAddDrone={setAddDrone}
                      addRealTime={addRealTime} setAddRealTime={setAddRealTime}
                      distance={distance}
                      pricePerKm={quoteData.pricePerKm}
                      locationClient={clientData.location}
                      onOpenMap={() => setIsMapOpen(true)}
                      selectionMode={selectionMode}
                      setSelectionMode={setSelectionMode}
                      isQuickMode={isQuickMode} // Passando prop para visualização
                    />
                </motion.div>
            )}
          </AnimatePresence>
      </div>

      {/* FOOTER NAVIGATION */}
      {viewState === 'config' && (
        <StickyFooter 
            totalPrice={totalPrice} 
            onApprove={handleNextStep} 
            isApproved={false}
            highlight={true}
            // Oculta o preço se estiver na etapa de categorias (indice 0)
            showPrice={currentStep !== 0} 
        />
      )}

      {/* SUMMARY MODAL/VIEW */}
      <AnimatePresence>
         {viewState === 'summary' && (
            <SummaryView 
                clientData={clientData}
                onUpdateClientData={onUpdateClientData}
                quoteData={quoteData}
                totalPrice={totalPrice}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                summaryDetails={summaryDetails}
                priceBreakdown={priceBreakdown}
                onBack={() => setViewState('config')}
                onProceedToSign={() => setIsModalOpen(true)}
                onRemoveAddon={handleRemoveAddon}
            />
         )}
      </AnimatePresence>
      
      <SignatureModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSignatureSuccess}
        totalValue={formatCurrency(totalPrice)}
      />

      <LocationMapModal 
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelectLocation={handleUpdateLocation}
        initialAddress={clientData.location}
      />
    </div>
  );
};

export default QuoteView;
