import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Instagram } from 'lucide-react';
import {
  BRAND_CONTACT,
  buildWhatsAppBudgetUrl,
  navigateToBudgetCategories,
} from '../../data/portfolioData';
import { experienceState } from '../../hooks/useExperienceStore';

export function Header() {
  const [isLogoExpanded, setIsLogoExpanded] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const expanded =
        experienceState.scrollY > 40 || experienceState.scrollProgress > 0.015;
      setIsLogoExpanded((prev) => (prev === expanded ? prev : expanded));
    };

    checkScroll();
    gsap.ticker.add(checkScroll);
    return () => {
      gsap.ticker.remove(checkScroll);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-4 pointer-events-none">
      <div
        className={`max-w-7xl mx-auto flex items-center gap-4 transition-all duration-300 ${
          isLogoExpanded ? 'justify-center sm:justify-end' : 'justify-end'
        }`}
      >
        {/* Actions: Instagram + Budget CTA */}
        <div className="pointer-events-auto flex items-center gap-2.5">
          <a
            href={BRAND_CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0E0D0C]/85 backdrop-blur-md border border-white/10 text-xs font-mono text-[#B3ADA3] hover:text-white hover:border-white/25 transition-colors"
          >
            <Instagram className="w-3.5 h-3.5 text-[#FF0829]" />
            <span>{BRAND_CONTACT.handle}</span>
          </a>

          <a
            href={buildWhatsAppBudgetUrl()}
            onClick={(e) => {
              e.preventDefault();
              navigateToBudgetCategories();
            }}
            className="rec-glow-surface inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D6001C] text-white text-xs font-mono font-semibold tracking-wider uppercase transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-rec-pulse" />
            <span>Solicitar Orçamento</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
