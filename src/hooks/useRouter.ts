/**
 * useRouter.ts
 * ------------
 * Hook de Roteamento SPA nativo (Single Page Application) customizado para a EAREC.
 * 
 * - 0ms de latência (transições instantâneas em memória).
 * - Sem recarregamento de página (pushState / popState).
 * - Suporta rotas fixas e rotas dinâmicas para qualquer página futura (ex: /portfolio, /sobre, etc.).
 * 
 * ROTAS PRINCIPAIS:
 * - '/inicio' (e aliases '/', '/home', '/início'): Landing minimalista
 * - '/orcamento': Configurador e simulador de serviços
 * - '/resumo': Tela de revisão do orçamento
 * - '/sucesso': Confirmação e link para WhatsApp
 * - '/portfolio': Galeria e vitrine de produções
 * - '/admin': Painel administrativo protegido
 */

import { useState, useEffect, useCallback } from 'react';

/** Tipos de rotas reconhecidas */
export type AppRoute = 'inicio' | 'orcamento' | 'resumo' | 'sucesso' | 'admin' | 'portfolio' | string;

export interface RouterState {
  currentPath: string;
  activeRoute: AppRoute;
  params: URLSearchParams;
  navigate: (to: string, replace?: boolean) => void;
}

/**
 * Normaliza caminhos da URL:
 * - Decodifica acentuações (ex: '/orçamento' -> '/orçamento', '/início' -> '/início')
 * - Remove barras duplicadas ou trailing slashes (ex: '/inicio/' -> '/inicio')
 * - Converte para minúsculas
 */
const normalizePath = (rawPath: string): string => {
  try {
    const decoded = decodeURIComponent(rawPath || '/');
    const clean = decoded.replace(/\/+$/, '') || '/';
    return clean.toLowerCase();
  } catch {
    return (rawPath || '/').toLowerCase();
  }
};

/**
 * Mapeia o caminho da URL para uma das rotas válidas
 */
const resolveRoute = (path: string): AppRoute => {
  const normalized = normalizePath(path);

  // Início / Home
  if (normalized === '/' || normalized === '/inicio' || normalized === '/início' || normalized === '/home') {
    return 'inicio';
  }

  // Resumo do Orçamento
  if (normalized === '/resumo' || normalized === '/orcamento/resumo' || normalized === '/orçamento/resumo') {
    return 'resumo';
  }

  // Confirmação / Sucesso
  if (normalized === '/sucesso' || normalized === '/orcamento/sucesso' || normalized === '/orçamento/sucesso') {
    return 'sucesso';
  }

  // Configurador de Orçamento (aceita com/sem acento, singular ou plural)
  if (
    normalized === '/orcamento' ||
    normalized === '/orçamento' ||
    normalized === '/orcamentos' ||
    normalized === '/orçamentos' ||
    normalized.startsWith('/orcamento/') ||
    normalized.startsWith('/orçamento/') ||
    normalized === '/quote'
  ) {
    return 'orcamento';
  }

  // Portfólio
  if (normalized === '/portfolio' || normalized === '/portfólio') {
    return 'portfolio';
  }

  // Rota Administrativa
  if (normalized === '/admin' || normalized.startsWith('/admin/')) {
    return 'admin';
  }

  // Rota dinâmica/slug para qualquer página futura (ex: /sobre, /contato, /termos)
  const customSlug = normalized.replace(/^\//, '');
  return customSlug || 'inicio';
};

const getInitialPath = (): string => {
  if (typeof window === 'undefined') return '/inicio';
  if (window.location.hash) {
    const hashClean = window.location.hash.replace(/^#\/?/, '/');
    if (hashClean && hashClean !== '/') return hashClean;
  }
  return window.location.pathname || '/inicio';
};

export const useRouter = (): RouterState => {
  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);

  const [searchParams, setSearchParams] = useState<URLSearchParams>(() =>
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
  );

  // Ouve evento popstate do navegador (botão voltar / avançar)
  useEffect(() => {
    const handlePopState = () => {
      let p = window.location.pathname;
      if (window.location.hash) {
        const hashClean = window.location.hash.replace(/^#\/?/, '/');
        if (hashClean && hashClean !== '/') p = hashClean;
      }
      setCurrentPath(p);
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  /**
   * Navega programaticamente sem recarregar a página
   */
  const navigate = useCallback((to: string, replace: boolean = false) => {
    if (typeof window === 'undefined') return;

    const url = new URL(to, window.location.origin);
    const targetPath = url.pathname;
    const targetSearch = url.search;

    if (replace) {
      window.history.replaceState({}, '', `${targetPath}${targetSearch}`);
    } else {
      window.history.pushState({}, '', `${targetPath}${targetSearch}`);
    }

    setCurrentPath(targetPath);
    setSearchParams(new URLSearchParams(targetSearch));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const activeRoute = resolveRoute(currentPath);

  return {
    currentPath,
    activeRoute,
    params: searchParams,
    navigate
  };
};
