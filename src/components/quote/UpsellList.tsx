
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Video, Gift, Crown, GraduationCap, Heart, 
  Store, Aperture, Plane, Clock, Minus, Plus, Route, Star, 
  Edit, Smartphone as SmartphoneIcon, Sparkles, Gem, HelpCircle, X, MessageCircle, Hand, Check, Timer
} from 'lucide-react';

import { cn, formatCurrency } from '../../lib/utils';
import { fadeInUp, staggerContainer, modalVariants } from '../../lib/animations';
import { ServiceCategory, ServiceId } from '../../types';
import AnimatedNumber from '../ui/AnimatedNumber';
import { AppConfig } from '../../config/AppConfig';
import Button from '../ui/Button';

interface UpsellListProps {
  category: ServiceCategory;
  setCategory: (c: ServiceCategory) => void;
  serviceId: ServiceId;
  setServiceId: (s: ServiceId) => void;
  hours: number;
  setHours: (h: number) => void;
  qty: number;
  setQty: (q: number) => void;
  addDrone: boolean;
  setAddDrone: (b: boolean) => void;
  addRealTime: boolean;
  setAddRealTime: (b: boolean) => void;
  distance: number;
  pricePerKm: number;
  locationClient: string;
  onOpenMap?: () => void;
  selectionMode?: 'duration' | 'quantity';
  setSelectionMode?: (mode: 'duration' | 'quantity') => void;
  viewMode?: 'categories' | 'services' | 'config';
  isQuickMode?: boolean; // Nova prop
}

const UpsellList: React.FC<UpsellListProps> = (props) => {
  const { 
    category, setCategory, serviceId, setServiceId,
    hours, setHours, qty, setQty, addDrone, setAddDrone, addRealTime, setAddRealTime,
    distance, pricePerKm, locationClient, onOpenMap, selectionMode, setSelectionMode,
    viewMode = 'categories',
    isQuickMode = false
  } = props;

  const [infoData, setInfoData] = useState<{ title: string; desc: string; price: string } | null>(null);

  // === READ FROM APP CONFIG ===
  const TABLE = AppConfig.PRICING_TABLE;

  const categories = [
    { id: 'wedding', label: 'Casamento', icon: Heart },
    { id: 'social', label: 'Social', icon: Gift },
    { id: 'commercial', label: 'Comercial', icon: Store },
    { id: 'studio', label: 'Estúdio', icon: Aperture },
    { id: 'video_production', label: 'Freelancer', icon: Video },
    { id: 'custom', label: 'Outros', icon: Star },
  ];

  const handleServiceSelect = (id: ServiceId, mode: 'duration' | 'quantity' = 'duration') => {
    setServiceId(id);
    if (setSelectionMode) setSelectionMode(mode);
    
    // Smart Defaults (UX)
    if (id === 'comm_photo') setQty(20);
    else if (id === 'comm_video') setQty(1);
    else if (id === 'studio_photo') setQty(8);
    else if (category === 'social') setQty(10);
  };

  // === VISIBILITY LOGIC ===
  // Alteração: Removemos 'video_production' daqui para que Cam/Mobile/Drone não mostrem relógio
  const showDuration = (category === 'social' && serviceId !== 'graduation' && selectionMode === 'duration') ||
                       (category === 'studio' && selectionMode === 'duration');
  
  // Alteração: comm_combo não mostra quantidade pois é um pacote fixo
  const showQuantity = (category === 'commercial' && serviceId !== 'comm_combo') || 
                       (category === 'social' && serviceId !== 'graduation' && selectionMode === 'quantity') ||
                       (category === 'studio' && selectionMode === 'quantity') ||
                       (category === 'video_production' && serviceId === 'edit_only');
  
  const canChooseMode = category === 'social' && serviceId !== 'graduation';
  
  // Alteração: 'custom' removido da lista de isenção para permitir cálculo de frete se o usuário escolher local
  const isNoTravelCost = category === 'studio' || serviceId === 'edit_only';
  const travelCost = isNoTravelCost ? 0 : distance * 2 * pricePerKm;

  // Lógica de Mínimo
  let minQty = 1;
  if (category === 'studio' && serviceId === 'studio_photo') minQty = 8;
  if (category === 'social') minQty = 10;

  // Renderização Condicional baseada no viewMode
  return (
    <section className="w-full max-w-4xl mx-auto">
      
      {/* === STEP 1: CATEGORY SELECTION === */}
      {viewMode === 'categories' && (
        <div className="space-y-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* MOBILE GRID ADJUSTMENT: Grid responsivo com aspect-square */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 relative px-2">
                {categories.map((cat) => {
                    const isActive = category === cat.id;
                    const Icon = cat.icon;
                    return (
                        <motion.button
                            key={cat.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCategory(cat.id as ServiceCategory)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-2 md:gap-3 rounded-2xl transition-all duration-300 border w-full aspect-square",
                                isActive 
                                    ? "bg-brand-DEFAULT border-brand-DEFAULT text-white shadow-[0_0_25px_var(--brand-glow)]" 
                                    : "bg-white/5 border-white/5 text-neutral-400 hover:border-white/20 hover:text-white hover:bg-white/10"
                            )}
                        >
                            <Icon size={28} className={cn("md:w-8 md:h-8", isActive ? "text-white" : "text-neutral-500")} />
                            <span className="text-[9px] md:text-xs font-bold uppercase tracking-widest truncate w-full px-1">{cat.label}</span>
                        </motion.button>
                    )
                })}
            </div>
            
             <motion.div 
                key={category} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 p-4 md:p-6 rounded-xl border border-white/10 max-w-lg mx-auto"
            >
                <p className="text-neutral-300 font-serif italic text-base md:text-lg">
                    "{AppConfig.TEXTS.CATEGORY_DESCRIPTIONS[category]}"
                </p>
            </motion.div>
        </div>
      )}

      {/* === STEP 2: SERVICE SELECTION === */}
      {viewMode === 'services' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
             
             {/* Modo de Seleção (Se aplicável) - VISUAL REFORÇADO */}
             {canChooseMode && setSelectionMode && (
                <div className="flex flex-col items-center mb-10">
                    <p className="text-center text-[10px] uppercase tracking-widest text-brand-DEFAULT mb-3 font-bold">
                        Como deseja contratar?
                    </p>
                    <div className="flex bg-neutral-900 p-2 rounded-2xl border border-white/10 shadow-lg">
                        <button 
                            onClick={() => setSelectionMode('duration')} 
                            className={cn(
                                "px-6 py-4 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-3 w-40 justify-center", 
                                selectionMode === 'duration' 
                                    ? "bg-white text-black shadow-lg scale-105 z-10" 
                                    : "text-neutral-500 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Clock size={18} className={selectionMode === 'duration' ? "text-brand-DEFAULT" : ""} /> 
                            POR TEMPO
                        </button>
                        <button 
                            onClick={() => setSelectionMode('quantity')} 
                            className={cn(
                                "px-6 py-4 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-3 w-40 justify-center", 
                                selectionMode === 'quantity' 
                                    ? "bg-white text-black shadow-lg scale-105 z-10" 
                                    : "text-neutral-500 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Camera size={18} className={selectionMode === 'quantity' ? "text-brand-DEFAULT" : ""} /> 
                            POR FOTO
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                 {/* Wedding Options */}
                 {category === 'wedding' && (
                    <>
                        <ServiceCard active={serviceId === 'wedding_base'} onClick={() => handleServiceSelect('wedding_base')} onInfo={setInfoData} icon={Heart} title={TABLE.wedding.wedding_base.label} price={formatCurrency(TABLE.wedding.wedding_base.base)} composition={TABLE.wedding.wedding_base.composition} desc={TABLE.wedding.wedding_base.description} />
                        <ServiceCard active={serviceId === 'wedding_classic'} onClick={() => handleServiceSelect('wedding_classic')} onInfo={setInfoData} icon={Sparkles} title={TABLE.wedding.wedding_classic.label} price={formatCurrency(TABLE.wedding.wedding_classic.base)} composition={TABLE.wedding.wedding_classic.composition} desc={TABLE.wedding.wedding_classic.description} />
                        <ServiceCard active={serviceId === 'wedding_romance'} onClick={() => handleServiceSelect('wedding_romance')} onInfo={setInfoData} icon={Hand} title={TABLE.wedding.wedding_romance.label} price={formatCurrency(TABLE.wedding.wedding_romance.base)} composition={TABLE.wedding.wedding_romance.composition} desc={TABLE.wedding.wedding_romance.description} highlight />
                        <ServiceCard active={serviceId === 'wedding_essence'} onClick={() => handleServiceSelect('wedding_essence')} onInfo={setInfoData} icon={Gem} title={TABLE.wedding.wedding_essence.label} price={formatCurrency(TABLE.wedding.wedding_essence.base)} composition={TABLE.wedding.wedding_essence.composition} desc={TABLE.wedding.wedding_essence.description} highlight />
                    </>
                )}

                {/* Social Options */}
                {category === 'social' && (
                    <>
                        <ServiceCard active={serviceId === 'birthday'} onClick={() => handleServiceSelect('birthday')} onInfo={setInfoData} icon={Gift} title={TABLE.social.birthday.label} price="A partir de R$ 400" composition={TABLE.social.birthday.composition} desc={TABLE.social.birthday.description} />
                        <ServiceCard active={serviceId === 'fifteen'} onClick={() => handleServiceSelect('fifteen')} onInfo={setInfoData} icon={Crown} title={TABLE.social.fifteen.label} price="A partir de R$ 450" composition={TABLE.social.fifteen.composition} desc={TABLE.social.fifteen.description} />
                        <ServiceCard active={serviceId === 'graduation'} onClick={() => handleServiceSelect('graduation')} onInfo={setInfoData} icon={GraduationCap} title={TABLE.social.graduation.label} price={formatCurrency(TABLE.social.graduation.base)} composition={TABLE.social.graduation.composition} desc={TABLE.social.graduation.description} />
                    </>
                )}

                {/* Commercial Options */}
                {category === 'commercial' && (
                    <>
                        <ServiceCard active={serviceId === 'comm_photo'} onClick={() => handleServiceSelect('comm_photo', 'quantity')} onInfo={setInfoData} icon={Camera} title={TABLE.commercial.photo.label} price={`R$ ${TABLE.commercial.photo.unit}/un`} composition={TABLE.commercial.photo.composition} desc={TABLE.commercial.photo.description} />
                        <ServiceCard active={serviceId === 'comm_video'} onClick={() => handleServiceSelect('comm_video', 'quantity')} onInfo={setInfoData} icon={Video} title={TABLE.commercial.video.label} price={`R$ ${TABLE.commercial.video.unit}/un`} composition={TABLE.commercial.video.composition} desc={TABLE.commercial.video.description} />
                        <ServiceCard active={serviceId === 'comm_combo'} onClick={() => handleServiceSelect('comm_combo', 'quantity')} onInfo={setInfoData} icon={Star} title={TABLE.commercial.combo.label} price={formatCurrency(TABLE.commercial.combo.videoBase)} composition={TABLE.commercial.combo.composition} desc={TABLE.commercial.combo.description} highlight />
                    </>
                )}

                {/* Studio Options */}
                {category === 'studio' && (
                    <>
                        <ServiceCard active={serviceId === 'studio_photo'} onClick={() => handleServiceSelect('studio_photo', 'quantity')} onInfo={setInfoData} icon={Aperture} title={TABLE.studio.photo.label} price={`R$ ${TABLE.studio.photo.unit}/un`} composition={TABLE.studio.photo.composition} desc={TABLE.studio.photo.description} />
                        <ServiceCard active={serviceId === 'studio_video'} onClick={() => handleServiceSelect('studio_video', 'duration')} onInfo={setInfoData} icon={Video} title={TABLE.studio.video.label} price={formatCurrency(TABLE.studio.video.base)} composition={TABLE.studio.video.composition} desc={TABLE.studio.video.description} />
                    </>
                )}

                {/* Production Options */}
                {category === 'video_production' && (
                    <>
                        <ServiceCard active={serviceId === 'edit_only'} onClick={() => handleServiceSelect('edit_only', 'quantity')} onInfo={setInfoData} icon={Edit} title={TABLE.video_production.edit.label} price={`R$ ${TABLE.video_production.edit.unit}`} composition={TABLE.video_production.edit.composition} desc={TABLE.video_production.edit.description} />
                        <ServiceCard active={serviceId === 'cam_cap'} onClick={() => handleServiceSelect('cam_cap', 'duration')} onInfo={setInfoData} icon={Video} title={TABLE.video_production.cam_cap.label} price={formatCurrency(TABLE.video_production.cam_cap.fixed)} composition={TABLE.video_production.cam_cap.composition} desc={TABLE.video_production.cam_cap.description} />
                        <ServiceCard active={serviceId === 'mobile_cap'} onClick={() => handleServiceSelect('mobile_cap', 'duration')} onInfo={setInfoData} icon={SmartphoneIcon} title={TABLE.video_production.mobile_cap.label} price={formatCurrency(TABLE.video_production.mobile_cap.fixed)} composition={TABLE.video_production.mobile_cap.composition} desc={TABLE.video_production.mobile_cap.description} />
                        <ServiceCard active={serviceId === 'drone'} onClick={() => handleServiceSelect('drone', 'duration')} onInfo={setInfoData} icon={Plane} title={TABLE.video_production.drone.label} price={formatCurrency(TABLE.video_production.drone.fixed)} composition={TABLE.video_production.drone.composition} desc={TABLE.video_production.drone.description} />
                    </>
                )}

                {/* Custom Option */}
                {category === 'custom' && (
                    <motion.div variants={fadeInUp} className="col-span-1 md:col-span-3 bg-white/5 border border-white/10 p-10 rounded-2xl text-center backdrop-blur-sm flex flex-col items-center">
                        <Star className="mx-auto text-brand-DEFAULT mb-4" size={32} />
                        <h3 className="font-serif text-xl text-white mb-2">Projeto Personalizado</h3>
                        <p className="text-neutral-400 mb-6">Descreva sua necessidade específica no WhatsApp após finalizar ou entre em contato agora.</p>
                        
                        <a 
                            href={`https://api.whatsapp.com/send?phone=${AppConfig.BRAND.WHATSAPP}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            <Button variant="primary" size="md" className="flex items-center gap-2">
                                <MessageCircle size={18} />
                                Falar no WhatsApp
                            </Button>
                        </a>
                    </motion.div>
                )}
            </div>
        </div>
      )}

      {/* === STEP 3: CONFIGURATION (DETAILS) === */}
      {viewMode === 'config' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col items-center">
            
            {/* 1. QUANTITY / DURATION CONTROLS */}
            <AnimatePresence mode="wait">
                {showDuration && (
                    <motion.div 
                        key="duration"
                        variants={fadeInUp} initial="hidden" animate="visible" exit="hidden"
                        className="w-full max-w-lg bg-neutral-900/40 p-8 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col items-center text-center backdrop-blur-xl relative overflow-hidden"
                    >
                         <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-DEFAULT/50 to-transparent" />
                        
                        <div className="flex items-center gap-3 mb-6">
                             <Clock className="text-brand-DEFAULT" size={18} />
                             <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Tempo de Cobertura</h3>
                        </div>

                        <div className="flex items-center justify-between w-full gap-8 px-4">
                            <ControlBtn onClick={() => setHours(Math.max(2, hours - 1))} icon={Minus} />
                            <div className="text-center">
                                <span className="block text-5xl font-serif text-white tracking-tighter mb-1 drop-shadow-lg">
                                    <AnimatedNumber value={hours} />
                                </span>
                                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.4em]">Horas</span>
                            </div>
                            <ControlBtn onClick={() => setHours(hours + 1)} icon={Plus} active />
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

                        <div className="flex items-center gap-3 mb-6">
                             <Camera className="text-brand-DEFAULT" size={18} />
                             <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Quantidade</h3>
                        </div>

                        <div className="flex items-center justify-between w-full gap-8 px-4">
                            <ControlBtn onClick={() => setQty(Math.max(minQty, qty - 1))} icon={Minus} />
                            <div className="text-center">
                                <span className="block text-5xl font-serif text-white tracking-tighter mb-1 drop-shadow-lg">
                                    <AnimatedNumber value={qty} />
                                </span>
                                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.4em]">Unidades</span>
                            </div>
                            <ControlBtn onClick={() => setQty(qty + 1)} icon={Plus} active />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 2. ADDONS (Drone / RealTime) */}
            {(category === 'wedding' || category === 'social' || category === 'commercial') && (
                <motion.div variants={fadeInUp} className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AddonCard 
                        label="Drone (Aéreo)" 
                        price={250} 
                        icon={Plane} 
                        active={addDrone} 
                        onClick={() => setAddDrone(!addDrone)} 
                    />
                    <AddonCard 
                        label="Fotos Tempo Real" 
                        price={600} 
                        icon={Timer} 
                        active={addRealTime} 
                        onClick={() => setAddRealTime(!addRealTime)} 
                    />
                </motion.div>
            )}

            {/* 3. LOGISTICS */}
            {!isNoTravelCost && (
                <motion.div 
                    variants={fadeInUp} 
                    onClick={onOpenMap} 
                    className="w-full max-w-lg border border-white/5 bg-white/[0.02] flex items-center justify-between cursor-pointer group hover:bg-white/[0.05] rounded-xl p-4 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-full text-brand-DEFAULT group-hover:bg-brand-DEFAULT group-hover:text-white transition-colors">
                            <Route size={20} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] uppercase tracking-widest text-neutral-500">Logística</p>
                            <p className="text-white text-sm font-medium mt-0.5 truncate max-w-[180px]">
                                {isQuickMode && distance === 0 ? "A definir" : (locationClient || "Selecionar Local")}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                         <p className="text-neutral-400 text-xs">
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
      <AnimatePresence>
        {infoData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => setInfoData(null)}
             />
             <motion.div 
                variants={modalVariants} initial="hidden" animate="visible" exit="exit"
                className="relative bg-neutral-900 border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
             >
                <button 
                  onClick={() => setInfoData(null)}
                  className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
                
                <h3 className="text-2xl font-serif text-white mb-4">{infoData.title}</h3>
                <div className="w-12 h-0.5 bg-brand-DEFAULT mx-auto mb-6" />
                <p className="text-neutral-300 leading-relaxed font-light text-sm mb-8 text-left">
                    {infoData.desc}
                    <br/><br/>
                    <span className="text-neutral-500 text-xs block text-center mt-4">Inclui suporte completo e equipamentos profissionais da EAREC.</span>
                </p>
                <div className="bg-white/5 py-2 px-4 rounded-full inline-block border border-white/5">
                    <span className="text-brand-DEFAULT font-bold">{infoData.price}</span>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};

// === SUB-COMPONENTS ===

const ControlBtn = ({ onClick, icon: Icon, active }: any) => (
  <motion.button 
      whileHover={{ scale: 1.1, backgroundColor: active ? "var(--brand-color)" : "rgba(255,255,255,0.1)" }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick} 
      className={cn(
        "w-12 h-12 flex items-center justify-center rounded-full transition-colors border",
        active ? "bg-white/5 border-white/10 text-white" : "bg-transparent border-white/5 text-neutral-500"
      )}
  >
      <Icon size={20}/>
  </motion.button>
);

const ServiceCard = ({ active, onClick, onInfo, icon: Icon, title, price, composition, desc, highlight }: any) => (
    <motion.div 
        variants={fadeInUp}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        onClick={onClick}
        className={cn(
            "cursor-pointer p-4 md:p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center gap-3 md:gap-4 relative overflow-hidden group h-full min-h-[180px] md:min-h-[220px] justify-between", 
            active 
                ? "bg-brand-DEFAULT/5 border-brand-DEFAULT shadow-[0_0_20px_var(--brand-glow)] z-10" 
                : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
        )}
    >
        {highlight && (
            <div className={cn(
                "absolute top-0 right-0 text-[8px] md:text-[9px] font-bold px-2 md:px-3 py-1 rounded-bl-lg uppercase tracking-widest",
                active ? "bg-brand-DEFAULT text-white" : "bg-white/5 text-neutral-500"
            )}>
                Popular
            </div>
        )}

        <button 
          className="absolute top-3 left-3 text-neutral-600 hover:text-white transition-colors z-20 p-1.5 hover:bg-white/5 rounded-full"
          onClick={(e) => {
             e.stopPropagation();
             // Aqui passamos a 'desc' completa para o modal de info
             if (onInfo) onInfo({ title, desc, price });
          }}
        >
            <HelpCircle size={16} strokeWidth={2} />
        </button>
        
        <div className={cn(
            "mt-2 transition-all duration-300 group-hover:scale-110",
            active ? "text-brand-DEFAULT" : "text-neutral-500 group-hover:text-white"
        )}>
            <Icon size={28} strokeWidth={1.5} className="md:w-8 md:h-8" />
        </div>
        
        <div className="space-y-1 w-full">
            <h4 className={cn("text-base md:text-lg font-serif transition-colors", active ? "text-white" : "text-neutral-300 group-hover:text-white")}>
                {title}
            </h4>
            {/* Aqui usamos 'composition' se existir, ou 'desc' como fallback */}
            <p className="text-[10px] md:text-[11px] text-neutral-500 leading-relaxed font-light tracking-wide">
                {composition || desc}
            </p>
        </div>

        <div className="w-full pt-3 border-t border-white/5 mt-auto">
            <p className={cn("text-xs font-bold tracking-widest uppercase", active ? "text-brand-DEFAULT" : "text-neutral-400")}>
                {price}
            </p>
        </div>
    </motion.div>
);

const AddonCard = ({ label, price, icon: Icon, active, onClick }: any) => (
    <div 
        onClick={onClick}
        className={cn(
            "cursor-pointer flex items-center justify-between p-4 rounded-xl border transition-all select-none",
            active ? "bg-brand-DEFAULT/10 border-brand-DEFAULT/50" : "bg-white/5 border-white/5 hover:bg-white/10"
        )}
    >
        <div className="flex items-center gap-3">
             <div className={cn("p-2 rounded-lg", active ? "bg-brand-DEFAULT text-white" : "bg-white/5 text-neutral-500")}>
                <Icon size={18} />
             </div>
             <div>
                 <p className={cn("text-xs font-medium", active ? "text-white" : "text-neutral-300")}>{label}</p>
                 <p className="text-[10px] text-brand-DEFAULT font-bold">+ {formatCurrency(price)}</p>
             </div>
        </div>
        <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center", active ? "bg-brand-DEFAULT border-brand-DEFAULT" : "border-white/20")}>
            {active && <Check size={12} className="text-white" />}
        </div>
    </div>
);

export default UpsellList;
