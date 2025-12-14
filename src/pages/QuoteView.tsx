import React, { useState, useMemo } from 'react';
import Hero from '../components/quote/Hero';
import Moodboard from '../components/quote/Moodboard';
import UpsellList from '../components/quote/UpsellList';
import StickyFooter from '../components/quote/StickyFooter';
import SignatureModal from '../components/quote/SignatureModal';
import { formatCurrency } from '../lib/utils';
import { motion, useScroll, useSpring } from 'framer-motion';
import { OccasionType, LocationType, ClientData, QuoteData } from '../types';
import { Calendar, CheckCircle, Copyright, CreditCard } from 'lucide-react';

interface QuoteViewProps {
  clientData: ClientData;
  config: QuoteData; // Recebe a configuração atualizada do App
}

const QuoteView: React.FC<QuoteViewProps> = ({ clientData, config }) => {
  // Configuração da Barra de Progresso
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Estado para controlar o destaque do botão de aprovação (Pulsar quando chegar ao final)
  const [highlightCTA, setHighlightCTA] = useState(false);

  // Merge dos dados do cliente com a Configuração atual (Preços dinâmicos)
  const quoteData: QuoteData = useMemo(() => ({
    ...config, // Usa os preços passados via prop (podem ter sido editados no Admin)
    client: {
        ...config.client,
        ...clientData,
        projectTitle: `Project: ${clientData.name}`
    }
  }), [clientData, config]);

  // Estados do Configurador
  const [occasion, setOccasion] = useState<OccasionType>('advertising');
  const [location, setLocation] = useState<LocationType>('external');
  const [photoQty, setPhotoQty] = useState<number>(20); 
  const [videoQty, setVideoQty] = useState<number>(1); 
  
  // Controle do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  // Cálculo reativo do preço total
  const totalPrice = useMemo(() => {
    let total = quoteData.basePrice;

    if (location === 'studio') {
      total += quoteData.studioFee;
    }

    total += (photoQty * quoteData.photoUnitPrice);
    total += (videoQty * quoteData.videoUnitPrice);

    return total;
  }, [location, photoQty, videoQty, quoteData]);

  const handleSignatureSuccess = (signatureData: string) => {
    console.log("Signature captured:", signatureData);
    setIsModalOpen(false);
    setIsApproved(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDateSafe = (dateString: string) => {
    if (!dateString) return 'A definir';
    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="pb-40 relative">
      {/* Barra de Progresso Inferior - Movida para bottom-0 */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-1.5 bg-brand-DEFAULT z-50 origin-left shadow-[0_0_10px_#DC2626] transform-gpu"
        style={{ scaleX }}
      />

      <Hero data={quoteData} />
      
      <div className="relative z-10">
        
        {/* Intro Text / Letter */}
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
        
        <UpsellList 
          data={quoteData}
          occasion={occasion}
          setOccasion={setOccasion}
          location={location}
          setLocation={setLocation}
          photoQty={photoQty}
          setPhotoQty={setPhotoQty}
          videoQty={videoQty}
          setVideoQty={setVideoQty}
        />
        
        {/* Technical Details */}
        <motion.section 
          className="py-32 px-6 bg-neutral-950 relative border-t border-white/5"
          onViewportEnter={() => setHighlightCTA(true)}
          onViewportLeave={() => setHighlightCTA(false)}
        >
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-brand-DEFAULT to-transparent opacity-50" />
           
           <div className="max-w-6xl mx-auto">
             <h3 className="text-center font-serif text-4xl text-white mb-20">Detalhes do Contrato</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {/* Data */}
                <div className="flex flex-col items-center text-center p-6 border border-brand-DEFAULT/20 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                    <div className="mb-6 p-4 rounded-full bg-brand-DEFAULT/10 text-brand-DEFAULT border border-brand-DEFAULT/20">
                      <Calendar size={32} />
                    </div>
                    <h5 className="font-serif text-2xl text-white mb-3">Cronograma</h5>
                    <p className="text-xl text-brand-DEFAULT font-serif font-medium">{formatDateSafe(clientData.date)}</p>
                    <p className="text-sm text-neutral-500 mt-2">Produção: 1 Diária Completa</p>
                </div>

                {/* Entrega */}
                <div className="flex flex-col items-center text-center p-6 border border-brand-DEFAULT/20 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                    <div className="mb-6 p-4 rounded-full bg-brand-DEFAULT/10 text-brand-DEFAULT border border-brand-DEFAULT/20">
                      <CheckCircle size={32} />
                    </div>
                    <h5 className="font-serif text-2xl text-white mb-3">Formatos</h5>
                    <p className="text-xl text-brand-DEFAULT font-serif font-medium">Link Privado 4K</p>
                    <p className="text-sm text-neutral-500 mt-2">Galeria Web + Backup Cloud</p>
                </div>

                {/* Direitos */}
                <div className="flex flex-col items-center text-center p-6 border border-brand-DEFAULT/20 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                    <div className="mb-6 p-4 rounded-full bg-brand-DEFAULT/10 text-brand-DEFAULT border border-brand-DEFAULT/20">
                      <Copyright size={32} />
                    </div>
                    <h5 className="font-serif text-2xl text-white mb-3">Licenciamento</h5>
                    <p className="text-xl text-brand-DEFAULT font-serif font-medium">Uso Comercial Full</p>
                    <p className="text-sm text-neutral-500 mt-2">Redes Sociais & Site</p>
                </div>

                {/* Pagamento */}
                <div className="flex flex-col items-center text-center p-6 border border-brand-DEFAULT/20 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                    <div className="mb-6 p-4 rounded-full bg-brand-DEFAULT/10 text-brand-DEFAULT border border-brand-DEFAULT/20">
                      <CreditCard size={32} />
                    </div>
                    <h5 className="font-serif text-2xl text-white mb-3">Condições</h5>
                    <p className="text-xl text-brand-DEFAULT font-serif font-medium">50% Reserva</p>
                    <p className="text-sm text-neutral-500 mt-2">50% na Entrega Final</p>
                </div>
             </div>
             
             <div className="mt-16 text-center">
                <p className="text-neutral-500">Contato direto: <span className="text-white border-b border-white/20">earecmidia@gmail.com</span></p>
             </div>
           </div>
        </motion.section>

      </div>

      <StickyFooter 
        totalPrice={totalPrice} 
        onApprove={() => setIsModalOpen(true)}
        isApproved={isApproved}
        highlight={highlightCTA} 
      />

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