import { useState, useEffect, useCallback } from 'react';

export type AppRoute = 'home' | 'orcamentos' | 'admin';

export interface RouterState {
  currentPath: string;
  activeRoute: AppRoute;
  params: URLSearchParams;
  navigate: (to: string, replace?: boolean) => void;
}

const normalizePath = (rawPath: string): string => {
  try {
    const decoded = decodeURIComponent(rawPath || '/');
    const clean = decoded.replace(/\/+$/, '') || '/';
    return clean.toLowerCase();
  } catch {
    return (rawPath || '/').toLowerCase();
  }
};

const resolveRoute = (path: string): AppRoute => {
  const normalized = normalizePath(path);
  
  if (
    normalized === '/orcamentos' || 
    normalized === '/orçamentos' || 
    normalized.startsWith('/orcamentos/') || 
    normalized.startsWith('/orçamentos/') ||
    normalized === '/quote'
  ) {
    return 'orcamentos';
  }

  if (normalized === '/admin' || normalized.startsWith('/admin/')) {
    return 'admin';
  }

  return 'home';
};

export const useRouter = (): RouterState => {
  const [currentPath, setCurrentPath] = useState<string>(() => 
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  const [searchParams, setSearchParams] = useState<URLSearchParams>(() =>
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
