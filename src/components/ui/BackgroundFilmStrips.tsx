
import React, { useId } from 'react';
import { motion } from 'framer-motion';

/**
 * RealisticFilmStripTexture
 * -------------------------
 * Textura procedural de filme 35mm com simulação de volume cilíndrico.
 * 
 * TÉCNICAS DE VOLUME (CURVAS):
 * 1. Gradiente Cilíndrico (Sheen): Um highlight fino e intenso no centro-direita simula a crista da curva.
 * 2. Sombras de Borda (Fresnel Darkening): As bordas escurecem drasticamente para simular a superfície virando para trás.
 * 3. Iluminação de Borda (Rim Light): Uma linha fina de luz nas extremidades para separar do fundo.
 */
const RealisticFilmStripTexture = ({ 
    className, 
    speed = 10, 
    direction = 1, 
    opacity = 1,
    perspective = false
}: { 
    className?: string, 
    speed?: number, 
    direction?: number, 
    opacity?: number,
    perspective?: boolean
}) => {
  const uniqueId = useId().replace(/:/g, ''); 
  const patternId = `film-pattern-${uniqueId}`;
  const sheenId = `sheen-${uniqueId}`;
  const curvatureId = `curvature-${uniqueId}`;
  const frameGradId = `frame-grad-${uniqueId}`;

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ opacity }}>
        
        {/* RIM LIGHTS (Luz de Borda) - Crucial para destacar a silhueta curva no preto */}
        <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-cyan-500/20 via-white/40 to-cyan-500/20 blur-[1px] z-30 mix-blend-screen" />
        <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-red-500/20 via-white/40 to-red-500/20 blur-[1px] z-30 mix-blend-screen" />

        <svg
          viewBox="0 0 140 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full block"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Gradiente Metálico do Frame (Interno) */}
            <linearGradient id={frameGradId} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#222" />
                <stop offset="50%" stopColor="#333" />
                <stop offset="100%" stopColor="#1a1a1a" />
            </linearGradient>

            {/* PADRÃO DA FITA */}
            <pattern id={patternId} x="0" y="0" width="140" height="90" patternUnits="userSpaceOnUse">
              <rect width="140" height="90" fill="#050505" />
              
              {/* Frame com cantos levemente mais arredondados */}
              <rect x="24" y="8" width="92" height="74" rx="3" fill={`url(#${frameGradId})`} stroke="#444" strokeWidth="0.5" />
              
              {/* Reflexo de Vidro no Frame */}
              <path d="M 24 82 L 116 8 L 116 45 L 24 110 Z" fill="white" fillOpacity="0.04" />

              {/* Sprockets (Furos) */}
              <g fill="#eeeeee" fillOpacity="0.9">
                  <rect x="7" y="12" width="9" height="14" rx="2" />
                  <rect x="7" y="42" width="9" height="14" rx="2" />
                  <rect x="7" y="72" width="9" height="14" rx="2" />
              </g>

              <g fill="#eeeeee" fillOpacity="0.9">
                  <rect x="124" y="12" width="9" height="14" rx="2" />
                  <rect x="124" y="42" width="9" height="14" rx="2" />
                  <rect x="124" y="72" width="9" height="14" rx="2" />
              </g>
            </pattern>

            {/* 
               GRADIENTE DE CURVATURA (MAPA DE VOLUME) 
               Simula a forma cilíndrica da fita.
               Escuro nas bordas -> Claro no "pico" da curva -> Escuro na outra borda.
            */}
            <linearGradient id={curvatureId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="black" stopOpacity="0.9" />   {/* Borda Esquerda (Sombra Profunda) */}
                <stop offset="15%" stopColor="black" stopOpacity="0.4" />
                <stop offset="30%" stopColor="black" stopOpacity="0.1" />  {/* Início da Curva iluminada */}
                <stop offset="50%" stopColor="black" stopOpacity="0" />    {/* Centro Plano */}
                <stop offset="70%" stopColor="black" stopOpacity="0.1" />
                <stop offset="85%" stopColor="black" stopOpacity="0.5" />
                <stop offset="100%" stopColor="black" stopOpacity="0.9" /> {/* Borda Direita (Sombra Profunda) */}
            </linearGradient>

            {/* 
               REFLEXO ESPECULAR (ANISOTRÓPICO)
               O brilho "plástico" concentrado em uma linha vertical.
            */}
            <linearGradient id={sheenId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="35%" stopColor="white" stopOpacity="0" />
                <stop offset="42%" stopColor="white" stopOpacity="0.05" />
                <stop offset="45%" stopColor="white" stopOpacity="0.3" />  {/* Highlight Principal */}
                <stop offset="48%" stopColor="white" stopOpacity="0.05" />
                <stop offset="60%" stopColor="white" stopOpacity="0" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

          </defs>

          {/* CAMADA 1: CONTEÚDO (Móvel) */}
          <motion.rect 
            x="0"
            y="-90"
            width="140" 
            height="300%"
            fill={`url(#${patternId})`}
            animate={{ 
              y: direction > 0 ? [0, -90] : [-90, 0] 
            }}
            transition={{ 
              repeat: Infinity, 
              ease: "linear", 
              duration: speed 
            }}
          />

          {/* CAMADA 2: REFLEXO PLÁSTICO (Fixo) */}
          <rect 
            width="100%" 
            height="100%" 
            fill={`url(#${sheenId})`} 
            style={{ mixBlendMode: 'screen' }} 
            pointerEvents="none" 
          />
          
          {/* CAMADA 3: SOMBRA DE VOLUME (Curvatura Geométrica) */}
          {/* Multiplica as sombras sobre a fita para "arredondar" as bordas */}
          <rect width="100%" height="100%" fill={`url(#${curvatureId})`} style={{ mixBlendMode: 'multiply' }} pointerEvents="none" />

        </svg>
    </div>
  );
};

const BackgroundFilmStrips: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden h-screen w-screen bg-[#050505]">
      
      {/* Backlight Volumétrico Global */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-DEFAULT/10 blur-[120px] rounded-full opacity-60 mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-900/10 blur-[150px] rounded-full opacity-50 mix-blend-screen" />

      {/* FITA ESQUERDA - Afastada para a borda */}
      <div 
        className="absolute -top-[10%] left-[-5%] md:left-[2%] w-28 md:w-44 h-[120vh]"
        style={{
            transform: 'perspective(500px) rotateY(25deg) rotateZ(-8deg) translateZ(50px)',
            filter: 'drop-shadow(20px 20px 40px black)'
        }}
      >
         <RealisticFilmStripTexture className="h-full w-full" speed={28} direction={1} opacity={1} />
      </div>

      {/* FITA DIREITA - Afastada para a borda */}
      <div 
        className="absolute -top-[10%] right-[-15%] md:right-[-2%] w-32 md:w-48 h-[120vh]"
        style={{
            transform: 'perspective(600px) rotateY(-30deg) rotateZ(-4deg) translateZ(0)',
            filter: 'drop-shadow(-20px 20px 40px black)'
        }}
      >
         <RealisticFilmStripTexture className="h-full w-full" speed={22} direction={-1} opacity={0.8} />
      </div>

      {/* Vignette Global de Câmera */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#000_100%)] z-10 opacity-90" />
      
      {/* Noise Texture para realismo de filme */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
    </div>
  );
};

export default BackgroundFilmStrips;
