// ============================================================================
// EAREC AUDIOVISUAL - FUNÇÕES UTILITÁRIAS ESSENCIAIS (utils.ts)
// ============================================================================
// Olá, dev! 👋
// Aqui residem as funções auxiliares puras mais utilizadas em todo o projeto:
// 1. Merge inteligente de classes Tailwind com tratamento de precedência (`cn`).
// 2. Formatação brasileira de valores monetários em R$ (`formatCurrency`).
// 3. Delays assíncronos (`delay`) para transições fluidas e sensações visuais refinadas.
// 4. Scroll cinematográfico suave com curva cúbica (`smoothScrollTo`).
// 5. Geração de código de pedido amigável no formato `EA-XXXX` (`generateOrderCode`).
// ============================================================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utilitário para combinar classes Tailwind de forma segura (merge de conflitos).
 * Usa `clsx` para suportar condicionais e objetos, e `twMerge` para sobrescrever
 * classes conflitantes (ex: `p-2` vs `p-4`) sem bugs de especificidade CSS.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatador de moeda BRL (Real Brasileiro).
 * Estilo "Contábil" limpo para interfaces financeiras.
 * Exemplo: 1250 vira "R$ 1.250,00".
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Delay assíncrono para simular loading ou steps de animação.
 * Útil para aguardar encerramento de transições visuais antes de mudar de tela.
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Rolagem Suave Cinematográfica
 * -----------------------------
 * Substitui o scrollIntoView nativo por uma animação controlada via JS.
 * Permite controlar a duração e usar curvas de aceleração (easing) mais elegantes.
 * 
 * @param elementId ID do elemento alvo
 * @param duration Duração em milissegundos (padrão: 1200ms = 1.2s para suavidade)
 */
export const smoothScrollTo = (elementId: string, duration: number = 1200) => {
    const target = document.getElementById(elementId);
    if (!target) return;

    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    // Offset para centralizar visualmente (levemente acima do centro real para foco)
    const offsetPosition = targetPosition - (window.innerHeight / 2) + (target.offsetHeight / 2);
    const startPosition = window.pageYOffset;
    const distance = offsetPosition - startPosition;
    let startTime: number | null = null;

    // Função de Easing: EaseInOutCubic (Movimento lento no início, rápido no meio, lento no fim)
    function easeInOutCubic(t: number, b: number, c: number, d: number) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    function animation(currentTime: number) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
        
        window.scrollTo(0, run);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
};

/**
 * Gera um código de pedido aleatório elegante, exclusivo e fácil de ler (ex: EA-7842).
 * Evita sequências confusas ou caracteres ilegíveis para proporcionar uma leitura rápida e clara
 * na comunicação entre o cliente e o fotógrafo/videomaker.
 */
export const generateOrderCode = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `EA-${randomNum}`;
};
