
import React, { useState, useMemo, useEffect } from 'react';
import Hero from '../components/quote/Hero';
import Moodboard from '../components/quote/Moodboard';
import UpsellList from '../components/quote/UpsellList';
import StickyFooter from '../components/quote/StickyFooter';
import SignatureModal from '../components/quote/SignatureModal';
import SummaryView from './SummaryView';
import SuccessView from './SuccessView';
import { formatCurrency } from '../lib/utils';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { OccasionType, LocationType, ClientData, QuoteData } from '../types';
import { ChevronDown } from 'lucide-react';

interface QuoteViewProps {
  clientData: ClientData;
  config: QuoteData;
}

// Tipo de estado da view para navegar entre Configuração, Resumo e Sucesso
type ViewState = 'config' | 'summary' | 'success';

const QuoteView: React.FC<QuoteViewProps> = ({ clientData, config }) => {
  // Estado de Navegação Interna
  const [viewState, setViewState] = useState<ViewState>('config');

  // Configuração da Barra de Progresso (Topo)
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Estado para controlar a visibilidade do rodapé (StickyFooter)
  const [showFooter, setShowFooter] = useState(false);

  const quoteData: QuoteData = useMemo(() => ({
    ...config,
    client: {
        ...config.client,
        ...clientData,
        projectTitle: `Project: ${clientData.name}`
    }
  }), [clientData, config]);

  // --- Estados do Configurador ---
  const [occasion, setOccasion] = useState<OccasionType>('advertising');
  const [customOccasionText, setCustomOccasionText] = useState('');
  
  const [location, setLocation] = useState<LocationType>('external');
  const [photoQty, setPhotoQty] = useState<number>(20); 
  const [videoQty, setVideoQty] = useState<number>(1); 
  const [distance, setDistance] = useState<number>(0); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    if (clientData.location) {
        let hash = 0;
        const str = clientData.location.toLowerCase();
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const calculatedDistance = (Math.abs(hash) % 135) + 15;
        setDistance(Math.floor(calculatedDistance));
    }
  }, [clientData.location]);

  const totalPrice = useMemo(() => {
    let total = quoteData.basePrice;
    if (location === 'studio') total += quoteData.studioFee;
    total += (photoQty * quoteData.photoUnitPrice);
    total += (videoQty * quoteData.videoUnitPrice);
    if (distance > 0) {
        total += (distance * 2 * quoteData.pricePerKm);
    }
    return total;
  }, [location, photoQty, videoQty, distance, quoteData]);

  const handleSignatureSuccess = (signatureData: string) => {
    setIsModalOpen(false);
    setIsApproved(true);
    setViewState('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    window.location.reload(); 
  };

  const ScrollCursor = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: showFooter ? 0 : 1 }} 
      transition={{ duration: 0.5 }}
      className="fixed bottom-10 right-10 z-30 hidden md:flex flex-col items-center gap-2 mix-blend-difference pointer-events-none"
    >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white rotate-90 origin-right translate-x-4">
            Scroll
        </span>
        <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-12 bg-white"
        />
        <ChevronDown size={16} className="text-white" />
    </motion.div>
  );

  if (viewState === 'success') {
      return (
        <SuccessView 
            onReset={handleReset} 
            clientData={clientData}
            totalPrice={totalPrice}
            quoteDetails={{
                occasion,
                customOccasionText,
                location,
                photoQty,
                videoQty,
                distance
            }}
        />
      );
  }

  return (
    <div className="relative">
      
      {/* 
        Container Principal
        IMPORTANTE: Não usar 'hidden' aqui. Isso destrói o layout e reseta o scroll quando voltamos do resumo.
        Em vez disso, mantemos o bloco renderizado por baixo. 
      */}
      <div className="block pb-40">
          
          {/* Barra de progresso no TOPO (z-50) para ficar acima de tudo */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-brand-DEFAULT z-50 origin-left shadow-[0_0_15px_#DC2626]"
            style={{ scaleX }}
          />

          <ScrollCursor />

          <Hero data={quoteData} />
          
          <div className="relative z-10">
            
            <section className="py-24 px-6 max-w-4xl mx-auto text-center">
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="font-serif text-3xl md:text-4xl italic text-neutral-300 leading-relaxed"
                >
                  "Cada frame importa. Para o projeto de <span className="text-white not-italic font-medium border-b border-brand-DEFAULT/50 pb-1">{clientData.name}</span>, traremos uma estética cinematográfica única, onde a técnica serve à emoção."
                </motion.p>
                <div className="mt-12 flex items-center justify-center gap-4">
                    <div className="h-px w-16 bg-white/20"></div>
                    <a 
                      href="https://www.instagram.com/earecmidia/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs uppercase tracking-[0.3em] text-brand-DEFAULT font-bold hover:text-white transition-colors cursor-pointer"
                    >
                      @EARECMIDIA
                    </a>
                    <div className="h-px w-16 bg-white/20"></div>
                </div>
            </section>

            <Moodboard images={quoteData.moodboardImages} />

            {/* 
                Sensor de Scroll (Trigger): 
                Garante que o rodapé apareça logo antes de começar a configurar, 
                tanto no desktop quanto no mobile. 
            */}
            <motion.div 
                onViewportEnter={() => setShowFooter(true)}
                className="h-px w-full pointer-events-none opacity-0" 
            />
            
            <UpsellList 
              data={quoteData}
              occasion={occasion}
              setOccasion={setOccasion}
              customOccasionText={customOccasionText}
              setCustomOccasionText={setCustomOccasionText}
              location={location}
              setLocation={setLocation}
              photoQty={photoQty}
              setPhotoQty={setPhotoQty}
              videoQty={videoQty}
              setVideoQty={setVideoQty}
              distance={distance}
              onVisible={() => setShowFooter(true)}
            />
            
          </div>

          <AnimatePresence>
            {showFooter && (
                <StickyFooter 
                    totalPrice={totalPrice} 
                    onApprove={() => setViewState('summary')} 
                    isApproved={isApproved}
                    highlight={true} 
                />
            )}
          </AnimatePresence>
      </div>

      {/* Página de Resumo (Overlay Fixo) */}
      <AnimatePresence>
         {viewState === 'summary' && (
            <SummaryView 
                clientData={clientData}
                quoteData={quoteData}
                totalPrice={totalPrice}
                onBack={() => setViewState('config')}
                onProceedToSign={() => setIsModalOpen(true)}
            />
         )}
      </AnimatePresence>

      <SignatureModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSignatureSuccess}
        totalValue={formatCurrency(totalPrice)}
      />
    </div>
  );
};

export default QuoteView;
