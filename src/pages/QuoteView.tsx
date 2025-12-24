
import React, { useState, useMemo, useEffect, useRef } from 'react';
import UpsellList from '../components/quote/UpsellList';
import StickyFooter from '../components/quote/StickyFooter';
import SignatureModal from '../components/quote/SignatureModal';
import LocationMapModal from '../components/ui/LocationMapModal';
import SummaryView from './SummaryView';
import SuccessView from './SuccessView';
import { formatCurrency, cn } from '../lib/utils';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ClientData, QuoteData, ServiceCategory, ServiceId, QuoteState, PricingContext } from '../types';
import { ArrowLeft, Tag, User, Check, AlertCircle, ChevronDown, CheckCircle, X } from 'lucide-react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';

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

  // Estado para o Menu Cascata (Dropdown de Categorias)
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

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

  // Estado para Captura de Nome no Modo Rápido e Ações Pendentes
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [tempName, setTempName] = useState('');
  const [pendingAction, setPendingAction] = useState<'next_step' | 'custom_project' | 'commercial_custom' | null>(null);

  // Destructuring do State
  const { category, serviceId, hours, qty, addDrone, addRealTime, selectionMode } = quoteState;

  // Mapa de Labels para Exibição no Header
  const categoryLabels: Record<string, string> = {
    wedding: 'Casamento',
    social: 'Social',
    commercial: 'Comercial',
    studio: 'Estúdio',
    video_production: 'Produção',
    custom: 'Personalizado'
  };

  // Setters Helpers
  const setCategory = (c: ServiceCategory) => {
      setQuoteState(prev => ({ ...prev, category: c }));
      // UX: Scroll suave para o rodapé após seleção se for a primeira vez
      if (currentStep === 0) {
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 300);
      }
  };
  const setServiceId = (s: ServiceId) => setQuoteState(prev => ({ ...prev, serviceId: s }));
  const setHours = (h: number) => setQuoteState(prev => ({ ...prev, hours: h }));
  const setQty = (q: number) => setQuoteState(prev => ({ ...prev, qty: q }));
  const setAddDrone = (b: boolean) => setQuoteState(prev => ({ ...prev, addDrone: b }));
  const setAddRealTime = (b: boolean) => setQuoteState(prev => ({ ...prev, addRealTime: b }));
  const setSelectionMode = (mode: 'duration' | 'quantity') => setQuoteState(prev => ({ ...prev, selectionMode: mode }));

  // --- LOGIC: LOCATION SERVICE ---
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
        isQuickMode: isQuickMode 
    };
    const result = PricingEngine.calculate(quoteState, context);
    return { totalPrice: result.totalPrice, priceBreakdown: result.breakdown };
  }, [quoteState, config, distance, isQuickMode]);

  // --- LOGIC: RESET WHEN CHANGING CATEGORY ---
  useEffect(() => {
      if (!category) return;
      
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
        
        // RESETAR ADICIONAIS E CONFIGURAÇÕES PARA EVITAR SOMA DE OCASIÕES
        setHours(2);
        setAddDrone(false);
        setAddRealTime(false);
        
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

  // --- HELPER PARA WHATSAPP (Ações Especiais) ---
  const openWhatsappAction = (type: 'custom_project' | 'commercial_custom', nameOverride?: string) => {
    const clientName = nameOverride || clientData.name || "Cliente";
    let message = "";

    if (type === 'custom_project') {
        message = `🚀 *SOLICITAÇÃO DE PROJETO ESPECIAL*
Olá! Me chamo ${clientName}.

Gostaria de discutir um projeto exclusivo que não se encaixa nos pacotes padrão.

💡 *MINHA IDEIA*
(Descreva brevemente aqui)

*Podemos agendar uma conversa?*`;
    } else if (type === 'commercial_custom') {
        message = `💼 *CONSULTORIA COMERCIAL*
Olá, equipe EAREC! Me chamo ${clientName}.

Estou no configurador e gostaria de um orçamento personalizado para minha empresa/marca.

💡 *DETALHES DA DEMANDA*
• Objetivo: (Descreva aqui)
• Referência: Opção "Comercial Personalizado"

*Aguardo contato para alinharmos o projeto!*`;
    }

    window.open(`https://api.whatsapp.com/send?phone=${AppConfig.BRAND.WHATSAPP}&text=${encodeURIComponent(message)}`, '_blank');
  };

  // --- HANDLER PARA INTERCEPTAR CLIQUES DE CONTATO NO UPSELLLIST ---
  const handleContactRequest = (type: 'custom_project' | 'commercial_custom') => {
      // Se não tem nome, abre o modal e marca a ação pendente
      if (!clientData.name || clientData.name.trim() === '') {
          setPendingAction(type);
          setIsNameModalOpen(true);
      } else {
          // Se tem nome, abre direto
          openWhatsappAction(type);
      }
  };

  // --- WIZARD NAVIGATION HANDLERS ---
  const handleNextStep = () => {
      // Bloqueia avanço se nenhuma categoria foi selecionada
      if (currentStep === 0 && !category) return;

      if (currentStep < steps.length - 1) {
          setDirection(1);
          setCurrentStep(prev => prev + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
          // Final Step - Lógica de Modo Rápido vs Normal
          
          if (category === 'custom') {
              onSuccess(); 
              setViewState('success');
              window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
              // SE FOR MODO RÁPIDO E NOME ESTIVER VAZIO, OBRIGA CAPTURA
              if (isQuickMode && !clientData.name) {
                  setPendingAction('next_step');
                  setIsNameModalOpen(true);
                  return;
              }
              setViewState('summary');
          }
      }
  };

  // CONFIRMAÇÃO DO MODAL DE NOME
  const handleConfirmName = () => {
      if (tempName.trim().length < 2) return;
      
      // Atualiza o estado global do cliente
      onUpdateClientData({ ...clientData, name: tempName });
      setIsNameModalOpen(false);

      // Verifica se havia uma ação pendente
      if (pendingAction === 'next_step') {
          setViewState('summary');
      } else if (pendingAction === 'custom_project') {
          openWhatsappAction('custom_project', tempName);
      } else if (pendingAction === 'commercial_custom') {
          openWhatsappAction('commercial_custom', tempName);
      }
      
      // Limpa ação pendente
      setPendingAction(null);
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
  const serviceLabel = category ? AppConfig.getServiceLabel(category, serviceId) : '';
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
    categoryLabel: category ? (categoryLabels[category] || '') : '',
    metricLabel,
    addons: activeAddons
  };

  // Lógica para determinar se é Foto ou Vídeo na contagem de quantidade
  const isPhotoService = 
      (category === 'social' && selectionMode === 'quantity') ||
      (category === 'studio' && serviceId === 'studio_photo') ||
      (category === 'commercial' && serviceId === 'comm_photo');

  const isVideoService = 
      (category === 'commercial' && (serviceId === 'comm_video' || serviceId === 'comm_combo')) ||
      (category === 'video_production' && serviceId === 'edit_only');

  const quoteDetails = {
    occasion: category === 'custom' ? 'custom' : (category as any),
    customOccasionText: serviceLabel,
    location: (category === 'studio' ? 'studio' : 'external'),
    photoQty: isPhotoService ? qty : 0,
    videoQty: isVideoService ? qty : 0,
    distance,
    paymentMethod,
    addons: activeAddons 
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

  // Validação do Botão Continuar
  const isNextDisabled = currentStep === 0 && !category;

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
               <Logo className="w-56 opacity-80" />
               <div className="w-10" /> 
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
          
          {/* Badge de Categoria Interativo (Menu Trigger) */}
          <AnimatePresence>
            {currentStep > 0 && category && (
                 <motion.button
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                    onClick={() => setIsCategoryMenuOpen(true)}
                    className="mt-5 flex items-center gap-3 px-5 py-2 rounded-full bg-neutral-900/80 backdrop-blur-md border border-white/10 shadow-xl shadow-black/40 hover:border-brand-DEFAULT/30 transition-all duration-500 group relative overflow-hidden"
                 >
                    {/* Indicador Pulsante */}
                    <div className="relative flex items-center justify-center w-2 h-2">
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-DEFAULT shadow-[0_0_8px_var(--brand-glow)]"></span>
                    </div>
                    
                    <div className="h-3 w-px bg-white/10 group-hover:bg-white/20 transition-colors" />

                    <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-medium group-hover:text-white transition-colors">
                        {categoryLabels[category]}
                    </span>

                    <ChevronDown size={14} className="text-neutral-500 group-hover:text-white transition-colors ml-1" />
                 </motion.button>
            )}
          </AnimatePresence>

          <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest mt-2 opacity-60">
                {steps[currentStep].title}
          </p>
      </div>

      {/* MAIN CONTENT: WIZARD STEP */}
      {/* REFINAMENTO: px-4 -> px-8 para afastar conteúdo da borda */}
      <div className="flex-1 w-full max-w-5xl mx-auto relative px-8 pb-48 flex flex-col justify-center">
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
                      viewMode={currentStepId} 
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
                      isQuickMode={isQuickMode} 
                      onContactRequest={handleContactRequest}
                    />
                </motion.div>
            )}
          </AnimatePresence>
      </div>

      {/* FOOTER NAVIGATION */}
      {viewState === 'config' && (
        <div className="opacity-100 transition-all duration-300">
            <StickyFooter 
                totalPrice={totalPrice} 
                onApprove={handleNextStep} 
                isApproved={false}
                highlight={true}
                showPrice={currentStep !== 0} 
                disabled={isNextDisabled}
            />
        </div>
      )}

      {/* MENU CASCATA (DROPDOWN MODAL) */}
      <AnimatePresence>
          {isCategoryMenuOpen && (
              <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
                  {/* Backdrop Blur Intenso */}
                  <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-lg"
                      onClick={() => setIsCategoryMenuOpen(false)}
                  />

                  <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      className="relative bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-xs overflow-hidden shadow-2xl"
                  >
                      <div className="p-4 bg-white/5 border-b border-white/5 text-center">
                          <h3 className="text-white font-serif text-lg">Trocar Ocasião</h3>
                          <p className="text-neutral-500 text-[10px] uppercase tracking-wider">Selecione uma nova categoria</p>
                      </div>
                      
                      <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto">
                          {Object.entries(categoryLabels).map(([key, label], index) => {
                              const isActive = category === key;
                              return (
                                  <motion.button
                                      key={key}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.05 }}
                                      onClick={() => {
                                          setCategory(key as ServiceCategory);
                                          setIsCategoryMenuOpen(false);
                                      }}
                                      className={cn(
                                          "w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all",
                                          isActive 
                                              ? "bg-brand-DEFAULT text-white shadow-lg shadow-brand-DEFAULT/20" 
                                              : "text-neutral-400 hover:bg-white/5 hover:text-white"
                                      )}
                                  >
                                      <span className="text-sm font-medium tracking-wide uppercase">{label}</span>
                                      {isActive && <CheckCircle size={16} />}
                                  </motion.button>
                              )
                          })}
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>

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

      {/* NAME CAPTURE MODAL (Quick Mode & Contact Requests) */}
      <AnimatePresence>
        {isNameModalOpen && (
             <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm"
                    onClick={() => setIsNameModalOpen(false)}
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-neutral-900 border border-white/10 p-8 rounded-2xl w-full max-w-sm shadow-2xl"
                >
                     <button 
                        onClick={() => setIsNameModalOpen(false)}
                        className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
                     >
                        <X size={20} />
                     </button>

                    <div className="mb-6 flex justify-center">
                        <div className="p-3 bg-brand-DEFAULT/10 rounded-full text-brand-DEFAULT">
                            <User size={32} />
                        </div>
                    </div>
                    <h3 className="text-xl text-white font-serif text-center mb-2">Identifique-se</h3>
                    <p className="text-neutral-400 text-center text-sm mb-6">
                        Para prosseguir com o atendimento personalizado, precisamos saber como podemos te chamar.
                    </p>
                    
                    <div className="space-y-4">
                        <input 
                            type="text"
                            placeholder="Seu nome ou empresa..."
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            autoFocus
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-DEFAULT outline-none transition-colors"
                            onKeyDown={(e) => e.key === 'Enter' && handleConfirmName()}
                        />
                        <Button 
                            className="w-full"
                            onClick={handleConfirmName}
                            disabled={tempName.trim().length < 2}
                        >
                            Continuar
                        </Button>
                    </div>
                </motion.div>
             </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default QuoteView;
