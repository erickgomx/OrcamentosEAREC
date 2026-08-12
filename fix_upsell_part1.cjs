const fs = require('fs');

const topContent = `import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Heart, Sparkles, Hand, Gem, MessageCircle, Gift, Users, GlassWater, PlaneTakeoff, GraduationCap, Building2, Camera, MapPin, Search, Clock, Zap, Video, Minus, Plus, ChevronRight, HelpCircle, Check, Play, Map as MapIcon, X, Battery, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AppConfig } from '../../AppConfig';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { PriceTooltip } from '../ui/PriceTooltip';
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
  serviceId: string;
  handleServiceSelect: (serviceId: string, selectionMode?: 'duration' | 'quantity') => void;
  clientData: any;
  viewMode: 'services' | 'config';
  hours: number; setHours: (n: number) => void;
  qty: number; setQty: (n: number) => void;
  videoQty: number; setVideoQty: (n: number) => void;
  droneQty: number; setDroneQty: (n: number) => void;
  addDrone: boolean; setAddDrone: (b: boolean) => void;
  addRealTime: boolean; setAddRealTime: (b: boolean) => void;
  distance: number; travelCost: number; isMapOpen: boolean; setIsMapOpen: (b: boolean) => void;
  selectionMode: 'duration' | 'quantity'; setSelectionMode: (m: 'duration' | 'quantity') => void;
  isQuickMode?: boolean; onContactRequest: () => void;
  commercialMode: 'on_location' | 'studio'; setCommercialMode: (m: 'on_location' | 'studio') => void;
}

const ControlBtn = ({ onClick, icon: Icon, active }: { onClick: () => void, icon: any, active?: boolean }) => (
    <button 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className={cn(
            "p-3 rounded-xl transition-all duration-300",
            active ? "bg-white text-black hover:scale-105" : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
        )}
    >
        <Icon size={20} />
    </button>
);

const ServiceCard = ({ active, onClick, onInfo, icon: Icon, title, price, composition, desc, highlight }: any) => (
    <div 
        onClick={onClick}
        className={cn(
            "group relative flex flex-col items-center justify-center p-6 rounded-3xl border transition-all duration-500 cursor-pointer text-center h-full min-h-[220px] overflow-hidden",
            active 
                ? "bg-neutral-900 border-brand-DEFAULT shadow-[0_0_30px_rgba(220,38,38,0.15)] scale-[1.02]" 
                : "bg-neutral-950/50 border-white/5 hover:border-white/20 hover:bg-neutral-900/80",
            highlight && !active && "border-white/10"
        )}
    >
        {highlight && !active && (
            <div className="absolute top-0 right-0 w-20 h-20 bg-brand-DEFAULT/10 rounded-full blur-2xl pointer-events-none" />
        )}
        
        {/* Info Button */}
        <button 
            onClick={(e) => {
                e.stopPropagation();
                onInfo({ title, desc, price });
            }}
            className="absolute top-4 left-4 p-2 text-neutral-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors z-20"
            aria-label="Mais informações"
        >
            <HelpCircle size={18} strokeWidth={2} />
        </button>

        {/* Checkmark */}
        <div className={cn(
            "absolute top-3 right-3 w-6 h-6 rounded-full border flex items-center justify-center transition-all",
            active ? "bg-brand-DEFAULT border-brand-DEFAULT" : "border-white/10 bg-black/20"
        )}>
            {active && <Check size={14} className="text-white" />}
        </div>

        {/* Icon */}
        <div className={cn(
            "p-4 rounded-full mb-1 transition-all duration-300",
            active ? "bg-white/20 text-white" : "bg-white/10 text-neutral-300 group-hover:bg-white/20 group-hover:text-white"
        )}>
            <Icon size={28} />
        </div>

        <div className="space-y-1 text-center px-0 sm:px-1 w-full">
            <p className={cn(
                "text-[11px] sm:text-xs md:text-sm font-medium whitespace-normal leading-tight break-words",
                active ? "text-white" : "text-neutral-300"
            )}>
                {title}
            </p>
            <p className="text-[9px] md:text-xs text-brand-DEFAULT font-bold bg-brand-DEFAULT/10 py-1 px-2 md:px-3 rounded-full inline-block mt-1 whitespace-nowrap">
                {price === 'A Consultar' ? price : '+ '+price}
            </p>
        </div>
    </div>
);

const UpsellList: React.FC<UpsellListProps> = (props) => {
  const {
    category, serviceId, handleServiceSelect, clientData, viewMode,
    hours, setHours, qty, setQty, videoQty, setVideoQty, droneQty, setDroneQty,
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
    { id: 'wedding', label: 'Casamento', desc: 'Cobertura Completa' },
    { id: 'social', label: 'Social', desc: 'Aniversários e Festas' },
    { id: 'commercial', label: 'Comercial', desc: 'Marcas e Produtos' },
    { id: 'studio', label: 'Estúdio', desc: 'Retratos e Ensaios' },
    { id: 'video_production', label: 'Monte seu Orçamento', desc: 'Projetos Especiais' },
    { id: 'custom', label: 'Personalizado', desc: 'Outras Demandas' }
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleCustomProjectClick = () => {
    onContactRequest();
  };

  const isCustomBundle = category === 'video_production' || serviceId === 'custom_bundle';
  
  const showDuration = selectionMode === 'duration' && !['custom_bundle'].includes(serviceId);
  const showQuantity = !['custom_bundle', 'edit_only'].includes(serviceId) && (selectionMode === 'quantity' || ['commercial', 'studio'].includes(category));
  const showDroneAddon = !['studio'].includes(category) && !['custom_bundle', 'edit_only'].includes(serviceId);
  const isCombo = category === 'commercial' && serviceId === 'comm_combo';

  const gridClasses = cn(
    "flex flex-wrap gap-3 md:gap-6 w-full mx-auto justify-center items-stretch", 
    "[&>*]:flex-shrink-0 [&>*]:w-[calc(50%-0.5rem)] md:[&>*]:w-[calc(50%-1rem)] [&>*]:max-w-[400px]" 
  );

  return (
    <div className="w-full">
`;

// Now read the existing file, we will replace from `import React, { useState } from 'react';` to `{isCustomBundle && setVideoQty && setDroneQty && (`
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

const regex = /import React, \{ useState \} from 'react';.*?\{isCustomBundle && setVideoQty && setDroneQty && \(/s;
code = code.replace(regex, topContent + '\n      {viewMode === \'services\' && (\n        <motion.div\n          key="services-view"\n          initial="hidden"\n          animate="visible"\n          exit="hidden"\n          className="space-y-8 w-full flex flex-col items-center"\n        >\n                {isCustomBundle && setVideoQty && setDroneQty && (');

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
