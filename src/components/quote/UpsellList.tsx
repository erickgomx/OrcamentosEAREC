
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Video, Gift, Crown, GraduationCap, Heart, 
  Store, Aperture, Plane, Clock, Zap, Minus, Plus, Route, Star, CircleHelp, X, MessageCircle, Hand
} from 'lucide-react';
import { formatCurrency, cn } from '../../lib/utils';
import { fadeInUp, staggerContainer } from '../../lib/animations';
import { ServiceCategory, ServiceId } from '../../types';
import AnimatedNumber from '../ui/AnimatedNumber';

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
}

/**
 * Componente Visual de Dica de Clique (Mãozinha + Ripple)
 */
const ClickHint = ({ delay = 0, className }: { delay?: number, className?: string }) => (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={cn("absolute z-50 pointer-events-none flex items-center justify-center", className)}
    >
        {/* Onda (Ripple) */}
        <motion.div
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: delay }}
            className="absolute w-8 h-8 bg-white/30 rounded-full"
        />
        {/* Mãozinha */}
        <motion.div
            animate={{ y: [0, -10, 0], scale: [1, 0.9, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: delay }}
        >
            <Hand className="text-white fill-white/20 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] rotate-[-15deg]" size={32} />
        </motion.div>
    </motion.div>
);

const UpsellList: React.FC<UpsellListProps> = ({ 
  category, setCategory,
  serviceId, setServiceId,
  hours, setHours,
  qty, setQty,
  addDrone, setAddDrone,
  addRealTime, setAddRealTime,
  distance,
  pricePerKm,
  locationClient
}) => {

  const categories = [
    { id: 'social', label: 'Eventos Sociais', icon: Crown },
    { id: 'commercial', label: 'Comercial', icon: Store },
    { id: 'studio', label: 'Estúdio', icon: Aperture },
    { id: 'video_production', label: 'Produção', icon: Video },
    { id: 'custom', label: 'Personalizado', icon: Star, highlight: true },
  ];

  const isNoTravelCost = category === 'studio' || category === 'custom';
  const travelCost = isNoTravelCost ? 0 : distance * 2 * pricePerKm;
  const whatsappNumber = "5584981048857";

  // Estado que controla se as dicas visuais devem aparecer
  const [showTutorial, setShowTutorial] = useState(true);

  // Função centralizada para desligar o tutorial em QUALQUER interação
  const handleInteraction = () => {
    if (showTutorial) setShowTutorial(false);
  };

  // Garante que o tutorial suma se a categoria mudar (mesmo que programaticamente)
  useEffect(() => {
    if (category !== 'social') setShowTutorial(false);
  }, [category]);

  // Lógica para mostrar o controle de horas
  // Exibe se for (Social E Aniversário/15anos) OU (Estúdio E Vídeo)
  const showHoursControl = (
    (category === 'social' && (serviceId === 'birthday' || serviceId === 'fifteen')) || 
    (category === 'studio' && serviceId === 'studio_video')
  );

  return (
    <section id="configurator" className="pt-4 pb-12 px-4 md:px-8 bg-neutral-900/30 min-h-screen" onClick={handleInteraction}>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* === 1. NAVEGAÇÃO POR ABAS (TABS) === */}
        <div className="relative z-20 text-center">
            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-4">Qual a ocasião do serviço?</p>
            
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 relative">
                {categories.map((cat) => {
                    const isActive = category === cat.id;
                    const Icon = cat.icon;
                    return (
                        <div key={cat.id} className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Evita bubble duplicado
                                    setCategory(cat.id as ServiceCategory);
                                    handleInteraction();
                                }}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 rounded-lg transition-all text-sm md:text-base font-medium flex-1 md:flex-none justify-center whitespace-nowrap relative z-10",
                                    isActive 
                                        ? cn("bg-brand-DEFAULT text-white shadow-lg shadow-brand-DEFAULT/20", cat.id !== 'custom' && "border-2 border-white") 
                                        : "text-neutral-400 hover:text-white hover:bg-white/5",
                                    cat.highlight && !isActive && "text-brand-DEFAULT hover:bg-brand-DEFAULT/10 border border-brand-DEFAULT/20"
                                )}
                            >
                                <Icon size={18} className="shrink-0" />
                                <span className="hidden sm:inline">{cat.label}</span>
                                <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
                            </button>

                            {/* HINT 1: Incentivo ao toque no MENU (Sobre a aba 'Comercial' para sugerir troca) */}
                            <AnimatePresence>
                                {showTutorial && category === 'social' && cat.id === 'commercial' && (
                                    <ClickHint className="-top-1 left-1/2 -translate-x-1/2" />
                                )}
                            </AnimatePresence>
                        </div>
                    )
                })}
            </div>
        </div>

        {/* Container dos Cards */}
        <motion.div 
            key={category}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8 relative"
        >
            
            {/* === 2. GRID DE SERVIÇOS === */}
            
            {/* CATEGORIA: SOCIAL */}
            {category === 'social' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <motion.div variants={fadeInUp}>
                        <ServiceCard 
                            active={serviceId === 'birthday'} 
                            onClick={() => { setServiceId('birthday'); handleInteraction(); }}
                            icon={Gift} title="Aniversário / Chá" price="R$ 400 (2h)"
                            desc="Cobertura completa dos parabéns e decoração."
                            details="Inclui 2 horas de cobertura fotográfica. Todas as fotos tratadas entregues via link. Ideal para Chá Revelação e Mesversário."
                        />
                    </motion.div>
                    
                    <motion.div variants={fadeInUp} className="relative">
                        <ServiceCard 
                            active={serviceId === 'fifteen'} 
                            onClick={() => { setServiceId('fifteen'); handleInteraction(); }}
                            icon={Crown} title="15 Anos" price="R$ 400 (2h)"
                            desc="Registro especial do debut."
                            details="Foco na debutante, recepção e valsa. Inclui 2 horas de cobertura base. Fotos ilimitadas durante o período contratado."
                        />
                        {/* REMOVIDO: Hint sobre o card de 15 anos/aniversário */}
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                        <ServiceCard 
                            active={serviceId === 'graduation'} 
                            onClick={() => { setServiceId('graduation'); handleInteraction(); }}
                            icon={GraduationCap} title="Formatura" price="R$ 800 (Fixo)"
                            details="Cobertura do evento de colação ou baile. Valor fechado para o evento."
                        />
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                        <ServiceCard 
                            active={serviceId === 'wedding_base'} 
                            onClick={() => { setServiceId('wedding_base'); handleInteraction(); }}
                            icon={Heart} title="Casamento (Base)" price="R$ 650"
                            desc="Cerimônia + Decoração + Convidados"
                            details="Cobertura essencial do casamento. Inclui fotos protocolares e cerimônia."
                        />
                    </motion.div>
                    
                    {/* Sub-seção: Pacotes Especiais */}
                    <motion.div variants={fadeInUp} className="md:col-span-2 pt-4">
                        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3 ml-1">Pacotes de Casamento</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <ServiceCard 
                                active={serviceId === 'wedding_classic'} onClick={() => { setServiceId('wedding_classic'); handleInteraction(); }}
                                title="Clássico" price="R$ 900"
                                desc="Pré-Wedding + Casamento"
                                details="O pacote essencial. Inclui ensaio Pré-Wedding (externo) e a cobertura completa do evento."
                                highlight
                            />
                            <ServiceCard 
                                active={serviceId === 'wedding_romance'} onClick={() => { setServiceId('wedding_romance'); handleInteraction(); }}
                                title="Romance" price="R$ 1.150"
                                desc="Pré + Making Off + Casamento"
                                details="Pacote intermediário. Acrescenta a cobertura do Making Of da noiva/noivo."
                                highlight
                            />
                            <ServiceCard 
                                active={serviceId === 'wedding_essence'} onClick={() => { setServiceId('wedding_essence'); handleInteraction(); }}
                                title="Essência" price="R$ 1.750"
                                desc="Pré + MkOff + Casamento + Vídeo"
                                details="A experiência completa EAREC. Tudo do pacote Romance + cobertura de VÍDEO cinematográfico."
                                highlight
                            />
                        </div>
                    </motion.div>
                </div>
            )}

            {/* CATEGORIA: COMERCIAL */}
            {category === 'commercial' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    <motion.div variants={fadeInUp}><ServiceCard 
                        active={serviceId === 'comm_photo'} onClick={() => setServiceId('comm_photo')}
                        icon={Camera} title="Fotografia" price="R$ 20 / foto"
                        desc="Para lojas e gastronomia."
                        details="Valor por foto tratada. Ideal para e-commerce, cardápios e lookbooks."
                    /></motion.div>
                    <motion.div variants={fadeInUp}><ServiceCard 
                        active={serviceId === 'comm_video'} onClick={() => setServiceId('comm_video')}
                        icon={Video} title="Vídeo" price="R$ 500"
                        desc="Captação + Edição (até 1min)."
                        details="Produção de vídeo institucional ou promocional (Reels/TikTok) de até 1 minuto."
                    /></motion.div>
                    <motion.div variants={fadeInUp}><ServiceCard 
                        active={serviceId === 'comm_combo'} onClick={() => setServiceId('comm_combo')}
                        icon={Zap} title="Combo Visual" price="Vídeo + Fotos"
                        desc="Foto + Vídeo (até 1min)"
                        details="O pacote completo para redes sociais. Inclui a produção do vídeo comercial E as fotos."
                        highlight
                    /></motion.div>
                </div>
            )}

            {/* CATEGORIA: ESTÚDIO */}
            {category === 'studio' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <motion.div variants={fadeInUp}><ServiceCard 
                        active={serviceId === 'studio_photo'} onClick={() => setServiceId('studio_photo')}
                        icon={Camera} 
                        title="Ensaio em Estúdio (Imagens Tratadas)" 
                        price="R$ 25 / foto"
                        details="Sessão fotográfica em ambiente controlado. Iluminação profissional."
                    /></motion.div>
                    <motion.div variants={fadeInUp}><ServiceCard 
                        active={serviceId === 'studio_video'} onClick={() => setServiceId('studio_video')}
                        icon={Video} title="Vídeo em Estúdio" price="R$ 350 (2h)"
                        details="Gravação de conteúdo em estúdio (ex: Cursos, Youtube, Entrevistas)."
                    /></motion.div>
                </div>
            )}

            {/* CATEGORIA: PRODUÇÃO */}
            {category === 'video_production' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <motion.div variants={fadeInUp}><ServiceCard 
                        active={serviceId === 'edit_only'} onClick={() => setServiceId('edit_only')}
                        icon={Zap} title="Apenas Edição" price="R$ 250 / vídeo"
                        details="Você envia o material bruto, nós editamos. Cortes, transições, correção de cor."
                    /></motion.div>
                    <motion.div variants={fadeInUp}><ServiceCard 
                        active={serviceId === 'cam_cap'} onClick={() => setServiceId('cam_cap')}
                        icon={Video} title="Captação Câmera" price="R$ 350"
                        details="Operador de câmera profissional com equipamento de cinema (4K)."
                    /></motion.div>
                    <motion.div variants={fadeInUp}><ServiceCard 
                        active={serviceId === 'mobile_cap'} onClick={() => setServiceId('mobile_cap')}
                        icon={SmartphoneIcon} title="Captação Celular" price="R$ 250"
                        details="Captação ágil com iPhone de última geração."
                    /></motion.div>
                    <motion.div variants={fadeInUp}><ServiceCard 
                        active={serviceId === 'drone'} onClick={() => setServiceId('drone')}
                        icon={Plane} title="Drone" price="R$ 250"
                        details="Imagens aéreas em 4K. Operador licenciado."
                    /></motion.div>
                </div>
            )}

            {/* CATEGORIA: PERSONALIZADO */}
            {category === 'custom' && (
                <motion.div variants={fadeInUp} className="bg-white/5 border border-white/10 p-8 rounded-xl text-center group transition-colors hover:border-white/20">
                    <motion.div
                        animate={{ 
                            scale: [1, 1.1, 1], 
                            opacity: [0.7, 1, 0.7] 
                        }}
                        transition={{ 
                            duration: 4, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                        }}
                    >
                        <Star size={48} className="text-red-600 mx-auto mb-4 fill-red-600/20" />
                    </motion.div>
                    <h3 className="text-2xl font-serif text-neutral-200 mb-2">Orçamento Personalizado</h3>
                    <p className="text-neutral-500 mb-6 max-w-lg mx-auto text-sm">
                        Projetos únicos exigem soluções sob medida.
                    </p>
                    <a 
                        href={`https://wa.me/${whatsappNumber}?text=Olá, gostaria de um orçamento personalizado.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-full transition-colors font-medium text-sm border border-white/10"
                    >
                        <MessageCircle size={16} />
                        Fale conosco clicando aqui
                    </a>
                </motion.div>
            )}


            {/* === 3. CONTROLES QUANTITATIVOS (CONDICIONAIS) === */}
            
            {showHoursControl && (
                <motion.div variants={fadeInUp} className="bg-white/5 p-8 rounded-xl border border-white/10 flex flex-col items-center">
                    <div className="flex items-center gap-2 text-white mb-6">
                        <Clock className="text-brand-DEFAULT" />
                        <span className="font-serif text-xl">Duração do Evento</span>
                    </div>
                    
                    <span className="text-7xl font-sans font-bold text-white mb-2 tracking-tighter">
                        <AnimatedNumber value={hours} /><span className="text-2xl text-neutral-500 ml-1 font-normal">h</span>
                    </span>
                    <p className="text-sm text-neutral-400 mb-8">Tempo total de cobertura</p>

                    <div className="flex items-center gap-6 w-full max-w-xs justify-center">
                        <button onClick={() => { setHours(Math.max(2, hours - 1)); handleInteraction(); }} className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Minus size={24} /></button>
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden min-w-[50px]">
                            <div className="h-full bg-brand-DEFAULT transition-all" style={{ width: `${(hours / 10) * 100}%` }} />
                        </div>
                        <button onClick={() => { setHours(hours + 1); handleInteraction(); }} className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Plus size={24} /></button>
                    </div>
                    <p className="text-xs text-neutral-500 mt-6 bg-black/30 px-3 py-1 rounded-full text-center">Incluso 2h base. +R$ 250/h extra.</p>
                </motion.div>
            )}

            {(
                (category === 'commercial' && (serviceId === 'comm_photo' || serviceId === 'comm_combo')) || 
                serviceId === 'studio_photo' || 
                serviceId === 'edit_only'
             ) && (
                <motion.div variants={fadeInUp} className="bg-white/5 p-8 rounded-xl border border-white/10 flex flex-col items-center shadow-2xl">
                    <div className="flex items-center gap-2 text-white mb-6">
                        <Camera className="text-brand-DEFAULT" />
                        <span className="font-serif text-xl">Quantidade de {serviceId === 'edit_only' ? 'Vídeos' : 'Fotos'}</span>
                    </div>
                    
                    <div className="relative mb-8">
                        <span className="text-8xl font-sans font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            <AnimatedNumber value={qty} />
                        </span>
                        <span className="absolute -right-8 top-2 text-lg text-neutral-500 font-medium">und</span>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-8 w-full max-w-sm justify-center">
                        <button 
                            onClick={() => {
                                // Lógica Condicional: Se for Produção (edit_only), step é 1. Se não, 5.
                                const step = category === 'video_production' ? 1 : 5;
                                // ATUALIZADO: Mínimo de 10 para Estúdio (studio_photo)
                                const minLimit = serviceId === 'studio_photo' ? 10 : 1;
                                
                                setQty(Math.max(minLimit, qty - step));
                                handleInteraction();
                            }} 
                            className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-brand-DEFAULT hover:border-brand-DEFAULT transition-all group shrink-0"
                        >
                            <Minus size={24} className="text-neutral-400 group-hover:text-white" />
                        </button>
                        
                        <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden min-w-[60px]">
                            <motion.div 
                                layout 
                                className="h-full bg-gradient-to-r from-brand-DEFAULT/50 to-brand-DEFAULT" 
                                style={{ width: `${Math.min(100, (qty / 100) * 100)}%` }} 
                            />
                        </div>

                        <button 
                            onClick={() => {
                                // Lógica Condicional: Se for Produção (edit_only), step é 1. Se não, 5.
                                const step = category === 'video_production' ? 1 : 5;
                                setQty(qty + step);
                                handleInteraction();
                            }} 
                            className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-brand-DEFAULT hover:border-brand-DEFAULT transition-all group shrink-0"
                        >
                            <Plus size={24} className="text-neutral-400 group-hover:text-white" />
                        </button>
                    </div>
                    <p className="text-xs text-neutral-500 mt-6">
                        {category === 'video_production' ? "Ajuste unitário." : "Ajuste de 5 em 5 unidades."}
                    </p>
                </motion.div>
            )}

            {category === 'social' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div 
                        variants={fadeInUp}
                        onClick={() => { setAddRealTime(!addRealTime); handleInteraction(); }}
                        className={cn("cursor-pointer p-4 rounded-lg border flex items-center gap-4 transition-all", addRealTime ? "bg-brand-DEFAULT/20 border-brand-DEFAULT" : "bg-white/5 border-white/10")}
                    >
                        <div className={cn("w-6 h-6 rounded border flex items-center justify-center shrink-0", addRealTime ? "bg-brand-DEFAULT border-brand-DEFAULT" : "border-white/50")}>
                           {addRealTime && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <div>
                            <p className="text-white font-medium">Fotos Real Time (+ R$ 600)</p>
                            <p className="text-xs text-neutral-400">Entrega imediata durante o evento.</p>
                        </div>
                    </motion.div>

                    <motion.div 
                        variants={fadeInUp}
                        onClick={() => { setAddDrone(!addDrone); handleInteraction(); }}
                        className={cn("cursor-pointer p-4 rounded-lg border flex items-center gap-4 transition-all", addDrone ? "bg-brand-DEFAULT/20 border-brand-DEFAULT" : "bg-white/5 border-white/10")}
                    >
                        <div className={cn("w-6 h-6 rounded border flex items-center justify-center shrink-0", addDrone ? "bg-brand-DEFAULT border-brand-DEFAULT" : "border-white/50")}>
                           {addDrone && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <div>
                            <p className="text-white font-medium">Imagens de Drone (+ R$ 250)</p>
                            <p className="text-xs text-neutral-400">Perspectivas aéreas cinematográficas.</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>

        {/* LOGÍSTICA (Compacta) */}
        {!isNoTravelCost && (
            <motion.div variants={fadeInUp} className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-full"><Route size={20} className="text-brand-DEFAULT" /></div>
                    <div>
                        <p className="text-xs text-neutral-500 uppercase">Destino</p>
                        <p className="text-white font-medium">{locationClient} <span className="text-neutral-500 text-sm">({distance} km)</span></p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-neutral-500 uppercase">Taxa de Deslocamento</p>
                    <p className="text-xl text-white font-mono">{travelCost > 0 ? formatCurrency(travelCost) : "Grátis"}</p>
                </div>
            </motion.div>
        )}
        
        {isNoTravelCost && category !== 'custom' && (
             <motion.div variants={fadeInUp} className="border-t border-white/10 pt-8 text-center">
                <span className="text-xs text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                    Deslocamento Gratuito (Estúdio)
                </span>
             </motion.div>
        )}

      </div>
    </section>
  );
};

// Componente Auxiliar: ServiceCard
const ServiceCard = ({ active, onClick, icon: Icon, title, price, desc, details, highlight }: any) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div 
            onClick={(e) => {
                if(onClick) onClick(e);
            }}
            className={cn(
                "cursor-pointer p-5 rounded-xl border transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-full", 
                active 
                    ? "bg-gradient-to-br from-neutral-800 to-neutral-900 border-brand-DEFAULT shadow-lg shadow-brand-DEFAULT/10" 
                    : "bg-white/5 border-white/10 hover:bg-white/10",
                highlight && active && "ring-1 ring-brand-DEFAULT"
            )}
        >
            {active && <div className="absolute top-0 right-0 w-16 h-16 bg-brand-DEFAULT/20 blur-xl rounded-full -mr-8 -mt-8 pointer-events-none" />}
            
            <div>
                {/* Header do Card - CORRIGIDO: Ícones de info sempre à direita */}
                <div className="flex items-start mb-3 w-full">
                    {Icon ? (
                        <motion.div
                            animate={active ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Icon size={24} className="mb-2 text-brand-DEFAULT" />
                        </motion.div>
                    ) : null}
                    
                    {/* ml-auto força este container para a direita, independente de ter ícone à esquerda ou não */}
                    <div className="flex items-center gap-2 ml-auto">
                        {details && (
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDetails(!showDetails);
                                }}
                                className="text-neutral-500 hover:text-white transition-colors p-1 z-10"
                                title="Ver detalhes"
                            >
                                <CircleHelp size={16} />
                            </button>
                        )}
                        {active && <div className="w-2 h-2 bg-brand-DEFAULT rounded-full" />}
                    </div>
                </div>
                <h4 className={cn("font-serif text-lg leading-tight mb-1", active ? "text-white" : "text-neutral-300")}>{title}</h4>
                {desc && <p className="text-xs text-neutral-500 mb-2">{desc}</p>}
            </div>

            <p className={cn("text-sm font-medium mt-2", active ? "text-brand-DEFAULT" : "text-white/60")}>{price}</p>

            {/* Painel de Detalhes Expandível */}
            <AnimatePresence>
                {showDetails && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-3 mt-3 border-t border-white/10 text-xs text-neutral-300 leading-relaxed bg-black/20 -mx-5 -mb-5 p-5">
                             <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-white uppercase tracking-wider text-[10px]">O que está incluso:</span>
                                <button onClick={(e) => { e.stopPropagation(); setShowDetails(false); }}><X size={12} /></button>
                             </div>
                             {details}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Ícone auxiliar SVG
const SmartphoneIcon = ({ size, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
);

export default UpsellList;
