
import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ArrowLeft, ChevronsUpDown, CheckCircle, X, User } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { ClientData, QuoteData, QuoteState, ServiceCategory } from '../types';

// Components
import UpsellList from '../components/quote/UpsellList';
import StickyFooter from '../components/quote/StickyFooter';
import SignatureModal from '../components/quote/SignatureModal';
import LocationMapModal from '../components/ui/LocationMapModal';
import SummaryView from './SummaryView';
import SuccessView from './SuccessView';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';

// Logic Hook
import { useQuoteLogic } from '../hooks/useQuoteLogic';

interface QuoteViewProps {
  clientData: ClientData; 
  onUpdateClientData: (data: ClientData) => void; 
  config: QuoteData;      
  onBack: () => void;
  quoteState: QuoteState;
  setQuoteState: React.Dispatch<React.SetStateAction<QuoteState>>;
  onSuccess: () => void;
  isQuickMode?: boolean;
  onRequestForm?: () => void; 
}

const stepVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    transition: {
        duration: 0.3,
        ease: "easeIn"
    }
  })
};

const QuoteView: React.FC<QuoteViewProps> = (props) => {
  // Encapsulated Logic
  const logic = useQuoteLogic(props);
  const { state, actions, computed } = logic;
  const { quoteState, clientData } = props;

  // View Routing
  if (state.viewState === 'success') {
      return (
        <SuccessView 
            onReset={() => window.location.reload()} 
            clientData={props.clientData}
            totalPrice={state.totalPrice}
            quoteDetails={{
                occasion: quoteState.category as any,
                customOccasionText: computed.serviceLabel,
                location: quoteState.category === 'studio' ? 'studio' : 'external',
                distance: state.distance,
                paymentMethod: state.paymentMethod,
                addons: computed.activeAddons,
                serviceId: quoteState.serviceId,
                selectionMode: quoteState.selectionMode,
                hours: quoteState.hours,
                photoQty: quoteState.qty,
                videoQty: quoteState.videoQty,
                commercialMode: state.commercialMode // Passando o modo comercial
            }}
        />
      );
  }

  return (
    <div className="relative min-h-screen bg-black/80 flex flex-col">
      
      {/* Background sutil */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black -z-10" />

      {/* HEADER: PROGRESS & NAV */}
      <div className="pt-8 px-6 pb-4 w-full max-w-5xl mx-auto flex flex-col items-center relative z-20">
          <div className="w-full flex justify-between items-center mb-6">
               <button onClick={actions.handlePrevStep} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors">
                   <ArrowLeft size={20} />
               </button>
               <Logo className="w-56 opacity-80" />
               <div className="w-10" /> 
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full max-w-xs mb-2">
            {state.steps.map((_, idx) => (
                <div key={idx} className="h-1 flex-1 rounded-full overflow-hidden bg-white/10">
                    <motion.div 
                        className="h-full bg-brand-DEFAULT"
                        initial={{ width: "0%" }}
                        animate={{ width: idx <= state.currentStep ? "100%" : "0%" }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            ))}
          </div>
          
          {/* Badge de Categoria Interativo */}
          <AnimatePresence>
            {state.currentStep > 0 && quoteState.category && (
                 <motion.button
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => actions.setIsCategoryMenuOpen(true)}
                    className="mt-5 flex items-center gap-3 px-5 py-2 rounded-full bg-neutral-900/80 backdrop-blur-md border border-white/10 shadow-xl shadow-black/40 hover:border-brand-DEFAULT/30 transition-all duration-500 group relative overflow-hidden"
                 >
                    <div className="relative flex items-center justify-center w-3 h-3">
                        <motion.div 
                            className="w-2 h-2 rounded-full bg-[#DC2626] shadow-[0_0_10px_rgba(220,38,38,0.9)]"
                            animate={{ opacity: [1, 0.6, 1] }}
                            transition={{ 
                                duration: 3, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                            }}
                        />
                    </div>
                    <div className="h-3 w-px bg-white/10 group-hover:bg-white/20 transition-colors" />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-medium group-hover:text-white transition-colors">
                        {state.categoryLabels[quoteState.category]}
                    </span>
                    <ChevronsUpDown size={14} className="text-neutral-500 group-hover:text-white transition-colors ml-1" />
                 </motion.button>
            )}
          </AnimatePresence>

          <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest mt-2 opacity-60">
                {state.steps[state.currentStep].title}
          </p>
      </div>

      {/* MAIN CONTENT: WIZARD STEP */}
      <div className="flex-1 w-full max-w-5xl mx-auto relative px-8 pb-48 flex flex-col justify-center">
          <AnimatePresence initial={false} custom={state.direction} mode="wait">
            {state.viewState === 'config' && (
                <motion.div 
                    key={state.currentStep}
                    custom={state.direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="w-full flex justify-center"
                >
                   <UpsellList 
                      viewMode={state.currentStepId} 
                      category={quoteState.category} 
                      setCategory={actions.setCategory}
                      serviceId={quoteState.serviceId} 
                      setServiceId={actions.setServiceId}
                      hours={quoteState.hours} 
                      setHours={actions.setHours}
                      qty={quoteState.qty} 
                      setQty={actions.setQty}
                      videoQty={quoteState.videoQty} 
                      setVideoQty={actions.setVideoQty}
                      addDrone={quoteState.addDrone} 
                      setAddDrone={actions.setAddDrone}
                      addRealTime={quoteState.addRealTime} 
                      setAddRealTime={actions.setAddRealTime}
                      distance={state.distance}
                      pricePerKm={state.quoteData.pricePerKm}
                      locationClient={props.clientData.location}
                      onOpenMap={() => actions.setIsMapOpen(true)}
                      selectionMode={quoteState.selectionMode}
                      setSelectionMode={actions.setSelectionMode}
                      isQuickMode={props.isQuickMode} 
                      onContactRequest={actions.handleContactRequest}
                      commercialMode={state.commercialMode}
                      setCommercialMode={actions.setCommercialMode}
                    />
                </motion.div>
            )}
          </AnimatePresence>
      </div>

      {/* FOOTER NAVIGATION */}
      {state.viewState === 'config' && (
        <div className="opacity-100 transition-all duration-300">
            <StickyFooter 
                totalPrice={state.totalPrice} 
                onApprove={actions.handleNextStep} 
                isApproved={false}
                highlight={true}
                showPrice={state.currentStep !== 0} 
                disabled={computed.isNextDisabled}
                customLabel={computed.footerLabel} 
            />
        </div>
      )}

      {/* MENU CASCATA (DROPDOWN MODAL) */}
      <AnimatePresence>
          {state.isCategoryMenuOpen && (
              <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
                  <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-lg"
                      onClick={() => actions.setIsCategoryMenuOpen(false)}
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
                          {Object.entries(state.categoryLabels).map(([key, label], index) => {
                              const isActive = quoteState.category === key;
                              return (
                                  <motion.button
                                      key={key}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.05 }}
                                      onClick={() => {
                                          actions.setCategory(key as ServiceCategory);
                                          actions.setIsCategoryMenuOpen(false);
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
         {state.viewState === 'summary' && (
            <SummaryView 
                clientData={props.clientData}
                onUpdateClientData={props.onUpdateClientData}
                quoteData={state.quoteData}
                totalPrice={state.totalPrice}
                paymentMethod={state.paymentMethod}
                setPaymentMethod={actions.setPaymentMethod}
                summaryDetails={computed.summaryDetails}
                priceBreakdown={state.priceBreakdown}
                onBack={() => actions.setViewState('config')}
                onProceedToSign={() => actions.setIsModalOpen(true)}
                onRemoveAddon={actions.handleRemoveAddon}
            />
         )}
      </AnimatePresence>
      
      <SignatureModal 
        isOpen={state.isModalOpen}
        onClose={() => actions.setIsModalOpen(false)}
        onConfirm={actions.handleSignatureSuccess}
        totalValue={formatCurrency(state.totalPrice)}
      />

      <LocationMapModal 
        isOpen={state.isMapOpen}
        onClose={() => actions.setIsMapOpen(false)}
        onSelectLocation={actions.handleUpdateLocation}
        initialAddress={props.clientData.location}
      />

      {/* NAME CAPTURE MODAL */}
      <AnimatePresence>
        {state.isNameModalOpen && (
             <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm"
                    onClick={() => actions.setIsNameModalOpen(false)}
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-neutral-900 border border-white/10 p-8 rounded-2xl w-full max-w-sm shadow-2xl"
                >
                     <button 
                        onClick={() => actions.setIsNameModalOpen(false)}
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
                            value={state.tempName}
                            onChange={(e) => actions.setTempName(e.target.value)}
                            autoFocus
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-DEFAULT outline-none transition-colors"
                            onKeyDown={(e) => e.key === 'Enter' && actions.handleConfirmName()}
                        />
                        <Button 
                            className="w-full"
                            onClick={actions.handleConfirmName}
                            disabled={state.tempName.trim().length < 2}
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
