/**
 * useRouter.ts
 * ------------
 * Hook de Roteamento SPA (Single Page Application) customizado para a EAREC.
 * 
 * OBJETIVO:
 * Gerenciar rotas no navegador sem necessidade de bibliotecas pesadas externas,
 * garantindo compatibilidade total com React 19, zero conflitos com Vite e Vercel,
 * e suporte nativo ao histórico do navegador (botões avançar/voltar e popstate).
 * 
 * ROTAS SUPORTADAS:
 * - '/' ou '/home': Página inicial com o vídeo cinematográfico (HomeView).
 * - '/orcamentos' ou '/orçamentos': Sistema de orçamentação e simulação interativa.
 * - '/admin': Painel administrativo protegido para configuração de preços.
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Tipos de rotas principais da aplicação
 */
export type AppRoute = 'home' | 'orcamentos' | 'admin';

/**
 * Interface exposta pelo hook para os componentes consumidores
 */
export interface RouterState {
  /** Caminho atual no navegador (ex: '/orcamentos') */
  currentPath: string;
  /** Identificador simplificado da rota ativa */
  activeRoute: AppRoute;
  /** Objeto de parâmetros de busca da URL (ex: ?cat=wedding) */
  params: URLSearchParams;
  /** Função de navegação sem reload de página */
  navigate: (to: string, replace?: boolean) => void;
}

/**
 * Normaliza o caminho bruto da URL:
 * - Decodifica caracteres URI (tratando acentos como em '/orçamentos')
 * - Remove barras duplicadas ou trailing slashes (ex: '/home/' -> '/home')
 * - Converte para caixa baixa
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
 * Mapeia o caminho da URL para a rota de domínio da aplicação
 */
const resolveRoute = (path: string): AppRoute => {
  const normalized = normalizePath(path);
  
  // Rotas de Orçamento (aceita tanto com acento quanto sem)
  if (
    normalized === '/orcamentos' || 
    normalized === '/orçamentos' || 
    normalized.startsWith('/orcamentos/') || 
    normalized.startsWith('/orçamentos/') ||
    normalized === '/quote'
  ) {
    return 'orcamentos';
  }

  // Rota Administrativa
  if (normalized === '/admin' || normalized.startsWith('/admin/')) {
    return 'admin';
  }

  // Padrão: Página Inicial (Home)
  return 'home';
};

/**
 * Hook principal de roteamento da aplicação
 */
export const useRouter = (): RouterState => {
  // Caminho atual inicializado direto do window.location
  const [currentPath, setCurrentPath] = useState<string>(() => 
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  // Parâmetros de consulta (Query params)
  const [searchParams, setSearchParams] = useState<URLSearchParams>(() =>
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
  );

  // Efeito para escutar o evento 'popstate' do navegador (botão voltar / avançar)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  /**
   * Navega para uma nova rota programaticamente utilizando a History API do HTML5.
   * Evita recarregamento total da página e atualiza a barra de endereço instantaneamente.
   * 
   * @param to Caminho de destino (ex: '/orcamentos' ou '/orcamentos?cat=commercial')
   * @param replace Se verdadeiro, substitui a entrada no histórico em vez de adicionar
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
