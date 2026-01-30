import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MousePointerClick, SlidersHorizontal, MessageCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import { fadeInUp, staggerContainer } from '../lib/animations';

interface ConfirmationViewProps {
  onContinue: () => void;
}

const ConfirmationView: React.FC<ConfirmationViewProps> = ({ onContinue }) => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-x-hidden overflow-y-auto px-6 py-12 bg-neutral-950">
      
      {/* Container Principal */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-lg my-auto"
      >
        
        {/* Card Estilizado */}
        <div className="bg-neutral-900/60 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            
            {/* Efeito de luz sutil no topo */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neutral-800 via-brand-DEFAULT to-neutral-800 opacity-50" />

            {/* Cabeçalho */}
            <motion.div variants={fadeInUp} className="text-center mb-6 md:mb-8">
                {/* Logo no Topo (Substituindo o Ícone) */}
                <div className="flex justify-center mb-6">
                     <Logo className="w-32 md:w-40" animate />
                </div>

                <h1 className="font-serif text-2xl md:text-4xl text-white leading-tight">
                    COMO <span className="text-brand-DEFAULT font-medium">FUNCIONA?</span>
                </h1>
                <p className="text-neutral-400 text-sm mt-2">Entenda seu caminho até a contratação</p>
            </motion.div>

            {/* Timeline de Passos */}
            <div className="relative space-y-6 md:space-y-8 mb-8 pl-2">
                
                {/* Linha Conectora Vertical - Centralizada no quadrado w-14 (56px/2 = 28px) */}
                <div className="absolute left-[28px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-brand-DEFAULT via-brand-DEFAULT/30 to-transparent opacity-30" />

                {/* Passo 1: Escolha */}
                <motion.div variants={fadeInUp} className="relative flex gap-5 items-start group">
                    <div className="relative z-10 w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-lg group-hover:border-brand-DEFAULT/30 transition-colors shrink-0">
                        <MousePointerClick size={24} className="text-neutral-200" />
                    </div>
                    <div className="pt-1">
                        <h3 className="text-white font-bold text-sm uppercase tracking-wide flex items-center">
                            <span className="text-[#DC2626] text-xl md:text-2xl mr-3 font-serif font-bold leading-none">1.</span>
                            Escolha o Modo
                        </h3>
                        <p className="text-neutral-400 text-xs md:text-sm leading-snug mt-1">
                            Defina entre <span className="text-white">Orçamento Rápido</span> ou <span className="text-white">Personalizado</span> na próxima tela.
                        </p>
                    </div>
                </motion.div>

                {/* Passo 2: Configuração */}
                <motion.div variants={fadeInUp} className="relative flex gap-5 items-start group">
                    <div className="relative z-10 w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-lg group-hover:border-brand-DEFAULT/30 transition-colors shrink-0">
                        <SlidersHorizontal size={24} className="text-neutral-200" />
                    </div>
                    <div className="pt-1">
                        <h3 className="text-white font-bold text-sm uppercase tracking-wide flex items-center">
                            <span className="text-[#DC2626] text-xl md:text-2xl mr-3 font-serif font-bold leading-none">2.</span>
                            Configure
                        </h3>
                        <p className="text-neutral-400 text-xs md:text-sm leading-snug mt-1">
                            Navegue por <span className="text-white">Categorias</span>, adicione serviços e revise o <span className="text-white">Resumo</span> completo.
                        </p>
                    </div>
                </motion.div>

                {/* Passo 3: WhatsApp (Destino Final) */}
                <motion.div variants={fadeInUp} className="relative flex gap-5 items-start group">
                    <div className="relative z-10 w-14 h-14 rounded-2xl bg-black flex items-center justify-center shadow-lg shrink-0">
                        <MessageCircle size={24} className="text-white" />
                    </div>
                    <div className="pt-1">
                        <h3 className="text-white font-bold text-sm uppercase tracking-wide flex items-center">
                            <span className="text-[#DC2626] text-xl md:text-2xl mr-3 font-serif font-bold leading-none">3.</span>
                            Finalize no WhatsApp
                        </h3>
                        <p className="text-neutral-300 text-xs md:text-sm leading-snug mt-1">
                            Você será redirecionado ao WhatsApp para confirmar a disponibilidade da data com nossa equipe.
                        </p>
                    </div>
                </motion.div>

            </div>

            {/* Botão de Ação */}
            <motion.div variants={fadeInUp}>
                <Button 
                    onClick={onContinue} 
                    size="lg"
                    className="w-full shadow-[0_0_25px_rgba(220,38,38,0.25)] group font-medium tracking-wide"
                >
                    ENTENDI, VAMOS LÁ
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </motion.div>
        </div>

      </motion.div>

      {/* Background Decorativo */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-DEFAULT/5 blur-[150px] rounded-full" />
      </div>
    </div>
  );
};

export default ConfirmationView;