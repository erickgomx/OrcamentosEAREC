
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, Copyright, CreditCard, ArrowLeft, PenTool, MapPin, Settings2 } from 'lucide-react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';
import AnimatedPrice from '../components/ui/AnimatedPrice';
import { QuoteData, ClientData } from '../types';

interface SummaryViewProps {
  clientData: ClientData;
  quoteData: QuoteData;
  totalPrice: number;
  onBack: () => void;
  onProceedToSign: () => void;
}

const SummaryView: React.FC<SummaryViewProps> = ({ 
  clientData, 
  quoteData, 
  totalPrice, 
  onBack, 
  onProceedToSign 
}) => {
  const [showContent, setShowContent] = useState(false);

  // Sequência de Animação: Intro Logo -> Conteúdo
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2000); // 2 segundos de intro da logo
    return () => clearTimeout(timer);
  }, []);

  const formatDateSafe = (dateString: string) => {
    if (!dateString) return 'A definir';
    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 overflow-y-auto">
      
      {/* Intro Overlay com Logo */}
      <AnimatePresence>
        {!showContent && (
          <motion.div
            key="intro-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-black z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <Logo className="w-64" animate />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conteúdo Principal */}
      {showContent && (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="min-h-screen py-12 px-6 relative"
        >
             {/* Background Effects */}
             <div className="fixed top-0 left-0 w-full h-1/2 bg-gradient-to-b from-brand-DEFAULT/5 to-transparent pointer-events-none" />

             <div className="max-w-4xl mx-auto relative z-10">
                
                {/* Header Navigation */}
                <div className="flex items-center justify-between mb-16">
                    <button 
                        onClick={onBack}
                        className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm tracking-widest uppercase">Voltar à Configuração</span>
                    </button>
                    <Logo className="w-24 opacity-50" />
                </div>

                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">Resumo do Contrato</h2>
                    <p className="text-neutral-400">Confira os detalhes finais antes da assinatura.</p>
                </div>

                {/* Grid de Detalhes (Movido da QuoteView) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    
                    {/* Card 1: Cronograma */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-8 flex items-start gap-6 hover:border-brand-DEFAULT/30 transition-colors">
                        <div className="p-4 bg-brand-DEFAULT/10 text-brand-DEFAULT rounded-full">
                            <Calendar size={28} />
                        </div>
                        <div>
                            <h4 className="font-serif text-xl text-white mb-2">Cronograma</h4>
                            <p className="text-2xl text-brand-DEFAULT font-serif font-medium mb-1">{formatDateSafe(clientData.date)}</p>
                            <p className="text-sm text-neutral-500">1 Diária de Produção + Edição</p>
                        </div>
                    </div>

                    {/* Card 2: Logística & Local (NOVO) */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-8 flex items-start gap-6 hover:border-brand-DEFAULT/30 transition-colors">
                        <div className="p-4 bg-brand-DEFAULT/10 text-brand-DEFAULT rounded-full">
                            <MapPin size={28} />
                        </div>
                        <div>
                            <h4 className="font-serif text-xl text-white mb-2">Logística</h4>
                            <p className="text-2xl text-brand-DEFAULT font-serif font-medium mb-1 truncate max-w-[200px]">{clientData.location}</p>
                            <p className="text-sm text-neutral-500">Deslocamento Incluso</p>
                        </div>
                    </div>

                    {/* Card 3: Licenciamento */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-8 flex items-start gap-6 hover:border-brand-DEFAULT/30 transition-colors">
                        <div className="p-4 bg-brand-DEFAULT/10 text-brand-DEFAULT rounded-full">
                            <Copyright size={28} />
                        </div>
                        <div>
                            <h4 className="font-serif text-xl text-white mb-2">Licenciamento</h4>
                            <p className="text-2xl text-brand-DEFAULT font-serif font-medium mb-1">Uso Comercial Full</p>
                            <p className="text-sm text-neutral-500">Redes Sociais, Site e Tráfego Pago</p>
                        </div>
                    </div>

                    {/* Card 4: Pagamento */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-8 flex items-start gap-6 hover:border-brand-DEFAULT/30 transition-colors">
                        <div className="p-4 bg-brand-DEFAULT/10 text-brand-DEFAULT rounded-full">
                            <CreditCard size={28} />
                        </div>
                        <div>
                            <h4 className="font-serif text-xl text-white mb-2">Condições</h4>
                            <p className="text-2xl text-brand-DEFAULT font-serif font-medium mb-1">50% Reserva</p>
                            <p className="text-sm text-neutral-500">50% na Entrega do Material</p>
                        </div>
                    </div>
                </div>

                {/* Total Final Highlight */}
                <div className="bg-brand-DEFAULT/5 border border-brand-DEFAULT/20 rounded-2xl p-8 md:p-12 text-center mb-12">
                    <p className="text-sm uppercase tracking-widest text-brand-DEFAULT mb-4">Investimento Total Confirmado</p>
                    <div className="text-5xl md:text-6xl font-serif text-white flex items-center justify-center gap-3">
                         <AnimatedPrice value={totalPrice} />
                         <span className="text-xl text-neutral-500 font-sans font-normal">BRL</span>
                    </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 pb-20">
                    
                    {/* Botão de Voltar para Configuração (Esquerda) */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full md:w-auto order-2 md:order-1"
                    >
                        <Button 
                            onClick={onBack}
                            variant="secondary"
                            size="lg" 
                            className="w-full md:w-64 py-6 text-lg border-white/20 hover:border-white text-neutral-300 hover:text-white"
                        >
                            <Settings2 size={20} className="mr-2" />
                            Voltar e Configurar
                        </Button>
                    </motion.div>

                    {/* Botão de Assinar (Direita - Principal) */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full md:w-auto order-1 md:order-2"
                    >
                        <Button 
                            onClick={onProceedToSign}
                            size="lg" 
                            className="w-full md:w-96 py-6 text-xl shadow-[0_0_40px_rgba(220,38,38,0.4)]"
                        >
                            <PenTool size={24} className="mr-3" />
                            Assinar e Contratar
                        </Button>
                    </motion.div>
                </div>

             </div>
        </motion.div>
      )}
    </div>
  );
};

export default SummaryView;
