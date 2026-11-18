import type { CSSProperties } from 'react';
import { ArrowUpRight, Globe, Instagram, RotateCcw } from 'lucide-react';
import {
  BRAND_CONTACT,
  buildWhatsAppBudgetUrl,
  navigateToBudgetCategories,
} from '../../data/portfolioData';
import { navigateToSection } from '../../hooks/useExperienceStore';

export function FooterCTA() {
  return (
    <section
      id="act-cta"
      aria-label="Contato e início de projeto"
      className="relative z-10 min-h-[100svh] flex flex-col items-center justify-end px-4 sm:px-8 pt-[28vh] md:pt-[34vh] pb-10 sm:pb-16"
    >
      {/* Top area intentionally open: WebGL particles reassemble the EA•REC logo here */}
      <div
        data-reveal
        className="pointer-events-auto w-full max-w-3xl bg-[#0E0D0C]/85 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-12 text-center shadow-[0_0_90px_rgba(255,8,41,0.14)]"
      >
        <p
          data-stagger
          style={{ '--stagger-delay': '80ms' } as CSSProperties}
          className="type-eyebrow text-[#FF3852]"
        >
          PRÓXIMO PASSO
        </p>

        <h2
          data-stagger
          style={{ '--stagger-delay': '160ms' } as CSSProperties}
          className="type-title mt-3 text-white"
        >
          Sua marca ou seu evento merece ser visto nesse nível.
        </h2>

        <p
          data-stagger
          style={{ '--stagger-delay': '240ms' } as CSSProperties}
          className="type-lead mt-4 max-w-xl mx-auto"
        >
          Conte pra gente o que você precisa gravar ou fotografar. Montamos uma proposta
          sob medida com o formato ideal para o seu objetivo.
        </p>

        <div
          data-stagger
          style={{ '--stagger-delay': '320ms' } as CSSProperties}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5"
        >
          <a
            href={buildWhatsAppBudgetUrl()}
            onClick={(e) => {
              e.preventDefault();
              navigateToBudgetCategories();
            }}
            className="rec-glow-surface w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#D6001C] text-white font-mono text-xs sm:text-sm font-bold tracking-[0.18em] uppercase transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-rec-pulse" />
            <span>Solicitar Orçamento Agora</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={() => navigateToSection('act-portal')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/15 text-[#F5F3F1] font-mono text-xs tracking-widest uppercase hover:border-white/35 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Voltar ao Topo</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#B3ADA3]">
          <a
            href={BRAND_CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Instagram className="w-3.5 h-3.5 text-[#FF0829]" />
            <span>{BRAND_CONTACT.handle}</span>
          </a>

          <a
            href={BRAND_CONTACT.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[#FF0829]" />
            <span>{BRAND_CONTACT.websiteLabel}</span>
          </a>

          <span className="text-[#8A847A]">
            © {new Date().getFullYear()} EA REC MIDIA
          </span>
        </div>
      </div>
    </section>
  );
}
