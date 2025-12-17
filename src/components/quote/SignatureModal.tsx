
import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignatureCanvas from 'react-signature-canvas';
import { X, Loader2, ShieldCheck } from 'lucide-react';
import Button from '../ui/Button';
import { modalVariants } from '../../lib/animations';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Fundo Escuro com BLUR INTENSO para desfocar o filme no background global */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Janela do Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-neutral-900 border border-white/10 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6">
              {/* Header com textos centralizados */}
              <div className="relative mb-6 text-center">
                <h3 className="font-serif text-2xl text-white">Aprovar Proposta</h3>
                <button 
                  onClick={onClose} 
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Valor e Disclaimer Centralizados */}
              <div className="mb-6 space-y-2 text-center">
                <p className="text-sm text-neutral-400">Ao assinar, você concorda com o valor total de:</p>
                <p className="text-3xl text-white font-sans font-medium">{totalValue}</p>
              </div>

              {/* Aviso de Privacidade Centralizado */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <ShieldCheck size={14} className="text-green-500" />
                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">
                    Não guardamos sua assinatura
                </p>
              </div>

              {/* Container do Canvas */}
              <div 
                ref={containerRef}
                className="relative rounded-lg bg-white/5 overflow-hidden mb-4 h-48 ring-1 ring-white/20"
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
                    className="absolute top-2 right-2 text-xs text-neutral-400 hover:text-white bg-black/50 px-2 py-1 rounded z-10"
                  >
                    Limpar
                  </button>
                )}
                
                {isEmpty && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-white/10 select-none">
                    <span className="font-serif italic text-2xl">Assine aqui</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1"
                  disabled={isEmpty || isSubmitting}
                  onClick={handleConfirm}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Confirmar Contratação"
                  )}
                </Button>
              </div>
            </div>
            
            <div className="h-1 w-full bg-gradient-to-r from-neutral-900 via-brand-DEFAULT to-neutral-900" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SignatureModal;
