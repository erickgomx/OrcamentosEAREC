// ============================================================================
// EAREC AUDIOVISUAL - CONTEXTO GLOBAL DE TEMA (DARK / LIGHT MODE)
// ============================================================================
// Olá, dev! 👋
// Este contexto gerencia o tema visual da aplicação EAREC (Modo Escuro / Modo Claro).
// 
// CARACTERÍSTICAS DESTA IMPLEMENTAÇÃO:
// 1. O padrão institucional é o Modo Escuro Cinematográfico ('dark'), alinhado
//    à identidade da produtora (pretos profundos, destaques vermelhos e dourados).
// 2. Persiste a preferência do usuário no `localStorage` sob a chave 'earec_theme'.
// 3. Modifica as classes 'dark' e 'light' na tag raiz `<html>` para compatibilidade
//    perfeita com o Tailwind CSS `darkMode: 'class'`.
// 4. Atualiza dinamicamente a meta tag `<meta name="theme-color">` para colorir
//    a barra de navegação dos celulares (iOS Safari e Android Chrome).
// ============================================================================

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = 'earec_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Provedor do tema global que envolve a aplicação raiz (`index.tsx`).
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicialização preguiçosa (lazy initial state) lendo do localStorage se disponível
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      // Padrão do sistema EAREC é Dark Mode cinematográfico
      return 'dark';
    } catch {
      return 'dark';
    }
  });

  /**
   * Sincroniza a classe CSS na tag <html> e a cor do tema na barra do navegador móvel
   */
  const applyThemeToDOM = (targetTheme: Theme) => {
    const root = document.documentElement;
    if (targetTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    // Atualiza a meta tag de cor da barra do navegador (mobile)
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', targetTheme === 'dark' ? '#080808' : '#F7F7F5');
  };

  // Observa mudanças de tema e persiste no DOM e no localStorage
  useEffect(() => {
    applyThemeToDOM(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignora falha em caso de armazenamento bloqueado (ex: navegação privada estrita)
    }
  }, [theme]);

  // Alterna diretamente entre modo escuro e claro
  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Define um tema específico diretamente
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const isDark = theme === 'dark';

  // Memoriza o valor do contexto para evitar re-renderizações desnecessárias de componentes filhos
  const value = useMemo(
    () => ({
      theme,
      isDark,
      toggleTheme,
      setTheme,
    }),
    [theme, isDark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Hook personalizado para consumir o estado e ações do tema em qualquer componente.
 * Dispara erro explicativo caso seja invocado fora de um `<ThemeProvider>`.
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser utilizado dentro de um ThemeProvider');
  }
  return context;
};
