
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, MessageCircle, ArrowDown } from 'lucide-react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';
import { fadeInUp, staggerContainer } from '../lib/animations';
import { ClientData, OccasionType, LocationType } from '../types';
import { formatCurrency } from '../lib/utils';

// Interface atualizada para receber os detalhes do orçamento
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

/**
 * Componente: AnimatedClock
 * Renderiza um ícone SVG com ponteiros ancorados corretamente no centro.
 */
const AnimatedClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
    <circle cx="12" cy="12" r="10" />
    
    {/* Ponteiro das Horas (Curto) */}
    {/* x1/y1 = Centro (12, 12). x2/y2 = Ponta (12, 6). Comprimento 6px */}
    <motion.line
      x1="12" y1="12" x2="12" y2="7"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      // originX: 0.5 (centro horizontal da linha), originY: 1 (base da linha, que é o y1=12)
      style={{ originX: 0.5, originY: 1 }}
    />
    
    {/* Ponteiro dos Minutos (Longo) */}
    {/* x1/y1 = Centro (12, 12). x2/y2 = Ponta (12, 3). Comprimento 9px */}
    <motion.line
      x1="12" y1="12" x2="12" y2="3"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      style={{ originX: 0.5, originY: 1 }}
    />
  </svg>
);

/**
 * SuccessView
 * -----------
 * Tela final exibida após a assinatura do contrato.
 * Confirma o envio e fornece um call-to-action para contato via WhatsApp.
 */
const SuccessView: React.FC<SuccessViewProps> = ({ onReset, clientData, totalPrice, quoteDetails }) => {

  const whatsappNumber = "5584981048857";
  
  // Construção da Mensagem Formatada
  let message = "";

  if (quoteDetails) {
      // 1. Definição do Escopo
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

      // 2. Definição do Ambiente
      const ambiente = quoteDetails.location === 'studio' ? "Estúdio Controlado" : "Externo / In Loco";

      // 3. Logística
      const distanciaStr = `${quoteDetails.distance}km (Ida)`;
      const freteStr = quoteDetails.location === 'studio' ? "Grátis (Estúdio)" : "Incluso no total";
      
      // 4. Pagamento
      const pagamentoStr = quoteDetails.paymentMethod || "A combinar";

      // 5. Sanitização de moeda (Remove espaços não quebráveis que bugam no WhatsApp)
      const formattedPrice = formatCurrency(totalPrice).replace(/\u00A0/g, ' ');

      // 6. Montagem do Texto (Emojis fora dos asteriscos para evitar problemas de formatação)
      message = `
🔔 *NOVA PROPOSTA APROVADA*

👤 *DADOS DO CLIENTE*
*Nome:* ${clientData.name}
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
*Status:* Aprovado no Sistema
──────────────
🔗 *PRÓXIMOS PASSOS*
Aguardando emissão do contrato.
`.trim();
  }

  // Usa api.whatsapp.com que é mais robusto para strings longas e codificadas
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;

  return (
    // REMOVIDO: bg-neutral-950
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
      
      {/* Background Decorativo e Gradientes (Com transparência para o fundo global) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900/50 via-neutral-950/80 to-black z-0" />
      <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-brand-DEFAULT/10 to-transparent pointer-events-none" />

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md text-center"
      >
        {/* Logo EAREC - Reduzida */}
        <motion.div variants={fadeInUp} className="flex justify-center mb-8">
          <Logo className="w-40" />
        </motion.div>

        {/* Ícone de Sucesso Animado - Reduzido */}
        <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
            <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
                <CheckCircle className="text-green-500 relative z-10" size={50} />
            </div>
        </motion.div>

        {/* Texto Alterado */}
        <motion.h1 variants={fadeInUp} className="text-2xl md:text-4xl font-serif text-white mb-2">
            Orçamento Completo!
        </motion.h1>

        {/* Call to Action Animado */}
        <motion.div variants={fadeInUp} className="mb-8">
             <motion.p 
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-brand-DEFAULT font-medium text-sm flex items-center justify-center gap-2"
             >
                Enviar orçamento clicando no botão abaixo
                <ArrowDown size={14} />
             </motion.p>
        </motion.div>

        {/* Botões de Ação (Trocado de Posição: Agora vem PRIMEIRO) */}
        <motion.div variants={fadeInUp} className="space-y-3 px-4 mb-8">
            {/* Botão Principal: WhatsApp */}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                <Button variant="primary" size="md" className="w-full flex items-center gap-2 justify-center bg-green-600 border-green-600 hover:bg-green-700 shadow-green-900/20 py-4 text-base font-bold tracking-wide">
                    <MessageCircle size={20} />
                    ENVIAR AGORA
                </Button>
            </a>

            {/* Botão Secundário: Reiniciar */}
            <Button onClick={onReset} size="md" variant="secondary" className="w-full py-3 text-sm border-transparent hover:bg-white/5 text-neutral-500 hover:text-white">
                Voltar ao Início
            </Button>
        </motion.div>

        {/* Card de Status do Pedido - Compacto (Trocado de Posição: Agora vem DEPOIS) */}
        <motion.div 
            variants={fadeInUp}
            className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between mx-4"
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-full text-yellow-500">
                    <AnimatedClock />
                </div>
                <div className="text-left">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Status</p>
                    <p className="text-white text-sm font-medium">Esperando sua mensagem!</p>
                </div>
            </div>
            {/* Bolinha pulsante */}
            <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
        </motion.div>

      </motion.div>
    </div>
  );
};

export default SuccessView;
