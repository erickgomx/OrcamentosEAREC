
import React, { useState, useMemo, useEffect } from 'react';
import Hero from '../components/quote/Hero';
import UpsellList from '../components/quote/UpsellList';
import StickyFooter from '../components/quote/StickyFooter';
import SignatureModal from '../components/quote/SignatureModal';
import LocationMapModal from '../components/ui/LocationMapModal';
import AddonUpsellModal from '../components/quote/AddonUpsellModal';
import SummaryView from './SummaryView';
import SuccessView from './SuccessView';
import { formatCurrency } from '../lib/utils';
import { calculateDistance } from '../lib/maps';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { ClientData, QuoteData, ServiceCategory, ServiceId, QuoteState } from '../types';
import { ChevronDown, ChevronsDown, ArrowLeft } from 'lucide-react';

interface QuoteViewProps {
  clientData: ClientData; 
  onUpdateClientData: (data: ClientData) => void; 
  config: QuoteData;      
  onBack: () => void;
  quoteState: QuoteState;
  setQuoteState: React.Dispatch<React.SetStateAction<QuoteState>>;
  onSuccess: () => void; 
}

type ViewState = 'config' | 'summary' | 'success';

const PRICING_TABLE = {
    wedding: {
        wedding_base: { base: 650, label: "Casamento (Base)" },
        wedding_classic: { base: 900, label: "Pacote Clássico" },
        wedding_romance: { base: 1150, label: "Pacote Romance" },
        wedding_essence: { base: 1750, label: "Pacote Essência" },
        realtime: { fixed: 600, label: "Fotos em Tempo Real" }
    },
    social: {
        birthday: { base: 400, hoursIncluded: 2, hourPrice: 250, label: "Chá Revelação / Aniversário" },
        fifteen: { base: 450, hoursIncluded: 2, hourPrice: 250, label: "15 Anos" }, 
        graduation: { base: 800, label: "Formatura" },
        realtime: { fixed: 600, label: "Fotos em Tempo Real" }
    },
    commercial: {
        photo: { unit: 20, label: "Comércio (Fotos)" },
        video: { unit: 500, label: "Comércio (Vídeo)" },
        combo: { videoBase: 800, label: "Comércio (Foto + Vídeo)" } // Sob consulta na UI, mas base definida internamente
    },
    studio: {
        photo: { unit: 25, label: "Estúdio (Fotos)" },
        video: { base: 350, hoursIncluded: 2, hourPrice: 250, label: "Estúdio (Vídeo)" },
    },
    video_production: {
        edit: { unit: 250, label: "Apenas Edição" },
        cam_cap: { fixed: 350, label: "Captação Câmera" },
        mobile_cap: { fixed: 250, label: "Captação Celular" },
        drone: { fixed: 250, label: "Drone (Imagens Aéreas)" }
    },
    custom: {
        custom_project: { base: 0, label: "Projeto Personalizado" } 
    }
};

const QuoteView: React.FC<QuoteViewProps> = ({ 
    clientData, onUpdateClientData, config, onBack, 
    quoteState, setQuoteState, onSuccess 
}) => {
  const [viewState, setViewState] = useState<ViewState>('config');
  const [showUpsell, setShowUpsell] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      if (latest > 0.9) setShowScrollIndicator(false);
      else setShowScrollIndicator(true);
    });
  }, [scrollYProgress]);
  
  const [showFooter, setShowFooter] = useState(true);

  const quoteData: QuoteData = useMemo(() => ({
    ...config,
    client: { ...config.client, ...clientData, projectTitle: `Project: ${clientData.name}` }
  }), [clientData, config]);

  const [paymentMethod, setPaymentMethod] = useState<string>('Pix');

  const [distance, setDistance] = useState<number>(0); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false); 
  const [isApproved, setIsApproved] = useState(false);

  const { category, serviceId, hours, qty, addDrone, addRealTime, selectionMode } = quoteState;

  const setCategory = (c: ServiceCategory) => setQuoteState(prev => ({ ...prev, category: c }));
  const setServiceId = (s: ServiceId) => setQuoteState(prev => ({ ...prev, serviceId: s }));
  const setHours = (h: number) => setQuoteState(prev => ({ ...prev, hours: h }));
  const setQty = (q: number) => setQuoteState(prev => ({ ...prev, qty: q }));
  const setAddDrone = (b: boolean) => setQuoteState(prev => ({ ...prev, addDrone: b }));
  const setAddRealTime = (b: boolean) => setQuoteState(prev => ({ ...prev, addRealTime: b }));
  const setSelectionMode = (mode: 'duration' | 'quantity') => setQuoteState(prev => ({ ...prev, selectionMode: mode }));

  useEffect(() => {
    let isMounted = true;
    const updateDistance = async () => {
        if (clientData.location) {
            const dist = await calculateDistance(clientData.location);
            if (isMounted) setDistance(dist);
        }
    };
    updateDistance();
    return () => { isMounted = false; };
  }, [clientData.location]);

  const handleUpdateLocation = (address: string) => {
      onUpdateClientData({ ...clientData, location: address });
  };

  useEffect(() => {
    if (category === 'wedding') setSelectionMode('duration');
    if (category === 'commercial') setSelectionMode('quantity');
    if (category === 'studio' && serviceId === 'studio_photo') setSelectionMode('quantity');
    if (category === 'studio' && serviceId === 'studio_video') setSelectionMode('duration');
    if (category === 'social' && serviceId === 'graduation') setSelectionMode('duration');
  }, [category, serviceId]);

  const { totalPrice, priceBreakdown } = useMemo(() => {
    let total = 0;
    let breakdown: { label: string; value: number; type: 'base' | 'addon' | 'freight' }[] = [];

    if (category === 'wedding') {
        const s = PRICING_TABLE.wedding;
        let baseVal = 0;
        let baseLabel = "";

        switch (serviceId) {
            case 'wedding_base': baseVal = s.wedding_base.base; baseLabel = s.wedding_base.label; break;
            case 'wedding_classic': baseVal = s.wedding_classic.base; baseLabel = s.wedding_classic.label; break;
            case 'wedding_romance': baseVal = s.wedding_romance.base; baseLabel = s.wedding_romance.label; break;
            case 'wedding_essence': baseVal = s.wedding_essence.base; baseLabel = s.wedding_essence.label; break;
        }
        total += baseVal;
        breakdown.push({ label: baseLabel, value: baseVal, type: 'base' });
        
        if (selectionMode === 'duration' && hours > 2) {
             const extraHoursVal = (hours - 2) * 250;
             total += extraHoursVal;
             breakdown.push({ label: `Horas Extras (+${hours - 2}h)`, value: extraHoursVal, type: 'addon' });
        }

        if (addRealTime) {
            total += s.realtime.fixed;
            breakdown.push({ label: s.realtime.label, value: s.realtime.fixed, type: 'addon' });
        }
    }
    else if (category === 'social') {
        const s = PRICING_TABLE.social;
        if (serviceId === 'birthday' || serviceId === 'fifteen') {
            const ref = serviceId === 'birthday' ? s.birthday : s.fifteen;
            
            if (selectionMode === 'duration') {
                total += ref.base;
                breakdown.push({ label: `${ref.label} (Base 2h)`, value: ref.base, type: 'base' });
                if (hours > ref.hoursIncluded) {
                    const extraHoursVal = (hours - ref.hoursIncluded) * ref.hourPrice;
                    total += extraHoursVal;
                    breakdown.push({ label: `Horas Extras (+${hours - ref.hoursIncluded}h)`, value: extraHoursVal, type: 'addon' });
                }
            } else {
                const val = qty * config.photoUnitPrice;
                total += val;
                breakdown.push({ label: `${ref.label} (${qty} Fotos)`, value: val, type: 'base' });
            }
        } else if (serviceId === 'graduation') {
             total += s.graduation.base;
             breakdown.push({ label: s.graduation.label, value: s.graduation.base, type: 'base' });
        }
        if (addRealTime) {
            total += s.realtime.fixed;
            breakdown.push({ label: s.realtime.label, value: s.realtime.fixed, type: 'addon' });
        }
    } 
    else if (category === 'commercial') {
        const s = PRICING_TABLE.commercial;
        
        if (serviceId === 'comm_photo') {
            const val = qty * s.photo.unit;
            total += val;
            breakdown.push({ label: `${s.photo.label} (${qty}x)`, value: val, type: 'base' });
        }
        if (serviceId === 'comm_video') {
            const val = qty * s.video.unit; // Inicia em 1 e acrescenta 500 por unidade
            total += val;
            breakdown.push({ label: `${s.video.label} (${qty}x)`, value: val, type: 'base' });
        }
        if (serviceId === 'comm_combo') {
            const val = s.combo.videoBase; // Fixo no combo
            total += val;
            breakdown.push({ label: s.combo.label, value: val, type: 'base' });
        }
    }
    else if (category === 'studio') {
        const s = PRICING_TABLE.studio;
        
        if (selectionMode === 'quantity') {
            if (serviceId === 'studio_photo') {
                const val = qty * s.photo.unit;
                total += val;
                breakdown.push({ label: `${s.photo.label} (${qty}x)`, value: val, type: 'base' });
            } else {
                 total += s.video.base;
                 breakdown.push({ label: s.video.label, value: s.video.base, type: 'base' });
            }
        } else {
            const baseHour = 350;
            total += baseHour;
            breakdown.push({ label: `Sessão Estúdio (2h)`, value: baseHour, type: 'base' });
            if (hours > 2) {
                const extraVal = (hours - 2) * 200;
                total += extraVal;
                breakdown.push({ label: `Horas Extras (+${hours - 2}h)`, value: extraVal, type: 'addon' });
            }
        }
    }
    else if (category === 'video_production') {
        const s = PRICING_TABLE.video_production;
        if (serviceId === 'edit_only') {
             const val = qty * s.edit.unit;
             total += val;
             breakdown.push({ label: `${s.edit.label} (${qty}x)`, value: val, type: 'base' });
        }
        if (serviceId === 'cam_cap') { total += s.cam_cap.fixed; breakdown.push({ label: s.cam_cap.label, value: s.cam_cap.fixed, type: 'base' }); }
        if (serviceId === 'mobile_cap') { total += s.mobile_cap.fixed; breakdown.push({ label: s.mobile_cap.label, value: s.mobile_cap.fixed, type: 'base' }); }
        if (serviceId === 'drone') { total += s.drone.fixed; breakdown.push({ label: s.drone.label, value: s.drone.fixed, type: 'base' }); }
    }
    else if (category === 'custom') {
        total += PRICING_TABLE.custom.custom_project.base;
        breakdown.push({ label: "Projeto Personalizado", value: 0, type: 'base' });
    }

    if (addDrone && (category === 'wedding' || category === 'social' || category === 'commercial')) { 
         const dronePrice = PRICING_TABLE.video_production.drone.fixed;
         total += dronePrice; 
         breakdown.push({ label: "Drone (Imagens Aéreas)", value: dronePrice, type: 'addon' });
    }

    const isExemptFromTravel = category === 'studio' || category === 'custom' || serviceId === 'edit_only';
    if (!isExemptFromTravel) {
        if (distance > 0) {
            const freight = (distance * 2 * quoteData.pricePerKm);
            total += freight;
            breakdown.push({ label: `Deslocamento (${distance}km)`, value: freight, type: 'freight' });
        } else {
             breakdown.push({ label: "Deslocamento", value: 0, type: 'freight' });
        }
    }
    return { totalPrice: total, priceBreakdown: breakdown };
  }, [category, serviceId, hours, qty, addDrone, addRealTime, distance, quoteData.pricePerKm, selectionMode, config.photoUnitPrice]);

  useEffect(() => {
      const currentCategoryGroup = Object.keys(PRICING_TABLE[category as keyof typeof PRICING_TABLE]);
      const isIdValid = currentCategoryGroup.some(key => key === serviceId);
      if (!isIdValid) {
        if (category === 'wedding') setServiceId('wedding_base');
        if (category === 'social') setServiceId('birthday');
        if (category === 'commercial') setServiceId('comm_photo');
        if (category === 'studio') setServiceId('studio_photo');
        if (category === 'video_production') setServiceId('edit_only');
        if (category === 'custom') setServiceId('custom_project');
        setHours(2);
        
        // Lógica de quantidade padrão
        if (category === 'commercial') {
            if (serviceId === 'comm_photo') setQty(5);
            else if (serviceId === 'comm_video') setQty(1);
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

  const handleStartApproval = () => {
    const canShowUpsell = (category === 'wedding' || category === 'social') && (!addDrone || !addRealTime);
    
    if (canShowUpsell) {
        setShowUpsell(true);
    } else {
        setViewState('summary');
    }
  };

  const handleConfirmUpsell = () => {
    setShowUpsell(false);
    setViewState('summary');
  };

  let label = 'Serviço Personalizado';
  if (category === 'wedding') label = PRICING_TABLE.wedding[serviceId as keyof typeof PRICING_TABLE.wedding]?.label || label;
  if (category === 'social') label = PRICING_TABLE.social[serviceId as keyof typeof PRICING_TABLE.social]?.label || label;
  if (category === 'commercial') {
      if (serviceId === 'comm_combo') label = PRICING_TABLE.commercial.combo.label;
      else label = PRICING_TABLE.commercial[serviceId as keyof typeof PRICING_TABLE.commercial]?.label || label;
  }
  if (category === 'studio') label = PRICING_TABLE.studio[serviceId as keyof typeof PRICING_TABLE.studio]?.label || label;
  if (category === 'video_production') label = PRICING_TABLE.video_production[serviceId as keyof typeof PRICING_TABLE.video_production]?.label || label;

  let metricLabel = '';
  if (selectionMode === 'duration') {
       metricLabel = `${hours}h de Cobertura (Ilimitado)`;
  } else {
       metricLabel = `${qty} Unidades Entregues`;
  }
  
  if (category === 'wedding' && selectionMode === 'duration' && hours === 2) metricLabel = "Pacote Completo";
  if (category === 'custom') metricLabel = 'Sob medida';

  const activeAddons = [];
  if (addDrone && (category === 'wedding' || category === 'social' || category === 'commercial')) activeAddons.push('Drone (Aéreo)');
  if (addRealTime) activeAddons.push('Fotos em Tempo Real');

  const summaryDetails = {
    serviceName: label,
    categoryLabel: category === 'wedding' ? 'Casamento' : category === 'social' ? 'Social' : category === 'commercial' ? 'Comercial' : category === 'studio' ? 'Estúdio' : 'Produção',
    metricLabel,
    addons: activeAddons
  };

  const quoteDetails = {
    occasion: category === 'custom' ? 'custom' : (category as any),
    customOccasionText: label,
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
    <div className="relative">
      <div className="block pb-40">
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-brand-DEFAULT z-50 origin-left shadow-[0_0_15px_#DC2626]"
            style={{ scaleX }}
          />
          
          <AnimatePresence>
              {viewState === 'config' && (
                  <motion.button 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onClick={onBack}
                    className="fixed top-6 left-6 z-[60] text-neutral-400 hover:text-white flex items-center gap-2 transition-colors text-sm uppercase tracking-wider bg-black/20 p-2 rounded-lg backdrop-blur-sm hover:bg-black/50 shadow-lg border border-white/5"
                    title="Voltar ao Cadastro"
                  >
                     <ArrowLeft size={18} /> Voltar
                  </motion.button>
              )}
          </AnimatePresence>

          <Hero data={quoteData} />
          
          <div className="relative z-10">
            <UpsellList 
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
            />
          </div>

          <AnimatePresence>
            {showScrollIndicator && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed bottom-36 md:bottom-36 left-1/2 -translate-x-1/2 z-50 pointer-events-none text-white drop-shadow-md"
              >
                 <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center"
                 >
                    <ChevronsDown size={28} className="animate-pulse" />
                 </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showFooter && (
                <StickyFooter 
                    totalPrice={totalPrice} 
                    onApprove={handleStartApproval} 
                    isApproved={isApproved}
                    highlight={true} 
                />
            )}
          </AnimatePresence>
      </div>

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

      <AddonUpsellModal 
        isOpen={showUpsell}
        onClose={() => setShowUpsell(false)}
        onConfirm={handleConfirmUpsell}
        addDrone={addDrone}
        setAddDrone={setAddDrone}
        addRealTime={addRealTime}
        setAddRealTime={setAddRealTime}
        totalPrice={totalPrice}
      />

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
