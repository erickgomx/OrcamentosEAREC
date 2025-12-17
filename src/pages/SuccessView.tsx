
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, MessageCircle, ArrowDown } from 'lucide-react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';
import { fadeInUp, staggerContainer } from '../lib/animations';
import { ClientData, OccasionType, LocationType } from '../types';
import { formatCurrency } from '../lib/utils';

interface SuccessViewProps {
  onReset: () => void;
  clientData: ClientData;
  totalPrice: number;
  quoteDetails?: {
      occasion: OccasionType;
      customOccasionText?: string;
      location: LocationType;
      photoQty: number;
      videoQty: number;
      distance: number;
      paymentMethod?: string;
  };
}

const AnimatedClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
    <circle cx="12" cy="12" r="10" />
    <motion.line x1="12" y1="12" x2="12" y2="7" initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} style={{ originX: 0.5, originY: 1 }} />
    <motion.line x1="12" y1="12" x2="12" y2="3" initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} style={{ originX: 0.5, originY: 1 }} />
  </svg>
);

const SuccessView: React.FC<SuccessViewProps> = ({ onReset, clientData, totalPrice, quoteDetails }) => {

  const whatsappNumber = "5584981048857";
  
  // Helper para formatar data de YYYY-MM-DD para DD/MM/YYYY
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'A definir';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  let message = "";

  if (quoteDetails) {
      let escopo = "";
      if (quoteDetails.photoQty > 0 && quoteDetails.videoQty > 0) {
          escopo = `${quoteDetails.photoQty} Fotos + ${quoteDetails.videoQty} Vídeo(s)`;
      } else if (quoteDetails.photoQty > 0) {
          escopo = `${quoteDetails.photoQty} Fotos`;
      } else if (quoteDetails.videoQty > 0) {
          escopo = `${quoteDetails.videoQty} Vídeo(s)`;
      } else {
          escopo = "Cobertura por Hora/Diária";
      }

      const ambiente = quoteDetails.location === 'studio' ? "Estúdio Controlado" : "Externo / In Loco";
      const distanciaStr = `${quoteDetails.distance}km (Origem: Goianinha)`;
      const freteStr = quoteDetails.location === 'studio' ? "Grátis (Estúdio)" : "Incluso no total";
      const pagamentoStr = quoteDetails.paymentMethod || "A combinar";
      const formattedPrice = formatCurrency(totalPrice).replace(/\u00A0/g, ' ');

      message = `
🔔 *NOVA PROPOSTA APROVADA - EAREC*

👤 *DADOS DO CLIENTE*
*Nome:* ${clientData.name}
*Data do Evento:* ${formatDate(clientData.date)}
*Contato:* ${clientData.contact}
*Local:* ${clientData.location}

🎬 *DETALHES DO SERVIÇO*
*Ocasião:* ${quoteDetails.customOccasionText}
*Ambiente:* ${ambiente}
*Escopo:* ${escopo}

🚚 *LOGÍSTICA*
*Distância:* ${distanciaStr}
*Frete:* ${freteStr}

💰 *FINANCEIRO*
*Valor Total:* ${formattedPrice}
*Pagamento:* ${pagamentoStr}
*Status:* Aprovado via Plataforma Digital
`.trim();
  }

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Background mais escuro */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/20 via-black/80 to-black z-0" />
      <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-brand-DEFAULT/10 to-transparent pointer-events-none" />

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative z-10 w-full max-w-md text-center">
        <motion.div variants={fadeInUp} className="flex justify-center mb-8">
          <Logo className="w-40" />
        </motion.div>

        <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
            <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
                <CheckCircle className="text-green-500 relative z-10" size={50} />
            </div>
        </motion.div>

        <motion.h1 variants={fadeInUp} className="text-2xl md:text-4xl font-serif text-white mb-2">
            Orçamento Completo!
        </motion.h1>

        <motion.div variants={fadeInUp} className="mb-8">
             <motion.p animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="text-brand-DEFAULT font-medium text-sm flex items-center justify-center gap-2">
                Enviar orçamento para o WhatsApp
                <ArrowDown size={14} />
             </motion.p>
        </motion.div>

        <motion.div variants={fadeInUp} className="space-y-3 px-4 mb-8">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                <Button variant="primary" size="md" className="w-full flex items-center gap-2 justify-center bg-green-600 border-green-600 hover:bg-green-700 shadow-green-900/20 py-4 text-base font-bold tracking-wide">
                    <MessageCircle size={20} />
                    ENVIAR PARA PRODUÇÃO
                </Button>
            </a>
            <Button onClick={onReset} size="md" variant="secondary" className="w-full py-3 text-sm border-transparent hover:bg-white/5 text-neutral-500 hover:text-white">
                Fazer novo orçamento
            </Button>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between mx-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-full text-yellow-500"><AnimatedClock /></div>
                <div className="text-left">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Próximo Passo</p>
                    <p className="text-white text-sm font-medium">Aguardando seu contato!</p>
                </div>
            </div>
            <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SuccessView;
