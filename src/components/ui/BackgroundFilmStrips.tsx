
import React from 'react';

/**
 * SingleFilmFrame
 * ---------------
 * Renderiza APENAS UM QUADRO do filme (SVG estático).
 * Será repetido várias vezes para formar a roda.
 */
const SingleFilmFrame = ({ opacity = 1 }: { opacity?: number }) => {
  const frameGradId = `frame-grad-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full h-full relative" style={{ opacity }}>
       {/* Iluminação de Borda (Rim Light) - Silver */}
       <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-white/20 via-white/80 to-white/20 blur-[1px] z-20 mix-blend-overlay" />
       <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-white/10 via-white/50 to-white/10 blur-[1px] z-20 mix-blend-overlay" />

       <svg viewBox="0 0 140 90" fill="none" className="w-full h-full block">
          <defs>
            <linearGradient id={frameGradId} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1a1a1a" />
                <stop offset="40%" stopColor="#333333" />
                <stop offset="60%" stopColor="#222222" />
                <stop offset="100%" stopColor="#0a0a0a" />
            </linearGradient>
          </defs>

          {/* Fundo do Filme */}
          <rect width="140" height="90" fill="#050505" />

          {/* Frame da Foto (Interior) */}
          <rect x="24" y="8" width="92" height="74" rx="3" fill={`url(#${frameGradId})`} stroke="#444" strokeWidth="0.5" />
          
          {/* Reflexo Diagonal (Vidro) */}
          <path d="M 24 82 L 116 8 L 116 35 L 24 90 Z" fill="white" fillOpacity="0.04" />

          {/* Sprockets (Furos) - Prateados e Alinhados */}
          {/* Esquerda */}
          <rect x="8" y="10" width="8" height="12" rx="1.5" fill="#e5e5e5" fillOpacity="0.8" />
          <rect x="8" y="39" width="8" height="12" rx="1.5" fill="#e5e5e5" fillOpacity="0.8" />
          <rect x="8" y="68" width="8" height="12" rx="1.5" fill="#e5e5e5" fillOpacity="0.8" />

          {/* Direita */}
          <rect x="124" y="10" width="8" height="12" rx="1.5" fill="#e5e5e5" fillOpacity="0.8" />
          <rect x="124" y="39" width="8" height="12" rx="1.5" fill="#e5e5e5" fillOpacity="0.8" />
          <rect x="124" y="68" width="8" height="12" rx="1.5" fill="#e5e5e5" fillOpacity="0.8" />
       </svg>
    </div>
  );
};

/**
 * FilmWheel3D
 * -----------
 * Componente puro que cria o anel de frames.
 * AGORA SEM RESPONSABILIDADE DE POSICIONAMENTO.
 * Recebe apenas props de animação interna.
 */
const FilmWheel3D = ({ 
    speed = 80, 
    direction = 'normal' 
}: { 
    speed?: number, 
    direction?: 'normal' | 'reverse' 
}) => {
    const frameCount = 18; // Quantidade de frames no anel
    const radius = 600;    // Raio do anel
    const frameHeight = 160; // Altura aproximada de cada frame no DOM
    const angleStep = 360 / frameCount;

    return (
        <div style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
            <div 
                className="relative w-[180px] md:w-[240px] h-[200px]" // Container base
                style={{ 
                    transformStyle: 'preserve-3d',
                    animation: `spinWheel ${speed}s linear infinite ${direction}`
                }}
            >
                {/* Gerando os segmentos da roda */}
                {Array.from({ length: frameCount }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute top-0 left-0 w-full backface-hidden"
                        style={{
                            height: `${frameHeight}px`,
                            // Mágica 3D: Gira X graus e empurra para fora (Raio)
                            transform: `rotateX(${i * angleStep}deg) translateZ(${radius}px)`,
                            // Ajuste fino para não ver o verso
                            backfaceVisibility: 'hidden', 
                        }}
                    >
                        <SingleFilmFrame opacity={0.9} />
                    </div>
                ))}
            </div>

            {/* CSS In-JS para a animação de rotação */}
            <style>{`
                @keyframes spinWheel {
                    from { transform: rotateX(0deg); }
                    to { transform: rotateX(360deg); }
                }
                .backface-hidden {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
            `}</style>
        </div>
    );
};

const BackgroundFilmStrips: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden h-screen w-screen bg-neutral-100 dark:bg-[#0a0a0a] transition-colors duration-500">
      
      {/* Luzes Volumétricas de Fundo */}
      <div className="absolute top-[-20%] left-[10%] w-[800px] h-[800px] bg-slate-800/20 blur-[150px] rounded-full opacity-40 mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[10%] w-[800px] h-[800px] bg-neutral-800/30 blur-[180px] rounded-full opacity-30 mix-blend-screen" />

      {/* 
          RODA ESQUERDA 
          - Wrapper 1: Posicionamento e Escala (Tailwind)
          - Wrapper 2: Rotação 3D (Inline Style) - Isso previne conflito de transforms
          
          UPDATE: Scale massivo para 0.85 (Mobile) / 1.0 (Tablet)
          UPDATE: Position ajustado para -80px para mostrar mais as rodas (Menos escondidas)
      */}
      <div className="fixed top-1/2 -translate-y-1/2 -left-[80px] md:-left-[150px] lg:left-[0%] scale-[0.85] md:scale-[1.0] lg:scale-[1.1] transition-all duration-1000 origin-left">
          <div style={{ transform: 'rotateY(25deg) rotateZ(-8deg)' }}>
             <FilmWheel3D speed={80} direction="normal" />
          </div>
      </div>

      {/* 
          RODA DIREITA
          Simétrico à esquerda.
      */}
      <div className="fixed top-1/2 -translate-y-1/2 -right-[80px] md:-right-[150px] lg:right-[0%] scale-[0.85] md:scale-[1.05] lg:scale-[1.15] transition-all duration-1000 origin-right">
          <div style={{ transform: 'rotateY(-25deg) rotateZ(5deg)' }}>
             <FilmWheel3D speed={100} direction="reverse" />
          </div>
      </div>

      {/* Máscaras de Gradiente (Vignette) para suavizar as pontas das rodas */}
      {/* UPDATE: Opacidade reduzida (from-black/60 e from-black/40) para tornar os filmstrips mais visíveis */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-100/70 dark:from-black/60 via-transparent to-neutral-100/70 dark:to-black/60 pointer-events-none z-10 transition-colors duration-500" />
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-100/50 dark:from-black/40 via-transparent to-neutral-100/50 dark:to-black/40 pointer-events-none z-10 transition-colors duration-500" />

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay z-20" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
    </div>
  );
};

export default BackgroundFilmStrips;
