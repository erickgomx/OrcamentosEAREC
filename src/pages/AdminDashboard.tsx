
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Save, DollarSign, LogOut, ShieldAlert, Loader2, KeyRound } from 'lucide-react';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import { QuoteData } from '../types';
import { fadeInUp, staggerContainer } from '../lib/animations';
import { formatCurrency } from '../lib/utils';
import { AuthService } from '../services/AuthService';

interface AdminDashboardProps {
  currentConfig: QuoteData;
  onUpdateConfig: (newConfig: QuoteData) => void;
  onExit: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentConfig, onUpdateConfig, onExit }) => {
  // Estado de Autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Estados de Segurança e Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  // Estado do Formulário de Edição
  const [formData, setFormData] = useState({
    basePrice: currentConfig.basePrice,
    studioFee: currentConfig.studioFee,
    photoUnitPrice: currentConfig.photoUnitPrice,
    videoUnitPrice: currentConfig.videoUnitPrice,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError('');
    setIsLoading(true);

    // Adiciona delay artificial via AuthService
    await AuthService.securityDelay();

    const isValid = await AuthService.verify(password);

    if (isValid) {
      setIsAuthenticated(true);
      setError('');
      setAttempts(0);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setIsLoading(false);
      setPassword('');

      // Lógica de Expulsão (3 tentativas erradas)
      if (newAttempts >= 3) {
        onExit();
      } else {
        setError(`Senha incorreta. Tentativas restantes: ${3 - newAttempts}`);
      }
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSave = () => {
    onUpdateConfig({
      ...currentConfig,
      ...formData
    });
    alert('Configurações salvas com segurança!');
  };

  // TELA DE LOGIN (SECURE GATE)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Fundo dinâmico */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black z-0" />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 w-full max-w-sm bg-neutral-900/80 border border-white/5 p-8 rounded-2xl backdrop-blur-xl shadow-2xl"
        >
          <div className="flex justify-center mb-8">
            <motion.div 
                key="normal"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="p-4 bg-brand-DEFAULT/10 rounded-full text-brand-DEFAULT shadow-[0_0_20px_var(--brand-glow)]"
            >
                <Lock size={32} />
            </motion.div>
          </div>
          
          <h2 className="text-2xl font-serif text-white text-center mb-2">
            Acesso Restrito
          </h2>
          <p className="text-neutral-500 text-center text-sm mb-8">
            Área exclusiva para administradores.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2 relative">
              <div className="absolute left-3 top-3.5 text-neutral-500">
                <KeyRound size={18} />
              </div>
              <input 
                type="password" 
                placeholder="Senha Mestre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className={`w-full bg-neutral-950 border rounded-lg pl-10 pr-4 py-3 text-white transition-colors focus:outline-none
                  ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-brand-DEFAULT'}
                `}
                autoFocus
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-xs pl-1 bg-red-500/10 p-2 rounded"
              >
                <ShieldAlert size={12} />
                <span>{error}</span>
              </motion.div>
            )}
            
            <div className="flex gap-3 pt-2">
               <Button 
                type="button" 
                variant="secondary" 
                className="w-1/3"
                onClick={onExit}
                disabled={isLoading}
               >
                 Voltar
               </Button>
               <Button 
                type="submit" 
                className="w-2/3 relative"
                disabled={isLoading}
               >
                 {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Autenticar"}
               </Button>
            </div>
          </form>
        </motion.div>
        
        <div className="mt-8 text-neutral-600 text-xs flex flex-col items-center gap-1">
            <p>Protected by SHA-256 Encryption</p>
            <p className="opacity-50">EAREC Secure System v1.0.2</p>
        </div>
      </div>
    );
  }

  // TELA DE DASHBOARD (Acesso concedido)
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      <header className="border-b border-white/5 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo className="w-24" />
            <div className="hidden md:flex items-center gap-4">
               <span className="h-6 w-px bg-white/10" />
               <span className="text-sm font-medium text-neutral-400">Admin Mode</span>
               <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20 flex items-center gap-1">
                 <Lock size={10} /> Secure Connection
               </span>
            </div>
          </div>
          <button 
            onClick={onExit}
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-full hover:bg-white/5"
          >
            <LogOut size={16} />
            Sair com Segurança
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-12 px-6">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-serif mb-2">Configuração de Preços</h1>
              <p className="text-neutral-400">Ajuste os valores base utilizados no cálculo automático dos orçamentos.</p>
            </div>
            <div className="p-3 bg-brand-DEFAULT/10 rounded-lg text-brand-DEFAULT">
              <DollarSign size={24} />
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-white/5 border border-white/5 rounded-xl p-8 space-y-8 shadow-inner">
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-white/5">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Preço Base (Mobilização)</label>
                <p className="text-xs text-neutral-500">Valor mínimo para saída da equipe. Incluído em todos os orçamentos.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-neutral-500">R$</span>
                <input 
                  type="number" 
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-950 border border-white/10 rounded px-4 py-2 text-white focus:border-brand-DEFAULT focus:outline-none focus:ring-1 focus:ring-brand-DEFAULT transition-all"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-white/5">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Taxa de Estúdio</label>
                <p className="text-xs text-neutral-500">Adicional cobrado quando o cliente seleciona "Estúdio Controlado".</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-neutral-500">R$</span>
                <input 
                  type="number" 
                  name="studioFee"
                  value={formData.studioFee}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-950 border border-white/10 rounded px-4 py-2 text-white focus:border-brand-DEFAULT focus:outline-none focus:ring-1 focus:ring-brand-DEFAULT transition-all"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-white/5">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Preço por Foto</label>
                <p className="text-xs text-neutral-500">Valor unitário por fotografia tratada.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-neutral-500">R$</span>
                <input 
                  type="number" 
                  name="photoUnitPrice"
                  value={formData.photoUnitPrice}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-950 border border-white/10 rounded px-4 py-2 text-white focus:border-brand-DEFAULT focus:outline-none focus:ring-1 focus:ring-brand-DEFAULT transition-all"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Preço por Vídeo</label>
                <p className="text-xs text-neutral-500">Valor unitário por vídeo (1 min).</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-neutral-500">R$</span>
                <input 
                  type="number" 
                  name="videoUnitPrice"
                  value={formData.videoUnitPrice}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-950 border border-white/10 rounded px-4 py-2 text-white focus:border-brand-DEFAULT focus:outline-none focus:ring-1 focus:ring-brand-DEFAULT transition-all"
                />
              </div>
            </motion.div>

          </motion.div>

          <motion.div variants={fadeInUp} className="mt-8 flex justify-end gap-4">
            <Button variant="secondary" onClick={onExit}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save size={18} />
              Salvar Alterações
            </Button>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-12 p-6 bg-brand-DEFAULT/5 border border-brand-DEFAULT/10 rounded-lg">
            <h3 className="text-sm font-medium text-brand-DEFAULT mb-4">Simulação Atual</h3>
            <div className="flex justify-between text-sm text-neutral-400">
              <span>Orçamento Básico (Externo + 20 Fotos + 1 Vídeo):</span>
              <strong className="text-white">
                {formatCurrency(formData.basePrice + (20 * formData.photoUnitPrice) + (1 * formData.videoUnitPrice))}
              </strong>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
