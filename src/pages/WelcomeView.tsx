
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, User, Smartphone, CheckCircle2, Loader2, XCircle, AlertCircle, Map as MapIcon, Lock } from 'lucide-react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';
import LocationMapModal from '../components/ui/LocationMapModal';
import { ClientData } from '../types';
import { checkDateAvailability } from '../lib/calendar';

interface WelcomeViewProps {
  onStart: (data: ClientData) => void;
  onAdminClick?: () => void;
}

// Variantes para a sequência de entrada "Cinematográfica"
const introContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4, 
      delayChildren: 0.2
    }
  }
};

const logoVariant: Variants = {
  hidden: { 
    opacity: 0, 
    y: 180, 
    scale: 1.1 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 1.5, 
      ease: [0.25, 0.1, 0.25, 1.0] 
    } 
  }
};

const formVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1.0, ease: "easeOut" } 
  }
};

// Sub-componente SmartInput Melhorado
const SmartInput = ({ 
  icon: Icon, 
  name, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  minLength = 3,
  className,
  externalStatus = null, // 'loading', 'valid', 'error', 'idle' ou null (para usar lógica interna)
  errorMessage = "",
  rightElement = null, // Elemento opcional na direita (ex: botão mapa)
  ...props // Permite passar outras props como 'min', 'max', etc.
}: any) => {
  const [internalStatus, setInternalStatus] = useState<'idle' | 'typing' | 'loading' | 'valid'>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Se receber status externo, usa ele. Se não, usa lógica interna.
  const status = externalStatus || internalStatus;

  useEffect(() => {
    // Se houver status externo controlado pelo pai, ignoramos a lógica interna de validação simples
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
        if (value.length >= minLength) {
          setInternalStatus('valid');
        } else {
          setInternalStatus('idle');
        }
      }, 800);

    }, 1000); 

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, minLength, externalStatus]);

  // Ajusta o padding-right se houver elemento extra
  const paddingRight = rightElement ? 'pr-20' : 'pr-8';

  return (
    <div className="group relative">
      <Icon className="absolute left-0 top-3 text-neutral-500 group-focus-within:text-brand-DEFAULT transition-colors" size={20} />
      <input 
        type={type} 
        name={name}
        required
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-transparent border-b border-white/20 py-3 pl-8 ${paddingRight} text-white focus:outline-none focus:border-brand-DEFAULT transition-colors placeholder:text-neutral-600 ${className} ${status === 'error' ? 'border-red-500/50 text-red-100' : ''}`}
        {...props}
      />
      
      {/* Elemento Opcional (Botão Mapa) */}
      {rightElement && (
          <div className="absolute right-0 top-1.5 z-20">
              {rightElement}
          </div>
      )}

      {/* Ícones de Status (Só aparecem se não houver elemento direito ocupando espaço ou se o status for crítico) */}
      <AnimatePresence mode="wait">
        {!rightElement && status === 'loading' && (
          <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute right-0 top-3 text-neutral-400"
          >
            <Loader2 size={18} className="animate-spin" />
          </motion.div>
        )}

        {!rightElement && status === 'valid' && (
          <motion.div
            key="success"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="absolute right-0 top-3 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
          >
            <CheckCircle2 size={20} />
          </motion.div>
        )}

        {status === 'error' && (
           <motion.div
             key="error"
             initial={{ scale: 0, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0, opacity: 0 }}
             className={`absolute top-3 text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)] ${rightElement ? 'right-10' : 'right-0'}`}
           >
             <XCircle size={20} />
           </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mensagem de Erro Abaixo do Input */}
      <AnimatePresence>
        {status === 'error' && errorMessage && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
            >
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={10} /> {errorMessage}
                </p>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const WelcomeView: React.FC<WelcomeViewProps> = ({ onStart, onAdminClick }) => {
  const [formData, setFormData] = useState<ClientData>({
    name: '',
    location: '',
    date: '',
    contact: ''
  });

  // Estado para controlar Modal do Mapa
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Estados específicos para validação de data
  const [dateStatus, setDateStatus] = useState<'idle' | 'loading' | 'valid' | 'error'>('idle');
  const [dateMessage, setDateMessage] = useState('');
  const dateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // CORREÇÃO DATA MOBILE: Calcula a data local (Brazil) para o atributo 'min'.
  const today = new Date().toLocaleDateString('en-CA');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Lógica Específica para Data
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

        setDateStatus('loading');
        if (dateTimeoutRef.current) clearTimeout(dateTimeoutRef.current);

        // Debounce para API
        dateTimeoutRef.current = setTimeout(async () => {
            const result = await checkDateAvailability(value);
            if (result.available) {
                setDateStatus('valid');
                setDateMessage('');
            } else {
                setDateStatus('error');
                setDateMessage(result.message || "Data indisponível");
            }
        }, 800);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (address: string) => {
      setFormData(prev => ({ ...prev, location: address }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.contact && dateStatus === 'valid') {
      onStart(formData);
    }
  };

  const isFormValid = formData.name.length > 2 && 
                      formData.location.length > 3 && 
                      formData.date.length > 0 && 
                      dateStatus === 'valid' &&
                      formData.contact.length > 5;

  return (
    // REMOVIDO: bg-neutral-950
    <div className="w-full min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden px-6 py-12">
      
      {/* Botão de Admin Discreto */}
      {onAdminClick && (
        <button 
          onClick={onAdminClick}
          className="absolute top-4 right-4 z-50 p-2 text-white/5 hover:text-white/20 transition-colors"
          title="Admin Access"
        >
          <Lock size={16} />
        </button>
      )}

      {/* Background Decorativo - Gradiente transparente */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-950/60 to-black z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-DEFAULT/5 rounded-full blur-[150px] pointer-events-none" />

      <motion.div 
        variants={introContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        <motion.div variants={logoVariant} className="flex justify-center mb-8 md:mb-10">
          <Logo className="w-56 md:w-80" animate />
        </motion.div>

        <motion.form 
          variants={formVariant}
          onSubmit={handleSubmit}
          className="space-y-6 md:space-y-8 bg-black/40 p-6 md:p-8 rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl relative"
        >
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Cabeçalho Ajustado com Restrição de Largura */}
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-lg md:text-xl text-white font-medium">Novo Orçamento</h2>
            <p className="text-xs text-neutral-500 uppercase tracking-widest font-medium mt-1 w-full text-center">(Preencha corretamente)</p>
          </div>

          <div className="space-y-4 md:space-y-5">
            <SmartInput 
              icon={User}
              name="name"
              placeholder="Seu Nome ou Empresa"
              value={formData.name}
              onChange={handleChange}
              minLength={3}
            />

            <SmartInput 
              icon={MapPin}
              name="location"
              placeholder="Cidade / Local do Evento"
              value={formData.location}
              onChange={handleChange}
              minLength={4}
              rightElement={
                <button 
                  type="button"
                  onClick={() => setIsMapOpen(true)}
                  className="bg-white/10 hover:bg-brand-DEFAULT/20 hover:text-brand-DEFAULT text-neutral-400 p-2 rounded-md transition-all flex items-center gap-1.5 text-xs font-medium border border-white/10"
                  title="Abrir Mapa"
                >
                  <MapIcon size={14} />
                  <span>Mapa</span>
                </button>
              }
            />

            <SmartInput 
              icon={Calendar}
              name="date"
              type="date"
              placeholder=""
              value={formData.date}
              onChange={handleChange}
              min={today}
              externalStatus={!formData.date ? 'idle' : dateStatus}
              errorMessage={dateMessage}
              className="[&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />

            <SmartInput 
              icon={Smartphone}
              name="contact"
              placeholder="Whatsapp ou Email"
              value={formData.contact}
              onChange={handleChange}
              minLength={5}
            />
          </div>

          <motion.div
            variants={formVariant}
            className="pt-4"
          >
            <motion.div
              className="rounded-full"
              animate={isFormValid ? {
                boxShadow: [
                  "0 0 0px rgba(220, 38, 38, 0)",
                  "0 0 25px rgba(220, 38, 38, 0.5)",
                  "0 0 0px rgba(220, 38, 38, 0)"
                ]
              } : { boxShadow: "0 0 0px rgba(0,0,0,0)" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Button 
                className={`w-full group ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`} 
                size="lg"
                disabled={!isFormValid}
              >
                <span className="mr-2 text-sm md:text-base">Visualizar Orçamento</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.form>

        <motion.p variants={formVariant} className="text-center text-neutral-600 text-xs md:text-sm mt-8">
          Experiência Audiovisual High-End
        </motion.p>
      </motion.div>

      {/* Modal de Mapa */}
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
