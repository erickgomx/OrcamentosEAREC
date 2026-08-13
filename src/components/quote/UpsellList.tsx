
import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Heart, Sparkles, Hand, Gem, MessageCircle, Gift, Users, GlassWater, PlaneTakeoff, GraduationCap, Building2, Camera, MapPin, Search, Clock, Zap, Video, Minus, Plus, ChevronRight, HelpCircle, Check, Play, Map as MapIcon, X, Battery, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AppConfig } from '../../config/AppConfig';
import AnimatedNumber from '../ui/AnimatedNumber';

import { fadeInUp, staggerContainer, modalVariants } from '../../lib/animations';
import { createPortal } from 'react-dom';

const infoModalVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 30, filter: 'blur(12px)' },
    visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        filter: 'blur(0px)',
        transition: { type: "spring", stiffness: 300, damping: 24, mass: 0.8 } 
    },
    exit: { 
        opacity: 0, 
        scale: 0.9, 
        y: 15, 
        filter: 'blur(8px)',
        transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } 
    }
};

interface UpsellListProps {
  category: string;
  setCategory: (c: any) => void;
  serviceId: string;
  handleServiceSelect: (serviceId: string, selectionMode?: 'duration' | 'quantity') => void;
  clientData: any;
  viewMode: 'categories' | 'services' | 'config';
  hours: number; setHours: (n: number) => void;
  qty: number; setQty: (n: number) => void;
  videoQty: number; setVideoQty: (n: number) => void;
  droneQty: number; setDroneQty: (n: number) => void;
  camCapHours?: number; setCamCapHours?: (n: number) => void;
  mobileCapHours?: number; setMobileCapHours?: (n: number) => void;
  editQty?: number; setEditQty?: (n: number) => void;
  addDrone: boolean; setAddDrone: (b: boolean) => void;
  addRealTime: boolean; setAddRealTime: (b: boolean) => void;
  distance: number; travelCost: number; isMapOpen: boolean; setIsMapOpen: (b: boolean) => void;
  selectionMode: 'duration' | 'quantity'; setSelectionMode: (m: 'duration' | 'quantity') => void;
  isQuickMode?: boolean; onContactRequest: () => void;
  commercialMode: 'on_location' | 'studio'; setCommercialMode: (m: 'on_location' | 'studio') => void;
}






const CategoryCard = ({ active, onClick, icon: Icon, label, desc, index }: any) => (
    <motion.div 
        custom={index}
        variants={{ hidden: { opacity: 0, y: 20 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } }) }}
        onClick={onClick}
        className={cn(
            "group relative flex flex-col items-center justify-center p-3 md:p-6 rounded-3xl border transition-all duration-500 cursor-pointer text-center h-full min-h-[160px] md:min-h-[220px] overflow-hidden",
            active 
                ? "bg-neutral-900 border-brand-DEFAULT shadow-[0_0_30px_rgba(220,38,38,0.15)] scale-[1.02]" 
                : "bg-neutral-950/50 border-white/5 hover:border-white/20 hover:bg-neutral-900/80"
        )}
    >
        <div className={cn(
            "absolute top-3 right-3 w-3 h-3 rounded-full transition-all duration-500",
            active ? "bg-brand-DEFAULT shadow-[0_0_15px_rgba(220,38,38,0.8)] border border-brand-DEFAULT/50" : "bg-white/10"
        )} />
        
        <div className={cn(
            "p-4 rounded-full mb-1 transition-all duration-300",
            active ? "bg-brand-DEFAULT/10 text-brand-DEFAULT shadow-[0_0_20px_rgba(220,38,38,0.2)]" : "bg-white/5 text-neutral-400 group-hover:bg-white/10 group-hover:text-white"
        )}>
            <Icon size={26} strokeWidth={1.5} />
        </div>
        <div className="space-y-1 text-center px-0 sm:px-1 w-full mt-2">
            <p className={cn(
                "text-[10px] sm:text-[11px] md:text-sm font-medium whitespace-normal leading-tight break-words transition-colors duration-300",
                active ? "text-white" : "text-neutral-400 group-hover:text-neutral-300"
            )}>
                {label}
            </p>
            <AnimatePresence mode="wait">
                {active && (
                    <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[9px] md:text-xs text-neutral-400 font-normal leading-tight"
                    >
                        {desc}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    </motion.div>
);

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

const UpsellList: React.FC<UpsellListProps> = (props) => {
  const {
    category, setCategory, serviceId, handleServiceSelect, clientData, viewMode,
    hours, setHours, qty, setQty, videoQty, setVideoQty, droneQty, setDroneQty, camCapHours, setCamCapHours, mobileCapHours, setMobileCapHours, editQty, setEditQty,
    addDrone, setAddDrone, addRealTime, setAddRealTime,
    distance, travelCost, isMapOpen, setIsMapOpen,
    selectionMode, setSelectionMode,
    isQuickMode = false,
    onContactRequest,
    commercialMode, setCommercialMode
  } = props;

  const [infoData, setInfoData] = useState<{ title: string; desc: string; price: string } | null>(null);

  const TABLE = AppConfig.PRICING_TABLE;

  const categories = [
    { id: 'video_production', label: 'Monte seu Pacote', desc: 'Projetos Especiais', icon: Video },
    { id: 'wedding', label: 'Casamento', desc: 'Cobertura Completa', icon: Heart },
    { id: 'social', label: 'Social', desc: 'Aniversários e Festas', icon: Users },
    { id: 'commercial', label: 'Comercial', desc: 'Marcas e Produtos', icon: Building2 },
    { id: 'studio', label: 'Estúdio', desc: 'Retratos e Ensaios', icon: Camera },
    { id: 'custom', label: 'Personalizado', desc: 'Outras Demandas', icon: MessageCircle }
  ];



  
  const isDroneQuantity = category === 'video_production' && serviceId === 'drone';
  const isVideoQuantity = serviceId === 'comm_video' || serviceId === 'edit_only';
  const minQty = (serviceId === 'comm_photo' ? 5 : (serviceId === 'comm_video' ? 1 : (serviceId === 'studio_photo' ? 8 : (category === 'video_production' ? 1 : 10))));
  const getIncrementPrice = (type: string) => {
    if (type === 'combo_photo') return 25;
    if (type === 'combo_video') return 350;
    if (type === 'qty') {
        if (serviceId === 'comm_photo' || serviceId === 'studio_photo') return 25;
        if (serviceId === 'comm_video') return 350;
        if (category === 'video_production' && serviceId === 'drone') return 250;
        if (category === 'video_production' && serviceId === 'edit_only') return 150;
    }
    if (type === 'hours') {
        if (category === 'wedding') return 300;
        if (category === 'social') return 250;
        if (category === 'commercial' && serviceId === 'comm_event') return 250;
        if (category === 'video_production') {
            if (serviceId === 'cam_cap') return 200;
            if (serviceId === 'mobile_cap') return 150;
        }
    }
    return 0;
  };
  const realTimePrice = AppConfig.PRICING_TABLE.wedding.realtime.fixed;

  const handleCustomProjectClick = () => {
    onContactRequest();
  };

  const isCustomBundle = false; // Removido para usar o grid padrão
  
  const showDuration = (selectionMode === 'duration') && !['custom_bundle'].includes(serviceId) && category !== 'video_production';
  const showQuantity = !['custom_bundle'].includes(serviceId) && (selectionMode === 'quantity' || ['commercial', 'studio'].includes(category)) && category !== 'video_production';
  const showDroneAddon = !['studio'].includes(category) && !['custom_bundle', 'edit_only', 'drone'].includes(serviceId);
  const isCombo = category === 'commercial' && serviceId === 'comm_combo';

  const gridClasses = cn(
    "grid grid-cols-2 md:grid-cols-2 gap-2 sm:gap-4 md:gap-6 w-full mx-auto items-stretch",
    "max-w-5xl"
  );

  return (
    <section className="w-full">


      {viewMode === 'categories' && (
        <motion.div
          key="categories-view"
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="space-y-8 w-full flex flex-col items-center max-w-4xl mx-auto pb-32"
        >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 md:gap-6 w-full">
                {categories.map((cat, i) => (
                    <CategoryCard 
                        key={cat.id}
                        {...cat}
                        active={category === cat.id}
                        onClick={() => setCategory(cat.id)}
                        index={i}
                    />
                ))}
            </div>
        </motion.div>
      )}
      {viewMode === 'services' && (
        <motion.div
          key="services-view"
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="space-y-8 w-full flex flex-col items-center pb-48"
        >
                
            {category === 'commercial' && commercialMode && (
                <motion.div variants={fadeInUp} className="flex flex-col items-center mb-10 w-full max-w-3xl mx-auto">
                    <p className="text-center text-xs uppercase tracking-widest text-brand-DEFAULT mb-3 font-bold">Onde será o serviço?</p>
                    <div className="flex w-full bg-neutral-900 p-1.5 md:p-2 rounded-2xl border border-white/10 shadow-lg">
                        <button onClick={() => setCommercialMode('on_location')} className={cn("flex-1 py-4 rounded-xl text-sm md:text-base font-bold transition-all flex items-center gap-2 md:gap-3 justify-center border", commercialMode === 'on_location' ? "bg-white text-black border-white shadow-lg scale-[1.02] z-10" : "bg-transparent border-transparent text-neutral-500 hover:text-white hover:bg-white/5")}>
                            <MapPin size={20} className={commercialMode === 'on_location' ? "text-brand-DEFAULT shrink-0" : "shrink-0"} />
                            NO COMÉRCIO
                        </button>
                        <button onClick={() => setCommercialMode('studio')} className={cn("flex-1 py-4 rounded-xl text-sm md:text-base font-bold transition-all flex items-center gap-2 md:gap-3 justify-center border", commercialMode === 'studio' ? "bg-white text-black border-white shadow-lg scale-[1.02] z-10" : "bg-transparent border-transparent text-neutral-500 hover:text-white hover:bg-white/5")}>
                            <Building2 size={20} className={commercialMode === 'studio' ? "text-brand-DEFAULT shrink-0" : "shrink-0"} />
                            NO ESTÚDIO
                        </button>
                    </div>
                </motion.div>
            )}

            {selectionMode && (category === 'social') && (
                <motion.div variants={fadeInUp} className="flex flex-col items-center mb-10 w-full max-w-3xl mx-auto">
                    <p className="text-center text-xs uppercase tracking-widest text-brand-DEFAULT mb-3 font-bold">Como deseja contratar?</p>
                    <div className="flex w-full bg-neutral-900 p-1.5 md:p-2 rounded-2xl border border-white/10 shadow-lg">
                        <button onClick={() => setSelectionMode('duration')} className={cn("flex-1 py-4 rounded-xl text-sm md:text-base font-bold transition-all flex items-center gap-2 md:gap-3 justify-center border", selectionMode === 'duration' ? "bg-white text-black border-white shadow-lg scale-[1.02] z-10" : "bg-transparent border-transparent text-neutral-500 hover:text-white hover:bg-white/5")}>
                            <Clock size={20} className={selectionMode === 'duration' ? "text-brand-DEFAULT shrink-0" : "shrink-0"} />
                            POR TEMPO
                        </button>
                        <button onClick={() => setSelectionMode('quantity')} className={cn("flex-1 py-4 rounded-xl text-sm md:text-base font-bold transition-all flex items-center gap-2 md:gap-3 justify-center border", selectionMode === 'quantity' ? "bg-white text-black border-white shadow-lg scale-[1.02] z-10" : "bg-transparent border-transparent text-neutral-500 hover:text-white hover:bg-white/5")}>
                            <Camera size={20} className={selectionMode === 'quantity' ? "text-brand-DEFAULT shrink-0" : "shrink-0"} />
                            POR UNIDADE
                        </button>
                    </div>
                </motion.div>
            )}

            {!isCustomBundle && (
              <motion.div 
                  key="services-grid"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className={gridClasses}
              >
                  {category === 'wedding' && (
                    <>
                        <ServiceCard active={serviceId === 'wedding_base'} onClick={() => handleServiceSelect('wedding_base')} onInfo={setInfoData} icon={Heart} title={TABLE.wedding.wedding_base.label} price={formatCurrency(TABLE.wedding.wedding_base.base)} composition={TABLE.wedding.wedding_base.composition} desc={TABLE.wedding.wedding_base.description} />
                        <ServiceCard active={serviceId === 'wedding_classic'} onClick={() => handleServiceSelect('wedding_classic')} onInfo={setInfoData} icon={Sparkles} title={TABLE.wedding.wedding_classic.label} price={formatCurrency(TABLE.wedding.wedding_classic.base)} composition={TABLE.wedding.wedding_classic.composition} desc={TABLE.wedding.wedding_classic.description} />
                        <ServiceCard active={serviceId === 'wedding_romance'} onClick={() => handleServiceSelect('wedding_romance')} onInfo={setInfoData} icon={Hand} title={TABLE.wedding.wedding_romance.label} price={formatCurrency(TABLE.wedding.wedding_romance.base)} composition={TABLE.wedding.wedding_romance.composition} desc={TABLE.wedding.wedding_romance.description} highlight />
                        <ServiceCard active={serviceId === 'wedding_essence'} onClick={() => handleServiceSelect('wedding_essence')} onInfo={setInfoData} icon={Gem} title={TABLE.wedding.wedding_essence.label} price={formatCurrency(TABLE.wedding.wedding_essence.base)} composition={TABLE.wedding.wedding_essence.composition} desc={TABLE.wedding.wedding_essence.description} highlight />
                        
                        <ServiceCard active={false} onClick={handleCustomProjectClick} onInfo={setInfoData} icon={MessageCircle} title="Personalizado" price="A Consultar" composition="Projeto Especial" desc="Demandas específicas? Fale com nossa equipe." />
                    </>
                  )}
                  {category === 'social' && (
                    <>
                        <ServiceCard active={serviceId === 'birthday'} onClick={() => handleServiceSelect('birthday', selectionMode || 'duration')} onInfo={setInfoData} icon={Gift} title={TABLE.social.birthday.label} price={selectionMode === 'duration' ? formatCurrency(TABLE.social.birthday.base) : "R$ 25,00 / unidade"} composition={selectionMode === 'duration' ? TABLE.social.birthday.composition : "Pague apenas pelo que amar."} desc={TABLE.social.birthday.description} />
                        <ServiceCard active={serviceId === 'social_event'} onClick={() => handleServiceSelect('social_event', selectionMode || 'duration')} onInfo={setInfoData} icon={Users} title={TABLE.social.social_event.label} price={selectionMode === 'duration' ? formatCurrency(TABLE.social.social_event.base) : "R$ 25,00 / unidade"} composition={selectionMode === 'duration' ? TABLE.social.social_event.composition : "Ideal para grandes eventos."} desc={TABLE.social.social_event.description} highlight />
                        <ServiceCard active={serviceId === 'social_party'} onClick={() => handleServiceSelect('social_party', selectionMode || 'duration')} onInfo={setInfoData} icon={GlassWater} title={TABLE.social.social_party.label} price={selectionMode === 'duration' ? formatCurrency(TABLE.social.social_party.base) : "R$ 25,00 / unidade"} composition={selectionMode === 'duration' ? TABLE.social.social_party.composition : "A melhor cobertura."} desc={TABLE.social.social_party.description} highlight />
                        
                        <ServiceCard active={false} onClick={handleCustomProjectClick} onInfo={setInfoData} icon={MessageCircle} title="Personalizado" price="A Consultar" composition="Projeto Especial" desc="Demandas específicas? Fale com nossa equipe." />
                    </>
                  )}
                  {category === 'commercial' && (
                    <>
                        <ServiceCard active={serviceId === 'comm_photo'} onClick={() => handleServiceSelect('comm_photo')} onInfo={setInfoData} icon={Camera} title={TABLE.commercial.comm_photo.label} price="R$ 25 / foto" composition={TABLE.commercial.comm_photo.composition} desc={TABLE.commercial.comm_photo.description} />
                        <ServiceCard active={serviceId === 'comm_video'} onClick={() => handleServiceSelect('comm_video')} onInfo={setInfoData} icon={Video} title={TABLE.commercial.comm_video.label} price="R$ 350 / vídeo" composition={TABLE.commercial.comm_video.composition} desc={TABLE.commercial.comm_video.description} highlight />
                        <ServiceCard active={serviceId === 'comm_combo'} onClick={() => handleServiceSelect('comm_combo')} onInfo={setInfoData} icon={Zap} title={TABLE.commercial.comm_combo.label} price="R$ 600 base" composition={TABLE.commercial.comm_combo.composition} desc={TABLE.commercial.comm_combo.description} highlight />
                    </>
                  )}
                  {category === 'studio' && (
                    <>
                        <ServiceCard active={serviceId === 'studio_photo'} onClick={() => handleServiceSelect('studio_photo')} onInfo={setInfoData} icon={Camera} title={TABLE.studio.studio_photo.label} price="R$ 200 base" composition={TABLE.studio.studio_photo.composition} desc={TABLE.studio.studio_photo.description} />
                        <ServiceCard active={serviceId === 'studio_video'} onClick={() => handleServiceSelect('studio_video')} onInfo={setInfoData} icon={Video} title={TABLE.studio.studio_video.label} price="R$ 350 base" composition={TABLE.studio.studio_video.composition} desc={TABLE.studio.studio_video.description} highlight />
                    </>
                  )}
                  
                  {category === 'custom' && (
                      <motion.div variants={fadeInUp} className="!w-full !max-w-none col-span-3 bg-white/5 border border-white/10 p-6 md:p-10 rounded-2xl text-center backdrop-blur-sm flex flex-col items-center justify-center h-full">
                          <Star className="mx-auto text-brand-DEFAULT mb-4" size={32} />
                          <h3 className="font-serif text-2xl text-white mb-2">Projeto Personalizado</h3>
                          <p className="text-neutral-400 mb-6 text-lg">Descreva sua necessidade específica no WhatsApp.</p>
                          <button 
                              className="bg-brand-DEFAULT hover:bg-brand-hover text-white px-6 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors"
                              onClick={handleCustomProjectClick}
                          >
                              <MessageCircle size={22} />
                              Falar no WhatsApp
                          </button>
                      </motion.div>
                  )}
              </motion.div>
            )}
                 {/* CAIXA DE DETALHES DO SERVIÇO SELECIONADO (Fixed acima do rodapé) */}
            {category !== 'custom' && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-[170px] md:bottom-[140px] left-0 right-0 z-50 pointer-events-none flex flex-col items-center text-center justify-end"
                >
                    {/* Background gradient escuro para leitura, atado à caixa de detalhes */}
                    <div className="absolute bottom-[-200px] left-0 right-0 h-[450px] bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-transparent -z-10" />

                    <div className="relative z-10 px-4 w-full flex flex-col items-center">
                        <AnimatePresence mode="wait">
                        {category === 'video_production' ? (
                        <motion.div 
                            key="video_prod_details"
                            initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
                            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                            exit={{ opacity: 0, filter: 'blur(8px)', y: -10 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col items-center text-center max-w-2xl mx-auto drop-shadow-2xl"
                        >
                            <h3 className="text-xl md:text-2xl font-serif text-white mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
                                Projetos Especiais
                            </h3>
                            <p className="text-xs md:text-sm text-neutral-200 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,1)] max-w-md mx-auto">
                                Selecione e adicione exatamente os serviços que você precisa.
                            </p>
                        </motion.div>
                    ) : serviceId && (AppConfig.PRICING_TABLE as any)[category]?.[serviceId] ? (
                        <motion.div 
                            key={serviceId}
                            initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
                            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                            exit={{ opacity: 0, filter: 'blur(8px)', y: -10 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col items-center text-center max-w-3xl mx-auto drop-shadow-2xl"
                        >
                            <h3 className="text-xl md:text-2xl font-serif text-brand-DEFAULT font-bold mb-1 drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
                                {(AppConfig.PRICING_TABLE as any)[category][serviceId].label}
                            </h3>
                            <p className="text-xs md:text-sm text-neutral-200 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,1)] max-w-lg mx-auto">
                                {(AppConfig.PRICING_TABLE as any)[category][serviceId].description}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="empty_selection"
                            initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
                            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                            exit={{ opacity: 0, filter: 'blur(8px)', y: -10 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col items-center text-center drop-shadow-2xl"
                        >
                            <h3 className="text-sm md:text-base font-medium text-white/50 drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
                                Toque em uma opção para ver os detalhes
                            </h3>
                        </motion.div>
                    )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </motion.div>
      )}

      {/* === STEP 3: CONFIGURATION (DETAILS) === */}
      {viewMode === 'config' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col items-center">
            
            {/* 1. QUANTITY / DURATION CONTROLS */}
            <AnimatePresence mode="wait">
                {category === 'video_production' && (
                    <motion.div 
                        key="video-prod-config"
                        variants={fadeInUp} initial="hidden" animate="visible" exit="hidden"
                        className="w-full max-w-2xl bg-neutral-900/40 p-4 md:p-8 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col gap-6 backdrop-blur-xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-DEFAULT/50 to-transparent" />
                        
                        <div className="text-center mb-2">
                            <h3 className="font-serif text-2xl text-white">Monte seu Pacote</h3>
                            <p className="text-neutral-400 text-sm mt-2">Escolha as quantidades para cada serviço desejado.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:gap-4 w-full">
                            <ProductionControlItem 
                                icon={Camera} 
                                title="Fotos" 
                                desc="R$ 25 / foto" 
                                value={qty} 
                                setter={setQty} 
                                min={10} 
                                unitLabel="Fotos" 
                            />
                            <ProductionControlItem 
                                icon={Video} 
                                title="Vídeo (Câmera)" 
                                desc="R$ 350 base (2h)" 
                                value={camCapHours} 
                                setter={setCamCapHours} 
                                min={2} 
                                unitLabel="Horas" 
                            />
                            <ProductionControlItem 
                                icon={Video} 
                                title="Vídeo (Mobile)" 
                                desc="R$ 200 base (2h)" 
                                value={mobileCapHours} 
                                setter={setMobileCapHours} 
                                min={2} 
                                unitLabel="Horas" 
                            />
                            <ProductionControlItem 
                                icon={Zap} 
                                title="Apenas Edição" 
                                desc="R$ 150 / vídeo" 
                                value={editQty} 
                                setter={setEditQty} 
                                min={1} 
                                unitLabel="Vídeos" 
                            />
                            <ProductionControlItem 
                                icon={PlaneTakeoff} 
                                title="Drone (Aéreo)" 
                                desc="R$ 250 / bateria" 
                                value={droneQty} 
                                setter={setDroneQty} 
                                min={1} 
                                unitLabel="Baterias" 
                            />
                        </div>

                    </motion.div>
                  )}
{category !== 'video_production' && showDuration && (
                    <motion.div 
                        key="duration"
                        variants={fadeInUp} initial="hidden" animate="visible" exit="hidden"
                        className="w-full max-w-lg bg-neutral-900/40 p-8 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col items-center text-center backdrop-blur-xl relative overflow-hidden"
                    >
                         <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-DEFAULT/50 to-transparent" />
                        
                        <div 
                            className="flex items-center gap-3 mb-8 relative group cursor-pointer"
                            onClick={() => setInfoData({ 
                                title: "Tempo de Cobertura", 
                                desc: "Período contínuo de trabalho da equipe. Horas adicionais podem ser negociadas no dia do evento caso a festa se estenda.", 
                                price: "Info" 
                            })}
                        >
                             <Clock className="text-brand-DEFAULT" size={24} />
                             <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-300">Tempo de Cobertura</h3>
                             <HelpCircle size={18} className="text-neutral-600 group-hover:text-white transition-colors" />
                        </div>

                        <div className="flex items-center justify-between w-full gap-8 px-4">
                            <ControlBtn onClick={() => setHours(Math.max(2, hours - 1))} icon={Minus} />
                            <div className="text-center">
                                <span className="block text-6xl font-serif text-white tracking-tighter mb-2 drop-shadow-lg">
                                    <AnimatedNumber value={hours} />
                                </span>
                                <span className="text-xs text-neutral-500 font-bold uppercase tracking-[0.4em]">Horas</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 group relative">
                                <PriceTooltip value={getIncrementPrice('hour')} />
                                <ControlBtn onClick={() => setHours(hours + 1)} icon={Plus} active />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* --- SELETOR DUPLO PARA COMBO (Foto + Vídeo) --- */}
                {isCombo && setVideoQty && (
                   <motion.div 
                        key="combo-selector"
                        variants={fadeInUp} initial="hidden" animate="visible" exit="hidden"
                        className="w-full max-w-lg space-y-4"
                   >
                        {/* Seletor de Fotos */}
                        <div className="bg-neutral-900/40 p-6 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col items-center text-center backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-r from-transparent via-brand-DEFAULT/50 to-transparent" />
                            
                            <div className="flex items-center gap-2 mb-4">
                                <Camera className="text-brand-DEFAULT" size={20} />
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-300">Fotos (Base 10)</h3>
                            </div>

                            <div className="flex items-center justify-between w-full gap-8 px-4">
                                <ControlBtn onClick={() => setQty(Math.max(10, qty - 1))} icon={Minus} />
                                <div className="text-center">
                                    <span className="block text-4xl font-serif text-white tracking-tighter mb-1 drop-shadow-lg">
                                        <AnimatedNumber value={qty} />
                                    </span>
                                </div>
                                <div className="flex flex-col items-center gap-2 group relative">
                                    <PriceTooltip value={getIncrementPrice('combo_photo')} />
                                    <ControlBtn onClick={() => setQty(qty + 1)} icon={Plus} active />
                                </div>
                            </div>
                        </div>

                        {/* Seletor de Vídeos */}
                        <div className="bg-neutral-900/40 p-6 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col items-center text-center backdrop-blur-xl relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-4">
                                <Video className="text-brand-DEFAULT" size={20} />
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-300">Vídeos (Base 1)</h3>
                            </div>

                            <div className="flex items-center justify-between w-full gap-8 px-4">
                                <ControlBtn onClick={() => setVideoQty(Math.max(1, videoQty - 1))} icon={Minus} />
                                <div className="text-center">
                                    <span className="block text-4xl font-serif text-white tracking-tighter mb-1 drop-shadow-lg">
                                        <AnimatedNumber value={videoQty} />
                                    </span>
                                </div>
                                <div className="flex flex-col items-center gap-2 group relative">
                                    <PriceTooltip value={getIncrementPrice('combo_video')} />
                                    <ControlBtn onClick={() => setVideoQty(videoQty + 1)} icon={Plus} active />
                                </div>
                            </div>
                        </div>
                   </motion.div>
                )}

                {showQuantity && (
                    <motion.div 
                        key="quantity"
                        variants={fadeInUp} initial="hidden" animate="visible" exit="hidden"
                        className="w-full max-w-lg bg-neutral-900/40 p-8 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col items-center text-center backdrop-blur-xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-DEFAULT/50 to-transparent" />

                        <div 
                            className="flex items-center gap-3 mb-8 relative group cursor-pointer"
                            onClick={() => setInfoData({ 
                                title: isDroneQuantity ? "Quantidade de Baterias" : "Quantidade", 
                                desc: isDroneQuantity 
                                    ? "Número de baterias contratadas. Cada bateria oferece aprox. 20 minutos de voo técnico."
                                    : isVideoQuantity 
                                        ? "Número de vídeos editados ou produzidos. Inclui ajustes básicos de montagem e cor." 
                                        : "Número de arquivos digitais em alta resolução com tratamento de cor e pele inclusos.", 
                                price: "Info" 
                            })}
                        >
                             {isDroneQuantity 
                                ? <Battery className="text-brand-DEFAULT" size={24} /> 
                                : isVideoQuantity 
                                    ? <Video className="text-brand-DEFAULT" size={24} /> 
                                    : <Camera className="text-brand-DEFAULT" size={24} />
                             }
                             <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-300">
                                {isDroneQuantity ? "Baterias" : "Quantidade"}
                             </h3>
                             <HelpCircle size={18} className="text-neutral-600 group-hover:text-white transition-colors" />
                        </div>

                        <div className="flex items-center justify-between w-full gap-8 px-4">
                            <ControlBtn onClick={() => setQty(Math.max(minQty, qty - 1))} icon={Minus} />
                            <div className="text-center">
                                <span className="block text-6xl font-serif text-white tracking-tighter mb-2 drop-shadow-lg">
                                    <AnimatedNumber value={qty} />
                                </span>
                                <span className="text-xs text-neutral-500 font-bold uppercase tracking-[0.4em]">
                                    {isDroneQuantity ? "Baterias" : "Unidades"}
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-2 group relative">
                                <PriceTooltip value={getIncrementPrice('qty')} />
                                <ControlBtn onClick={() => setQty(qty + 1)} icon={Plus} active />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 2. ADDONS (Drone / RealTime) */}
            {(category === 'wedding' || category === 'social' || category === 'commercial' || category === 'video_production') && (

                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className={cn(
                    "w-full max-w-lg grid gap-4",
                    showDroneAddon ? "grid-cols-2" : "grid-cols-1 max-w-xs" // Layout adaptativo se só tiver 1 item
                  )}
                >
                    {showDroneAddon && (
                        <AddonCard 
                            label="Drone (Aéreo)" 
                            price={250} 
                            icon={PlaneTakeoff} 
                            active={addDrone} 
                            onClick={() => setAddDrone(!addDrone)}
                            onInfo={setInfoData}
                            desc={TABLE.video_production.drone.description}
                        />
                    )}
                    <AddonCard 
                        label="Fotos Tempo Real" 
                        price={realTimePrice} 
                        icon={Clock} 
                        active={addRealTime} 
                        onClick={() => setAddRealTime(!addRealTime)}
                        onInfo={setInfoData}
                        desc="Entrega imediata de uma seleção de fotos durante o evento para postagem nas redes sociais. Engajamento instantâneo."
                    />
                </motion.div>
            )}

            {/* 3. LOGISTICS */}
            {!(travelCost === 0) && (
                <motion.div 
                    variants={fadeInUp} 
                    initial="hidden"
                    animate="visible"
                    onClick={() => setIsMapOpen(true)} 
                    className="w-full max-w-lg border border-white/5 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer group hover:bg-white/[0.05] rounded-xl p-4 md:p-6 transition-colors gap-2 sm:gap-4 overflow-hidden"
                >
                    <div className="flex items-center gap-3 md:gap-4 min-w-0 w-full flex-1">
                        <div className="shrink-0 p-3 md:p-4 bg-white/5 rounded-full text-brand-DEFAULT group-hover:bg-brand-DEFAULT group-hover:text-white transition-colors flex items-center justify-center">
                            <MapPin size={20} className="md:w-6 md:h-6" />
                        </div>
                        <div className="text-left min-w-0 flex-1 overflow-hidden">
                            <p className="text-[10px] md:text-xs uppercase tracking-widest text-neutral-500 font-bold">Logística</p>
                            <p className="text-white text-sm md:text-lg font-medium mt-0.5 md:mt-1 truncate w-full block">
                                {isQuickMode && distance === 0 ? "A definir" : (clientData?.location || "Selecionar Local")}
                            </p>
                        </div>
                    </div>
                    <div className="text-left sm:text-right shrink-0 pl-14 sm:pl-0">
                         <p className="text-brand-DEFAULT md:text-neutral-400 text-xs md:text-sm font-medium">
                             {isQuickMode && distance === 0 
                                ? "A consultar" 
                                : `${distance}km • ${travelCost > 0 ? formatCurrency(travelCost) : "Grátis"}`}
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
      )}

      {/* INFO MODAL */}
      {createPortal(
        <AnimatePresence>
          {infoData && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
               <motion.div 
                  key="backdrop"
                  initial={{ opacity: 0, backdropFilter: 'blur(0px)' }} 
                  animate={{ opacity: 1, backdropFilter: 'blur(16px)' }} 
                  exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-0 bg-black/60"
                  onClick={() => setInfoData(null)}
               />
               <motion.div 
                  key="modal"
                  variants={infoModalVariants} initial="hidden" animate="visible" exit="exit"
                  className="relative z-[10000] bg-neutral-900 border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl overflow-hidden"
               >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setInfoData(null);
                    }}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors z-50"
                    aria-label="Fechar"
                  >
                      <X size={24} />
                  </button>
                  
                  <h3 className="text-2xl font-serif text-white mb-4 pr-8">{infoData.title}</h3>
                  <div className="w-12 h-0.5 bg-brand-DEFAULT mx-auto mb-6" />
                  <div className="max-h-[60vh] overflow-y-auto">
                      <p className="text-neutral-300 leading-relaxed font-light text-base mb-8 text-left">
                          {infoData.desc}
                          <br/><br/>
                          <span className="text-neutral-500 text-sm block text-center mt-4 border-t border-white/5 pt-4">
                              Inclui suporte completo e equipamentos profissionais da EAREC.
                          </span>
                      </p>
                  </div>
                  <div className="bg-brand-DEFAULT/10 py-3 px-6 rounded-full inline-block border border-brand-DEFAULT/20">
                      <span className="text-brand-DEFAULT font-bold text-lg">{infoData.price}</span>
                  </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </section>
  );
};

// === SUB-COMPONENTS ===


const PriceTooltip = ({ value }: { value: number }) => (
    <div className="absolute -top-8 bg-neutral-800 text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-xl">
        + R$ {value}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800" />
    </div>
);

const ControlBtn = ({ onClick, icon: Icon, active }: any) => (
  <motion.button 
      whileHover={{ scale: 1.1, backgroundColor: active ? "var(--brand-color)" : "rgba(255,255,255,0.1)" }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick} 
      className={cn(
        "w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full transition-colors border",
        active ? "bg-white/5 border-white/10 text-white" : "bg-transparent border-white/5 text-neutral-500"
      )}
  >
      <Icon size={24}/>
  </motion.button>
);

const ProductionControlItem = ({ icon: Icon, title, desc, value, setter, min, step = 1, unitLabel }: any) => {
    const isAdded = (value || 0) > 0;

    return (
        <div className={cn(
            "flex flex-col sm:flex-row items-center justify-between gap-4 p-4 md:p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden",
            isAdded 
                ? "bg-neutral-900 border-brand-DEFAULT shadow-[0_0_30px_rgba(220,38,38,0.15)]" 
                : "bg-white/[0.02] border-white/5 hover:border-white/10"
        )}>
            {/* Background Glow when active */}
            {isAdded && (
                <div className="absolute -left-10 top-0 w-32 h-full bg-brand-DEFAULT/10 blur-[50px] pointer-events-none" />
            )}

            <div className="flex items-center gap-4 w-full sm:w-auto relative z-10 flex-1">
                <div className={cn(
                    "p-3 rounded-full transition-colors shrink-0", 
                    isAdded ? "bg-brand-DEFAULT/10 text-brand-DEFAULT shadow-[0_0_15px_rgba(220,38,38,0.2)]" : "bg-white/5 text-neutral-400"
                )}>
                    <Icon size={22} strokeWidth={1.5} />
                </div>
                <div className="text-left">
                    <h4 className="text-white font-medium text-base md:text-lg leading-tight">{title}</h4>
                    <p className="text-[10px] md:text-[11px] text-neutral-400 font-medium mt-1 uppercase tracking-wider">{desc}</p>
                </div>
            </div>
            
            <div className="w-full sm:w-[160px] md:w-[180px] relative z-10 shrink-0">
                {!isAdded ? (
                    <button 
                        onClick={() => setter?.(min)}
                        className="w-full py-3 sm:py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors border border-white/5 flex justify-center items-center gap-2"
                    >
                        <Plus size={16} /> Adicionar
                    </button>
                ) : (
                    <div className="flex items-center justify-between w-full bg-black/40 rounded-2xl p-1.5 border border-white/5">
                        <ControlBtn onClick={() => setter?.(value > min ? value - step : 0)} icon={Minus} />
                        <div className="text-center flex-1">
                            <span className="text-lg font-bold text-white leading-none"><AnimatedNumber value={value} /></span>
                            <span className="block text-[9px] text-neutral-500 uppercase font-bold mt-0.5 tracking-widest">{unitLabel}</span>
                        </div>
                        <ControlBtn onClick={() => setter?.(value + step)} icon={Plus} active />
                    </div>
                )}
            </div>
        </div>
    );
};

const ServiceCard = ({ active, onClick, onInfo, icon: Icon, title, price, composition, desc, highlight }: any) => (
    <motion.div 
        layout 
        variants={fadeInUp}
        onClick={onClick}
        className={cn(
            "group relative flex flex-col items-center justify-center p-3 md:p-6 rounded-3xl border transition-all duration-500 cursor-pointer text-center h-full min-h-[160px] md:min-h-[220px] overflow-hidden w-full box-border",
            active 
                ? "bg-neutral-900 border-brand-DEFAULT shadow-[0_0_30px_rgba(220,38,38,0.15)] scale-[1.02] z-10" 
                : "bg-neutral-950/50 border-white/5 hover:border-white/20 hover:bg-neutral-900/80"
        )}
    >
        {highlight && (
            <div className={cn(
                "absolute top-0 right-0 text-[8px] md:text-[9px] font-bold px-2 py-1 md:px-3 md:py-1 rounded-bl-2xl uppercase tracking-widest z-20 transition-colors duration-300",
                active ? "bg-brand-DEFAULT text-white" : "bg-white/10 text-neutral-400 group-hover:text-neutral-300"
            )}>
                Popular
            </div>
        )}

        {/* Small Elegant Indicator */}
        <div className={cn(
            "absolute top-3 right-3 w-2 h-2 rounded-full transition-all duration-500 z-20",
            active ? "bg-brand-DEFAULT shadow-[0_0_10px_var(--brand-glow)]" : "bg-white/10"
        )} />
        
        <div className={cn(
            "p-4 rounded-full mb-1 transition-all duration-300",
            active 
                ? "bg-white/10 text-white" 
                : "bg-white/5 text-neutral-400 group-hover:bg-white/10 group-hover:text-white"
        )}>
            <Icon size={26} strokeWidth={1.5} />
        </div>
        
        <div className="space-y-1 text-center px-0 sm:px-1 w-full mt-2 flex flex-col items-center">
            <h4 className={cn(
                "text-[10px] sm:text-[11px] md:text-sm font-medium whitespace-normal leading-tight break-words transition-colors duration-300", 
                active ? "text-white" : "text-neutral-400 group-hover:text-neutral-300"
            )}>
                {title}
            </h4>
            
            {/* DESCRIÇÃO BREVE - SÓ APARECE QUANDO ATIVO */}
            <AnimatePresence mode="wait">
                {active && (
                    <motion.p
                        initial={{ opacity: 0, height: 0, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, height: "auto", filter: 'blur(0px)' }}
                        exit={{ opacity: 0, height: 0, filter: 'blur(4px)' }}
                        transition={{ duration: 0.3 }}
                        className="text-[9px] sm:text-[10px] md:text-[11px] text-brand-DEFAULT font-medium leading-tight pt-2"
                    >
                        {composition}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>

        {/* Espaçador para empurrar o preço para baixo quando inativo (se necessário pelo layout) */}
        {!active && <div className="grow" />}

        <div className="w-full pt-3 border-t border-white/5 mt-auto">
            <p className={cn("text-[10px] sm:text-[11px] md:text-sm font-bold tracking-widest uppercase transition-colors duration-300", active ? "text-brand-DEFAULT" : "text-neutral-500 group-hover:text-neutral-400")}>
                {price}
            </p>
        </div>
    </motion.div>
);

const AddonCard = ({ label, price, icon: Icon, active, onClick, onInfo, desc }: any) => (
    <motion.div 
        variants={fadeInUp}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={cn(
            "cursor-pointer flex flex-col items-center justify-center p-3 sm:p-6 rounded-2xl border transition-all select-none relative gap-2 sm:gap-3 h-full group box-border", 
            active ? "bg-brand-DEFAULT/10 border-brand-DEFAULT shadow-[0_0_15px_rgba(220,38,38,0.2)] ring-1 ring-brand-DEFAULT" : "bg-neutral-900/40 border-white/5 hover:bg-white/5"
        )}
    >
        <button 
          className="absolute top-3 left-3 text-neutral-600 hover:text-white transition-colors z-20 p-2 hover:bg-white/5 rounded-full"
          onClick={(e) => {
             e.stopPropagation();
             if (onInfo && desc) onInfo({ title: label, desc, price: formatCurrency(price) });
          }}
        >
            <HelpCircle size={18} strokeWidth={2} />
        </button>

        <div className={cn(
            "absolute top-3 right-3 w-6 h-6 rounded-full border flex items-center justify-center transition-all", 
            active ? "bg-brand-DEFAULT border-brand-DEFAULT" : "border-white/10 bg-black/20"
        )}>
            {active && <Check size={14} className="text-white" />}
        </div>

        <div className={cn(
            "p-4 rounded-full mb-1 transition-all duration-300", 
            active ? "bg-white/20 text-white" : "bg-white/10 text-neutral-300 group-hover:bg-white/20 group-hover:text-white"
        )}>
           <Icon size={28} />
        </div>
        
        <div className="space-y-1 text-center px-0 sm:px-1 w-full">
            <p className={cn("text-[11px] sm:text-xs md:text-sm font-medium whitespace-normal leading-tight break-words", active ? "text-white" : "text-neutral-300")}>{label}</p>
            <p className="text-[9px] md:text-xs text-brand-DEFAULT font-bold bg-brand-DEFAULT/10 py-1 px-2 md:px-3 rounded-full inline-block mt-1 whitespace-nowrap">
                + {formatCurrency(price)}
            </p>
        </div>
    </motion.div>
);

export default UpsellList;
