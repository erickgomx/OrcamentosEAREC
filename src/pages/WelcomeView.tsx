
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, User, Smartphone, CheckCircle2, Loader2, XCircle, AlertCircle, Map as MapIcon, ArrowLeft, Info, ChevronLeft } from 'lucide-react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';
import LocationMapModal from '../components/ui/LocationMapModal';
import { ClientData } from '../types';
import { CalendarService } from '../services/CalendarService';
import { cn } from '../lib/utils';

interface WelcomeViewProps {
  onStart: (data: ClientData) => void;
  onAdminClick?: () => void;
  onBack?: () => void;
}

// Variantes de Animação para o Wizard (Slide Lateral)
const stepVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
    filter: 'blur(10px)',
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] // Custom ease "cine"
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    filter: 'blur(10px)',
    transition: {
        duration: 0.4,
        ease: "easeIn"
    }
  })
};

// Componente de Input Inteligente (Reutilizado e Estilizado)
const SmartInput = ({ 
  icon: Icon, name, type = "text", placeholder, value, onChange, minLength = 3, className,
  externalStatus = null, errorMessage = "", rightElement = null, autoFocus = false, ...props 
}: any) => {
  const [internalStatus, setInternalStatus] = useState<'idle' | 'typing' | 'loading' | 'valid'>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const status = externalStatus || internalStatus;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
        // Pequeno delay para garantir a transição de montagem
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [autoFocus]);

  useEffect(() => {
    if (externalStatus !== null) return;
    if (!value) {
      setInternalStatus('idle');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }
    setInternalStatus('typing');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setInternalStatus('loading');
      setTimeout(() => {
        if (value.length >= minLength) setInternalStatus('valid');
        else setInternalStatus('idle');
      }, 400); 
    }, 500); 
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [value, minLength, externalStatus]);

  return (
    <div className="group relative w-full">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-brand-DEFAULT transition-colors">
          <Icon size={24} strokeWidth={1.5} />
      </div>
      
      <input 
        ref={inputRef}
        type={type} 
        name={name}
        required
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
            "w-full bg-white/5 border border-white/10 rounded-xl py-6 pl-14 pr-14 text-lg md:text-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-brand-DEFAULT/50 focus:bg-white/10 transition-all selection:bg-brand-DEFAULT selection:text-white",
            status === 'error' && "border-red-500/50 text-red-100 bg-red-900/10",
            className
        )}
        {...props}
      />
      
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center gap-2">
          {rightElement}
          
          <AnimatePresence mode="wait">
            {!rightElement && status === 'loading' && (
              <motion.div key="loader" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <Loader2 size={20} className="animate-spin text-neutral-500" />
              </motion.div>
            )}
            {!rightElement && status === 'valid' && (
              <motion.div key="success" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <CheckCircle2 size={22} className="text-emerald-500" />
              </motion.div>
            )}
            {status === 'error' && (
               <motion.div key="error" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                 <XCircle size={22} className="text-red-500" />
               </motion.div>
            )}
          </AnimatePresence>
      </div>

      <AnimatePresence>
        {status === 'error' && errorMessage && (
            <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 8 }} exit={{ opacity: 0, height: 0, marginTop: 0 }} className="overflow-hidden">
                <p className="text-red-400 text-sm flex items-center gap-1.5 px-2"><AlertCircle size={12} /> {errorMessage}</p>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const WelcomeView: React.FC<WelcomeViewProps> = ({ onStart, onAdminClick, onBack }) => {
  // === STATE MANAGEMENT ===
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = Next, -1 = Back
  
  const [formData, setFormData] = useState<ClientData>({
    name: '', location: '', date: '', contact: ''
  });
  
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [dateStatus, setDateStatus] = useState<'idle' | 'loading' | 'valid' | 'error'>('idle');
  const [dateMessage, setDateMessage] = useState('');
  const dateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const today = new Date().toLocaleDateString('en-CA');

  // === STEPS CONFIGURATION ===
  const steps = [
      {
          id: 'identity',
          title: 'Primeiro, como podemos te chamar?',
          subtitle: 'Nome pessoal ou da sua empresa.',
          field: 'name',
          icon: User,
          placeholder: 'Digite seu nome...',
          minLength: 3
      },
      {
          id: 'logistics',
          title: 'Onde será o evento?',
          subtitle: 'Usaremos para calcular a logística.',
          field: 'location',
          icon: MapPin,
          placeholder: 'Cidade ou Endereço...',
          minLength: 4
      },
      {
          id: 'availability',
          title: 'Qual a data prevista?',
          subtitle: 'Verificaremos nossa agenda.',
          field: 'date',
          icon: Calendar,
          placeholder: '',
          type: 'date'
      },
      {
          id: 'contact',
          title: 'Seu WhatsApp para contato',
          subtitle: 'Enviaremos o orçamento final por lá.',
          field: 'contact',
          icon: Smartphone,
          placeholder: '(XX) 9XXXX-XXXX',
          type: 'tel',
          minLength: 8
      }
  ];

  // === HANDLERS ===

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'contact') {
        const numericValue = value.replace(/\D/g, ''); 
        if (numericValue.length > 15) return;
        setFormData({ ...formData, [name]: numericValue });
        return;
    }

    if (name === 'date') {
        if (value && value < today) {
            setDateStatus('error');
            setDateMessage("A data não pode ser anterior a hoje.");
            setFormData({ ...formData, [name]: value });
            return;
        }
        if (!value) {
            setDateStatus('idle');
            setFormData({ ...formData, [name]: value });
            return;
        }
        // Async Check
        setDateStatus('loading');
        if (dateTimeoutRef.current) clearTimeout(dateTimeoutRef.current);
        dateTimeoutRef.current = setTimeout(async () => {
            const result = await CalendarService.checkAvailability(value);
            if (result.available) {
                setDateStatus('valid');
                setDateMessage('');
            } else {
                setDateStatus('error');
                setDateMessage(result.message || "Data indisponível");
            }
        }, 500); 
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (address: string) => {
      setFormData(prev => ({ ...prev, location: address }));
  };

  const handleNext = () => {
      if (!isStepValid()) return;

      if (currentStep < steps.length - 1) {
          setDirection(1);
          setCurrentStep(curr => curr + 1);
      } else {
          onStart(formData);
      }
  };

  const handleBackStep = () => {
      if (currentStep > 0) {
          setDirection(-1);
          setCurrentStep(curr => curr - 1);
      } else if (onBack) {
          onBack();
      }
  };

  // === VALIDATION LOGIC ===
  const isStepValid = (): boolean => {
      const step = steps[currentStep];
      const value = formData[step.field as keyof ClientData];

      if (step.id === 'availability') {
          return !!value && dateStatus === 'valid';
      }
      
      if (step.id === 'logistics') {
          return (value?.length || 0) >= (step.minLength || 0);
      }

      return (value?.length || 0) >= (step.minLength || 0);
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  // Intercepta Enter para avançar
  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && isStepValid()) {
          handleNext();
      }
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden px-6 py-12">
      
      {/* Botão Voltar Absoluto */}
      <div className="fixed top-8 left-8 z-[60]">
        <button 
            onClick={handleBackStep}
            className="text-neutral-500 hover:text-white flex items-center gap-2 transition-colors text-xs uppercase tracking-wider bg-black/20 p-2.5 rounded-full hover:bg-white/10 border border-transparent hover:border-white/10"
        >
             {currentStep === 0 ? <ArrowLeft size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        
        {/* LOGO & PROGRESS */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-12 text-center w-full"
        >
            <div className="flex justify-center mb-8">
                <Logo className="w-48 md:w-56" />
            </div>

            {/* Progress Bar Minimalista */}
            <div className="flex items-center gap-2 max-w-[200px] mx-auto">
                {steps.map((_, idx) => (
                    <div key={idx} className="h-1 flex-1 rounded-full overflow-hidden bg-white/10">
                        <motion.div 
                            className="h-full bg-brand-DEFAULT"
                            initial={{ width: "0%" }}
                            animate={{ width: idx <= currentStep ? "100%" : "0%" }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                ))}
            </div>
            <p className="text-[10px] text-neutral-500 font-mono mt-3 uppercase tracking-widest">
                Passo {currentStep + 1} de {steps.length}
            </p>
        </motion.div>

        {/* STEP CONTENT (WIZARD) */}
        <div className="w-full min-h-[300px] relative">
            <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div 
                    key={currentStep}
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 w-full"
                >
                    <div className="flex flex-col items-center text-center space-y-8">
                        
                        <div className="space-y-2">
                            <h2 className="text-2xl md:text-3xl font-serif text-white leading-tight">
                                {currentStepData.title}
                            </h2>
                            <p className="text-neutral-400 text-sm md:text-base font-light">
                                {currentStepData.subtitle}
                            </p>
                        </div>

                        <div className="w-full relative" onKeyDown={handleKeyDown}>
                            <SmartInput 
                                autoFocus
                                icon={currentStepData.icon}
                                name={currentStepData.field}
                                type={currentStepData.type || 'text'}
                                placeholder={currentStepData.placeholder}
                                value={formData[currentStepData.field as keyof ClientData]}
                                onChange={handleChange}
                                minLength={currentStepData.minLength}
                                externalStatus={currentStepData.id === 'availability' ? (!formData.date ? 'idle' : dateStatus) : null}
                                errorMessage={currentStepData.id === 'availability' ? dateMessage : ''}
                                rightElement={currentStepData.id === 'logistics' && (
                                    <button 
                                        type="button"
                                        onClick={() => setIsMapOpen(true)}
                                        className="bg-white/10 hover:bg-brand-DEFAULT hover:text-white text-neutral-400 p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-medium border border-white/10"
                                        title="Abrir Mapa"
                                    >
                                        <MapIcon size={16} />
                                        <span className="hidden sm:inline">Mapa</span>
                                    </button>
                                )}
                                // Estilização especial para date picker
                                className={currentStepData.type === 'date' ? "[&::-webkit-calendar-picker-indicator]:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20viewBox%3D%220%200%2024%2024%22%3E%3Crect%20x%3D%223%22%20y%3D%224%22%20width%3D%2218%22%20height%3D%2218%22%20rx%3D%222%22%20ry%3D%222%22%2F%3E%3Cline%20x1%3D%2216%22%20y1%3D%222%22%20x2%3D%2216%22%20y2%3D%226%22%2F%3E%3Cline%20x1%3D%228%22%20y1%3D%222%22%20x2%3D%228%22%20y2%3D%226%22%2F%3E%3Cline%20x1%3D%223%22%20y1%3D%2210%22%20x2%3D%2221%22%20y2%3D%2210%22%2F%3E%3C%2Fsvg%3E')] [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer" : ""}
                            />
                            
                            {/* Dica contextual */}
                            {currentStepData.id === 'logistics' && (
                                <p className="text-[10px] text-neutral-500 mt-2 flex items-center justify-center gap-1.5 opacity-60">
                                    <Info size={10} /> O valor do frete será calculado automaticamente.
                                </p>
                            )}
                        </div>

                        <div className="w-full pt-4">
                            <Button 
                                onClick={handleNext}
                                disabled={!isStepValid()}
                                className={cn(
                                    "w-full h-14 text-base transition-all duration-300",
                                    isStepValid() 
                                        ? "shadow-[0_0_20px_var(--brand-glow)] translate-y-0" 
                                        : "opacity-30 translate-y-2 cursor-not-allowed grayscale"
                                )}
                            >
                                <span className="mr-2">{isLastStep ? "Gerar Orçamento" : "Continuar"}</span>
                                <ArrowRight size={20} />
                            </Button>
                        </div>

                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
      </div>

      <LocationMapModal 
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelectLocation={handleLocationSelect}
        initialAddress={formData.location}
      />
    </div>
  );
};

export default WelcomeView;
