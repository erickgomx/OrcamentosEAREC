
import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../../lib/animations';
import { cn } from '../../lib/utils';

interface MoodboardProps {
  images: string[];
}

const Moodboard: React.FC<MoodboardProps> = ({ images }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Hooks para o efeito Parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Suavização do scroll para o movimento parecer "pesado" e cinematográfico
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  // CONFIGURAÇÃO DO MOVIMENTO "CRUZADO" (CROSS-PARALLAX)
  // Coluna 1: Começa baixo, sobe rápido (Movimento padrão acelerado)
  const yCol1 = useTransform(smoothProgress, [0, 1], [100, -150]);
  
  // Coluna 2: Começa alto, desce levemente (Resistência oposta -> Efeito de Cruzamento)
  // Isso faz com que a coluna do meio pareça estar indo "contra" as laterais
  const yCol2 = useTransform(smoothProgress, [0, 1], [-150, 100]);
  
  // Coluna 3: Igual a coluna 1, mas com um offset para não ficar simétrico demais
  const yCol3 = useTransform(smoothProgress, [0, 1], [150, -200]);

  // Divisão das imagens em colunas
  const col1 = images.filter((_, i) => i % 3 === 0);
  const col2 = images.filter((_, i) => i % 3 === 1);
  const col3 = images.filter((_, i) => i % 3 === 2);

  const renderImage = (src: string, originalIndex: number, priority: boolean = false) => (
    <motion.div
      key={originalIndex}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8 }}
      className="relative group mb-8 md:mb-12 w-full"
      onMouseEnter={() => setHoveredIndex(originalIndex)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
        {/* Container da Imagem com Aspect Ratio Vertical (Cinematic Portrait) */}
        <div className="relative overflow-hidden rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5">
            {/* Overlay Escuro que some no Hover */}
            <div className={cn(
                "absolute inset-0 bg-black/40 z-10 transition-all duration-700 ease-in-out",
                hoveredIndex === null ? "opacity-40" : hoveredIndex === originalIndex ? "opacity-0" : "opacity-80 grayscale"
            )} />
            
            <img 
                src={src} 
                alt={`Moodboard ${originalIndex}`} 
                className="w-full h-auto object-cover transform transition-transform duration-1000 ease-out group-hover:scale-105"
                loading={priority ? "eager" : "lazy"}
            />
            
            {/* Bordas Brilhantes no Hover */}
            <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-all duration-700 pointer-events-none z-20" />
        </div>
    </motion.div>
  );

  return (
    <section ref={containerRef} className="py-32 px-6 md:px-12 bg-neutral-950 relative overflow-hidden">
      
      {/* Background Decorativo Sutil */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-24 relative z-20 text-center md:text-left"
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-4 justify-center md:justify-start mb-4">
             <div className="h-px w-12 bg-brand-DEFAULT shadow-[0_0_10px_#DC2626]" />
             <span className="text-brand-DEFAULT uppercase tracking-widest text-xs font-bold drop-shadow-md">Direção de Arte</span>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-6xl text-white mb-6 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            Estética Visual
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-neutral-400 max-w-xl text-lg font-light leading-relaxed mx-auto md:mx-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Uma curadoria de referências visuais que definem o tom, a iluminação e a atmosfera cinematográfica do seu projeto.
          </motion.p>
        </motion.div>

        {/* 
            GRID CINEMATOGRÁFICO CRUZADO 
            Desktop: 3 Colunas com Parallax Oposto
            Mobile: 1 Coluna simples (sem parallax agressivo para usabilidade)
        */}
        <div className="hidden md:grid grid-cols-3 gap-8 min-h-[800px]">
            {/* Coluna 1: Sobe Rápido */}
            <motion.div style={{ y: yCol1 }} className="flex flex-col pt-12">
                {col1.map((src, i) => renderImage(src, i * 3))}
            </motion.div>

            {/* Coluna 2: Desce (Contra-fluxo) - Cria o efeito de cruzamento */}
            <motion.div style={{ y: yCol2 }} className="flex flex-col -mt-24">
                 {col2.map((src, i) => renderImage(src, i * 3 + 1, true))}
            </motion.div>

            {/* Coluna 3: Sobe Muito Rápido */}
            <motion.div style={{ y: yCol3 }} className="flex flex-col pt-32">
                 {col3.map((src, i) => renderImage(src, i * 3 + 2))}
            </motion.div>
        </div>

        {/* Layout Mobile (Simples, sem risco de quebra) */}
        <div className="md:hidden grid grid-cols-1 gap-6">
             {images.map((src, i) => renderImage(src, i))}
        </div>

      </div>
    </section>
  );
};

export default Moodboard;
