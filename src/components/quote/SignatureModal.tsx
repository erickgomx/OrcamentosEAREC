import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignatureCanvas from 'react-signature-canvas';
import { X, Loader2, ShieldCheck } from 'lucide-react';
import Button from '../ui/Button';
import { modalVariants } from '../../lib/animations';
import BackgroundFilmStrips from '../ui/BackgroundFilmStrips';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (signatureData: string) => void;
  totalValue: string;
}

/**
 * Modal de Assinatura
 * -------------------
 * Permite que o cliente desenhe a assinatura.
 * IMPORTANTE: O Canvas precisa saber o tamanho exato do container para não distorcer.
 */
const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, onClose, onConfirm, totalValue }) => {
  const sigPad = useRef<SignatureCanvas>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isEmpty, setIsEmpty] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado para controlar o tamanho do canvas dinamicamente
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // CORREÇÃO DE PROPORÇÃO & RESIZE:
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const updateSize = () => {
        if (containerRef.current) {
          setCanvasSize({ 
            width: containerRef.current.offsetWidth, 
            height: containerRef.current.offsetHeight 
          }); 
        }
      };

      updateSize();
      const timer = setTimeout(updateSize, 100);

      window.addEventListener('resize', updateSize);
      return () => {
        window.removeEventListener('resize', updateSize);
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  const clear = () => {
    sigPad.current?.clear();
    setIsEmpty(true);
  };

  const handleEndDrawing = () => {
    if (sigPad.current && !sigPad.current.isEmpty()) {
      setIsEmpty(false);
    }
  };

  const handleConfirm = async () => {
    if (isEmpty || !sigPad.current) return;
    
    setIsSubmitting(true);
    // Simula envio para API
    await new Promise(r => setTimeout(r, 1500));
    
    // Pega a imagem em Base64
    const dataUrl = sigPad.current.toDataURL();
    onConfirm(dataUrl);
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          {/* BACKGROUND CINEMATOGRÁFICO (NOVO) */}
          {/* Adiciona o efeito FilmStrips como fundo exclusivo deste modal */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0"
          >
             <BackgroundFilmStrips />
             {/* Overlay Suave para focar no modal, mas deixando o fundo visível */}
             <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          </motion.div>

          {/* Camada de clique para fechar (Transparente) */}
          <div className="absolute inset-0 z-10" onClick={onClose} />

          {/* Janela do Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-20 bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md overflow-hidden"
          >
            {/* Faixa Superior de Destaque */}
            <div className="h-1.5 w-full bg-gradient-to-r from-neutral-800 via-brand-DEFAULT to-neutral-800" />

            <div className="p-6 md:p-8">
              {/* Header com textos centralizados */}
              <div className="relative mb-6 text-center">
                <h3 className="font-serif text-2xl md:text-3xl text-white mb-1">Aprovar Proposta</h3>
                <p className="text-xs text-neutral-400 uppercase tracking-widest">Formalização Digital</p>
                
                <button 
                  onClick={onClose} 
                  className="absolute right-0 top-0 text-neutral-500 hover:text-white transition-colors p-1"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Valor e Disclaimer Centralizados */}
              <div className="mb-6 space-y-1 text-center bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Valor Total do Contrato</p>
                <p className="text-3xl text-white font-serif tracking-tight">{totalValue}</p>
              </div>

              {/* Aviso de Privacidade Centralizado (RESTAURADO) */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <ShieldCheck size={14} className="text-emerald-500" />
                <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wide">
                    Não guardamos sua assinatura
                </p>
              </div>

              {/* Container do Canvas */}
              <div 
                ref={containerRef}
                className="relative rounded-xl bg-neutral-950 border border-white/10 overflow-hidden mb-6 h-48 shadow-inner group"
              >
                {canvasSize.width > 0 && (
                  <SignatureCanvas 
                    ref={sigPad}
                    {...({ penColor: "white" } as any)}
                    canvasProps={{
                      width: canvasSize.width,
                      height: canvasSize.height,
                      className: "cursor-crosshair block"
                    }}
                    onEnd={handleEndDrawing}
                  />
                )}
                
                {!isEmpty && (
                  <button 
                    onClick={clear}
                    className="absolute top-2 right-2 text-[10px] uppercase font-bold text-neutral-500 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition-colors z-10"
                  >
                    Limpar
                  </button>
                )}
                
                {isEmpty && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-white/10 select-none">
                    <span className="font-serif italic text-2xl">Assine aqui</span>
                    <span className="text-xs font-sans mt-1 opacity-50">Use o dedo ou mouse</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="secondary" 
                  className="flex-1 py-3 text-xs md:text-sm"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-[2] py-3 text-xs md:text-sm shadow-lg shadow-brand-DEFAULT/10"
                  disabled={isEmpty || isSubmitting}
                  onClick={handleConfirm}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                         <Loader2 className="animate-spin" size={18} />
                         <span>Processando...</span>
                    </div>
                  ) : (
                    "CONFIRMAR CONTRATAÇÃO"
                  )}
                </Button>
              </div>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SignatureModal;