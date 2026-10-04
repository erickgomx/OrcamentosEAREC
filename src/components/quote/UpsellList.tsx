
import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Heart, Sparkles, Hand, Gem, MessageCircle, Gift, Users, GlassWater, PlaneTakeoff, GraduationCap, Building2, Camera, MapPin, Search, Clock, Zap, Video, Minus, Plus, ChevronRight, HelpCircle, Check, Play, Map as MapIcon, X, Battery, Star , User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AppConfig } from '../../config/AppConfig';
import AnimatedNumber from '../ui/AnimatedNumber';

import { fadeInUp, staggerContainer, modalVariants, cardItemVariants } from '../../lib/animations';
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
  edit30sQty?: number; setEdit30sQty?: (n: number) => void;
  edit1minQty?: number; setEdit1minQty?: (n: number) => void;
  projectType?: 'commercial' | 'personal'; setProjectType?: (m: 'commercial' | 'personal') => void;
  addDrone: boolean; setAddDrone: (b: boolean) => void;
  addRealTime: boolean; setAddRealTime: (b: boolean) => void;
  distance: number; travelCost: number; isMapOpen: boolean; setIsMapOpen: (b: boolean) => void;
  selectionMode: 'duration' | 'quantity'; setSelectionMode: (m: 'duration' | 'quantity') => void;
  isQuickMode?: boolean; onContactRequest: () => void;
  commercialMode: 'on_location' | 'studio'; setCommercialMode: (m: 'on_location' | 'studio') => void;
  videoDevice?: 'mobile' | 'camera'; setVideoDevice?: (d: 'mobile' | 'camera') => void;
}

const CategoryCard = ({ active, onClick, icon: Icon, label, desc, index = 0 }: any) => (
    <motion.div 
        custom={index}
        variants={cardItemVariants}
        whileHover={{ scale: 1.025, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onClick={onClick}
        className={cn(
            "group relative flex flex-col items-center justify-center p-4 sm:p-5 md:p-6 rounded-2xl md:rounded-3xl border transition-all duration-300 cursor-pointer text-center h-full min-h-[145px] sm:min-h-[175px] md:min-h-[200px] overflow-hidden backdrop-blur-md",
            active 
                ? "bg-neutral-900/90 border-brand-DEFAULT shadow-[0_0_30px_rgba(220,38,38,0.2)] ring-1 ring-brand-DEFAULT/50" 
                : "bg-neutral-900/40 border-white/10 hover:border-white/25 hover:bg-neutral-900/70 hover:shadow-[0_0_20px_rgba(255,255,255,0.03)]"
        )}
    >
        <div className={cn(
            "absolute top-3 right-3 w-3 h-3 rounded-full transition-all duration-500",
            active ? "bg-brand-DEFAULT shadow-[0_0_15px_rgba(220,38,38,0.8)] border border-brand-DEFAULT/50" : "bg-white/10"
        )} />
        
        <div className={cn(
            "p-3 sm:p-4 rounded-2xl mb-2 transition-all duration-300",
            active ? "bg-brand-DEFAULT/15 text-brand-DEFAULT shadow-[0_0_20px_rgba(220,38,38,0.25)]" : "bg-white/5 text-neutral-300 group-hover:bg-white/10 group-hover:text-white"
        )}>
            <Icon size={28} strokeWidth={1.5} className="sm:w-8 sm:h-8" />
        </div>
        <div className="space-y-1 text-center px-0 sm:px-1 w-full mt-1">
            <p className={cn(
                "text-xs sm:text-sm md:text-base font-semibold whitespace-normal leading-tight break-words transition-colors duration-300",
                active ? "text-white" : "text-neutral-300 group-hover:text-white"
            )}>
                {label}
            </p>
            <AnimatePresence mode="wait">
                {active && (
                    <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[11px] sm:text-xs text-neutral-400 font-normal leading-snug mt-1"
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
    hours, setHours, qty, setQty, videoQty, setVideoQty, droneQty, setDroneQty, camCapHours, setCamCapHours, mobileCapHours, setMobileCapHours, edit30sQty, setEdit30sQty, edit1minQty, setEdit1minQty,
    addDrone, setAddDrone, addRealTime, setAddRealTime,
    distance, travelCost, isMapOpen, setIsMapOpen,
    selectionMode, setSelectionMode,
    isQuickMode = false,
    onContactRequest,
    commercialMode, setCommercialMode, projectType, setProjectType,
    videoDevice = 'mobile', setVideoDevice
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
  const isVideoQuantity = serviceId === 'comm_video' || serviceId === 'edit_only' || serviceId === 'social_video';
  const minQty = (serviceId === 'comm_photo' ? 5 : (serviceId === 'comm_video' || serviceId === 'social_video' ? 1 : (serviceId === 'studio_photo' ? 7 : (category === 'video_production' ? 1 : 10))));
  const getIncrementPrice = (type: string) => {
    if (type === 'combo_photo') return 20;
    if (type === 'combo_video') return videoDevice === 'camera' ? 600 : 350;
    if (type === 'qty') {
        if (serviceId === 'comm_photo') return 20;
        if (serviceId === 'studio_photo') {
            if (qty < 7) return 0;
            if (qty >= 7 && qty < 12) return 20;
            if (qty === 12) return 10; // 240 para 250
            return 25; // Acima de 13
        }
        if (serviceId === 'comm_video' || serviceId === 'social_video') return videoDevice === 'camera' ? 600 : 350;
        if (category === 'social') return 25;
        if (category === 'video_production' && serviceId === 'drone') return projectType === 'commercial' ? 300 : 250;
        if (category === 'video_production' && serviceId === 'edit_only') return projectType === 'commercial' ? 180 : 150;
    }
    if (type === 'hours' || type === 'hour') {
        if (category === 'wedding') return 300;
        if (category === 'social') return 250;
        if (category === 'commercial' && serviceId === 'comm_event') return 250;
        if (category === 'studio') return 175;
        if (category === 'video_production') {
            if (serviceId === 'cam_cap') return projectType === 'commercial' ? 300 : 200;
            if (serviceId === 'mobile_cap') return projectType === 'commercial' ? 150 : 100;
        }
    }
    return 0;
  };
  const realTimePrice = AppConfig.PRICING_TABLE.wedding.realtime.fixed;

  const handleCustomProjectClick = () => {
    onContactRequest();
  };

  const isCustomBundle = false; // Removido para usar o grid padrão
  
  const showDuration = (selectionMode === 'duration') && !['custom_bundle'].includes(serviceId) && category !== 'video_production' && serviceId !== 'social_video';
  const showQuantity = !['custom_bundle'].includes(serviceId) && (selectionMode === 'quantity' || category === 'commercial' || serviceId === 'social_video') && category !== 'video_production';
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
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="space-y-8 w-full flex flex-col items-center max-w-4xl mx-auto pb-6 sm:pb-8"
        >
            <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 md:gap-6 w-full">
                {categories.map((cat, i) => (
                    <CategoryCard 
                        key={cat.id}
                        {...cat}
                        active={category === cat.id}
                        onClick={() => setCategory(cat.id)}
                        index={i}
                    />
                ))}
            </motion.div>
        </motion.div>
      )}
      {viewMode === 'services' && (
        <motion.div
          key="services-view"
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="space-y-6 sm:space-y-8 w-full flex flex-col items-center pb-6 sm:pb-8"
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
                    <div className="flex bg-black/40 rounded-xl p-1 w-full max-w-xs mx-auto border border-white/5">
                        <button 
                            onClick={() => setSelectionMode('duration')} 
                            className={cn(
                                "flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2", 
                                selectionMode === 'duration' ? "bg-white/10 text-white shadow-sm" : "text-neutral-400 hover:text-white"
                            )}
                        >
                            <Clock size={16} />
                            Por Tempo
                        </button>
                        <button 
                            onClick={() => setSelectionMode('quantity')} 
                            className={cn(
                                "flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2", 
                                selectionMode === 'quantity' ? "bg-white/10 text-white shadow-sm" : "text-neutral-400 hover:text-white"
                            )}
                        >
                            <Camera size={16} />
                            Por Unidade
                        </button>
                    </div>
                </motion.div>
            )}

            {!isCustomBundle && (
              <motion.div 
                  key={`services-grid-${category}`}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className={gridClasses}
              >
                  {category === 'wedding' && (
                    <>
                        <ServiceCard index={0} active={serviceId === 'wedding_base'} onClick={() => handleServiceSelect('wedding_base')} onInfo={setInfoData} icon={Heart} title={TABLE.wedding.wedding_base.label} price={formatCurrency(TABLE.wedding.wedding_base.base)} composition={TABLE.wedding.wedding_base.composition} desc={TABLE.wedding.wedding_base.description} />
                        <ServiceCard index={1} active={serviceId === 'wedding_classic'} onClick={() => handleServiceSelect('wedding_classic')} onInfo={setInfoData} icon={Sparkles} title={TABLE.wedding.wedding_classic.label} price={formatCurrency(TABLE.wedding.wedding_classic.base)} composition={TABLE.wedding.wedding_classic.composition} desc={TABLE.wedding.wedding_classic.description} />
                        <ServiceCard index={2} active={serviceId === 'wedding_romance'} onClick={() => handleServiceSelect('wedding_romance')} onInfo={setInfoData} icon={Hand} title={TABLE.wedding.wedding_romance.label} price={formatCurrency(TABLE.wedding.wedding_romance.base)} composition={TABLE.wedding.wedding_romance.composition} desc={TABLE.wedding.wedding_romance.description} highlight />
                        <ServiceCard index={3} active={serviceId === 'wedding_essence'} onClick={() => handleServiceSelect('wedding_essence')} onInfo={setInfoData} icon={Gem} title={TABLE.wedding.wedding_essence.label} price={formatCurrency(TABLE.wedding.wedding_essence.base)} composition={TABLE.wedding.wedding_essence.composition} desc={TABLE.wedding.wedding_essence.description} highlight />
                        
                        <ServiceCard index={4} active={false} onClick={handleCustomProjectClick} onInfo={setInfoData} icon={MessageCircle} title="Personalizado" price="A Consultar" composition="Projeto Especial" desc="Demandas específicas? Fale com nossa equipe." />
                    </>
                  )}
                  {category === 'social' && (
                    <>
                        <ServiceCard index={0} active={serviceId === 'birthday'} onClick={() => handleServiceSelect('birthday', selectionMode || 'duration')} onInfo={setInfoData} icon={Gift} title={TABLE.social.birthday.label} price={selectionMode === 'duration' ? formatCurrency(TABLE.social.birthday.base) : "A partir de R$ 250"} composition={selectionMode === 'duration' ? TABLE.social.birthday.composition : "Mínimo 10 fotos inclusas"} desc={TABLE.social.birthday.description} />
                        <ServiceCard index={1} active={serviceId === 'social_event'} onClick={() => handleServiceSelect('social_event', selectionMode || 'duration')} onInfo={setInfoData} icon={Users} title={TABLE.social.social_event.label} price={selectionMode === 'duration' ? formatCurrency(TABLE.social.social_event.base) : "A partir de R$ 250"} composition={selectionMode === 'duration' ? TABLE.social.social_event.composition : "Mínimo 10 fotos inclusas"} desc={TABLE.social.social_event.description} highlight />
                        <ServiceCard index={2} active={serviceId === 'social_party'} onClick={() => handleServiceSelect('social_party', selectionMode || 'duration')} onInfo={setInfoData} icon={GlassWater} title={TABLE.social.social_party.label} price={selectionMode === 'duration' ? formatCurrency(TABLE.social.social_party.base) : "A partir de R$ 250"} composition={selectionMode === 'duration' ? TABLE.social.social_party.composition : "Mínimo 10 fotos inclusas"} desc={TABLE.social.social_party.description} highlight />
                        <ServiceCard 
                            index={3} 
                            active={serviceId === 'social_video'} 
                            onClick={() => {
                                handleServiceSelect('social_video');
                                if (!videoQty || videoQty < 1) setVideoQty?.(1);
                            }} 
                            onInfo={setInfoData} 
                            icon={Video} 
                            title={TABLE.social.social_video.label} 
                            price={videoDevice === 'camera' ? "R$ 600 / vídeo" : "R$ 350 / vídeo"} 
                            composition={videoDevice === 'camera' ? "Câmera Cinema Entregue" : "Vídeo Mobile Entregue"} 
                            desc={TABLE.social.social_video.description} 
                            highlight 
                            extraContent={
                                <div className="flex bg-black/50 p-1 rounded-xl border border-white/10 gap-1 w-full max-w-[200px] mx-auto mt-1">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setVideoDevice?.('mobile');
                                        }}
                                        className={cn(
                                            "flex-1 py-1 px-1.5 text-[10px] sm:text-xs font-semibold rounded-lg transition-all text-center",
                                            videoDevice === 'mobile'
                                                ? "bg-brand-DEFAULT text-white shadow-sm"
                                                : "text-neutral-400 hover:text-white"
                                        )}
                                    >
                                        Mobile (350)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setVideoDevice?.('camera');
                                        }}
                                        className={cn(
                                            "flex-1 py-1 px-1.5 text-[10px] sm:text-xs font-semibold rounded-lg transition-all text-center",
                                            videoDevice === 'camera'
                                                ? "bg-brand-DEFAULT text-white shadow-sm"
                                                : "text-neutral-400 hover:text-white"
                                        )}
                                    >
                                        Câmera (600)
                                    </button>
                                </div>
                            }
                        />
                        <ServiceCard index={4} active={false} onClick={handleCustomProjectClick} onInfo={setInfoData} icon={MessageCircle} title="Personalizado" price="A Consultar" composition="Projeto Especial" desc="Demandas específicas? Fale com nossa equipe." />
                    </>
                  )}
                  {category === 'commercial' && (
                    <>
                        <ServiceCard index={0} active={serviceId === 'comm_photo'} onClick={() => handleServiceSelect('comm_photo')} onInfo={setInfoData} icon={Camera} title={TABLE.commercial.comm_photo.label} price="R$ 20 / foto" composition={TABLE.commercial.comm_photo.composition} desc={TABLE.commercial.comm_photo.description} />
                        <ServiceCard 
                            index={1} 
                            active={serviceId === 'comm_video'} 
                            onClick={() => handleServiceSelect('comm_video')} 
                            onInfo={setInfoData} 
                            icon={Video} 
                            title={TABLE.commercial.comm_video.label} 
                            price={videoDevice === 'camera' ? "R$ 600 / vídeo" : "R$ 350 / vídeo"} 
                            composition={videoDevice === 'camera' ? "Câmera Cinema Entregue" : "Vídeo Mobile Entregue"} 
                            desc={TABLE.commercial.comm_video.description} 
                            highlight 
                            extraContent={
                                <div className="flex bg-black/50 p-1 rounded-xl border border-white/10 gap-1 w-full max-w-[200px] mx-auto mt-1">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setVideoDevice?.('mobile');
                                        }}
                                        className={cn(
                                            "flex-1 py-1 px-1.5 text-[10px] sm:text-xs font-semibold rounded-lg transition-all text-center",
                                            videoDevice === 'mobile'
                                                ? "bg-brand-DEFAULT text-white shadow-sm"
                                                : "text-neutral-400 hover:text-white"
                                        )}
                                    >
                                        Mobile (350)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setVideoDevice?.('camera');
                                        }}
                                        className={cn(
                                            "flex-1 py-1 px-1.5 text-[10px] sm:text-xs font-semibold rounded-lg transition-all text-center",
                                            videoDevice === 'camera'
                                                ? "bg-brand-DEFAULT text-white shadow-sm"
                                                : "text-neutral-400 hover:text-white"
                                        )}
                                    >
                                        Câmera (600)
                                    </button>
                                </div>
                            }
                        />
                        <ServiceCard 
                            index={2} 
                            active={serviceId === 'comm_combo'} 
                            onClick={() => handleServiceSelect('comm_combo')} 
                            onInfo={setInfoData} 
                            icon={Zap} 
                            title="Pacote (Foto + Vídeo)" 
                            price={videoDevice === 'camera' ? "R$ 850 base" : "A partir de R$ 600"} 
                            composition={videoDevice === 'camera' ? "10 Fotos tratadas + 1 Vídeo Câmera" : "10 Fotos tratadas + 1 Vídeo Mobile"} 
                            desc={TABLE.commercial.comm_combo.description} 
                            highlight 
                            extraContent={
                                <div className="flex bg-black/50 p-1 rounded-xl border border-white/10 gap-1 w-full max-w-[200px] mx-auto mt-1">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setVideoDevice?.('mobile');
                                        }}
                                        className={cn(
                                            "flex-1 py-1 px-1.5 text-[10px] sm:text-xs font-semibold rounded-lg transition-all text-center",
                                            videoDevice === 'mobile'
                                                ? "bg-brand-DEFAULT text-white shadow-sm"
                                                : "text-neutral-400 hover:text-white"
                                        )}
                                    >
                                        Mobile (600)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setVideoDevice?.('camera');
                                        }}
                                        className={cn(
                                            "flex-1 py-1 px-1.5 text-[10px] sm:text-xs font-semibold rounded-lg transition-all text-center",
                                            videoDevice === 'camera'
                                                ? "bg-brand-DEFAULT text-white shadow-sm"
                                                : "text-neutral-400 hover:text-white"
                                        )}
                                    >
                                        Câmera (850)
                                    </button>
                                </div>
                            }
                        />
                        <ServiceCard index={3} active={false} onClick={handleCustomProjectClick} onInfo={setInfoData} icon={MessageCircle} title="Personalizado" price="A Consultar" composition="Projeto Especial" desc="Demandas específicas? Fale com nossa equipe." />
                    </>
                  )}
                  {category === 'studio' && (
                    <>
                        <ServiceCard 
                            index={0} 
                            active={serviceId === 'studio_photo'} 
                            onClick={() => handleServiceSelect('studio_photo', 'quantity')} 
                            onInfo={setInfoData} 
                            icon={Camera} 
                            title={TABLE.studio.studio_photo.label} 
                            price="A partir de R$ 150" 
                            composition={TABLE.studio.studio_photo.composition} 
                            desc={TABLE.studio.studio_photo.description} 
                        />
                        <ServiceCard 
                            index={1} 
                            active={serviceId === 'studio_video'} 
                            onClick={() => handleServiceSelect('studio_video', 'duration')} 
                            onInfo={setInfoData} 
                            icon={Video} 
                            title={TABLE.studio.studio_video.label} 
                            price="R$ 350 base (2h)" 
                            composition={TABLE.studio.studio_video.composition} 
                            desc={TABLE.studio.studio_video.description} 
                            highlight 
                        />
                        <ServiceCard index={2} active={false} onClick={handleCustomProjectClick} onInfo={setInfoData} icon={MessageCircle} title="Personalizado" price="A Consultar" composition="Projeto Especial" desc="Demandas específicas? Fale com nossa equipe." />
                    </>
                  )}
                  
                  {category === 'custom' && (
                      <motion.div variants={cardItemVariants} custom={0} className="!w-full !max-w-none col-span-3 bg-white/5 border border-white/10 p-6 md:p-10 rounded-2xl text-center backdrop-blur-sm flex flex-col items-center justify-center h-full">
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

            {/* PAINEL DE DETALHES DO PACOTE SELECIONADO (No fluxo natural do layout, logo abaixo dos cards) */}
            {category !== 'custom' && (
                <motion.div 
                    variants={fadeInUp}
                    className="w-full max-w-3xl mx-auto mt-4 sm:mt-6 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-md text-center shadow-xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-brand-DEFAULT/60 to-transparent" />

                    <AnimatePresence mode="wait">
                    {category === 'video_production' ? (
                        <motion.div 
                            key="video_prod_details"
                            initial={{ opacity: 0, filter: 'blur(6px)', y: 8 }}
                            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                            exit={{ opacity: 0, filter: 'blur(6px)', y: -8 }}
                            transition={{ duration: 0.25 }}
                            className="flex flex-col items-center text-center space-y-2 max-w-2xl mx-auto"
                        >
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-brand-DEFAULT shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                                <h3 className="text-base sm:text-lg md:text-xl font-serif text-white font-bold">
                                    Projetos Especiais
                                </h3>
                            </div>
                            <p className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed max-w-md mx-auto">
                                Selecione e adicione exatamente os serviços que você precisa.
                            </p>
                        </motion.div>
                    ) : serviceId && (AppConfig.PRICING_TABLE as any)[category]?.[serviceId] ? (
                        <motion.div 
                            key={serviceId}
                            initial={{ opacity: 0, filter: 'blur(6px)', y: 8 }}
                            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                            exit={{ opacity: 0, filter: 'blur(6px)', y: -8 }}
                            transition={{ duration: 0.25 }}
                            className="flex flex-col items-center text-center space-y-2 max-w-3xl mx-auto"
                        >
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-brand-DEFAULT shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                                <h3 className="text-base sm:text-lg md:text-xl font-serif text-brand-DEFAULT font-bold">
                                    {(AppConfig.PRICING_TABLE as any)[category][serviceId].label}
                                </h3>
                            </div>
                            <p className="text-xs sm:text-sm text-neutral-200 font-normal leading-relaxed max-w-xl mx-auto">
                                {(AppConfig.PRICING_TABLE as any)[category][serviceId].description}
                            </p>
                            {(AppConfig.PRICING_TABLE as any)[category][serviceId].composition && (
                                <div className="pt-1">
                                    <span className="inline-block text-[11px] sm:text-xs text-brand-DEFAULT bg-brand-DEFAULT/10 border border-brand-DEFAULT/20 px-3 py-1 rounded-full font-medium">
                                        {(AppConfig.PRICING_TABLE as any)[category][serviceId].composition}
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="empty_selection"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-1"
                        >
                            <p className="text-xs sm:text-sm text-neutral-400">
                                Toque em uma opção acima para ver os detalhes do pacote.
                            </p>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </motion.div>
            )}
        </motion.div>
      )}

      {/* === STEP 3: CONFIGURATION (DETAILS) === */}
      {viewMode === 'config' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col items-center pb-6 sm:pb-8">
            
            {/* 1. QUANTITY / DURATION CONTROLS */}
            <AnimatePresence mode="wait">
                {category === 'video_production' && (
                    <motion.div 
                        key="video-prod-config"
                        variants={fadeInUp} initial="hidden" animate="visible" exit="hidden"
                        className="w-full max-w-2xl bg-neutral-900/40 p-4 md:p-8 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col gap-6 backdrop-blur-xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-DEFAULT/50 to-transparent" />
                        
                        <div className="text-center mb-6">
                            <h3 className="font-serif text-2xl text-white">Monte seu Pacote</h3>
                            <p className="text-neutral-400 text-sm mt-2">Escolha as quantidades para cada serviço desejado.</p>
                            
                            {/* Project Type Toggle */}
                            <div className="flex bg-black/40 rounded-xl p-1 w-full max-w-xs mx-auto mt-6 border border-white/5">
                                <button
                                    onClick={() => setProjectType?.('personal')}
                                    className={cn(
                                        "flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
                                        projectType === 'personal' ? "bg-white/10 text-white shadow-sm" : "text-neutral-400 hover:text-white"
                                    )}
                                >
                                    <User size={16} />
                                    Pessoa Física
                                </button>
                                <button
                                    onClick={() => setProjectType?.('commercial')}
                                    className={cn(
                                        "flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
                                        projectType === 'commercial' ? "bg-white/10 text-white shadow-sm" : "text-neutral-400 hover:text-white"
                                    )}
                                >
                                    <Building2 size={16} />
                                    Comercial
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:gap-4 w-full">
                            <ProductionControlItem 
                                index={0}
                                icon={Camera} 
                                title="Fotos" 
                                desc={projectType === 'commercial' ? "R$ 30 / foto" : "R$ 25 / foto"} 
                                value={qty} 
                                setter={setQty} 
                                min={10} 
                                unitLabel="Fotos" 
                            />
                            <ProductionControlItem 
                                index={1}
                                icon={Video} 
                                title="Gravação com câmera" 
                                desc={projectType === 'commercial' ? "R$ 600 base (2h)" : "R$ 350 base (2h)"} 
                                value={camCapHours} 
                                setter={setCamCapHours} 
                                min={2} 
                                unitLabel="Horas" 
                            />
                            <ProductionControlItem 
                                index={2}
                                icon={Video} 
                                title="Gravação com celular" 
                                desc={projectType === 'commercial' ? "R$ 300 base (2h)" : "R$ 200 base (2h)"} 
                                value={mobileCapHours} 
                                setter={setMobileCapHours} 
                                min={2} 
                                unitLabel="Horas" 
                            />
                            <ProductionControlItem 
                                index={3}
                                icon={Zap} 
                                title="Edição (30s)" 
                                desc={projectType === 'commercial' ? "R$ 180 / vídeo" : "R$ 150 / vídeo"} 
                                value={edit30sQty} 
                                setter={setEdit30sQty} 
                                min={1} 
                                unitLabel="Vídeos" 
                            />
                            <ProductionControlItem 
                                index={4}
                                icon={Zap} 
                                title="Edição (1 min)" 
                                desc={projectType === 'commercial' ? "R$ 300 / vídeo" : "R$ 250 / vídeo"} 
                                value={edit1minQty} 
                                setter={setEdit1minQty} 
                                min={1} 
                                unitLabel="Vídeos" 
                            />
                            <ProductionControlItem 
                                index={5}
                                icon={PlaneTakeoff} 
                                title="Drone (Aéreo)" 
                                desc={projectType === 'commercial' ? "R$ 300 / bateria" : "R$ 250 / bateria"} 
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
                                <span className="block text-6xl font-price font-bold text-white tracking-tighter mb-2 drop-shadow-lg">
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

                {/* --- SELETOR DUPLO PARA PACOTE (Foto + Vídeo) --- */}
                {isCombo && setVideoQty && (
                   <motion.div 
                        key="combo-selector"
                        variants={fadeInUp} initial="hidden" animate="visible" exit="hidden"
                        className="w-full max-w-lg space-y-4"
                   >
                        {/* Seletor Mobile vs Câmera para o Pacote */}
                        <div className="flex bg-black/40 rounded-xl p-1 w-full max-w-xs mx-auto mb-2 border border-white/5">
                            <button
                                type="button"
                                onClick={() => setVideoDevice?.('mobile')}
                                className={cn(
                                    "flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1.5",
                                    videoDevice === 'mobile' ? "bg-brand-DEFAULT text-white shadow-sm" : "text-neutral-400 hover:text-white"
                                )}
                            >
                                📱 Mobile (R$ 600)
                            </button>
                            <button
                                type="button"
                                onClick={() => setVideoDevice?.('camera')}
                                className={cn(
                                    "flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1.5",
                                    videoDevice === 'camera' ? "bg-brand-DEFAULT text-white shadow-sm" : "text-neutral-400 hover:text-white"
                                )}
                            >
                                📷 Câmera (R$ 850)
                            </button>
                        </div>

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
                                    <span className="block text-4xl font-price font-bold text-white tracking-tighter mb-1 drop-shadow-lg">
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
                                    <span className="block text-4xl font-price font-bold text-white tracking-tighter mb-1 drop-shadow-lg">
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
                        {category === 'studio' && serviceId === 'studio_photo' && (
                            <div className="absolute top-4 left-4 bg-brand-DEFAULT text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-lg z-10 flex items-center gap-1">
                                <Sparkles size={11} />
                                {qty === 7 ? "Desconto (R$ 150)" : qty >= 13 ? "Promoção (R$ 250)" : "Estúdio Profissional"}
                            </div>
                        )}

                        <div 
                            className="flex items-center gap-3 mb-6 relative group cursor-pointer"
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

                        {((category === 'commercial' && serviceId === 'comm_video') || (category === 'social' && serviceId === 'social_video')) && (
                            <div className="flex bg-black/40 rounded-xl p-1 w-full max-w-xs mx-auto mb-6 border border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setVideoDevice?.('mobile')}
                                    className={cn(
                                        "flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1.5",
                                        videoDevice === 'mobile' ? "bg-brand-DEFAULT text-white shadow-sm" : "text-neutral-400 hover:text-white"
                                    )}
                                >
                                    📱 Mobile (R$ 350)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setVideoDevice?.('camera')}
                                    className={cn(
                                        "flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1.5",
                                        videoDevice === 'camera' ? "bg-brand-DEFAULT text-white shadow-sm" : "text-neutral-400 hover:text-white"
                                    )}
                                >
                                    📷 Câmera (R$ 600)
                                </button>
                            </div>
                        )}

                        <div className="flex items-center justify-between w-full gap-8 px-4">
                            <ControlBtn onClick={() => setQty(Math.max(minQty, qty - 1))} icon={Minus} />
                            <div className="text-center">
                                <span className="block text-6xl font-price font-bold text-white tracking-tighter mb-2 drop-shadow-lg">
                                    <AnimatedNumber value={qty} />
                                </span>
                                <span className="text-xs text-neutral-500 font-bold uppercase tracking-[0.4em]">
                                    {isDroneQuantity ? "Baterias" : isVideoQuantity ? "Vídeos" : "Fotos"}
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

            {/* SELETOR DE VÍDEO PARA EVENTOS SOCIAIS (Mobile ou Câmera) */}
            {category === 'social' && serviceId !== 'social_video' && (
                <motion.div 
                    variants={fadeInUp} 
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-lg bg-neutral-900/40 p-6 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col items-center text-center backdrop-blur-xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-DEFAULT/50 to-transparent" />
                    
                    <div className="flex items-center gap-2 mb-2">
                        <Video className="text-brand-DEFAULT" size={20} />
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-300">
                            Deseja Incluir Vídeo?
                        </h3>
                    </div>
                    <p className="text-xs text-neutral-400 mb-4 max-w-sm">
                        Adicione gravação de vídeo para registrar momentos marcantes do evento.
                    </p>

                    <div className="grid grid-cols-3 gap-2 w-full max-w-md">
                        <button
                            type="button"
                            onClick={() => setVideoQty?.(0)}
                            className={cn(
                                "py-3 px-2 rounded-xl text-xs font-medium border transition-all flex flex-col items-center justify-center gap-1",
                                (!videoQty || videoQty === 0)
                                    ? "bg-white/10 border-white/30 text-white shadow-sm"
                                    : "bg-black/20 border-white/5 text-neutral-400 hover:text-white"
                            )}
                        >
                            <span className="font-semibold">Sem Vídeo</span>
                            <span className="text-[10px] text-neutral-500">Apenas fotos</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setVideoDevice?.('mobile');
                                setVideoQty?.(Math.max(1, videoQty || 1));
                            }}
                            className={cn(
                                "py-3 px-2 rounded-xl text-xs font-medium border transition-all flex flex-col items-center justify-center gap-1",
                                videoQty > 0 && videoDevice === 'mobile'
                                    ? "bg-brand-DEFAULT border-brand-DEFAULT text-white shadow-md shadow-brand-DEFAULT/30"
                                    : "bg-black/20 border-white/5 text-neutral-400 hover:text-white"
                            )}
                        >
                            <span className="font-semibold">📱 Mobile</span>
                            <span className="text-[10px] opacity-80">+R$ 350</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setVideoDevice?.('camera');
                                setVideoQty?.(Math.max(1, videoQty || 1));
                            }}
                            className={cn(
                                "py-3 px-2 rounded-xl text-xs font-medium border transition-all flex flex-col items-center justify-center gap-1",
                                videoQty > 0 && videoDevice === 'camera'
                                    ? "bg-brand-DEFAULT border-brand-DEFAULT text-white shadow-md shadow-brand-DEFAULT/30"
                                    : "bg-black/20 border-white/5 text-neutral-400 hover:text-white"
                            )}
                        >
                            <span className="font-semibold">📷 Câmera</span>
                            <span className="text-[10px] opacity-80">+R$ 600</span>
                        </button>
                    </div>

                    {videoQty > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between w-full px-2">
                            <span className="text-xs text-neutral-300 font-medium">
                                Quantidade de vídeos:
                            </span>
                            <div className="flex items-center gap-3">
                                <ControlBtn onClick={() => setVideoQty?.(Math.max(1, videoQty - 1))} icon={Minus} />
                                <span className="font-price font-bold text-white text-lg w-6 text-center">{videoQty}</span>
                                <ControlBtn onClick={() => setVideoQty?.(videoQty + 1)} icon={Plus} active />
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

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
                            index={0}
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
                        index={showDroneAddon ? 1 : 0}
                        label="Receber material na hora" 
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
                         <p className="text-brand-DEFAULT md:text-neutral-400 text-xs md:text-sm font-medium font-price">
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
                      <span className="text-brand-DEFAULT font-bold font-price text-lg">{infoData.price}</span>
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
    <div className="absolute -top-8 bg-neutral-800 text-white text-[10px] font-price font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-xl">
        + R$ {value}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800" />
    </div>
);

const ControlBtn = ({ onClick, icon: Icon, active }: any) => (
  <motion.button 
      whileHover={{ scale: 1.08, y: -1 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
      onClick={onClick} 
      className={cn(
        "w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full transition-all border shadow-lg",
        active 
          ? "bg-brand-DEFAULT text-white border-brand-DEFAULT shadow-[0_0_20px_rgba(220,38,38,0.4)]" 
          : "bg-white/[0.04] border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 hover:border-white/20"
      )}
  >
      <Icon size={24}/>
  </motion.button>
);

const ProductionControlItem = ({ icon: Icon, title, desc, value, setter, min, step = 1, unitLabel, index = 0 }: any) => {
    const isAdded = (value || 0) > 0;

    return (
        <motion.div 
            custom={index}
            variants={cardItemVariants}
            className={cn(
            "flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 md:p-6 rounded-2xl md:rounded-3xl border transition-all duration-300 relative overflow-hidden",
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
                    "p-3 rounded-2xl transition-colors shrink-0", 
                    isAdded ? "bg-brand-DEFAULT/15 text-brand-DEFAULT shadow-[0_0_15px_rgba(220,38,38,0.25)]" : "bg-white/5 text-neutral-300"
                )}>
                    <Icon size={24} strokeWidth={1.5} />
                </div>
                <div className="text-left">
                    <h4 className="text-white font-semibold text-base sm:text-lg leading-tight">{title}</h4>
                    <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-1">{desc}</p>
                </div>
            </div>
            
            <div className="w-full sm:w-[170px] md:w-[190px] relative z-10 shrink-0">
                {!isAdded ? (
                    <button 
                        onClick={() => setter?.(min)}
                        className="w-full py-3 sm:py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm sm:text-base font-semibold transition-colors border border-white/10 flex justify-center items-center gap-2"
                    >
                        <Plus size={18} /> Adicionar
                    </button>
                ) : (
                    <div className="flex items-center justify-between w-full bg-black/40 rounded-2xl p-1.5 border border-white/10">
                        <ControlBtn onClick={() => setter?.(value > min ? value - step : 0)} icon={Minus} />
                        <div className="text-center flex-1 px-1">
                            <span className="text-xl sm:text-2xl font-bold font-price text-white leading-none"><AnimatedNumber value={value} /></span>
                            <span className="block text-[10px] sm:text-xs text-neutral-400 uppercase font-semibold mt-0.5 tracking-wider">{unitLabel}</span>
                        </div>
                        <ControlBtn onClick={() => setter?.(value + step)} icon={Plus} active />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const ServiceCard = ({ active, onClick, onInfo, icon: Icon, title, price, composition, desc, highlight, index = 0, extraContent }: any) => (
    <motion.div 
        layout="position"
        custom={index}
        variants={cardItemVariants}
        whileHover={{ scale: 1.025, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onClick={onClick}
        className={cn(
            "group relative flex flex-col items-center justify-between pt-7 pb-4 px-3 sm:pt-6 sm:pb-5 sm:px-5 md:p-6 rounded-2xl md:rounded-3xl border transition-all duration-300 cursor-pointer text-center h-full min-h-[160px] sm:min-h-[190px] md:min-h-[220px] w-full box-border backdrop-blur-md overflow-hidden",
            active 
                ? "bg-neutral-900/90 border-brand-DEFAULT shadow-[0_0_30px_rgba(220,38,38,0.2)] ring-1 ring-brand-DEFAULT/50" 
                : "bg-neutral-900/40 border-white/10 hover:border-white/25 hover:bg-neutral-900/70 hover:shadow-[0_0_20px_rgba(255,255,255,0.03)]"
        )}
    >
        {/* Tag / Ícone de Destaque "Popular" - Posicionado EXCLUSIVAMENTE à direita do card sem sobreposição */}
        {highlight && (
            <div className={cn(
                "absolute top-0 right-0 text-[8px] sm:text-[10px] md:text-[11px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 uppercase tracking-wider z-20 rounded-bl-xl sm:rounded-bl-2xl rounded-tr-2xl md:rounded-tr-3xl transition-all duration-300 flex items-center gap-1 shadow-sm",
                active 
                    ? "bg-brand-DEFAULT text-white shadow-[0_0_12px_rgba(220,38,38,0.5)]" 
                    : "bg-white/10 text-neutral-300 group-hover:bg-white/20 group-hover:text-white"
            )}>
                <Sparkles size={10} className={active ? "text-white" : "text-amber-400"} />
                <span>Popular</span>
            </div>
        )}

        {/* Botão de Ajuda / Detalhes Rápidos - Posicionado à esquerda do card */}
        {onInfo && desc && (
            <button 
              className="absolute top-2 left-2 sm:top-3 sm:left-3 text-neutral-500 hover:text-white transition-colors z-20 p-1 sm:p-1.5 hover:bg-white/10 rounded-full"
              onClick={(e) => {
                 e.stopPropagation();
                 onInfo({ title, desc, price });
              }}
              title="Ver detalhes do pacote"
            >
                <HelpCircle size={15} strokeWidth={2} className="sm:w-4 sm:h-4" />
            </button>
        )}

        {/* Indicador de Seleção Ativa (aparece nos cards sem a tag Popular) */}
        {!highlight && (
            <div className={cn(
                "absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full transition-all duration-500 z-20",
                active ? "bg-brand-DEFAULT shadow-[0_0_10px_var(--brand-glow)]" : "bg-white/10"
            )} />
        )}
        
        <div className="w-full flex flex-col items-center">
            <div className={cn(
                "p-2.5 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl mb-1.5 sm:mb-2 transition-all duration-300",
                active 
                    ? "bg-brand-DEFAULT/15 text-brand-DEFAULT shadow-[0_0_20px_rgba(220,38,38,0.25)]" 
                    : "bg-white/5 text-neutral-300 group-hover:bg-white/10 group-hover:text-white"
            )}>
                <Icon size={22} strokeWidth={1.5} className="sm:w-7 sm:h-7" />
            </div>
            
            <div className="space-y-1 text-center px-0 sm:px-1 w-full mt-1 flex flex-col items-center">
                <h4 className={cn(
                    "text-xs sm:text-sm md:text-base font-semibold whitespace-normal leading-tight break-words transition-colors duration-300", 
                    active ? "text-white" : "text-neutral-300 group-hover:text-white"
                )}>
                    {title}
                </h4>
                
                {/* DESCRIÇÃO BREVE (COMPOSIÇÃO) - SÓ APARECE QUANDO ATIVO */}
                <AnimatePresence mode="wait">
                    {active && composition && (
                        <motion.p
                            initial={{ opacity: 0, height: 0, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, height: "auto", filter: 'blur(0px)' }}
                            exit={{ opacity: 0, height: 0, filter: 'blur(4px)' }}
                            transition={{ duration: 0.3 }}
                            className="text-[11px] sm:text-xs md:text-sm text-brand-DEFAULT font-medium leading-normal pt-1"
                        >
                            {composition}
                        </motion.p>
                    )}
                </AnimatePresence>

                {/* Conteúdo Extra (Ex: Seletor Mobile vs Câmera quando ativo) */}
                {active && extraContent && (
                    <div className="w-full mt-2" onClick={(e) => e.stopPropagation()}>
                        {extraContent}
                    </div>
                )}
            </div>
        </div>

        <div className="w-full pt-2.5 sm:pt-3 border-t border-white/5 mt-2.5 sm:mt-3">
            <p className={cn("text-xs sm:text-base md:text-lg font-bold font-price tracking-wide uppercase transition-colors duration-300", active ? "text-brand-DEFAULT" : "text-neutral-400 group-hover:text-neutral-200")}>
                {price}
            </p>
        </div>
    </motion.div>
);

const AddonCard = ({ label, price, icon: Icon, active, onClick, onInfo, desc, index = 0 }: any) => (
    <motion.div 
        custom={index}
        variants={cardItemVariants}
        whileHover={{ scale: 1.025, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onClick={onClick}
        className={cn(
            "cursor-pointer flex flex-col items-center justify-center p-4 sm:p-5 md:p-6 rounded-2xl md:rounded-3xl border transition-all select-none relative gap-2 sm:gap-3 h-full group box-border backdrop-blur-md min-h-[140px] sm:min-h-[160px]", 
            active 
                ? "bg-brand-DEFAULT/15 border-brand-DEFAULT shadow-[0_0_25px_rgba(220,38,38,0.25)] ring-1 ring-brand-DEFAULT" 
                : "bg-neutral-900/40 border-white/10 hover:border-white/25 hover:bg-neutral-900/70 hover:shadow-[0_0_20px_rgba(255,255,255,0.03)]"
        )}
    >
        <button 
          className="absolute top-3 left-3 text-neutral-500 hover:text-white transition-colors z-20 p-2 hover:bg-white/5 rounded-full"
          onClick={(e) => {
             e.stopPropagation();
             if (onInfo && desc) onInfo({ title: label, desc, price: formatCurrency(price) });
          }}
        >
            <HelpCircle size={18} strokeWidth={2} />
        </button>

        <div className={cn(
            "absolute top-3 right-3 w-6 h-6 rounded-full border flex items-center justify-center transition-all", 
            active ? "bg-brand-DEFAULT border-brand-DEFAULT shadow-[0_0_10px_rgba(220,38,38,0.6)]" : "border-white/15 bg-black/30"
        )}>
            {active && <Check size={14} className="text-white" />}
        </div>

        <div className={cn(
            "p-3.5 sm:p-4 rounded-2xl mb-1 transition-all duration-300", 
            active ? "bg-white/20 text-white" : "bg-white/5 text-neutral-300 group-hover:bg-white/10 group-hover:text-white"
        )}>
           <Icon size={26} strokeWidth={1.5} className="sm:w-7 sm:h-7" />
        </div>
        
        <div className="space-y-1 text-center px-0 sm:px-1 w-full">
            <p className={cn("text-xs sm:text-sm md:text-base font-semibold whitespace-normal leading-tight break-words", active ? "text-white" : "text-neutral-200")}>{label}</p>
            <p className="text-xs sm:text-sm text-brand-DEFAULT font-bold font-price bg-brand-DEFAULT/10 py-1 px-3 rounded-full inline-block mt-1.5 whitespace-nowrap">
                + {formatCurrency(price)}
            </p>
        </div>
    </motion.div>
);

export default UpsellList;
