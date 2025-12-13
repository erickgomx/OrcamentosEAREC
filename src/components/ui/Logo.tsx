import React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '../../lib/utils';

// DEFINIÇÃO DO CAMINHO DA IMAGEM
// ---------------------------------------------------------------------------
// Usamos um caminho absoluto (começando com /) para referenciar a imagem.
// Isso funciona porque a pasta 'src' é servida publicamente pelo servidor de desenvolvimento.
// O erro anterior "Invalid URL" ocorria ao tentar usar 'new URL()' com 'import.meta.url'
// em ambientes que não suportam essa funcionalidade nativamente.
const logoSrc = './src/assets/logo.png';

interface LogoProps {
  className?: string; // Classes CSS opcionais para ajustar tamanho (ex: w-32, h-auto)
  animate?: boolean;  // Se 'true', ativa a animação de entrada (fade-in + scale)
}

/**
 * Componente: Logo
 * ----------------
 * Responsável por renderizar a marca da empresa.
 * Possui tratamento de erro caso a imagem não seja encontrada e suporte a animações.
 */
const Logo: React.FC<LogoProps> = ({ className, animate = false }) => {
  
  // Configuração das animações usando a biblioteca Framer Motion
  const imageVariants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      filter: 'blur(10px)' // Começa invisível, menor e desfocado
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      filter: 'blur(0px)', // Termina visível, tamanho normal e nítido
      transition: { 
        duration: 1.2, 
        ease: [0.22, 1, 0.36, 1] // Curva de animação suave (cinematográfica)
      } 
    }
  };

  // RENDERIZAÇÃO SEM ANIMAÇÃO
  // Usada no cabeçalho ou onde a logo deve aparecer instantaneamente.
  if (!animate) {
    return (
      <div className={cn("relative select-none", className)}>
        <img 
          src={logoSrc} 
          alt="EAREC Logo" 
          className="w-full h-auto object-contain"
          onError={(e) => {
            // Caso a imagem não carregue (arquivo faltando), avisa no console
            console.warn("A imagem da logo falhou ao carregar em:", logoSrc);
            // Opcional: Diminui a opacidade para indicar erro visualmente sem quebrar o layout
            e.currentTarget.style.opacity = '0.5';
          }}
        />
      </div>
    );
  }

  // RENDERIZAÇÃO COM ANIMAÇÃO
  // Usada na tela de boas-vindas (WelcomeView) para impacto visual.
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={imageVariants}
      className={cn("relative select-none", className)}
    >
      <img 
        src={logoSrc} 
        alt="EAREC Logo" 
        // Adiciona uma sombra suave (drop-shadow) para destacar do fundo escuro
        className="w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        onError={(e) => {
           console.warn("A imagem da logo falhou ao carregar em:", logoSrc);
        }}
      />
    </motion.div>
  );
};

export default Logo;